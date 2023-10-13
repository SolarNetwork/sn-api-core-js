import { DatumFilterKeys } from "../domain/datumFilter.js";
import Pagination from "../domain/pagination.js";
import SortDescriptor from "../domain/sortDescriptor.js";
/**
 * Create a DatumMetadataUrlHelperMixin class.
 *
 * @param superclass the UrlHelper class to mix onto
 * @returns the mixin class
 * @ignore
 */
const DatumMetadataUrlHelperMixin = (superclass) => 
/**
 * A mixin class that adds SolarNode datum metadata support to {@link Net.UrlHelper}.
 *
 * Datum metadata is metadata associated with a specific node and source, i.e.
 * a `nodeId` and a `sourceId`.
 */
class DatumMetadataUrlHelperMixin extends superclass {
    /**
     * Get a base URL for datum metadata operations using a specific node ID.
     *
     * @param nodeId - a specific node ID to use; if not provided the`nodeId` parameter of this instance will be used
     * @returns the base URL
     */
    #baseDatumMetadataUrl(nodeId) {
        return (this.baseUrl() +
            "/datum/meta/" +
            (nodeId || this.param(DatumFilterKeys.NodeId)));
    }
    #datumMetadataUrlWithSource(nodeId, sourceId) {
        let result = this.#baseDatumMetadataUrl(nodeId);
        const source = sourceId || this.param(DatumFilterKeys.SourceId);
        if (sourceId !== null && source) {
            result += "?sourceId=" + encodeURIComponent(source);
        }
        return result;
    }
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
    viewNodeDatumMetadataUrl(nodeId, sourceId) {
        return this.#datumMetadataUrlWithSource(nodeId, sourceId);
    }
    /**
     * Generate a URL for adding (merging) datum metadata via a `POST` request.
     *
     * @param nodeId - a specific node ID to use; if not provided the `nodeId` parameter of this instance will be used
     * @param sourceId - a specific source ID to use; if not provided the `sourceId` parameter of this instance will be used
     * @returns the URL
     */
    addNodeDatumMetadataUrl(nodeId, sourceId) {
        return this.#datumMetadataUrlWithSource(nodeId, sourceId);
    }
    /**
     * Generate a URL for setting datum metadata via a `PUT` request.
     *
     * @param nodeId - a specific node ID to use; if not provided the `nodeId` parameter of this instance will be used
     * @param sourceId - a specific source ID to use; if not provided the `sourceId` parameter of this instance will be used
     * @returns the URL
     */
    replaceNodeDatumMetadataUrl(nodeId, sourceId) {
        return this.#datumMetadataUrlWithSource(nodeId, sourceId);
    }
    /**
     * Generate a URL for deleting datum metadata via a `DELETE` request.
     *
     * @param nodeId - a specific node ID to use; if not provided the `nodeId` parameter of this instance will be used
     * @param sourceId - a specific source ID to use; if not provided the `sourceId` parameter of this instance will be used
     * @returns the URL
     */
    deleteNodeDatumMetadataUrl(nodeId, sourceId) {
        return this.#datumMetadataUrlWithSource(nodeId, sourceId);
    }
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
    findNodeDatumMetadataUrl(nodeId, sourceId, sorts, pagination) {
        let result = this.#baseDatumMetadataUrl(nodeId);
        let params = "";
        const source = sourceId || this.param(DatumFilterKeys.SourceId);
        if (sourceId !== null && source) {
            params += "sourceId=" + encodeURIComponent(source);
        }
        if (Array.isArray(sorts)) {
            sorts.forEach((sort, i) => {
                if (sort instanceof SortDescriptor) {
                    if (params.length > 0) {
                        params += "&";
                    }
                    params += sort.toUriEncoding(i);
                }
            });
        }
        if (pagination instanceof Pagination) {
            if (params.length > 0) {
                params += "&";
            }
            params += pagination.toUriEncoding();
        }
        if (params.length > 0) {
            result += "?" + params;
        }
        return result;
    }
    #userMetadataUrl(userId) {
        let result = this.baseUrl() + "/users/meta";
        let userParam = userId || this.param(DatumFilterKeys.UserId);
        if (Array.isArray(userParam)) {
            if (userParam.length > 0) {
                userParam = userParam[0];
            }
            else {
                userParam = undefined;
            }
        }
        if (userParam && userId !== null) {
            result += "/" + userParam;
        }
        return result;
    }
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
    viewUserMetadataUrl(userId) {
        return this.#userMetadataUrl(userId);
    }
};
export default DatumMetadataUrlHelperMixin;
//# sourceMappingURL=datumMetadataUrlHelperMixin.js.map