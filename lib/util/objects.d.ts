/**
 * Convert a `Map` into a simple object.
 *
 * The keys are assumed to be strings. Values that are themselves `Map` instances
 * will be converted to simple objects as well.
 *
 * @param strMap - a Map with string keys; nested Map objects are also handled
 * @returns a simple object
 * @see {@link Util.Objects.objectToStringMap} for the reverse conversion
 */
declare function stringMapToObject(strMap: Map<string, any>): object;
/**
 * Convert a simple object into a `Map` instance.
 *
 * Property values that are themselves objects will be converted into `Map`
 * instances as well.
 *
 * @param obj - a simple object
 * @returns a Map with string keys; nested Map objects are also handled
 * @see {@link Util.Objects.stringMapToObject} for the reverse conversion
 */
declare function objectToStringMap(obj: object): Map<string, any>;
/**
 * Get a non-empty Set from a Set or array or object, returning `undefined` if the set would be empty.
 *
 * @param obj - the array, Set, or singleton object to get as a Set
 * @returns the Set, or `undefined`
 */
declare function nonEmptySet<T>(obj?: T[] | Set<T> | T): Set<T> | undefined;
/**
 * Merge two sets, returning `undefined` if the merged set would be empty.
 *
 * @param set1 - the first set
 * @param set2 - the second set
 * @returns the merged Set, or `undefined` if neither arguments are sets or
 *                   neither argument have any values
 * @private
 */
declare function nonEmptyMergedSets<T>(set1?: T[] | Set<T> | T, set2?: T[] | Set<T> | T): Set<T> | undefined;
/** A generic object constructor. */
type Constructor<T = NonNullable<unknown>> = new (...args: any[]) => T;
export { type Constructor, stringMapToObject, objectToStringMap, nonEmptyMergedSets, nonEmptySet, };
//# sourceMappingURL=objects.d.ts.map