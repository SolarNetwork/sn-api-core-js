import MultiMap from "../util/multiMap.js";

/**
 * Enumeration of HTTP methods (verbs).
 */
enum HttpMethod {
	GET = "GET",
	HEAD = "HEAD",
	POST = "POST",
	PUT = "PUT",
	PATCH = "PATCH",
	DELETE = "DELETE",
	OPTIONS = "OPTIONS",
	TRACE = "TRACE",
}

/**
 * Enumeration of common HTTP `Content-Type` values.
 */
enum HttpContentType {
	/** JSON type. */
	APPLICATION_JSON = "application/json",

	/** JSON type with UTF-8 charset type. */
	APPLICATION_JSON_UTF8 = "application/json; charset=UTF-8",

	/** Form URL-encoded type. */
	FORM_URLENCODED = "application/x-www-form-urlencoded",

	/** Form URL-encoded with UTF-8 charset type. */
	FORM_URLENCODED_UTF8 = "application/x-www-form-urlencoded; charset=UTF-8",
}

/**
 * HTTP headers multi-map.
 */
class HttpHeaders extends MultiMap {
	/**  The `Accept` header. */
	static readonly ACCEPT = "Accept";

	/** The `Authorization` header. */
	static readonly AUTHORIZATION = "Authorization";

	/** The `Content-MD5` header. */
	static readonly CONTENT_MD5 = "Content-MD5";

	/** The `Content-Type` header. */
	static readonly CONTENT_TYPE = "Content-Type";

	/** The `Date` header.  */
	static readonly DATE = "Date";

	/** The `Digest` header. */
	static readonly DIGEST = "Digest";

	/** The `Host` header.  */
	static readonly HOST = "Host";

	/** The `X-SN-PreSignedAuthorization` header. */
	static readonly X_SN_PRE_SIGNED_AUTHORIZATION =
		"X-SN-PreSignedAuthorization";

	/**  The `X-SN-Date` header. */
	static readonly X_SN_DATE = "X-SN-Date";
}

export default HttpHeaders;
export { HttpContentType, HttpMethod };
