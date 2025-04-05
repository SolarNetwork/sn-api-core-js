import { AuthTokenStatus } from "../domain/authTokenStatus.js";
import { AuthTokenType } from "../domain/authTokenType.js";
import { UrlHelperConstructor } from "./urlHelper.js";
/**
 * Create a UserAuthTokenUrlHelperMixin class.
 *
 * @param superclass - the UrlHelper class to mix onto
 * @return the mixin class
 * @ignore
 */
declare const UserAuthTokenUrlHelperMixin: <T extends UrlHelperConstructor>(superclass: T) => {
    new (...args: any[]): {
        /**
         * Generate a URL for listing all available auth tokens.
         *
         * @returns the URL
         */
        listAllAuthTokensUrl(): string;
        /**
         * Generate a URL for creating a new auth token, via a `POST` request.
         *
         * The request body accepts a {@link Domain.SecurityPolicy} JSON document.
         *
         * @param type - the auth token type to generate
         * @returns the URL
         */
        generateAuthTokenUrl(type: AuthTokenType): string;
        /**
         * Generate a URL for accessing an auth token.
         *
         * @param tokenId - the token ID
         * @returns the URL
         */
        "__#22@#authTokenUrl"(tokenId: string): string;
        /**
         * Generate a URL for deleting an auth token, via a `DELETE` request.
         *
         * @param tokenId - the token ID to delete
         * @returns the URL
         */
        deleteAuthTokenUrl(tokenId: string): string;
        /**
         * Generate a URL for updating (merging) a security policy on an auth token,
         * via a `PATCH` request.
         *
         * The request body accepts a {@link Domain.SecurityPolicy} JSON document.
         *
         * @param tokenId - the ID of the token to update
         * @returns the URL
         */
        updateAuthTokenSecurityPolicyUrl(tokenId: string): string;
        /**
         * Generate a URL for replacing a security policy on an auth token,
         * via a `PUT` request.
         *
         * The request body accepts a {@link Domain.SecurityPolicy} JSON document.
         *
         * @param tokenId - the ID of the token to update
         * @returns the URL
         */
        replaceAuthTokenSecurityPolicyUrl(tokenId: string): string;
        /**
         * Generate a URL for updating the status of an auth token,
         * via a `POST` request.
         *
         * @param tokenId - the ID of the token to update
         * @param status - the status to change to
         * @returns the URL
         */
        updateAuthTokenStatusUrl(tokenId: string, status: AuthTokenStatus): string;
        readonly "__#13@#environment": import("./environment.js").EnvironmentConfig & import("./environment.js").HostConfig;
        readonly "__#13@#parameters": import("../util/configuration.js").default;
        readonly environment: import("./environment.js").EnvironmentConfig & import("./environment.js").HostConfig;
        readonly parameters: import("../util/configuration.js").default;
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
export default UserAuthTokenUrlHelperMixin;
//# sourceMappingURL=userAuthTokenUrlHelperMixin.d.ts.map