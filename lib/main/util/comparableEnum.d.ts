import Enum from "./enum.js";
import Comparable from "./comparable.js";
/**
 * An immutable enum-like object with an associated comparable value.
 *
 * This class must be extended by another class that overrides the inerited
 * {@link Util.Enum.enumValues} method.
 *
 * @abstract
 */
declare abstract class ComparableEnum extends Enum implements Comparable<ComparableEnum> {
    #private;
    /**
     * Constructor.
     *
     * @param name - the name
     * @param value - the comparable value
     */
    constructor(name: string, value: number);
    /**
     * Get the comparable value.
     *
     * @returns the value
     */
    get value(): number;
    /**
     * Compare two ComparableEnum objects based on their `value` values.
     *
     * @param o - the object to compare to
     * @returns negative value, zero, or positive value if this instance is less than, equal to, or greater than `o`
     */
    compareTo(o: ComparableEnum | undefined): number;
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
    static minimumEnumSet<T extends ComparableEnum>(minEnum?: T, cache?: Map<string, Set<T>>): Set<T> | undefined;
}
export default ComparableEnum;
//# sourceMappingURL=comparableEnum.d.ts.map