import KeydEnum from "../util/keyedEnum.js";

/**
 * An enumeration of datum stream types.
 *
 * @extends module:util~KeydEnum
 * @alias module:domain~DatumStreamType
 */
export class DatumStreamType extends KeydEnum {
	/**
	 * Constructor.
	 *
	 * @param {string} name the unique name for this type
	 * @param {string} key the key value associated with this type
	 */
	constructor(name, key) {
		super(name, key);
	}

	/**
	 * Get the {@link module:domain~DatumStreamType} values.
	 *
	 * @override
	 * @inheritdoc
	 */
	static enumValues() {
		return DatumStreamTypeValues;
	}
}

const DatumStreamTypeValues = Object.freeze([
	new DatumStreamType("Node", "n"),
	new DatumStreamType("Location", "l"),
]);

/**
 * The enumeration of supported `DatumStreamType` values.
 *
 * @readonly
 * @enum {module:domain~DatumStreamType}
 * @property {module:domain~DatumStreamType} Node A node-based datum stream.
 * @property {module:domain~DatumStreamType} Location A location-based datum stream.
 * @alias module:domain~DatumStreamType
 */
const DatumStreamTypes = DatumStreamType.enumsValue(DatumStreamTypeValues);

export default DatumStreamTypes;
