import DatumStreamMetadata from "./datumStreamMetadata";
import DatumStreamMetadataRegistry from "../util/datumStreamMetadataRegistry";

function pushProperties(result, values) {
	if (!values) {
		return;
	}
	for (let e of values) {
		result.push(e);
	}
}

/**
 * A stream datum entity.
 *
 * A stream datum is a datum without any metadata describing the datum property names.
 * The instantantaneous, accumulating, and status property values are stored as the array
 * fields `iProps`, `aProps`, and `sProps`. A {@link module:domain~DatumStreamMetadata DatumStreamMetadata}
 * object is required to associate names with these arrays.
 *
 * @alias module:domain~StreamDatum
 */
class StreamDatum {
	/**
	 * Constructor.
	 * @param {string} streamId the datum stream ID
	 * @param {Date|number|string} ts the datum timestamp, either as a `Date` instance or a form suitable for constructing as `new Date(ts)`
	 * @param {Number[]} [iProps] the instantaneous property values
	 * @param {Number[]} [aProps] the accumulating property values
	 * @param {String[]} [sProps] the status property values
	 * @param {Set<String>|Array<String>} [tags] the tag values
	 */
	constructor(streamId, ts, iProps, aProps, sProps, tags) {
		this.streamId = streamId;
		this.ts = ts instanceof Date ? ts : new Date(ts);
		this.iProps = iProps;
		this.aProps = aProps;
		this.sProps = sProps;
		this.tags = tags ? (tags instanceof Set ? tags : new Set(tags)) : undefined;
		if (this.constructor === StreamDatum) {
			Object.freeze(this);
		}
	}

	/**
	 * Get this object as a standard JSON encoded string value.
	 *
	 * This method returns the JSON form of the result of {@link module:domain~StreamDatum#toJsonObject StreamDatum#toJsonObject()}.
	 *
	 * @param {module:util~DatumStreamMetadataRegistry} [registry] a stream metadata registry to encode as a registry-indexed stream datum
	 * @return {string} the JSON encoded string
	 */
	toJsonEncoding(registry) {
		return JSON.stringify(this.toJsonObject(registry));
	}

	/**
	 * Get this object as an array suitable for encoding into a standard stream datum JSON string.
	 *
	 * This method can encode the datum into an array using one of two ways, depending on whether the `registry` argument is provided.
	 * When provided, the first array element will be the stream metadata index based on calling
	 * {@link module:util~DatumStreamMetadataRegistry#indexOfMetadataStreamId DatumStreamMetadataRegistry#indexOfMetadataStreamId()}.
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
	 * @param {module:util~DatumStreamMetadataRegistry} [registry] a stream metadata registry to encode as a registry-indexed stream datum
	 * @return {Array} the datum stream array object
	 */
	toJsonObject(registry) {
		const result = [
			registry instanceof DatumStreamMetadataRegistry
				? registry.indexOfMetadataStreamId(this.streamId)
				: this.streamId,
			this.ts.getTime(),
		];
		pushProperties(result, this.iProps);
		pushProperties(result, this.aProps);
		pushProperties(result, this.sProps);
		pushProperties(result, this.tags);
		return result;
	}

	/**
	 * Parse a JSON string into a {@link module:domain~StreamDatum StreamDatum} instance.
	 *
	 * The JSON must be encoded the same way {@link module:domain~StreamDatum#toJsonEncoding StreamDatum#toJsonEncoding()} does.
	 *
	 * @param {string} json the JSON to parse
	 * @param {module:domain~DatumStreamMetadata|module:util~DatumStreamMetadataRegistry} meta a metadata instance or metadata registry to decode with
	 * @returns {module:domain~StreamDatum} the stream datum instance
	 */
	static fromJsonEncoding(json, meta) {
		return this.fromJsonObject(JSON.parse(json), meta);
	}

	/**
	 * Create a new {@link module:domain~StreamDatum StreamDatum} instance from an array parsed from a stream datum JSON string.
	 *
	 * The array must have been parsed from JSON that was encoded the same way {@link module:domain~StreamDatum#toJsonEncoding StreamDatum#toJsonEncoding()} does.
	 *
	 * @param {Array} data the array parsed from JSON
	 * @param {module:domain~DatumStreamMetadata|module:util~DatumStreamMetadataRegistry} meta a metadata instance or metadata registry to decode with
	 * @returns {module:domain~StreamDatum} the stream datum instance
	 */
	static fromJsonObject(data, meta) {
		let i, len, m, ts, iProps, aProps, sProps, tags;
		if (Array.isArray(data) && data.length > 1) {
			if (typeof data[0] === "string") {
				// treat as an embedded stream ID stream datum
				m = meta instanceof DatumStreamMetadata ? meta : meta.metadataForStreamId(data[0]);
			} else {
				// treat as a registry-indexed stream datum
				m = meta instanceof DatumStreamMetadata ? meta : meta.metadataAt(data[0]);
			}
			ts = new Date(data[1]);
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
			return new StreamDatum(m.streamId, ts, iProps, aProps, sProps, tags);
		}
		return null;
	}
}

export default StreamDatum;
