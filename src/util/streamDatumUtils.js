import StreamAggregateDatum from "../domain/streamAggregateDatum.js";
import StreamDatum from "../domain/streamDatum.js";
import { AggregateDatum, Datum } from "../domain/streamDatumMetadataMixin.js";

/**
 * Get a datum instance from a stream data array.
 *
 * @param {Array|String} data the datum stream data array (or JSON array value) to create a datum instance
 * @param {module:domain~DatumStreamMetadata|module:util~DatumStreamMetadataRegistry} meta a metadata instance or metadata registry to decode with
 * @returns {module:domain~AggregateDatum|module:domain~Datum} the datum, or `null` if one cannot be created
 * @alias module:util~datumForStreamData
 */
export function datumForStreamData(data, meta) {
	if (typeof data === "string") {
		data = JSON.parse(data);
	}
	if (!Array.isArray(data) || data.length < 2) {
		return null;
	}
	return Array.isArray(data[1])
		? AggregateDatum.fromJsonObject(data, meta)
		: Datum.fromJsonObject(data, meta);
}

/**
 * Get a stream datum instance from a stream data array.
 *
 * @param {Array|String} data the datum stream data array (or JSON array value) to create a datum instance
 * @param {module:domain~DatumStreamMetadata|module:util~DatumStreamMetadataRegistry} meta a metadata instance or metadata registry to decode with
 * @returns {module:domain~StreamAggregateDatum|module:domain~StreamDatum} the datum, or `null` if one cannot be created
 * @alias module:util~streamDatumForData
 */
export function streamDatumForData(data, meta) {
	if (typeof data === "string") {
		data = JSON.parse(data);
	}
	if (!Array.isArray(data) || data.length < 2) {
		return null;
	}
	return Array.isArray(data[1])
		? StreamAggregateDatum.fromJsonObject(data, meta)
		: StreamDatum.fromJsonObject(data, meta);
}

export default Object.freeze({
	datumForStreamData: datumForStreamData,
	streamDatumForData: streamDatumForData,
});
