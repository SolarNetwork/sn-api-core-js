/**
 * API for an object that can encode itself into a JSON-ready structure.
 * @public
 */
export default interface JsonEncodable {
	/**
	 * Get this object in standard JSON form.
	 *
	 * This method will return a "plain" object or array, suitable for passing to `JSON.stringify()`.
	 *
	 * @return an object or array, ready for JSON encoding
	 */
	toJsonObject(): Record<string, any> | any[];
}
