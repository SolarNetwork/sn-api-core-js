import { UserMetadataFilterKeys, } from "../domain/userMetadataFilter.js";
/**
 * Create a UserMetadataUrlHelperMixin class.
 *
 * @param superclass - the UrlHelper class to mix onto
 * @return the mixin class
 * @ignore
 */
const UserMetadataUrlHelperMixin = (superclass) => 
/**
 * A mixin class that adds user metadata support to {@link Net.UrlHelper}.
 */
class UserMetadataUrlHelperMixin extends superclass {
    /**
     * Generate a URL for viewing the configured user's metadata via a `GET` request.
     *
     * @param filter - the search criteria
     * @returns the URL
     */
    findUserMetadataUrl(filter) {
        let result = this.baseUrl() + "/users/meta";
        if (filter) {
            const params = filter.toUriEncoding();
            if (params.length > 0) {
                result += "?" + params;
            }
        }
        return result;
    }
    #userMetadataUrl(userId) {
        let result = this.baseUrl() + "/users/meta";
        let userParam = userId || this.param(UserMetadataFilterKeys.UserId);
        if (Array.isArray(userParam)) {
            if (userParam.length > 0) {
                userParam = userParam[0];
            }
            else {
                userParam = undefined;
            }
        }
        if (userParam) {
            result += "/" + userParam;
        }
        return result;
    }
    /**
     * Generate a URL for viewing a specific user's metadata via a `GET` request.
     *
     * @param userId - a specific user ID;
     *     if not provided the `userId` parameter of this class will be used;
     *     if no `userId` parameter is available then view metadata of the requesting user
     * @returns the URL
     */
    viewUserMetadataUrl(userId) {
        return this.#userMetadataUrl(userId);
    }
    /**
     * Generate a URL for adding user metadata via a `POST` request.
     *
     * @param userId - a specific user ID;
     *     if not provided the `userId` parameter of this class will be used;
     *     if no `userId` parameter is available then view metadata of the requesting user
     * @returns the URL
     */
    addUserMetadataUrl(userId) {
        return this.#userMetadataUrl(userId);
    }
    /**
     * Generate a URL for replacing user metadata via a `PUT` request.
     *
     * @param userId - a specific user ID;
     *     if not provided the `userId` parameter of this class will be used;
     *     if no `userId` parameter is available then view metadata of the requesting user
     * @returns the URL
     */
    replaceUserMetadataUrl(userId) {
        return this.#userMetadataUrl(userId);
    }
    /**
     * Generate a URL for deleting user metadata via a `DELETE` request.
     *
     * @param userId - a specific user ID;
     *     if not provided the `userId` parameter of this class will be used;
     *     if no `userId` parameter is available then view metadata of the requesting user
     * @returns the URL
     */
    deleteUserMetadataUrl(userId) {
        return this.#userMetadataUrl(userId);
    }
};
export default UserMetadataUrlHelperMixin;
//# sourceMappingURL=userMetadataUrlHelperMixin.js.map