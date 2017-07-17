import Enum from 'enum';

/**
 * An auth token status.
 * 
 * @extends Enum
 */
export class AuthTokenStatus extends Enum {
    /**
     * Constructor.
     * 
     * @param {string} name the name
     */
    constructor(name) {
        super(name);
        if ( this.constructor === AuthTokenStatus ) {
            Object.freeze(this);
        }
    }

    /**
	 * Get the {@link AuthTokenStatuses} values.
	 * 
	 * @inheritdoc
	 */
	static enumValues() {
		return AuthTokenStatusValues;
	}

}

const AuthTokenStatusValues = Object.freeze([
	new AuthTokenStatus('Active'),
    new AuthTokenStatus('Disabled'),
]);

/**
 * The enumeration of supported AuthTokenStatus values.
 * 
 * @readonly
 * @enum {AuthTokenStatus}
 * @property {AuthTokenStatus} Active the token is active and usable
 * @property {AuthTokenStatus} Disabled the token is disabled and not usable
 */
const AuthTokenStatuses = AuthTokenStatus.enumsValue(AuthTokenStatusValues);

export default AuthTokenStatuses;
