import { DatumSamplesType } from "./datumSamplesType.js";
import DatumStreamMetadata from "./datumStreamMetadata.js";
import DatumStreamMetadataRegistry from "../util/datumStreamMetadataRegistry.js";
import StreamedDatum from "./streamedDatum.js";
/**
 * Instantaneous property statistics.
 *
 * The values of the array represent:
 *
 * 1. the **aggregate value** of the property values in the aggregate block (average)
 * 2. the **count** of property values in the aggregate block
 * 3. the **minimum** property value in the aggregate block
 * 4. the **maximum** property value in the aggregate block
 */
type InstantaneousPropertyStatistics = [number, number, number, number];
/**
 * Instantaneous property statistics.
 *
 * The values of the array represent:
 *
 * 1. the **aggregate value** of the property values in the aggregate block (accumulation/difference)
 * 2. the **first** property value in the aggregate block
 * 3. the **last** propert value in the aggregate block
 */
type AccumulatingPropertyStatistics = [number, number, number];
/**
 * A stream aggregate datum entity.
 *
 * A stream aggregate datum is a datum representing some aggregate calculation, without any metadata describing the datum property names.
 * The instantantaneous and accumulating property values are stored as 2D array fields `iProps` and `aProps` that hold the property values
 * as well as associated aggregate statistics. The datum status properties are stroed in the 1D array field `sProps`. A
 * {@link Domain.DatumStreamMetadata DatumStreamMetadata} object is required to associate names with these arrays.
 *
 * The instantaneous properties are 4-element arrays containing:
 *
 *  1. property average value
 *  2. property count
 *  3. minimum value
 *  4. maximum value
 *
 * The accumulatingn statistics are 3-element arrays containing:
 *
 *  1. difference between ending and starting property values
 *  2. starting property value
 *  3. ending property value
 */
