import UriEncodable from "../util/uriEncodable.js";
/**
 * A pagination criteria object.
 */
declare class Pagination implements UriEncodable {
    #private;
    /**
     * Construct a pagination object.
     *
     * @param max - the maximum number of results to return
     * @param offset - the 0-based starting offset
     */
    constructor(max?: number, offset?: number);
    /**
     * Get the maximum number of results to return.
     *
     * @returns the maximum number of results
     */
    get max(): number;
    /**
     * Get the results starting offset.
     *
     * The first available result starts at offset <code>0</code>. Note this is
     * a raw offset value, not a "page" offset.
     *
     * @returns the starting result offset
     */
    get offset(): number;
    /**
     * Copy constructor with a new `offset` value.
     *
     * @param offset the new offset to use
     * @returns a new instance
     */
    withOffset(offset: number): Pagination;
    /**
     * Get this object as a standard URI encoded (query parameters) string value.
     *
     * @returns the URI encoded string
     */
    toUriEncoding(): string;
}
export default Pagination;
//# sourceMappingURL=pagination.d.ts.map