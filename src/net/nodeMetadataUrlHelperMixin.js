import Pagination from "../domain/pagination";
import SortDescriptor from "../domain/sortDescriptor";
import UrlHelper from "./urlHelper";
import NodeUrlHelperMixin from "./nodeUrlHelperMixin";
import UserUrlHelperMixin from "./userUrlHelperMixin";

/**
 * Create a NodeMetadataUrlHelperMixin class.
 *
 * @exports net
 * @param {module:net~UrlHelper} superclass the UrlHelper class to mix onto
 * @return {module:net~NodeMetadataUrlHelperMixin} the mixin class
 */
const NodeMetadataUrlHelperMixin = superclass =>
	/**
	 * A mixin class that adds SolarNode metadata support to {@link module:net~UrlHelper}.
	 *
	 * @mixin
	 * @alias module:net~NodeMetadataUrlHelperMixin
	 */
	class extends superclass {
		/**
		 * Generate a URL for viewing the configured node's metadata.
		 *
		 * @param {number} [nodeId] a specific node ID to use; if not provided the `nodeId` property of this class will be used
		 * @returns {string} the URL
		 */
		viewNodeMetadataUrl(nodeId) {
			return this.baseUrl() + "/nodes/meta/" + (nodeId || this.nodeId);
		}

		/**
		 * Generate a URL for adding metadata to a node via a `POST` request.
		 *
		 * @param {number} [nodeId] a specific node ID to use; if not provided the `nodeId` property of this class will be used
		 * @returns {string} the URL
		 */
		addNodeMetadataUrl(nodeId) {
			return this.viewNodeMetadataUrl(nodeId);
		}

		/**
		 * Generate a URL for setting the metadata of a node via a `PUT` request.
		 *
		 * @param {number} [nodeId] a specific node ID to use; if not provided the `nodeId` property of this class will be used
		 * @returns {string} the URL
		 */
		replaceNodeMetadataUrl(nodeId) {
			return this.viewNodeMetadataUrl(nodeId);
		}

		/**
		 * Generate a URL for deleting the metadata of a node via a `DELETE` request.
		 *
		 * @param {number} [nodeId] a specific node ID to use; if not provided the `nodeId` property of this class will be used
		 * @returns {string} the URL
		 */
		deleteNodeMetadataUrl(nodeId) {
			return this.viewNodeMetadataUrl(nodeId);
		}

		/**
		 * Generate a URL for searching for node metadata.
		 *
		 * @param {number|number[]} [nodeId] a specific node ID, or array of node IDs, to use; if not provided the
		 *                                   `nodeIds` property of this class will be used, unless `null`
		 *                                   is passed in which case no node IDs will be added to the URL so that all available
		 *                                   node metadata objects will be returned
		 * @param {module:domain~SortDescriptor[]} [sorts] optional sort settings to use
		 * @param {module:domain~Pagination} [pagination] optional pagination settings to use
		 * @returns {string} the URL
		 */
		findNodeMetadataUrl(nodeId, sorts, pagination) {
			const nodeIds = Array.isArray(nodeId)
				? nodeId
				: nodeId
				? [nodeId]
				: nodeId !== null
				? this.nodeIds
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

/**
 * A concrete {@link module:net~UrlHelper} with the {@link module:net~NodeMetadataUrlHelperMixin},
 * {@link module:net~UserUrlHelperMixin}, and {@link module:net~NodeUrlHelperMixin} mixins.
 *
 * @mixes module:net~NodeMetadataUrlHelperMixin
 * @mixes module:net~UserUrlHelperMixin
 * @mixes module:net~NodeUrlHelperMixin
 * @extends module:net~UrlHelper
 * @alias module:net~NodeMetadataUrlHelper
 */
class NodeMetadataUrlHelper extends NodeMetadataUrlHelperMixin(
	UserUrlHelperMixin(NodeUrlHelperMixin(UrlHelper))
) {}

export default NodeMetadataUrlHelperMixin;
export { NodeMetadataUrlHelper };
