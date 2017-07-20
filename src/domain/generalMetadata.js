/**
 * General metadata with a basic structure.
 * 
 * This metadata can be associated with a variety of objects within SolarNetwork, such
 * as users, nodes, and datum.
 * 
 * @alias module:domain~GeneralMetadata
 */
class GeneralMetadata {

    /**
     * Constructor.
     * 
     * @param {Map<string, *>} [info] the general metadata map
     * @param {Map<string, Map<string, *>>} [propertyInfo] the property metadata map
     * @param {Set<string>} [tags] the tags
     */
    constructor(info, propertyInfo, tags) {
        this.info = info || null;
        this.propertyInfo = propertyInfo || null;
        this.tags = (tags instanceof Set ? tags : Array.isArray(tags) ? new Set(tags) : null);
    }

    /**
     * Get this object as a standard JSON encoded string value.
     * 
     * @return {string} the JSON encoded string
     */
    toJsonEncoding() {
        const result = {};
        const info = this.info;
        if ( info ) {
            result['m'] = stringMapToObject(info);
        }
        const propertyInfo = this.propertyInfo;
        if ( propertyInfo ) {
            result['pm'] = stringMapToObject(propertyInfo);
        }
        const tags = this.tags;
        if ( tags ) {
            result['t'] = Array.from(tags);
        }

		return JSON.stringify(result);
    }

    /**
     * Parse a JSON string into a {@link module:domain~GeneralMetadata} instance.
     * 
     * The JSON must be encoded the same way {@link module:domain~GeneralMetadata#toJsonEncoding} does.
     * 
     * @param {string} json the JSON to parse
     * @returns {module:domain~GeneralMetadata} the metadata instance 
     */
    static fromJsonEncoding(json) {
        let m, pm, t;
        if ( json ) {
            const obj = JSON.parse(json);
            m = (obj['m'] ? objectToStringMap(obj['m']) : null);
            pm = (obj['pm'] ? objectToStringMap(obj['pm']) : null);
            t = (Array.isArray(obj['t']) ? new Set(obj['t']) : null);
        }
        return new GeneralMetadata(m, pm, t);
    }
}

/**
 * Convert a `Map` into a simple object.
 * 
 * The keys are assumed to be strings. Values that are themselves `Map` instances
 * will be converted to simple objects as well.
 * 
 * @param {Map<string, *>} strMap a Map with string keys; nested Map objects are also handled
 * @returns {object} a simple object
 * @see {@link objectToStringMap} for the reverse conversion
 * @alias module:domain~stringMapToObject
 */
function stringMapToObject(strMap) {
    const obj = Object.create(null);
    if ( strMap ) {
        for (const [k,v] of strMap) {
            obj[k] = (v instanceof Map ? stringMapToObject(v) : v);
        }
    }
    return obj;
}

/**
 * Convert a simple object into a `Map` instance.
 * 
 * Property values that are themselves objects will be converted into `Map`
 * instances as well.
 * 
 * @param {object} obj a simple object
 * @returns {Map<string, *>} a Map with string keys; nested Map objects are also handled
 * @see {@link module:domain~stringMapToObject} for the reverse conversion
 * @alias module:domain~objectToStringMap
 */
function objectToStringMap(obj) {
    const strMap = new Map();
    if ( obj ) {
        for (const k of Object.keys(obj)) {
            const v = obj[k];
            strMap.set(k, (typeof v === 'object' ? objectToStringMap(v) : v));
        }
    }
    return strMap;
}

export default GeneralMetadata;
export { stringMapToObject, objectToStringMap };
