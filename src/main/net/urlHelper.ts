import Configuration from "../util/configuration.js";
import {
	default as Environment,
	EnvironmentConfig,
	HostConfig,
} from "./environment.js";
import { Constructor } from "../util/objects.js";
import {
	default as DatumFilter,
	DatumFilterKeys,
	DatumFilterPropertyNamesSet,
} from "../domain/datumFilter.js";

/**
 * An object constructor of `UrlHelper` class.
 */
type UrlHelperConstructor = Constructor<UrlHelper>;

/**
 * A utility class for helping to compose SolarNet URLs for the REST API.
 *
 * The various URL methods in extending classes are meant to support both explicit
 * arguments representing URL parameters, or "fall back" to the `parameters`
 * property of this class. The `parameters` property can be useful when a helper
 * instance is to be reused many times with the same general parameters, for example
 * a set of node or source IDs.
 *
 * This class is somewhat abstract and meant to be extended with additional API methods.
 */
class UrlHelper {
	/** The network environment (host, port, and so on). */
	readonly #environment: EnvironmentConfig & HostConfig;

	/** Parameters for URL variables.  */
	readonly #parameters: Configuration;

	/**
	 * Constructor.
	 *
	 * @param environment - the optional initial environment to use;
	 *        if a non-`Environment` object is passed then the properties of that object will
	 *        be used to construct a new `Environment` instance
	 */
	constructor(environment?: HostConfig) {
		const env =
			environment instanceof Environment
				? (environment as typeof Environment)
				: new Environment(environment);

		this.#environment = env;

		this.#parameters = new Configuration();
	}

	/**
	 * Get the environment configuration.
	 */
	get environment(): EnvironmentConfig & HostConfig {
		return this.#environment;
	}

	/**
	 * Get a parameters object that can be used to hold URL variables.
	 */
	get parameters(): Configuration {
		return this.#parameters;
	}

	/**
	 * Get or set an environment parameter.
	 *
	 * This is a shortcut for calling {@link Util.Configuration#value} on the
	 * `environment` object.
	 *
	 * @param key - the environment parameter name to get
	 * @param val - the optional value to set
	 * @returns when called as a getter, the environment parameter value;
	 *          when called as a setter, the environment object
	 */
	env(key: string): any;
	env(key: string, newValue: any): EnvironmentConfig & HostConfig;
	env(key: string, newValue?: any): any | (EnvironmentConfig & HostConfig) {
		return this.#environment.value(key, newValue);
	}

	/**
	 * Get or set a parameter.
	 *
	 * This is a shortcut for calling {@link Util.Configuration#value} on the
	 * `parameters` object.
	 *
	 * @param key - the parameter name to get
	 * @param val - the optional value to set
	 * @returns when called as a getter, the parameter value;
	 *          when called as a setter, the parameters object
	 */
	parameter(key: string): any;
	parameter(key: string, newValue: any): Configuration;
	parameter(key: string, newValue?: any): any | Configuration {
		return this.#parameters.value(key, newValue);
	}

	/**
	 * Get a parameter, with plural suffix array support.
	 *
	 * This method will first look for a parameter named exactly `key`, and if found
	 * return that. Otherwise it will look for an array parameter named `key` with
	 * `s` appended, and if found return the first element from that array. For example:
	 *
	 * ```
	 * const helper = new UrlHelper();
	 * helper.parameter('nodeIds', [1, 2, 3]);
	 *
	 * helper.param('nodeIds'); // [1, 2, 3]
	 * helper.param('nodeId');  // 1
	 * ```
	 *
	 * If `key` already ends in `s`, then a desired array result is assumed. If a
	 * value is not found for the parameter, then `s` is removed from `key` and
	 * that parameter value is returned, as an array if it is not already. For example:
	 *
	 * ```
	 * const helper = new UrlHelper();
	 * helper.parameter('nodeId', 1);
	 *
	 * helper.param('nodeIds'); // [1]
	 * helper.param('nodeId');  // 1
	 * ```
	 *
	 * @param key - the parameter name to get
	 * @returns the parameter value
	 */
	param<T>(key: string): T | undefined {
		let val = this.#parameters.value(key);
		if (val !== undefined) {
			return val;
		}
		if (key.endsWith("s")) {
			// look for singular value; return as array
			val = this.#parameters.value(key.substring(0, key.length - 1));
			if (Array.isArray(val)) {
				return val as T;
			} else if (val !== undefined) {
				return [val] as T;
			}
		} else {
			val = this.#parameters.value(key + "s");
			if (Array.isArray(val) && val.length) {
				return val[0];
			}
		}
		return undefined;
	}

