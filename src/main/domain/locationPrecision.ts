import ComparableEnum from "../util/comparableEnum.js";

/**
 * An enumeration of supported location precision names.
 */
enum LocationPrecisionNames {
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
	Country = "Country",
}

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
	constructor(name: string, precision: number) {
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
	get precision(): number {
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
 * A mapping of location precision names to associated enum instances.
 */
type LocationPrecisionEnumsType = {
	[key in LocationPrecisionNames]: LocationPrecision;
};

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
const LocationPrecisions = LocationPrecision.enumsValue(
	LocationPrecisionValues
) as LocationPrecisionEnumsType;

export default LocationPrecisions;
export {
	LocationPrecision,
	type LocationPrecisionEnumsType,
	LocationPrecisionNames,
};
