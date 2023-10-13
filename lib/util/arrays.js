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
//# sourceMappingURL=arrays.js.map