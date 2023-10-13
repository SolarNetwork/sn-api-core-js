import { default as DatumFilter, DatumFilterKeys, } from "../domain/datumFilter.js";
/**
 * Create a NodeDatumUrlHelperMixin class.
 *
 * @param superclass - the UrlHelper class to mix onto
 * @returns the mixin class
 * @ignore
 */
const DatumUrlHelperMixin = (superclass) => 
/**
 * A mixin class that adds datum query support to {@link Net.UrlHelper}.
 */
class DatumUrlHelperMixin extends superclass {
    /**
     * Generate a URL for the "reportable interval" for a node, optionally limited to a specific set of source IDs.
     *
     * If no source IDs are provided, then the reportable interval query will return an interval for
     * all available sources.
     *
     * @param nodeId - a specific node ID to use; if not provided the `nodeId` parameter will be used
     * @param sourceIds - an array of source IDs to limit query to; if not provided the `sourceIds` parameter will be used
     * @returns the URL
     */
    reportableIntervalUrl(nodeId, sourceIds) {
        let url = this.baseUrl() +
            "/range/interval?nodeId=" +
            (nodeId || this.param(DatumFilterKeys.NodeId));
        const sources = sourceIds || this.param(DatumFilterKeys.SourceIds);
        if (Array.isArray(sources) && sources.length > 0) {
            url +=
                "&sourceIds=" +
                    sources.map((e) => encodeURIComponent(e)).join(",");
        }
        return url;
    }
    /**
     * Generate a URL for finding the available source IDs for a node or metadata filter.
     *
     * @param datumFilter the search criteria, which can define `nodeId`, `startDate`, `endDate`,
     *     and `metadataFilter` properties to limit the results to; if `nodeId` not
     *     provided the `nodeIds` parameter of this instance will be used
     * @param withNodeIds if `true` then force the response to include node IDs along with source IDs,
     *     instead of  just source IDs
     * @returns the URL
     */
    availableSourcesUrl(datumFilter, withNodeIds) {
        const filter = datumFilter
            ? new DatumFilter(datumFilter)
            : this.datumFilter();
        if (withNodeIds !== undefined) {
            filter.prop("withNodeIds", !!withNodeIds);
        }
        let result = this.baseUrl() + "/range/sources";
        const params = filter.toUriEncoding();
        if (params) {
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
     * @param datumFilter - the search criteria; if not provided then {@link Net.UrlHelper#datumFilter this.datumFilter()} will be used
     * @param sorts - optional sort settings to use
     * @param pagination - optional pagination settings to use
     * @returns the URL
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
     * {@link Domain.DatumFilter#startDate} or
     * {@link Domain.DatumFilter#endDate} value should be provided.
     *
     * @param readingType the type of reading to find
     * @param datumFilter - the search criteria; if not provided then {@link Net.UrlHelper#datumFilter this.datumFilter()} will be used
     * @param tolerance - optional query tolerance to use
     * @param sorts - optional sort settings to use
     * @param pagination - optional pagination settings to use
     * @returns the URL
     * @see https://github.com/SolarNetwork/solarnetwork/wiki/SolarQuery-API#datum-reading
     */
    datumReadingUrl(readingType, datumFilter, tolerance, sorts, pagination) {
        const filter = datumFilter
            ? new DatumFilter(datumFilter)
            : this.datumFilter();
        filter.prop("readingType", readingType.name);
        if (tolerance) {
            filter.prop("tolerance", tolerance);
        }
        const params = filter.toUriEncodingWithSorting(sorts, pagination);
        let result = this.baseUrl() + "/datum/reading";
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
     * @param datumFilter - the search criteria; if not provided then {@link Net.UrlHelper#datumFilter this.datumFilter()} will be used
     * @param sorts - optional sort settings to use
     * @param pagination - optional pagination settings to use
     * @returns the URL
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
     * {@link Domain.DatumFilter#startDate} or
     * {@link Domain.DatumFilter#endDate} value should be provided.
     *
     * @param readingType the type of reading to find
     * @param datumFilter - the search criteria; if not provided then {@link Net.UrlHelper#datumFilter this.datumFilter()} will be used
     * @param tolerance - optional query tolerance to use
     * @param sorts - optional sort settings to use
     * @param pagination - optional pagination settings to use
     * @returns the URL
     * @see https://github.com/SolarNetwork/solarnetwork/wiki/SolarQuery-Stream-API#datum-stream-reading-list
     */
    streamReadingUrl(readingType, datumFilter, tolerance, sorts, pagination) {
        const filter = datumFilter
            ? new DatumFilter(datumFilter)
            : this.datumFilter();
        filter.prop("readingType", readingType.name);
        if (tolerance) {
            filter.prop("tolerance", tolerance);
        }
        const params = filter.toUriEncodingWithSorting(sorts, pagination);
        let result = this.baseUrl() + "/datum/stream/reading";
        if (params.length > 0) {
            result += "?" + params;
        }
        return result;
    }
    /**
     * Generate a URL for querying for the most recent datum.
     *
     * @param datumFilter - the search criteria; if not provided then {@link Net.UrlHelper#datumFilter this.datumFilter()} will be used
     * @param sorts - optional sort settings to use
     * @param pagination - optional pagination settings to use
     * @returns the URL
     */
    mostRecentDatumUrl(datumFilter, sorts, pagination) {
        const filter = datumFilter || this.datumFilter();
        const params = filter.toUriEncodingWithSorting(sorts, pagination);
        let result = this.baseUrl() + "/datum/mostRecent";
        if (params.length > 0) {
            result += "?" + params;
        }
        return result;
    }
};
export default DatumUrlHelperMixin;
//# sourceMappingURL=datumUrlHelperMixin.js.map