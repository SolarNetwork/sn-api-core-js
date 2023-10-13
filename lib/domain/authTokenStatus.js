import Enum from "../util/enum.js";
/**
 * An enumeration of supported auth token status names.
 */
var AuthTokenStatusNames;
(function (AuthTokenStatusNames) {
    /** Active. */
    AuthTokenStatusNames["Active"] = "Active";
    /** Disabled. */
    AuthTokenStatusNames["Disabled"] = "Disabled";
})(AuthTokenStatusNames || (AuthTokenStatusNames = {}));
/**
 * An auth token status.
 */
class AuthTokenStatus extends Enum {
    /**
     * Constructor.
     *
     * @param name - the name
     */
    constructor(name) {
        super(name);
        if (this.constructor === AuthTokenStatus) {
            Object.freeze(this);
        }
    }
    /**
     * @inheritdoc
     */
    static enumValues() {
        return AuthTokenStatusValues;
    }
}
/**
 * The status enum values array.
 */
const AuthTokenStatusValues = Object.freeze([
    new AuthTokenStatus(AuthTokenStatusNames.Active),
    new AuthTokenStatus(AuthTokenStatusNames.Disabled),
]);
/**
 * The supported AuthTokenStatus values as an object mapping.
 * @see {@link Domain.AuthTokenStatusNames} for the available values
 */
const AuthTokenStatuses = AuthTokenStatus.enumsValue(AuthTokenStatusValues);
export default AuthTokenStatuses;
export { AuthTokenStatus, AuthTokenStatusNames };
//# sourceMappingURL=authTokenStatus.js.map