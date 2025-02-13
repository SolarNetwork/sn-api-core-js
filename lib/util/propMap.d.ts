import Pagination from "../domain/pagination.js";
import SortDescriptor from "../domain/sortDescriptor.js";
/**
 * A callback function for URI encoding.
 *
 * The function will be passed property name and value arguments, and must
 * return either `undefined` to skip the property, a 2-element array with the property
 * name and value to use, or anything else to use the property as-is.
 */
type PropMapUriEncodingCallbackFn = (name: string, value: any) => [string, any] | [string, any, boolean] | any | undefined;
/**
 * A basic map-like object.
 *
 * This object includes some utility functions that make it well suited to using
 * as an API query object. For example, the {@link Util.PropMap.toUriEncoding}
 * method provides a way to serialize this object into URL query parameters.
 */
declare class PropMap implements Iterable<readonly [string, any]> {
    /**
     * The object that all properties are stored on.
     */
    readonly props: Map<string, any>;
    /**
     * Constructor.
     * @param props the initial properties; if a `PropMap` instance is provided, the properties
     *     of that object will be copied into this one; otherwise the object will be
     *     used directly to hold property values
     */
    constructor(props?: PropMap | Map<string, any> | object);
    /**
     * Get an iterator over the property entries.
     * @returns iterator over `[k, v]` values
     */
    [Symbol.iterator](): MapIterator<[string, any]>;
    /**
     * Get the number of properties configured.
     */
    get size(): number;
    /**
     * Get a property value.
     *
     * @param key - the key to get
     * @returns the associated value for the given `key`
     */
    prop(key: string): any;
    /**
     * Set or remove a property value.
     *
     * @param key - the key to set the value for
     * @param newValue - the new value to set for the given `key`;
     *     if `null` then the `key` property will be removed
     * @returns this object
     */
    prop(key: string, newValue: any): this;
    /**
     * Get all properties.
     *
     * @returns all properties of this object copied into a simple object
     */
    properties(): Record<string, any>;
    /**
     * Set or remove multiple properties.
     *
     * @param newProps - the new values to set; if any value is `null` that property
     *                            will be deleted
     * @returns this object
     */
    properties(newProps: Map<string, any> | object): this;
    /**
     * Get this object as a standard URI encoded (query parameters) string value.
     *
     * All enumerable properties of the <code>props</code> property will be added to the
     * result. If any property value is an array, the values of the array will be joined
     * by a comma. Any {@link Util.Enum} values will have their `name` property used.
     *
     * @param propertyName - an optional object property prefix to add to all properties
     * @param callbackFn - An optional function that will be called for each property.
     *                   The function will be passed property name and value arguments, and must
     *                   return either `undefined` to skip the property, a 2 or 3-element array with the
     *                   property name and value to use, and an optional boolean to force array
     *                   values to use mutliple parameter keys. Any other return value causes the
     *                   property to be used as-is.
     * @return the URI encoded string
     */
    toUriEncoding(propertyName?: string, callbackFn?: PropMapUriEncodingCallbackFn): string;
    /**
     * Get this object as a standard URI encoded (query parameters) string value with
     * sorting and pagination parameters.
     *
     * This calls {@link Util.PropMap.toUriEncoding} first, then encodes
     * the `sorts` and `pagination` parameters, if provided.
     *
     * @param sorts - optional sort settings to use
     * @param pagination - optional pagination settings to use
     * @param propertyName - an optional object property prefix to add to all properties
     * @param callbackFn - An optional function that will be called for each property.
     *                   The function will be passed property name and value arguments, and must
     *                   return either `undefined` to skip the property, a 2-element array with the property
     *                   name and value to use, or anything else to use the property as-is.
     * @return the URI encoded string
     */
    toUriEncodingWithSorting(sorts?: SortDescriptor[], pagination?: Pagination, propertyName?: string, callbackFn?: PropMapUriEncodingCallbackFn): string;
}
export default PropMap;
export { type PropMapUriEncodingCallbackFn };
//# sourceMappingURL=propMap.d.ts.map