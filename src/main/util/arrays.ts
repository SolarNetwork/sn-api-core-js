/**
 * Push values onto an array.
 *
 * @param <T> the value type
 * @param result the array to push value onto
 * @param values the values to add
 */
export function pushValues<T>(result: T[], values?: Iterable<T>) {
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
export function lowercaseSortedArray(items: string[]): string[] {
	const sortedItems = [];
	const len = items.length;
	for (let i = 0; i < len; i += 1) {
		sortedItems.push(items[i].toLowerCase());
	}
	sortedItems.sort();
	return sortedItems;
}

/**
 * Create a set that contains only values that occur in two different sets.
 *
 * @param <T> the value type
 * @param s1 the first set of values
 * @param s2  the second set of values
 * @returns a new set with only values that occur in both `s1` and `s2`
 */
export function intersection<T>(s1?: Iterable<T>, s2?: Iterable<T>): Set<T> {
	const result = new Set<T>();

	const a = s1 instanceof Set ? (s1 as Set<T>) : new Set(s1 as Iterable<T>);
	const b = s2 instanceof Set ? (s2 as Set<T>) : new Set(s2 as Iterable<T>);

	let l: Set<T>;
	let r: Set<T>;
	if (a.size > b.size) {
		l = b;
		r = a;
	} else {
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
