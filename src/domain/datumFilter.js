import { Aggregation } from "./aggregation.js";
import { CombiningType } from "./combiningType.js";
import Location from "./location.js";
import PropMap from "../util/propMap.js";

import { dateTimeUrlFormat, localDateTimeUrlFormat } from "../format/date.js";

export const AccumulatingPropertyNamesKey = "accumulatingPropertyNames";
export const AggregationKey = "aggregation";
export const CombiningTypeKey = "combiningType";
export const DataPathKey = "dataPath";
export const EndDateKey = "endDate";
export const InstantaneousPropertyNamesKey = "instantaneousPropertyNames";
export const LocalEndDateKey = "localEndDate";
export const LocalStartDateKey = "localStartDate";
export const LocationIdsKey = "locationIds";
export const LocationKey = "location";
export const MetadataFilterKey = "metadataFilter";
export const MostRecentKey = "mostRecent";
export const NodeIdMapsKey = "nodeIdMaps";
export const NodeIdsKey = "nodeIds";
export const PartialAggregationKey = "partialAggregation";
export const PropertyNamesKey = "propertyNames";
export const QueryKey = "query";
export const SourceIdMapsKey = "sourceIdMaps";
export const SourceIdsKey = "sourceIds";
export const StartDateKey = "startDate";
export const StatusPropertyNamesKey = "statusPropertyNames";
export const StreamIdsKey = "streamIds";
export const TagsKey = "tags";
export const UserIdsKey = "userIds";
export const WithoutTotalResultsCountKey = "withoutTotalResultsCount";

/**
 * Combine an ID map into a query parameter.
 * @param {Map<*, Set<*>>} map ID mapping
 * @returns {String[]} the query parameter value, or `null` if no mapping available
 * @private
 */
function idMapQueryParameterValue(map) {
	if (!(map instanceof Map && map.size > 0)) {
		return null;
	}
	var result = [];
	for (let e of map) {
		if (!(e[1] instanceof Set)) {
			continue;
		}
		result.push(`${e[0]}:${Array.from(e[1]).join(",")}`);
	}
	return result;
}

/**
 * A filter criteria object for datum.
 *
 * <p>This filter is used to query both node datum and location datum. Not all properties are
 * applicable to both types. Be sure to consult the SolarNet API documentation on the
 * supported properties for each type.</p>
 *
 * @extends module:util~PropMap
 * @alias module:domain~DatumFilter
 */
class DatumFilter extends PropMap {
	/**
	 * Constructor.
	 * @param {object} [props] initial property values
	 */
	constructor(props) {
		super(props);
	}

	/**
	 * A node ID.
	 *
	 * This manages the first available node ID from the `nodeIds` property.
	 *
	 * @type {number}
	 */
	get nodeId() {
		const nodeIds = this.nodeIds;
		return Array.isArray(nodeIds) && nodeIds.length > 0 ? nodeIds[0] : null;
	}

	set nodeId(nodeId) {
		if (nodeId) {
			this.nodeIds = [nodeId];
		} else {
			this.nodeIds = null;
		}
	}

	/**
	 * An array of node IDs.
	 * @type {number[]}
	 */
	get nodeIds() {
		return this.prop(NodeIdsKey);
	}

	set nodeIds(nodeIds) {
		this.prop(NodeIdsKey, Array.isArray(nodeIds) ? nodeIds : null);
	}

	/**
	 * A location ID.
	 *
	 * This manages the first available location ID from the `locationIds` property.
	 *
	 * @type {number}
	 */
	get locationId() {
		const locationIds = this.locationIds;
		return Array.isArray(locationIds) && locationIds.length > 0 ? locationIds[0] : null;
	}

	set locationId(locationId) {
		if (locationId) {
			this.locationIds = [locationId];
		} else {
			this.locationIds = null;
		}
	}

	/**
	 * An array of location IDs.
	 * @type {number[]}
	 */
	get locationIds() {
		return this.prop(LocationIdsKey);
	}

	set locationIds(locationIds) {
		this.prop(LocationIdsKey, Array.isArray(locationIds) ? locationIds : null);
	}

