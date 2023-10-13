/**
 * Parse the query portion of a URL string, and return a parameter object for the
 * parsed key/value pairs.
 *
 * Multiple parameters of the same name will be stored as an array on the returned object.
 *
 * @param search - the query portion of the URL, which may optionally include the leading `?` character
 * @param multiValueKeys - if provided, a set of keys for which to always treat
 *                                       as a multi-value array, even if there is only one value
 * @return the parsed query parameters, as a parameter object
 */
declare function urlQueryParse(search: string, multiValueKeys?: Set<string>): Record<string, string | string[]>;
/**
 * Encode the properties of an object as a URL query string.
 *
 * If an object property has an array value, multiple URL parameters will be encoded for that property.
 *
 * The optional `encoderFn` argument is a function that accepts a string value
 * and should return a URI-safe string for that value.
 *
 * @param parameters - an object to encode as URL parameters
 * @param encoderFn - an optional function to encode each URI component with;
 *     if not provided the built-in `encodeURIComponent()` function will be used
 * @return the encoded query parameters
 */
declare function urlQueryEncode(parameters: Record<string, any>, encoderFn?: (uriComponent: string | number | boolean) => string): string;
export { urlQueryParse, urlQueryEncode };
//# sourceMappingURL=urls.d.ts.map