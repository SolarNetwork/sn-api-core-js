import Enum from "../util/enum.js";

/**
 * An enumeration of supported datum auxiliary type names.
 */
enum DatumAuxiliaryTypeNames {
	/** Reset. */
	Reset = "Reset",
}

/**
 * A datum auxiliary type.
 */
class DatumAuxiliaryType extends Enum {
	/**
	 * Constructor.
	 *
	 * @param name - the unique name for this type
	 */
	constructor(name: string) {
		super(name);
		if (this.constructor === DatumAuxiliaryType) {
			Object.freeze(this);
		}
	}

	/**
	 * @override
	 * @inheritdoc
	 */
	static enumValues() {
		return DatumAuxiliaryTypeValues;
	}
}

/**
 * A mapping of datum auxiliary type names to associated enum instances.
 */
type DatumAuxiliaryTypeEnumsType = {
	[key in DatumAuxiliaryTypeNames]: DatumAuxiliaryType;
};

/**
 * The datum auxiliary type enum values array.
 */
const DatumAuxiliaryTypeValues = Object.freeze([
	new DatumAuxiliaryType(DatumAuxiliaryTypeNames.Reset),
]);

/**
 * The enumeration of supported DatumAuxiliaryType values.
 * @see {@link Domain.DatumAuxiliaryTypeNames} for the available values
 */
const DatumAuxiliaryTypes = DatumAuxiliaryType.enumsValue(
	DatumAuxiliaryTypeValues
) as DatumAuxiliaryTypeEnumsType;

export default DatumAuxiliaryTypes;
export {
	DatumAuxiliaryType,
	type DatumAuxiliaryTypeEnumsType,
	DatumAuxiliaryTypeNames,
};
