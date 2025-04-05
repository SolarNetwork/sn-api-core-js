import {
	default as DatumStreamMetadata,
	DatumStreamMetadataInfo,
} from "../domain/datumStreamMetadata.js";
import { DatumStreamType } from "../domain/datumStreamType.js";

/**
 * A registry of datum stream metadata instances for object (node or location) and source ID combinations.
 *
 * This registry acts like a map of (stream ID) -> metadata as well as (object ID, source ID) -> metadata.
 */
class DatumStreamMetadataRegistry {
	/** The metadata. */
	readonly #metaList: DatumStreamMetadata[];

	/** A map of stream ID to associated metadata. */
	readonly #metaMap: Map<string, DatumStreamMetadata>;

	/**
	 * Constructor.
	 * @param metas - optional list of metadata to start with
	 */
	constructor(metas?: DatumStreamMetadata[]) {
		this.#metaList = Array.isArray(metas) ? metas : [];
		this.#metaMap = new Map();
		for (const e of this.#metaList) {
			if (e instanceof DatumStreamMetadata) {
				this.#metaMap.set(e.streamId, e);
			}
		}
	}

	/**
	 * Add metadata to the registry.
	 * @param meta - the metadata to add to the registry
	 * @returns this object
	 */
	addMetadata(meta: DatumStreamMetadata): this {
		if (meta instanceof DatumStreamMetadata && meta.streamId) {
			this.#metaList.push(meta);
			this.#metaMap.set(meta.streamId, meta);
		}
		return this;
	}

	/**
	 * Get a set of all available stream IDs.
	 * @returns all available metadata stream ID values
	 */
	metadataStreamIds(): Set<string> {
		return new Set(this.#metaMap.keys());
	}

	/**
	 * Get the metadata at a specific index, based on insertion order.
	 * @param index - the index of the metadata to get
	 * @returns the metadata at the given index, or `undefined`
	 */
	metadataAt(index: number): DatumStreamMetadata | undefined {
		return index >= 0 && index < this.#metaList.length
			? this.#metaList[index]
			: undefined;
	}

	/**
	 * Get the index of the metadata with a specific stream ID.
	 * @param streamId - the stream ID to get the index of
	 * @returns the found index, or `-1` if not found
	 */
	indexOfMetadataStreamId(streamId: string): number {
		let i = 0;
		for (const meta of this.#metaList) {
			if (meta.streamId === streamId) {
				return i;
			}
			i += 1;
		}
		return -1;
	}

	/**
	 * Get a list of all available stream IDs in insertion order.
	 * @returns  all available metadata stream ID values in the same order as added to this registry
	 */
	metadataStreamIdsList(): string[] {
		return this.#metaList.map((e) => e.streamId);
	}

	/**
	 * Get the metadta for a given stream ID.
	 * @param streamId - the stream ID of the metadata to get
	 * @returns the associated metadata, or `undefined` if none available
	 */
	metadataForStreamId(streamId: string): DatumStreamMetadata | undefined {
		return this.#metaMap.get(streamId);
	}

	/**
	 * Get the first available metadata for a given object and source ID combination.
	 * @param objectId - the object ID of the metadata to get
	 * @param sourceId - the source ID of the metadata to get
	 * @param kind - optional kind to get; if not provided the first metadata to match the given `objectId`
	 *     and `sourceId` will be returned
	 * @returns the associated metadata, or `undefined` if none available
	 */
	metadataForObjectSource(
		objectId: number,
		sourceId: string,
		kind?: DatumStreamType
	): DatumStreamMetadata | undefined {
		for (const meta of this.#metaMap.values()) {
			if (
				meta.objectId === objectId &&
				meta.sourceId == sourceId &&
				(kind ? meta.kind === kind : true)
			) {
				return meta;
			}
		}
		return undefined;
	}

	/**
	 * Get this object as a standard JSON encoded string value.
	 *
	 * The returned JSON is an array of the {@link Domain.DatumStreamMetadata#toJsonEncoding toJsonEncoding()} result
	 * of all metadata in the registry. An example result looks like this:
	 *
	 * ```
	 * [
	 *     {
	 *       "streamId": "7714f762-2361-4ec2-98ab-7e96807b32a6",
	 *       "zone": "Pacific/Auckland",
	 *       "kind": "n",
	 *       "objectId": 123,
	 *       "sourceId": "/power/1",
	 *       "i": ["watts", "current",  "voltage", "frequency"],
	 *       "a": ["wattHours"]
	 *     },
	 *     {
	 *       "streamId": "5514f762-2361-4ec2-98ab-7e96807b3255",
	 *       "zone": "America/New_York",
	 *       "kind": "n",
	 *       "objectId": 456,
	 *       "sourceId": "/irradiance/2",
	 *       "i": ["irradiance", "temperature"],
	 *       "a": ["irradianceHours"]
	 *     }
	 * ]
	 * ```
	 *
	 * @return the JSON encoded string
	 */
	toJsonEncoding(): string {
		let json = "[";
		for (const meta of this.#metaList) {
			if (json.length > 1) {
				json += ",";
			}
			json += meta.toJsonEncoding();
		}
		json += "]";
		return json;
	}

	/**
	 * Parse a JSON string into a {@link Util.DatumStreamMetadataRegistry DatumStreamMetadataRegistry} instance.
	 *
	 * The JSON must be encoded the same way {@link Util.DatumStreamMetadataRegistry#toJsonEncoding toJsonEncoding()} does.
	 *
	 * @param json - the JSON to parse
	 * @returns the stream metadata registry instance, or `undefined` if `json` is not parsable as one
	 */
	static fromJsonEncoding(
		json: string
	): DatumStreamMetadataRegistry | undefined {
		if (json) {
			return this.fromJsonObject(JSON.parse(json));
		}
		return undefined;
	}

	/**
	 * Create a registry instance from an array parsed from a JSON string of datum stream metadata objects.
	 *
	 * The array must be structured in the same way {@link Util.DatumStreamMetadataRegistry#toJsonEncoding toJsonEncoding()} does.
	 *
	 * @param data - the array data to parse
	 * @returns the stream metadata registry instance, or `undefined` if `data` is not a valid array
	 */
	static fromJsonObject(
		data: DatumStreamMetadataInfo[] | undefined
	): DatumStreamMetadataRegistry | undefined {
		if (!Array.isArray(data)) {
			return undefined;
		}
		const reg = new DatumStreamMetadataRegistry();
		for (const e of data) {
			const meta = DatumStreamMetadata.fromJsonObject(e);
			if (meta) {
				reg.addMetadata(meta);
			}
		}
		return reg;
	}
}

export default DatumStreamMetadataRegistry;
