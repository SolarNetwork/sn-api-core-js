import { Aggregation } from "./aggregation.js";
import { CombiningType } from "./combiningType.js";
import Location from "./location.js";
import { DatumRollupType } from "../domain/datumRollupType.js";
import { default as PropMap, PropMapUriEncodingCallbackFn } from "../util/propMap.js";
/** An enumeration of datum filter keys. */
declare enum DatumFilterKeys {
    AccumulatingPropertyName = "accumulatingPropertyName",
    AccumulatingPropertyNames = "accumulatingPropertyNames",
    Aggregation = "aggregation",
    CombiningType = "combiningType",
    DataPath = "dataPath",
    EndDate = "endDate",
    InstantaneousPropertyName = "instantaneousPropertyName",
    InstantaneousPropertyNames = "instantaneousPropertyNames",
    LocalEndDate = "localEndDate",
    LocalStartDate = "localStartDate",
    LocationId = "locationId",
    LocationIds = "locationIds",
    Location = "location",
    MetadataFilter = "metadataFilter",
    MostRecent = "mostRecent",
    NodeIdMaps = "nodeIdMaps",
    NodeId = "nodeId",
    NodeIds = "nodeIds",
    PartialAggregation = "partialAggregation",
    PropertyName = "propertyName",
    PropertyNames = "propertyNames",
    Query = "query",
    RollupType = "rollupType",
    RollupTypes = "rollupTypes",
    SourceIdMaps = "sourceIdMaps",
    SourceId = "sourceId",
    SourceIds = "sourceIds",
    StartDate = "startDate",
    StatusPropertyName = "statusPropertyName",
    StatusPropertyNames = "statusPropertyNames",
    StreamIds = "streamIds",
    Tags = "tags",
    UserId = "userId",
    UserIds = "userIds",
    WithoutTotalResultsCount = "withoutTotalResultsCount"
}
/** The datum filter keys index signature type.  */
type DatumFilterProperties = {
    [k in DatumFilterKeys]: any;
};
/** Sorted list of all datum filter key values. */
declare const DatumFilterPropertyNames: DatumFilterKeys[];
/** A set of datum filter key values. */
declare const DatumFilterPropertyNamesSet: Set<DatumFilterKeys>;
/**
 * A filter criteria object for datum.
 *
 * This filter is used to query both node datum and location datum. Not all properties are
 * applicable to both types. Be sure to consult the SolarNet API documentation on the
 * supported properties for each type.
 */
