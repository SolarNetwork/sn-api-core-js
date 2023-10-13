import Enum from "../util/enum.js";
/**
 * An enumeration of supported combining type names.
 */
var CombiningTypeNames;
(function (CombiningTypeNames) {
    /** Average. */
    CombiningTypeNames["Average"] = "Average";
    /** Sum. */
    CombiningTypeNames["Sum"] = "Sum";
    /** Difference; note the order of mapped IDs is significant. */
    CombiningTypeNames["Difference"] = "Difference";
})(CombiningTypeNames || (CombiningTypeNames = {}));
/**
 * A named query combining action type.
 */
class CombiningType extends Enum {
    /**
     * Constructor.
     *
     * @param name - the unique name for this type
     */
    constructor(name) {
        super(name);
        if (this.constructor === CombiningType) {
            Object.freeze(this);
        }
    }
    /**
     * @override
     * @inheritdoc
     */
    static enumValues() {
        return CombiningTypeValues;
    }
}
/**
 * The combining type enum values array.
 */
const CombiningTypeValues = Object.freeze([
    new CombiningType(CombiningTypeNames.Average),
    new CombiningType(CombiningTypeNames.Sum),
    new CombiningType(CombiningTypeNames.Difference),
]);
/**
 * The enumeration of supported CombiningType values.
 * @see {@link Domain.CombiningTypeNames} for the available values
 */
const CombiningTypes = CombiningType.enumsValue(CombiningTypeValues);
export default CombiningTypes;
export { CombiningType, CombiningTypeNames };
//# sourceMappingURL=combiningType.js.map