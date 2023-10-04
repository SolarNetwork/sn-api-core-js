import Pagination from "../domain/pagination.js";
import SortDescriptor from "../domain/sortDescriptor.js";
import UrlHelper from "./urlHelper.js";
import NodeUrlHelperMixin from "./nodeUrlHelperMixin.js";
import QueryUrlHelperMixin from "./queryUrlHelperMixin.js";

/**
 * Create a NodeDatumUrlHelperMixin class.
 *
 * @param {module:net~UrlHelper} superclass the UrlHelper class to mix onto
 * @return {module:net~NodeDatumMetadataUrlHelperMixin} the mixin class
 */
const NodeDatumMetadataUrlHelperMixin = (superclass) =>
	/**
	 * A mixin class that adds SolarNode datum metadata support to {@link module:net~UrlHelper}.
	 *
	 * <p>Datum metadata is metadata associated with a specific node and source, i.e.
	 * a <code>nodeId</code> and a <code>sourceId</code>.
	 *
	 * @mixin
	 * @alias module:net~NodeDatumMetadataUrlHelperMixin
	 */
	class extends superclass {
		/**
		 * Get a base URL for datum metadata operations using a specific node ID.
		 *
		 * @param {number} [nodeId] a specific node ID to use; if not provided the <code>nodeId</code> property of this class will be used
		 * @returns {string} the base URL
		 * @private
		 */
		baseNodeDatumMetadataUrl(nodeId) {
			return this.baseUrl() + "/datum/meta/" + (nodeId || this.nodeId);
		}

		nodeDatumMetadataUrlWithSource(nodeId, sourceId) {
			let result = this.baseNodeDatumMetadataUrl(nodeId);
			let source = sourceId || this.sourceId;
			if (sourceId !== null && source) {
				result += "?sourceId=" + encodeURIComponent(source);
			}
			return result;
		}

		/**
		 * Generate a URL for viewing datum metadata.
		 *
		 * If no <code>sourceId</code> is provided, then the API will return all available datum metadata for all sources.
		 *
		 * @param {number} [nodeId] a specific node ID to use; if not provided the <code>nodeId</code> property of this class will be used
		 * @param {string} [sourceId] a specific source ID to use;
		 *                            if not provided the <code>sourceId</code> property of this class will be used;
		 *                            if <code>null</code> then ignore any <code>sourceId</code> property of this class
		 * @returns {string} the URL
		 */
		viewNodeDatumMetadataUrl(nodeId, sourceId) {
			return this.nodeDatumMetadataUrlWithSource(nodeId, sourceId);
		}

		/**
		 * Generate a URL for adding (merging) datum metadata via a <code>POST</code> request.
		 *
		 * @param {number} [nodeId] a specific node ID to use; if not provided the <code>nodeId</code> property of this class will be used
		 * @param {string} [sourceId] a specific source ID to use; if not provided the <code>sourceId</code> property of this class will be used
		 * @returns {string} the URL
		 */
		addNodeDatumMetadataUrl(nodeId, sourceId) {
			return this.nodeDatumMetadataUrlWithSource(nodeId, sourceId);
		}

		/**
		 * Generate a URL for setting datum metadata via a <code>PUT</code> request.
		 *
		 * @param {number} [nodeId] a specific node ID to use; if not provided the <code>nodeId</code> property of this class will be used
		 * @param {string} [sourceId] a specific source ID to use; if not provided the <code>sourceId</code> property of this class will be used
		 * @returns {string} the URL
		 */
		replaceNodeDatumMetadataUrl(nodeId, sourceId) {
			return this.nodeDatumMetadataUrlWithSource(nodeId, sourceId);
		}

		/**
		 * Generate a URL for deleting datum metadata via a <code>DELETE</code> request.
		 *
		 * @param {number} [nodeId] a specific node ID to use; if not provided the <code>nodeId</code> property of this class will be used
		 * @param {string} [sourceId] a specific source ID to use; if not provided the <code>sourceId</code> property of this class will be used
		 * @returns {string} the URL
		 */
		deleteNodeDatumMetadataUrl(nodeId, sourceId) {
			return this.nodeDatumMetadataUrlWithSource(nodeId, sourceId);
		}

		/**
		 * Generate a URL for searching for datum metadata.
		 *
		 * @param {number} [nodeId] a specific node ID to use; if not provided the <code>nodeId</code> property of this class will be used
		 * @param {string} [sourceId] a specific source ID to use;
		 *                            if not provided the <code>sourceId</code> property of this class will be used;
		 *                            if <code>null</code> then ignore any <code>sourceId</code> property of this class
		 * @param {SortDescriptor[]} [sorts] optional sort settings to use
		 * @param {module:domain~Pagination} [pagination] optional pagination settings to use
		 * @returns {string} the URL
		 */
		findNodeDatumMetadataUrl(nodeId, sourceId, sorts, pagination) {
			let result = this.baseNodeDatumMetadataUrl(nodeId);
			let params = "";
			let source = sourceId || this.sourceId;
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

		userMetadataUrl(userId) {
			let result = this.baseUrl() + "/users/meta";
			let userParam = userId || this.userId;
			if (Array.isArray(userParam)) {
				if (userParam.length > 0) {
					userParam = userParam[0];
				} else {
					userParam = null;
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
		 * Note this URL is similar to {@link module:net~UserMetadataUrlHelperMixin#viewUserMetadataUrl}
		 * but is for the read-only SolarQuery API, rather than the read-write SolarUser API.
		 *
		 * @param {number|null} [userId] a specific user ID;
		 *                               if not provided the `userId` property of this class will be used
		 * @returns {string} the URL
		 */
		viewUserMetadataUrl(userId) {
			return this.userMetadataUrl(userId);
		}
	};

/**
 * A concrete {@link module:net~UrlHelper} with the {@link module:net~NodeDatumMetadataUrlHelperMixin},
 * {@link module:net~QueryUrlHelperMixin}, and {@link module:net~NodeUrlHelperMixin} mixins.
 *
 * @mixes module:net~NodeDatumMetadataUrlHelperMixin
 * @mixes module:net~QueryUrlHelperMixin
 * @mixes module:net~NodeUrlHelperMixin
 * @extends module:net~UrlHelper
 * @alias module:net~NodeDatumMetadataUrlHelper
 */
class NodeDatumMetadataUrlHelper extends NodeDatumMetadataUrlHelperMixin(
	QueryUrlHelperMixin(NodeUrlHelperMixin(UrlHelper)),
) {}

export default NodeDatumMetadataUrlHelperMixin;
export { NodeDatumMetadataUrlHelper };
