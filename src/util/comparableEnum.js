import Enum from "./enum";

/**
 * An immutable enum-like object with an associated comparable value.
 *
 * This class is essentially abstract, and must be extended by another
 * class that overrides the inerited {@link module:util~Enum.enumValues} method.
 *
 * @abstract
 * @extends module:util~Enum
 * @alias module:util~ComparableEnum
 */
class ComparableEnum extends Enum {
	/**
	 * Constructor.
	 *
	 * @param {string} name the name
	 * @param {number} value the comparable value
	 */
	constructor(name, value) {
		super(name);
		this._value = value;
		if (this.constructor === ComparableEnum) {
			Object.freeze(this);
		}
	}

	/**
	 * Get the comparable value.
	 *
	 * @returns {number} the value
	 */
	get value() {
		return this._value;
	}

	/**
	 * Compare two ComparableEnum objects based on their `value` values.
	 *
	 * @param {ComparableEnum} other the object to compare to
	 * @returns {number} `-1` if `this.value` is less than `other.value`,
	 *                   `1` if `this.value` is greater than `other.value`,
	 *                   `0` otherwise (when the values are equal)
	 */
	compareTo(other) {
		return this.value < other.value ? -1 : this.value > other.value ? 1 : 0;
	}

	/**
	 * Compute a complete set of enum values based on a minimum enum and/or set of enums.
	 *
	 * If `cache` is provided, then results computed via `minAggregation`
	 * will be cached there, and subsequent calls will returned the cached result when appropriate.
	 *
	 * @param {ComparableEnum} [minEnum] a minimum enum value
	 * @param {Map<string, Set<ComparableEnum>>} [cache] a cache of computed values
	 * @returns {Set<ComparableEnum>|null} the computed set, or `null` if no values match
	 */
	static minimumEnumSet(minEnum, cache) {
		if (!minEnum) {
			return null;
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
		return result.size > 0 ? result : null;
	}
}

export default ComparableEnum;
