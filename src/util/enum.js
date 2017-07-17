/**
 * An enumerated object base class.
 * 
 * This class is essentially abstract, and must be extended by another
 * class that overrides the {@link Enum.enumValues} method.
 * 
 * @abstract
 */
class Enum {

    /**
     * Constructor.
     * 
     * @param {string} name the name
     */
    constructor(name) {
        this._name = name;
        if ( this.constructor === Enum ) {
            Object.freeze(this);
        }
    }

    /**
     * Get the enum name.
     * 
     * @returns {string} the  name
     */
    get name() {
        return this._name;
    }

    /**
     * Get all enum values.
     * 
     * This method must be overridden by subclasses to return something meaningful.
     * This implementation returns an empty array.
     * 
     * @abstract
     * @returns {Enum[]} get all enum values
     */
    static enumValues() {
        return [];
    }

    /**
     * This method takes an array of enums and turns them into a mapped object, using the enum
     * <code>name</code> as object property names.
     * 
     * @param {Enum[]} enums the enum list to turn into a value object
     * @returns {Object} an object with enum <code>name</code> properties with associated enum values 
     */
    static enumsValue(enums) {
        return Object.freeze(enums.reduce((obj, e) => {
            obj[e.name] = e;
            return obj;
        }, {}));
    }
}

export default Enum;
