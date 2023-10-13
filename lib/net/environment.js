import Configuration from "../util/configuration.js";
/**
 * Normailze a protocol value.
 *
 * This method is used to normalize protocol values which might come from a `Location`
 * object and thus contain a trailing colon.
 *
 * @param val - the protocol value to normalize
 * @returns the normalized protocol value
 */
function normalizedProtocol(val) {
    if (!val) {
        return "https";
    }
    return val.replace(/:$/, "");
}
/**
 * Normalize the environment configuration.
 *
 * Passing a browser `Location` object, like `window.location`, is supported. The
 * `protocol`, `hostname`, and `port` values will be used.
 *
 * @param config - the initial configuration
 * @returns a new object with normalized configuration values
 */
function normalizedConfig(config) {
    const result = Object.assign({
        host: "data.solarnetwork.net",
    }, config);
    result.protocol = normalizedProtocol(result.protocol);
    result.port = result.port || (result.protocol === "https" ? 443 : 80);
    if (result.port && config?.hostname) {
        result.host = config.hostname;
    }
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
    constructor(config) {
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
export default EnvironmentConfig;
export { EnvironmentConfig };
//# sourceMappingURL=environment.js.map