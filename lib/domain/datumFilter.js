import { Aggregation } from "./aggregation.js";
import { CombiningType } from "./combiningType.js";
import Location from "./location.js";
import { DatumRollupType } from "../domain/datumRollupType.js";
import { default as PropMap, } from "../util/propMap.js";
import { dateUrlFormat, localDateUrlFormat } from "../util/dates.js";
/** An enumeration of datum filter keys. */
var DatumFilterKeys;
(function (DatumFilterKeys) {
    DatumFilterKeys["AccumulatingPropertyName"] = "accumulatingPropertyName";
    DatumFilterKeys["AccumulatingPropertyNames"] = "accumulatingPropertyNames";
    DatumFilterKeys["Aggregation"] = "aggregation";
    DatumFilterKeys["CombiningType"] = "combiningType";
    DatumFilterKeys["DataPath"] = "dataPath";
    DatumFilterKeys["EndDate"] = "endDate";
    DatumFilterKeys["InstantaneousPropertyName"] = "instantaneousPropertyName";
    DatumFilterKeys["InstantaneousPropertyNames"] = "instantaneousPropertyNames";
    DatumFilterKeys["LocalEndDate"] = "localEndDate";
    DatumFilterKeys["LocalStartDate"] = "localStartDate";
    DatumFilterKeys["LocationId"] = "locationId";
    DatumFilterKeys["LocationIds"] = "locationIds";
    DatumFilterKeys["Location"] = "location";
    DatumFilterKeys["MetadataFilter"] = "metadataFilter";
    DatumFilterKeys["MostRecent"] = "mostRecent";
    DatumFilterKeys["NodeIdMaps"] = "nodeIdMaps";
    DatumFilterKeys["NodeId"] = "nodeId";
    DatumFilterKeys["NodeIds"] = "nodeIds";
    DatumFilterKeys["PartialAggregation"] = "partialAggregation";
    DatumFilterKeys["PropertyName"] = "propertyName";
    DatumFilterKeys["PropertyNames"] = "propertyNames";
    DatumFilterKeys["Query"] = "query";
    DatumFilterKeys["RollupType"] = "rollupType";
    DatumFilterKeys["RollupTypes"] = "rollupTypes";
    DatumFilterKeys["SourceIdMaps"] = "sourceIdMaps";
    DatumFilterKeys["SourceId"] = "sourceId";
    DatumFilterKeys["SourceIds"] = "sourceIds";
    DatumFilterKeys["StartDate"] = "startDate";
    DatumFilterKeys["StatusPropertyName"] = "statusPropertyName";
    DatumFilterKeys["StatusPropertyNames"] = "statusPropertyNames";
    DatumFilterKeys["StreamIds"] = "streamIds";
    DatumFilterKeys["Tags"] = "tags";
    DatumFilterKeys["UserId"] = "userId";
    DatumFilterKeys["UserIds"] = "userIds";
    DatumFilterKeys["WithoutTotalResultsCount"] = "withoutTotalResultsCount";
})(DatumFilterKeys || (DatumFilterKeys = {}));
/** Sorted list of all datum filter key values. */
const DatumFilterPropertyNames = Object.values(DatumFilterKeys).sort();
/** A set of datum filter key values. */
const DatumFilterPropertyNamesSet = new Set(DatumFilterPropertyNames);
/**
 * Combine an ID map into a query parameter.
 * @param map - ID mapping
 * @returns the query parameter value, or `undefined` if no mapping available
 * @private
 */