declare class DatumFilter extends PropMap implements DatumFilterProperties {
    #private;
    /**
     * Constructor.
     * @param props - initial property values
     */
    constructor(props?: PropMap | Map<string, any> | object);
    /**
     * A node ID.
     *
     * This manages the first available node ID from the `nodeIds` property.
     * Set to `null` to remove.
     */
    get nodeId(): number | undefined;
    set nodeId(nodeId: number | null);
    /**
     * An array of node IDs. Set to `null` to remove.
     */
    get nodeIds(): number[] | undefined;
    set nodeIds(nodeIds: number[] | null);
    /**
     * A location ID.
     *
     * This manages the first available location ID from the `locationIds` property.
     * Set to `null` to remove.
     */
    get locationId(): number | undefined;
    set locationId(locationId: number | null);
    /**
     * An array of location IDs. Set to `null` to remove.
     */
    get locationIds(): number[] | undefined;
    set locationIds(locationIds: number[] | null);
    /**
     * A source ID.
     *
     * This manages the first available source ID from the `sourceIds` property.
     * Set to `null` to remove.
     */
    get sourceId(): string | undefined;
    set sourceId(sourceId: string | null);
    /**
     * An array of source IDs. Set to `null` to remove.
     */
    get sourceIds(): string[] | undefined;
    set sourceIds(sourceIds: string[] | null);
    /**
     * A stream ID.
     *
     * This manages the first available stream ID from the `streamIds` property.
     * Set to `null` to remove.
     */
    get streamId(): string | undefined;
    set streamId(streamId: string | null);
    /**
     * An array of stream IDs. Set to `null` to remove.
     */
    get streamIds(): string[] | undefined;
    set streamIds(streamIds: string[] | null);
    /**
     * A user ID.
     *
     * This manages the first available location ID from the `userIds` property.
     * Set to `null` to remove.
     */
    get userId(): number | undefined;
    set userId(userId: number | null);
    /**
     * An array of user IDs. Set to `null` to remove.
     */
    get userIds(): number[] | undefined;
    set userIds(userIds: number[] | null);
    /**
     * The "most recent" flag. Set to `null` to remove.
     */
    get mostRecent(): boolean | undefined;
    set mostRecent(value: boolean | null);
    /**
     * A minimumin date. Set to `null` to remove.
     */
    get startDate(): Date | undefined;
    set startDate(date: Date | null);
    /**
     * A maximum date. Set to `null` to remove.
     */
    get endDate(): Date | undefined;
    set endDate(date: Date | null);
    /**
     * Alocal minimumin date. Set to `null` to remove.
     */
    get localStartDate(): Date | undefined;
    set localStartDate(date: Date | null);
    /**
     * A local maximum date. Set to `null` to remove.
     */
    get localEndDate(): Date | undefined;
    set localEndDate(date: Date | null);
    /**
     * A data path, in dot-delimited notation like `i.watts`.
     * Set to `null` to remove.
     */
    get dataPath(): string | undefined;
    set dataPath(path: string | null);
    /**
     * An aggregation.
     *
     * Including this in a filter will cause SolarNet to return aggregated results, rather
     * than raw results. Set to `null` to remove.
     */
    get aggregation(): Aggregation | undefined;
    set aggregation(agg: Aggregation | null);
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
    get partialAggregation(): Aggregation | undefined;
    set partialAggregation(agg: Aggregation | null);
    /**
     * An array of tags. Set to `null` to remove.
     */
    get tags(): string[] | undefined;
    set tags(val: string[] | null);
    /**
     * A location, used as an example-based search criteria. Set to `null` to remove.
     */
    get location(): Location | undefined;
    set location(val: Location | null);
    /**
     * A general full-text style query string. Set to `null` to remove.
     */
    get query(): string | undefined;
    set query(val: string | null);
    /**
     * A metadata filter (LDAP style search criteria). Set to `null` to remove.
     */
    get metadataFilter(): string | undefined;
    set metadataFilter(val: string | null);
    /**
     * Get the _without total results_ flag. Set to `null` to remove.
     */
    get withoutTotalResultsCount(): boolean | undefined;
    set withoutTotalResultsCount(val: boolean | null);
    /**
     * Get the combining type.
     *
     * Use this to combine nodes and/or sources into virtual groups. Requires some combination
     * of {@link Domain.DatumFilter#nodeIdMaps} or {@link Domain.DatumFilter#sourceIdMaps} also be specified.
     * Set to `null` to remove.
     */
    get combiningType(): CombiningType | undefined;
    set combiningType(type: CombiningType | null);
    /**
     * A mapping of virtual node IDs to sets of real node IDs to combine. Set to `null` to remove.
     */
    get nodeIdMaps(): Map<number, Set<number>> | undefined;
    set nodeIdMaps(map: Map<number, Set<number>> | null);
    /**
     * A mapping of virtual source IDs to sets of real source IDs to combine. Set to `null` to remove.
     */
    get sourceIdMaps(): Map<string, Set<string>> | undefined;
    set sourceIdMaps(map: Map<string, Set<string>> | null);
    /**
     * Get the rollup type.
     *
     * Use this with reading queries on aggregate values to rollup the results.
     * Set to `null` to remove.
     */
    get rollupType(): DatumRollupType | undefined;
    set rollupType(rollup: DatumRollupType | null);
    /**
     * An array of rollup types. Set to `null` to remove.
     */
    get rollupTypes(): DatumRollupType[] | undefined;
    set rollupTypes(rollups: DatumRollupType[] | null);
    /**
     * A property name.
     *
     * This manages the first available value from the `propertyNames` property.
     * Set to `null` to remove.
     */
    get propertyName(): string | undefined;
    set propertyName(name: string | null);
    /**
     * An array of property names. Set to `null` to remove.
     */
    get propertyNames(): string[] | undefined;
    set propertyNames(names: string[] | null);
    /**
     * An instantaneous property name.
     *
     * This manages the first available value from the `instantaneousPropertyNames` property.
     * Set to `null` to remove.
     */
    get instantaneousPropertyName(): string | undefined;
    set instantaneousPropertyName(name: string | null);
    /**
     * An array of instantaneous property names. Set to `null` to remove.
     */
    get instantaneousPropertyNames(): string[] | undefined;
    set instantaneousPropertyNames(names: string[] | null);
    /**
     * An accumulating property name.
     *
     * This manages the first available value from the `accumulatingPropertyNames` property.
     * Set to `null` to remove.
     */
    get accumulatingPropertyName(): string | undefined;
    set accumulatingPropertyName(name: string | null);
    /**
     * An array of accumulating property names. Set to `null` to remove.
     */
    get accumulatingPropertyNames(): string[] | undefined;
    set accumulatingPropertyNames(names: string[] | null);
    /**
     * A property name.
     *
     * This manages the first available value from the `statusPropertyNames` property.
     * Set to `null` to remove.
     */
    get statusPropertyName(): string | undefined;
    set statusPropertyName(name: string | null);
    /**
     * An array of property names. Set to `null` to remove.
     */
    get statusPropertyNames(): string[] | undefined;
    set statusPropertyNames(names: string[] | null);
    /**
     * @override
     * @inheritdoc
     */
    toUriEncoding(propertyName?: string, callbackFn?: PropMapUriEncodingCallbackFn): string;
}
export default DatumFilter;
export { DatumFilterKeys, type DatumFilterProperties, DatumFilterPropertyNames, DatumFilterPropertyNamesSet, };
//# sourceMappingURL=datumFilter.d.ts.map