/** @module net */

import Configuration from '../util/configuration';
import Environment from './environment';

/**
 * A utility class for helping to compose SolarNet URLs for the REST API.
 *
 * This class is essentially abstract and meant to have mixin helper objects extend it.
 */
class UrlHelper {

    /**
     * Constructor.
     *
     * @param {Environment|Object} [environment] the optional initial environment to use;
     *        if a non-<code>Environment</code> object is passed then the properties of that object will
     *        be used to construct a new <code>Environment</code> instance
     */
    constructor(environment) {
        let env = (environment instanceof Environment ? environment
            : new Environment(environment));
        
        /**
         * The environment associated with this helper.
         * @member {Environment}
         */
        this.environment = env;

        this._parameters = new Configuration();
    }

    /**
     * Get a parameters object that can be used to hold URL variables.
     * 
     * @readonly
     * @type {Configuration}
     */
    get parameters() {
        return this._parameters;
    }

    /**
     * Get or set an environment parameter.
     * 
     * This is a shortcut for calling {@link Configuration#value} on the
     * <code>environment</code> object.
     * 
     * @param {string} key the environment parameter name to get
     * @param {Object} [val] the optional value to set
     * @returns {Object} when called as a getter, the environment parameter value;
     *                   when called as a setter, the environment parameters object
     */
    env(...args) {
        return this.environment.value(...args);
    }

    /**
     * Get or set a parameter.
     * 
     * This is a shortcut for calling {@link Configuration#value} on the
     * <code>parameters</code> object.
     * 
     * @param {string} key the parameter name to get
     * @param {Object} [val] the optional value to set
     * @returns {Object} when called as a getter, the parameter value;
     *                   when called as a setter, the parameters object
     */
    parameter(...args) {
        return this._parameters.value(...args);
    }

    /**
     * Get a URL for just the SolarNet host, without any path.
     *
     * @returns {string} the URL to the SolarNet host
     */
    hostUrl() {
        const tls = this.environment.useTls();
        const port = +this.environment.value('port');
		let url = 'http' +(tls ? 's' : '') +'://' +this.environment.value('host');
        if ( (tls && port > 0 && port !== 443) || (!tls && port > 0 && port !== 80) ) {
            url += ':' +port;
        }
        return url;
    }
    
    /**
     * Get a URL for just the SolarNet host using the WebSocket protocol, without any path.
     * 
     * @returns {string} the URL to the SolarNet host WebSocket
     */
    hostWebSocketUrl() {
        const tls = this.environment.useTls();
        const port = +this.environment.value('port');
		let url = 'ws' +(tls ? 's' : '') +'://' +this.environment.value('host');
        if ( (tls && port > 0 && port !== 443) || (!tls && port > 0 && port !== 80) ) {
            url += ':' +port;
        }
        return url;
    }

	/**
	 * Get the base URL to the REST API.
	 * 
	 * This implementation is a stub, meant for subclasses to override. This implementation
     * simply returns {@link UrlHelper#hostUrl}.
	 * 
     * @abstract
	 * @returns {string} the base URL to the REST API
	 */
	baseUrl() {
		return this.hostUrl();
	}

    /**
     * Replace occurances of URL template variables with values from the <code>parameters</code>
     * property and append to the host URL.
     * 
     * This method provides a way to resolve an absolute URL based on the configured
     * environment and parameters on this object.
     * 
     * @param {string} template a URL path template
     * @returns {string} an absolute URL
     * @see UrlHelper#resolveTemplateUrl
     */
    resolveTemplatePath(template) {
        return this.hostUrl() + this.resolveTemplateUrl(template);
    }

     /**
     * Replace occurances of URL template variables with values from the <code>parameters</code>
     * property.
     * 
     * URL template variables are specified as <code>{<em>name</em>}</code>. The variable
     * will be replaced by the value associated with property <code>name</code> in the
     * <code>parameters</code> object. The value will be URI encoded.
     * 
     * @param {string} template a URL template
     * @returns {string} the URL with template variables resolved
     */
   resolveTemplateUrl(template) {
        return UrlHelper.resolveTemplateUrl(template, this._parameters);
    }

    /**
     * Replace occurances of URL template variables with values from a parameter object.
     * 
     * URL template variables are specified as <code>{<em>name</em>}</code>. The variable
     * will be replaced by the value associated with property <code>name</code> in the
     * provided parameter object. The value will be URI encoded.
     * 
     * @param {string} template a URL template
     * @param {Object} params an object whose properties should serve as template variables
     * @returns {string} the URL
     */
    static resolveTemplateUrl(template, params) {
        return template.replace(/\{([^}]+)\}/g, function(match, variableName) {
            let variableValue = params[variableName];
            return (variableValue !== undefined ? encodeURIComponent(variableValue) : '');
        });
    }

}

export default UrlHelper;
