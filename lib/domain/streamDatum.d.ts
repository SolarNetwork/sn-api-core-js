import { DatumSamplesType } from "./datumSamplesType.js";
import DatumStreamMetadata from "./datumStreamMetadata.js";
import DatumStreamMetadataRegistry from "../util/datumStreamMetadataRegistry.js";
import StreamedDatum from "./streamedDatum.js";
/**
 * A stream datum entity.
 *
 * A stream datum is a datum without any metadata describing the datum property names.
 * The instantantaneous, accumulating, and status property values are stored as the array
 * fields `iProps`, `aProps`, and `sProps`. A {@link Domain.DatumStreamMetadata DatumStreamMetadata}
 * object is required to associate names with these arrays.
 */
declare class StreamDatum implements StreamedDatum {
    /** The stream ID. */
    readonly streamId: string;
    /** The timestamp. */
    readonly ts: Date;
    /** The instantaneous property values. */
    readonly iProps?: number[];
    /** The accumulating property values. */
    readonly aProps?: number[];
    /** The status property values. */
    readonly sProps?: string[];
    /** The tag values. */
    readonly tags?: Set<string>;
    /** Attached metadata. */
    readonly meta?: DatumStreamMetadata;
    /**
     * Constructor.
     * @param streamId - the datum stream ID
     * @param ts - the datum timestamp, either as a `Date` instance or a form suitable for constructing as `new Date(ts)`
     * @param iProps - the instantaneous property values
     * @param aProps - the accumulating property values
     * @param sProps - the status property values
     * @param tags - the tag values
     * @param meta - optional metadata to attach, or a metadata registry to resolve metadata based on the given `streamId`
     */
    constructor(streamId: string, ts: Date | number | string, iProps?: number[], aProps?: number[], sProps?: string[], tags?: Iterable<string> | string[], meta?: DatumStreamMetadata | DatumStreamMetadataRegistry);
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
     *  * `sourceId` - the metadata source ID
     *  * `nodeId` or `locationId` - either the node ID or location ID from the metadata
     *  * `tags` - any tags (as an Array)
     *
     * Beyond that, all instantaneous, accumulating, and status properties will be included.
     * If duplicate property names exist between the different classifications, the first-available
     * value will be used.
     *
     * @param meta - a metadata instance or metadata registry to encode the property names with;
     *     falls back to the `meta` class property if not provided
     * @returns an object populated with all available properties
     */
    toObject(meta?: DatumStreamMetadata | DatumStreamMetadataRegistry): Record<string, any> | undefined;
    /**
     * Get this object as a standard JSON encoded string value.
     *
     * This method returns the JSON form of the result of {@link Domain.StreamDatum#toJsonObject #toJsonObject()}.
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
     * [0, 1650667326308, 12326, null, 230.19719, 50.19501, 6472722]
     * ```
     *
     * while without a registry the array might look like this:
     *
     * ```
     * ["7714f762-2361-4ec2-98ab-7e96807b32a6", 1650667326308, 12326, null, 230.19719, 50.19501, 6472722]
     * ```
     *
     * @param registry - a stream metadata registry to encode as a registry-indexed stream datum
     * @return the datum stream array object
     */
    toJsonObject(registry?: DatumStreamMetadataRegistry): any[];
    /**
     * Parse a JSON string into a {@link Domain.StreamDatum StreamDatum} instance.
     *
     * The JSON must be encoded the same way {@link Domain.StreamDatum#toJsonEncoding toJsonEncoding()} does.
     *
     * @param json - the JSON to parse
     * @param meta - a metadata instance or metadata registry to decode with
     * @returns the stream datum instance
     */
    static fromJsonEncoding(json: string, meta: DatumStreamMetadata | DatumStreamMetadataRegistry): StreamDatum | undefined;
    /**
     * Create a new {@link module:domain~StreamDatum StreamDatum} instance from an array parsed from a stream datum JSON string.
     *
     * The array must have been parsed from JSON that was encoded the same way {@link module:domain~StreamDatum#toJsonEncoding StreamDatum#toJsonEncoding()} does.
     *
     * @param {Array} data the array parsed from JSON
     * @param {module:domain~DatumStreamMetadata|module:util~DatumStreamMetadataRegistry} meta a metadata instance or metadata registry to decode with
     * @returns {module:domain~StreamDatum} the stream datum instance
     */
    static fromJsonObject(data: any[], meta: DatumStreamMetadata | DatumStreamMetadataRegistry): StreamDatum | undefined;
}
export default StreamDatum;
//# sourceMappingURL=streamDatum.d.ts.map