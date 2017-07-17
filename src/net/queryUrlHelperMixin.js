/** The SolarQuery default path. */
export const SolarQueryDefaultPath = '/solarquery';

/** The {@link UrlHelper} parameters key for the SolarQuery path. */
export const SolarQueryPathKey = 'solarQueryPath';

/** The SolarQuery REST API path. */
export const SolarQueryApiPathV1 = '/api/v1';

/** 
 * The {@link UrlHelper} parameters key that holds a <code>boolean</code> flag to
 * use the public path scheme (<code>/pub</code>) when constructing URLs.
 */
export const SolarQueryPublicPathKey = 'publicQuery';

/**
 * A mixin class that adds SolarQuery specific support to {@link UrlHelper}.
 * 
 * @param {UrlHelper} superclass the UrlHelper class to mix onto
 * @mixin
 * @returns {*} the mixin
 */
const QueryUrlHelperMixin = (superclass) => class extends superclass {

	/**
	 * Get the base URL to the SolarQuery v1 REST API.
	 * 
	 * The returned URL uses the configured environment to resolve
	 * the <code>hostUrl</code>, the <code>solarQueryPath</code> context path,
     * and the <code>publicQuery</code> boolean flag. If the context path is not 
     * available, it will default to <code>/solarquery</code>.
	 * 
	 * @returns {string} the base URL to SolarQuery
	 * @memberof QueryUrlHelperMixin#
	 */
	baseUrl() {
		const path = this.env(SolarQueryPathKey) || SolarQueryDefaultPath;
        const isPubPath = !!this.env(SolarQueryPublicPathKey);
		return this.hostUrl() + path + SolarQueryApiPathV1
            +(isPubPath ? '/pub' : '/sec');
	}

};

export default QueryUrlHelperMixin;
