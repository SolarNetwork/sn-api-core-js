/**
 * Create a LocationUrlHelperMixin class.
 *
 * @param superclass the UrlHelper class to mix onto
 * @return the mixin class
 * @ignore
 */
const LocationsUrlHelperMixin = (superclass) => 
/**
 * A mixin class that adds support for SolarLocation properties to a {@link Net.UrlHelper}.
 */
class LocationsUrlHelperMixin extends superclass {
    /**
     * Generate a URL to find locations based on a search criteria.
     *
     * @param filter - the search criteria
     * @param sorts - optional sort settings to use
     * @param pagination optional pagination settings to use
     * @returns the generated URL
     */
    findLocationsUrl(filter, sorts, pagination) {
        return (this.baseUrl() +
            "/location?" +
            filter.toUriEncodingWithSorting(sorts, pagination));
    }
};
export default LocationsUrlHelperMixin;
//# sourceMappingURL=locationsUrlHelperMixin.js.map