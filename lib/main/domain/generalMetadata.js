import { stringMapToObject, objectToStringMap } from "../util/objects.js";
/**
 * General metadata with a basic structure.
 *
 * This metadata can be associated with a variety of objects within SolarNetwork, such
 * as users, nodes, and datum.
 */
class GeneralMetadata {
    /** The general metadata map. */
    info;
    /** The property metadata map. */
    propertyInfo;
    /** The tags. */
    tags;
    /**
     * Constructor.
     *
     * @param info - the general metadata map
     * @param propertyInfo - the property metadata map
     * @param tags - the tags
     */
    constructor(info, propertyInfo, tags) {
        this.info = info;
        this.propertyInfo = propertyInfo;
        this.tags =
            tags instanceof Set
                ? tags
                : Array.isArray(tags)
                    ? new Set(tags)
                    : undefined;
    }
    /**
     * Get this object as a standard JSON encoded string value.
     *
     * @return the JSON encoded string
     */
    toJsonEncoding() {
        const result = {};
        const info = this.info;
        if (info) {
            result["m"] = stringMapToObject(info);
        }
        const propertyInfo = this.propertyInfo;
        if (propertyInfo) {
            result["pm"] = stringMapToObject(propertyInfo);
        }
        const tags = this.tags;
        if (tags) {
            result["t"] = Array.from(tags);
        }
        return JSON.stringify(result);
    }
    /**
     * Parse a JSON string into a `GeneralMetadata` instance.
     *
     * The JSON must be encoded the same way {@link Domain.GeneralMetadata#toJsonEncoding} does.
     *
     * @param json - the JSON to parse
     * @returns the metadata instance
     */
    static fromJsonEncoding(json) {
        let m;
        let pm;
        let t;
        if (json) {
            const obj = JSON.parse(json);
            m = obj["m"] ? objectToStringMap(obj["m"]) : undefined;
            pm = obj["pm"] ? objectToStringMap(obj["pm"]) : undefined;
            t = Array.isArray(obj["t"]) ? new Set(obj["t"]) : undefined;
        }
        return new GeneralMetadata(m, pm, t);
    }
}
export default GeneralMetadata;
//# sourceMappingURL=generalMetadata.js.map