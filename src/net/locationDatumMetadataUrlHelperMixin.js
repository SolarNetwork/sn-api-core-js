import UrlHelper from './urlHelper';
import LocationUrlHelperMixin from './locationUrlHelperMixin';
import QueryUrlHelperMixin from './queryUrlHelperMixin'

/**
 * Create a LocationDatumMetadataUrlHelperMixin class.
 *
 * @param {module:net~UrlHelper} superclass the UrlHelper class to mix onto
 * @return {module:net~LocationDatumMetadataUrlHelperMixin} the mixin class
 */
const LocationDatumMetadataUrlHelperMixin = (superclass) => 

/**
 * A mixin class that adds SolarNode datum metadata support to {@link module:net~UrlHelper}.
 * 
 * <p>Location datum metadata is metadata associated with a specific location and source, i.e. 
 * a `locationId` and a `sourceId`.
 * 
 * @mixin
 * @alias module:net~LocationDatumMetadataUrlHelperMixin
 */
class extends superclass {

    /**
     * Get a base URL for location datum metadata operations using a specific location ID.
     * 
     * @param {number} [locationId] a specific location ID to use; if not provided the `locationId` property of this class will be used
     * @returns {string} the base URL
     * @private
     */
    baseLocationDatumMetadataUrl(locationId) {
        return this.baseUrl() + '/location/meta/' +(locationId || this.locationId);
    }

    locationDatumMetadataUrlWithSource(locationId, sourceId) {
        let result = this.baseLocationDatumMetadataUrl(locationId);
        let source = (sourceId || this.sourceId);
        if ( sourceId !== null && source ) {
            result += '?sourceId=' +encodeURIComponent(source);
        }
        return result;
    }

	/**
	 * Generate a URL for viewing datum metadata.
     * 
     * If no `sourceId` is provided, then the API will return all available datum metadata for all sources.
	 *
	 * @param {number} [locationId] a specific location ID to use; if not provided the `locationId` property of this class will be used
	 * @param {string} [sourceId] a specific source ID to use; 
     *                            if not provided the `sourceId` property of this class will be used;
     *                            if `null` then ignore any `sourceId` property of this class
     * @returns {string} the URL
	 */
	viewLocationDatumMetadataUrl(locationId, sourceId) {
        return this.locationDatumMetadataUrlWithSource(locationId, sourceId);
    }
    
	/**
	 * Generate a URL for adding (merging) datum metadata via a `POST` request.
     * 
	 * @param {number} [locationId] a specific location ID to use; if not provided the `locationId` property of this class will be used
	 * @param {string} [sourceId] a specific source ID to use; if not provided the `sourceId` property of this class will be used
     * @returns {string} the URL
	 */
    addLocationDatumMetadataUrl(locationId, sourceId) {
        return this.locationDatumMetadataUrlWithSource(locationId, sourceId);
    }

	/**
	 * Generate a URL for setting datum metadata via a `PUT` request.
     * 
	 * @param {number} [locationId] a specific location ID to use; if not provided the `locationId` property of this class will be used
	 * @param {string} [sourceId] a specific source ID to use; if not provided the `sourceId` property of this class will be used
     * @returns {string} the URL
	 */
    replaceLocationDatumMetadataUrl(locationId, sourceId) {
        return this.locationDatumMetadataUrlWithSource(locationId, sourceId);
    }

	/**
	 * Generate a URL for deleting datum metadata via a `DELETE` request.
     * 
	 * @param {number} [locationId] a specific location ID to use; if not provided the `locationId` property of this class will be used
	 * @param {string} [sourceId] a specific source ID to use; if not provided the `sourceId` property of this class will be used
     * @returns {string} the URL
	 */
    deleteLocationDatumMetadataUrl(locationId, sourceId) {
        return this.locationDatumMetadataUrlWithSource(locationId, sourceId);
    }

	/**
	 * Generate a URL for searching for location metadata.
	 * 
     * @param {module:domain~DatumFilter} [filter] a search filter; the `locationIds`, `sourceIds`, `tags`,
	 *                                    `query`, and `location` properties are supported 
	 * @param {module:domain~SortDescriptor[]} [sorts] optional sort settings to use
	 * @param {module:domain~Pagination} [pagination] optional pagination settings to use
	 * @returns {string} the URL
	 */
	findLocationDatumMetadataUrl(filter, sorts, pagination) {
		let result = this.baseUrl() + '/location/meta'
		let params = filter.toUriEncodingWithSorting(sorts, pagination);
		if ( params.length > 0 ) {
			result += '?' + params;
		}
		return result;
	}

};

/**
 * A concrete {@link module:net~UrlHelper} with the {@link module:net~LocationDatumMetadataUrlHelperMixin},  
 * {@link module:net~QueryUrlHelperMixin}, and {@link module:net~LocationUrlHelperMixin} mixins.
 * 
 * @mixes module:net~LocationDatumMetadataUrlHelperMixin
 * @mixes module:net~QueryUrlHelperMixin
 * @mixes module:net~LocationUrlHelperMixin
 * @extends module:net~UrlHelper
 * @alias module:net~LocationDatumMetadataUrlHelper
 */
class LocationDatumMetadataUrlHelper extends LocationDatumMetadataUrlHelperMixin(QueryUrlHelperMixin(LocationUrlHelperMixin(UrlHelper))) {

}

export default LocationDatumMetadataUrlHelperMixin;
export { LocationDatumMetadataUrlHelper };
