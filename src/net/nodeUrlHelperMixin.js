import DatumFilter from "../domain/datumFilter.js";

const NodeIdsKey = "nodeIds";
const SourceIdsKey = "sourceIds";

/**
 * Create a NodeUrlHelperMixin class.
 *
 * @param {module:net~UrlHelper} superclass the UrlHelper class to mix onto
 * @return {module:net~NodeUrlHelperMixin} the mixin class
 */
const NodeUrlHelperMixin = (superclass) =>
	/**
	 * A mixin class that adds support for SolarNode properties to a {@link module:net~UrlHelper}.
	 *
	 * @mixin
	 * @alias module:net~NodeUrlHelperMixin
	 */
	class extends superclass {
		/**
		 * The first available node ID from the `nodeIds` property.
		 * Setting this replaces any existing node IDs with an array of just that value.
		 * @type {number}
		 */
		get nodeId() {
			const nodeIds = this.nodeIds;
			return Array.isArray(nodeIds) && nodeIds.length > 0 ? nodeIds[0] : null;
		}

		set nodeId(nodeId) {
			this.parameter(NodeIdsKey, nodeId ? [nodeId] : null);
		}

		/**
		 * An array of node IDs, set on the `nodeIds` parameter
		 * @type {number[]}
		 */
		get nodeIds() {
			return this.parameter(NodeIdsKey);
		}

		set nodeIds(nodeIds) {
			this.parameter(NodeIdsKey, nodeIds);
		}

		/**
		 * The first available source ID from the `sourceIds` property.
		 * Setting this replaces any existing node IDs with an array of just that value.
		 * @type {string}
		 */
		get sourceId() {
			const sourceIds = this.sourceIds;
			return Array.isArray(sourceIds) && sourceIds.length > 0 ? sourceIds[0] : null;
		}

		set sourceId(sourceId) {
			this.parameter(SourceIdsKey, sourceId ? [sourceId] : sourceId);
		}

		/**
		 * An array of source IDs, set on the `sourceIds` parameter
		 * @type {string[]}
		 */
		get sourceIds() {
			return this.parameter(SourceIdsKey);
		}

		set sourceIds(sourceIds) {
			this.parameter(SourceIdsKey, sourceIds);
		}

		/**
		 * Generate a URL to get a list of all active node IDs available to the requesting user.
		 *
		 * **Note** this method only works against the `/sec` version of the API endpoint.
		 *
		 * @return {string} the URL to access the node IDs the requesting user has access to
		 */
		listAllNodeIdsUrl() {
			return this.baseUrl() + "/nodes";
		}

		/**
		 * Generate a URL for finding the available source IDs.
		 *
		 * @param {module:domain~DatumFilter} datumFilter the search criteria, which can define `nodeId`, `startDate`, `endDate`,
		 *                                                `localStartDate`, `localEndDdate`, `metadataFilter`, `propertyNames`,
		 *                                                `instantaneousPropertyNames`, `accumulatingPropertyNames`, and
		 *                                                `statusPropertyNames`, properties to limit the results to
		 * @returns {string} the URL
		 */
		findSourcesUrl(datumFilter) {
			const filter = datumFilter ? new DatumFilter(datumFilter) : this.datumFilter();
			let result = this.baseUrl() + "/nodes/sources";
			const params = filter.toUriEncoding();
			if (params.length > 0) {
				result += "?" + params;
			}
			return result;
		}
	};

export default NodeUrlHelperMixin;
