const LocationIdsKey = 'locationIds';
const SourceIdsKey = 'sourceIds';

/**
 * Create a LocationUrlHelperMixin class.
 *
 * @param {module:net~UrlHelper} superclass the UrlHelper class to mix onto
 * @return {module:net~LocationUrlHelperMixin} the mixin class
 */
const LocationUrlHelperMixin = (superclass) => 

/**
 * A mixin class that adds support for SolarLocation properties to a {@link module:net~UrlHelper}.
 * 
 * @mixin
 * @alias module:net~LocationUrlHelperMixin
 */
class extends superclass {

    /**
     * The first available location ID from the `locationIds` property.
     * Setting this replaces any existing location IDs with an array of just that value.
     * @type {number}
     */
    get locationId() {
        const locationIds = this.locationIds;
        return (Array.isArray(locationIds) && locationIds.length > 0 ? locationIds[0] : null);
    }

    set locationId(locationId) {
        this.parameter(LocationIdsKey, locationId ? [locationId] : null);
    }

    /**
     * An array of location IDs, set on the `locationIds` parameter
     * @type {number[]}
     */
    get locationIds() {
        return this.parameter(LocationIdsKey);
    }

    set locationIds(locationIds) {
        this.parameter(LocationIdsKey, locationIds);
    }

    /**
     * The first available source ID from the `sourceIds` property.
     * Setting this replaces any existing location IDs with an array of just that value.
     * @type {string}
     */
    get sourceId() {
        const sourceIds = this.sourceIds;
        return (Array.isArray(sourceIds) && sourceIds.length > 0 ? sourceIds[0] : null);
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

}

export default LocationUrlHelperMixin;
