import { Aggregation } from "./aggregation.js";
import { LocationPrecision } from "./locationPrecision.js";
/**
 * An immutable set of security restrictions that can be attached to other objects, like auth tokens.
 *
 * Use the {@link Domain.SecurityPolicyBuilder} to create instances of this class with a fluent API.
 */
declare class SecurityPolicy {
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
     * Get this object as a standard JSON encoded string value.
     *
     * @return the JSON encoded string
     */
    toJsonEncoding(): string;
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
    withAggregations(aggregations?: Set<Aggregation> | Aggregation[] | Aggregation): this;
    /**
     * Set the aggregations.
     *
     * @param aggregations - the aggregations to add
     * @returns this object
     */
    addAggregations(aggregations?: Set<Aggregation> | Aggregation[] | Aggregation): this;
    /**
     * Set the location precisions.
     *
     * @param locationPrecisions - the precisions to use
     * @returns this object
     */
    withLocationPrecisions(locationPrecisions?: Set<LocationPrecision> | LocationPrecision[] | LocationPrecision): this;
    /**
     * Add location precisions.
     *
     * @param locationPrecisions - the precisions to add
     * @returns this object
     */
    addLocationPrecisions(locationPrecisions?: Set<LocationPrecision> | LocationPrecision[] | LocationPrecision): this;
    /**
     * Set a minimum aggregation level.
     *
     * @param minAggregation - the minimum aggregation level to set
     * @returns this object
     */
    withMinAggregation(minAggregation?: Aggregation): this;
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
    withMinLocationPrecision(minLocationPrecision?: LocationPrecision): this;
    /**
     * Create a new {@link SecurityPolicy} out of the properties configured on this builder.
     *
     * @returns {module:domain~SecurityPolicy} the new policy instance
     */
    build(): SecurityPolicy;
}
export default SecurityPolicy;
export { SecurityPolicyBuilder };
//# sourceMappingURL=securityPolicy.d.ts.map