	/**
	 * A source ID.
	 *
	 * This manages the first available source ID from the `sourceIds` property.
	 *
	 * @type {string}
	 */
	get sourceId() {
		const sourceIds = this.sourceIds;
		return Array.isArray(sourceIds) && sourceIds.length > 0 ? sourceIds[0] : null;
	}

	set sourceId(sourceId) {
		if (sourceId) {
			this.sourceIds = [sourceId];
		} else {
			this.sourceIds = null;
		}
	}

	/**
	 * An array of source IDs.
	 * @type {string[]}
	 */
	get sourceIds() {
		return this.prop(SourceIdsKey);
	}

	set sourceIds(sourceIds) {
		this.prop(SourceIdsKey, Array.isArray(sourceIds) ? sourceIds : null);
	}

	/**
	 * A stream ID.
	 *
	 * This manages the first available stream ID from the `streamIds` property.
	 *
	 * @type {string}
	 */
	get streamId() {
		const streamIds = this.streamIds;
		return Array.isArray(streamIds) && streamIds.length > 0 ? streamIds[0] : null;
	}

	set streamId(streamId) {
		if (streamId) {
			this.streamIds = [streamId];
		} else {
			this.streamIds = null;
		}
	}

	/**
	 * An array of stream IDs.
	 * @type {string[]}
	 */
	get streamIds() {
		return this.prop(StreamIdsKey);
	}

	set streamIds(streamIds) {
		this.prop(StreamIdsKey, Array.isArray(streamIds) ? streamIds : null);
	}

	/**
	 * A user ID.
	 *
	 * This manages the first available location ID from the `userIds` property.
	 *
	 * @type {number}
	 */
	get userId() {
		const userIds = this.userIds;
		return Array.isArray(userIds) && userIds.length > 0 ? userIds[0] : null;
	}

	set userId(userId) {
		if (userId) {
			this.userIds = [userId];
		} else {
			this.userIds = null;
		}
	}

	/**
	 * An array of user IDs.
	 * @type {number[]}
	 */
	get userIds() {
		return this.prop(UserIdsKey);
	}

	set userIds(userIds) {
		this.prop(UserIdsKey, Array.isArray(userIds) ? userIds : null);
	}

	/**
	 * The "most recent" flag.
	 * @type {boolean}
	 */
	get mostRecent() {
		return !!this.prop(MostRecentKey);
	}

	set mostRecent(value) {
		this.prop(MostRecentKey, !!value);
	}

	/**
	 * A minimumin date.
	 * @type {Date}
	 */
	get startDate() {
		return this.prop(StartDateKey);
	}

	set startDate(date) {
		this.prop(StartDateKey, date);
	}

	/**
	 * A maximum date.
	 * @type {Date}
	 */
	get endDate() {
		return this.prop(EndDateKey);
	}

	set endDate(date) {
		this.prop(EndDateKey, date);
	}

	/**
	 * Alocal minimumin date.
	 * @type {Date}
	 */
	get localStartDate() {
		return this.prop(LocalStartDateKey);
	}

	set localStartDate(date) {
		this.prop(LocalStartDateKey, date);
	}

	/**
	 * A local maximum date.
	 * @type {Date}
	 */
	get localEndDate() {
		return this.prop(LocalEndDateKey);
	}

	set localEndDate(date) {
		this.prop(LocalEndDateKey, date);
	}

	/**
	 * A data path, in dot-delimited notation like `i.watts`.
	 * @type {string}
	 */
	get dataPath() {
		return this.prop(DataPathKey);
	}

	set dataPath(path) {
		this.prop(DataPathKey, path);
	}

	/**
	 * An aggregation.
	 *
	 * Including this in a filter will cause SolarNet to return aggregated results, rather
	 * than raw results.
	 *
	 * @type {module:domain~Aggregation}
	 */
	get aggregation() {
		return this.prop(AggregationKey);
	}

	set aggregation(agg) {
		this.prop(AggregationKey, agg instanceof Aggregation ? agg : null);
	}

