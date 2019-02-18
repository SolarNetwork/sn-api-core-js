import MultiMap from "../util/multiMap";

const HttpMethod = Object.freeze(
	/**
	 * Enumeration of HTTP methods (verbs).
	 * @enum {string}
	 * @alias module:net~HttpMethod
	 * @constant
	 */
	{
		GET: "GET",
		HEAD: "HEAD",
		POST: "POST",
		PUT: "PUT",
		PATCH: "PATCH",
		DELETE: "DELETE",
		OPTIONS: "OPTIONS",
		TRACE: "TRACE"
	}
);

const HttpContentType = Object.freeze(
	/**
	 * Enumeration of common HTTP `Content-Type` values.
	 * @enum {string}
	 * @alias module:net~HttpContentType
	 * @constant
	 */
	{
		APPLICATION_JSON: "application/json",
		APPLICATION_JSON_UTF8: "application/json; charset=UTF-8",
		FORM_URLENCODED: "application/x-www-form-urlencoded",
		FORM_URLENCODED_UTF8: "application/x-www-form-urlencoded; charset=UTF-8"
	}
);

/**
 * Support for HTTP headers.
 *
 * @extends module:util~MultiMap
 * @alias module:net~HttpHeaders
 */
class HttpHeaders extends MultiMap {
	constructor() {
		super();
	}
}

Object.defineProperties(HttpHeaders, {
	/**
	 * The `Accept` header.
	 *
	 * @memberof module:net~HttpHeaders
	 * @readonly
	 * @type {string}
	 */
	ACCEPT: { value: "Accept" },

	/**
	 * The `Authorization` header.
	 *
	 * @memberof module:net~HttpHeaders
	 * @readonly
	 * @type {string}
	 */
	AUTHORIZATION: { value: "Authorization" },

	/**
	 * The `Content-MD5` header.
	 *
	 * @memberof module:net~HttpHeaders
	 * @readonly
	 * @type {string}
	 */
	CONTENT_MD5: { value: "Content-MD5" },

	/**
	 * The `Content-Type` header.
	 *
	 * @memberof module:net~HttpHeaders
	 * @readonly
	 * @type {string}
	 */
	CONTENT_TYPE: { value: "Content-Type" },

	/**
	 * The `Date` header.
	 *
	 * @memberof module:net~HttpHeaders
	 * @readonly
	 * @type {string}
	 */
	DATE: { value: "Date" },

	/**
	 * The `Digest` header.
	 *
	 * @memberof module:net~HttpHeaders
	 * @readonly
	 * @type {string}
	 */
	DIGEST: { value: "Digest" },

	/**
	 * The `Host` header.
	 *
	 * @memberof module:net~HttpHeaders
	 * @readonly
	 * @type {string}
	 */
	HOST: { value: "Host" },

	/**
	 * The `X-SN-Date` header.
	 *
	 * @memberof module:net~HttpHeaders
	 * @readonly
	 * @type {string}
	 */
	X_SN_DATE: { value: "X-SN-Date" }
});

export default HttpHeaders;
export { HttpContentType, HttpMethod };
