/**
 * A pagination criteria object.
 */
class Pagination {
    #max;
    #offset;
    /**
     * Construct a pagination object.
     *
     * @param max - the maximum number of results to return
     * @param offset - the 0-based starting offset
     */
    constructor(max, offset) {
        this.#max = max !== undefined && max > 0 ? +max : 0;
        this.#offset = offset !== undefined && offset > 0 ? +offset : 0;
    }
    /**
     * Get the maximum number of results to return.
     *
     * @returns the maximum number of results
     */
    get max() {
        return this.#max;
    }
    /**
     * Get the results starting offset.
     *
     * The first available result starts at offset <code>0</code>. Note this is
     * a raw offset value, not a "page" offset.
     *
     * @returns the starting result offset
     */
    get offset() {
        return this.#offset;
    }
    /**
     * Copy constructor with a new `offset` value.
     *
     * @param offset the new offset to use
     * @returns a new instance
     */
    withOffset(offset) {
        return new Pagination(this.#max, offset);
    }
    /**
     * Get this object as a standard URI encoded (query parameters) string value.
     *
     * @returns the URI encoded string
     */
    toUriEncoding() {
        let result = "";
        if (this.max > 0) {
            result += "max=" + this.max;
        }
        if (this.offset > 0) {
            if (result.length > 0) {
                result += "&";
            }
            result += "offset=" + this.offset;
        }
        return result;
    }
}
export default Pagination;
//# sourceMappingURL=pagination.js.map