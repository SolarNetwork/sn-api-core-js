import Enum from "../util/enum.js";

/**
 * An enumeration of supported combining type names.
 */
enum CombiningTypeNames {
	/** Average. */
	Average = "Average",

	/** Sum. */
	Sum = "Sum",

	/** Difference; note the order of mapped IDs is significant. */
	Difference = "Difference",
}

/**
 * A named query combining action type.
 */
class CombiningType extends Enum {
	/**
	 * Constructor.
	 *
	 * @param name - the unique name for this type
	 */
	constructor(name: string) {
		super(name);
		if (this.constructor === CombiningType) {
			Object.freeze(this);
		}
	}

	/**
	 * @override
	 * @inheritdoc
	 */
	static enumValues() {
		return CombiningTypeValues;
	}
}

/**
 * A mapping of combining type names to associated enum instances.
 */
type CombiningTypeEnumsType = {
	[key in CombiningTypeNames]: CombiningType;
};

/**
 * The combining type enum values array.
 */
const CombiningTypeValues = Object.freeze([
	new CombiningType(CombiningTypeNames.Average),
	new CombiningType(CombiningTypeNames.Sum),
	new CombiningType(CombiningTypeNames.Difference),
]);

/**
 * The enumeration of supported CombiningType values.
 * @see {@link Domain.CombiningTypeNames} for the available values
 */
const CombiningTypes = CombiningType.enumsValue(
	CombiningTypeValues
) as CombiningTypeEnumsType;

export default CombiningTypes;
export { CombiningType, type CombiningTypeEnumsType, CombiningTypeNames };