	/**
	 * A partial aggregation.
	 *
	 * Including this in a filter along with `aggregation`  will cause SolarNet to return aggregated results that
	 * include partial results of this granularity. For example if `aggregation == 'Month'` and
	 * `partialAggregation == 'Day'` and a date range of 15 Jan - 15 Mar was requested, 3 month results would
	 * be returned for the date ranges 15 Jan - 31 Jan, 1 Feb - 28 Feb, and 1 Mar - 14 Mar.
	 *
	 * @type {module:domain~Aggregation}
	 */
	get partialAggregation() {
		return this.prop(PartialAggregationKey);
	}

	set partialAggregation(agg) {
		this.prop(PartialAggregationKey, agg instanceof Aggregation ? agg : null);
	}

	/**
	 * An array of tags.
	 * @type {string[]}
	 */
	get tags() {
		return this.prop(TagsKey);
	}

	set tags(val) {
		this.prop(TagsKey, Array.isArray(val) ? val : null);
	}

	/**
	 * A location, used as an example-based search criteria.
	 * @type {module:domain~Location}
	 */
	get location() {
		return this.prop(LocationKey);
	}

	set location(val) {
		this.prop(LocationKey, val instanceof Location ? val : null);
	}

	/**
	 * A general full-text style query string.
	 * @type {string}
	 */
	get query() {
		return this.prop(QueryKey);
	}

	set query(val) {
		this.prop(QueryKey, val);
	}

	/**
	 * A metadata filter (LDAP style search criteria).
	 * @type {string}
	 */
	get metadataFilter() {
		return this.prop(MetadataFilterKey);
	}

	set metadataFilter(val) {
		this.prop(MetadataFilterKey, val);
	}

	/**
	 * Get the _without total results_ flag.
	 * @type {boolean}
	 */
	get withoutTotalResultsCount() {
		return this.prop(WithoutTotalResultsCountKey);
	}

	set withoutTotalResultsCount(val) {
		this.prop(WithoutTotalResultsCountKey, !!val);
	}

	/**
	 * Get the combining type.
	 *
	 * Use this to combine nodes and/or sources into virtual groups. Requires some combination
	 * of {@link #nodeIdMaps} or {@link #sourceIdMaps} also be specified.
	 *
	 * @type {module:domain~CombiningType}
	 */
	get combiningType() {
		return this.prop(CombiningTypeKey);
	}

	set combiningType(t) {
		this.prop(CombiningTypeKey, t instanceof CombiningType ? t : null);
	}

	/**
	 * A mapping of virtual node IDs to sets of real node IDs to combine.
	 *
	 * @type {Map<Number, Set<Number>>}
	 */
	get nodeIdMaps() {
		return this.prop(NodeIdMapsKey);
	}

	set nodeIdMaps(map) {
		this.prop(NodeIdMapsKey, map instanceof Map ? map : null);
	}

	/**
	 * A mapping of virtual source IDs to sets of real source IDs to combine.
	 *
	 * @type {Map<String, Set<String>>}
	 */
	get sourceIdMaps() {
		return this.prop(SourceIdMapsKey);
	}

	set sourceIdMaps(map) {
		this.prop(SourceIdMapsKey, map instanceof Map ? map : null);
	}

	/**
	 * A property name.
	 *
	 * This manages the first available value from the `propertyNames` property.
	 *
	 * @type {string}
	 */
	get propertyName() {
		const names = this.propertyNames;
		return Array.isArray(names) && names.length > 0 ? names[0] : null;
	}

	set propertyName(name) {
		if (name) {
			this.propertyNames = [name];
		} else {
			this.propertyNames = null;
		}
	}

	/**
	 * An array of property names.
	 * @type {string[]}
	 */
	get propertyNames() {
		return this.prop(PropertyNamesKey);
	}

	set propertyNames(names) {
		this.prop(PropertyNamesKey, Array.isArray(names) ? names : null);
	}

