import { Aggregation } from "./aggregation.js";
import { DatumStreamType, default as DatumStreamTypes, } from "./datumStreamType.js";
import { timestampFormat } from "../util/dates.js";
/**
 * A general datum identifier class.
 *
 * A datum identifier must be _fully specified_ to be valid. A fully specified identifier
 * must meet either of these requirements (in addition to having `kind` and `timestamp` values):
 *
 *  * a `streamId` value
 *  * both `objectId` and `sourceId` values
 *
 * The `objectId` plus `sourceId` values together represent an _alias_ for the `streamId`.
 *
 * The absence of an `aggregation` implies "no aggregation", or the `None` aggregation value.
 *
 * Create instances of this class like:
 *
 * ```
 * import { Aggregations, DatumIdentifier } from "solarnetwork-api-core";
 *
 * const ts = new Date();
 * const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
 * const sourceId = "meter/1";
 * const nodeId = 123;
 * const agg = Aggregations.None;
 *
 * // create a node stream style identifier
 * let ident = DatumIdentifier.nodeId(ts, streamId);
 *
 * // create a node and source style identifier
 * let ident = DatumIdentifier.nodeId(ts, sourceId, nodeId);
 *
 * // create a full stream and node and source style identifier
 * let ident = DatumIdentifier.nodeId(ts, sourceId, nodeId, agg, streamId);
 * ```
 */
