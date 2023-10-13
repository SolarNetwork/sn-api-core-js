/**
 * Create a AuthUrlHelperMixin class.
 *
 * @param superclass - the UrlHelper class to mix onto
 * @returns the mixin class
 * @ignore
 */
const AuthUrlHelperMixin = (superclass) => 
/**
 * A mixin class that adds authentication token support to {@link Net.UrlHelper}.
 *
 * @mixin
 */
class AuthUrlHelperMixin extends superclass {
    /**
     * Generate a URL to get information about the requesting authenticated user.
     *
     * @return the URL to view information about the authenticated user
     */
    whoamiUrl() {
        return this.baseUrl() + "/whoami";
    }
};
export default AuthUrlHelperMixin;
//# sourceMappingURL=authUrlHelperMixin.js.map