/**
 * A description of a sort applied to a property of a collection.
 */
class SortDescriptor {

    /**
     * Constructor.
     * 
     * @param {string} key the property to sort on
     * @param {boolean} [descending] <code>true</code> to sort in descending order, <code>false</code> for ascending
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
     * @returns {boolean} <code>true</code> if descending order, <code>false</code> for ascending
     */
    get descending() {
        return this._descending;
    }

    /**
     * Get this object as a standard URI encoded (query parameters) string value.
     * 
     * If <code>index</code> is provided and non-negative, then the query parameters will
     * be encoded as an array property named <code>sortDescriptors</code>. Otherwise just
     * bare <code>key</code> and <code>descending</code> properties will be used. The 
     * <code>descending</code> property is only added if it is <code>true</code>.
     * 
     * @param {number} [index] an optional array property index
     * @param {string} [propertyName=sortDescriptors] an optional array property name, only used if <code>index</code> is also provided
     * @return {string} the URI encoded string
     */
    toUriEncoding(index, propertyName) {
        let result,
            propName = (propertyName || 'sortDescriptors');
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
