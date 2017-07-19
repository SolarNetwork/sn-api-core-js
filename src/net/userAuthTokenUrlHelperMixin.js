/** @module net */

import UrlHelper from './urlHelper';
import UserUrlHelperMixin from './userUrlHelperMixin'

/**
 * Create a UserAuthTokenUrlHelperMixin class.
 *
 * @exports net
 * @param {module:net~UrlHelper} superclass the UrlHelper class to mix onto
 * @return {module:net~UserAuthTokenUrlHelperMixin} the mixin class
 */
const UserAuthTokenUrlHelperMixin = (superclass) => 

/**
 * A mixin class that adds security token support to a SolarUser {@link module:net~UrlHelper}.
 * 
 * @mixin
 * @alias module:net~UserAuthTokenUrlHelperMixin
 */
class extends superclass {

    /**
     * Generate a URL for listing all available auth tokens.
     * 
	 * @returns {string} the URL
     */
    listAllAuthTokensUrl() {
        return this.baseUrl() + '/user/auth-tokens';
    }

    /**
     * Generate a URL for creating a new auth token, via a <code>POST</code> request.
     * 
     * The request body accepts a {@link SecurityPolicy} JSON document.
     * 
     * @param {AuthTokenType} type the auth token type to generate
	 * @returns {string} the URL
     */
    generateAuthTokenUrl(type) {
        return this.baseUrl() + '/user/auth-tokens/generate/' +type.name;
    }

    /**
     * Generate a URL for accessing an auth token.
     * 
     * @param {string} tokenId the token ID
	 * @returns {string} the URL
     * @private
     */
    authTokenUrl(tokenId) {
        return this.baseUrl() + '/user/auth-tokens/' +encodeURIComponent(tokenId);
    }

    /**
     * Generate a URL for deleting an auth token, via a <code>DELETE</code> request.
     * 
     * @param {string} tokenId the token ID to delete
	 * @returns {string} the URL
     */
    deleteAuthTokenUrl(tokenId) {
        return this.authTokenUrl(tokenId);
    }

    /**
     * Generate a URL for updating (merging) a security policy on an auth token,
     * via a <code>PATCH</code> request.
     * 
     * The request body accepts a {@link SecurityPolicy} JSON document.
     * 
     * @param {string} tokenId the ID of the token to update
	 * @returns {string} the URL
     */
    updateAuthTokenSecurityPolicyUrl(tokenId) {
        return this.authTokenUrl(tokenId);
    }

    /**
     * Generate a URL for replacing a security policy on an auth token,
     * via a <code>PUT</code> request.
     * 
     * The request body accepts a {@link SecurityPolicy} JSON document.
     * 
     * @param {string} tokenId the ID of the token to update
	 * @returns {string} the URL
     */
    replaceAuthTokenSecurityPolicyUrl(tokenId) {
        return this.authTokenUrl(tokenId);
    }

    /**
     * Generate a URL for updating the status of an auth token,
     * via a <code>POST</code> request.
     * 
     * @param {string} tokenId the ID of the token to update
     * @param {AuthTokenStatus} status the status to change to
	 * @returns {string} the URL
     */
    updateAuthTokenStatusUrl(tokenId, status) {
        return this.authTokenUrl(tokenId) + '?status=' +encodeURIComponent(status.name);
    }
}

/**
 * A concrete {@link UrlHelper} with the {@link UserAuthTokenUrlHelperMixin} and  {@link UserUrlHelperMixin} mixins.
 * 
 * @mixes UserAuthTokenUrlHelperMixin
 * @mixes UserUrlHelperMixin
 * @extends UrlHelper
 */
class UserAuthTokenUrlHelper extends UserAuthTokenUrlHelperMixin(UserUrlHelperMixin(UrlHelper)) {

 }

export default UserAuthTokenUrlHelperMixin;
export { UserAuthTokenUrlHelper };
