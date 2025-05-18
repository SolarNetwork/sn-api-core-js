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
declare class MultiMap {
    #private;
    /**
     * Constructor.
     *
     * @param values - an object who's enumerable properties will be added to this map
     */
    constructor(values?: Record<string, any>);
    /**
     * Add a value.
     *
     * This method will append values to existing keys.
     *
     * @param key - the key to use
     * @param value - the value to add; if `undefined` nothing will be added
     */
    add(key: string, value: any): this;
    /**
     * Set a value.
     *
     * This method will replace any existing values with just `value`.
     *
     * @param key - the key to use
     * @param value - the value to set; if `undefined` nothing will be added
     * @returns this object
     */
    put(key: string, value: any): this;
    /**
     * Set multiple values.
     *
     * This method will replace any existing values with those provided on `values`.
     *
     * @param values - an object who's enumerable properties will be added to this map
     * @returns this object
     */
    putAll(values: Record<string, any>): this;
    /**
     * Get the values associated with a key.
     *
     * @param key - the key of the values to get
     * @returns the array of values associated with the key, or `undefined` if not available
     */
    value(key: string): any[] | undefined;
    /**
     * Get the first avaialble value assocaited with a key.
     *
     * @param key - the key of the value to get
     * @returns the first available value associated with the key, or `undefined` if not available
     */
    firstValue(key: string): any | undefined;
    /**
     * Remove all properties from this map.
     *
     * @returns this object
     */
    clear(): this;
    /**
     * Remove all values associated with a key.
     *
     * @param key - the key of the values to remove
     * @returns the removed values, or `undefined` if no values were present for the given key
     */
    remove(key: string): any[] | undefined;
    /**
     * Get the number of entries in this map.
     *
     * @returns the number of entries in the map
     */
    size(): number;
    /**
     * Test if the map is empty.
     *
     * @returns `true` if there are no entries in this map
     */
    isEmpty(): boolean;
    /**
     * Test if there are any values associated with a key.
     *
     * @param key - the key to test
     * @returns `true` if there is at least one value associated with the key
     */
    containsKey(key: string): boolean;
    /**
     * Get an array of all keys in this map.
     *
     * @returns array of keys in this map, or an empty array if the map is empty
     */
    keySet(): string[];
    /**
     * Get the entire mapping as a single-valued `Map` instance.
     *
     * This will return the first avaialble value for every key in the mapping.
     *
     * @returns a new `Map` instance
     */
    mapValue(): Map<string, any>;
}
export default MultiMap;
export { type MultiMapValue };
//# sourceMappingURL=multiMap.d.ts.map