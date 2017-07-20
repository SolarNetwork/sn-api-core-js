import { Aggregation } from './aggregation';
import { LocationPrecision } from './locationPrecision';

/**
 * Get a Set from a Set or array or object, returning `null` if the set would be empty.
 * 
 * @param {Object[]|Set<*>} obj the array, Set, or singleton object to get as a Set
 * @returns {Set<*>} the Set, or `null`
 * @private
 */
function setOrNull(obj) {
	let result = null;
	if ( obj instanceof Set ) {
		result = (obj.size > 0 ? obj : null);
	} else if ( Array.isArray(obj) ) {
		result = (obj.length > 0 ? new Set(obj) : null);
	} else if ( obj ) {
		result = new Set([obj]);
	}
	return result;
}

/**
 * Merge two sets.
 * 
 * @param {Object[]|Set<*>} [set1] the first set 
 * @param {Object[]|Set<*>} [set2] the second set 
 * @returns {Set<*>} the merged Set, or `null` if neither arguments are sets or 
 *                   neither argument have any values
 * @private
 */
function mergedSets(set1, set2) {
	let s1 = setOrNull(set1);
	let s2 = setOrNull(set2);
	if ( s1 === null && s2 === null ) {
		return null;
	} else if ( s2 === null ) {
		return s1;
	} else if ( s1 === null ) {
		return s2;
	} else {
		for ( let v of s2.values() ) {
			s1.add(v);
		}
		return s1;
	}
}


/**
 * An immutable set of security restrictions that can be attached to other objects, like auth tokens.
 * 
 * Use the {@link module:domain~SecurityPolicyBuilder} to create instances of this class with a fluent API.
 * @alias module:domain~SecurityPolicy
 */
class SecurityPolicy {

	/**
	 * Constructor.
	 * 
	 * @param {number[]|Set<number>} [nodeIds] the node IDs to restrict to, or `null` for no restriction
	 * @param {string[]|Set<string>} [sourceIds] the source ID to restrict to, or `null` for no restriction
	 * @param {module:domain~Aggregation[]|Set<module:domain~Aggregation>} [aggregations] the aggregation names to restrict to, or `null` for no restriction
	 * @param {module:domain~Aggregation} [minAggregation] if specified, a minimum aggregation level that is allowed
	 * @param {Set<module:domain~LocationPrecision>} [locationPrecisions] the location precision names to restrict to, or `null` for no restriction
	 * @param {module:domain~LocationPrecision} [minLocationPrecision] if specified, a minimum location precision that is allowed
	 * @param {Set<string>} [nodeMetadataPaths] the `SolarNodeMetadata` paths to restrict to, or `null` for no restriction
	 * @param {Set<string>} [userMetadataPaths] the `UserNodeMetadata` paths to restrict to, or `null` for no restriction
	 */
    constructor(nodeIds, sourceIds, aggregations, minAggregation, locationPrecisions,
			minLocationPrecision, nodeMetadataPaths, userMetadataPaths) {
		this._nodeIds = setOrNull(nodeIds);
		this._sourceIds = setOrNull(sourceIds);
		this._aggregations = setOrNull(aggregations);
		this._minAggregation = (minAggregation instanceof Aggregation ? minAggregation : null);
		this._locationPrecisions = setOrNull(locationPrecisions);
		this._minLocationPrecision = (minLocationPrecision instanceof LocationPrecision ? minLocationPrecision : null);
		this._nodeMetadataPaths = setOrNull(nodeMetadataPaths);
        this._userMetadataPaths = setOrNull(userMetadataPaths);
        if ( this.constructor === SecurityPolicy ) {
            Object.freeze(this);
        }
	}

	/**
	 * Get the node IDs.
	 * 
	 * @returns {Set<number>} the node IDs, or `null`
	 */
	get nodeIds() {
		return this._nodeIds;
	}

	/**
	 * Get the source IDs.
	 * 
	 * @returns {Set<string>} the source IDs, or `null`
	 */
	get sourceIds() {
		return this._sourceIds;
	}