declare class StreamAggregateDatum implements StreamedDatum {
    /** The stream ID. */
    readonly streamId: string;
    /** The start and end dates. */
    readonly ts: Date[];
    /** The instantaneous property values and associated statistics. */
    readonly iProps?: InstantaneousPropertyStatistics[];
    /** The accumulating property values and associated statistics. */
    readonly aProps?: AccumulatingPropertyStatistics[];
    /** The status property values. */
    readonly sProps?: string[];
    /** The tag values. */
    readonly tags?: Set<string>;
    /** Attached metadata. */
    readonly meta?: DatumStreamMetadata;
    /**
     * Constructor.
     * @param streamId - the datum stream ID
     * @param ts - an array with 2 elements for the datum start and end timestamps, either as a `Date` instance
     * or a form suitable for constructing as `new Date(ts)`
     * @param iProps - the instantaneous property values and associated statistics
     * @param aProps - the accumulating property values and associated statistics
     * @param sProps - the status property values
     * @param tags - the tag values
     * @param meta - optional metadata to attach, or a metadata registry to resolve metadata based on the given `streamId`
     */
    constructor(streamId: string, ts: Array<Date | number | string>, iProps?: InstantaneousPropertyStatistics[], aProps?: AccumulatingPropertyStatistics[], sProps?: string[], tags?: Set<string> | string[], meta?: DatumStreamMetadata | DatumStreamMetadataRegistry);
    /**
     * @inheritdoc
     */
    get date(): Date;
    /**
     * @inheritdoc
     */
    get metadata(): DatumStreamMetadata | undefined;
    /**
     * @inheritdoc
     */
    propertyValuesForType(samplesType: DatumSamplesType): number[] | string[] | Set<string> | undefined;
    /**
     * Get this instance as a simple object.
     *
     * The following basic properties will be set on the returned object:
     *
     *  * `streamId` - the stream ID
     *  * `date` - the timestamp
     *  * `date_end` - the ending timestamp, if available
     *  * `sourceId` - the metadata source ID
     *  * `nodeId` or `locationId` - either the node ID or location ID from the metadata
     *  * `tags` - any tags (as an Array)
     *
     * Beyond that, all instantaneous, accumulating, and status properties will be included.
     * If duplicate property names exist between the different classifications, the first-available
     * value will be used. Any available statistics for each property are included as well, using
     * property names with the following suffixes:
     *
     *  * `_count` - count of datum
     *  * `_min` - minimum value
     *  * `_max` - maximum value
     *  * `_start` - starting value
     *  * `_end` - ending value
     *
     * @param meta - a metadata instance or metadata registry to encode the property names with;
     *     falls back to the `meta` class property if not provided
     * @param withoutStatistics - `true` to omit statistic properties
     * @returns an object populated with all available properties
     */
    toObject(meta?: DatumStreamMetadata | DatumStreamMetadataRegistry, withoutStatistics?: boolean): Record<string, any> | undefined;
    /**
     * Get this object as a standard JSON encoded string value.
     *
     * This method returns the JSON form of the result of {@link Domain.StreamAggregateDatum#toJsonObject toJsonObject()}.
     *
     * @param registry - a stream metadata registry to encode as a registry-indexed stream datum
     * @return the JSON encoded string
     */
    toJsonEncoding(registry?: DatumStreamMetadataRegistry): string;
    /**
     * Get this object as an array suitable for encoding into a standard stream datum JSON string.
     *
     * This method can encode the datum into an array using one of two ways, depending on whether the `registry` argument is provided.
     * When provided, the first array element will be the stream metadata index based on calling
     * {@link Util.DatumStreamMetadataRegistry#indexOfMetadataStreamId indexOfMetadataStreamId()}.
     * Otherwise the first array element will be the stream ID itself.
     *
     * For example if a registry is used, the resulting array might look like this:
     *
     * ```
     * [0,[1650945600000,1651032000000],[3.6,2,0,7.2],[19.1,2,18.1, 20.1],[1.422802,1138.446687,1139.869489]]
     * ```
     *
     * while without a registry the array might look like this:
     *
     * ```
     * ["7714f762-2361-4ec2-98ab-7e96807b32a6", [1650945600000,1651032000000],[3.6,2,0,7.2],[19.1,2,18.1, 20.1],[1.422802,1138.446687,1139.869489]]
     * ```
     *
     * @param registry - a stream metadata registry to encode as a registry-indexed stream datum
     * @return {Array} the datum stream array object
     */
    toJsonObject(registry?: DatumStreamMetadataRegistry): any[];
    /**
     * Parse a JSON string into a {@link Domain.StreamAggregateDatum StreamAggregateDatum} instance.
     *
     * The JSON must be encoded the same way {@link Domain.StreamAggregateDatum#toJsonEncoding toJsonEncoding()} does.
     *
     * @param json - the JSON to parse
     * @param meta - a metadata instance or metadata registry to decode with
     * @returns the stream datum instance
     * @throws SyntaxError if `json` is not valid JSON
     */
    static fromJsonEncoding(json: string, meta: DatumStreamMetadata | DatumStreamMetadataRegistry): StreamAggregateDatum | undefined;
    /**
     * Create a new {@link module:domain~StreamAggregateDatum StreamAggregateDatum}
     * instance from an array parsed from a stream datum JSON string.
     *
     * The array must have been parsed from JSON that was encoded the same way
     * {@link Domain.StreamAggregateDatum#toJsonEncoding toJsonEncoding()} does.
     *
     * @param data - the array parsed from JSON
     * @param meta - a metadata instance or metadata registry to decode with
     * @returns the stream datum instance
     */
    static fromJsonObject(data: any[], meta: DatumStreamMetadata | DatumStreamMetadataRegistry): StreamAggregateDatum | undefined;
}
export default StreamAggregateDatum;
export { type InstantaneousPropertyStatistics, type AccumulatingPropertyStatistics, };
//# sourceMappingURL=streamAggregateDatum.d.ts.map