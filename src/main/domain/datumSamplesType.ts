import KeyedEnum from "../util/keyedEnum.js";

/**
 * An enumeration of supported datum sample type names.
 */
enum DatumSamplesTypeNames {
	/** Instantaneous number property values. */
	Instantaneous = "Instantaneous",

	/** Accumulating meter-style number property values. */
	Accumulating = "Accumulating",

	/** String status property values. */
	Status = "Status",

	/** Arbitrary string names. */
	Tag = "Tag",
}

/**
 * An enumeration of datum samples types.
 */
class DatumSamplesType extends KeyedEnum {
	/**
	 * Constructor.
	 *
	 * @param name - the unique name for this type
	 * @param key - the key value associated with this type
	 */
	constructor(name: string, key: string) {
		super(name, key);
		if (this.constructor === DatumSamplesType) {
			Object.freeze(this);
		}
	}

	/**
	 * @override
	 * @inheritdoc
	 */
	static enumValues() {
		return DatumSamplesTypeValues;
	}
}

/**
 * A mapping of datum sample type names to associated enum instances.
 */
type DatumSamplesTypeEnumsType = {
	[key in DatumSamplesTypeNames]: DatumSamplesType;
};

/**
 * The datum sample type enum values array.
 */
const DatumSamplesTypeValues = Object.freeze([
	new DatumSamplesType(DatumSamplesTypeNames.Instantaneous, "i"),
	new DatumSamplesType(DatumSamplesTypeNames.Accumulating, "a"),
	new DatumSamplesType(DatumSamplesTypeNames.Status, "s"),
	new DatumSamplesType(DatumSamplesTypeNames.Tag, "t"),
]);

/**
 * The enumeration of supported `DatumSamplesType` values.
 * @see {@link Domain.DatumSamplesTypeNames} for the available values
 */
const DatumSamplesTypes = DatumSamplesType.enumsValue(
	DatumSamplesTypeValues
) as DatumSamplesTypeEnumsType;

export default DatumSamplesTypes;
export {
	DatumSamplesType,
	type DatumSamplesTypeEnumsType,
	DatumSamplesTypeNames,
};
