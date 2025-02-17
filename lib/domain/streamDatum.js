import { pushValues } from "../util/arrays.js";
import DatumSamplesTypes from "./datumSamplesType.js";
import DatumStreamMetadata from "./datumStreamMetadata.js";
import DatumStreamMetadataRegistry from "../util/datumStreamMetadataRegistry.js";
function populateProperties(obj, names, values) {
    if (!(Array.isArray(names) && Array.isArray(values))) {
        return;
    }
    let val, name;
    for (let i = 0, len = Math.min(names.length, values.length); i < len; i += 1) {
        val = values[i];
        if (val !== undefined && val !== null) {
            name = names[i];
            if (!Object.prototype.hasOwnProperty.call(obj, name)) {
                obj[name] = val;
            }
        }
    }
}
/**
 * A stream datum entity.
 *
 * A stream datum is a datum without any metadata describing the datum property names.
 * The instantantaneous, accumulating, and status property values are stored as the array
 * fields `iProps`, `aProps`, and `sProps`. A {@link Domain.DatumStreamMetadata DatumStreamMetadata}
 * object is required to associate names with these arrays.
 */
class StreamDatum {
    /** The stream ID. */
    streamId;
    /** The timestamp. */
    ts;
    /** The instantaneous property values. */
    iProps;
    /** The accumulating property values. */
    aProps;
    /** The status property values. */
    sProps;
    /** The tag values. */
    tags;
    /** Attached metadata. */
    meta;
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
    constructor(streamId, ts, iProps, aProps, sProps, tags, meta) {
        this.streamId = streamId;
        this.ts = ts instanceof Date ? ts : new Date(ts);
        this.iProps = iProps;
        this.aProps = aProps;
        this.sProps = sProps;
        this.tags = tags
            ? tags instanceof Set
                ? tags
                : new Set(tags)
            : undefined;
        this.meta =
            meta instanceof DatumStreamMetadataRegistry
                ? meta.metadataForStreamId(streamId)
                : meta instanceof DatumStreamMetadata
                    ? meta
                    : undefined;
        if (this.constructor === StreamDatum) {
            Object.freeze(this);
        }
    }
    /**
     * @inheritdoc
     */
    get date() {
        return this.ts;
    }
    /**
     * @inheritdoc
     */
    get metadata() {
        return this.meta;
    }
    /**
     * @inheritdoc
     */
    propertyValuesForType(samplesType) {
        if (DatumSamplesTypes.Instantaneous.equals(samplesType)) {
            return this.iProps;
        }
        else if (DatumSamplesTypes.Accumulating.equals(samplesType)) {
            return this.aProps;
        }
        else if (DatumSamplesTypes.Status.equals(samplesType)) {
            return this.sProps;
        }
        else if (DatumSamplesTypes.Tag.equals(samplesType)) {
            return this.tags;
        }
        return undefined;
    }
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
    toObject(meta) {
        const m = meta instanceof DatumStreamMetadataRegistry
            ? meta.metadataForStreamId(this.streamId)
            : meta instanceof DatumStreamMetadata
                ? meta
                : this.meta;
        if (!m) {
            return undefined;
        }
        const obj = {
            streamId: this.streamId,
            date: this.ts,
            sourceId: m.sourceId,
        };
        if (m.nodeId !== undefined) {
            obj.nodeId = m.nodeId;
        }
        else if (m.locationId !== undefined) {
            obj.locationId = m.locationId;
        }
        if (this.tags) {
            obj.tags = Array.from(this.tags);
        }
        populateProperties(obj, m.instantaneousNames, this.iProps);
        populateProperties(obj, m.accumulatingNames, this.aProps);
        populateProperties(obj, m.statusNames, this.sProps);
        return obj;
    }
    /**
     * Get this object as a standard JSON encoded string value.
     *
     * This method returns the JSON form of the result of {@link Domain.StreamDatum#toJsonObject #toJsonObject()}.
     *
     * @param registry - a stream metadata registry to encode as a registry-indexed stream datum
     * @return the JSON encoded string
     */
    toJsonEncoding(registry) {
        return JSON.stringify(this.toJsonObject(registry));
    }
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
    toJsonObject(registry) {
        const result = [
            registry instanceof DatumStreamMetadataRegistry
                ? registry.indexOfMetadataStreamId(this.streamId)
                : this.streamId,
            this.ts.getTime(),
        ];
        pushValues(result, this.iProps);
        pushValues(result, this.aProps);
        pushValues(result, this.sProps);
        pushValues(result, this.tags);
        return result;
    }
    /**
     * Parse a JSON string into a {@link Domain.StreamDatum StreamDatum} instance.
     *
     * The JSON must be encoded the same way {@link Domain.StreamDatum#toJsonEncoding toJsonEncoding()} does.
     *
     * @param json - the JSON to parse
     * @param meta - a metadata instance or metadata registry to decode with
     * @returns the stream datum instance
     */
    static fromJsonEncoding(json, meta) {
        return this.fromJsonObject(JSON.parse(json), meta);
    }
    /**
     * Create a new {@link Domain.StreamDatum StreamDatum} instance from an array parsed from a stream datum JSON string.
     *
     * The array must have been parsed from JSON that was encoded the same way {@link Domain.StreamDatum#toJsonEncoding StreamDatum#toJsonEncoding()} does.
     *
     * @param data the array parsed from JSON
     * @param meta a metadata instance or metadata registry to decode with
     * @returns the stream datum instance
     */
    static fromJsonObject(data, meta) {
        let i, len, m, iProps, aProps, sProps, tags;
        if (!(Array.isArray(data) && data.length > 1)) {
            return undefined;
        }
        if (typeof data[0] === "string") {
            // treat as an embedded stream ID stream datum
            m =
                meta instanceof DatumStreamMetadata
                    ? meta
                    : meta instanceof DatumStreamMetadataRegistry
                        ? meta.metadataForStreamId(data[0])
                        : undefined;
        }
        else {
            // treat as a registry-indexed stream datum
            m =
                meta instanceof DatumStreamMetadata
                    ? meta
                    : meta instanceof DatumStreamMetadataRegistry
                        ? meta.metadataAt(data[0])
                        : undefined;
        }
        if (!m) {
            return undefined;
        }
        const ts = new Date(data[1]);
        i = 2;
        len = m.instantaneousLength;
        if (len > 0) {
            iProps = data.slice(i, i + len);
            i += len;
        }
        len = m.accumulatingLength;
        if (len > 0) {
            aProps = data.slice(i, i + len);
            i += len;
        }
        len = m.statusLength;
        if (len > 0) {
            sProps = data.slice(i, i + len);
            i += len;
        }
        if (i < data.length) {
            tags = new Set(data.slice(i));
        }
        // to support StreamDatumMetadataMixin we pass meta as additional argument
        return new this(m.streamId, ts, iProps, aProps, sProps, tags, meta);
    }
}
export default StreamDatum;
//# sourceMappingURL=streamDatum.js.map