	/**
	 * Get the aggregations.
	 * 
	 * @returns {Set<module:domain~Aggregation>} the aggregations, or `null`
	 */
	get aggregations() {
		return this._aggregations;
	}

	/**
	 * Get the location precisions.
	 * 
	 * @returns {Set<module:domain~LocationPrecision>} the precisions, or `null`
	 */
	get locationPrecisions() {
		return this._locationPrecisions;
	}

	/**
	 * Get the minimum aggregation.
	 * 
	 * @returns {module:domain~Aggregation} the minimum aggregation, or `null`
	 */
	get minAggregation() {
		return this._minAggregation;
	}

	/**
	 * Get the minimum location precision.
	 * 
	 * @returns {module:domain~LocationPrecision} the minimum precision, or `null`
	 */
	get minLocationPrecision() {
		return this._minLocationPrecision;
	}

	/**
	 * Get the node metadata paths.
	 * 
	 * @returns {Set<string>} the node metadata paths, or `null`
	 */
	get nodeMetadataPaths() {
		return this._nodeMetadataPaths;
	}

	/**
	 * Get the user metadata paths.
	 * 
	 * @returns {Set<string>} the user metadata paths, or `null`
	 */
	get userMetadataPaths() {
		return this._userMetadataPaths;
	}

    /**
     * Get this object as a standard JSON encoded string value.
     * 
     * @return {string} the JSON encoded string
     */
    toJsonEncoding() {
		let result = {};
		let val = this.nodeIds;
		if ( val ) {
			result.nodeIds = Array.from(val);
		}
		
		val = this.sourceIds;
		if ( val ) {
			result.sourceIds = Array.from(val);
		}

		val = this.aggregations;
		if ( val ) {
			result.aggregations = Array.from(val).map(e => e.name);
		}

		val = this.locationPrecisions;
		if ( val ) {
			result.locationPrecisions = Array.from(val).map(e => e.name);
		}

		val = this.minAggregation;
		if ( val ) {
			if ( result.length > 0 ) {
				result += '&';
			}
			result.minAggregation = val.name;
		}

		val = this.minLocationPrecision;
		if ( val ) {
			result.minLocationPrecision = val.name;
		}

		val = this.nodeMetadataPaths;
		if ( val ) {
			result.nodeMetadataPaths = Array.from(val);
		}

		val = this.userMetadataPaths;
		if ( val ) {
			result.userMetadataPaths = Array.from(val);
		}

		return JSON.stringify(result);
    }
}

const MIN_AGGREGATION_CACHE = new Map(); // Map<string, Set<Aggregation>>
const MIN_LOCATION_PRECISION_CACHE = new Map(); // Map<string, Set<LocationPrecision>>

/**
 * A mutable builder object for {@link module:domain~SecurityPolicy} instances.
 * @alias module:domain~SecurityPolicyBuilder
 */
class SecurityPolicyBuilder {

