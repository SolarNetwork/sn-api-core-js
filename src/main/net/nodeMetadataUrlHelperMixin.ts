import { DatumFilterKeys } from "../domain/datumFilter.js";
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
const NodeMetadataUrlHelperMixin = <T extends UrlHelperConstructor>(
	superclass: T
) =>
	/**
	 * A mixin class that adds SolarNode instruction support to {@link Net.UrlHelper}.
	 */
	class NodeMetadataUrlHelperMixin extends superclass {
		/**
		 * Generate a URL for viewing the configured node's metadata.
		 *
		 * @param nodeId a specific node ID to use; if not provided the `nodeId` parameter of this class will be used
		 * @returns the URL
		 * @throws Error if no node ID available
		 */
		viewNodeMetadataUrl(nodeId?: number): string {
			const node = nodeId || this.param(DatumFilterKeys.NodeId);
			if (!node) {
				throw new Error("No node ID available.");
			}
			return this.baseUrl() + "/nodes/meta/" + encodeURIComponent(node);
		}

		/**
		 * Generate a URL for adding metadata to a node via a `POST` request.
		 *
		 * @param nodeId a specific node ID to use; if not provided the `nodeId` parameter of this class will be used
		 * @returns the URL
		 * @throws Error if no node ID available
		 */
		addNodeMetadataUrl(nodeId?: number): string {
			return this.viewNodeMetadataUrl(nodeId);
		}

		/**
		 * Generate a URL for setting the metadata of a node via a `PUT` request.
		 *
		 * @param nodeId a specific node ID to use; if not provided the `nodeId` parameter of this class will be used
		 * @returns the URL
		 * @throws Error if no node ID available
		 */
		replaceNodeMetadataUrl(nodeId?: number): string {
			return this.viewNodeMetadataUrl(nodeId);
		}

		/**
		 * Generate a URL for deleting the metadata of a node via a `DELETE` request.
		 *
		 * @param nodeId a specific node ID to use; if not provided the `nodeId` parameter of this class will be used
		 * @returns the URL
		 * @throws Error if no node ID available
		 */
		deleteNodeMetadataUrl(nodeId?: number): string {
			return this.viewNodeMetadataUrl(nodeId);
		}

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
		findNodeMetadataUrl(
			nodeId?: number | number[] | null,
			sorts?: SortDescriptor[],
			pagination?: Pagination
		): string {
			const nodeIds: number[] | null | undefined = Array.isArray(nodeId)
				? nodeId
				: nodeId
					? [nodeId]
					: nodeId !== null
						? this.param("nodeIds")
						: undefined;
			let result = this.baseUrl() + "/nodes/meta";
			let params = "";
			if (Array.isArray(nodeIds)) {
				params += "nodeIds=" + nodeIds.join(",");
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
	};

export default NodeMetadataUrlHelperMixin;
