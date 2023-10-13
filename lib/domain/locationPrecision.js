import ComparableEnum from "../util/comparableEnum.js";
/**
 * An enumeration of supported location precision names.
 */
var LocationPrecisionNames;
(function (LocationPrecisionNames) {
    /** GPS coordinates. */
    LocationPrecisionNames["LatLong"] = "LatLong";
    /** A city block. */
    LocationPrecisionNames["Block"] = "Block";
    /** A a street. */
    LocationPrecisionNames["Street"] = "Street";
    /** A postal code (or "zip code"). */
    LocationPrecisionNames["PostalCode"] = "PostalCode";
    /** A town or city. */
    LocationPrecisionNames["Locality"] = "Locality";
    /** A state or province. */
    LocationPrecisionNames["StateOrProvince"] = "StateOrProvince";
    /** A large region. */
    LocationPrecisionNames["Region"] = "Region";
    /** A time zone. */
    LocationPrecisionNames["TimeZone"] = "TimeZone";
    /** A country. */
    LocationPrecisionNames["Country"] = "Country";
})(LocationPrecisionNames || (LocationPrecisionNames = {}));
/**
 * A location precision object for use with defining named geographic precision.
 */
class LocationPrecision extends ComparableEnum {
    /**
     * Constructor.
     *
     * @param name - the unique name for this precision
     * @param precision - a relative precision value for this precision
     */
    constructor(name, precision) {
        super(name, precision);
        if (this.constructor === LocationPrecision) {
            Object.freeze(this);
        }
    }
    /**
     * Get the relative precision value.
     *
     * This is an alias for {@link Util.ComparableEnum.value}.
     *
     * @returns the precision
     */
    get precision() {
        return this.value;
    }
    /**
     * @override
     * @inheritdoc
     */
    static enumValues() {
        return LocationPrecisionValues;
    }
}
/**
 * The location precision enum values array.
 */
const LocationPrecisionValues = Object.freeze([
    new LocationPrecision(LocationPrecisionNames.LatLong, 1),
    new LocationPrecision(LocationPrecisionNames.Block, 5),
    new LocationPrecision(LocationPrecisionNames.Street, 10),
    new LocationPrecision(LocationPrecisionNames.PostalCode, 20),
    new LocationPrecision(LocationPrecisionNames.Locality, 30),
    new LocationPrecision(LocationPrecisionNames.StateOrProvince, 40),
    new LocationPrecision(LocationPrecisionNames.Region, 50),
    new LocationPrecision(LocationPrecisionNames.TimeZone, 60),
    new LocationPrecision(LocationPrecisionNames.Country, 70),
]);
/**
 * The enumeration of supported `LocationPrecision` values.
 * @see {@link Domain.LocationPrecisionNames} for the available values
 */
const LocationPrecisions = LocationPrecision.enumsValue(LocationPrecisionValues);
export default LocationPrecisions;
export { LocationPrecision, LocationPrecisionNames, };
//# sourceMappingURL=locationPrecision.js.map