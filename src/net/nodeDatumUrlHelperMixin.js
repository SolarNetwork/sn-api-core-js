import DatumFilter from "../domain/datumFilter.js";
import UrlHelper from "./urlHelper.js";
import NodeUrlHelperMixin from "./nodeUrlHelperMixin.js";
import QueryUrlHelperMixin from "./queryUrlHelperMixin.js";

/**
 * Create a NodeDatumUrlHelperMixin class.
 *
 * @param {module:net~UrlHelper} superclass the UrlHelper class to mix onto
 * @return {module:net~NodeDatumUrlHelperMixin} the mixin class
 */
const NodeDatumUrlHelperMixin = (superclass) =>
	/**
	 * A mixin class that adds SolarNode datum query support to {@link module:net~UrlHelper}.
	 *
	 * @mixin
	 * @alias module:net~NodeDatumUrlHelperMixin
	 */
	class extends superclass {
		/**
		 * Generate a URL for the "reportable interval" for a node, optionally limited to a specific set of source IDs.
		 *
		 * If no source IDs are provided, then the reportable interval query will return an interval for
		 * all available sources.
		 *
		 * @param {number} [nodeId] a specific node ID to use; if not provided the `nodeId` property of this class will be used
		 * @param {string[]} [sourceIds] an array of source IDs to limit query to; if not provided the `sourceIds` property of this class will be used
		 * @returns {string} the URL
		 */
		reportableIntervalUrl(nodeId, sourceIds) {
			let url = this.baseUrl() + "/range/interval?nodeId=" + (nodeId || this.nodeId);
			let sources = sourceIds || this.sourceIds;
			if (Array.isArray(sources) && sources.length > 0) {
				url += "&sourceIds=" + sources.map((e) => encodeURIComponent(e)).join(",");
			}
			return url;
		}

		/**
		 * Generate a URL for finding the available source IDs for a node or metadata filter.
		 *
		 * @param {module:domain~DatumFilter} datumFilter the search criteria, which can define `nodeId`, `startDate`, `endDate`,
		 *                                                and `metadataFilter` properties to limit the results to; if `nodeId` not
		 *                                                provided the `nodeIds` property of this class will be used
		 * @param {boolean} withNodeIds if `true` then force the response to include node IDs along with source IDs, instead of
		 *                              just source IDs
		 * @returns {string} the URL
		 */
		availableSourcesUrl(datumFilter, withNodeIds) {
			const filter = datumFilter ? new DatumFilter(datumFilter) : this.datumFilter();
			if (withNodeIds !== undefined) {
				filter.prop("withNodeIds", !!withNodeIds);
			}
			let result = this.baseUrl() + "/range/sources";
			const params = filter.toUriEncoding();
			if (params.length > 0) {
				result += "?" + params;
			}
			return result;
		}

		/**
		 * Generate a URL for querying for datum, in either raw or aggregate form.
		 *
		 * If the `datumFilter` has an `aggregate` value set, then aggregate results will be
		 * returned by SolarNet.
		 *
		 * @param {module:domain~DatumFilter} datumFilter the search criteria
		 * @param {module:domain~SortDescriptor[]} [sorts] optional sort settings to use
		 * @param {module:domain~Pagination} [pagination] optional pagination settings to use
		 * @returns {string} the URL
		 */
		listDatumUrl(datumFilter, sorts, pagination) {
			let result = this.baseUrl() + "/datum/list";
			const filter = datumFilter || this.datumFilter();
			const params = filter.toUriEncodingWithSorting(sorts, pagination);
			if (params.length > 0) {
				result += "?" + params;
			}
			return result;
		}

		/**
		 * Generate a URL for querying for datum _reading_ values.
		 *
		 * The `datumFilter` must provide the required date(s) to use for the
		 * reading type. If the reading type only requires one date, then the
		 * {@link module:domain~DatumFilter#startDate} or
		 * {@link module:domain~DatumFilter#endDate} value should be provided.
		 *
		 * @param {module:domain~DatumFilter} datumFilter the search criteria
		 * @param {module:domain~DatumReadingType} readingType the type of reading to find
		 * @param {string} [tolerance] optional query tolerance to use
		 * @param {module:domain~SortDescriptor[]} [sorts] optional sort settings to use
		 * @param {module:domain~Pagination} [pagination] optional pagination settings to use
		 * @returns {string} the URL
		 * @see https://github.com/SolarNetwork/solarnetwork/wiki/SolarQuery-API#datum-reading
		 */
		datumReadingUrl(datumFilter, readingType, tolerance, sorts, pagination) {
			let result = this.baseUrl() + "/datum/reading";
			const filter = new DatumFilter(datumFilter) || this.datumFilter();
			filter.prop("readingType", readingType.name);
			if (tolerance) {
				filter.prop("tolerance", tolerance);
			}
			const params = filter.toUriEncodingWithSorting(sorts, pagination);
			if (params.length > 0) {
				result += "?" + params;
			}
			return result;
		}

		/**
		 * Generate a URL for querying for stream datum, in either raw or aggregate form.
		 *
		 * If the `datumFilter` has an `aggregate` value set, then aggregate results will be
		 * returned by SolarNet.
		 *
		 * @param {module:domain~DatumFilter} datumFilter the search criteria
		 * @param {module:domain~SortDescriptor[]} [sorts] optional sort settings to use
		 * @param {module:domain~Pagination} [pagination] optional pagination settings to use
		 * @returns {string} the URL
		 * @see https://github.com/SolarNetwork/solarnetwork/wiki/SolarQuery-Stream-API#datum-stream-datum-list
		 */
		streamDatumUrl(datumFilter, sorts, pagination) {
			let result = this.baseUrl() + "/datum/stream/datum";
			const filter = datumFilter || this.datumFilter();
			const params = filter.toUriEncodingWithSorting(sorts, pagination);
			if (params.length > 0) {
				result += "?" + params;
			}
			return result;
		}

		/**
		 * Generate a URL for querying for stream _reading_ values.
		 *
		 * The `datumFilter` must provide the required date(s) to use for the
		 * reading type. If the reading type only requires one date, then the
		 * {@link module:domain~DatumFilter#startDate} or
		 * {@link module:domain~DatumFilter#endDate} value should be provided.
		 *
		 * @param {module:domain~DatumFilter} datumFilter the search criteria
		 * @param {module:domain~DatumReadingType} readingType the type of reading to find
		 * @param {string} [tolerance] optional query tolerance to use
		 * @param {module:domain~SortDescriptor[]} [sorts] optional sort settings to use
		 * @param {module:domain~Pagination} [pagination] optional pagination settings to use
		 * @returns {string} the URL
		 * @see https://github.com/SolarNetwork/solarnetwork/wiki/SolarQuery-Stream-API#datum-stream-reading-list
		 */
		streamReadingUrl(datumFilter, readingType, tolerance, sorts, pagination) {
			let result = this.baseUrl() + "/datum/stream/reading";
			const filter = new DatumFilter(datumFilter) || this.datumFilter();
			filter.prop("readingType", readingType.name);
			if (tolerance) {
				filter.prop("tolerance", tolerance);
			}
			const params = filter.toUriEncodingWithSorting(sorts, pagination);
			if (params.length > 0) {
				result += "?" + params;
			}
			return result;
		}

		/**
		 * Get a new {@link module:domain~DatumFilter} configured with properties of this instance.
		 *
		 * This will configure the following properties:
		 *
		 *  * `nodeIds`
		 *  * `sourceIds`
		 *
		 * @returns {module:domain~DatumFilter} the filter
		 */
		datumFilter() {
			const filter = new DatumFilter();
			let v;

			v = this.nodeIds;
			if (v) {
				filter.nodeIds = v;
			}

			v = this.sourceIds;
			if (v) {
				filter.sourceIds = v;
			}

			return filter;
		}

		/**
		 * Generate a URL for querying for the most recent datum.
		 *
		 * @param {module:domain~DatumFilter} datumFilter the search criteria
		 * @param {module:domain~SortDescriptor[]} [sorts] optional sort settings to use
		 * @param {module:domain~Pagination} [pagination] optional pagination settings to use
		 * @returns {string} the URL
		 */
		mostRecentDatumUrl(datumFilter, sorts, pagination) {
			let result = this.baseUrl() + "/datum/mostRecent";
			const filter = datumFilter || this.datumFilter();
			const params = filter.toUriEncodingWithSorting(sorts, pagination);
			if (params.length > 0) {
				result += "?" + params;
			}
			return result;
		}
	};

/**
 * A concrete {@link module:net~UrlHelper} with the {@link module:net~NodeDatumUrlHelperMixin},
 * {@link module:net~QueryUrlHelperMixin}, and {@link module:net~NodeUrlHelperMixin} mixins.
 *
 * @mixes module:net~NodeDatumUrlHelperMixin
 * @mixes module:net~QueryUrlHelperMixin
 * @mixes module:net~NodeUrlHelperMixin
 * @extends module:net~UrlHelper
 * @alias module:net~NodeDatumUrlHelper
 */
class NodeDatumUrlHelper extends NodeDatumUrlHelperMixin(
	QueryUrlHelperMixin(NodeUrlHelperMixin(UrlHelper)),
) {}

export default NodeDatumUrlHelperMixin;
export { NodeDatumUrlHelper };
