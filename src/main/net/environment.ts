import Configuration from "../util/configuration.js";

/**
 * Network environment configuration.
 */
interface HostConfigInfo {
	/** The hostname. */
	host: string;

	/** The protocol. */
	protocol: string;

	/**
	 * The port number.
	 *
	 * Can be a number or string, to support a browser `Location` object.
	 */
	port?: number | string;

	/** An optional proxy URL prefix, for example `https://query.solarnetwork.net/1m`. */
	proxyUrlPrefix?: string;

	/** Arbitrary additional properties. */
	[k: string]: any;
}

/**
 * Network environment configuration.
 */
interface HostConfig {
	/** The hostname. */
	host: string;

	/** The protocol. */
	protocol: string;

	/** The port number. */
	port?: number;

	/** An optional proxy URL prefix, for example `https://query.solarnetwork.net/1m`. */
	proxyUrlPrefix?: string;

	/** Arbitrary additional properties. */
	[k: string]: any;
}

/**
 * Normailze a protocol value.
 *
 * This method is used to normalize protocol values which might come from a `Location`
 * object and thus contain a trailing colon.
 *
 * @param val - the protocol value to normalize
 * @returns the normalized protocol value
 */
function normalizedProtocol(val?: string): string {
	if (!val) {
		return "https";
	}
	return val.replace(/:$/, "");
}

/**
 * Normalize the environment configuration.
 *
 * Passing a browser `Location` object, like `window.location`, or a `URL`, is supported. The
 * `protocol`, `hostname`, and `port` values will be used.
 *
 * @param config - the initial configuration
 * @returns a new object with normalized configuration values
 */
function normalizedConfig(config?: Partial<HostConfigInfo>): HostConfig {
	const result: HostConfig = Object.assign({} as HostConfig, config);
	result.host = config?.hostname || config?.host || "data.solarnetwork.net";
	result.protocol = normalizedProtocol(config?.protocol);
	result.port =
		Number(config?.port) || (result.protocol === "https" ? 443 : 80);
	return result;
}

/**
 * A network environment configuration utility object.
 *
 * This extends {@link Util.Configuration} to add support for standard properties
 * needed to access the SolarNetwork API, such as host and protocol values.
 */
class EnvironmentConfig extends Configuration {
	/**
	 * Constructor.
	 *
	 * This will define the following default properties, if not supplied on the
	 * `config` argument:
	 *
	 * <dl>
	 * <dt>host</dt><dd>`data.solarnetwork.net`</dd>
	 * <dt>protocol</dt><dd>`https`</dd>
	 * <dt>port</dt><dd>`443`</dd>
	 * </dl>
	 *
	 * These properties correspond to those on the `window.location` object when
	 * running in a browser. Thus to construct an environment based on the location
	 * of the current page you can create an instance like this:
	 *
	 * ```
	 * const env = new Environment(window.location);
	 * ```
	 *
	 * @param config - an optional set of properties to start with
	 */
	constructor(config?: Partial<HostConfigInfo>) {
		super(normalizedConfig(config));
	}

	/**
	 * Check if TLS is in use via the `https` protocol.
	 *
	 * @returns {boolean} `true` if the `protocol` is set to `https`
	 */
	useTls() {
		return this.value("protocol") === "https";
	}
}

/** Environment constructor API. */
interface EnvironmentConstructor {
	/**
	 * Constructor.
	 * @param config - an optional set of properties to start with
	 */
	new (config?: Partial<HostConfigInfo>): EnvironmentConfig & HostConfig;
}

export default EnvironmentConfig as unknown as EnvironmentConfig &
	HostConfig &
	EnvironmentConstructor;
export {
	EnvironmentConfig,
	type HostConfig,
	type HostConfigInfo,
	type EnvironmentConstructor,
};
