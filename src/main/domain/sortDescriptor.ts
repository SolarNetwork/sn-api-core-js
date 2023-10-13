import UriEncodable from "../util/uriEncodable.js";

/**
 * A description of a sort applied to a property of a collection.
 */
class SortDescriptor implements UriEncodable {
	readonly #key: string;
	readonly #descending: boolean;

	/**
	 * Constructor.
	 *
	 * @param key - the property to sort on
	 * @param descending - `true` to sort in descending order, `false` for ascending
	 */
	constructor(key: string, descending?: boolean) {
		this.#key = key;
		this.#descending = !!descending;
	}

	/**
	 * Get the sort property name.
	 *
	 * @returns the sort key
	 */
	get key(): string {
		return this.#key;
	}

	/**
	 * Get the sorting direction.
	 *
	 * @returns `true` if descending order, `false` for ascending
	 */
	get descending(): boolean {
		return this.#descending;
	}

	/**
	 * Get this object as a standard URI encoded (query parameters) string value.
	 *
	 * If `index` is provided and non-negative, then the query parameters will
	 * be encoded as an array property named `propertyName`. Otherwise just
	 * bare `key` and `descending` properties will be used. The
	 * `descending` property is only added if it is `true`.
	 *
	 * @param index - an optional array property index
	 * @param propertyName - an optional array property name, only used if `index` is also provided;
	 *                       defaults to `sorts`
	 * @return the URI encoded string
	 */
	toUriEncoding(index?: number, propertyName?: string): string {
		const propName = propertyName || "sorts";
		let result;
		if (index !== undefined && index >= 0) {
			result = encodeURIComponent(propName + "[" + index + "].key") + "=";
		} else {
			result = "key=";
		}
		result += encodeURIComponent(this.key);
		if (this.descending) {
			if (index !== undefined && index >= 0) {
				result +=
					"&" +
					encodeURIComponent(
						propName + "[" + index + "].descending"
					) +
					"=true";
			} else {
				result += "&descending=true";
			}
		}
		return result;
	}
}

export default SortDescriptor;
