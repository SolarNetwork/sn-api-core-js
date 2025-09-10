import { UrlHelperConstructor } from "./urlHelper.js";
import DatumFilter from "../domain/datumFilter.js";
/**
 * Create a NodeUrlHelperMixin class.
 *
 * @param superclass the UrlHelper class to mix onto
 * @return the mixin class
 * @ignore
 */
declare const NodesUrlHelperMixin: <T extends UrlHelperConstructor>(superclass: T) => {
    new (...args: any[]): {
        /**
         * Generate a URL to get a list of all active node IDs available to the requesting user.
         *
         * **Note** this method only works against the `/sec` version of the API endpoint.
         *
         * @return the URL to access the node IDs the requesting user has access to
         */
        listAllNodeIdsUrl(): string;
        /**
         * Generate a URL for finding the available source IDs.
         *
         * @param datumFilter the search criteria, which can define `nodeId`, `startDate`, `endDate`,
         *     `localStartDate`, `localEndDdate`, `metadataFilter`, `propertyNames`,
         *     `instantaneousPropertyNames`, `accumulatingPropertyNames`, and
         *     `statusPropertyNames`, properties to limit the results to
         * @returns {string} the URL
         */
        findSourcesUrl(datumFilter?: DatumFilter): string;
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
        datumFilter(): DatumFilter;
    };
} & T;
export default NodesUrlHelperMixin;
//# sourceMappingURL=nodesUrlHelperMixin.d.ts.map