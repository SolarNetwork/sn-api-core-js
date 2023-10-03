import Enum from "../util/enum.js";

/**
 * A named query combining action type.
 *
 * @extends module:util~Enum
 * @alias module:domain~CombiningType
 */
export class CombiningType extends Enum {
	/**
	 * Constructor.
	 *
	 * @param {string} name the unique name for this type
	 */
	constructor(name) {
		super(name);
		if (this.constructor === CombiningType) {
			Object.freeze(this);
		}
	}

	/**
	 * Get the {@link module:domain~CombiningTypes} values.
	 *
	 * @override
	 * @inheritdoc
	 */
	static enumValues() {
		return CombiningTypeValues;
	}
}

const CombiningTypeValues = Object.freeze([
	new CombiningType("Average"),
	new CombiningType("Sum"),
	new CombiningType("Difference"),
]);

/**
 * The enumeration of supported CombiningType values.
 *
 * @readonly
 * @enum {module:domain~CombiningType}
 * @property {module:domain~CombiningType} Average average
 * @property {module:domain~CombiningType} Difference difference; note the order of mapped IDs is significant
 * @property {module:domain~CombiningType} Sum sum
 * @alias module:domain~CombiningTypes
 */
const CombiningTypes = CombiningType.enumsValue(CombiningTypeValues);

export default CombiningTypes;
