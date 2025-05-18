import { UrlHelperConstructor } from "./urlHelper.js";
/**
 * Create a AuthUrlHelperMixin class.
 *
 * @param superclass - the UrlHelper class to mix onto
 * @returns the mixin class
 * @ignore
 */
declare const AuthUrlHelperMixin: <T extends UrlHelperConstructor>(superclass: T) => {
    new (...args: any[]): {
        /**
         * Generate a URL to get information about the requesting authenticated user.
         *
         * @return the URL to view information about the authenticated user
         */
        whoamiUrl(): string;
        readonly "__#14@#environment": import("./environment.js").EnvironmentConfig & import("./environment.js").HostConfig;
        readonly "__#14@#parameters": import("../util/configuration.js").default;
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
export default AuthUrlHelperMixin;
//# sourceMappingURL=authUrlHelperMixin.d.ts.map