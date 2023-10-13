import { Aggregation } from "./aggregation.js";
import { LocationPrecision } from "./locationPrecision.js";
import { nonEmptySet, nonEmptyMergedSets } from "../util/objects.js";

/**
 * An immutable set of security restrictions that can be attached to other objects, like auth tokens.
 *
 * Use the {@link Domain.SecurityPolicyBuilder} to create instances of this class with a fluent API.
 */
class SecurityPolicy {
	readonly #nodeIds?: Set<number>;
	readonly #sourceIds?: Set<string>;
	readonly #aggregations?: Set<Aggregation>;
	readonly #minAggregation?: Aggregation;
	readonly #locationPrecisions?: Set<LocationPrecision>;
	readonly #minLocationPrecision?: LocationPrecision;
	readonly #nodeMetadataPaths?: Set<string>;
	readonly #userMetadataPaths?: Set<string>;

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
	constructor(
		nodeIds?: Set<number> | number[],
		sourceIds?: Set<string> | string[],
		aggregations?: Set<Aggregation> | Aggregation[],
		minAggregation?: Aggregation,
		locationPrecisions?: Set<LocationPrecision> | LocationPrecision[],
		minLocationPrecision?: LocationPrecision,
		nodeMetadataPaths?: Set<string> | string[],
		userMetadataPaths?: Set<string> | string[]
	) {
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
	get nodeIds(): Set<number> | undefined {
		return this.#nodeIds;
	}

	/**
	 * Get the source IDs.
	 *
	 * @returns the source IDs, or `undefined`
	 */
	get sourceIds(): Set<string> | undefined {
		return this.#sourceIds;
	}

	/**
	 * Get the aggregations.
	 *
	 * @returns the aggregations, or `undefined`
	 */
	get aggregations(): Set<Aggregation> | undefined {
		return this.#aggregations;
	}

	/**
	 * Get the location precisions.
	 *
	 * @returns the precisions, or `undefined`
	 */
	get locationPrecisions(): Set<LocationPrecision> | undefined {
		return this.#locationPrecisions;
	}

	/**
	 * Get the minimum aggregation.
	 *
	 * @returns the minimum aggregation, or `undefined`
	 */
	get minAggregation(): Aggregation | undefined {
		return this.#minAggregation;
	}

	/**
	 * Get the minimum location precision.
	 *
	 * @returns the minimum precision, or `undefined`
	 */
	get minLocationPrecision(): LocationPrecision | undefined {
		return this.#minLocationPrecision;
	}

	/**
	 * Get the node metadata paths.
	 *
	 * @returns the node metadata paths, or `undefined`
	 */
	get nodeMetadataPaths(): Set<string> | undefined {
		return this.#nodeMetadataPaths;
	}

	/**
	 * Get the user metadata paths.
	 *
	 * @returns the user metadata paths, or `undefined`
	 */
	get userMetadataPaths(): Set<string> | undefined {
		return this.#userMetadataPaths;
	}

	/**
	 * Get this object as a standard JSON encoded string value.
	 *
	 * @return the JSON encoded string
	 */
	toJsonEncoding(): string {
		const result: Record<string, any> = {};

		if (this.#nodeIds) {
			result.nodeIds = Array.from(this.#nodeIds);
		}

		if (this.#sourceIds) {
			result.sourceIds = Array.from(this.#sourceIds);
		}

		if (this.#aggregations) {
			result.aggregations = Array.from(this.#aggregations).map(
				(e) => e.name
			);
		}

		if (this.#locationPrecisions) {
			result.locationPrecisions = Array.from(
				this.#locationPrecisions
			).map((e) => e.name);
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

		return JSON.stringify(result);
	}
}

const MIN_AGGREGATION_CACHE = new Map<string, Set<Aggregation>>();
const MIN_LOCATION_PRECISION_CACHE = new Map<string, Set<LocationPrecision>>();

/**
 * A mutable builder object for {@link Domain.SecurityPolicy} instances.
 */
class SecurityPolicyBuilder {
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
	withPolicy(policy?: SecurityPolicy): this {
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
	addPolicy(policy?: SecurityPolicy): this {
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
	withNodeIds(nodeIds?: Set<number> | number[] | number): this {
		this.nodeIds = nonEmptySet(nodeIds);
		return this;
	}

	/**
	 * Add a set of node IDs.
	 *
	 * @param nodeIds - the node IDs to add
	 * @returns this object
	 */
	addNodeIds(nodeIds?: Set<number> | number[] | number): this {
		return this.withNodeIds(nonEmptyMergedSets(this.nodeIds, nodeIds));
	}

	/**
	 * Set the node metadata paths.
	 *
	 * @param nodeMetadataPaths - the path expressions to use
	 * @returns this object
	 */
	withNodeMetadataPaths(
		nodeMetadataPaths?: Set<string> | string[] | string
	): this {
		this.nodeMetadataPaths = nonEmptySet(nodeMetadataPaths);
		return this;
	}

	/**
	 * Add a set of node metadata paths.
	 *
	 * @param nodeMetadataPaths - the path expressions to add
	 * @returns this object
	 */
	addNodeMetadataPaths(
		nodeMetadataPaths?: Set<string> | string[] | string
	): this {
		return this.withNodeMetadataPaths(
			nonEmptyMergedSets(this.nodeMetadataPaths, nodeMetadataPaths)
		);
	}

	/**
	 * Set the user metadata paths.
	 *
	 * @param userMetadataPaths - the path expressions to use
	 * @returns this object
	 */
	withUserMetadataPaths(
		userMetadataPaths?: Set<string> | string[] | string
	): this {
		this.userMetadataPaths = nonEmptySet(userMetadataPaths);
		return this;
	}

	/**
	 * Add a set of user metadata paths.
	 *
	 * @param userMetadataPaths - the path expressions to add
	 * @returns this object
	 */
	addUserMetadataPaths(
		userMetadataPaths?: Set<string> | string[] | string
	): this {
		return this.withUserMetadataPaths(
			nonEmptyMergedSets(this.userMetadataPaths, userMetadataPaths)
		);
	}

	/**
	 * Set the source IDs.
	 *
	 * @param sourceIds - the source IDs to use
	 * @returns this object
	 */
	withSourceIds(sourceIds?: Set<string> | string[] | string): this {
		this.sourceIds = nonEmptySet(sourceIds);
		return this;
	}

	/**
	 * Add source IDs.
	 *
	 * @param sourceIds - the source IDs to add
	 * @returns this object
	 */
	addSourceIds(sourceIds?: Set<string> | string[] | string): this {
		return this.withSourceIds(
			nonEmptyMergedSets(this.sourceIds, sourceIds)
		);
	}

	/**
	 * Set the aggregations.
	 *
	 * @param aggregations - the aggregations to use
	 * @returns this object
	 */
	withAggregations(
		aggregations?: Set<Aggregation> | Aggregation[] | Aggregation
	): this {
		this.aggregations = nonEmptySet(aggregations);
		return this;
	}

	/**
	 * Set the aggregations.
	 *
	 * @param aggregations - the aggregations to add
	 * @returns this object
	 */
	addAggregations(
		aggregations?: Set<Aggregation> | Aggregation[] | Aggregation
	): this {
		return this.withAggregations(
			nonEmptyMergedSets(this.aggregations, aggregations)
		);
	}

	/**
	 * Set the location precisions.
	 *
	 * @param locationPrecisions - the precisions to use
	 * @returns this object
	 */
	withLocationPrecisions(
		locationPrecisions?:
			| Set<LocationPrecision>
			| LocationPrecision[]
			| LocationPrecision
	): this {
		this.locationPrecisions = nonEmptySet(locationPrecisions);
		return this;
	}

	/**
	 * Add location precisions.
	 *
	 * @param locationPrecisions - the precisions to add
	 * @returns this object
	 */
	addLocationPrecisions(
		locationPrecisions?:
			| Set<LocationPrecision>
			| LocationPrecision[]
			| LocationPrecision
	): this {
		return this.withLocationPrecisions(
			nonEmptyMergedSets(this.locationPrecisions, locationPrecisions)
		);
	}

	/**
	 * Set a minimum aggregation level.
	 *
	 * @param minAggregation - the minimum aggregation level to set
	 * @returns this object
	 */
	withMinAggregation(minAggregation?: Aggregation): this {
		this.minAggregation = minAggregation;
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
	#buildAggregations(): Set<Aggregation> | undefined {
		const minAggregation = this.minAggregation;
		const aggregations = this.aggregations;
		if (!minAggregation && aggregations && aggregations.size > 0) {
			return aggregations;
		} else if (!minAggregation) {
			return undefined;
		}
		return Aggregation.minimumEnumSet(
			minAggregation,
			MIN_AGGREGATION_CACHE
		);
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
	withMinLocationPrecision(minLocationPrecision?: LocationPrecision): this {
		this.minLocationPrecision = minLocationPrecision;
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
	#buildLocationPrecisions(): Set<LocationPrecision> | undefined {
		const minLocationPrecision = this.minLocationPrecision;
		const locationPrecisions = this.locationPrecisions;
		if (
			!minLocationPrecision &&
			locationPrecisions &&
			locationPrecisions.size > 0
		) {
			return locationPrecisions;
		} else if (!minLocationPrecision) {
			return undefined;
		}
		return LocationPrecision.minimumEnumSet(
			minLocationPrecision,
			MIN_LOCATION_PRECISION_CACHE
		);
	}

	/**
	 * Create a new {@link SecurityPolicy} out of the properties configured on this builder.
	 *
	 * @returns {module:domain~SecurityPolicy} the new policy instance
	 */
	build() {
		return new SecurityPolicy(
			this.nodeIds,
			this.sourceIds,
			this.#buildAggregations(),
			this.minAggregation,
			this.#buildLocationPrecisions(),
			this.minLocationPrecision,
			this.nodeMetadataPaths,
			this.userMetadataPaths
		);
	}
}

export default SecurityPolicy;
export { SecurityPolicyBuilder };
