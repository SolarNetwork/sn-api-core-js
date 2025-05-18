import MultiMap from "../util/multiMap.js";
/**
 * Enumeration of HTTP methods (verbs).
 */
var HttpMethod;
(function (HttpMethod) {
    HttpMethod["GET"] = "GET";
    HttpMethod["HEAD"] = "HEAD";
    HttpMethod["POST"] = "POST";
    HttpMethod["PUT"] = "PUT";
    HttpMethod["PATCH"] = "PATCH";
    HttpMethod["DELETE"] = "DELETE";
    HttpMethod["OPTIONS"] = "OPTIONS";
    HttpMethod["TRACE"] = "TRACE";
})(HttpMethod || (HttpMethod = {}));
/**
 * Enumeration of common HTTP `Content-Type` values.
 */
var HttpContentType;
(function (HttpContentType) {
    /** JSON type. */
    HttpContentType["APPLICATION_JSON"] = "application/json";
    /** JSON type with UTF-8 charset type. */
    HttpContentType["APPLICATION_JSON_UTF8"] = "application/json; charset=UTF-8";
    /** Form URL-encoded type. */
    HttpContentType["FORM_URLENCODED"] = "application/x-www-form-urlencoded";
    /** Form URL-encoded with UTF-8 charset type. */
    HttpContentType["FORM_URLENCODED_UTF8"] = "application/x-www-form-urlencoded; charset=UTF-8";
})(HttpContentType || (HttpContentType = {}));
/**
 * HTTP headers multi-map.
 */
class HttpHeaders extends MultiMap {
    /**  The `Accept` header. */
    static ACCEPT = "Accept";
    /** The `Authorization` header. */
    static AUTHORIZATION = "Authorization";
    /** The `Content-MD5` header. */
    static CONTENT_MD5 = "Content-MD5";
    /** The `Content-Type` header. */
    static CONTENT_TYPE = "Content-Type";
    /** The `Date` header.  */
    static DATE = "Date";
    /** The `Digest` header. */
    static DIGEST = "Digest";
    /** The `Host` header.  */
    static HOST = "Host";
    /** The `X-SN-PreSignedAuthorization` header. */
    static X_SN_PRE_SIGNED_AUTHORIZATION = "X-SN-PreSignedAuthorization";
    /**  The `X-SN-Date` header. */
    static X_SN_DATE = "X-SN-Date";
}
export default HttpHeaders;
export { HttpContentType, HttpMethod };
//# sourceMappingURL=httpHeaders.js.map