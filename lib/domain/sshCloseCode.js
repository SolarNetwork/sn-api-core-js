import ComparableEnum from "../util/comparableEnum.js";
/**
 * An enumeration of supported aggregation names.
 */
var SshCloseCodeNames;
(function (SshCloseCodeNames) {
    /** Authentication failure. */
    SshCloseCodeNames["AuthenticationFailure"] = "AuthenticationFailure";
})(SshCloseCodeNames || (SshCloseCodeNames = {}));
/**
 * A named socket close code.
 */
class SshCloseCode extends ComparableEnum {
    /**
     * Constructor.
     *
     * @param name the name
     * @param value a value
     */
    constructor(name, value) {
        super(name, value);
        if (this.constructor === SshCloseCode) {
            Object.freeze(this);
        }
    }
    /**
     * @override
     * @inheritdoc
     */
    static enumValues() {
        return SshCloseCodeValues;
    }
}
/**
 * The aggregation enum values array.
 */
const SshCloseCodeValues = Object.freeze([
    new SshCloseCode(SshCloseCodeNames.AuthenticationFailure, 4000),
]);
/**
 * The enumeration of supported `SshCloseCode` values.
 * @see {@link Domain.SshCloseCodeNames} for the available values
 */
const SshCloseCodes = SshCloseCode.enumsValue(SshCloseCodeValues);
export default SshCloseCodes;
export { SshCloseCode, SshCloseCodeNames };
//# sourceMappingURL=sshCloseCode.js.map