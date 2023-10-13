import ComparableEnum from "../util/comparableEnum.js";
/**
 * An enumeration of supported location precision names.
 */
declare enum LocationPrecisionNames {
    /** GPS coordinates. */
    LatLong = "LatLong",
    /** A city block. */
    Block = "Block",
    /** A a street. */
    Street = "Street",
    /** A postal code (or "zip code"). */
    PostalCode = "PostalCode",
    /** A town or city. */
    Locality = "Locality",
    /** A state or province. */
    StateOrProvince = "StateOrProvince",
    /** A large region. */
    Region = "Region",
    /** A time zone. */
    TimeZone = "TimeZone",
    /** A country. */
    Country = "Country"
}
/**
 * A location precision object for use with defining named geographic precision.
 */
declare class LocationPrecision extends ComparableEnum {
    /**
     * Constructor.
     *
     * @param name - the unique name for this precision
     * @param precision - a relative precision value for this precision
     */
    constructor(name: string, precision: number);
    /**
     * Get the relative precision value.
     *
     * This is an alias for {@link Util.ComparableEnum.value}.
     *
     * @returns the precision
     */
    get precision(): number;
    /**
     * @override
     * @inheritdoc
     */
    static enumValues(): readonly LocationPrecision[];
}
/**
 * A mapping of location precision names to associated enum instances.
 */
type LocationPrecisionEnumsType = {
    [key in LocationPrecisionNames]: LocationPrecision;
};
/**
 * The enumeration of supported `LocationPrecision` values.
 * @see {@link Domain.LocationPrecisionNames} for the available values
 */
declare const LocationPrecisions: LocationPrecisionEnumsType;
export default LocationPrecisions;
export { LocationPrecision, type LocationPrecisionEnumsType, LocationPrecisionNames, };
//# sourceMappingURL=locationPrecision.d.ts.map