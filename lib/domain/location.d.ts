import PropMap from "../util/propMap.js";
/** An enumeration of location property keys. */
declare enum LocationKeys {
    Country = "country",
    Elevation = "elevation",
    Latitude = "latitude",
    ID = "id",
    Locality = "locality",
    Longitude = "longitude",
    Name = "name",
    PostalCode = "postalCode",
    Region = "region",
    StateOrProvince = "stateOrProvince",
    Street = "street",
    TimeZoneId = "timeZoneId"
}
/** The location keys index signature type.  */
type LocationProperties = {
    [k in LocationKeys]: any;
};
/** Sorted list of all location key values. */
declare const LocationPropertyNames: LocationKeys[];
/** A set of location key values. */
declare const LocationPropertyNamesSet: Set<LocationKeys>;
/**
 * A geographic location.
 */
declare class Location extends PropMap implements LocationProperties {
    /**
     * Constructor.
     *
     * @param loc - the location to copy properties from
     */
    constructor(loc?: Location | object);
    /**
     * A SolarNetwork assigned unique identifier.
     */
    get id(): number | undefined;
    set id(val: number | null);
    /**
     * A generalized name, can be used for "virtual" locations.
     */
    get name(): string | undefined;
    set name(val: string | null);
    /**
     * An ISO 3166-1 alpha-2 character country code.
     */
    get country(): string | undefined;
    set country(val: string | null);
    /**
     * A country-specific regional identifier.
     */
    get region(): string | undefined;
    set region(val: string | null);
    /**
     * A country-specific state or province identifier.
     */
    get stateOrProvince(): string | undefined;
    set stateOrProvince(val: string | null);
    /**
     * Get the locality (city, town).
     */
    get locality(): string | undefined;
    set locality(val: string | null);
    /**
     * A country-specific postal code.
     */
    get postalCode(): string | undefined;
    set postalCode(val: string | null);
    /**
     * The street address.
     */
    get street(): string | undefined;
    set street(val: string | null);
    /**
     * The decimal world latitude.
     */
    get latitude(): number | undefined;
    set latitude(val: number | null);
    /**
     * The decimal world longitude.
     */
    get longitude(): number | undefined;
    set longitude(val: number | null);
    /**
     * The elevation above sea level, in meters.
     */
    get elevation(): number | undefined;
    set elevation(val: number | null);
    /**
     * A time zone ID, for example `Pacific/Auckland`.
     */
    get timeZoneId(): string | undefined;
    set timeZoneId(val: string | null);
}
export default Location;
export { LocationKeys, type LocationProperties, LocationPropertyNames, LocationPropertyNamesSet, };
//# sourceMappingURL=location.d.ts.map