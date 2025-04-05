import { DatumStreamType, default as DatumStreamTypes, } from "./datumStreamType.js";
import DatumSamplesTypes from "./datumSamplesType.js";
/**
 * Metadata about a datum stream.
 */
export default class DatumStreamMetadata {
    #streamId;
    #zone;
    #kind;
    #objectId;
    #sourceId;
    #iNames;
    #aNames;
    #sNames;
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
    constructor(streamId, zone, kind, objectId, sourceId, iNames, aNames, sNames) {
        this.#streamId = streamId;
        this.#zone = zone;
        this.#kind =
            kind instanceof DatumStreamType ? kind : DatumStreamTypes.Node;
        this.#objectId = objectId;
        this.#sourceId = sourceId;
        this.#iNames = Array.isArray(iNames) ? iNames : undefined;
        this.#aNames = Array.isArray(aNames) ? aNames : undefined;
        this.#sNames = Array.isArray(sNames) ? sNames : undefined;
        if (this.constructor === DatumStreamMetadata) {
            Object.freeze(this);
        }
    }
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
    static nodeMetadata(streamId, zone, nodeId, sourceId, iNames, aNames, sNames) {
        return new DatumStreamMetadata(streamId, zone, DatumStreamTypes.Node, nodeId, sourceId, iNames, aNames, sNames);
    }
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
    static locationMetadata(streamId, zone, locationId, sourceId, iNames, aNames, sNames) {
        return new DatumStreamMetadata(streamId, zone, DatumStreamTypes.Location, locationId, sourceId, iNames, aNames, sNames);
    }
    /**
     * The stream ID, for example `7714f762-2361-4ec2-98ab-7e96807b32a6`.
     */
    get streamId() {
        return this.#streamId;
    }
    /**
     * The stream time zone ID, for example `Pacific/Auckland`.
     */
    get timeZoneId() {
        return this.#zone;
    }
    /**
     * The stream type.
     */
    get kind() {
        return this.#kind;
    }
    /**
     * The stream objece (node or location) ID.
     */
    get objectId() {
        return this.#objectId;
    }
    /**
     * The stream object ID (if the `kind` is `Node`), otherwise `undefined`.
     */
    get nodeId() {
        return DatumStreamTypes.Node.equals(this.#kind)
            ? this.#objectId
            : undefined;
    }
    /**
     * The stream object ID (if the `kind` is `Location`), otherewise `undefined`.
     */
    get locationId() {
        return DatumStreamTypes.Location.equals(this.#kind)
            ? this.#objectId
            : undefined;
    }
    /**
     * The stream source ID.
     */
    get sourceId() {
        return this.#sourceId;
    }
    /**
     * The instantaneous property names array length.
     */
    get instantaneousLength() {
        return Array.isArray(this.#iNames) ? this.#iNames.length : 0;
    }
    /**
     * The instantaneous property names array.
     */
    get instantaneousNames() {
        return this.#iNames;
    }
    /**
     * The accumulating property names array length.
     */
    get accumulatingLength() {
        return Array.isArray(this.#aNames) ? this.#aNames.length : 0;
    }
    /**
     * The accumulating property names array.
     */
    get accumulatingNames() {
        return this.#aNames;
    }
    /**
     * The status property names array length.
     */
    get statusLength() {
        return Array.isArray(this.#sNames) ? this.#sNames.length : 0;
    }
    /**
     * The status property names array.
     */
    get statusNames() {
        return this.#sNames;
    }
    /**
     * The total number of instantaneous, accumulating, and status property names.
     */
    get propertyNamesLength() {
        return (this.instantaneousLength +
            this.accumulatingLength +
            this.statusLength);
    }
    /**
     * Get all stream property names, in order of instantaneous, accumulating, and status.
     */
    get propertyNames() {
        const len = this.propertyNamesLength;
        if (len < 1) {
            return undefined;
        }
        let names = [];
        if (this.instantaneousLength > 0) {
            names = names.concat(this.#iNames);
        }
        if (this.accumulatingLength > 0) {
            names = names.concat(this.#aNames);
        }
        if (this.statusLength > 0) {
            names = names.concat(this.#sNames);
        }
        return names;
    }
    /**
     * Get the property names for a given samples type.
     * @param samplesType - the type of property names to return; `Tag` is not supported
     * @returns the property names for the given type, or `undefined` if none available
     */
    propertyNamesForType(samplesType) {
        if (DatumSamplesTypes.Instantaneous.equals(samplesType)) {
            return this.#iNames;
        }
        else if (DatumSamplesTypes.Accumulating.equals(samplesType)) {
            return this.#aNames;
        }
        else if (DatumSamplesTypes.Status.equals(samplesType)) {
            return this.#sNames;
        }
        return undefined;
    }
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
    toJsonObject() {
        const result = {
            streamId: this.#streamId,
            zone: this.#zone,
            kind: this.#kind.key,
            objectId: this.#objectId,
            sourceId: this.#sourceId,
        };
        if (this.instantaneousLength > 0) {
            result.i = this.#iNames;
        }
        if (this.accumulatingLength > 0) {
            result.a = this.#aNames;
        }
        if (this.statusLength > 0) {
            result.s = this.#sNames;
        }
        return result;
    }
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
    toJsonEncoding() {
        return JSON.stringify(this.toJsonObject());
    }
    /**
     * Parse a JSON string into a {@link Domain.DatumStreamMetadata} instance.
     *
     * The JSON must be encoded the same way {@link Domain.DatumStreamMetadata#toJsonEncoding} does.
     *
     * @param json - the JSON to parse
     * @returns the stream metadata instance
     */
    static fromJsonEncoding(json) {
        return this.fromJsonObject(JSON.parse(json));
    }
    /**
     * Create a metadata instance from an object parsed from a JSON string.
     *
     * The object must have been parsed from JSON that was encoded the same way
     * {@link Domain.DatumStreamMetadata#toJsonEncoding} does.
     *
     * @param obj the object parsed from JSON
     * @returns the stream metadata instance
     */
    static fromJsonObject(obj) {
        if (!obj) {
            return undefined;
        }
        const kind = DatumStreamType.valueOf(obj.kind) ||
            DatumStreamTypes.Node;
        const i = Array.isArray(obj.i) ? obj.i : undefined;
        const a = Array.isArray(obj.a) ? obj.a : undefined;
        const s = Array.isArray(obj.s) ? obj.s : undefined;
        return new DatumStreamMetadata(obj.streamId, obj.zone, kind, obj.objectId, obj.sourceId, i, a, s);
    }
}
//# sourceMappingURL=datumStreamMetadata.js.map