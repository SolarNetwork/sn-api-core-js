import Enum from "../util/enum.js";
/**
 * An enumeration of supported auth token type names.
 */
var AuthTokenTypeNames;
(function (AuthTokenTypeNames) {
    /** ReadNodeData. */
    AuthTokenTypeNames["ReadNodeData"] = "ReadNodeData";
    /** User. */
    AuthTokenTypeNames["User"] = "User";
})(AuthTokenTypeNames || (AuthTokenTypeNames = {}));
/**
 * A named auth token type.
 */
class AuthTokenType extends Enum {
    /**
     * Constructor.
     *
     * @param name - the name
     */
    constructor(name) {
        super(name);
        if (this.constructor === AuthTokenType) {
            Object.freeze(this);
        }
    }
    /**
     * @override
     * @inheritdoc
     */
    static enumValues() {
        return AuthTokenTypeValues;
    }
}
/**
 * The auth token type enum values array.
 */
const AuthTokenTypeValues = Object.freeze([
    new AuthTokenType(AuthTokenTypeNames.ReadNodeData),
    new AuthTokenType(AuthTokenTypeNames.User),
]);
/**
 * The enumeration of supported AuthTokenType values.
 * @see {@link Domain.AuthTokenTypeNames} for the available values
 */
const AuthTokenTypes = AuthTokenType.enumsValue(AuthTokenTypeValues);
export default AuthTokenTypes;
export { AuthTokenType, AuthTokenTypeNames };
//# sourceMappingURL=authTokenType.js.map