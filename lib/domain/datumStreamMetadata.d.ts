import { DatumStreamType } from "./datumStreamType.js";
import { DatumSamplesType } from "./datumSamplesType.js";
import JsonEncodable from "../util/jsonEncodable.js";
/**
 * The basic DatumStreamMetadata type.
 */
export interface DatumStreamMetadataInfo {
    /** The datum stream unique identifier. */
    streamId: string;
    /** The object (node or location) ID. */
    objectId: number;
    /** The source ID. */
    sourceId: string;
    /** The time zone identifier the stream is associated with. */
    zone: string;
    /** The stream kind, `n` for node or `l` for location. */
    kind: string;
    /** An optional location object. */
    location?: Record<string, any>;
    /** The instantaneous property names. */
    i?: string[];
    /** The accumulating property names. */
    a?: string[];
    /** The status property names. */
    s?: string[];
}
/**
 * Metadata about a datum stream.
 */
export default class DatumStreamMetadata implements JsonEncodable {
    #private;
    /**
     * Constructor.
     * @param streamId -  the stream ID
     * @param zone - the time zone ID
     * @param kind - the stream type
     * @param objectId - the node or location ID
     * @param sourceId - the source ID
     * @param iNames - the instantaneous property name array
     * @param aNames - the accumulating property name array
     * @param sNames - the status property name array
     */
    constructor(streamId: string, zone: string, kind: DatumStreamType, objectId: number, sourceId: string, iNames?: string[], aNames?: string[], sNames?: string[]);
    /**
     * Create a new node datum stream metadata instance.
     * @param streamId -  the stream ID
     * @param zone - the time zone ID
     * @param nodeId - the node ID
     * @param sourceId - the source ID
     * @param iNames - the instantaneous property name array
     * @param aNames - the accumulating property name array
     * @param sNames - the status property name array
     * @returns the new metadata instance
     */
    static nodeMetadata(streamId: string, zone: string, nodeId: number, sourceId: string, iNames?: string[], aNames?: string[], sNames?: string[]): DatumStreamMetadata;
    /**
     * Create a new location datum stream metadata instance.
     * @param streamId -  the stream ID
     * @param zone - the time zone ID
     * @param locationId - the location ID
     * @param sourceId - the source ID
     * @param iNames - the instantaneous property name array
     * @param aNames - the accumulating property name array
     * @param sNames - the status property name array
     * @returns the new metadata instance
     */
    static locationMetadata(streamId: string, zone: string, locationId: number, sourceId: string, iNames?: string[], aNames?: string[], sNames?: string[]): DatumStreamMetadata;
    /**
     * The stream ID, for example `7714f762-2361-4ec2-98ab-7e96807b32a6`.
     */
    get streamId(): string;
    /**
     * The stream time zone ID, for example `Pacific/Auckland`.
     */
    get timeZoneId(): string;
    /**
     * The stream type.
     */
    get kind(): DatumStreamType;
    /**
     * The stream objece (node or location) ID.
     */
    get objectId(): number;
    /**
     * The stream object ID (if the `kind` is `Node`), otherwise `undefined`.
     */
    get nodeId(): number | undefined;
    /**
     * The stream object ID (if the `kind` is `Location`), otherewise `undefined`.
     */
    get locationId(): number | undefined;
    /**
     * The stream source ID.
     */
    get sourceId(): string;
    /**
     * The instantaneous property names array length.
     */
    get instantaneousLength(): number;
    /**
     * The instantaneous property names array.
     */
    get instantaneousNames(): string[] | undefined;
    /**
     * The accumulating property names array length.
     */
    get accumulatingLength(): number;
    /**
     * The accumulating property names array.
     */
    get accumulatingNames(): string[] | undefined;
    /**
     * The status property names array length.
     */
    get statusLength(): number;
    /**
     * The status property names array.
     */
    get statusNames(): string[] | undefined;
    /**
     * The total number of instantaneous, accumulating, and status property names.
     */
    get propertyNamesLength(): number;
    /**
     * Get all stream property names, in order of instantaneous, accumulating, and status.
     */
    get propertyNames(): string[] | undefined;
    /**
     * Get the property names for a given samples type.
     * @param samplesType - the type of property names to return; `Tag` is not supported
     * @returns the property names for the given type, or `undefined` if none available
     */
    propertyNamesForType(samplesType: DatumSamplesType): string[] | undefined;
    /**
     * Get this object in standard JSON form.
     *
     * An example result looks like this:
     *
     * ```
     * {
     *   "streamId": "7714f762-2361-4ec2-98ab-7e96807b32a6",
     *   "zone": "Pacific/Auckland",
     *   "kind": "n",
     *   "objectId": 123,
     *   "sourceId": "/power/1",
     *   "i": ["watts", "current",  "voltage", "frequency"],
     *   "a": ["wattHours"]
     * }
     * ```
     *
     * @return an object, ready for JSON encoding
     */
    toJsonObject(): DatumStreamMetadataInfo;
    /**
     * Get this object as a standard JSON encoded string value.
     *
     * An example result looks like this:
     *
     * ```
     * {
     *       "streamId": "7714f762-2361-4ec2-98ab-7e96807b32a6",
     *       "zone": "Pacific/Auckland",
     *       "kind": "n",
     *       "objectId": 123,
     *       "sourceId": "/power/1",
     *       "i": ["watts", "current",  "voltage", "frequency"],
     *       "a": ["wattHours"]
     * }
     * ```
     *
     * @return the JSON encoded string
     */
    toJsonEncoding(): string;
    /**
     * Parse a JSON string into a {@link Domain.DatumStreamMetadata} instance.
     *
     * The JSON must be encoded the same way {@link Domain.DatumStreamMetadata#toJsonEncoding} does.
     *
     * @param json - the JSON to parse
     * @returns the stream metadata instance
     */
    static fromJsonEncoding(json: string): DatumStreamMetadata | undefined;
    /**
     * Create a metadata instance from an object parsed from a JSON string.
     *
     * The object must have been parsed from JSON that was encoded the same way
     * {@link Domain.DatumStreamMetadata#toJsonEncoding} does.
     *
     * @param obj the object parsed from JSON
     * @returns the stream metadata instance
     */
    static fromJsonObject(obj: DatumStreamMetadataInfo): DatumStreamMetadata | undefined;
}
//# sourceMappingURL=datumStreamMetadata.d.ts.map