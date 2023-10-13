import Enum from "./enum.js";
/**
 * An immutable enum-like object with an associated comparable value.
 *
 * This class must be extended by another class that overrides the inerited
 * {@link Util.Enum.enumValues} method.
 *
 * @abstract
 */
class ComparableEnum extends Enum {
    #value;
    /**
     * Constructor.
     *
     * @param name - the name
     * @param value - the comparable value
     */
    constructor(name, value) {
        super(name);
        this.#value = value;
    }
    /**
     * Get the comparable value.
     *
     * @returns the value
     */
    get value() {
        return this.#value;
    }
    /**
     * Compare two ComparableEnum objects based on their `value` values.
     *
     * @param o - the object to compare to
     * @returns negative value, zero, or positive value if this instance is less than, equal to, or greater than `o`
     */
    compareTo(o) {
        if (this === o) {
            return 0;
        }
        else if (!o) {
            return 1;
        }
        return this.#value < o.#value ? -1 : this.#value > o.#value ? 1 : 0;
    }
    /**
     * Compute a complete set of enum values based on a minimum enum and/or set of enums.
     *
     * If `cache` is provided, then results computed via `minAggregation`
     * will be cached there, and subsequent calls will returned the cached result when appropriate.
     *
     * @param minEnum - a minimum enum value
     * @param cache - a cache of computed values
     * @returns the computed set, or `undefined` if no values match
     */
    static minimumEnumSet(minEnum, cache) {
        if (!minEnum) {
            return undefined;
        }
        let result = cache ? cache.get(minEnum.name) : undefined;
        if (result) {
            return result;
        }
        result = new Set();
        for (const agg of minEnum.constructor.enumValues()) {
            if (agg.compareTo(minEnum) > -1) {
                result.add(agg);
            }
        }
        if (cache) {
            cache.set(minEnum.name, result);
        }
        return result.size > 0 ? result : undefined;
    }
}
export default ComparableEnum;
//# sourceMappingURL=comparableEnum.js.map