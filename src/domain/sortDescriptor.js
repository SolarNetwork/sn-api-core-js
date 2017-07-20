/**
 * A description of a sort applied to a property of a collection.
 * @alias module:domain~SortDescriptor
 */
class SortDescriptor {

    /**
     * Constructor.
     * 
     * @param {string} key the property to sort on
     * @param {boolean} [descending] `true` to sort in descending order, `false` for ascending
     */
    constructor(key, descending) {
        this._key = key;
        this._descending = !!descending;
    }

    /**
     * Get the sort property name.
     * 
     * @returns {string} the sort key
     */
    get key() {
        return this._key;
    }

    /**
     * Get the sorting direction.
     * 
     * @returns {boolean} `true` if descending order, `false` for ascending
     */
    get descending() {
        return this._descending;
    }

    /**
     * Get this object as a standard URI encoded (query parameters) string value.
     * 
     * If `index` is provided and non-negative, then the query parameters will
     * be encoded as an array property named `sorts`. Otherwise just
     * bare `key` and `descending` properties will be used. The 
     * `descending` property is only added if it is `true`.
     * 
     * @param {number} [index] an optional array property index
     * @param {string} [propertyName=sorts] an optional array property name, only used if `index` is also provided
     * @return {string} the URI encoded string
     */
    toUriEncoding(index, propertyName) {
        let result,
            propName = (propertyName || 'sorts');
        if ( index !== undefined && index >= 0 ) {
            result = encodeURIComponent(propName +'[' +index +'].key') + '=';
        } else {
            result = 'key=';
        }
        result += encodeURIComponent(this.key);
        if ( this.descending ) {
            if ( index !== undefined && index >= 0 ) {
                result += '&' +encodeURIComponent(propName +'[' +index +'].descending') + '=true';
            } else {
                result += '&descending=true';
            }
        }
        return result;
    }

}

export default SortDescriptor;
