import { default as DatumSamplesTypes, } from "./datumSamplesType.js";
import DatumStreamMetadata from "./datumStreamMetadata.js";
import { pushValues } from "../util/arrays.js";
import DatumStreamMetadataRegistry from "../util/datumStreamMetadataRegistry.js";
function populateProperties(obj, names, values, type, withoutStatistics) {
    if (!Array.isArray(names) || !Array.isArray(values)) {
        return;
    }
    let val, name, valLen;
    for (let i = 0, iMax = Math.min(names.length, values.length); i < iMax; i += 1) {
        val = values[i];
        if (DatumSamplesTypes.Instantaneous === type) {
            if (Array.isArray(val)) {
                name = names[i];
                valLen = val.length;
                if (valLen > 0 &&
                    val[0] !== null &&
                    !Object.prototype.hasOwnProperty.call(obj, name)) {
                    obj[name] = val[0];
                    if (!withoutStatistics) {
                        if (valLen > 1 && val[1] !== null) {
                            obj[name + "_count"] = val[1];
                        }
                        if (valLen > 2 && val[2] !== null) {
                            obj[name + "_min"] = val[2];
                        }
                        if (valLen > 3 && val[3] !== null) {
                            obj[name + "_max"] = val[3];
                        }
                    }
                }
            }
        }
        else if (DatumSamplesTypes.Accumulating === type) {
            if (Array.isArray(val)) {
                name = names[i];
                valLen = val.length;
                if (valLen > 0 &&
                    val[0] !== null &&
                    !Object.prototype.hasOwnProperty.call(obj, name)) {
                    obj[name] = val[0];
                    if (!withoutStatistics) {
                        if (valLen > 1 && val[1] !== null) {
                            obj[name + "_start"] = val[1];
                        }
                        if (valLen > 2 && val[2] !== null) {
                            obj[name + "_end"] = val[2];
                        }
                    }
                }
            }
        }
        else {
            if (val !== undefined && val !== null) {
                name = names[i];
                if (!Object.prototype.hasOwnProperty.call(obj, name)) {
                    obj[name] = val;
                }
            }
        }
    }
}
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
class StreamAggregateDatum {
    /** The stream ID. */
    streamId;
    /** The start and end dates. */
    ts;
    /** The instantaneous property values and associated statistics. */
    iProps;
    /** The accumulating property values and associated statistics. */
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
     * @param ts - an array with 2 elements for the datum start and end timestamps, either as a `Date` instance
     * or a form suitable for constructing as `new Date(ts)`
     * @param iProps - the instantaneous property values and associated statistics
     * @param aProps - the accumulating property values and associated statistics
     * @param sProps - the status property values
     * @param tags - the tag values
     * @param meta - optional metadata to attach, or a metadata registry to resolve metadata based on the given `streamId`
     */
    constructor(streamId, ts, iProps, aProps, sProps, tags, meta) {
        this.streamId = streamId;
        this.ts = Array.isArray(ts)
            ? ts.map((e) => (e instanceof Date ? e : new Date(e)))
            : [];
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
        if (this.constructor === StreamAggregateDatum) {
            Object.freeze(this);
        }
    }
    /**
     * @inheritdoc
     */
    get date() {
        return this.ts.length ? this.ts[0] : new Date(undefined);
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
            return this.iProps ? this.iProps.map((e) => e[0]) : undefined;
        }
        else if (DatumSamplesTypes.Accumulating.equals(samplesType)) {
            return this.aProps ? this.aProps.map((e) => e[0]) : undefined;
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
    toObject(meta, withoutStatistics) {
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
            sourceId: m.sourceId,
        };
        if (this.ts.length > 0) {
            obj.date = this.ts[0];
            if (this.ts.length > 1) {
                obj.date_end = this.ts[1];
            }
        }
        if (m.nodeId !== undefined) {
            obj.nodeId = m.nodeId;
        }
        else if (m.locationId !== undefined) {
            obj.locationId = m.locationId;
        }
        if (this.tags) {
            obj.tags = Array.from(this.tags);
        }
        populateProperties(obj, m.instantaneousNames, this.iProps, DatumSamplesTypes.Instantaneous, withoutStatistics);
        populateProperties(obj, m.accumulatingNames, this.aProps, DatumSamplesTypes.Accumulating, withoutStatistics);
        populateProperties(obj, m.statusNames, this.sProps, DatumSamplesTypes.Status);
        return obj;
    }
    /**
     * Get this object as a standard JSON encoded string value.
     *
     * This method returns the JSON form of the result of {@link Domain.StreamAggregateDatum#toJsonObject toJsonObject()}.
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
     * [0,[1650945600000,1651032000000],[3.6,2,0,7.2],[19.1,2,18.1, 20.1],[1.422802,1138.446687,1139.869489]]
     * ```
     *
     * while without a registry the array might look like this:
     *
     * ```
     * ["7714f762-2361-4ec2-98ab-7e96807b32a6", [1650945600000,1651032000000],[3.6,2,0,7.2],[19.1,2,18.1, 20.1],[1.422802,1138.446687,1139.869489]]
     * ```
     *
     * @param registry a stream metadata registry to encode as a registry-indexed stream datum
     * @return the datum stream array object
     */
    toJsonObject(registry) {
        const result = [
            registry instanceof DatumStreamMetadataRegistry
                ? registry.indexOfMetadataStreamId(this.streamId)
                : this.streamId,
            this.ts.map((e) => e instanceof Date && !isNaN(e.getTime()) ? e.getTime() : null),
        ];
        pushValues(result, this.iProps);
        pushValues(result, this.aProps);
        pushValues(result, this.sProps);
        pushValues(result, this.tags);
        return result;
    }
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
    static fromJsonEncoding(json, meta) {
        return this.fromJsonObject(JSON.parse(json), meta);
    }
    /**
     * Create a new {@link Domain.StreamAggregateDatum StreamAggregateDatum}
     * instance from an array parsed from a stream datum JSON string.
     *
     * The array must have been parsed from JSON that was encoded the same way
     * {@link Domain.StreamAggregateDatum#toJsonEncoding toJsonEncoding()} does.
     *
     * @param data - the array parsed from JSON
     * @param meta - a metadata instance or metadata registry to decode with
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
        return new this(m.streamId, data[1], iProps, aProps, sProps, tags, meta);
    }
}
export default StreamAggregateDatum;
//# sourceMappingURL=streamAggregateDatum.js.map