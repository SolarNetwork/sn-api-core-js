import { UrlHelperConstructor } from "./urlHelper.js";
import { default as UserMetadataFilter } from "../domain/userMetadataFilter.js";
/**
 * Create a UserMetadataUrlHelperMixin class.
 *
 * @param superclass - the UrlHelper class to mix onto
 * @return the mixin class
 * @ignore
 */
declare const UserMetadataUrlHelperMixin: <T extends UrlHelperConstructor>(superclass: T) => {
    new (...args: any[]): {
        /**
         * Generate a URL for viewing the configured user's metadata via a `GET` request.
         *
         * @param filter - the search criteria
         * @returns the URL
         */
        findUserMetadataUrl(filter: UserMetadataFilter): string;
        #userMetadataUrl(userId?: number): string;
        /**
         * Generate a URL for viewing a specific user's metadata via a `GET` request.
         *
         * @param userId - a specific user ID;
         *     if not provided the `userId` parameter of this class will be used;
         *     if no `userId` parameter is available then view metadata of the requesting user
         * @returns the URL
         */
        viewUserMetadataUrl(userId?: number): string;
        /**
         * Generate a URL for adding user metadata via a `POST` request.
         *
         * @param userId - a specific user ID;
         *     if not provided the `userId` parameter of this class will be used;
         *     if no `userId` parameter is available then view metadata of the requesting user
         * @returns the URL
         */
        addUserMetadataUrl(userId?: number): string;
        /**
         * Generate a URL for replacing user metadata via a `PUT` request.
         *
         * @param userId - a specific user ID;
         *     if not provided the `userId` parameter of this class will be used;
         *     if no `userId` parameter is available then view metadata of the requesting user
         * @returns the URL
         */
        replaceUserMetadataUrl(userId?: number): string;
        /**
         * Generate a URL for deleting user metadata via a `DELETE` request.
         *
         * @param userId - a specific user ID;
         *     if not provided the `userId` parameter of this class will be used;
         *     if no `userId` parameter is available then view metadata of the requesting user
         * @returns the URL
         */
        deleteUserMetadataUrl(userId?: number): string;
        readonly #environment: import("./environment.js").EnvironmentConfig & import("./environment.js").HostConfig;
        readonly #parameters: import("../util/configuration.js").default;
        get environment(): import("./environment.js").EnvironmentConfig & import("./environment.js").HostConfig;
        get parameters(): import("../util/configuration.js").default;
        env(key: string): any;
        env(key: string, val: any): import("./environment.js").EnvironmentConfig & import("./environment.js").HostConfig;
        parameter(key: string): any;
        parameter(key: string, val: any): import("../util/configuration.js").default;
        param<T_1>(key: string): T_1 | undefined;
        hostUrl(): string;
        hostRequestUrl(): string;
        toRequestUrl(url: string): string;
        hostWebSocketUrl(): string;
        baseUrl(): string;
        resolveTemplatePath(template: string): string;
        resolveTemplateUrl(template: string): string;
        datumFilter(): import("../domain/datumFilter.js").default;
    };
} & T;
export default UserMetadataUrlHelperMixin;
//# sourceMappingURL=userMetadataUrlHelperMixin.d.ts.map