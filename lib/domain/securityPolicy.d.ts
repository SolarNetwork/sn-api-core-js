import { Aggregation } from "./aggregation.js";
import { LocationPrecision } from "./locationPrecision.js";
import JsonEncodable from "../util/jsonEncodable.js";
/**
 * An object with properties that can be restricted by a {@link Domain.SecurityPolicy}.
 *
 * @see {@link Domain.SecurityPolicy#restrict}
 */
interface SecurityPolicyFilter {
    /** The node IDs. */
    nodeIds?: Set<number>;
    /** The source IDs. */
    sourceIds?: Set<string>;
}
/**
 * An immutable set of security restrictions that can be attached to other objects, like auth tokens.
 *
 * Use the {@link Domain.SecurityPolicyBuilder} to create instances of this class with a fluent API.
 */
declare class SecurityPolicy implements JsonEncodable {
    #private;
    /**
     * Constructor.
     *
     * @param nodeIds - the node IDs to restrict to, or `undefined` for no restriction
     * @param sourceIds - the source ID to restrict to, or `undefined` for no restriction
     * @param aggregations - the aggregation names to restrict to, or `undefined` for no restriction
     * @param minAggregation - if specified, a minimum aggregation level that is allowed
     * @param locationPrecisions - the location precision names to restrict to, or `undefined` for no restriction
     * @param minLocationPrecision - if specified, a minimum location precision that is allowed
     * @param nodeMetadataPaths - the `SolarNodeMetadata` paths to restrict to, or `undefined` for no restriction
     * @param userMetadataPaths - the `UserNodeMetadata` paths to restrict to, or `undefined` for no restriction
     */
    constructor(nodeIds?: Set<number> | number[], sourceIds?: Set<string> | string[], aggregations?: Set<Aggregation> | Aggregation[], minAggregation?: Aggregation, locationPrecisions?: Set<LocationPrecision> | LocationPrecision[], minLocationPrecision?: LocationPrecision, nodeMetadataPaths?: Set<string> | string[], userMetadataPaths?: Set<string> | string[]);
    /**
     * Get the node IDs.
     *
     * @returns the node IDs, or `undefined`
     */
    get nodeIds(): Set<number> | undefined;
    /**
     * Get the source IDs.
     *
     * @returns the source IDs, or `undefined`
     */
    get sourceIds(): Set<string> | undefined;
    /**
     * Get the aggregations.
     *
     * @returns the aggregations, or `undefined`
     */
    get aggregations(): Set<Aggregation> | undefined;
    /**
     * Get the location precisions.
     *
     * @returns the precisions, or `undefined`
     */
    get locationPrecisions(): Set<LocationPrecision> | undefined;
    /**
     * Get the minimum aggregation.
     *
     * @returns the minimum aggregation, or `undefined`
     */
    get minAggregation(): Aggregation | undefined;
    /**
     * Get the minimum location precision.
     *
     * @returns the minimum precision, or `undefined`
     */
    get minLocationPrecision(): LocationPrecision | undefined;
    /**
     * Get the node metadata paths.
     *
     * @returns the node metadata paths, or `undefined`
     */
    get nodeMetadataPaths(): Set<string> | undefined;
    /**
     * Get the user metadata paths.
     *
     * @returns the user metadata paths, or `undefined`
     */
    get userMetadataPaths(): Set<string> | undefined;
    /**
     * Apply this policy's restrictions on a filter.
     *
     * You can use this method to enforce aspects of a security policy on a `SecurityPolicyFilter`.
     * For example:
     *
     * ```
     * const policy = SecurityPolicy.fromJsonObject({
     *   nodeIds:   [1, 2],
     *   sourceIds: ["/s1/**"]
     * });
     *
     * const filter = policy.restrict({
     *   nodeIds:   new Set([2, 3, 4]),
     *   sourceIds: new Set(["/s1/a", "/s1/a/b", "/s2/a", "/s3/a"])
     * });
     *
     * // now filter contains only the node/source IDs allowed by the policy:
     * {
     *   nodeIds:   new Set([2]),
     *   sourceIds: new Set(["/s1/a", "/s1/a/b"])
     * };
     * ```
     *
     * @param filter the filter to enforce this policy's restrictions on
     * @returns a new filter instance
     */
    restrict(filter: SecurityPolicyFilter): SecurityPolicyFilter;
    /**
     * Get this object in standard JSON form.
     *
     * An example result looks like this:
     *
     * ```
     * {
     *   "nodeIds": [1,2,3],
     *   "sourceIds": ["a", "b", "c"]
     *   "aggregations": ["Hour"]
     * }
     * ```
     *
     * @return an object, ready for JSON encoding
     */
    toJsonObject(): Record<string, any>;
    /**
     * Get this object as a standard JSON encoded string value.
     *
     * This method calls {@link Domain.SecurityPolicy#toJsonEncoding} and then
     * turns that into a JSON string.
     *
     * @return the JSON encoded string
     * @see {@link Domain.SecurityPolicy#toJsonObject}
     */
    toJsonEncoding(): string;
    /**
     * Parse a JSON string into a {@link Domain.SecurityPolicy} instance.
     *
     * The JSON must be encoded the same way {@link Domain.SecurityPolicy#toJsonEncoding} does.
     *
     * @param json the JSON to parse
     * @returns the datum identifier instance, or `undefined` if `json` is `undefined`
     */
    static fromJsonEncoding(json: string | undefined): SecurityPolicy | undefined;
    /**
     * Create an identifier instance from an object parsed from a JSON string.
     *
     * The object must have been parsed from JSON that was encoded the same way
     * {@link Domain.SecurityPolicy#toJsonEncoding} does.
     *
     * @param obj the object parsed from JSON
     * @returns the new instance, or `undefined` if `obj` is `undefined`
     */
    static fromJsonObject(obj: any): SecurityPolicy | undefined;
}
/**
 * A mutable builder object for {@link Domain.SecurityPolicy} instances.
 */
