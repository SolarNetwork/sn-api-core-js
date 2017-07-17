import ComparableEnum from 'comparableEnum';

/**
 * A location precision object for use with defining named geographic precision.
 * 
 * @extends ComparableEnum
 */
export class LocationPrecision extends ComparableEnum {

    /**
     * Constructor.
     * 
     * @param {string} name the unique name for this precision 
     * @param {number} precision a relative precision value for this precision 
     */
    constructor(name, precision) {
        super(name, precision);
        if ( this.constructor === LocationPrecision ) {
            Object.freeze(this);
        }
    }

    /**
     * Get the relative precision value.
     * 
     * This is an alias for {@link #name}.
     * 
     * @returns {number} the precision
     */
    get precision() {
        return this.value;
    }

	/**
	 * Get the {@link LocationPrecisions} values.
	 * 
     * @override
	 * @inheritdoc
	 */
	static enumValues() {
		return LocationPrecisionValues;
	}
}

const LocationPrecisionValues = Object.freeze([
    new LocationPrecision('LatLong', 1),
    new LocationPrecision('Block', 5),
    new LocationPrecision('Street', 10),
    new LocationPrecision('PostalCode', 20),
    new LocationPrecision('Locality', 30),
    new LocationPrecision('StateOrProvince', 40),
    new LocationPrecision('Region', 50),
    new LocationPrecision('TimeZone', 60),
    new LocationPrecision('Country', 70),
]);

/**
 * The enumeration of supported LocationPrecision values.
 * 
 * @readonly
 * @enum {LocationPrecision}
 * @property {LocationPrecision} LatLong GPS coordinates
 * @property {LocationPrecision} Block a city block
 * @property {LocationPrecision} Street a street
 * @property {LocationPrecision} PostalCode a postal code (or "zip code")
 * @property {LocationPrecision} Locality a town or city
 * @property {LocationPrecision} StateOrProvince a state or province
 * @property {LocationPrecision} Region a large region
 * @property {LocationPrecision} TimeZone a time zone
 * @property {LocationPrecision} Country a country
 */
const LocationPrecisions = LocationPrecision.enumsValue(LocationPrecisionValues);

export default LocationPrecisions;
