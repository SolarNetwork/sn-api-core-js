import PropMap from '../util/propMap';

const CountryKey = 'country';
const ElevationKey = 'elevation';
const LatitudeKey = 'latitude';
const IdKey = 'id';
const LocalityKey = 'locality';
const LongitudeKey = 'longitude';
const NameKey = 'name';
const PostalCodeKey = 'postalCode';
const RegionKey = 'region';
const StateOrProvinceKey = 'stateOrProvince';
const StreetKey = 'street';
const TimeZoneIdKey = 'timeZoneId';

/**
 * A geographic location.
 * 
 * @extends module:util~PropMap
 * @alias module:domain~Location
 */
class Location extends PropMap {

    /**
	 * Constructor.
	 * 
	 * @param {module:domain~Location|object} loc the location to copy properties from
	 */
	constructor(loc) {
        super(loc);
   }
    
    /**
     * A SolarNetwork assigned unique identifier.
     * @type {number}
     */
    get id() {
        return this.prop(IdKey);
    }

    set id(val) {
        this.prop(IdKey, val);
    }

    /**
     * A generalized name, can be used for "virtual" locations.
     * @type {string}
     */
    get name() {
        return this.prop(NameKey);
    }

    set name(val) {
        this.prop(NameKey, val);
    }

    /**
     * An ISO 3166-1 alpha-2 character country code.
     * @type {string}
     */
    get country() {
        return this.prop(CountryKey);
    }

    set country(val) {
        this.prop(CountryKey, val);
    }

    /**
     * A country-specific regional identifier.
     * @type {string}
     */
    get region() {
        return this.prop(RegionKey);
    }

    set region(val) {
        this.prop(RegionKey, val);
    }

    /**
     * A country-specific state or province identifier.
     * @type {string}
     */
    get stateOrProvince() {
        return this.prop(StateOrProvinceKey);
    }

    set stateOrProvince(val) {
        this.prop(StateOrProvinceKey, val);
    }

    /**
     * Get the locality (city, town).
     * @type {string}
     */
    get locality() {
        return this.prop(LocalityKey);
    }

    set locality(val) {
        this.prop(LocalityKey, val);
    }

    /**
     * A country-specific postal code.
     * @type {string}
     */
    get postalCode() {
        return this.prop(PostalCodeKey);
    }

    set postalCode(val) {
        this.prop(PostalCodeKey, val);
    }

    /**
     * The street address.
     * @type {string}
     */
    get street() {
        return this.prop(StreetKey);
    }

    set street(val) {
        this.prop(StreetKey, val);
    }

    /**
     * The decimal world latitude.
     * @type {number}
     */
    get latitude() {
        return this.prop(LatitudeKey);
    }

    set latitude(val) {
        this.prop(LatitudeKey, val);
    }

    /**
     * The decimal world longitude.
     * @type {number}
     */
    get longitude() {
        return this.prop(LongitudeKey);
    }

    set longitude(val) {
        this.prop(LongitudeKey, val);
    }

    /**
     * The elevation above sea level, in meters.
     * @type {number}
     */
    get elevation() {
        return this.prop(ElevationKey);
    }

    set elevation(val) {
        this.prop(ElevationKey, val);
    }

    /**
     * A time zone ID, for example `Pacific/Auckland`.
     * @type {string}
     */
    get timeZoneId() {
        return this.prop(TimeZoneIdKey)
    }

    set timeZoneId(val) {
        this.prop(TimeZoneIdKey, val);
    }

}

export default Location;
