import Configuration from '../util/configuration';

/**
 * An environment configuration utility object.
 *
 * This extends <code>Configuration</code> to add support for standard properties
 * needed to access the SolarNetwork API, such as host and protocol values.
 *
 * @extends Configuration
 */
class Environment extends Configuration {

	/**
	 * Constructor.
	 *
	 * This will define the following default properties, if not supplied on the
	 * <code>config</code> argument:
	 *
	 * <dl>
	 * <dt>host</dt><dd><code>data.solarnetwork.net</code></dd>
	 * <dt>protocol</dt><dd><code>https</code></dd>
	 * <dt>port</dt><dd><code>443</code></dd>
	 * </dl>
	 *
	 * @param {Object} [config] an optional set of properties to start with
	 */
	constructor(config) {
		super(Object.assign({
			protocol: 'https',
			host: 'data.solarnetwork.net',
			port: (config && config.port ? config.port : (config && config.protocol ? (config.protocol === 'https' ? 443 : 80) : 443)),
		}, config));
	}

    /**
	 * Check if TLS is in use via the <code>https</code> protocol.
	 *
     * @returns {boolean} <code>true</code> if the <code>protocol</code> is set to <code>https</code>
     */
	useTls() {
		return (this.value('protocol') === 'https');
	}

}

export default Environment;
