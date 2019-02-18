/**
 * The SolarQuery default path.
 * @type {string}
 * @alias module:net~SolarQueryDefaultPath
 */
export const SolarQueryDefaultPath = "/solarquery";

/**
 * The {@link module:net~UrlHelper#parameters} key for the SolarQuery path.
 * @type {string}
 * @alias module:net~SolarQueryPathKey
 */
export const SolarQueryPathKey = "solarQueryPath";

/**
 * The SolarQuery REST API path.
 * @type {string}
 * @alias module:net~SolarQueryApiPathV1
 */
export const SolarQueryApiPathV1 = "/api/v1";

/**
 * The {@link module:net~UrlHelper#parameters} key that holds a `boolean` flag to
 * use the public path scheme (`/pub`) when constructing URLs.
 * @type {string}
 * @alias module:net~SolarQueryPublicPathKey
 */
export const SolarQueryPublicPathKey = "publicQuery";

/**
 * Create a QueryUrlHelperMixin class.
 *
 * @exports net
 * @param {module:net~UrlHelper} superclass the UrlHelper class to mix onto
 * @return {module:net~QueryUrlHelperMixin} the mixin class
 */
const QueryUrlHelperMixin = superclass =>
	/**
	 * A mixin class that adds SolarQuery specific support to {@link module:net~UrlHelper}.
	 *
	 * @mixin
	 * @alias module:net~QueryUrlHelperMixin
	 */
	class extends superclass {
		/**
		 * Flag to set the `publicQuery` environment parameter.
		 * @type {boolean}
		 */
		get publicQuery() {
			return !!this.env(SolarQueryPublicPathKey);
		}

		set publicQuery(value) {
			this.env(SolarQueryPublicPathKey, !!value);
		}

		/**
		 * Get the base URL to the SolarQuery v1 REST API.
		 *
		 * The returned URL uses the configured environment to resolve
		 * the `hostUrl`, the `solarQueryPath` context path,
		 * and the `publicQuery` boolean flag. If the context path is not
		 * available, it will default to `/solarquery`.
		 *
		 * @returns {string} the base URL to SolarQuery
		 */
		baseUrl() {
			const path = this.env(SolarQueryPathKey) || SolarQueryDefaultPath;
			const isPubPath = this.publicQuery;
			return this.hostUrl() + path + SolarQueryApiPathV1 + (isPubPath ? "/pub" : "/sec");
		}
	};

export default QueryUrlHelperMixin;
