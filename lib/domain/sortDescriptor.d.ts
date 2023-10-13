import UriEncodable from "../util/uriEncodable.js";
/**
 * A description of a sort applied to a property of a collection.
 */
declare class SortDescriptor implements UriEncodable {
    #private;
    /**
     * Constructor.
     *
     * @param key - the property to sort on
     * @param descending - `true` to sort in descending order, `false` for ascending
     */
    constructor(key: string, descending?: boolean);
    /**
     * Get the sort property name.
     *
     * @returns the sort key
     */
    get key(): string;
    /**
     * Get the sorting direction.
     *
     * @returns `true` if descending order, `false` for ascending
     */
    get descending(): boolean;
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
    toUriEncoding(index?: number, propertyName?: string): string;
}
export default SortDescriptor;
//# sourceMappingURL=sortDescriptor.d.ts.map