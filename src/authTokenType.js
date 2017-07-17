import Enum from 'enum';

/**
 * A named auth token type.
 * 
 * @extends Enum
 */
export class AuthTokenType extends Enum {
    /**
     * Constructor.
     * 
     * @param {string} name the name
     */
    constructor(name) {
        super(name);
        if ( this.constructor === AuthTokenType ) {
            Object.freeze(this);
        }
    }

    /**
	 * Get the {@link AuthTokenTypes} values.
	 * 
	 * @inheritdoc
	 */
	static enumValues() {
		return AuthTokenTypeValues;
	}

}

const AuthTokenTypeValues = Object.freeze([
	new AuthTokenType('ReadNodeData'),
    new AuthTokenType('User'),
]);

/**
 * The enumeration of supported AuthTokenType values.
 * 
 * @readonly
 * @enum {AuthTokenType}
 * @property {AuthTokenType} ReadNodeData a read-only token for reading SolarNode data
 * @property {AuthTokenType} User full access as the user that owns the token
 */
const AuthTokenTypes = AuthTokenType.enumsValue(AuthTokenTypeValues);

export default AuthTokenTypes;
