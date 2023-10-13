/**
 * API for an object that can URI encode itself.
 * @public
 */
export default interface UriEncodable {
	/**
	 * Get this object as a standard URI encoded (query parameters) string value.
	 *
	 * @param index - an optional array property index
	 * @param propertyName - an optional array property name, only used if `index` is also provided;
	 *                       defaults to `sorts`
	 * @returns the URI encoded string
	 */
	toUriEncoding(index?: number, propertyName?: string): string;
}