declare class SecurityPolicyBuilder {
    #private;
    nodeIds?: Set<number>;
    sourceIds?: Set<string>;
    aggregations?: Set<Aggregation>;
    minAggregation?: Aggregation;
    locationPrecisions?: Set<LocationPrecision>;
    minLocationPrecision?: LocationPrecision;
    nodeMetadataPaths?: Set<string>;
    userMetadataPaths?: Set<string>;
    /**
     * Apply all properties from another `SecurityPolicy`.
     *
     * @param policy the `SecurityPolicy` to apply
     * @returns this object
     */
    withPolicy(policy?: SecurityPolicy): this;
    /**
     * Merge all properties from another SecurityPolicy.
     *
     * @param policy the `SecurityPolicy` to merge
     * @returns this object
     */
    addPolicy(policy?: SecurityPolicy): this;
    /**
     * Set the node IDs.
     *
     * @param nodeIds - the node IDs to use
     * @returns this object
     */
    withNodeIds(nodeIds?: Set<number> | number[] | number): this;
    /**
     * Add a set of node IDs.
     *
     * @param nodeIds - the node IDs to add
     * @returns this object
     */
    addNodeIds(nodeIds?: Set<number> | number[] | number): this;
    /**
     * Set the node metadata paths.
     *
     * @param nodeMetadataPaths - the path expressions to use
     * @returns this object
     */
    withNodeMetadataPaths(nodeMetadataPaths?: Set<string> | string[] | string): this;
    /**
     * Add a set of node metadata paths.
     *
     * @param nodeMetadataPaths - the path expressions to add
     * @returns this object
     */
    addNodeMetadataPaths(nodeMetadataPaths?: Set<string> | string[] | string): this;
    /**
     * Set the user metadata paths.
     *
     * @param userMetadataPaths - the path expressions to use
     * @returns this object
     */
    withUserMetadataPaths(userMetadataPaths?: Set<string> | string[] | string): this;
    /**
     * Add a set of user metadata paths.
     *
     * @param userMetadataPaths - the path expressions to add
     * @returns this object
     */
    addUserMetadataPaths(userMetadataPaths?: Set<string> | string[] | string): this;
    /**
     * Set the source IDs.
     *
     * @param sourceIds - the source IDs to use
     * @returns this object
     */
    withSourceIds(sourceIds?: Set<string> | string[] | string): this;
    /**
     * Add source IDs.
     *
     * @param sourceIds - the source IDs to add
     * @returns this object
     */
    addSourceIds(sourceIds?: Set<string> | string[] | string): this;
    /**
     * Set the aggregations.
     *
     * @param aggregations - the aggregations to use
     * @returns this object
     */
    withAggregations(aggregations?: Set<Aggregation | string> | Aggregation[] | Aggregation | string[] | string): this;
    /**
     * Set the aggregations.
     *
     * @param aggregations - the aggregations to add
     * @returns this object
     */
    addAggregations(aggregations?: Set<Aggregation | string> | Aggregation[] | Aggregation | string[] | string): this;
    /**
     * Set the location precisions.
     *
     * @param locationPrecisions - the precisions to use
     * @returns this object
     */
    withLocationPrecisions(locationPrecisions?: Set<LocationPrecision | string> | LocationPrecision[] | LocationPrecision | string[] | string): this;
    /**
     * Add location precisions.
     *
     * @param locationPrecisions - the precisions to add
     * @returns this object
     */
    addLocationPrecisions(locationPrecisions?: Set<LocationPrecision | string> | LocationPrecision[] | LocationPrecision | string[] | string): this;
    /**
     * Set a minimum aggregation level.
     *
     * @param minAggregation - the minimum aggregation level to set
     * @returns this object
     */
    withMinAggregation(minAggregation?: Aggregation | string): this;
    /**
     * Treat the configured `locationPrecisions` set as a single
     * minimum value or a list of exact values.
     *
     * By default if `locationPrecisions` is configured with a single
     * value it will be treated as a <em>minimum</em> value, and any
     * {@link Domain.LocationPrecision} with a {@link Domain.LocationPrecision#precision} equal
     * to or higher than that value's level will be included in the generated
     * {@link Domain.SecurityPolicy#locationPrecisions} set. Set this to
     * `undefined` to disable that behavior and treat
     * `locationPrecisions` as the exact values to include in the
     * generated {@link Domain.SecurityPolicy#locationPrecisions} set.
     *
     * @param minLocationPrecision -
     *        `undefined` to treat configured location precision values
     *        as-is, or else the minimum threshold
     * @returns this object
     */
    withMinLocationPrecision(minLocationPrecision?: LocationPrecision | string): this;
    /**
     * Create a new {@link SecurityPolicy} out of the properties configured on this builder.
     *
     * @returns {module:domain~SecurityPolicy} the new policy instance
     */
    build(): SecurityPolicy;
}
export default SecurityPolicy;
export { SecurityPolicyBuilder, type SecurityPolicyFilter };
//# sourceMappingURL=securityPolicy.d.ts.map