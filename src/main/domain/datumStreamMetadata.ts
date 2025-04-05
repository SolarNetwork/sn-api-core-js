import {
	DatumStreamType,
	default as DatumStreamTypes,
} from "./datumStreamType.js";
import DatumSamplesTypes, { DatumSamplesType } from "./datumSamplesType.js";
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
	#streamId: string;
	#zone: string;
	#kind: DatumStreamType;
	#objectId: number;
	#sourceId: string;
	#iNames?: string[];
	#aNames?: string[];
	#sNames?: string[];

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
	constructor(
		streamId: string,
		zone: string,
		kind: DatumStreamType,
		objectId: number,
		sourceId: string,
		iNames?: string[],
		aNames?: string[],
		sNames?: string[]
	) {
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
	static nodeMetadata(
		streamId: string,
		zone: string,
		nodeId: number,
		sourceId: string,
		iNames?: string[],
		aNames?: string[],
		sNames?: string[]
	): DatumStreamMetadata {
		return new DatumStreamMetadata(
			streamId,
			zone,
			DatumStreamTypes.Node,
			nodeId,
			sourceId,
			iNames,
			aNames,
			sNames
		);
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
	static locationMetadata(
		streamId: string,
		zone: string,
		locationId: number,
		sourceId: string,
		iNames?: string[],
		aNames?: string[],
		sNames?: string[]
	): DatumStreamMetadata {
		return new DatumStreamMetadata(
			streamId,
			zone,
			DatumStreamTypes.Location,
			locationId,
			sourceId,
			iNames,
			aNames,
			sNames
		);
	}

	/**
	 * The stream ID, for example `7714f762-2361-4ec2-98ab-7e96807b32a6`.
	 */
	get streamId(): string {
		return this.#streamId;
	}

	/**
	 * The stream time zone ID, for example `Pacific/Auckland`.
	 */
	get timeZoneId(): string {
		return this.#zone;
	}

	/**
	 * The stream type.
	 */
	get kind(): DatumStreamType {
		return this.#kind;
	}

	/**
	 * The stream objece (node or location) ID.
	 */
	get objectId(): number {
		return this.#objectId;
	}

	/**
	 * The stream object ID (if the `kind` is `Node`), otherwise `undefined`.
	 */
	get nodeId(): number | undefined {
		return DatumStreamTypes.Node.equals(this.#kind)
			? this.#objectId
			: undefined;
	}

	/**
	 * The stream object ID (if the `kind` is `Location`), otherewise `undefined`.
	 */
	get locationId(): number | undefined {
		return DatumStreamTypes.Location.equals(this.#kind)
			? this.#objectId
			: undefined;
	}

	/**
	 * The stream source ID.
	 */
	get sourceId(): string {
		return this.#sourceId;
	}

	/**
	 * The instantaneous property names array length.
	 */
	get instantaneousLength(): number {
		return Array.isArray(this.#iNames) ? this.#iNames.length : 0;
	}

	/**
	 * The instantaneous property names array.
	 */
	get instantaneousNames(): string[] | undefined {
		return this.#iNames;
	}

	/**
	 * The accumulating property names array length.
	 */
	get accumulatingLength(): number {
		return Array.isArray(this.#aNames) ? this.#aNames.length : 0;
	}

	/**
	 * The accumulating property names array.
	 */
	get accumulatingNames(): string[] | undefined {
		return this.#aNames;
	}

	/**
	 * The status property names array length.
	 */
	get statusLength(): number {
		return Array.isArray(this.#sNames) ? this.#sNames.length : 0;
	}

	/**
	 * The status property names array.
	 */
	get statusNames(): string[] | undefined {
		return this.#sNames;
	}

	/**
	 * The total number of instantaneous, accumulating, and status property names.
	 */
	get propertyNamesLength(): number {
		return (
			this.instantaneousLength +
			this.accumulatingLength +
			this.statusLength
		);
	}

	/**
	 * Get all stream property names, in order of instantaneous, accumulating, and status.
	 */
	get propertyNames(): string[] | undefined {
		const len = this.propertyNamesLength;
		if (len < 1) {
			return undefined;
		}
		let names = [] as string[];
		if (this.instantaneousLength > 0) {
			names = names.concat(this.#iNames as string[]);
		}
		if (this.accumulatingLength > 0) {
			names = names.concat(this.#aNames as string[]);
		}
		if (this.statusLength > 0) {
			names = names.concat(this.#sNames as string[]);
		}
		return names;
	}

	/**
	 * Get the property names for a given samples type.
	 * @param samplesType - the type of property names to return; `Tag` is not supported
	 * @returns the property names for the given type, or `undefined` if none available
	 */
	propertyNamesForType(samplesType: DatumSamplesType): string[] | undefined {
		if (DatumSamplesTypes.Instantaneous.equals(samplesType)) {
			return this.#iNames;
		} else if (DatumSamplesTypes.Accumulating.equals(samplesType)) {
			return this.#aNames;
		} else if (DatumSamplesTypes.Status.equals(samplesType)) {
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
	toJsonObject(): DatumStreamMetadataInfo {
		const result = {
			streamId: this.#streamId,
			zone: this.#zone,
			kind: this.#kind.key,
			objectId: this.#objectId,
			sourceId: this.#sourceId,
		} as DatumStreamMetadataInfo;
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
	toJsonEncoding(): string {
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
	static fromJsonEncoding(json: string): DatumStreamMetadata | undefined {
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
	static fromJsonObject(
		obj: DatumStreamMetadataInfo
	): DatumStreamMetadata | undefined {
		if (!obj) {
			return undefined;
		}
		const kind =
			(DatumStreamType.valueOf(obj.kind) as DatumStreamType) ||
			DatumStreamTypes.Node;
		const i = Array.isArray(obj.i) ? obj.i : undefined;
		const a = Array.isArray(obj.a) ? obj.a : undefined;
		const s = Array.isArray(obj.s) ? obj.s : undefined;
		return new DatumStreamMetadata(
			obj.streamId,
			obj.zone,
			kind,
			obj.objectId,
			obj.sourceId,
			i,
			a,
			s
		);
	}
}
