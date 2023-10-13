import Enum from "../util/enum.js";
/**
 * An enumeration of supported datum auxiliary type names.
 */
declare enum DatumAuxiliaryTypeNames {
    /** Reset. */
    Reset = "Reset"
}
/**
 * A datum auxiliary type.
 */
declare class DatumAuxiliaryType extends Enum {
    /**
     * Constructor.
     *
     * @param name - the unique name for this type
     */
    constructor(name: string);
    /**
     * @override
     * @inheritdoc
     */
    static enumValues(): readonly DatumAuxiliaryType[];
}
/**
 * A mapping of datum auxiliary type names to associated enum instances.
 */
type DatumAuxiliaryTypeEnumsType = {
    [key in DatumAuxiliaryTypeNames]: DatumAuxiliaryType;
};
/**
 * The enumeration of supported DatumAuxiliaryType values.
 * @see {@link Domain.DatumAuxiliaryTypeNames} for the available values
 */
declare const DatumAuxiliaryTypes: DatumAuxiliaryTypeEnumsType;
export default DatumAuxiliaryTypes;
export { DatumAuxiliaryType, type DatumAuxiliaryTypeEnumsType, DatumAuxiliaryTypeNames, };
//# sourceMappingURL=datumAuxiliaryType.d.ts.map