import Enum from "../util/enum.js";
/**
 * An enumeration of supported combining type names.
 */
declare enum CombiningTypeNames {
    /** Average. */
    Average = "Average",
    /** Sum. */
    Sum = "Sum",
    /** Difference; note the order of mapped IDs is significant. */
    Difference = "Difference"
}
/**
 * A named query combining action type.
 */
declare class CombiningType extends Enum {
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
    static enumValues(): readonly CombiningType[];
}
/**
 * A mapping of combining type names to associated enum instances.
 */
type CombiningTypeEnumsType = {
    [key in CombiningTypeNames]: CombiningType;
};
/**
 * The enumeration of supported CombiningType values.
 * @see {@link Domain.CombiningTypeNames} for the available values
 */
declare const CombiningTypes: CombiningTypeEnumsType;
export default CombiningTypes;
export { CombiningType, type CombiningTypeEnumsType, CombiningTypeNames };
//# sourceMappingURL=combiningType.d.ts.map