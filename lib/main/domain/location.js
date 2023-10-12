import PropMap from "../util/propMap.js";
/** An enumeration of location property keys. */
var LocationKeys;
(function (LocationKeys) {
    LocationKeys["Country"] = "country";
    LocationKeys["Elevation"] = "elevation";
    LocationKeys["Latitude"] = "latitude";
    LocationKeys["ID"] = "id";
    LocationKeys["Locality"] = "locality";
    LocationKeys["Longitude"] = "longitude";
    LocationKeys["Name"] = "name";
    LocationKeys["PostalCode"] = "postalCode";
    LocationKeys["Region"] = "region";
    LocationKeys["StateOrProvince"] = "stateOrProvince";
    LocationKeys["Street"] = "street";
    LocationKeys["TimeZoneId"] = "timeZoneId";
})(LocationKeys || (LocationKeys = {}));
/** Sorted list of all location key values. */
const LocationPropertyNames = Object.values(LocationKeys).sort();
/** A set of location key values. */
const LocationPropertyNamesSet = new Set(LocationPropertyNames);
/**
 * A geographic location.
 */
class Location extends PropMap {
    /**
     * Constructor.
     *
     * @param loc - the location to copy properties from
     */
    constructor(loc) {
        super(loc);
    }
    /**
     * A SolarNetwork assigned unique identifier.
     */
    get id() {
        return this.prop(LocationKeys.ID);
    }
    set id(val) {
        this.prop(LocationKeys.ID, val);
    }
    /**
     * A generalized name, can be used for "virtual" locations.
     */
    get name() {
        return this.prop(LocationKeys.Name);
    }
    set name(val) {
        this.prop(LocationKeys.Name, val);
    }
    /**
     * An ISO 3166-1 alpha-2 character country code.
     */
    get country() {
        return this.prop(LocationKeys.Country);
    }
    set country(val) {
        this.prop(LocationKeys.Country, val);
    }
    /**
     * A country-specific regional identifier.
     */
    get region() {
        return this.prop(LocationKeys.Region);
    }
    set region(val) {
        this.prop(LocationKeys.Region, val);
    }
    /**
     * A country-specific state or province identifier.
     */
    get stateOrProvince() {
        return this.prop(LocationKeys.StateOrProvince);
    }
    set stateOrProvince(val) {
        this.prop(LocationKeys.StateOrProvince, val);
    }
    /**
     * Get the locality (city, town).
     */
    get locality() {
        return this.prop(LocationKeys.Locality);
    }
    set locality(val) {
        this.prop(LocationKeys.Locality, val);
    }
    /**
     * A country-specific postal code.
     */
    get postalCode() {
        return this.prop(LocationKeys.PostalCode);
    }
    set postalCode(val) {
        this.prop(LocationKeys.PostalCode, val);
    }
    /**
     * The street address.
     */
    get street() {
        return this.prop(LocationKeys.Street);
    }
    set street(val) {
        this.prop(LocationKeys.Street, val);
    }
    /**
     * The decimal world latitude.
     */
    get latitude() {
        return this.prop(LocationKeys.Latitude);
    }
    set latitude(val) {
        this.prop(LocationKeys.Latitude, val);
    }
    /**
     * The decimal world longitude.
     */
    get longitude() {
        return this.prop(LocationKeys.Longitude);
    }
    set longitude(val) {
        this.prop(LocationKeys.Longitude, val);
    }
    /**
     * The elevation above sea level, in meters.
     */
    get elevation() {
        return this.prop(LocationKeys.Elevation);
    }
    set elevation(val) {
        this.prop(LocationKeys.Elevation, val);
    }
    /**
     * A time zone ID, for example `Pacific/Auckland`.
     */
    get timeZoneId() {
        return this.prop(LocationKeys.TimeZoneId);
    }
    set timeZoneId(val) {
        this.prop(LocationKeys.TimeZoneId, val);
    }
}
export default Location;
export { LocationKeys, LocationPropertyNames, LocationPropertyNamesSet, };
//# sourceMappingURL=location.js.map