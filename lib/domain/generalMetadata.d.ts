/**
 * General metadata with a basic structure.
 *
 * This metadata can be associated with a variety of objects within SolarNetwork, such
 * as users, nodes, and datum.
 */
declare class GeneralMetadata {
    /** The general metadata map. */
    info?: Map<string, any>;
    /** The property metadata map. */
    propertyInfo?: Map<string, Map<string, any>>;
    /** The tags. */
    tags?: Set<string>;
    /**
     * Constructor.
     *
     * @param info - the general metadata map
     * @param propertyInfo - the property metadata map
     * @param tags - the tags
     */
    constructor(info?: Map<string, any>, propertyInfo?: Map<string, Map<string, any>>, tags?: Set<string> | string[]);
    /**
     * Get this object as a standard JSON encoded string value.
     *
     * @return the JSON encoded string
     */
    toJsonEncoding(): string;
    /**
     * Parse a JSON string into a `GeneralMetadata` instance.
     *
     * The JSON must be encoded the same way {@link Domain.GeneralMetadata#toJsonEncoding} does.
     *
     * @param json - the JSON to parse
     * @returns the metadata instance
     */
    static fromJsonEncoding(json: string): GeneralMetadata;
}
export default GeneralMetadata;
//# sourceMappingURL=generalMetadata.d.ts.map