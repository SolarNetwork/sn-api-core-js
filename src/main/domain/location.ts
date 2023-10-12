import PropMap from "../util/propMap.js";

/** An enumeration of location property keys. */
enum LocationKeys {
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
	TimeZoneId = "timeZoneId",
}

/** The location keys index signature type.  */
type LocationProperties = {
	[k in LocationKeys]: any;
};

/** Sorted list of all location key values. */
const LocationPropertyNames = Object.values(LocationKeys).sort();

/** A set of location key values. */
const LocationPropertyNamesSet = new Set<LocationKeys>(LocationPropertyNames);

/**
 * A geographic location.
 */
class Location extends PropMap implements LocationProperties {
	/**
	 * Constructor.
	 *
	 * @param loc - the location to copy properties from
	 */
	constructor(loc?: Location | object) {
		super(loc);
	}

	/**
	 * A SolarNetwork assigned unique identifier.
	 */
	get id(): number | undefined {
		return this.prop(LocationKeys.ID);
	}

	set id(val: number | null) {
		this.prop(LocationKeys.ID, val);
	}

	/**
	 * A generalized name, can be used for "virtual" locations.
	 */
	get name(): string | undefined {
		return this.prop(LocationKeys.Name);
	}

	set name(val: string | null) {
		this.prop(LocationKeys.Name, val);
	}

	/**
	 * An ISO 3166-1 alpha-2 character country code.
	 */
	get country(): string | undefined {
		return this.prop(LocationKeys.Country);
	}

	set country(val: string | null) {
		this.prop(LocationKeys.Country, val);
	}

	/**
	 * A country-specific regional identifier.
	 */
	get region(): string | undefined {
		return this.prop(LocationKeys.Region);
	}

	set region(val: string | null) {
		this.prop(LocationKeys.Region, val);
	}

	/**
	 * A country-specific state or province identifier.
	 */
	get stateOrProvince(): string | undefined {
		return this.prop(LocationKeys.StateOrProvince);
	}

	set stateOrProvince(val: string | null) {
		this.prop(LocationKeys.StateOrProvince, val);
	}

	/**
	 * Get the locality (city, town).
	 */
	get locality(): string | undefined {
		return this.prop(LocationKeys.Locality);
	}

	set locality(val: string | null) {
		this.prop(LocationKeys.Locality, val);
	}

	/**
	 * A country-specific postal code.
	 */
	get postalCode(): string | undefined {
		return this.prop(LocationKeys.PostalCode);
	}

	set postalCode(val: string | null) {
		this.prop(LocationKeys.PostalCode, val);
	}

	/**
	 * The street address.
	 */
	get street(): string | undefined {
		return this.prop(LocationKeys.Street);
	}

	set street(val: string | null) {
		this.prop(LocationKeys.Street, val);
	}

	/**
	 * The decimal world latitude.
	 */
	get latitude(): number | undefined {
		return this.prop(LocationKeys.Latitude);
	}

	set latitude(val: number | null) {
		this.prop(LocationKeys.Latitude, val);
	}

	/**
	 * The decimal world longitude.
	 */
	get longitude(): number | undefined {
		return this.prop(LocationKeys.Longitude);
	}

	set longitude(val: number | null) {
		this.prop(LocationKeys.Longitude, val);
	}

	/**
	 * The elevation above sea level, in meters.
	 */
	get elevation(): number | undefined {
		return this.prop(LocationKeys.Elevation);
	}

	set elevation(val: number | null) {
		this.prop(LocationKeys.Elevation, val);
	}

	/**
	 * A time zone ID, for example `Pacific/Auckland`.
	 */
	get timeZoneId(): string | undefined {
		return this.prop(LocationKeys.TimeZoneId);
	}

	set timeZoneId(val: string | null) {
		this.prop(LocationKeys.TimeZoneId, val);
	}
}

export default Location;
export {
	LocationKeys,
	type LocationProperties,
	LocationPropertyNames,
	LocationPropertyNamesSet,
};
