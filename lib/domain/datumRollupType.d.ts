import KeyedEnum from "../util/keyedEnum.js";
/**
 * An enumeration of supported datum rollup type names.
 */
declare enum DatumRollupTypeNames {
    /**
     * No rollup.
     */
    None = "None",
    /**
     * Rollup everything into a single result.
     */
    All = "All",
    /**
     * Rollup the time component of the results.
     */
    Time = "Time",
    /**
     * Rollup the node component of the results.
     */
    Node = "Node",
    /**
     * Rollup the source component of the results.
     */
    Source = "Source"
}
/**
 * An enumeration of datum reading types.
 */
declare class DatumRollupType extends KeyedEnum {
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
    static enumValues(): readonly DatumRollupType[];
}
/**
 * A mapping of datum reading type names to associated enum instances.
 */
type DatumRollupTypeEnumsType = {
    [key in DatumRollupTypeNames]: DatumRollupType;
};
/**
 * The enumeration of supported `DatumRollupType` values.
 * @see {@link Domain.DatumRollupTypeNames} for the available values
 */
declare const DatumRollupTypes: DatumRollupTypeEnumsType;
export default DatumRollupTypes;
export { DatumRollupType, type DatumRollupTypeEnumsType, DatumRollupTypeNames };
//# sourceMappingURL=datumRollupType.d.ts.map