	/**
	 * An instantaneous property name.
	 *
	 * This manages the first available value from the `instantaneousPropertyNames` property.
	 *
	 * @type {string}
	 */
	get instantaneousPropertyName() {
		const names = this.instantaneousPropertyNames;
		return Array.isArray(names) && names.length > 0 ? names[0] : null;
	}

	set instantaneousPropertyName(name) {
		if (name) {
			this.instantaneousPropertyNames = [name];
		} else {
			this.instantaneousPropertyNames = null;
		}
	}

	/**
	 * An array of instantaneous property names.
	 * @type {string[]}
	 */
	get instantaneousPropertyNames() {
		return this.prop(InstantaneousPropertyNamesKey);
	}

	set instantaneousPropertyNames(names) {
		this.prop(InstantaneousPropertyNamesKey, Array.isArray(names) ? names : null);
	}

	/**
	 * An accumulating property name.
	 *
	 * This manages the first available value from the `accumulatingPropertyNames` property.
	 *
	 * @type {string}
	 */
	get accumulatingPropertyName() {
		const names = this.accumulatingPropertyNames;
		return Array.isArray(names) && names.length > 0 ? names[0] : null;
	}

	set accumulatingPropertyName(name) {
		if (name) {
			this.accumulatingPropertyNames = [name];
		} else {
			this.accumulatingPropertyNames = null;
		}
	}

	/**
	 * An array of accumulating property names.
	 * @type {string[]}
	 */
	get accumulatingPropertyNames() {
		return this.prop(AccumulatingPropertyNamesKey);
	}

	set accumulatingPropertyNames(names) {
		this.prop(AccumulatingPropertyNamesKey, Array.isArray(names) ? names : null);
	}

	/**
	 * A property name.
	 *
	 * This manages the first available value from the `statusPropertyNames` property.
	 *
	 * @type {string}
	 */
	get statusPropertyName() {
		const names = this.statusPropertyNames;
		return Array.isArray(names) && names.length > 0 ? names[0] : null;
	}

	set statusPropertyName(name) {
		if (name) {
			this.statusPropertyNames = [name];
		} else {
			this.statusPropertyNames = null;
		}
	}

	/**
	 * An array of property names.
	 * @type {string[]}
	 */
	get statusPropertyNames() {
		return this.prop(StatusPropertyNamesKey);
	}

	set statusPropertyNames(names) {
		this.prop(StatusPropertyNamesKey, Array.isArray(names) ? names : null);
	}

	/**
	 * Get this object as a standard URI encoded (query parameters) string value.
	 *
	 * @override
	 * @inheritdoc
	 */
	toUriEncoding(propertyName, callbackFn) {
		return super.toUriEncoding(
			propertyName,
			callbackFn || datumFilterUriEncodingPropertyMapper,
		);
	}
}

/**
 * Map DatumFilter properties for URI encoding.
 *
 * @param {string} key the property key
 * @param {*} value the property value
 * @returns {*} 2 or 3-element array for mapped key+value+forced-multi-key, `null` to skip, or `key` to keep as-is
 * @private
 */
function datumFilterUriEncodingPropertyMapper(key, value) {
	if (
		key === NodeIdsKey ||
		key === LocationIdsKey ||
		key === SourceIdsKey ||
		key === UserIdsKey ||
		key === PropertyNamesKey ||
		key === InstantaneousPropertyNamesKey ||
		key === AccumulatingPropertyNamesKey ||
		key === StatusPropertyNamesKey
	) {
		// check for singleton array value, and re-map to singular property by chopping of "s"
		if (Array.isArray(value) && value.length === 1) {
			return [key.substring(0, key.length - 1), value[0]];
		}
	} else if (key === StartDateKey || key === EndDateKey) {
		return [key, dateTimeUrlFormat(value)];
	} else if (key === LocalStartDateKey || key === LocalEndDateKey) {
		return [key, localDateTimeUrlFormat(value)];
	} else if (key === MostRecentKey && !value) {
		return null;
	} else if (key === NodeIdMapsKey || key === SourceIdMapsKey) {
		let p = idMapQueryParameterValue(value);
		return p ? [key, p, true] : null;
	}
	return key;
}

export default DatumFilter;
