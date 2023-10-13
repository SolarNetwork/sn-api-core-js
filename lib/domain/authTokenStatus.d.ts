import Enum from "../util/enum.js";
/**
 * An enumeration of supported auth token status names.
 */
declare enum AuthTokenStatusNames {
    /** Active. */
    Active = "Active",
    /** Disabled. */
    Disabled = "Disabled"
}
/**
 * An auth token status.
 */
declare class AuthTokenStatus extends Enum {
    /**
     * Constructor.
     *
     * @param name - the name
     */
    constructor(name: string);
    /**
     * @inheritdoc
     */
    static enumValues(): readonly AuthTokenStatus[];
}
/**
 * A mapping of status names to associated enum instances.
 */
type AuthTokenStatusEnumsType = {
    [key in AuthTokenStatusNames]: AuthTokenStatus;
};
/**
 * The supported AuthTokenStatus values as an object mapping.
 * @see {@link Domain.AuthTokenStatusNames} for the available values
 */
declare const AuthTokenStatuses: AuthTokenStatusEnumsType;
export default AuthTokenStatuses;
export { AuthTokenStatus, type AuthTokenStatusEnumsType, AuthTokenStatusNames };
//# sourceMappingURL=authTokenStatus.d.ts.map