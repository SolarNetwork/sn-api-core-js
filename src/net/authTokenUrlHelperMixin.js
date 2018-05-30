import { dateFormat } from '../format/date'

/**
 * Create a AuthTokenUrlHelperMixin class.
 *
 * @exports net
 * @param {module:net~UrlHelper} superclass the UrlHelper class to mix onto
 * @return {module:net~AuthTokenUrlHelperMixin} the mixin class
 */
const AuthTokenUrlHelperMixin = (superclass) => 

/**
 * A mixin class that adds authentication token support to {@link module:net~UrlHelper}.
 * 
 * @mixin
 * @alias module:net~AuthTokenUrlHelperMixin
 */
class extends superclass {

	/**
	 * Generate a URL to refresh the signing key of an authentication token.
     * 
     * **Note** this method only works against the `/sec` version of the API endpoint.
	 * 
	 * @param {date} date the signing date to use, or `null` for the current date
	 * @returns {string} the URL
	 */
	refreshTokenV2Url(date) {
		return (this.baseUrl() +'/auth-tokens/refresh/v2?date=' +encodeURIComponent(dateFormat(date || new Date())));
	}

}

export default AuthTokenUrlHelperMixin;
