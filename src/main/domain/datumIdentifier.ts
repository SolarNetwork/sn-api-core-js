import { Aggregation } from "./aggregation.js";
import {
	DatumStreamType,
	default as DatumStreamTypes,
} from "./datumStreamType.js";
import { timestampFormat } from "../util/dates.js";
import JsonEncodable from "../util/jsonEncodable.js";

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
export default class DatumIdentifier implements JsonEncodable {
	/** The datum stream kind (node, location). */
	readonly kind: DatumStreamType;

	/** The datum creation/capture date. */
	readonly timestamp: Date;

	/** The datum stream ID. */
	readonly streamId?: string;

	/** The object ID (node, location). */
	readonly objectId?: number;

	/** The source ID. */
	readonly sourceId?: string;

	/** The aggregation. */
	readonly aggregation?: Aggregation;

	/**
	 * Construct a stream ID style identifier.
	 *
	 * @param kind the datum kind, or kind key or name value
	 * @param timestamp the datum timestamp, either as a `Date` instance or a form suitable for constructing as `new Date(ts)`
	 * @param streamId the datum stream ID
	 * @param aggregation the aggregation
	 */
	constructor(
		kind: DatumStreamType,
		timestamp: Date | number | string,
		streamId: string,
		aggregation?: Aggregation
	);

	/**
	 * Construct an object and source ID style identifier.
	 *
	 * @param kind the datum kind, or kind key or name value
	 * @param timestamp the datum timestamp, either as a `Date` instance or a form suitable for constructing as `new Date(ts)`
	 * @param sourceId the datum source ID
	 * @param objectId  the datum object ID
	 * @param aggregation the aggregation
	 */
	constructor(
		kind: DatumStreamType,
		timestamp: Date | number | string,
		sourceId: string,
		objectId: number,
		aggregation?: Aggregation
	);

