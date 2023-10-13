import KeydEnum from "../util/keyedEnum.js";
/**
 * An enumeration of supported datum stream type names.
 */
declare enum DatumStreamTypeNames {
    /** Node. */
    Node = "Node",
    /** Location. */
    Location = "Location"
}
/**
 * An enumeration of datum stream types.
 */
declare class DatumStreamType extends KeydEnum {
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
    static enumValues(): readonly DatumStreamType[];
}
/**
 * A mapping of datum stream type names to associated enum instances.
 */
type DatumStreamTypeEnumsType = {
    [key in DatumStreamTypeNames]: DatumStreamType;
};
/**
 * The enumeration of supported `DatumStreamType` values.
 * @see {@link Domain.DatumStreamTypeNames} for the available values
 */
declare const DatumStreamTypes: DatumStreamTypeEnumsType;
export default DatumStreamTypes;
export { DatumStreamType, type DatumStreamTypeEnumsType, DatumStreamTypeNames };
//# sourceMappingURL=datumStreamType.d.ts.map