	/**
	 * Get a URL for just the SolarNet host, without any path.
	 *
	 * This method constructs an absolute URL based on the following properties configured
	 * on this instance's {@link Net.Environment}:
	 *
	 *  1. If {@link Net.EnvironmentConfig#useTls environment.useTls()} returns `true` then
	 *     use HTTPS as the protocol, otherwise HTTP.
	 *  2. Use `host` for the host name or IP address, unless `proxyHost` is available.
	 *  3. Use `port` for the port, unless `proxyPort` is available. If neither are available, use `443` for
	 *     HTTPS or `80` for HTTP.
	 *
	 * @returns the URL to the SolarNet host
	 */
	hostUrl(): string {
		const tls = this.environment.useTls();
		const host =
			this.environment.value("proxyHost") ||
			this.environment.value("host");
		const port = +(
			this.environment.value("proxyPort") ||
			this.environment.value("port")
		);
		let url = "http" + (tls ? "s" : "") + "://" + host;
		if (
			(tls && port > 0 && port !== 443) ||
			(!tls && port > 0 && port !== 80)
		) {
			url += ":" + port;
		}
		return url;
	}

	/**
	 * Get a URL for just the SolarNet host using the WebSocket protocol, without any path.
	 *
	 * This method constructs an absolute URL based on the following properties configured
	 * on this instance's {@link Net.Environment}:
	 *
	 *  1. If {@link Net.EnvironmentConfig#useTls environment.useTls()} returns `true` then
	 *     use WSS as the protocol, otherwise WS.
	 *  2. Use `host` for the host name or IP address, unless `proxyHost` is available.
	 *  3. Use `port` for the port, unless `proxyPort` is available. If neither are available, use `443` for
	 *     WSS or `80` for WS.
	 *
	 * @returns the URL to the SolarNet host WebSocket
	 */
	hostWebSocketUrl(): string {
		const tls = this.environment.useTls();
		const host =
			this.environment.value("proxyHost") ||
			this.environment.value("host");
		const port = +(
			this.environment.value("proxyPort") ||
			this.environment.value("port")
		);
		let url = "ws" + (tls ? "s" : "") + "://" + host;
		if (
			(tls && port > 0 && port !== 443) ||
			(!tls && port > 0 && port !== 80)
		) {
			url += ":" + port;
		}
		return url;
	}

	/**
	 * Get the base URL to the REST API.
	 *
	 * @returns the base URL to the REST API
	 */
	baseUrl() {
		// This implementation is a stub, meant for subclasses to override.
		return this.hostUrl();
	}

	/**
	 * Replace occurances of URL template variables with values from the `parameters`
	 * property and append to the host URL.
	 *
	 * This method provides a way to resolve an absolute URL based on the configured
	 * environment and parameters on this object.
	 *
	 * @param template - a URL path template
	 * @returns an absolute URL
	 * @see {@link Net.UrlHelper#resolveTemplateUrl}
	 */
	resolveTemplatePath(template: string): string {
		return this.hostUrl() + this.resolveTemplateUrl(template);
	}

	/**
	 * Replace occurances of URL template variables with values from the `parameters`
	 * property.
	 *
	 * URL template variables are specified as `{<em>name</em>}`. The variable
	 * will be replaced by the value associated with property `name` in the
	 * `parameters` object. The value will be URI encoded.
	 *
	 * @param template - a URL template
	 * @returns the URL with template variables resolved
	 */
	resolveTemplateUrl(template: string): string {
		return UrlHelper.resolveTemplateUrl(template, this.#parameters);
	}

	/**
	 * Replace occurances of URL template variables with values from a parameter object.
	 *
	 * URL template variables are specified as `{<em>name</em>}`. The variable
	 * will be replaced by the value associated with property `name` in the
	 * provided parameter object. The value will be URI encoded.
	 *
	 * Any occurances of `//` after replacing template variables will be reduced to `/`.
	 *
	 * @param template - a URL template
	 * @param params - an object whose properties should serve as template variables
	 * @returns the URL
	 */
	static resolveTemplateUrl(template: string, params: Record<string, any>) {
		return template
			.replace(/\{([^}]+)\}/g, function (match, variableName) {
				const variableValue = params[variableName];
				return variableValue !== undefined
					? encodeURIComponent(variableValue)
					: "";
			})
			.replaceAll("//", "/");
	}

	/**
	 * Get a new configured with parameters of this instance.
	 *
	 * This will look for the following parameters:
	 *
	 *  * `nodeIds`
	 *  * `sourceIds`
	 *
	 * @returns the filter
	 */
	datumFilter(): DatumFilter {
		const filter = new DatumFilter();

		// iterate over parameters to maintain insertion order
		for (const [k, v] of this.#parameters.props) {
			if (DatumFilterPropertyNamesSet.has(k as DatumFilterKeys)) {
				filter[k as DatumFilterKeys] = v;
			}
		}

		return filter;
	}
}

export default UrlHelper;
export { type UrlHelperConstructor };
