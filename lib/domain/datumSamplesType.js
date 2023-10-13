import KeyedEnum from "../util/keyedEnum.js";
/**
 * An enumeration of supported datum sample type names.
 */
var DatumSamplesTypeNames;
(function (DatumSamplesTypeNames) {
    /** Instantaneous number property values. */
    DatumSamplesTypeNames["Instantaneous"] = "Instantaneous";
    /** Accumulating meter-style number property values. */
    DatumSamplesTypeNames["Accumulating"] = "Accumulating";
    /** String status property values. */
    DatumSamplesTypeNames["Status"] = "Status";
    /** Arbitrary string names. */
    DatumSamplesTypeNames["Tag"] = "Tag";
})(DatumSamplesTypeNames || (DatumSamplesTypeNames = {}));
/**
 * An enumeration of datum samples types.
 */
class DatumSamplesType extends KeyedEnum {
    /**
     * Constructor.
     *
     * @param name - the unique name for this type
     * @param key - the key value associated with this type
     */
    constructor(name, key) {
        super(name, key);
        if (this.constructor === DatumSamplesType) {
            Object.freeze(this);
        }
    }
    /**
     * @override
     * @inheritdoc
     */
    static enumValues() {
        return DatumSamplesTypeValues;
    }
}
/**
 * The datum sample type enum values array.
 */
const DatumSamplesTypeValues = Object.freeze([
    new DatumSamplesType(DatumSamplesTypeNames.Instantaneous, "i"),
    new DatumSamplesType(DatumSamplesTypeNames.Accumulating, "a"),
    new DatumSamplesType(DatumSamplesTypeNames.Status, "s"),
    new DatumSamplesType(DatumSamplesTypeNames.Tag, "t"),
]);
/**
 * The enumeration of supported `DatumSamplesType` values.
 * @see {@link Domain.DatumSamplesTypeNames} for the available values
 */
const DatumSamplesTypes = DatumSamplesType.enumsValue(DatumSamplesTypeValues);
export default DatumSamplesTypes;
export { DatumSamplesType, DatumSamplesTypeNames, };
//# sourceMappingURL=datumSamplesType.js.map