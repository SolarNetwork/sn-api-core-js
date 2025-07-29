import KeyedEnum from "../util/keyedEnum.js";

/**
 * An enumeration of supported datum rollup type names.
 */
enum DatumRollupTypeNames {
	/**
	 * No rollup.
	 */
	None = "None",

	/**
	 * Rollup everything into a single result.
	 */
	All = "All",

	/**
	 * Rollup the time component of the results.
	 */
	Time = "Time",

	/**
	 * Rollup the node component of the results.
	 */
	Node = "Node",

	/**
	 * Rollup the source component of the results.
	 */
	Source = "Source",
}

/**
 * An enumeration of datum reading types.
 */
class DatumRollupType extends KeyedEnum {
	/**
	 * Constructor.
	 *
	 * @param name - the unique name for this type
	 * @param key - the key value associated with this type
	 */
	constructor(name: string, key: string) {
		super(name, key);
		if (this.constructor === DatumRollupType) {
			Object.freeze(this);
		}
	}

	/**
	 * @override
	 * @inheritdoc
	 */
	static enumValues() {
		return DatumRollupTypeValues;
	}
}

/**
 * A mapping of datum reading type names to associated enum instances.
 */
type DatumRollupTypeEnumsType = {
	[key in DatumRollupTypeNames]: DatumRollupType;
};

/**
 * The datum reading type enum values array.
 */
const DatumRollupTypeValues = Object.freeze([
	new DatumRollupType(DatumRollupTypeNames.None, "0"),
	new DatumRollupType(DatumRollupTypeNames.All, "a"),
	new DatumRollupType(DatumRollupTypeNames.Time, "t"),
	new DatumRollupType(DatumRollupTypeNames.Node, "n"),
	new DatumRollupType(DatumRollupTypeNames.Source, "s"),
]);

/**
 * The enumeration of supported `DatumRollupType` values.
 * @see {@link Domain.DatumRollupTypeNames} for the available values
 */
const DatumRollupTypes = DatumRollupType.enumsValue(
	DatumRollupTypeValues
) as DatumRollupTypeEnumsType;

export default DatumRollupTypes;
export { DatumRollupType, type DatumRollupTypeEnumsType, DatumRollupTypeNames };
