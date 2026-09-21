import { UrlHelperConstructor } from "./urlHelper.js";
/**
 * Create a UserUrlHelperMixin class.
 *
 * @param superclass - the UrlHelper class to mix onto
 * @return the mixin class
 * @ignore
 */
declare const UserUrlHelperMixin: <T extends UrlHelperConstructor>(superclass: T) => {
    new (...args: any[]): {
        /**
         * Generate a URL to get a list of all active nodes for the user account.
         *
         * @return the URL to access the user's active nodes
         */
        viewNodesUrl(): string;
        /**
         * Generate a URL to get a list of all pending nodes for the user account.
         *
         * @return the URL to access the user's pending nodes
         */
        viewPendingNodesUrl(): string;
        /**
         * Generate a URL to get a list of all archived nodes for the user account.
         *
         * @return the URL to access the user's archived nodes
         */
        viewArchivedNodesUrl(): string;
        /**
         * Generate a URL to update the archived status of a set of nodes via a `POST` request.
         *
         * @param nodeId - a specific node ID, or array of node IDs, to update; if not provided the
         *     `nodeIds` property of this class will be used
         * @param archived `true` to mark the nodes as archived; `false` to un-mark
         *     and return to normal status
         * @return the URL to update the nodes archived status
         */
        updateNodeArchivedStatusUrl(archived: boolean, nodeId?: number | number[]): string;
        readonly "__#private@#environment": import("./environment.js").EnvironmentConfig & import("./environment.js").HostConfig;
        readonly "__#private@#parameters": import("../util/configuration.js").default;
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
export default UserUrlHelperMixin;
//# sourceMappingURL=userNodesUrlHelperMixin.d.ts.map