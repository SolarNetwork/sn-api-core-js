import KeyedEnum from "../util/keyedEnum.js";
/**
 * An enumeration of supported datum reading type names.
 */
declare enum DatumReadingTypeNames {
    /**
     * Derive a single reading value based from one datum the nearest before a
     * specific time and one the nearest after.
     */
    CalculatedAt = "CalculatedAt",
    /**
     * Calculate the difference between two reading values on two dates, using the
     * `CalcualtedAt` style of deriving the start and end readings.
     */
    CalculatedAtDifference = "CalculatedAtDifference",
    /**
     * Find the difference between two datum that are nearest in time on or before
     * two dates, without any limits on how near to those dates the datum are.
     */
    NearestDifference = "NearestDifference",
    /**
     * Find the difference between two datum that are nearest in time and within
     * two dates.
     */
    Difference = "Difference",
    /**
     * Find the difference between two datum that are nearest in time on or before
     * two dates, constrained by a maximum time tolerance.
     */
    DifferenceWithin = "DifferenceWithin"
}
/**
 * An enumeration of datum reading types.
 */
declare class DatumReadingType extends KeyedEnum {
    /**
     * Constructor.
     *
     * @param name - the unique name for this type
     * @param key - the key value associated with this type
     */
    constructor(name: string, key: string);
    /**
     * @override
     * @inheritdoc
     */
    static enumValues(): readonly DatumReadingType[];
}
/**
 * A mapping of datum reading type names to associated enum instances.
 */
type DatumReadingTypeEnumsType = {
    [key in DatumReadingTypeNames]: DatumReadingType;
};
/**
 * The enumeration of supported `DatumReadingType` values.
 * @see {@link Domain.DatumReadingTypeNames} for the available values
 */
declare const DatumReadingTypes: DatumReadingTypeEnumsType;
export default DatumReadingTypes;
export { DatumReadingType, type DatumReadingTypeEnumsType, DatumReadingTypeNames, };
//# sourceMappingURL=datumReadingType.d.ts.map