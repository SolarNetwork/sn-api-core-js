import { DatumStreamType, default as DatumStreamTypes } from "./datumStreamType";
import DatumSamplesTypes from "./datumSamplesType";

/**
 * Metadata about a datum stream.
 *
 * @alias module:domain~DatumStreamMetadata
 */
class DatumStreamMetadata {
	/**
	 * Constructor.
	 * @param {string} streamId         the stream ID
	 * @param {string} zone             the time zone ID
	 * @param {DatumStreamType} kind    the stream type
	 * @param {number} objectId         the node or location ID
	 * @param {string} sourceId         the source ID
	 * @param {string[]} iNames         the instantaneous property name array
	 * @param {string[]} aNames         the accumulating property name array
	 * @param {string[]} sNames         the status property name array
	 */
	constructor(streamId, zone, kind, objectId, sourceId, iNames, aNames, sNames) {
		this._streamId = streamId;
		this._zone = zone;
		this._kind = kind instanceof DatumStreamType ? kind : DatumStreamTypes.Node;
		this._objectId = objectId;
		this._sourceId = sourceId;
		this._iNames = Array.isArray(iNames) ? iNames : undefined;
		this._aNames = Array.isArray(aNames) ? aNames : undefined;
		this._sNames = Array.isArray(sNames) ? sNames : undefined;
		if (this.constructor === DatumStreamMetadata) {
			Object.freeze(this);
		}
	}

	/**
	 * Create a new node datum stream metadata instance.
	 * @param {string} streamId         the stream ID
	 * @param {string} zone             the time zone ID
	 * @param {number} nodeId           the node ID
	 * @param {string} sourceId         the source ID
	 * @param {string[]} iNames         the instantaneous property name array
	 * @param {string[]} aNames         the accumulating property name array
	 * @param {string[]} sNames         the status property name array
	 * @returns {DatumStreamMetadata} the new metadata instance
	 */
	static nodeMetadata(streamId, zone, nodeId, sourceId, iNames, aNames, sNames) {
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
	 * @param {string} streamId         the stream ID
	 * @param {string} zone             the time zone ID
	 * @param {number} locationId       the location ID
	 * @param {string} sourceId         the source ID
	 * @param {string[]} iNames         the instantaneous property name array
	 * @param {string[]} aNames         the accumulating property name array
	 * @param {string[]} sNames         the status property name array
	 * @returns {DatumStreamMetadata} the new metadata instance
	 */
	static locationMetadata(streamId, zone, locationId, sourceId, iNames, aNames, sNames) {
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
	 * @type {string}
	 */
	get streamId() {
		return this._streamId;
	}

	/**
	 * The stream time zone ID, for example `Pacific/Auckland`.
	 * @type {string}
	 */
	get timeZoneId() {
		return this._zone;
	}

	/**
	 * The stream type.
	 * @type {DatumStreamType}
	 */
	get kind() {
		return this._kind;
	}

	/**
	 * The stream objece (node or location) ID.
	 * @type {number}
	 */
	get objectId() {
		return this._objectId;
	}

	/**
	 * Get the stream object ID (if the `kind` is `Node`), otherwise `null`.
	 * @type {number}
	 */
	get nodeId() {
		return DatumStreamTypes.Node.equals(this._kind) ? this._objectId : null;
	}

	/**
	 * Get the stream object ID (if the `kind` is `Location`), otherewise `null`.
	 * @type {number}
	 */
	get locationId() {
		return DatumStreamTypes.Location.equals(this._kind) ? this._objectId : null;
	}

	/**
	 * Get the stream source ID.
	 * @type {string}
	 */
	get sourceId() {
		return this._sourceId;
	}

	/**
	 * Get the instantaneous property names array length.
	 *
	 * @returns {number} the number of instantaneous property names
	 */
	get instantaneousLength() {
		return Array.isArray(this._iNames) ? this._iNames.length : 0;
	}

	/**
	 * Get the accumulating property names array length.
	 *
	 * @returns {number} the number of accumulating property names
	 */
	get accumulatingLength() {
		return Array.isArray(this._aNames) ? this._aNames.length : 0;
	}

	/**
	 * Get the status property names array length.
	 *
	 * @returns {number} the number of status property names
	 */
	get statusLength() {
		return Array.isArray(this._sNames) ? this._sNames.length : 0;
	}

	/**
	 * Get the total number of instantaneous, accumulating, and status property
	 * names.
	 *
	 * @returns {number} the total number of properties
	 */
	get propertyNamesLength() {
		return this.instantaneousLength + this.accumulatingLength + this.statusLength;
	}

	/**
	 * Get all stream property names, in order of instantaneous, accumulating, and status.
	 * @type {string[]}
	 */
	get propertyNames() {
		const len = this.propertyNamesLength;
		if (len < 1) {
			return null;
		}
		let names = [];
		if (this.instantaneousLength > 0) {
			names = names.concat(this._iNames);
		}
		if (this.accumulatingLength > 0) {
			names = names.concat(this._aNames);
		}
		if (this.statusLength > 0) {
			names = names.concat(this._sNames);
		}
		return names;
	}

	/**
	 * Get the property names for a given samples type.
	 * @param {DatumSamplesType} samplesType the type of property names to return; `Tag` is not supported
	 * @returns {string[]} the property names for the given type, or `null` if none available
	 */
	propertyNamesForType(samplesType) {
		if (DatumSamplesTypes.Instantaneous.equals(samplesType)) {
			return this._iNames;
		} else if (DatumSamplesTypes.Accumulating.equals(samplesType)) {
			return this._aNames;
		} else if (DatumSamplesTypes.Status.equals(samplesType)) {
			return this._sNames;
		}
		return null;
	}

	/**
	 * Get this object as a standard JSON encoded string value.
	 *
	 * @return {string} the JSON encoded string
	 */
	toJsonEncoding() {
		const result = {
			streamId: this._streamId,
			zone: this._zone,
			kind: this._kind ? this._kind.key : DatumSamplesTypes.Node.key,
			objectId: this._objectId,
			sourceId: this._sourceId
		};
		if (this.instantaneousLength > 0) {
			result.i = this._iNames;
		}
		if (this.accumulatingLength > 0) {
			result.a = this._aNames;
		}
		if (this.statusLength > 0) {
			result.s = this._sNames;
		}
		return JSON.stringify(result);
	}

	/**
	 * Parse a JSON string into a {@link module:domain~DatumStreamMetadata} instance.
	 *
	 * The JSON must be encoded the same way {@link module:domain~DatumStreamMetadata#toJsonEncoding} does.
	 *
	 * @param {string} json the JSON to parse
	 * @returns {module:domain~DatumStreamMetadata} the stream metadata instance
	 */
	static fromJsonEncoding(json) {
		return this.fromJsonObject(JSON.parse(json));
	}

	/**
	 * Parse an object parsed from a JSON string into a {@link module:domain~DatumStreamMetadata} instance.
	 *
	 * The object must have been parsed from JSON that was encoded the same way {@link module:domain~DatumStreamMetadata#toJsonEncoding} does.
	 *
	 * @param {string} obj the object parsed from JSON
	 * @returns {module:domain~DatumStreamMetadata} the stream metadata instance
	 */
	static fromJsonObject(obj) {
		let kind, i, a, s;
		if (obj) {
			kind = DatumStreamType.valueOf(obj.kind);
			i = Array.isArray(obj.i) ? obj.i : undefined;
			a = Array.isArray(obj.a) ? obj.a : undefined;
			s = Array.isArray(obj.s) ? obj.s : undefined;
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
		return null;
	}
}

export default DatumStreamMetadata;
