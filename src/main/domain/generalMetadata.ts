import { stringMapToObject, objectToStringMap } from "../util/objects.js";

/**
 * General metadata with a basic structure.
 *
 * This metadata can be associated with a variety of objects within SolarNetwork, such
 * as users, nodes, and datum.
 */
class GeneralMetadata {
	/** The general metadata map. */
	info?: Map<string, any>;

	/** The property metadata map. */
	propertyInfo?: Map<string, Map<string, any>>;

	/** The tags. */
	tags?: Set<string>;

	/**
	 * Constructor.
	 *
	 * @param info - the general metadata map
	 * @param propertyInfo - the property metadata map
	 * @param tags - the tags
	 */
	constructor(
		info?: Map<string, any>,
		propertyInfo?: Map<string, Map<string, any>>,
		tags?: Set<string> | string[]
	) {
		this.info = info;
		this.propertyInfo = propertyInfo;
		this.tags =
			tags instanceof Set
				? tags
				: Array.isArray(tags)
				? new Set(tags)
				: undefined;
	}

	/**
	 * Get this object as a standard JSON encoded string value.
	 *
	 * @return the JSON encoded string
	 */
	toJsonEncoding(): string {
		const result: Record<string, any> = {};
		const info = this.info;
		if (info) {
			result["m"] = stringMapToObject(info);
		}
		const propertyInfo = this.propertyInfo;
		if (propertyInfo) {
			result["pm"] = stringMapToObject(propertyInfo);
		}
		const tags = this.tags;
		if (tags) {
			result["t"] = Array.from(tags);
		}

		return JSON.stringify(result);
	}

	/**
	 * Parse a JSON string into a `GeneralMetadata` instance.
	 *
	 * The JSON must be encoded the same way {@link Domain.GeneralMetadata#toJsonEncoding} does.
	 *
	 * @param json - the JSON to parse
	 * @returns the metadata instance
	 */
	static fromJsonEncoding(json: string): GeneralMetadata {
		let m: Map<string, any> | undefined;
		let pm: Map<string, Map<string, any>> | undefined;
		let t: Set<string> | undefined;
		if (json) {
			const obj = JSON.parse(json);
			m = obj["m"] ? objectToStringMap(obj["m"]) : undefined;
			pm = obj["pm"] ? objectToStringMap(obj["pm"]) : undefined;
			t = Array.isArray(obj["t"]) ? new Set<string>(obj["t"]) : undefined;
		}
		return new GeneralMetadata(m, pm, t);
	}
}

export default GeneralMetadata;
