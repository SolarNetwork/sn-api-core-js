/**
 * Push values onto an array.
 *
 * @param result the array to push value onto
 * @param values the values to add
 */
export declare function pushValues<T>(result: T[], values?: Iterable<T>): void;
/**
 * Create a new array of lower-cased and sorted strings from another array.
 *
 * @param items - the items to lower-case and sort
 * @returns a new array of the lower-cased and sorted items
 */
export declare function lowercaseSortedArray(items: string[]): string[];
/**
 * Create a set that contains values that occur in two different sets.
 *
 * @param s1 the first set (or array)
 * @param s2  the second set (or array)
 * @returns a new set with only values that occur in both `s1` and `s2`
 */
export declare function intersection<T>(s1?: Set<T> | T[], s2?: Set<T> | T[]): Set<T>;
//# sourceMappingURL=arrays.d.ts.map