import KeydEnum from "../util/keyedEnum.js";
/**
 * An enumeration of supported datum stream type names.
 */
var DatumStreamTypeNames;
(function (DatumStreamTypeNames) {
    /** Node. */
    DatumStreamTypeNames["Node"] = "Node";
    /** Location. */
    DatumStreamTypeNames["Location"] = "Location";
})(DatumStreamTypeNames || (DatumStreamTypeNames = {}));
/**
 * An enumeration of datum stream types.
 */
class DatumStreamType extends KeydEnum {
    /**
     * Constructor.
     *
     * @param name - the unique name for this type
     * @param key - the key value associated with this type
     */
    constructor(name, key) {
        super(name, key);
    }
    /**
     * @override
     * @inheritdoc
     */
    static enumValues() {
        return DatumStreamTypeValues;
    }
}
/**
 * The datum stream type enum values array.
 */
const DatumStreamTypeValues = Object.freeze([
    new DatumStreamType(DatumStreamTypeNames.Node, "n"),
    new DatumStreamType(DatumStreamTypeNames.Location, "l"),
]);
/**
 * The enumeration of supported `DatumStreamType` values.
 * @see {@link Domain.DatumStreamTypeNames} for the available values
 */
const DatumStreamTypes = DatumStreamType.enumsValue(DatumStreamTypeValues);
export default DatumStreamTypes;
export { DatumStreamType, DatumStreamTypeNames };
//# sourceMappingURL=datumStreamType.js.map