import Enum from "../util/enum";

/**
 * An auth token status.
 *
 * @extends module:util~Enum
 * @alias module:domain~AuthTokenStatus
 */
export class AuthTokenStatus extends Enum {
	/**
	 * Constructor.
	 *
	 * @param {string} name the name
	 */
	constructor(name) {
		super(name);
		if (this.constructor === AuthTokenStatus) {
			Object.freeze(this);
		}
	}

	/**
	 * Get the {@link module:domain~AuthTokenStatuses} values.
	 *
	 * @inheritdoc
	 */
	static enumValues() {
		return AuthTokenStatusValues;
	}
}

const AuthTokenStatusValues = Object.freeze([
	new AuthTokenStatus("Active"),
	new AuthTokenStatus("Disabled")
]);

/**
 * The enumeration of supported AuthTokenStatus values.
 *
 * @readonly
 * @enum {module:domain~AuthTokenStatus}
 * @property {module:domain~AuthTokenStatus} Active the token is active and usable
 * @property {module:domain~AuthTokenStatus} Disabled the token is disabled and not usable
 * @alias module:domain~AuthTokenStatuses
 */
const AuthTokenStatuses = AuthTokenStatus.enumsValue(AuthTokenStatusValues);

export default AuthTokenStatuses;
