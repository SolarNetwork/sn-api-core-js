import Enum from "../util/enum.js";

/**
 * An enumeration of supported auth token type names.
 */
enum AuthTokenTypeNames {
	/** ReadNodeData. */
	ReadNodeData = "ReadNodeData",

	/** User. */
	User = "User",
}

/**
 * A named auth token type.
 */
class AuthTokenType extends Enum {
	/**
	 * Constructor.
	 *
	 * @param name - the name
	 */
	constructor(name: string) {
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
 * A mapping of auth token type names to associated enum instances.
 */
type AuthTokenTypeEnumsType = {
	[key in AuthTokenTypeNames]: AuthTokenType;
};

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
const AuthTokenTypes = AuthTokenType.enumsValue(
	AuthTokenTypeValues
) as AuthTokenTypeEnumsType;

export default AuthTokenTypes;
export { AuthTokenType, type AuthTokenTypeEnumsType, AuthTokenTypeNames };
