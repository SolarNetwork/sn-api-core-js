import DatumStreamMetadata from "./datumStreamMetadata.js";
import StreamDatum from "./streamDatum.js";
import StreamAggregateDatum from "./streamAggregateDatum.js";

/**
 * Create a StreamDatumMetadataMixin class.
 *
 * @param {module:domain~StreamAggregateDatum|module:domain~StreamDatum} superclass the stream datum class to mix onto
 * @return {module:domain~StreamDatumMetadataMixin} the mixin class
 */
const StreamDatumMetadataMixin = (superclass) =>
	/**
	 * A mixin class that adds datum stream metadata support to a {@link module:domain~StreamDatum StreamDatum}
	 * or {@link module:domain~StreamAggregateDatum StreamAggregateDatum}.
	 *
	 * @mixin
	 * @alias module:domain~StreamDatumMetadataMixin
	 */
	class extends superclass {
		/**
		 * Constructor.
		 * @param {string} streamId the datum stream ID
		 * @param {Date|number|string} ts the datum timestamp, either as a `Date` instance or a form suitable for constructing as `new Date(ts)`
		 * @param {Number[]} [iProps] the instantaneous property values
		 * @param {Number[]} [aProps] the accumulating property values
		 * @param {String[]} [sProps] the status property values
		 * @param {Set<String>|Array<String>} [tags] the tag values
		 * @param {module:domain~DatumStreamMetadata} meta the datum stream metadata
		 */
		constructor(...args) {
			super(...args);
			if (args.length > 0 && args[args.length - 1] instanceof DatumStreamMetadata) {
				this._meta = args[args.length - 1];
			}
			Object.freeze(this);
		}

		/**
		 * Get the stream metadata.
		 * @type {module:domain~DatumStreamMetadata}
		 */
		get metadata() {
			return this._meta;
		}

		/**
		 * Get this instance as a simple object.
		 *
		 * This method uses the metadata passed to the constructor to generate the object.
		 *
		 * @param {boolean} [withoutStatistics] `true` to omit statistic properties
		 * @returns {Object} an object populated with all available properties
		 * @see module:domain~StreamDatum#toObject
		 * @see module:domain~StreamAggregateDatum#toObject
		 */
		toObject(withoutStatistics) {
			return super.toObject(this._meta, withoutStatistics);
		}
	};

/**
 * A concrete {@link module:domain~StreamDatumMetadataMixin StreamDatumMetadataMixin} of {@link module:domain~StreamAggregateDatum StreamAggregateDatum}.
 *
 * @mixes module:domain~StreamDatumMetadataMixin
 * @extends module:domain~StreamAggregateDatum
 * @alias module:domain~AggregateDatum
 */
class AggregateDatum extends StreamDatumMetadataMixin(StreamAggregateDatum) {}

/**
 * A concrete {@link module:domain~StreamDatumMetadataMixin StreamDatumMetadataMixin} of {@link module:domain~StreamDatum StreamDatum}.
 *
 * @mixes module:domain~StreamDatumMetadataMixin
 * @extends module:domain~StreamDatum
 * @alias module:domain~Datum
 */
class Datum extends StreamDatumMetadataMixin(StreamDatum) {}

export default StreamDatumMetadataMixin;
export { AggregateDatum, Datum };
