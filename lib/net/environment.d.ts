import Configuration from "../util/configuration.js";
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
 * A network environment configuration utility object.
 *
 * This extends {@link Util.Configuration} to add support for standard properties
 * needed to access the SolarNetwork API, such as host and protocol values.
 */
declare class EnvironmentConfig extends Configuration {
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
    constructor(config?: Partial<HostConfig>);
    /**
     * Check if TLS is in use via the `https` protocol.
     *
     * @returns {boolean} `true` if the `protocol` is set to `https`
     */
    useTls(): boolean;
}
/** Environment constructor API. */
interface EnvironmentConstructor {
    /**
     * Constructor.
     * @param config - an optional set of properties to start with
     */
    new (config?: Partial<HostConfig>): EnvironmentConfig & HostConfig;
}
declare const _default: EnvironmentConfig & HostConfig & EnvironmentConstructor;
export default _default;
export { EnvironmentConfig, type HostConfig, type EnvironmentConstructor };
//# sourceMappingURL=environment.d.ts.map