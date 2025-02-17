import { Aggregation } from "./aggregation.js";
import { LocationPrecision } from "./locationPrecision.js";
import { intersection } from "../util/arrays.js";
import { wildcardPatternToRegExp } from "../util/datum.js";
import { nonEmptySet, nonEmptyMergedSets } from "../util/objects.js";
/**
 * An immutable set of security restrictions that can be attached to other objects, like auth tokens.
 *
 * Use the {@link Domain.SecurityPolicyBuilder} to create instances of this class with a fluent API.
 */
class SecurityPolicy {
    #nodeIds;
    #sourceIds;
    #aggregations;
    #minAggregation;
    #locationPrecisions;
    #minLocationPrecision;
    #nodeMetadataPaths;
    #userMetadataPaths;
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
    constructor(nodeIds, sourceIds, aggregations, minAggregation, locationPrecisions, minLocationPrecision, nodeMetadataPaths, userMetadataPaths) {
        this.#nodeIds = nonEmptySet(nodeIds);
        this.#sourceIds = nonEmptySet(sourceIds);
        this.#aggregations = nonEmptySet(aggregations);
        this.#minAggregation =
            minAggregation instanceof Aggregation ? minAggregation : undefined;
        this.#locationPrecisions = nonEmptySet(locationPrecisions);
        this.#minLocationPrecision =
            minLocationPrecision instanceof LocationPrecision
                ? minLocationPrecision
                : undefined;
        this.#nodeMetadataPaths = nonEmptySet(nodeMetadataPaths);
        this.#userMetadataPaths = nonEmptySet(userMetadataPaths);
        if (this.constructor === SecurityPolicy) {
            Object.freeze(this);
        }
    }
    /**
     * Get the node IDs.
     *
     * @returns the node IDs, or `undefined`
     */
    get nodeIds() {
        return this.#nodeIds;
    }
    /**
     * Get the source IDs.
     *
     * @returns the source IDs, or `undefined`
     */
    get sourceIds() {
        return this.#sourceIds;
    }
    /**
     * Get the aggregations.
     *
     * @returns the aggregations, or `undefined`
     */
    get aggregations() {
        return this.#aggregations;
    }
    /**
     * Get the location precisions.
     *
     * @returns the precisions, or `undefined`
     */
    get locationPrecisions() {
        return this.#locationPrecisions;
    }
    /**
     * Get the minimum aggregation.
     *
     * @returns the minimum aggregation, or `undefined`
     */
    get minAggregation() {
        return this.#minAggregation;
    }
    /**
     * Get the minimum location precision.
     *
     * @returns the minimum precision, or `undefined`
     */
    get minLocationPrecision() {
        return this.#minLocationPrecision;
    }
    /**
     * Get the node metadata paths.
     *
     * @returns the node metadata paths, or `undefined`
     */
    get nodeMetadataPaths() {
        return this.#nodeMetadataPaths;
    }
    /**
     * Get the user metadata paths.
     *
     * @returns the user metadata paths, or `undefined`
     */
    get userMetadataPaths() {
        return this.#userMetadataPaths;
    }
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
    restrict(filter) {
        const result = {};
        if (filter.nodeIds) {
            result.nodeIds = this.#nodeIds
                ? intersection(this.#nodeIds, filter.nodeIds)
                : filter.nodeIds;
        }
        if (filter.sourceIds) {
            if (this.#sourceIds) {
                const filteredSourceIds = new Set();
                this.#sourceIds.forEach((pat) => {
                    const regex = wildcardPatternToRegExp(pat);
                    for (const sourceId of filter.sourceIds) {
                        if (regex.test(sourceId)) {
                            filteredSourceIds.add(sourceId);
                        }
                    }
                });
                result.sourceIds = filteredSourceIds;
            }
            else {
                result.sourceIds = filter.sourceIds;
            }
        }
        return result;
    }
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
    toJsonObject() {
        const result = {};
        if (this.#nodeIds) {
            result.nodeIds = Array.from(this.#nodeIds);
        }
        if (this.#sourceIds) {
            result.sourceIds = Array.from(this.#sourceIds);
        }
        if (this.#aggregations) {
            result.aggregations = Array.from(this.#aggregations).map((e) => e.name);
        }
        if (this.#locationPrecisions) {
            result.locationPrecisions = Array.from(this.#locationPrecisions).map((e) => e.name);
        }
        if (this.#minAggregation) {
            result.minAggregation = this.#minAggregation.name;
        }
        if (this.#minLocationPrecision) {
            result.minLocationPrecision = this.#minLocationPrecision.name;
        }
        if (this.#nodeMetadataPaths) {
            result.nodeMetadataPaths = Array.from(this.#nodeMetadataPaths);
        }
        if (this.#userMetadataPaths) {
            result.userMetadataPaths = Array.from(this.#userMetadataPaths);
        }
        return result;
    }
    /**
     * Get this object as a standard JSON encoded string value.
     *
     * This method calls {@link Domain.SecurityPolicy#toJsonObject} and then
     * turns that into a JSON string.
     *
     * @return the JSON encoded string
     * @see {@link Domain.SecurityPolicy#toJsonObject}
     */
    toJsonEncoding() {
        return JSON.stringify(this.toJsonObject());
    }
    /**
     * Parse a JSON string into a {@link Domain.SecurityPolicy} instance.
     *
     * The JSON must be encoded the same way {@link Domain.SecurityPolicy#toJsonEncoding} does.
     *
     * @param json the JSON to parse
     * @returns the datum identifier instance, or `undefined` if `json` is `undefined`
     */
    static fromJsonEncoding(json) {
        if (json === undefined) {
            return undefined;
        }
        return this.fromJsonObject(JSON.parse(json));
    }
    /**
     * Create an identifier instance from an object parsed from a JSON string.
     *
     * The object must have been parsed from JSON that was encoded the same way
     * {@link Domain.SecurityPolicy#toJsonEncoding} does.
     *
     * @param obj the object parsed from JSON
     * @returns the new instance, or `undefined` if `obj` is `undefined`
     */
    static fromJsonObject(obj) {
        if (!obj) {
            return undefined;
        }
        const builder = new SecurityPolicyBuilder();
        if (obj.nodeIds) {
            builder.withNodeIds(obj.nodeIds);
        }
        if (obj.sourceIds) {
            builder.withSourceIds(obj.sourceIds);
        }
        if (obj.aggregations) {
            builder.withAggregations(obj.aggregations);
        }
        if (obj.minAggregation) {
            builder.withMinAggregation(obj.minAggregation);
        }
        if (obj.locationPrecisions) {
            builder.withLocationPrecisions(obj.locationPrecisions);
        }
        if (obj.minLocationPrecision) {
            builder.withMinLocationPrecision(obj.minLocationPrecision);
        }
        if (obj.nodeMetadataPaths) {
            builder.withNodeMetadataPaths(obj.nodeMetadataPaths);
        }
        if (obj.userMetadataPaths) {
            builder.withUserMetadataPaths(obj.userMetadataPaths);
        }
        return builder.build();
    }
}
const MIN_AGGREGATION_CACHE = new Map();
const MIN_LOCATION_PRECISION_CACHE = new Map();
/**
 * A mutable builder object for {@link Domain.SecurityPolicy} instances.
 */
class SecurityPolicyBuilder {
    nodeIds;
    sourceIds;
    aggregations;
    minAggregation;
    locationPrecisions;
    minLocationPrecision;
    nodeMetadataPaths;
    userMetadataPaths;
    /**
     * Apply all properties from another `SecurityPolicy`.
     *
     * @param policy the `SecurityPolicy` to apply
     * @returns this object
     */
    withPolicy(policy) {
        if (policy) {
            this.withAggregations(policy.aggregations)
                .withMinAggregation(policy.minAggregation)
                .withLocationPrecisions(policy.locationPrecisions)
                .withMinLocationPrecision(policy.minLocationPrecision)
                .withNodeIds(policy.nodeIds)
                .withSourceIds(policy.sourceIds)
                .withNodeMetadataPaths(policy.nodeMetadataPaths)
                .withUserMetadataPaths(policy.userMetadataPaths);
        }
        return this;
    }
    /**
     * Merge all properties from another SecurityPolicy.
     *
     * @param policy the `SecurityPolicy` to merge
     * @returns this object
     */
    addPolicy(policy) {
        if (policy) {
            this.addAggregations(policy.aggregations)
                .addLocationPrecisions(policy.locationPrecisions)
                .addNodeIds(policy.nodeIds)
                .addSourceIds(policy.sourceIds)
                .addNodeMetadataPaths(policy.nodeMetadataPaths)
                .addUserMetadataPaths(policy.userMetadataPaths);
            if (policy.minAggregation) {
                this.withMinAggregation(policy.minAggregation);
            }
            if (policy.minLocationPrecision) {
                this.withMinLocationPrecision(policy.minLocationPrecision);
            }
        }
        return this;
    }
    /**
     * Set the node IDs.
     *
     * @param nodeIds - the node IDs to use
     * @returns this object
     */
    withNodeIds(nodeIds) {
        this.nodeIds = nonEmptySet(nodeIds);
        return this;
    }
    /**
     * Add a set of node IDs.
     *
     * @param nodeIds - the node IDs to add
     * @returns this object
     */
    addNodeIds(nodeIds) {
        return this.withNodeIds(nonEmptyMergedSets(this.nodeIds, nodeIds));
    }
    /**
     * Set the node metadata paths.
     *
     * @param nodeMetadataPaths - the path expressions to use
     * @returns this object
     */
    withNodeMetadataPaths(nodeMetadataPaths) {
        this.nodeMetadataPaths = nonEmptySet(nodeMetadataPaths);
        return this;
    }
    /**
     * Add a set of node metadata paths.
     *
     * @param nodeMetadataPaths - the path expressions to add
     * @returns this object
     */
    addNodeMetadataPaths(nodeMetadataPaths) {
        return this.withNodeMetadataPaths(nonEmptyMergedSets(this.nodeMetadataPaths, nodeMetadataPaths));
    }
    /**
     * Set the user metadata paths.
     *
     * @param userMetadataPaths - the path expressions to use
     * @returns this object
     */
    withUserMetadataPaths(userMetadataPaths) {
        this.userMetadataPaths = nonEmptySet(userMetadataPaths);
        return this;
    }
    /**
     * Add a set of user metadata paths.
     *
     * @param userMetadataPaths - the path expressions to add
     * @returns this object
     */
    addUserMetadataPaths(userMetadataPaths) {
        return this.withUserMetadataPaths(nonEmptyMergedSets(this.userMetadataPaths, userMetadataPaths));
    }
    /**
     * Set the source IDs.
     *
     * @param sourceIds - the source IDs to use
     * @returns this object
     */
    withSourceIds(sourceIds) {
        this.sourceIds = nonEmptySet(sourceIds);
        return this;
    }
    /**
     * Add source IDs.
     *
     * @param sourceIds - the source IDs to add
     * @returns this object
     */
    addSourceIds(sourceIds) {
        return this.withSourceIds(nonEmptyMergedSets(this.sourceIds, sourceIds));
    }
    /**
     * Set the aggregations.
     *
     * @param aggregations - the aggregations to use
     * @returns this object
     */
    withAggregations(aggregations) {
        this.aggregations = this.#resolveAggregations(aggregations);
        return this;
    }
    #resolveAggregations(aggregations) {
        let aggs = nonEmptySet(aggregations);
        if (aggs !== undefined) {
            if (!(aggs.values().next().value instanceof Aggregation)) {
                const aggObjs = new Set();
                aggs.forEach((val) => {
                    const agg = Aggregation.valueOf(val.toString());
                    if (agg) {
                        aggObjs.add(agg);
                    }
                });
                aggs = aggObjs;
            }
        }
        return aggs;
    }
    /**
     * Set the aggregations.
     *
     * @param aggregations - the aggregations to add
     * @returns this object
     */
    addAggregations(aggregations) {
        return this.withAggregations(nonEmptyMergedSets(this.aggregations, this.#resolveAggregations(aggregations)));
    }
    /**
     * Set the location precisions.
     *
     * @param locationPrecisions - the precisions to use
     * @returns this object
     */
    withLocationPrecisions(locationPrecisions) {
        this.locationPrecisions =
            this.#resolveLocationPrecisions(locationPrecisions);
        return this;
    }
    #resolveLocationPrecisions(locationPrecisions) {
        let lPrecs = nonEmptySet(locationPrecisions);
        if (lPrecs !== undefined) {
            if (!(lPrecs.values().next().value instanceof LocationPrecision)) {
                const lPrecsObjs = new Set();
                lPrecs.forEach((val) => {
                    const agg = LocationPrecision.valueOf(val.toString());
                    if (agg) {
                        lPrecsObjs.add(agg);
                    }
                });
                lPrecs = lPrecsObjs;
            }
        }
        return lPrecs;
    }
    /**
     * Add location precisions.
     *
     * @param locationPrecisions - the precisions to add
     * @returns this object
     */
    addLocationPrecisions(locationPrecisions) {
        return this.withLocationPrecisions(nonEmptyMergedSets(this.locationPrecisions, this.#resolveLocationPrecisions(locationPrecisions)));
    }
    /**
     * Set a minimum aggregation level.
     *
     * @param minAggregation - the minimum aggregation level to set
     * @returns this object
     */
    withMinAggregation(minAggregation) {
        this.minAggregation =
            minAggregation instanceof Aggregation
                ? minAggregation
                : Aggregation.valueOf(minAggregation);
        return this;
    }
    /**
     * Build the effective aggregation level set from the policy settings.
     *
     * This computes a set of aggregation levels based on the configured `minAggregation`
     * and `aggregations` values.
     *
     * @returns the aggregation set
     * @private
     */
    #buildAggregations() {
        const minAggregation = this.minAggregation;
        const aggregations = this.aggregations;
        if (!minAggregation && aggregations && aggregations.size > 0) {
            return aggregations;
        }
        else if (!minAggregation) {
            return undefined;
        }
        return Aggregation.minimumEnumSet(minAggregation, MIN_AGGREGATION_CACHE);
    }
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
    withMinLocationPrecision(minLocationPrecision) {
        this.minLocationPrecision =
            minLocationPrecision instanceof LocationPrecision
                ? minLocationPrecision
                : LocationPrecision.valueOf(minLocationPrecision);
        return this;
    }
    /**
     * Build the effective aggregation level set from the policy settings.
     *
     * This computes a set of location precision levels based on the configured `minLocationPrecision`
     * and `locationPrecisions` values.
     *
     * @returns the precision set
     * @private
     */
    #buildLocationPrecisions() {
        const minLocationPrecision = this.minLocationPrecision;
        const locationPrecisions = this.locationPrecisions;
        if (!minLocationPrecision &&
            locationPrecisions &&
            locationPrecisions.size > 0) {
            return locationPrecisions;
        }
        else if (!minLocationPrecision) {
            return undefined;
        }
        return LocationPrecision.minimumEnumSet(minLocationPrecision, MIN_LOCATION_PRECISION_CACHE);
    }
    /**
     * Create a new {@link SecurityPolicy} out of the properties configured on this builder.
     *
     * @returns {module:domain~SecurityPolicy} the new policy instance
     */
    build() {
        return new SecurityPolicy(this.nodeIds, this.sourceIds, this.#buildAggregations(), this.minAggregation, this.#buildLocationPrecisions(), this.minLocationPrecision, this.nodeMetadataPaths, this.userMetadataPaths);
    }
}
export default SecurityPolicy;
export { SecurityPolicyBuilder };
//# sourceMappingURL=securityPolicy.js.map