import { dateTimeUrlFormat } from "../format/date";
import UrlHelper from "./urlHelper";
import LocationUrlHelperMixin from "./locationUrlHelperMixin";
import QueryUrlHelperMixin from "./queryUrlHelperMixin";

/**
 * Create a LocationDatumUrlHelperMixin class.
 *
 * @exports net
 * @param {module:net~UrlHelper} superclass the UrlHelper class to mix onto
 * @return {module:net~LocationDatumUrlHelperMixin} the mixin class
 */
const LocationDatumUrlHelperMixin = (superclass) =>
	/**
	 * A mixin class that adds SolarLocation datum query support to {@link module:net~UrlHelper}.
	 *
	 * <p>This mixin is commonly mixed with the {@link module:net~QueryUrlHelperMixin} to pick
	 * up support for the SolarQuery base URL.</p>
	 *
	 * <p>This mixin is commonly mixed with the {@link module:net~LocationUrlHelperMixin} to
	 * pick up support for `locationId` and `sourceId` properties.</p>
	 *
	 * @mixin
	 * @alias module:net~LocationDatumUrlHelperMixin
	 */
	class extends superclass {
		/**
		 * Generate a URL for the "reportable interval" for a location, optionally limited to a specific source ID.
		 *
		 * If no source IDs are provided, then the reportable interval query will return an interval for
		 * all available sources.
		 *
		 * @param {number} [locationId] a specific location ID to use; if not provided the `locationId` property of this class will be used
		 * @param {string} [sourceId] a specific source ID to limit query to;
		 *                 if not provided the `sourceId` property of this class will be used;
		 *                 if `null` the `sourceId` property of this class will be ignored
		 * @returns {string} the URL
		 */
		reportableIntervalUrl(locationId, sourceId) {
			let url =
				this.baseUrl() +
				"/location/datum/interval?locationId=" +
				(locationId || this.locationId);
			let source = sourceId || this.sourceId;
			if (sourceId !== null && source) {
				url += "&sourceId=" + encodeURIComponent(source);
			}
			return url;
		}

		/**
		 * Generate a URL for finding the available source IDs for a location or metadata filter.
		 *
		 * @param {number} [locationId] a specific location ID to use; if not provided the `locationId`
		 *                              property of this class will be used
		 * @param {Date} [startDate] a start date to limit the search to
		 * @param {Date} [endDate] an end date to limit the search to
		 * @returns {string} the URL
		 */
		availableSourcesUrl(locationId, startDate, endDate) {
			let result =
				this.baseUrl() +
				"/location/datum/sources?locationId=" +
				(locationId || this.locationId);
			if (startDate instanceof Date) {
				result += "&start=" + encodeURIComponent(dateTimeUrlFormat(startDate));
			}
			if (endDate instanceof Date) {
				result += "&end=" + encodeURIComponent(dateTimeUrlFormat(endDate));
			}
			return result;
		}

		/**
		 * Generate a URL for querying for location datum, in either raw or aggregate form.
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
			let result = this.baseUrl() + "/location/datum/list";
			let params = datumFilter ? datumFilter.toUriEncodingWithSorting(sorts, pagination) : "";
			if (params.length > 0) {
				result += "?" + params;
			}
			return result;
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
			let result = this.baseUrl() + "/location/datum/mostRecent";
			let params = datumFilter ? datumFilter.toUriEncodingWithSorting(sorts, pagination) : "";
			if (params.length > 0) {
				result += "?" + params;
			}
			return result;
		}
	};

/**
 * A concrete {@link module:net~UrlHelper} with the {@link module:net~LocationDatumUrlHelperMixin},
 * {@link module:net~QueryUrlHelperMixin}, and {@link module:net~LocationUrlHelperMixin} mixins.
 *
 * @mixes module:net~LocationDatumUrlHelperMixin
 * @mixes module:net~QueryUrlHelperMixin
 * @mixes module:net~LocationUrlHelperMixin
 * @extends module:net~UrlHelper
 * @alias module:net~LocationDatumUrlHelper
 */
class LocationDatumUrlHelper extends LocationDatumUrlHelperMixin(
	QueryUrlHelperMixin(LocationUrlHelperMixin(UrlHelper))
) {}

export default LocationDatumUrlHelperMixin;
export { LocationDatumUrlHelper };
