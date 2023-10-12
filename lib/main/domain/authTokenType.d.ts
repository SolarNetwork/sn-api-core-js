import Enum from "../util/enum.js";
/**
 * An enumeration of supported auth token type names.
 */
declare enum AuthTokenTypeNames {
    /** ReadNodeData. */
    ReadNodeData = "ReadNodeData",
    /** User. */
    User = "User"
}
/**
 * A named auth token type.
 */
declare class AuthTokenType extends Enum {
    /**
     * Constructor.
     *
     * @param name - the name
     */
    constructor(name: string);
    /**
     * @override
     * @inheritdoc
     */
    static enumValues(): readonly AuthTokenType[];
}
/**
 * A mapping of auth token type names to associated enum instances.
 */
type AuthTokenTypeEnumsType = {
    [key in AuthTokenTypeNames]: AuthTokenType;
};
/**
 * The enumeration of supported AuthTokenType values.
 * @see {@link Domain.AuthTokenTypeNames} for the available values
 */
declare const AuthTokenTypes: AuthTokenTypeEnumsType;
export default AuthTokenTypes;
export { AuthTokenType, type AuthTokenTypeEnumsType, AuthTokenTypeNames };
//# sourceMappingURL=authTokenType.d.ts.map