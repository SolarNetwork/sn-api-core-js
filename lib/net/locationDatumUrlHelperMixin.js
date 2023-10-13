import { dateTimeUrlFormat } from "../util/dates.js";
import { DatumFilterKeys, } from "../domain/datumFilter.js";
/**
 * Create a LocationDatumUrlHelperMixin class.
 *
 * @param superclass - the UrlHelper class to mix onto
 * @return the mixin class
 * @ignore
 */
const LocationDatumUrlHelperMixin = (superclass) => 
/**
 * A mixin class that adds SolarLocation datum query support to {@link Net.UrlHelper}.
 */
class LocationDatumUrlHelperMixin extends superclass {
    /**
     * Generate a URL for the "reportable interval" for a location, optionally limited to a specific source ID.
     *
     * If no source IDs are provided, then the reportable interval query will return an interval for
     * all available sources.
     *
     * @param locationId - a specific location ID to use; if not provided the `locationId` parameter of this instance will be used
     * @param sourceId - a specific source ID to limit query to;
     *                 if not provided the `sourceId` parameter of this instance will be used;
     * @returns the URL
     */
    reportableIntervalUrl(locationId, sourceId) {
        let url = this.baseUrl() +
            "/location/datum/interval?locationId=" +
            (locationId || this.param(DatumFilterKeys.LocationId));
        const source = sourceId || this.param(DatumFilterKeys.SourceId);
        if (source) {
            url += "&sourceId=" + encodeURIComponent(source);
        }
        return url;
    }
    /**
     * Generate a URL for finding the available source IDs for a location or metadata filter.
     *
     * @param ocationId - a specific location ID to use; if not provided the `locationId`
     *     parameter of this instance will be used
     * @param startDate - a start date to limit the search to
     * @param endDate - an end date to limit the search to
     * @returns the URL
     */
    availableSourcesUrl(locationId, startDate, endDate) {
        let result = this.baseUrl() +
            "/location/datum/sources?locationId=" +
            (locationId || this.param(DatumFilterKeys.LocationId));
        if (startDate instanceof Date) {
            result +=
                "&start=" +
                    encodeURIComponent(dateTimeUrlFormat(startDate));
        }
        if (endDate instanceof Date) {
            result +=
                "&end=" + encodeURIComponent(dateTimeUrlFormat(endDate));
        }
        return result;
    }
    /**
     * Generate a URL for querying for location datum, in either raw or aggregate form.
     *
     * If the `datumFilter` has an `aggregate` value set, then aggregate results will be
     * returned by SolarNet.
     *
     * @param datumFilter - the search criteria
     * @param sorts - optional sort settings to use
     * @param pagination - optional pagination settings to use
     * @returns the URL
     */
    listDatumUrl(datumFilter, sorts, pagination) {
        let result = this.baseUrl() + "/location/datum/list";
        const params = datumFilter
            ? datumFilter.toUriEncodingWithSorting(sorts, pagination)
            : "";
        if (params.length > 0) {
            result += "?" + params;
        }
        return result;
    }
    /**
     * Generate a URL for querying for the most recent datum.
     *
     * @param datumFilter the search criteria
     * @param sorts - optional sort settings to use
     * @param pagination - optional pagination settings to use
     * @returns the URL
     */
    mostRecentDatumUrl(datumFilter, sorts, pagination) {
        let result = this.baseUrl() + "/location/datum/mostRecent";
        const params = datumFilter
            ? datumFilter.toUriEncodingWithSorting(sorts, pagination)
            : "";
        if (params.length > 0) {
            result += "?" + params;
        }
        return result;
    }
};
export default LocationDatumUrlHelperMixin;
//# sourceMappingURL=locationDatumUrlHelperMixin.js.map