import Enum from "./enum";

/**
 * An immutable enum-like object with an associated bitmask support.
 *
 * This class is essentially abstract, and must be extended by another
 * class that overrides the inerited {@link module:util~Enum.enumValues} method.
 *
 * @abstract
 * @extends module:util~Enum
 * @alias module:util~BitmaskEnum
 */
class BitmaskEnum extends Enum {
	/**
	 * Constructor.
	 *
	 * @param {string} name the name
	 * @param {number} bitNumber the bit offset, starting from `1` for the least significant bit
	 */
	constructor(name, bitNumber) {
		super(name);
		this._bitNumber = bitNumber;
		if (this.constructor === BitmaskEnum) {
			Object.freeze(this);
		}
	}

	/**
	 * Get the bit offset value, starting from `1` for the least significant bit.
	 *
	 * @returns {number} the value
	 */
	get bitmaskBitNumber() {
		return this._bitNumber;
	}

	/**
	 * Get the bit offset value, starting from `0` for the least significant bit.
	 *
	 * @returns {number} the value
	 */
	get bitmaskBitOffset() {
		return this._bitNumber - 1;
	}

	/**
	 * Get a `BitmaskEnum` objects for a bit number.
	 *
	 * @param {number} bitNumber
	 *        a bit number value of the `BitmaskEnum` object to find
	 * @param {Iterable<BitmaskEnum>} values
	 *        the complete set of possible `BitmaskEnum` objects
	 * @return {BitmaskEnum} the matching `BitmaskEnum`, or `null`
	 */
	static enumForBitNumber(bitNumber, values) {
		for (const c of values) {
			const n = c.bitmaskBitNumber;
			if (n == bitNumber) {
				return c;
			}
		}
		return null;
	}

	/**
	 * Get a bitmask value for a set of {@code Bitmaskable} objects.
	 *
	 * @param {Iterable<BitmaskEnum>} maskables
	 *        the set of `BitmaskEnum` objects
	 * @return {number} a bitmask value of all {@link module:util~BitmaskEnum#bitmaskBitOffset()}
	 *         values of the given `maskables`
	 */
	static bitmaskValue(maskables) {
		var mask = 0;
		if (maskables != null) {
			for (const c of maskables) {
				if (c.bitmaskBitOffset >= 0) {
					mask |= 1 << c.bitmaskBitOffset;
				}
			}
		}
		return mask;
	}

	/**
	 * Convert a bitmask value into a set of {@code Bitmaskable} objects.
	 *
	 * @param {number} mask
	 *        a bitmask value of a set of {@code Bitmaskable} objects
	 * @param {BitmaskEnum} clazz
	 *        the class of an enumeration of `BitmaskEnum` objects
	 * @return {Set<BitmaskEnum>} a set of `BitmaskEnum` objects
	 */
	static setForBitmaskEnum(mask, clazz) {
		return BitmaskEnum.setForBitmask(mask, clazz.enumValues());
	}

	/**
	 * Convert a bitmask value into a set of `BitmaskEnum` objects.
	 *
	 * @param {number} mask
	 *        a bitmask value of a set of `BitmaskEnum` objects
	 * @param {Iterable<BitmaskEnum>} values
	 *        the complete set of possible `BitmaskEnum` objects
	 * @return {Set<BitmaskEnum>} a set of `BitmaskEnum` objects
	 */
	static setForBitmask(mask, values) {
		if (mask < 1) {
			return new Set();
		}
		var set = new Set();
		for (const c of values) {
			const b = c.bitmaskBitOffset;
			if (b >= 0 && ((mask >> b) & 1) == 1) {
				set.add(c);
			}
		}
		return set;
	}
}

export default BitmaskEnum;
