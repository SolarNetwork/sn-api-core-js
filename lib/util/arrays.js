/**
 * Push values onto an array.
 *
 * @param result the array to push value onto
 * @param values the values to add
 */
export function pushValues(result, values) {
    if (!(values && Array.isArray(result))) {
        return;
    }
    for (const e of values) {
        result.push(e);
    }
}
/**
 * Create a new array of lower-cased and sorted strings from another array.
 *
 * @param items - the items to lower-case and sort
 * @returns a new array of the lower-cased and sorted items
 */
export function lowercaseSortedArray(items) {
    const sortedItems = [];
    const len = items.length;
    for (let i = 0; i < len; i += 1) {
        sortedItems.push(items[i].toLowerCase());
    }
    sortedItems.sort();
    return sortedItems;
}
/**
 * Create a set that contains values that occur in two different sets.
 *
 * @param s1 the first set (or array)
 * @param s2  the second set (or array)
 * @returns a new set with only values that occur in both `s1` and `s2`
 */
export function intersection(s1, s2) {
    const result = new Set();
    const a = s1 instanceof Set ? s1 : new Set(s1);
    const b = s2 instanceof Set ? s2 : new Set(s2);
    let l;
    let r;
    if (a.size > b.size) {
        l = b;
        r = a;
    }
    else {
        l = a;
        r = b;
    }
    l.forEach((v) => {
        if (r.has(v)) {
            result.add(v);
        }
    });
    return result;
}
//# sourceMappingURL=arrays.js.map