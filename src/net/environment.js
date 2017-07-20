/** @module net */

import Configuration from '../util/configuration';

/**
 * An environment configuration utility object.
 *
 * This extends {@link module:util~Configuration} to add support for standard properties
 * needed to access the SolarNetwork API, such as host and protocol values.
 *
 * @extends module:util~Configuration
 */
class Environment extends Configuration {

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
	 * Check if TLS is in use via the `https` protocol.
	 *
     * @returns {boolean} `true` if the `protocol` is set to `https`
     */
	useTls() {
		return (this.value('protocol') === 'https');
	}

}

export default Environment;
