import Configuration from "../util/configuration.js";
import {
	default as Environment,
	EnvironmentConfig,
	HostConfig,
	HostConfigInfo,
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
 * The maximum string length allowed for template expansion.
 *
 * This limit is used to mitigate against "Polynomial regular expression used on uncontrolled data"
 * style linter warnings.
 */
const TEMPLATE_MAX_LENGTH: number = 1024;

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
	 * @param environment the optional initial environment to use;
	 *        if a non-`Environment` object is passed then the properties of that object will
	 *        be used to construct a new `Environment` instance
	 */
	constructor(environment?: HostConfigInfo) {
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
	 * Get an environment parameter.
	 *
	 * This is a shortcut for calling {@link Util.Configuration#value} on the
	 * `environment` object.
	 *
	 * @param key the environment parameter name to get
	 * @returns the environment parameter value
	 */
	env(key: string): any;

	/**
	 * Set an environment parameter.
	 *
	 * This is a shortcut for calling {@link Util.Configuration#value} on the
	 * `environment` object.
	 *
	 * @param key the environment parameter name to set
	 * @param val the value to set
	 * @returns the environment object
	 */
	env(key: string, val: any): EnvironmentConfig & HostConfig;

	env(key: string, val?: any): any | (EnvironmentConfig & HostConfig) {
		return this.#environment.value(key, val);
	}

	/**
	 * Get a parameter.
	 *
	 * This is a shortcut for calling {@link Util.Configuration#value} on the
	 * `parameters` object.
	 *
	 * @param key the parameter name to get
	 * @returns the parameter value
	 */
	parameter(key: string): any;

	/**
	 * Set a parameter.
	 *
	 * This is a shortcut for calling {@link Util.Configuration#value} on the
	 * `parameters` object.
	 *
	 * @param key the parameter name to set
	 * @param val the value to set
	 * @returns the parameters object
	 */
	parameter(key: string, val: any): Configuration;

	parameter(key: string, val?: any): any | Configuration {
		return this.#parameters.value(key, val);
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
	 * @template T the expected type
	 * @param key the parameter name to get
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
	 *  2. Use `host` for the host name or IP address.
	 *  3. Use `port` for the port if available and not the standard `443` for
	 *     HTTPS or `80` for HTTP.
	 *
	 * @returns the URL to the SolarNet host
	 */
	hostUrl(): string {
		const tls = this.#environment.useTls();
		const host = this.#environment.host;
		const port = +(this.#environment.port || 0);
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
	 * Get a URL for just the SolarNet host, without any path to be used for actual requests.
	 *
	 * Calls the {@link Net.UrlHelper.toRequestUrl toRequestUrl()} with
	 * {@link Net.UrlHelper.hostUrl hostUrl()} as the argument.
	 *
	 * @returns the URL to make reqeusts to the SolarNet host
	 */
	hostRequestUrl(): string {
		return this.toRequestUrl(this.hostUrl());
	}

	/**
	 * Get the URL to actually request, incorporating the environment's `proxyUrlPrefix` if available.
	 *
	 * If a {@link Net.HostConfig#proxyUrlPrefix environment.proxyUrlPrefix} value is configured,
	 * this will re-write the URL to use that host prefix, otherwise `url` will be returned
	 * unchanged.
	 *
	 * @returns the URL to make reqeusts to the SolarNet host
	 */
	toRequestUrl(url: string) {
		const proxyPrefix = this.#environment.proxyUrlPrefix;
		if (proxyPrefix) {
			url = url.replace(/^[^:]+:\/\/[^/]+/, proxyPrefix);
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
	 *  2. Use `host` for the host name or IP address.
	 *  3. Use `port` for the port if available and not the standard `443` for
	 *     WSS or `80` for WS.
	 *
	 * @returns the URL to the SolarNet host WebSocket
	 */
	hostWebSocketUrl(): string {
		const tls = this.#environment.useTls();
		const host = this.#environment.host;
		const port = +(this.#environment.port || 0);
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
	 * @throws Error if `template` length is too long
	 */
	static resolveTemplateUrl(template: string, params: Record<string, any>) {
		if (template.length > TEMPLATE_MAX_LENGTH) {
			throw new Error(
				`The template argument must be no more than ${TEMPLATE_MAX_LENGTH} characters.`
			);
		}
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
	 * Get a new `DatumFilter` configured with parameters of this instance.
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