	/**
	 * Construct an object and source ID style identifier along with a stream ID.
	 *
	 * @param kind the datum kind, or kind key or name value
	 * @param timestamp the datum timestamp, either as a `Date` instance or a form suitable for constructing as `new Date(ts)`
	 * @param sourceId the datum source ID
	 * @param objectId  the datum object ID
	 * @param aggregation the aggregation
	 * @param streamId the datum stream ID
	 */
	constructor(
		kind: DatumStreamType | string,
		timestamp: Date | number | string,
		sourceId: string,
		objectId: number,
		aggregation?: Aggregation,
		streamId?: string
	);

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
	constructor(
		kind: DatumStreamType | string,
		timestamp: Date | number | string,
		streamOrSourceId: string,
		objectIdOrAgg?: number | Aggregation,
		aggregation?: Aggregation,
		streamId?: string
	) {
		const k =
			kind instanceof DatumStreamType
				? kind
				: (DatumStreamType.valueOf(kind) as
						| DatumStreamType
						| undefined);
		this.kind = k !== undefined ? k : DatumStreamTypes.Node;

		// if a string date provided but the string is not a valid date set timestamp to undefined
		const ts = timestamp instanceof Date ? timestamp : new Date(timestamp);

		this.timestamp = !isNaN(ts.getTime()) ? ts : (undefined as any);
		if (typeof objectIdOrAgg === "number") {
			this.sourceId = streamOrSourceId;
			this.objectId = objectIdOrAgg;
			this.aggregation =
				aggregation instanceof Aggregation ? aggregation : undefined;
			this.streamId = streamId;
		} else {
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
	isFullySpecified(): boolean {
		return (
			this.kind !== undefined &&
			this.timestamp !== undefined &&
			(this.streamId !== undefined ||
				(this.objectId !== undefined && this.sourceId !== undefined))
		);
	}

	/**
	 * Get this object in standard JSON form.
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
	 * @return an object, ready for JSON encoding
	 */
	toJsonObject(): Record<string, any> {
		const result = {
			kind: this.kind.key,
			timestamp: timestampFormat(this.timestamp),
		} as any;
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
		return result;
	}

	/**
	 * Get this object as a standard JSON encoded string value.
	 *
	 * This method calls {@link Domain.DatumIdentifier#toJsonEncoding} and then
	 * turns that into a JSON string.
	 *
	 * @return the JSON encoded string
	 * @see {@link Domain.DatumIdentifier#toJsonObject}
	 */
	toJsonEncoding(): string {
		return JSON.stringify(this.toJsonObject());
	}

	/**
	 * Parse a JSON string into a {@link Domain.DatumIdentifier} instance.
	 *
	 * The JSON must be encoded the same way {@link Domain.DatumIdentifier#toJsonEncoding} does.
	 *
	 * @param json the JSON to parse
	 * @returns the datum identifier instance, or `undefined` if `json` is `undefined`
	 */
	static fromJsonEncoding(json: string): DatumIdentifier | undefined {
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
	static fromJsonObject(obj: any): DatumIdentifier | undefined {
		if (!obj) {
			return undefined;
		}
		const ts = obj.timestamp as Date | string;
		const agg =
			(Aggregation.valueOf(obj.aggregation) as Aggregation) || undefined;
		return new DatumIdentifier(
			obj.kind as string,
			ts,
			obj.sourceId as string,
			obj.objectId as number,
			agg,
			obj.streamId as string
		);
	}

	/**
	 * Create a stream ID style identifier.
	 *
	 * @param timestamp the datum timestamp, either as a `Date` instance or a form suitable for constructing as `new Date(ts)`
	 * @param streamId the datum stream ID
	 * @param aggregation the aggregation
	 */
	static nodeId(
		timestamp: Date | number | string,
		streamId: string,
		aggregation?: Aggregation
	): DatumIdentifier;

	/**
	 * Create a node and source ID style identifier.
	 *
	 * @param timestamp the datum timestamp, either as a `Date` instance or a form suitable for constructing as `new Date(ts)`
	 * @param sourceId the datum source ID
	 * @param nodeId  the datum node ID
	 * @param aggregation the aggregation
	 */
	static nodeId(
		timestamp: Date | number | string,
		sourceId: string,
		nodeId: number,
		aggregation?: Aggregation
	): DatumIdentifier;

	/**
	 * Create a node and source ID style identifier along with a stream ID.
	 *
	 * @param timestamp the datum timestamp, either as a `Date` instance or a form suitable for constructing as `new Date(ts)`
	 * @param sourceId the datum source ID
	 * @param nodeId  the datum node ID
	 * @param aggregation the aggregation
	 * @param streamId the datum stream ID
	 */
	static nodeId(
		timestamp: Date | number | string,
		sourceId: string,
		nodeId: number,
		aggregation?: Aggregation,
		streamId?: string
	): DatumIdentifier;

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
	static nodeId(
		timestamp: Date | number | string,
		streamOrSourceId: string,
		nodeIdOrAgg?: number | Aggregation,
		aggregation?: Aggregation,
		streamId?: string
	): DatumIdentifier {
		return new DatumIdentifier(
			DatumStreamTypes.Node,
			timestamp,
			streamOrSourceId,
			nodeIdOrAgg as any,
			aggregation,
			streamId
		);
	}

	/**
	 * Create a location stream ID style identifier.
	 *
	 * @param timestamp the datum timestamp, either as a `Date` instance or a form suitable for constructing as `new Date(ts)`
	 * @param streamId the datum stream ID
	 * @param aggregation the aggregation
	 */
	static locationId(
		timestamp: Date | number | string,
		streamId: string,
		aggregation?: Aggregation
	): DatumIdentifier;

	/**
	 * Create a location and source ID style identifier.
	 *
	 * @param timestamp the datum timestamp, either as a `Date` instance or a form suitable for constructing as `new Date(ts)`
	 * @param sourceId the datum source ID
	 * @param locationId  the datum location ID
	 * @param aggregation the aggregation
	 */
	static locationId(
		timestamp: Date | number | string,
		sourceId: string,
		locationId: number,
		aggregation?: Aggregation
	): DatumIdentifier;

	/**
	 * Create a location and source ID style identifier along with a stream ID.
	 *
	 * @param timestamp the datum timestamp, either as a `Date` instance or a form suitable for constructing as `new Date(ts)`
	 * @param sourceId the datum source ID
	 * @param locationId  the datum location ID
	 * @param aggregation the aggregation
	 * @param streamId the datum stream ID
	 */
	static locationId(
		timestamp: Date | number | string,
		sourceId: string,
		locationId: number,
		aggregation?: Aggregation,
		streamId?: string
	): DatumIdentifier;

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
	static locationId(
		timestamp: Date | number | string,
		streamOrSourceId: string,
		locationIdOrAgg?: number | Aggregation,
		aggregation?: Aggregation,
		streamId?: string
	): DatumIdentifier {
		return new DatumIdentifier(
			DatumStreamTypes.Location,
			timestamp,
			streamOrSourceId,
			locationIdOrAgg as any,
			aggregation,
			streamId
		);
	}
}
