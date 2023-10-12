import Enum from "../util/enum.js";

/**
 * An enumeration of supported auth token status names.
 */
enum AuthTokenStatusNames {
	/** Active. */
	Active = "Active",

	/** Disabled. */
	Disabled = "Disabled",
}

/**
 * An auth token status.
 */
class AuthTokenStatus extends Enum {
	/**
	 * Constructor.
	 *
	 * @param name - the name
	 */
	constructor(name: string) {
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
 * A mapping of status names to associated enum instances.
 */
type AuthTokenStatusEnumsType = {
	[key in AuthTokenStatusNames]: AuthTokenStatus;
};

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
const AuthTokenStatuses = AuthTokenStatus.enumsValue(
	AuthTokenStatusValues
) as AuthTokenStatusEnumsType;

export default AuthTokenStatuses;
export { AuthTokenStatus, type AuthTokenStatusEnumsType, AuthTokenStatusNames };
