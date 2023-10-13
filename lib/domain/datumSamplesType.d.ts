import KeyedEnum from "../util/keyedEnum.js";
/**
 * An enumeration of supported datum sample type names.
 */
declare enum DatumSamplesTypeNames {
    /** Instantaneous number property values. */
    Instantaneous = "Instantaneous",
    /** Accumulating meter-style number property values. */
    Accumulating = "Accumulating",
    /** String status property values. */
    Status = "Status",
    /** Arbitrary string names. */
    Tag = "Tag"
}
/**
 * An enumeration of datum samples types.
 */
declare class DatumSamplesType extends KeyedEnum {
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
    static enumValues(): readonly DatumSamplesType[];
}
/**
 * A mapping of datum sample type names to associated enum instances.
 */
type DatumSamplesTypeEnumsType = {
    [key in DatumSamplesTypeNames]: DatumSamplesType;
};
/**
 * The enumeration of supported `DatumSamplesType` values.
 * @see {@link Domain.DatumSamplesTypeNames} for the available values
 */
declare const DatumSamplesTypes: DatumSamplesTypeEnumsType;
export default DatumSamplesTypes;
export { DatumSamplesType, type DatumSamplesTypeEnumsType, DatumSamplesTypeNames, };
//# sourceMappingURL=datumSamplesType.d.ts.map