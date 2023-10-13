import KeydEnum from "../util/keyedEnum.js";

/**
 * An enumeration of supported datum stream type names.
 */
enum DatumStreamTypeNames {
	/** Node. */
	Node = "Node",

	/** Location. */
	Location = "Location",
}

/**
 * An enumeration of datum stream types.
 */
class DatumStreamType extends KeydEnum {
	/**
	 * Constructor.
	 *
	 * @param name - the unique name for this type
	 * @param key - the key value associated with this type
	 */
	constructor(name: string, key: string) {
		super(name, key);
	}

	/**
	 * @override
	 * @inheritdoc
	 */
	static enumValues() {
		return DatumStreamTypeValues;
	}
}

/**
 * A mapping of datum stream type names to associated enum instances.
 */
type DatumStreamTypeEnumsType = {
	[key in DatumStreamTypeNames]: DatumStreamType;
};

/**
 * The datum stream type enum values array.
 */
const DatumStreamTypeValues = Object.freeze([
	new DatumStreamType(DatumStreamTypeNames.Node, "n"),
	new DatumStreamType(DatumStreamTypeNames.Location, "l"),
]);

/**
 * The enumeration of supported `DatumStreamType` values.
 * @see {@link Domain.DatumStreamTypeNames} for the available values
 */
const DatumStreamTypes = DatumStreamType.enumsValue(
	DatumStreamTypeValues
) as DatumStreamTypeEnumsType;

export default DatumStreamTypes;
export { DatumStreamType, type DatumStreamTypeEnumsType, DatumStreamTypeNames };
