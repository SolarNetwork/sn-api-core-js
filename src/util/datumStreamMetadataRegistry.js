import DatumStreamMetadata from "../domain/datumStreamMetadata";

/**
 * A registry of datum stream metadata instances for object (node or location) and source ID combinations.
 *
 * This registry acts like a map of (stream ID) -> metadata as well as (object ID, source ID) -> metadata.
 *
 * @alias module:util~DatumStreamMetadataRegistry
 */
class DatumStreamMetadataRegistry {
	/**
	 * Constructor.
	 * @param {DatumStreamMetadata[]} [metas] optional list of metadata to start with
	 */
	constructor(metas) {
		this._metaList = Array.isArray(metas) ? metas : [];
		this._metaMap = new Map();
		for (const e of this._metaList) {
			if (e instanceof DatumStreamMetadata) {
				this._metaMap.set(e.streamId, e);
			}
		}
	}

	/**
	 * Add metadata to the registry.
	 * @param {DatumStreamMetadata} meta the metadata to add to the registry
	 * @returns {DatumStreamMetadata} this object
	 */
	addMetadata(meta) {
		if (meta instanceof DatumStreamMetadata && meta.streamId) {
			this._metaList.push(meta);
			this._metaMap.set(meta.streamId, meta);
		}
		return this;
	}

	/**
	 * Get a set of all available stream IDs.
	 * @returns {Set<string>} all available metadata stream ID values
	 */
	metadataStreamIds() {
		return new Set(this._metaMap.keys());
	}

	/**
	 * Get the metadata at a specific index, based on insertion order.
	 * @param {number} index the index of the metadata to get
	 * @returns {DatumStreamMetadata} the metadata at the given index, or `undefined`
	 */
	metadataAt(index) {
		return index < this._metaList.length ? this._metaList[index] : undefined;
	}

	/**
	 * Get the index of the metadata with a specific stream ID.
	 * @param {string} streamId the stream ID to get the index of
	 * @returns {number} the found index, or `-1` if not found
	 */
	indexOfMetadataStreamId(streamId) {
		let i = 0;
		for (const meta of this._metaList) {
			if (meta.streamId === streamId) {
				return i;
			}
			i += 1;
		}
		return -1;
	}

	/**
	 * Get a list of all available stream IDs in insertion order.
	 * @returns {string[]} all available metadata stream ID values in the same order as added to this registry
	 */
	metadataStreamIdsList() {
		return this._metaList.map(e => e.streamId);
	}

	/**
	 * Get the metadta for a given stream ID.
	 * @param {string} streamId the stream ID of the metadata to get
	 * @returns {DatumStreamMetadata} the associated metadata, or `undefined` if none available
	 */
	metadataForStreamId(streamId) {
		return this._metaMap.get(streamId);
	}

	/**
	 * Get the first available metadata for a given object and source ID combination.
	 * @param {number} objectId the object ID of the metadata to get
	 * @param {string} sourceId  the source ID of the metadata to get
	 * @returns {DatumStreamMetadata} the associated metadata, or `undefined` if none available
	 */
	metadataForObjectSource(objectId, sourceId) {
		for (const meta of this._metaMap.values()) {
			if (meta.objectId === objectId && meta.sourceId == sourceId) {
				return meta;
			}
		}
		return undefined;
	}

	/**
	 * Get this object as a standard JSON encoded string value.
	 *
	 * The returned JSON is an array of the {@link module:domain~DatumStreamMetadata#toJsonEncoding} result
	 * of all metadata in the registry.
	 *
	 * @return {string} the JSON encoded string
	 */
	toJsonEncoding() {
		let json = "[";
		for (let meta of this._metaList) {
			if (json.length > 1) {
				json += ",";
			}
			json += meta.toJsonEncoding();
		}
		json += "]";
		return json;
	}

	/**
	 * Parse a JSON string into a {@link module:domain~DatumStreamMetadataRegistry} instance.
	 *
	 * The JSON must be encoded the same way {@link module:domain~DatumStreamMetadataRegistry#toJsonEncoding} does.
	 *
	 * @param {string} json the JSON to parse
	 * @returns {module:domain~DatumStreamMetadataRegistry} the stream metadata registry instance
	 */
	static fromJsonEncoding(json) {
		if (json) {
			const obj = JSON.parse(json);
			if (Array.isArray(obj)) {
				const reg = new DatumStreamMetadataRegistry();
				for (let e of obj) {
					let meta = DatumStreamMetadata.fromJsonObject(e);
					if (meta) {
						reg.addMetadata(meta);
					}
				}
				return reg;
			}
		}
		return null;
	}
}

export default DatumStreamMetadataRegistry;
