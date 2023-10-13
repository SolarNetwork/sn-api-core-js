/**
 * Create a UserAuthTokenUrlHelperMixin class.
 *
 * @param superclass - the UrlHelper class to mix onto
 * @return the mixin class
 * @ignore
 */
const UserAuthTokenUrlHelperMixin = (superclass) => 
/**
 * A mixin class that adds security token support to a {@link Net.UrlHelper}.
 */
class UserAuthTokenUrlHelperMixin extends superclass {
    /**
     * Generate a URL for listing all available auth tokens.
     *
     * @returns the URL
     */
    listAllAuthTokensUrl() {
        return this.baseUrl() + "/user/auth-tokens";
    }
    /**
     * Generate a URL for creating a new auth token, via a `POST` request.
     *
     * The request body accepts a {@link Domain.SecurityPolicy} JSON document.
     *
     * @param type - the auth token type to generate
     * @returns the URL
     */
    generateAuthTokenUrl(type) {
        return this.baseUrl() + "/user/auth-tokens/generate/" + type.name;
    }
    /**
     * Generate a URL for accessing an auth token.
     *
     * @param tokenId - the token ID
     * @returns the URL
     */
    #authTokenUrl(tokenId) {
        return (this.baseUrl() +
            "/user/auth-tokens/" +
            encodeURIComponent(tokenId));
    }
    /**
     * Generate a URL for deleting an auth token, via a `DELETE` request.
     *
     * @param tokenId - the token ID to delete
     * @returns the URL
     */
    deleteAuthTokenUrl(tokenId) {
        return this.#authTokenUrl(tokenId);
    }
    /**
     * Generate a URL for updating (merging) a security policy on an auth token,
     * via a `PATCH` request.
     *
     * The request body accepts a {@link Domain.SecurityPolicy} JSON document.
     *
     * @param tokenId - the ID of the token to update
     * @returns the URL
     */
    updateAuthTokenSecurityPolicyUrl(tokenId) {
        return this.#authTokenUrl(tokenId);
    }
    /**
     * Generate a URL for replacing a security policy on an auth token,
     * via a `PUT` request.
     *
     * The request body accepts a {@link Domain.SecurityPolicy} JSON document.
     *
     * @param tokenId - the ID of the token to update
     * @returns the URL
     */
    replaceAuthTokenSecurityPolicyUrl(tokenId) {
        return this.#authTokenUrl(tokenId);
    }
    /**
     * Generate a URL for updating the status of an auth token,
     * via a `POST` request.
     *
     * @param tokenId - the ID of the token to update
     * @param status - the status to change to
     * @returns the URL
     */
    updateAuthTokenStatusUrl(tokenId, status) {
        return (this.#authTokenUrl(tokenId) +
            "?status=" +
            encodeURIComponent(status.name));
    }
};
export default UserAuthTokenUrlHelperMixin;
//# sourceMappingURL=userAuthTokenUrlHelperMixin.js.map