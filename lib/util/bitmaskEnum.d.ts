import Enum from "./enum.js";
/**
 * An immutable enum-like object with an associated bitmask support.
 *
 * This class must be extended by another class that overrides the inerited
 * {@link Util.Enum.enumValues} method.
 */
declare abstract class BitmaskEnum extends Enum {
    #private;
    /**
     * Constructor.
     *
     * @param name - the name
     * @param bitNumber - the bit offset, starting from `1` for the least significant bit
     */
    constructor(name: string, bitNumber: number);
    /**
     * Get the bit offset value, starting from `1` for the least significant bit.
     *
     * @returns the 1-based value
     */
    get bitmaskBitNumber(): number;
    /**
     * Get the bit offset value, starting from `0` for the least significant bit.
     *
     * @returns the 0-based value
     */
    get bitmaskBitOffset(): number;
    /**
     * Get a `BitmaskEnum` objects for a bit number.
     *
     * @param bitNumber - a bit number value of the `BitmaskEnum` object to find
     * @param values - the complete set of possible `BitmaskEnum` objects
     * @returns the matching `BitmaskEnum`, or `undefined`
     */
    static enumForBitNumber<T extends BitmaskEnum>(bitNumber: number, values: Iterable<T>): T | undefined;
    /**
     * Get a bitmask value for a set of `BitmaskEnum` objects.
     *
     * @param maskables - the set of `BitmaskEnum` objects
     * @returns a bitmask value of all {@link Util.BitmaskEnum#bitmaskBitOffset}
     *         values of the given `maskables`
     */
    static bitmaskValue<T extends BitmaskEnum>(maskables: Iterable<T>): number;
    /**
     * Convert a bitmask value into a set of `BitmaskEnum` objects.
     *
     * @param mask - a bitmask value of a set of `BitmaskEnum` objects
     * @param clazz -  the class of an enumeration of `BitmaskEnum` objects
     * @returns a set of `BitmaskEnum` objects
     */
    static setForBitmaskEnum<T extends BitmaskEnum>(mask: number, clazz: typeof BitmaskEnum): Set<T>;
    /**
     * Convert a bitmask value into a set of `BitmaskEnum` objects.
     *
     * @param mask - a bitmask value of a set of `BitmaskEnum` objects
     * @param values -  the complete set of possible `BitmaskEnum` objects
     * @returns a set of `BitmaskEnum` objects
     */
    static setForBitmask<T extends BitmaskEnum>(mask: number, values?: Iterable<T>): Set<T>;
}
export default BitmaskEnum;
//# sourceMappingURL=bitmaskEnum.d.ts.map