	/**
	 * Apply all properties from another SecurityPolicy.
	 * 
	 * @param {module:domain~SecurityPolicy} policy the SecurityPolicy to apply
	 * @returns {module:domain~SecurityPolicyBuilder} this object
	 */
	withPolicy(policy) {
		if ( policy ) {
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
	 * @param {module:domain~SecurityPolicy} policy the SecurityPolicy to merge
	 * @returns {module:domain~SecurityPolicyBuilder} this object
	 */
	addPolicy(policy) {
		if ( policy ) {
			this.addAggregations(policy.aggregations)
					.addLocationPrecisions(policy.locationPrecisions)
					.addNodeIds(policy.nodeIds)
					.addSourceIds(policy.sourceIds)
					.addNodeMetadataPaths(policy.nodeMetadataPaths)
					.addUserMetadataPaths(policy.userMetadataPaths);
			if ( policy.minAggregation ) {
				this.withMinAggregation(policy.minAggregation);
			}
			if ( policy.minLocationPrecision ) {
				this.withMinLocationPrecision(policy.minLocationPrecision);
			}
		}
		return this;
	}

	/**
	 * Set the node IDs.
	 * 
	 * @param {number[]|Set<number>} nodeIds the node IDs to use
	 * @returns {module:domain~SecurityPolicyBuilder} this object
	 */
	withNodeIds(nodeIds) {
		this.nodeIds = setOrNull(nodeIds);
		return this;
	}

	/**
	 * Add a set of node IDs.
	 * 
	 * @param {number[]|Set<number>} nodeIds the node IDs to add
	 * @returns {module:domain~SecurityPolicyBuilder} this object
	 */
	addNodeIds(nodeIds) {
		return this.withNodeIds(mergedSets(this.nodeIds, nodeIds));
	}

	/**
	 * Set the node metadata paths.
	 * 
	 * @param {string[]|Set<string>} nodeMetadataPaths the path expressions to use
	 * @returns {module:domain~SecurityPolicyBuilder} this object
	 */
	withNodeMetadataPaths(nodeMetadataPaths) {
		this.nodeMetadataPaths = setOrNull(nodeMetadataPaths);
		return this;
	}

	/**
	 * Add a set of node metadata paths.
	 * 
	 * @param {string[]|Set<string>} nodeMetadataPaths the path expressions to add
	 * @returns {module:domain~SecurityPolicyBuilder} this object
	 */
	addNodeMetadataPaths(nodeMetadataPaths) {
		return this.withNodeMetadataPaths(mergedSets(this.nodeMetadataPaths, nodeMetadataPaths));
	}

	/**
	 * Set the user metadata paths.
	 * 
	 * @param {string[]|Set<string>} userMetadataPaths the path expressions to use
	 * @returns {module:domain~SecurityPolicyBuilder} this object
	 */
	withUserMetadataPaths(userMetadataPaths) {
		this.userMetadataPaths = setOrNull(userMetadataPaths);
		return this;
	}

	/**
	 * Add a set of user metadata paths.
	 * 
	 * @param {string[]|Set<string>} userMetadataPaths the path expressions to add
	 * @returns {module:domain~SecurityPolicyBuilder} this object
	 */
	addUserMetadataPaths(userMetadataPaths) {
		return this.withUserMetadataPaths(mergedSets(this.userMetadataPaths, userMetadataPaths));
	}

	/**
	 * Set the source IDs.
	 * 
	 * @param {string[]|Set<string>} sourceIds the source IDs to use
	 * @returns {module:domain~SecurityPolicyBuilder} this object
	 */
	withSourceIds(sourceIds) {
		this.sourceIds = setOrNull(sourceIds);
		return this;
	}

	/**
	 * Add source IDs.
	 * 
	 * @param {string[]|Set<string>} sourceIds the source IDs to add
	 * @returns {module:domain~SecurityPolicyBuilder} this object
	 */
	addSourceIds(sourceIds) {
		return this.withSourceIds(mergedSets(this.sourceIds, sourceIds));
	}

	/**
	 * Set the aggregations.
	 * 
	 * @param {module:domain~Aggregation[]|Set<module:domain~Aggregation>} aggregations the aggregations to use
	 * @returns {module:domain~SecurityPolicyBuilder} this object
	 */
	withAggregations(aggregations) {
		this.aggregations = setOrNull(aggregations);
		return this;
	}

	/**
	 * Set the aggregations.
	 * 
	 * @param {module:domain~Aggregation[]|Set<module:domain~Aggregation>} aggregations the aggregations to add
	 * @returns {module:domain~SecurityPolicyBuilder} this object
	 */
	addAggregations(aggregations) {
		return this.withAggregations(mergedSets(this.aggregations, aggregations));
	}

	/**
	 * Set the location precisions.
	 * 
	 * @param {module:domain~LocationPrecision[]|Set<module:domain~LocationPrecision>} locationPrecisions the precisions to use
	 * @returns {module:domain~SecurityPolicyBuilder} this object
	 */
	withLocationPrecisions(locationPrecisions) {
		this.locationPrecisions = setOrNull(locationPrecisions);
		return this;
	}

	/**
	 * Add location precisions.
	 * 
	 * @param {module:domain~LocationPrecision[]|Set<module:domain~LocationPrecision>} locationPrecisions the precisions to add
	 * @returns {module:domain~SecurityPolicyBuilder} this object
	 */
	addLocationPrecisions(locationPrecisions) {
		return this.withLocationPrecisions(mergedSets(this.locationPrecisions, locationPrecisions));
	}

	/**
	 * Set a minimum aggregation level.
	 * 
	 * @param {module:domain~Aggregation} minAggregation the minimum aggregation level to set
	 * @returns {module:domain~SecurityPolicyBuilder} this object
	 */
	withMinAggregation(minAggregation) {
		this.minAggregation = minAggregation;
		return this;
	}

	/**
	 * Build the effective aggregation level set from the policy settings.
	 * 
	 * This computes a set of aggregation levels based on the configured `minAggregation`
	 * and `aggregations` values.
	 * 
	 * @returns {Set<module:domain~Aggregation>} the aggregation set
	 * @private
	 */
	buildAggregations() {
		const minAggregation = this.minAggregation;
		const aggregations = this.aggregations;
		if ( !minAggregation && aggregations && aggregations.size > 0 ) {
			return aggregations;
		} else if ( !minAggregation ) {
			return null;
		}
		return Aggregation.minimumEnumSet(minAggregation, MIN_AGGREGATION_CACHE);
	}

	/**
	 * Treat the configured `locationPrecisions` set as a single
	 * minimum value or a list of exact values.
	 * 
	 * By default if `locationPrecisions` is configured with a single
	 * value it will be treated as a <em>minimum</em> value, and any
	 * {@link module:domain~LocationPrecision} with a {@link module:domain~LocationPrecision#precision} equal 
	 * to or higher than that value's level will be included in the generated
	 * {@link module:domain~SecurityPolicy#locationPrecisions} set. Set this to
	 * `null` to disable that behavior and treat
	 * `locationPrecisions` as the exact values to include in the
	 * generated {@link module:domain~SecurityPolicy#locationPrecisions} set.
	 * 
	 * @param {module:domain~LocationPrecision|null} minLocationPrecision
	 *        `null` to treat configured location precision values
	 *        as-is, or else the minimum threshold
	 * @returns {module:domain~SecurityPolicyBuilder} this object
	 */
	withMinLocationPrecision(minLocationPrecision) {
		this.minLocationPrecision = minLocationPrecision;
		return this;
	}

	/**
	 * Build the effective aggregation level set from the policy settings.
	 * 
	 * This computes a set of location precision levels based on the configured `minLocationPrecision`
	 * and `locationPrecisions` values.
	 * 
	 * @returns {Set<module:domain~LocationPrecision>} the precision set
	 * @private
	 */
	buildLocationPrecisions() {
		const minLocationPrecision = this.minLocationPrecision;
		const locationPrecisions = this.locationPrecisions;
		if ( !minLocationPrecision && locationPrecisions && locationPrecisions.size > 0 ) {
			return locationPrecisions;
		} else if ( !minLocationPrecision ) {
			return null;
		}
		return LocationPrecision.minimumEnumSet(minLocationPrecision, MIN_LOCATION_PRECISION_CACHE);
	}

	/**
	 * Create a new {@link SecurityPolicy} out of the properties configured on this builder.
	 * 
	 * @returns {module:domain~SecurityPolicy} the new policy instance
	 */
	build() {
		return new SecurityPolicy(this.nodeIds, this.sourceIds, 
				this.buildAggregations(), this.minAggregation,
				this.buildLocationPrecisions(), this.minLocationPrecision,
				this.nodeMetadataPaths, this.userMetadataPaths);
	}
}

export default SecurityPolicy;
export { SecurityPolicyBuilder };