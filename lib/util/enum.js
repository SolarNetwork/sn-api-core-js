/**
 * An enumerated object base class.
 *
 * @typeParam T the enum type
 * @public
 */
class Enum {
    #name;
    /**
     * Constructor.
     *
     * @param name - the name
     */
    constructor(name) {
        this.#name = name;
    }
    /**
     * Get the enum name.
     *
     * @returns the name
     */
    get name() {
        return this.#name;
    }
    /**
     * Test if a string is equal to this enum's name.
     *
     * As long as enum values are consistently obtained from the {@link Util.Enum.enumValues}
     * array then enum instances can be compared with `===`. If unsure, this method can be used
     * to compare string values instead.
     *
     * If `value` is passed as an actual Enum instance, then if that enum is the same class
     * as this enum it's `name` is compared to this instance's `name`.
     *
     * @param value - the value to test
     * @returns `true` if `value` is the same as this instance's `name` value
     */
    equals(value) {
        if (value && this.constructor === value.constructor) {
            return value.#name === this.#name;
        }
        return value === this.#name;
    }
    /**
     * Get all enum values.
     *
     * This method must be overridden by subclasses to return something meaningful.
     * This implementation returns an empty array.
     *
     * @abstract
     * @returns all enum values
     */
    static enumValues() {
        return [];
    }
    /**
     * This method takes an array of enums and turns them into a mapped object, using the enum
     * `name` as object property names.
     *
     * @param enums - the enum list to turn into a value object
     * @returns an object with enum `name` properties with associated enum values
     */
    static enumsValue(enums) {
        return Object.freeze(enums.reduce((obj, e) => {
            obj[e.name] = e;
            return obj;
        }, {}));
    }
    /**
     * Get an enum instance from its name.
     *
     * This method searches the {@link Util.Enum.enumValues} array for a matching value.
     *
     * @param name - the enum name to get an instnace for
     * @returns the instance, or `undefined` if no instance exists for the given `name`
     */
    static valueOf(name) {
        const enums = this.enumValues();
        if (!Array.isArray(enums)) {
            return undefined;
        }
        for (let i = 0, len = enums.length; i < len; i += 1) {
            if (name === enums[i].name) {
                return enums[i];
            }
        }
        return undefined;
    }
    /**
     * Get the names of a set of `Enum` instances.
     *
     * @param set - the set of `Enum` instances to get the names of
     * @returns array of `Enum` name values
     */
    static namesFor(set) {
        const result = [];
        if (set) {
            for (const e of set) {
                result.push(e.name);
            }
        }
        return result;
    }
}
export default Enum;
//# sourceMappingURL=enum.js.map