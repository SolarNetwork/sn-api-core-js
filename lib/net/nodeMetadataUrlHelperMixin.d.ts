import Pagination from "../domain/pagination.js";
import SortDescriptor from "../domain/sortDescriptor.js";
import { UrlHelperConstructor } from "./urlHelper.js";
/**
 * Create a InstructionUrlHelperMixin class.
 *
 * @param superclass - the UrlHelper class to mix onto
 * @return the mixin class
 * @ignore
 */
declare const NodeMetadataUrlHelperMixin: <T extends UrlHelperConstructor>(superclass: T) => {
    new (...args: any[]): {
        /**
         * Generate a URL for viewing the configured node's metadata.
         *
         * @param nodeId a specific node ID to use; if not provided the `nodeId` parameter of this class will be used
         * @returns the URL
         * @throws Error if no node ID available
         */
        viewNodeMetadataUrl(nodeId?: number): string;
        /**
         * Generate a URL for adding metadata to a node via a `POST` request.
         *
         * @param nodeId a specific node ID to use; if not provided the `nodeId` parameter of this class will be used
         * @returns the URL
         * @throws Error if no node ID available
         */
        addNodeMetadataUrl(nodeId?: number): string;
        /**
         * Generate a URL for setting the metadata of a node via a `PUT` request.
         *
         * @param nodeId a specific node ID to use; if not provided the `nodeId` parameter of this class will be used
         * @returns the URL
         * @throws Error if no node ID available
         */
        replaceNodeMetadataUrl(nodeId?: number): string;
        /**
         * Generate a URL for deleting the metadata of a node via a `DELETE` request.
         *
         * @param nodeId a specific node ID to use; if not provided the `nodeId` parameter of this class will be used
         * @returns the URL
         * @throws Error if no node ID available
         */
        deleteNodeMetadataUrl(nodeId?: number): string;
        /**
         * Generate a URL for searching for node metadata.
         *
         * @param nodeId a specific node ID, or array of node IDs, to use; if not provided the `nodeIds`
         * property of this class will be used, unless `null` is passed in which case no node IDs will be
         * added to the URL so that all available node metadata objects will be returned
         * @param sorts optional sort settings to use
         * @param pagination optional pagination settings to use
         * @returns the URL
         * @throws Error if no node ID available
         */
        findNodeMetadataUrl(nodeId?: number | number[] | null, sorts?: SortDescriptor[], pagination?: Pagination): string;
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
export default NodeMetadataUrlHelperMixin;
//# sourceMappingURL=nodeMetadataUrlHelperMixin.d.ts.map