import PropMap from "./propMap.js";
/**
 * A configuration utility object.
 *
 * Properties can be get/set by using the {@link Util.Configuration#value} function.
 * Properties added this way become enumerable properties of the `Configuration`
 * instance as well.
 */
declare class Configuration implements Record<string, any> {
    #private;
    /**
     * Constructor.
     *
     * For any properties passed on `initialMap`, {@link Configuration#value} will
     * be called so those properties are defined on this instance.
     *
     * @param initialMap - the optional initial properties to store
     */
    constructor(initialMap?: Map<string, any> | object);
    /**
     * Get direct access to the underlying property map.
     */
    get props(): Map<string, any>;
    /**
     * Test if a key is truthy.
     *
     * @param key - the key to test
     * @returns `true` if the key is enabled
     */
    enabled(key: string): boolean;
    /**
     * Set or toggle the enabled status of a given key.
     *
     * If the `enabled` parameter is not passed, then the enabled
     * status will be toggled to its opposite value.
     *
     * @param {string} key - the key to set
     * @param {boolean} enabled - the optional enabled value to set
     * @returns this object to allow method chaining
     */
    toggle(key: string, enabled?: boolean): this;
    /**
     * Get a configuration value.
     *
     * @param key - the key to get
     * @returns the associated value for the given `key`
     */
    value(key: string): any;
    /**
     * Set a configuration value.
     *
     * @param key - the key to get or set the value for
     * @param newValue the new value to set for the given `key`.
     *     If `null` then the value will be removed.
     * @returns this object.
     */
    value(key: string, newValue: any): this;
    /**
     * Get all properties.
     *
     * @returns all properties of this object copied into a simple object
     */
    values(): Record<string, any>;
    /**
     * Set multiple properties.
     *
     * @param newMap - a map of values to set
     * @returns this object
     */
    values(newMap: Record<string, any> | Map<string, any> | PropMap): this;
}
export default Configuration;
//# sourceMappingURL=configuration.d.ts.map