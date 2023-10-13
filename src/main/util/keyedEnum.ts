import Enum from "./enum.js";

/**
 * An immutable enum-like object with an associated key value.
 *
 * This class must be extended by another class that overrides the
 * inerited {@link Util.Enum.enumValues} method.
 */
abstract class KeyedEnum extends Enum {
	/** The key value. */
	readonly #key: string;

	/**
	 * Constructor.
	 *
	 * @param name - the unique name for this type
	 * @param key - the key value associated with this type
	 */
	constructor(name: string, key: string) {
		super(name);
		this.#key = key;
	}

	/**
	 * Get the key value.
	 *
	 * @returns the key value
	 */
	get key() {
		return this.#key;
	}

	/**
	 * Get an enum instance from its key or name.
	 *
	 * This method searches the {@link Util.Enum.enumValues} array for a matching key or name value.
	 *
	 * @param value - the enum key or name to get the enum instance for
	 * @returns the matching enum value, or `undefined` if no values match
	 */
	static valueOf<T extends Enum>(value: string): T | undefined {
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