function idMapQueryParameterValue(map) {
    if (!(map instanceof Map && map.size > 0)) {
        return undefined;
    }
    const result = [];
    for (const e of map) {
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
 * This filter is used to query both node datum and location datum. Not all properties are
 * applicable to both types. Be sure to consult the SolarNet API documentation on the
 * supported properties for each type.
 */
class DatumFilter extends PropMap {
    /**
     * Constructor.
     * @param props - initial property values
     */
    constructor(props) {
        super(props);
        this.#cleanupSingularProperties();
    }
    #cleanupSingularProperties() {
        if (this.size < 1) {
            return;
        }
    }
    /**
     * A node ID.
     *
     * This manages the first available node ID from the `nodeIds` property.
     * Set to `null` to remove.
     */
    get nodeId() {
        const nodeIds = this.nodeIds;
        return Array.isArray(nodeIds) && nodeIds.length > 0
            ? nodeIds[0]
            : undefined;
    }
    set nodeId(nodeId) {
        if (typeof nodeId === "number") {
            this.nodeIds = [nodeId];
        }
        else {
            this.nodeIds = null;
        }
    }
    /**
     * An array of node IDs. Set to `null` to remove.
     */
    get nodeIds() {
        return this.prop(DatumFilterKeys.NodeIds);
    }
    set nodeIds(nodeIds) {
        this.prop(DatumFilterKeys.NodeIds, Array.isArray(nodeIds) ? nodeIds : null);
    }
    /**
     * A location ID.
     *
     * This manages the first available location ID from the `locationIds` property.
     * Set to `null` to remove.
     */
    get locationId() {
        const locationIds = this.locationIds;
        return Array.isArray(locationIds) && locationIds.length > 0
            ? locationIds[0]
            : undefined;
    }
    set locationId(locationId) {
        if (typeof locationId === "number") {
            this.locationIds = [locationId];
        }
        else {
            this.locationIds = null;
        }
    }
    /**
     * An array of location IDs. Set to `null` to remove.
     */
    get locationIds() {
        return this.prop(DatumFilterKeys.LocationIds);
    }
    set locationIds(locationIds) {
        this.prop(DatumFilterKeys.LocationIds, Array.isArray(locationIds) ? locationIds : null);
    }
    /**
     * A source ID.
     *
     * This manages the first available source ID from the `sourceIds` property.
     * Set to `null` to remove.
     */
    get sourceId() {
        const sourceIds = this.sourceIds;
        return Array.isArray(sourceIds) && sourceIds.length > 0
            ? sourceIds[0]
            : undefined;
    }
    set sourceId(sourceId) {
        if (sourceId) {
            this.sourceIds = [sourceId];
        }
        else {
            this.sourceIds = null;
        }
    }
    /**
     * An array of source IDs. Set to `null` to remove.
     */
    get sourceIds() {
        return this.prop(DatumFilterKeys.SourceIds);
    }
    set sourceIds(sourceIds) {
        this.prop(DatumFilterKeys.SourceIds, Array.isArray(sourceIds) ? sourceIds : null);
    }
    /**
     * A stream ID.
     *
     * This manages the first available stream ID from the `streamIds` property.
     * Set to `null` to remove.
     */
    get streamId() {
        const streamIds = this.streamIds;
        return Array.isArray(streamIds) && streamIds.length > 0
            ? streamIds[0]
            : undefined;
    }
    set streamId(streamId) {
        if (streamId) {
            this.streamIds = [streamId];
        }
        else {
            this.streamIds = null;
        }
    }
    /**
     * An array of stream IDs. Set to `null` to remove.
     */
    get streamIds() {
        return this.prop(DatumFilterKeys.StreamIds);
    }
    set streamIds(streamIds) {
        this.prop(DatumFilterKeys.StreamIds, Array.isArray(streamIds) ? streamIds : null);
    }
    /**
     * A user ID.
     *
     * This manages the first available location ID from the `userIds` property.
     * Set to `null` to remove.
     */
    get userId() {
        const userIds = this.userIds;
        return Array.isArray(userIds) && userIds.length > 0
            ? userIds[0]
            : undefined;
    }
    set userId(userId) {
        if (userId) {
            this.userIds = [userId];
        }
        else {
            this.userIds = null;
        }
    }
    /**
     * An array of user IDs. Set to `null` to remove.
     */
    get userIds() {
        return this.prop(DatumFilterKeys.UserIds);
    }
    set userIds(userIds) {
        this.prop(DatumFilterKeys.UserIds, Array.isArray(userIds) ? userIds : null);
    }
    /**
     * The "most recent" flag. Set to `null` to remove.
     */
    get mostRecent() {
        return !!this.prop(DatumFilterKeys.MostRecent);
    }
    set mostRecent(value) {
        this.prop(DatumFilterKeys.MostRecent, !!value);
    }
    /**
     * A minimumin date. Set to `null` to remove.
     */
    get startDate() {
        return this.prop(DatumFilterKeys.StartDate);
    }
    set startDate(date) {
        this.prop(DatumFilterKeys.StartDate, date && !isNaN(date.getTime()) ? date : null);
    }
    /**
     * A maximum date. Set to `null` to remove.
     */
    get endDate() {
        return this.prop(DatumFilterKeys.EndDate);
    }
    set endDate(date) {
        this.prop(DatumFilterKeys.EndDate, date && !isNaN(date.getTime()) ? date : null);
    }
    /**
     * Alocal minimumin date. Set to `null` to remove.
     */
    get localStartDate() {
        return this.prop(DatumFilterKeys.LocalStartDate);
    }
    set localStartDate(date) {
        this.prop(DatumFilterKeys.LocalStartDate, date && !isNaN(date.getTime()) ? date : null);
    }
    /**
     * A local maximum date. Set to `null` to remove.
     */
    get localEndDate() {
        return this.prop(DatumFilterKeys.LocalEndDate);
    }
    set localEndDate(date) {
        this.prop(DatumFilterKeys.LocalEndDate, date && !isNaN(date.getTime()) ? date : null);
    }
    /**
     * A data path, in dot-delimited notation like `i.watts`.
     * Set to `null` to remove.
     */
    get dataPath() {
        return this.prop(DatumFilterKeys.DataPath);
    }
    set dataPath(path) {
        this.prop(DatumFilterKeys.DataPath, path);
    }
    /**
     * An aggregation.
     *
     * Including this in a filter will cause SolarNet to return aggregated results, rather
     * than raw results. Set to `null` to remove.
     */
    get aggregation() {
        return this.prop(DatumFilterKeys.Aggregation);
    }
    set aggregation(agg) {
        this.prop(DatumFilterKeys.Aggregation, agg instanceof Aggregation ? agg : null);
    }
    /**
     * A partial aggregation.
     *
     * Including this in a filter along with `aggregation`  will cause SolarNet to return aggregated results that
     * include partial results of this granularity. For example if `aggregation == 'Month'` and
     * `partialAggregation == 'Day'` and a date range of 15 Jan - 15 Mar was requested, 3 month results would
     * be returned for the date ranges 15 Jan - 31 Jan, 1 Feb - 28 Feb, and 1 Mar - 14 Mar.
     *
     * Set to `null` to remove.
     */
    get partialAggregation() {
        return this.prop(DatumFilterKeys.PartialAggregation);
    }
    set partialAggregation(agg) {
        this.prop(DatumFilterKeys.PartialAggregation, agg instanceof Aggregation ? agg : null);
    }
    /**
     * An array of tags. Set to `null` to remove.
     */
    get tags() {
        return this.prop(DatumFilterKeys.Tags);
    }
    set tags(val) {
        this.prop(DatumFilterKeys.Tags, Array.isArray(val) ? val : null);
    }
    /**
     * A location, used as an example-based search criteria. Set to `null` to remove.
     */
    get location() {
        return this.prop(DatumFilterKeys.Location);
    }
    set location(val) {
        this.prop(DatumFilterKeys.Location, val instanceof Location ? val : null);
    }
    /**
     * A general full-text style query string. Set to `null` to remove.
     */
    get query() {
        return this.prop(DatumFilterKeys.Query);
    }
    set query(val) {
        this.prop(DatumFilterKeys.Query, val);
    }
    /**
     * A metadata filter (LDAP style search criteria). Set to `null` to remove.
     */
    get metadataFilter() {
        return this.prop(DatumFilterKeys.MetadataFilter);
    }
    set metadataFilter(val) {
        this.prop(DatumFilterKeys.MetadataFilter, val);
    }
    /**
     * Get the _without total results_ flag. Set to `null` to remove.
     */
    get withoutTotalResultsCount() {
        return this.prop(DatumFilterKeys.WithoutTotalResultsCount);
    }
    set withoutTotalResultsCount(val) {
        this.prop(DatumFilterKeys.WithoutTotalResultsCount, val !== null ? !!val : null);
    }
    /**
     * Get the combining type.
     *
     * Use this to combine nodes and/or sources into virtual groups. Requires some combination
     * of {@link Domain.DatumFilter#nodeIdMaps} or {@link Domain.DatumFilter#sourceIdMaps} also be specified.
     * Set to `null` to remove.
     */
    get combiningType() {
        return this.prop(DatumFilterKeys.CombiningType);
    }
    set combiningType(type) {
        this.prop(DatumFilterKeys.CombiningType, type instanceof CombiningType ? type : null);
    }
    /**
     * A mapping of virtual node IDs to sets of real node IDs to combine. Set to `null` to remove.
     */
    get nodeIdMaps() {
        return this.prop(DatumFilterKeys.NodeIdMaps);
    }
    set nodeIdMaps(map) {
        this.prop(DatumFilterKeys.NodeIdMaps, map instanceof Map ? map : null);
    }
    /**
     * A mapping of virtual source IDs to sets of real source IDs to combine. Set to `null` to remove.
     */
    get sourceIdMaps() {
        return this.prop(DatumFilterKeys.SourceIdMaps);
    }
    set sourceIdMaps(map) {
        this.prop(DatumFilterKeys.SourceIdMaps, map instanceof Map ? map : null);
    }
    /**
     * Get the rollup type.
     *
     * Use this with reading queries on aggregate values to rollup the results.
     * Set to `null` to remove.
     */
    get rollupType() {
        const rollups = this.rollupTypes;
        return Array.isArray(rollups) && rollups.length > 0
            ? rollups[0]
            : undefined;
    }
    set rollupType(rollup) {
        if (rollup instanceof DatumRollupType) {
            this.rollupTypes = [rollup];
        }
        else {
            this.rollupTypes = null;
        }
    }
    /**
     * An array of rollup types. Set to `null` to remove.
     */
    get rollupTypes() {
        return this.prop(DatumFilterKeys.RollupTypes);
    }
    set rollupTypes(rollups) {
        this.prop(DatumFilterKeys.RollupTypes, Array.isArray(rollups) ? rollups : null);
    }
    /**
     * A property name.
     *
     * This manages the first available value from the `propertyNames` property.
     * Set to `null` to remove.
     */
    get propertyName() {
        const names = this.propertyNames;
        return Array.isArray(names) && names.length > 0 ? names[0] : undefined;
    }
    set propertyName(name) {
        if (name) {
            this.propertyNames = [name];
        }
        else {
            this.propertyNames = null;
        }
    }
    /**
     * An array of property names. Set to `null` to remove.
     */
    get propertyNames() {
        return this.prop(DatumFilterKeys.PropertyNames);
    }
    set propertyNames(names) {
        this.prop(DatumFilterKeys.PropertyNames, Array.isArray(names) ? names : null);
    }
    /**
     * An instantaneous property name.
     *
     * This manages the first available value from the `instantaneousPropertyNames` property.
     * Set to `null` to remove.
     */
    get instantaneousPropertyName() {
        const names = this.instantaneousPropertyNames;
        return Array.isArray(names) && names.length > 0 ? names[0] : undefined;
    }
    set instantaneousPropertyName(name) {
        if (name) {
            this.instantaneousPropertyNames = [name];
        }
        else {
            this.instantaneousPropertyNames = null;
        }
    }
    /**
     * An array of instantaneous property names. Set to `null` to remove.
     */
    get instantaneousPropertyNames() {
        return this.prop(DatumFilterKeys.InstantaneousPropertyNames);
    }
    set instantaneousPropertyNames(names) {
        this.prop(DatumFilterKeys.InstantaneousPropertyNames, Array.isArray(names) ? names : null);
    }
    /**
     * An accumulating property name.
     *
     * This manages the first available value from the `accumulatingPropertyNames` property.
     * Set to `null` to remove.
     */
    get accumulatingPropertyName() {
        const names = this.accumulatingPropertyNames;
        return Array.isArray(names) && names.length > 0 ? names[0] : undefined;
    }
    set accumulatingPropertyName(name) {
        if (name) {
            this.accumulatingPropertyNames = [name];
        }
        else {
            this.accumulatingPropertyNames = null;
        }
    }
    /**
     * An array of accumulating property names. Set to `null` to remove.
     */
    get accumulatingPropertyNames() {
        return this.prop(DatumFilterKeys.AccumulatingPropertyNames);
    }
    set accumulatingPropertyNames(names) {
        this.prop(DatumFilterKeys.AccumulatingPropertyNames, Array.isArray(names) ? names : null);
    }
    /**
     * A property name.
     *
     * This manages the first available value from the `statusPropertyNames` property.
     * Set to `null` to remove.
     */
    get statusPropertyName() {
        const names = this.statusPropertyNames;
        return Array.isArray(names) && names.length > 0 ? names[0] : undefined;
    }
    set statusPropertyName(name) {
        if (name) {
            this.statusPropertyNames = [name];
        }
        else {
            this.statusPropertyNames = null;
        }
    }
    /**
     * An array of property names. Set to `null` to remove.
     */
    get statusPropertyNames() {
        return this.prop(DatumFilterKeys.StatusPropertyNames);
    }
    set statusPropertyNames(names) {
        this.prop(DatumFilterKeys.StatusPropertyNames, Array.isArray(names) ? names : null);
    }
    /**
     * @override
     * @inheritdoc
     */
    toUriEncoding(propertyName, callbackFn) {
        return super.toUriEncoding(propertyName, callbackFn || datumFilterUriEncodingPropertyMapper);
    }
}
/**
 * Map DatumFilter properties for URI encoding.
 *
 * @param key - the property key
 * @param value - the property value
 * @returns 2 or 3-element array for mapped key+value+forced-multi-key, `null` to skip, or `key` to keep as-is
 * @private
 */
function datumFilterUriEncodingPropertyMapper(key, value) {
    if (key === DatumFilterKeys.NodeIds ||
        key === DatumFilterKeys.LocationIds ||
        key === DatumFilterKeys.RollupTypes ||
        key === DatumFilterKeys.SourceIds ||
        key === DatumFilterKeys.UserIds ||
        key === DatumFilterKeys.PropertyNames ||
        key === DatumFilterKeys.InstantaneousPropertyNames ||
        key === DatumFilterKeys.AccumulatingPropertyNames ||
        key === DatumFilterKeys.StatusPropertyNames) {
        // check for singleton array value, and re-map to singular property by chopping of "s"
        if (Array.isArray(value) && value.length === 1) {
            return [key.substring(0, key.length - 1), value[0]];
        }
    }
    else if (key === DatumFilterKeys.StartDate ||
        key === DatumFilterKeys.EndDate) {
        return [key, dateUrlFormat(value)];
    }
    else if (key === DatumFilterKeys.LocalStartDate ||
        key === DatumFilterKeys.LocalEndDate) {
        return [key, localDateUrlFormat(value)];
    }
    else if (key === DatumFilterKeys.MostRecent && !value) {
        return null;
    }
    else if (key === DatumFilterKeys.NodeIdMaps ||
        key === DatumFilterKeys.SourceIdMaps) {
        const p = idMapQueryParameterValue(value);
        return p ? [key, p, true] : null;
    }
    return key;
}
export default DatumFilter;
export { DatumFilterKeys, DatumFilterPropertyNames, DatumFilterPropertyNamesSet, };
//# sourceMappingURL=datumFilter.js.map