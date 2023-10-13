import KeyedEnum from "../util/keyedEnum.js";
/**
 * An enumeration of supported datum reading type names.
 */
var DatumReadingTypeNames;
(function (DatumReadingTypeNames) {
    /**
     * Derive a single reading value based from one datum the nearest before a
     * specific time and one the nearest after.
     */
    DatumReadingTypeNames["CalculatedAt"] = "CalculatedAt";
    /**
     * Calculate the difference between two reading values on two dates, using the
     * `CalcualtedAt` style of deriving the start and end readings.
     */
    DatumReadingTypeNames["CalculatedAtDifference"] = "CalculatedAtDifference";
    /**
     * Find the difference between two datum that are nearest in time on or before
     * two dates, without any limits on how near to those dates the datum are.
     */
    DatumReadingTypeNames["NearestDifference"] = "NearestDifference";
    /**
     * Find the difference between two datum that are nearest in time and within
     * two dates.
     */
    DatumReadingTypeNames["Difference"] = "Difference";
    /**
     * Find the difference between two datum that are nearest in time on or before
     * two dates, constrained by a maximum time tolerance.
     */
    DatumReadingTypeNames["DifferenceWithin"] = "DifferenceWithin";
})(DatumReadingTypeNames || (DatumReadingTypeNames = {}));
/**
 * An enumeration of datum reading types.
 */
class DatumReadingType extends KeyedEnum {
    /**
     * Constructor.
     *
     * @param name - the unique name for this type
     * @param key - the key value associated with this type
     */
    constructor(name, key) {
        super(name, key);
        if (this.constructor === DatumReadingType) {
            Object.freeze(this);
        }
    }
    /**
     * @override
     * @inheritdoc
     */
    static enumValues() {
        return DatumReadingTypeValues;
    }
}
/**
 * The datum reading type enum values array.
 */
const DatumReadingTypeValues = Object.freeze([
    new DatumReadingType(DatumReadingTypeNames.CalculatedAt, "at"),
    new DatumReadingType(DatumReadingTypeNames.CalculatedAtDifference, "atd"),
    new DatumReadingType(DatumReadingTypeNames.NearestDifference, "diff"),
    new DatumReadingType(DatumReadingTypeNames.Difference, "delta"),
    new DatumReadingType(DatumReadingTypeNames.DifferenceWithin, "change"),
]);
/**
 * The enumeration of supported `DatumReadingType` values.
 * @see {@link Domain.DatumReadingTypeNames} for the available values
 */
const DatumReadingTypes = DatumReadingType.enumsValue(DatumReadingTypeValues);
export default DatumReadingTypes;
export { DatumReadingType, DatumReadingTypeNames, };
//# sourceMappingURL=datumReadingType.js.map