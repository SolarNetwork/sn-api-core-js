import Enum from "../util/enum.js";
/**
 * An enumeration of supported datum auxiliary type names.
 */
var DatumAuxiliaryTypeNames;
(function (DatumAuxiliaryTypeNames) {
    /** Reset. */
    DatumAuxiliaryTypeNames["Reset"] = "Reset";
})(DatumAuxiliaryTypeNames || (DatumAuxiliaryTypeNames = {}));
/**
 * A datum auxiliary type.
 */
class DatumAuxiliaryType extends Enum {
    /**
     * Constructor.
     *
     * @param name - the unique name for this type
     */
    constructor(name) {
        super(name);
        if (this.constructor === DatumAuxiliaryType) {
            Object.freeze(this);
        }
    }
    /**
     * @override
     * @inheritdoc
     */
    static enumValues() {
        return DatumAuxiliaryTypeValues;
    }
}
/**
 * The datum auxiliary type enum values array.
 */
const DatumAuxiliaryTypeValues = Object.freeze([
    new DatumAuxiliaryType(DatumAuxiliaryTypeNames.Reset),
]);
/**
 * The enumeration of supported DatumAuxiliaryType values.
 * @see {@link Domain.DatumAuxiliaryTypeNames} for the available values
 */
const DatumAuxiliaryTypes = DatumAuxiliaryType.enumsValue(DatumAuxiliaryTypeValues);
export default DatumAuxiliaryTypes;
export { DatumAuxiliaryType, DatumAuxiliaryTypeNames, };
//# sourceMappingURL=datumAuxiliaryType.js.map