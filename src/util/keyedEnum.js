import Enum from "./enum.js";

/**
 * An immutable enum-like object with an associated key value.
 *
 * This class is essentially abstract, and must be extended by another
 * class that overrides the inerited {@link module:util~Enum.enumValues} method.
 *
 * @abstract
 * @extends module:util~Enum
 * @alias module:util~KeyedEnum
 */
class KeyedEnum extends Enum {
	/**
	 * Constructor.
	 *
	 * @param {string} name the unique name for this type
	 * @param {string} key the key value associated with this type
	 */
	constructor(name, key) {
		super(name);
		this._key = key;
		if (this.constructor === KeyedEnum) {
			Object.freeze(this);
		}
	}

	/**
	 * Get the key value.
	 *
	 * @returns {string} the key value
	 */
	get key() {
		return this._key;
	}

	/**
	 * Get an enum instance from its key or name.
	 *
	 * This method searches the {@link module:util~Enum#enumVvalues} array for a matching key or name value.
	 *
	 * @param {string} value the enum key or name to get the enum instance for
	 * @returns {module:util~KeyedEnum|null} the matching enum value, or `null` if no values match
	 */
	static valueOf(value) {
		const enums = this.enumValues();
		if (!Array.isArray(enums)) {
			return undefined;
		}
		for (let i = 0, len = enums.length; i < len; i += 1) {
			if (value === enums[i].key) {
				return enums[i];
			} else if (value === enums[i].name) {
				return enums[i];
			}
		}
		return undefined;
	}
}

export default KeyedEnum;
