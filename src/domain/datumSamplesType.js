import KeyedEnum from "../util/keyedEnum";

/**
 * An enumeration of datum samples types.
 *
 * @extends module:util~KeyedEnum
 * @alias module:domain~DatumSamplesType
 */
export class DatumSamplesType extends KeyedEnum {
	/**
	 * Constructor.
	 *
	 * @param {string} name the unique name for this type
	 * @param {string} key the key value associated with this type
	 */
	constructor(name, key) {
		super(name, key);
		if (this.constructor === DatumSamplesType) {
			Object.freeze(this);
		}
	}

	/**
	 * Get the {@link module:domain~DatumSamplesType} values.
	 *
	 * @override
	 * @inheritdoc
	 */
	static enumValues() {
		return DatumSamplesTypeValues;
	}
}

const DatumSamplesTypeValues = Object.freeze([
	new DatumSamplesType("Instantaneous", "i"),
	new DatumSamplesType("Accumulating", "a"),
	new DatumSamplesType("Status", "s"),
	new DatumSamplesType("Tag", "t"),
]);

/**
 * The enumeration of supported `DatumSamplesType` values.
 *
 * @readonly
 * @enum {module:domain~DatumSamplesType}
 * @property {module:domain~DatumSamplesType} Instantaneous Instantaneous number property values.
 * @property {module:domain~DatumSamplesType} Accumulating Accumulating meter-style number property values.
 * @property {module:domain~DatumSamplesType} Status String status property values.
 * @property {module:domain~DatumSamplesType} Tag Arbitrary string names.
 * @alias module:domain~DatumSamplesTypes
 */
const DatumSamplesTypes = DatumSamplesType.enumsValue(DatumSamplesTypeValues);

export default DatumSamplesTypes;
