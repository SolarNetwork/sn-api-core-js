import Enum from '../util/enum';

/**
 * A named auth token type.
 * 
 * @extends module:util~Enum
 * @alias module:domain~AuthTokenType
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
 * @enum {module:domain~AuthTokenType}
 * @property {module:domain~AuthTokenType} ReadNodeData a read-only token for reading SolarNode data
 * @property {module:domain~AuthTokenType} User full access as the user that owns the token
 * @alias module:domain~AuthTokenTypes
 */
const AuthTokenTypes = AuthTokenType.enumsValue(AuthTokenTypeValues);

export default AuthTokenTypes;
