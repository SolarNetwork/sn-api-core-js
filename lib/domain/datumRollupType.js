import KeyedEnum from "../util/keyedEnum.js";
/**
 * An enumeration of supported datum rollup type names.
 */
var DatumRollupTypeNames;
(function (DatumRollupTypeNames) {
    /**
     * No rollup.
     */
    DatumRollupTypeNames["None"] = "None";
    /**
     * Rollup everything into a single result.
     */
    DatumRollupTypeNames["All"] = "All";
    /**
     * Rollup the time component of the results.
     */
    DatumRollupTypeNames["Time"] = "Time";
    /**
     * Rollup the node component of the results.
     */
    DatumRollupTypeNames["Node"] = "Node";
    /**
     * Rollup the source component of the results.
     */
    DatumRollupTypeNames["Source"] = "Source";
})(DatumRollupTypeNames || (DatumRollupTypeNames = {}));
/**
 * An enumeration of datum reading types.
 */
class DatumRollupType extends KeyedEnum {
    /**
     * Constructor.
     *
     * @param name - the unique name for this type
     * @param key - the key value associated with this type
     */
    constructor(name, key) {
        super(name, key);
        if (this.constructor === DatumRollupType) {
            Object.freeze(this);
        }
    }
    /**
     * @override
     * @inheritdoc
     */
    static enumValues() {
        return DatumRollupTypeValues;
    }
}
/**
 * The datum reading type enum values array.
 */
const DatumRollupTypeValues = Object.freeze([
    new DatumRollupType(DatumRollupTypeNames.None, "0"),
    new DatumRollupType(DatumRollupTypeNames.All, "a"),
    new DatumRollupType(DatumRollupTypeNames.Time, "t"),
    new DatumRollupType(DatumRollupTypeNames.Node, "n"),
    new DatumRollupType(DatumRollupTypeNames.Source, "s"),
]);
/**
 * The enumeration of supported `DatumRollupType` values.
 * @see {@link Domain.DatumRollupTypeNames} for the available values
 */
const DatumRollupTypes = DatumRollupType.enumsValue(DatumRollupTypeValues);
export default DatumRollupTypes;
export { DatumRollupType, DatumRollupTypeNames };
//# sourceMappingURL=datumRollupType.js.map