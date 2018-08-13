import Enum from '../util/enum';

/**
 * An enumeration of datum reading types.
 * 
 * @extends module:util~Enum
 * @alias module:domain~DatumReadingType
 */
export class DatumReadingType extends Enum {

	/**
     * Constructor.
     * 
     * @param {string} name the unique name for this type 
     */
    constructor(name, key) {
        super(name);
        this._key = key;
		if ( this.constructor === DatumReadingType ) {
			Object.freeze(this);
		}
    }

    /**
     * Get the key value.
     * 
     * @returns {string} the key value
     */
    get key() {
        return this._key;
    }

	/**
	 * Get the {@link module:domain~DatumReadingType} values.
	 * 
	 * @override
	 * @inheritdoc
	 */
	static enumValues() {
		return DatumReadingTypeValues;
	}

}

const DatumReadingTypeValues = Object.freeze([
	new DatumReadingType('CalculatedAt', 'at'),
    new DatumReadingType('CalculatedAtDifference', 'atd'),
    new DatumReadingType('NearestDifference', 'diff')
]);

/**
 * The enumeration of supported `DatumReadingType` values.
 * 
 * @readonly
 * @enum {module:domain~DatumReadingType}
 * @property {module:domain~DatumReadingType} CalculatedAt Derive a single reading value based
 * from one datum the nearest before a specific time and one the nearest after.
 * @property {module:domain~DatumReadingType} CalculatedAtDifference Calculate the difference 
 * between two reading values on two dates, using the `CalcualtedAt` style of deriving the start
 * and end readings.
 * @property {module:domain~DatumReadingType} NearestDifference Find the difference between two 
 * datum that are nearest in time on or before two dates.
 * @alias module:domain~DatumReadingTypes
 */
const DatumReadingTypes = DatumReadingType.enumsValue(DatumReadingTypeValues);

export default DatumReadingTypes;
