/** A MultiMap entry value. */
interface MultiMapValue {
	/** The case-preserving key. */
	key: string;

	/** The list of values. */
	val: any[];
}

/**
 * A case-insensitive, case-preserving string key multi-value map object.
 *
 * This map supports `null` values but ignores attempts to add keys with `undefined` values.
 */
class MultiMap {
	/** Mapping of lower-case header names to {key:X, val:[]} values. */
	#mappings: Record<string, MultiMapValue>;

	/** List of mappings to maintain insertion order. */
	#mappingNames: string[];

	/**
	 * Constructor.
	 *
	 * @param values - an object who's enumerable properties will be added to this map
	 */
	constructor(values?: Record<string, any>) {
		this.#mappings = {};
		this.#mappingNames = [];
		if (values) {
			this.putAll(values);
		}
	}

	/**
	 * Add/replace values on a map.
	 *
	 * @param key - the key to change
	 * @param value - the value to add; if `undefined` then nothing will be added
	 * @param replace - if `true` then replace all existing values;
	 *     if `false` append to any existing values
	 * @returns this object
	 */
	#addValue(key: string, value: any, replace?: boolean): this {
		if (value === undefined) {
			return this;
		}
		const keyLc = key.toLowerCase();
		let mapping = this.#mappings[keyLc];
		if (!mapping) {
			mapping = { key: key, val: [] };
			this.#mappings[keyLc] = mapping;
			this.#mappingNames.push(keyLc);
		}
		if (replace) {
			mapping.val.length = 0;
		}
		if (Array.isArray(value)) {
			const len = value.length;
			for (let i = 0; i < len; i += 1) {
				mapping.val.push(value[i]);
			}
		} else {
			mapping.val.push(value);
		}
		return this;
	}

	/**
	 * Add a value.
	 *
	 * This method will append values to existing keys.
	 *
	 * @param key - the key to use
	 * @param value - the value to add; if `undefined` nothing will be added
	 */
	add(key: string, value: any): this {
		return this.#addValue(key, value);
	}

	/**
	 * Set a value.
	 *
	 * This method will replace any existing values with just `value`.
	 *
	 * @param key - the key to use
	 * @param value - the value to set; if `undefined` nothing will be added
	 * @returns this object
	 */
	put(key: string, value: any): this {
		return this.#addValue(key, value, true);
	}

	/**
	 * Set multiple values.
	 *
	 * This method will replace any existing values with those provided on `values`.
	 *
	 * @param values - an object who's enumerable properties will be added to this map
	 * @returns this object
	 */
	putAll(values: Record<string, any>): this {
		for (const key in values) {
			if (Object.prototype.hasOwnProperty.call(values, key)) {
				this.#addValue(key, values[key], true);
			}
		}
		return this;
	}

	/**
	 * Get the values associated with a key.
	 *
	 * @param key - the key of the values to get
	 * @returns the array of values associated with the key, or `undefined` if not available
	 */
	value(key: string): any[] | undefined {
		const keyLc = key.toLowerCase();
		const mapping = this.#mappings[keyLc];
		return mapping ? mapping.val : undefined;
	}

	/**
	 * Get the first avaialble value assocaited with a key.
	 *
	 * @param key - the key of the value to get
	 * @returns the first available value associated with the key, or `undefined` if not available
	 */
	firstValue(key: string): any | undefined {
		const values = this.value(key);
		return values && values.length > 0 ? values[0] : undefined;
	}

	/**
	 * Remove all properties from this map.
	 *
	 * @returns this object
	 */
	clear(): this {
		this.#mappingNames.length = 0;
		this.#mappings = {};
		return this;
	}

	/**
	 * Remove all values associated with a key.
	 *
	 * @param key - the key of the values to remove
	 * @returns the removed values, or `undefined` if no values were present for the given key
	 */
	remove(key: string): any[] | undefined {
		const keyLc = key.toLowerCase();
		const index = this.#mappingNames.indexOf(keyLc);
		const result = this.#mappings[keyLc];
		if (result) {
			delete this.#mappings[keyLc];
			this.#mappingNames.splice(index, 1);
		}
		return result ? result.val : undefined;
	}

	/**
	 * Get the number of entries in this map.
	 *
	 * @returns the number of entries in the map
	 */
	size(): number {
		return this.#mappingNames.length;
	}

	/**
	 * Test if the map is empty.
	 *
	 * @returns `true` if there are no entries in this map
	 */
	isEmpty(): boolean {
		return this.size() < 1;
	}

	/**
	 * Test if there are any values associated with a key.
	 *
	 * @param key - the key to test
	 * @returns `true` if there is at least one value associated with the key
	 */
	containsKey(key: string): boolean {
		return this.value(key) !== undefined;
	}

	/**
	 * Get an array of all keys in this map.
	 *
	 * @returns array of keys in this map, or an empty array if the map is empty
	 */
	keySet(): string[] {
		const result = [];
		const len = this.size();
		for (let i = 0; i < len; i += 1) {
			result.push(this.#mappings[this.#mappingNames[i]].key);
		}
		return result;
	}
}

export default MultiMap;
export { type MultiMapValue };
