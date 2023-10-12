import Enum from "./enum.js";
/**
 * An immutable enum-like object with an associated key value.
 *
 * This class must be extended by another class that overrides the
 * inerited {@link Util.Enum.enumValues} method.
 */
declare abstract class KeyedEnum extends Enum {
    #private;
    /**
     * Constructor.
     *
     * @param name - the unique name for this type
     * @param key - the key value associated with this type
     */
    constructor(name: string, key: string);
    /**
     * Get the key value.
     *
     * @returns the key value
     */
    get key(): string;
    /**
     * Get an enum instance from its key or name.
     *
     * This method searches the {@link Util.Enum.enumValues} array for a matching key or name value.
     *
     * @param value - the enum key or name to get the enum instance for
     * @returns the matching enum value, or `undefined` if no values match
     */
    static valueOf<T extends Enum>(value: string): T | undefined;
}
export default KeyedEnum;
//# sourceMappingURL=keyedEnum.d.ts.map