/** @module util */

/**
 * A case-insensitive string key multi-value map object.
 */
class MultiMap {

	/**
	 * Constructor.
	 * 
	 * @param {*} [values] an object who's enumerable properties will be added to this map
	 */
	constructor(values) {
		this.mappings = {}; // map of lower-case header names to {name:X, val:[]} values
		this.mappingNames = []; // to keep insertion order
		if ( values ) {
			this.putAll(values);
		}
	}

	/**
	 * Add a value.
	 * 
	 * This method will append values to existing keys.
	 * 
	 * @param {string} key the key to use
	 * @param {*} value the value to add
	 * @returns {module:util~MutliMap} this object
	 */
	add(key, value) {
		return addValue(this, key, value);
	}

	/**
	 * Set a value.
	 * 
	 * This method will replace any existing values with just <code>value</code>.
	 * 
	 * @param {string} key the key to use
	 * @param {*} value the value to set
	 * @returns {module:util~MutliMap} this object
	 */
	put(key, value) {
		return addValue(this, key, value, true);
	}

	/**
	 * Set multiple values.
	 * 
	 * This method will replace any existing values with those provided on <code>values</code>.
	 * 
	 * @param {*} values an object who's enumerable properties will be added to this map
	 * @returns {module:util~MutliMap} this object
	 */
	putAll(values) {
		for ( let key in values ) {
			if ( values.hasOwnProperty(key) ) {
                addValue(this, key, values[key], true);
            }
		}
		return this;
	}

	/**
	 * Get the values associated with a key.
	 * 
	 * @param {string} key the key of the values to get
	 * @returns {object[]} the array of values associated with the key, or <code>undefined</code> if not available
	 */
	value(key) {
		const keyLc = key.toLowerCase();
		const mapping = this.mappings[keyLc];
		return (mapping ? mapping.val : undefined);
	}

	/**
	 * Get the first avaialble value assocaited with a key.
	 * 
	 * @param {string} key the key of the value to get
	 * @returns {*} the first available value associated with the key, or <code>undefined</code> if not available
	 */
	firstValue(key) {
		const values = this.value(key);
		return (values && values.length > 0 ? values[0] : undefined);
	}

	/**
	 * Remove all properties from this map.
	 * 
	 * @returns {module:util~MutliMap} this object
	 */
	clear() {
		this.mappingNames.length = 0;
		this.mappings = {};
		return this;
	}

	/**
	 * Remove all values associated with a key.
	 * 
	 * @param {string} key the key of the values to remove
	 * @returns {object[]} the removed values, or <code>undefined</code> if no values were present for the given key
	 */
	remove(key) {
		const keyLc = key.toLowerCase();
		const index = this.mappingNames.indexOf(keyLc);
		const result = this.mappings[keyLc];
		if ( result ) {
			delete this.mappings[keyLc];
			this.mappingNames.splice(index, 1);
		}
		return (result ? result.val : undefined);
	}

	/**
	 * Get the number of entries in this map.
	 * 
	 * @returns {number} the number of entries in the map
	 */
	size() {
		return this.mappingNames.length;
	}

	/**
	 * Test if the map is empty.
	 * 
	 * @returns {boolean} <code>true</code> if there are no entries in this map
	 */
	isEmpty() {
		return this.size() < 1;
	}

	/**
	 * Test if there are any values associated with a key.
	 * 
	 * @param {string} key the key to test
	 * @returns {boolean} <code>true</code> if there is at least one value associated with the key
	 */
	containsKey(key) {
		return (this.value(key) !== undefined);
	}

	/**
	 * Get an array of all keys in this map.
	 * 
	 * @returns {string[]} array of keys in this map, or an empty array if the map is empty
	 */
	keySet() {
		const result = [];
		const len = this.size();
		for ( let i = 0; i < len; i += 1 ) {
			result.push(this.mappings[this.mappingNames[i]].key);
		}
		return result;
	}
}

/**
 * Add/replace values on a map.
 * 
 * @param {module:util~MutliMap} map the map to mutate 
 * @param {string} key the key to change 
 * @param {*} value the value to add
 * @param {boolean} replace if <code>true</code> then replace all existing values;
 *                          if <code>false</code> append to any existing values
 * @returns {module:util~MutliMap} the passed in <code>map</code>
 * @private
 */
function addValue(map, key, value, replace) {
	const keyLc = key.toLowerCase();
	let mapping = map.mappings[keyLc];
	if ( !mapping ) {
		mapping = {key:key, val:[]};
		map.mappings[keyLc] = mapping;
		map.mappingNames.push(keyLc);
	}
	if ( replace ) {
		mapping.val.length = 0;
	}
	if ( Array.isArray(value) ) {
		const len = value.length;
		for ( let i = 0; i < len; i += 1 ) {
			mapping.val.push(value[i]);
		}
	} else {
		mapping.val.push(value);
	}
	return map;
}

export default MultiMap;
