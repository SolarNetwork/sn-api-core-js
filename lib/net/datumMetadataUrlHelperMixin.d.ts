import { UrlHelperConstructor } from "./urlHelper.js";
import Pagination from "../domain/pagination.js";
import SortDescriptor from "../domain/sortDescriptor.js";
/**
 * Create a DatumMetadataUrlHelperMixin class.
 *
 * @param superclass the UrlHelper class to mix onto
 * @returns the mixin class
 * @ignore
 */
declare const DatumMetadataUrlHelperMixin: <T extends UrlHelperConstructor>(superclass: T) => {
    new (...args: any[]): {
        /**
         * Get a base URL for datum metadata operations using a specific node ID.
         *
         * @param nodeId - a specific node ID to use; if not provided the`nodeId` parameter of this instance will be used
         * @returns the base URL
         */
        "__#17@#baseDatumMetadataUrl"(nodeId?: number): string;
        "__#17@#datumMetadataUrlWithSource"(nodeId?: number, sourceId?: string): string;
        /**
         * Generate a URL for viewing datum metadata.
         *
         * If no `sourceId` is provided, then the API will return all available datum metadata for all sources.
         *
         * @param nodeId - a specific node ID to use; if not provided the `nodeId` parameter of this instance will be used
         * @param sourceId - a specific source ID to use;
         *     if not provided the `sourceId` parameter of this instance will be used;
         *     if `null` then ignore any `sourceId` property of this class
         * @returns the URL
         */
        viewNodeDatumMetadataUrl(nodeId?: number, sourceId?: string): string;
        /**
         * Generate a URL for adding (merging) datum metadata via a `POST` request.
         *
         * @param nodeId - a specific node ID to use; if not provided the `nodeId` parameter of this instance will be used
         * @param sourceId - a specific source ID to use; if not provided the `sourceId` parameter of this instance will be used
         * @returns the URL
         */
        addNodeDatumMetadataUrl(nodeId?: number, sourceId?: string): string;
        /**
         * Generate a URL for setting datum metadata via a `PUT` request.
         *
         * @param nodeId - a specific node ID to use; if not provided the `nodeId` parameter of this instance will be used
         * @param sourceId - a specific source ID to use; if not provided the `sourceId` parameter of this instance will be used
         * @returns the URL
         */
        replaceNodeDatumMetadataUrl(nodeId?: number, sourceId?: string): string;
        /**
         * Generate a URL for deleting datum metadata via a `DELETE` request.
         *
         * @param nodeId - a specific node ID to use; if not provided the `nodeId` parameter of this instance will be used
         * @param sourceId - a specific source ID to use; if not provided the `sourceId` parameter of this instance will be used
         * @returns the URL
         */
        deleteNodeDatumMetadataUrl(nodeId?: number, sourceId?: string): string;
        /**
         * Generate a URL for searching for datum metadata.
         *
         * @param nodeId - a specific node ID to use; if not provided the `nodeId` parameter of this instance will be used
         * @param sourceId - a specific source ID to use;
         *                            if not provided the `sourceId` parameter of this instance will be used;
         *                            if `null` then ignore any `sourceId` property of this class
         * @param sorts - optional sort settings to use
         * @param pagination - optional pagination settings to use
         * @returns the URL
         */
        findNodeDatumMetadataUrl(nodeId?: number, sourceId?: string, sorts?: SortDescriptor[], pagination?: Pagination): string;
        "__#17@#userMetadataUrl"(userId?: number): string;
        /**
         * Generate a URL for viewing a specific user's metadata via a `GET` request.
         *
         * Note this URL is similar to {@link Net.SolarUserApi#viewUserMetadataUrl}
         * but is for the read-only SolarQuery API, rather than the read-write SolarUser API.
         *
         * @param userId - a specific user ID;
         *     if not provided the `userId` parameter of this instance will be used
         * @returns the URL
         */
        viewUserMetadataUrl(userId?: number): string;
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
export default DatumMetadataUrlHelperMixin;
//# sourceMappingURL=datumMetadataUrlHelperMixin.d.ts.map