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
function stringMapToObject(strMap) {
    const obj = Object.create(null);
    if (strMap) {
        for (const [k, v] of strMap) {
            obj[k] = v instanceof Map ? stringMapToObject(v) : v;
        }
    }
    return obj;
}
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
function objectToStringMap(obj) {
    const strMap = new Map();
    if (obj) {
        for (const k of Object.keys(obj)) {
            const v = obj[k];
            strMap.set(k, typeof v === "object" ? objectToStringMap(v) : v);
        }
    }
    return strMap;
}
/**
 * Get a non-empty Set from a Set or array or object, returning `undefined` if the set would be empty.
 *
 * @param obj - the array, Set, or singleton object to get as a Set
 * @returns the Set, or `undefined`
 */
function nonEmptySet(obj) {
    let result = undefined;
    if (obj instanceof Set) {
        result = obj.size > 0 ? obj : undefined;
    }
    else if (Array.isArray(obj)) {
        result = obj.length > 0 ? new Set(obj) : undefined;
    }
    else if (obj) {
        result = new Set([obj]);
    }
    return result;
}
/**
 * Merge two sets, returning `undefined` if the merged set would be empty.
 *
 * @param set1 - the first set
 * @param set2 - the second set
 * @returns the merged Set, or `undefined` if neither arguments are sets or
 *                   neither argument have any values
 * @private
 */
function nonEmptyMergedSets(set1, set2) {
    const s1 = nonEmptySet(set1);
    const s2 = nonEmptySet(set2);
    if (s1 === undefined && s2 === undefined) {
        return undefined;
    }
    else if (s2 === undefined) {
        return s1;
    }
    else if (s1 === undefined) {
        return s2;
    }
    const result = new Set(s1);
    for (const v of s2.values()) {
        result.add(v);
    }
    return result;
}
export { stringMapToObject, objectToStringMap, nonEmptyMergedSets, nonEmptySet, };
//# sourceMappingURL=objects.js.map