export default class DatumIdentifier {
    /** The datum stream kind (node, location). */
    kind;
    /** The datum creation/capture date. */
    timestamp;
    /** The datum stream ID. */
    streamId;
    /** The object ID (node, location). */
    objectId;
    /** The source ID. */
    sourceId;
    /** The aggregation. */
    aggregation;
    /**
     * Constructor.
     *
     * @param kind the datum kind, or kind key or name value
     * @param timestamp the datum timestamp, either as a `Date` instance or a form suitable for constructing as `new Date(ts)`
     * @param streamOrSourceId the datum stream ID, if `objectId` is not a `number`; otherwise the source ID
     * @param objectIdOrAgg the datum object ID or an aggregation
     * @param aggregation the aggregation
     * @param streamId if `streamOrSourceId` and `objectIdOrAgg` are treated as source and object IDs, respectively,
     *                 then the stream ID can be provided explicitly so all ID values are included
     */
    constructor(kind, timestamp, streamOrSourceId, objectIdOrAgg, aggregation, streamId) {
        const k = kind instanceof DatumStreamType
            ? kind
            : DatumStreamType.valueOf(kind);
        this.kind = k !== undefined ? k : DatumStreamTypes.Node;
        // if a string date provided but the string is not a valid date set timestamp to undefined
        const ts = timestamp instanceof Date ? timestamp : new Date(timestamp);
        this.timestamp = !isNaN(ts.getTime()) ? ts : undefined;
        if (typeof objectIdOrAgg === "number") {
            this.sourceId = streamOrSourceId;
            this.objectId = objectIdOrAgg;
            this.aggregation =
                aggregation instanceof Aggregation ? aggregation : undefined;
            this.streamId = streamId;
        }
        else {
            this.streamId = streamOrSourceId;
            this.aggregation =
                objectIdOrAgg instanceof Aggregation
                    ? objectIdOrAgg
                    : aggregation !== undefined
                        ? aggregation
                        : undefined;
        }
        if (this.constructor === DatumIdentifier) {
            Object.freeze(this);
        }
    }
    /**
     * Test if this identifier is fully specified.
     *
     * A datum identifier is considered fully specified if all of the following are true:
     *
     *  * the `kind` and `timestamp` properties are defined
     *  * the `streamId` property is defined, **or** both the `objectId` and `sourceId` properties are defined
     *
     * In essence, there are two _styles_ of datum identifier:
     *
     *  1. using a stream ID
     *  2. using an object and source ID pair
     *
     * An object and source ID pair are _alises_ for a corresponding stream ID, but are often more
     * convenient for people to use.
     *
     * @return `true` if this identifier if fully specified
     */
    isFullySpecified() {
        return (this.kind !== undefined &&
            this.timestamp !== undefined &&
            (this.streamId !== undefined ||
                (this.objectId !== undefined && this.sourceId !== undefined)));
    }
    /**
     * Get this object as a standard JSON encoded string value.
     *
     * An example result looks like this:
     *
     * ```
     * {
     *   "kind": "n",
     *   "timestamp": "2025-02-01 12:00:00.000Z"
     *   "streamId": "7714f762-2361-4ec2-98ab-7e96807b32a6",
     *   "objectId": 123,
     *   "sourceId": "/power/1",
     *   "aggregation": "None"
     * }
     * ```
     *
     * @return the JSON encoded string
     */
    toJsonEncoding() {
        const result = {
            kind: this.kind.key,
            timestamp: timestampFormat(this.timestamp),
        };
        if (this.streamId !== undefined) {
            result.streamId = this.streamId;
        }
        if (this.objectId !== undefined) {
            result.objectId = this.objectId;
        }
        if (this.sourceId !== undefined) {
            result.sourceId = this.sourceId;
        }
        if (this.aggregation != null) {
            result.aggregation = this.aggregation.name;
        }
        return JSON.stringify(result);
    }
    /**
     * Parse a JSON string into a {@link Domain.DatumIdentifier} instance.
     *
     * The JSON must be encoded the same way {@link Domain.DatumIdentifier#toJsonEncoding} does.
     *
     * @param json the JSON to parse
     * @returns the datum identifier instance, or `undefined` if `json` is `undefined`
     */
    static fromJsonEncoding(json) {
        return this.fromJsonObject(JSON.parse(json));
    }
    /**
     * Create an identifier instance from an object parsed from a JSON string.
     *
     * The object must have been parsed from JSON that was encoded the same way
     * {@link Domain.DatumIdentifier#toJsonEncoding} does.
     *
     * @param obj the object parsed from JSON
     * @returns the datum identifier instance, or `undefined` if `obj` is `undefined`
     */
    static fromJsonObject(obj) {
        if (!obj) {
            return undefined;
        }
        const ts = obj.timestamp;
        const agg = Aggregation.valueOf(obj.aggregation) || undefined;
        return new DatumIdentifier(obj.kind, ts, obj.sourceId, obj.objectId, agg, obj.streamId);
    }
    /**
     * Create a node datum identifier instance.
     *
     * @param timestamp the datum timestamp, either as a `Date` instance or a form suitable for constructing as `new Date(ts)`
     * @param streamOrSourceId the datum stream ID, if `objectId` is not a `number`; otherwise the source ID
     * @param nodeIdOrAgg the datum object ID or an aggregation
     * @param aggregation the aggregation
     * @param streamId if `streamOrSourceId` and `objectIdOrAgg` are treated as source and object IDs, respectively, then the stream ID can be provided explicitly so all ID values are included
     * @returns the new identifier instance
     */
    static nodeId(timestamp, streamOrSourceId, nodeIdOrAgg, aggregation, streamId) {
        return new DatumIdentifier(DatumStreamTypes.Node, timestamp, streamOrSourceId, nodeIdOrAgg, aggregation, streamId);
    }
    /**
     * Create a location datum identifier instance.
     *
     * @param timestamp the datum timestamp, either as a `Date` instance or a form suitable for constructing as `new Date(ts)`
     * @param streamOrSourceId the datum stream ID, if `objectId` is not a `number`; otherwise the source ID
     * @param locationIdOrAgg the datum location ID or an aggregation
     * @param aggregation the aggregation
     * @param streamId if `streamOrSourceId` and `objectIdOrAgg` are treated as source and object IDs, respectively, then the stream ID can be provided explicitly so all ID values are included
     * @returns the new identifier instance
     */
    static locationId(timestamp, streamOrSourceId, locationIdOrAgg, aggregation, streamId) {
        return new DatumIdentifier(DatumStreamTypes.Location, timestamp, streamOrSourceId, locationIdOrAgg, aggregation, streamId);
    }
}
//# sourceMappingURL=datumIdentifier.js.map