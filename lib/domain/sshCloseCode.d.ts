import ComparableEnum from "../util/comparableEnum.js";
/**
 * An enumeration of supported aggregation names.
 */
declare enum SshCloseCodeNames {
    /** Authentication failure. */
    AuthenticationFailure = "AuthenticationFailure"
}
/**
 * A named socket close code.
 */
declare class SshCloseCode extends ComparableEnum {
    /**
     * Constructor.
     *
     * @param name the name
     * @param value a value
     */
    constructor(name: string, value: number);
    /**
     * @override
     * @inheritdoc
     */
    static enumValues(): readonly SshCloseCode[];
}
/**
 * A mapping of aggregation names to associated enum instances.
 */
type SshCloseCodeEnumsType = {
    [key in SshCloseCodeNames]: SshCloseCode;
};
/**
 * The enumeration of supported `SshCloseCode` values.
 * @see {@link Domain.SshCloseCodeNames} for the available values
 */
declare const SshCloseCodes: SshCloseCodeEnumsType;
export default SshCloseCodes;
export { SshCloseCode, type SshCloseCodeEnumsType, SshCloseCodeNames };
//# sourceMappingURL=sshCloseCode.d.ts.map