import Enum from "../util/enum";

/**
 * A datum auxiliary type.
 *
 * @extends module:util~Enum
 * @alias module:domain~DatumAuxiliaryType
 */
export class DatumAuxiliaryType extends Enum {
	/**
	 * Constructor.
	 *
	 * @param {string} name the unique name for this type
	 */
	constructor(name) {
		super(name);
		if (this.constructor === DatumAuxiliaryType) {
			Object.freeze(this);
		}
	}

	/**
	 * Get the {@link module:domain~DatumAuxiliaryTypes} values.
	 *
	 * @override
	 * @inheritdoc
	 */
	static enumValues() {
		return DatumAuxiliaryTypeValues;
	}
}

const DatumAuxiliaryTypeValues = Object.freeze([new DatumAuxiliaryType("Reset")]);

/**
 * The enumeration of supported DatumAuxiliaryType values.
 *
 * @readonly
 * @enum {module:domain~DatumAuxiliaryType}
 * @property {module:domain~DatumAuxiliaryType} Reset reset
 * @alias module:domain~DatumAuxiliaryTypes
 */
const DatumAuxiliaryTypes = DatumAuxiliaryType.enumsValue(DatumAuxiliaryTypeValues);

export default DatumAuxiliaryTypes;
