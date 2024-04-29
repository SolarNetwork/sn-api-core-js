import Base64 from "crypto-js/enc-base64.js";
import { default as Hex } from "crypto-js/enc-hex.js";
import HmacSHA256 from "crypto-js/hmac-sha256.js";
import SHA256 from "crypto-js/sha256.js";
import { parse as uriParse } from "uri-js";

import { lowercaseSortedArray } from "../util/arrays.js";
import { iso8601Date } from "../util/dates.js";
import MultiMap from "../util/multiMap.js";
import { default as Environment, HostConfig } from "./environment.js";
import { HttpMethod, default as HttpHeaders } from "./httpHeaders.js";
import { urlQueryParse } from "./urls.js";

/**
 * The number of milliseconds a signing key is valid for.
 * @private
 */
const SIGNING_KEY_VALIDITY = 7 * 24 * 60 * 60 * 1000;

/**
 * A builder object for the SNWS2 HTTP authorization scheme.
 *
 * This builder can be used to calculate a one-off header value, for example:
 *
 * ```
 * let authHeader = new AuthorizationV2Builder("my-token")
 *     .path("/solarquery/api/v1/pub/...")
 *     .build("my-token-secret");
 * ```
 *
 * Or the builder can be re-used for a given token:
 *
 * ```
 * // create a builder for a token
 * let builder = new AuthorizationV2Builder("my-token");
 *
 * // elsewhere, re-use the builder for repeated requests
 * builder.reset()
 *     .path("/solarquery/api/v1/pub/...")
 *     .build("my-token-secret");
 * ```
 *
 * Additionally, a signing key can be generated and re-used for up to 7 days:
 *
 * ```
 * // create a builder for a token
 * let builder = new AuthorizationV2Builder("my-token")
 *   .saveSigningKey("my-token-secret");
 *
 * // elsewhere, re-use the builder for repeated requests
 * builder.reset()
 *     .path("/solarquery/api/v1/pub/...")
 *     .buildWithSavedKey(); // note previously generated key used
 * ```
 *
 * ## Post requests
 *
 * For handling `POST` or `PUT` requests, you must make sure to configure the properties of
 * this class to match your actual HTTP request:
 *
 *  1. Use the {@link Net.AuthorizationV2Builder#method method()} method to configure the HTTP verb (you can use the {@link Net.HttpMethod HttpMethod} constants).
 *  2. Use the {@link Net.AuthorizationV2Builder#contentType contentType()} method to configure the same value that will be used for the HTTP `Content-Type` header (you can use the {@link Net.HttpContentType HttpContentType} constants).
 *  3. **If** the content type is `application/x-www-form-urlencoded` then you should use the {@link Net.AuthorizationV2Builder#queryParams queryParams()} method to configure the request parameters.
 *  4. **If** the content type is **not** `application/x-www-form-urlencoded` then you should use the {@link Net.AuthorizationV2Builder#computeContentDigest computeContentDigest()} method to configure a HTTP `Digest` header.
 *
 * ```
 * // create a builder for a token
 * let builder = new AuthorizationV2Builder("my-token")
 *   .saveSigningKey("my-token-secret");
 *
 * // POST request with form data
 * builder.reset()
 *     .method(HttpHeaders.POST)
 *     .path("/solarquery/api/v1/pub/...")
 *     .contentType(HttpContentType.FORM_URLENCODED_UTF8)
 *     .queryParams({foo:"bar"})
 *     .buildWithSavedKey();
 *
 * // PUT request with JSON data, with XHR style request
 * let reqJson = JSON.stringify({foo:"bar"});
 * builder.reset()
 *     .method(HttpHeaders.PUT)
 *     .path("/solarquery/api/v1/pub/...")
 *     .contentType(HttpContentType.APPLICATION_JSON_UTF8)
 *     .computeContentDigest(reqJson);
 *
 * // when making actual HTTP request, re-use the computed HTTP Digest header:
 * xhr.setRequestHeader(
 *     HttpHeaders.DIGEST,
 *     builder.httpHeaders.firstValue(HttpHeaders.DIGEST)
 * );
 * xhr.setRequestHeader(HttpHeaders.X_SN_DATE, builder.requestDateHeaderValue);
 * xhr.setRequestHeader(HttpHeaders.AUTHORIZATION, builder.buildWithSavedKey());
 * ```
 */
class AuthorizationV2Builder {
	/** The hex-encoded value for an empty SHA256 digest value. */
	static readonly EMPTY_STRING_SHA256_HEX =
		"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

	/** The SolarNetwork V2 authorization scheme. */
	static readonly SNWS2_AUTH_SCHEME = "SNWS2";

	/** The SolarNet auth token value. */
	tokenId?: string;

	/** The SolarNet environment. */
	environment: HostConfig;

	/** The signed HTTP headers. */
	httpHeaders: HttpHeaders;

	/** The HTTP query parameters. */
	parameters: MultiMap;

	/**
	 * Force a port number to be added to host values, even if port would be implied.
	 *
	 * This can be useful when working with a server behind a proxy, where the
	 * proxy is configured to always forward the port even if the port is implied
	 * (i.e. HTTPS is used on the standard port 443).
	 */
	forceHostPort: boolean;

	#httpMethod: string;
	#requestPath: string;
	#requestDate: Date;
	#contentDigest?: CryptoJS.lib.WordArray;
	#signingKey?: CryptoJS.lib.WordArray;
	#signingKeyExpiration?: Date;
	#signedHeaderNames?: string[];

	/**
	 * Constructor.
	 *
	 * The {@link Net.AuthorizationV2Builder#reset reset()} method is invoked to set up
	 * default values for this instance.
	 *
	 * @param token - the auth token to use
	 * @param environment - the environment to use; if not provided a
	 *        default environment will be created
	 */
	constructor(token?: string, environment?: HostConfig) {
		this.tokenId = token;
		this.environment = environment || new Environment();
		this.httpHeaders = new HttpHeaders();
		this.parameters = new MultiMap();
		this.forceHostPort = false;
		this.#requestDate = new Date();
		this.#httpMethod = HttpMethod.GET;
		this.#requestPath = "/";
		this.reset();
	}

	/**
	 * Reset to defalut property values.
	 *
	 * Any previously saved signing key via {@link Net.AuthorizationV2Builder#saveSigningKey saveSigningKey()}
	 * or {@link Net.AuthorizationV2Builder#key key()} is preserved. The following items are reset:
	 *
	 *  * {@link Net.AuthorizationV2Builder#method method()} is set to `GET`
	 *  * {@link Net.AuthorizationV2Builder#host host()} is set to `this.environment.host`
	 *  * {@link Net.AuthorizationV2Builder#path path()} is set to `/`
	 *  * {@link Net.AuthorizationV2Builder#date date()} is set to the current date
	 *  * {@link Net.AuthorizationV2Builder#contentSHA256 contentSHA256()} is cleared
	 *  * {@link Net.AuthorizationV2Builder#headers headers()} is cleared
	 *  * {@link Net.AuthorizationV2Builder#queryParams queryParams()} is cleared
	 *  * {@link Net.AuthorizationV2Builder#signedHttpHeaders signedHttpHeaders()} is set to a new empty array
	 *
	 * @returns this object
	 */
	reset(): this {
		this.#httpMethod = HttpMethod.GET;
		this.#requestDate = new Date();
		this.#requestPath = "/";
		this.#contentDigest = undefined;
		this.#signedHeaderNames = undefined;
		const host = this.environment.host;
		this.httpHeaders.clear();
		this.parameters.clear();
		return this.host(host);
	}

	/**
	 * Compute and cache the signing key.
	 *
	 * Signing keys are derived from the token secret and valid for 7 days, so
	 * this method can be used to compute a signing key so that {@link Net.AuthorizationV2Builder#build build()}
	 * can be called later. The signing date will be set to whatever date is
	 * currently configured via {@link Net.AuthorizationV2Builder#date date()}, which defaults to the
	 * current time for newly created builder instances.
	 *
	 * If you have an externally computed signing key, such as one returned from a token refresh API call,
	 * use the {@link Net.AuthorizationV2Builder#key key()} method to save it rather than this method.
	 * If you want to compute the signing key, without caching it on this builder, use the
	 * {@link Net.AuthorizationV2Builder#computeSigningKey computeSigningKey()} method rather than
	 * this method.
	 *
	 * @param tokenSecret - the secret to sign the digest with
	 * @returns this object
	 */
	saveSigningKey(tokenSecret: string): this {
		this.key(this.computeSigningKey(tokenSecret), this.#requestDate);
		return this;
	}

	/**
	 * Get or set the signing key.
	 *
	 * Use this method to save an existing signing key, for example one received via a refresh
	 * request. The `date` parameter is used to track the expirataion date of the key, as
	 * reported by the {@link Net.AuthorizationV2Builder#signingKeyValid signingKeyValid}
	 * property.
	 *
	 * If you have an actual token secret value, use the
	 * {@link Net.AuthorizationV2Builder#saveSigningKey saveSigningKey()} method to save it
	 * rather than this method.
	 *
	 * @param key - the signing key to save
	 * @param date - an optional date the signing key was generated with; if not provided
	 *     the configured {@link Net.AuthorizationV2Builder#date date()} value will be used
	 * @returns when called as a getter the current saved signing key value, otherwise this object
	 * @see Net.AuthorizationV2Builder#signingKeyExpirationDate
	 */
	key(): CryptoJS.lib.WordArray | undefined;
	key(key: CryptoJS.lib.WordArray, date?: Date): this;
	key(
		key?: CryptoJS.lib.WordArray,
		date?: Date
	): CryptoJS.lib.WordArray | undefined | this {
		if (key === undefined) {
			return this.#signingKey;
		}
		this.#signingKey = key;
		const expire = new Date(
			(date ? date.getTime() : this.#requestDate.getTime()) +
				SIGNING_KEY_VALIDITY
		);
		expire.setUTCHours(0);
		expire.setUTCMinutes(0);
		expire.setUTCSeconds(0);
		expire.setUTCMilliseconds(0);
		this.#signingKeyExpiration = expire;
		return this;
	}

	/**
	 * Get the saved signing key expiration date.
	 *
	 * This will return the expiration date the signing key saved via
	 * {@link Net.AuthorizationV2Builder#key key()} or
	 * {@link Net.AuthorizationV2Builder#saveSigningKey saveSigningKey()}.
	 */
	get signingKeyExpirationDate(): Date | undefined {
		return this.#signingKeyExpiration;
	}

	/**
	 * Test if a signing key is present and not expired.
	 */
	get signingKeyValid(): boolean {
		return this.#signingKey &&
			this.#signingKeyExpiration instanceof Date &&
			Date.now() < this.#signingKeyExpiration.getTime()
			? true
			: false;
	}

	/**
	 * Set the HTTP method (verb) to use.
	 *
	 * @param val - the method to use; see the {@link Net.HttpMethod} enum for possible values
	 * @returns this object
	 */
	method(): string;
	method(val: string): this;
	method(val?: string): string | this {
		if (val === undefined) {
			return this.#httpMethod;
		}
		this.#httpMethod = val;
		return this;
	}

	/**
	 * Set the HTTP host.
	 *
	 * This is a shortcut for calling `HttpHeaders#put(HttpHeaders.HOST, val)`.
	 *
	 * @param val - the HTTP host value to use
	 * @returns this object
	 */
	host(val: string): this {
		if (
			this.forceHostPort &&
			val.indexOf(":") < 0 &&
			this.environment.port != 80
		) {
			val += ":" + this.environment.port;
		}
		this.httpHeaders.put(HttpHeaders.HOST, val);
		return this;
	}

	/**
	 * Set the HTTP request path to use.
	 *
	 * @param val - the request path to use
	 * @returns this object
	 */
	path(): string;
	path(val: string): this;
	path(val?: string): string | this {
		if (val === undefined) {
			return this.#requestPath;
		}
		this.#requestPath = val;
		return this;
	}

	/**
	 * Set the host, path, and query parameters via a URL string.
	 *
	 * @param url - the URL value to use
	 * @param ignoreHost -if `true` then do not set the {@link Net.AuthorizationV2Builder#host host()}
	 *     from the given URL; this can be useful when you do not want to override the configured
	 *     environment host
	 * @returns this object
	 */
	url(url: string, ignoreHost?: boolean) {
		const uri = uriParse(url);
		let host = uri.host;
		if (
			uri.port &&
			(((uri.scheme === "https" || uri.scheme === "wss") &&
				uri.port !== 443) ||
				((uri.scheme === "http" || uri.scheme === "ws") &&
					uri.port !== 80))
		) {
			host += ":" + uri.port;
		}
		if (uri.query) {
			this.queryParams(urlQueryParse(uri.query));
		}
		if (!ignoreHost && host) {
			this.host(host);
		}
		return this.path(
			uri.scheme === "wss" || uri.scheme === "ws"
				? (uri as any).resourceName
				: uri.path
		);
	}

	/**
	 * Set the HTTP content type.
	 *
	 * This is a shortcut for calling {@link Net.HttpHeaders#put HttpHeaders.put()} with the
	 * key {@link Net.HttpHeaders.CONTENT_TYPE HttpHeaders.CONTENT_TYPE}.
	 *
	 * @param val - the HTTP content type value to use
	 * @returns this object
	 */
	contentType(val: string): this {
		this.httpHeaders.put(HttpHeaders.CONTENT_TYPE, val);
		return this;
	}

	/**
	 * Set the authorization request date.
	 *
	 * @param val - the date to use; typically the current time, e.g. `new Date()`
	 * @returns when called as a getter the request date, otherwise this object
	 */
	date(): Date;
	date(val: Date): this;
	date(val?: Date): Date | this {
		if (val === undefined) {
			return this.#requestDate;
		}
		this.#requestDate = val instanceof Date ? val : new Date();
		return this;
	}

	/**
	 * The authorization request date as a HTTP header string value.
	 */
	get requestDateHeaderValue(): string | undefined {
		return this.#requestDate.toUTCString();
	}

	/**
	 * Control using the `X-SN-Date` HTTP header versus the `Date` header.
	 *
	 * Set to `true` to use the `X-SN-Date` header, `false` to use
	 * the `Date` header. This will return `true` if `X-SN-Date` has been
	 * added to the `signedHeaderNames` property or has been added to the `httpHeaders`
	 * property.
	 */
	get useSnDate(): boolean {
		const signedHeaders = this.#signedHeaderNames;
		const existingIndex = Array.isArray(signedHeaders)
			? signedHeaders.findIndex(
					caseInsensitiveEqualsFn(HttpHeaders.X_SN_DATE)
			  )
			: -1;
		return (
			existingIndex >= 0 ||
			this.httpHeaders.containsKey(HttpHeaders.X_SN_DATE)
		);
	}

	set useSnDate(enabled: boolean) {
		let signedHeaders = this.#signedHeaderNames;
		const existingIndex = Array.isArray(signedHeaders)
			? signedHeaders.findIndex(
					caseInsensitiveEqualsFn(HttpHeaders.X_SN_DATE)
			  )
			: -1;
		if (enabled && existingIndex < 0) {
			signedHeaders = signedHeaders
				? signedHeaders.concat(HttpHeaders.X_SN_DATE)
				: [HttpHeaders.X_SN_DATE];
			this.#signedHeaderNames = signedHeaders;
		} else if (!enabled && existingIndex >= 0) {
			signedHeaders!.splice(existingIndex, 1);
			this.#signedHeaderNames = signedHeaders;
		}

		// also clear from httpHeaders
		this.httpHeaders.remove(HttpHeaders.X_SN_DATE);
	}

	/**
	 * Set the `useSnDate` property.
	 *
	 * @param enabled - `true` to use the `X-SN-Date` header, `false` to use `Date`
	 * @returns this object
	 */
	snDate(enabled: boolean): this {
		this.useSnDate = enabled;
		return this;
	}

	/**
	 * Set a HTTP header value.
	 *
	 * This is a shortcut for calling `HttpHeaders#put(headerName, val)`.
	 *
	 * @param headerName - the header name to set
	 * @param headerValue - the header value to set
	 * @returns this object
	 */
	header(headerName: string, headerValue: string): this {
		this.httpHeaders.put(headerName, headerValue);
		return this;
	}

	/**
	 * Set the HTTP headers to use with the request.
	 *
	 * The headers object must include all headers necessary by the
	 * authentication scheme, and any additional headers also configured via
	 * {@link Net.AuthorizationV2Builder#signedHttpHeaders}.
	 *
	 * @param headers - the HTTP headers to use
	 * @returns this object
	 */
	headers(headers: HttpHeaders): this {
		this.httpHeaders = headers;
		return this;
	}

	/**
	 * Set the HTTP `GET` query parameters, or `POST` form-encoded
	 * parameters.
	 *
	 * @param params - the parameters to use, as either a {@link MultiMap} or simple `Object`
	 * @returns this object
	 */
	queryParams(params: MultiMap | Record<string, any>): this {
		if (params instanceof MultiMap) {
			this.parameters = params;
		} else {
			this.parameters.putAll(params);
		}
		return this;
	}

	/**
	 * Set additional HTTP header names to sign with the authentication.
	 *
	 * @param signedHeaderNames - additional HTTP header names to include in the signature
	 * @returns when called as a getter, the current signed header names, otherwise this object
	 */
	signedHttpHeaders(): string[] | undefined;
	signedHttpHeaders(signedHeaderNames: string[]): this;
	signedHttpHeaders(
		signedHeaderNames?: string[]
	): string[] | undefined | this {
		if (!Array.isArray(signedHeaderNames)) {
			return this.#signedHeaderNames?.concat();
		}
		this.#signedHeaderNames = signedHeaderNames;
		return this;
	}

	/**
	 * Set the HTTP request body content SHA-256 digest value.
	 *
	 * @param digest - the digest value to use; if a string it is assumed to be Hex encoded
	 * @returns this object
	 */
	contentSHA256(digest: string | CryptoJS.lib.WordArray) {
		let contentDigest: CryptoJS.lib.WordArray;
		if (typeof digest === "string") {
			contentDigest = Hex.parse(digest);
		} else {
			contentDigest = digest;
		}
		this.#contentDigest = contentDigest;
		return this;
	}

	/**
	 * Compute the SHA-256 digest of the request body content and configure the result on this builder.
	 *
	 * This method will compute the digest and then save the result via the
	 * {@link Net.AuthorizationV2Builder#contentSHA256 contentSHA256()}
	 * method. In addition, it will set the `Digest` HTTP header value via
	 * {@link Net.AuthorizationV2Builder#header header()}.
	 * This means you _must_ also pass the `Digest` HTTP header with the request. After calling this
	 * method, you can retrieve the `Digest` HTTP header value via the `httpHeaders`property.
	 *
	 * @param content - the request body content to compute a SHA-256 digest value from
	 * @returns this object
	 */
	computeContentDigest(content: string): this {
		const digest = SHA256(content);
		this.contentSHA256(digest);
		this.header("Digest", "sha-256=" + Base64.stringify(digest));
		return this;
	}

	/**
	 * Compute the canonical query parameters.
	 *
	 * @returns the canonical query parameters string value
	 */
	canonicalQueryParameters(): string {
		const keys = this.parameters.keySet();
		if (keys.length < 1) {
			return "";
		}
		keys.sort();
		const len = keys.length;
		let first = true,
			result = "";
		for (let i = 0; i < len; i += 1) {
			const key = keys[i];
			const vals = this.parameters.value(key)!;
			const valsLen = vals.length;
			for (let j = 0; j < valsLen; j += 1) {
				if (first) {
					first = false;
				} else {
					result += "&";
				}
				result +=
					_encodeURIComponent(key) +
					"=" +
					_encodeURIComponent(vals[j]);
			}
		}
		return result;
	}

	/**
	 * Compute the canonical HTTP headers string value.
	 *
	 * @param sortedLowercaseHeaderNames - the sorted, lower-cased HTTP header names to include
	 * @returns the canonical headers string value
	 */
	canonicalHeaders(sortedLowercaseHeaderNames: string[]): string {
		let result = "",
			headerName,
			headerValue;
		const len = sortedLowercaseHeaderNames.length;
		for (let i = 0; i < len; i += 1) {
			headerName = sortedLowercaseHeaderNames[i];
			if ("date" === headerName || "x-sn-date" === headerName) {
				headerValue = this.#requestDate.toUTCString();
			} else {
				headerValue = this.httpHeaders.firstValue(headerName);
			}
			result +=
				headerName +
				":" +
				(headerValue ? headerValue.trim() : "") +
				"\n";
		}
		return result;
	}

	/**
	 * Compute the canonical signed header names value from an array of HTTP header names.
	 *
	 * @param sortedLowercaseHeaderNames - the sorted, lower-cased HTTP header names to include
	 * @returns the canonical signed header names string value
	 */
	#canonicalSignedHeaderNames(sortedLowercaseHeaderNames: string[]): string {
		return sortedLowercaseHeaderNames.join(";");
	}

	/**
	 * Get the canonical request content SHA256 digest, hex encoded.
	 *
	 * @returns the hex-encoded SHA256 digest of the request content
	 */
	canonicalContentSHA256(): string {
		return this.#contentDigest
			? Hex.stringify(this.#contentDigest)
			: AuthorizationV2Builder.EMPTY_STRING_SHA256_HEX;
	}

	/**
	 * Compute the canonical HTTP header names to include in the signature.
	 *
	 * @returns the sorted, lower-cased HTTP header names to include
	 */
	canonicalHeaderNames(): string[] {
		const httpHeaders = this.httpHeaders;
		const signedHeaderNames = this.#signedHeaderNames;

		// use a MultiMap to take advantage of case-insensitive keys
		const map = new MultiMap();

		map.put(HttpHeaders.HOST, true);
		if (this.useSnDate) {
			map.put(HttpHeaders.X_SN_DATE, true);
		} else {
			map.put(HttpHeaders.DATE, true);
		}
		if (httpHeaders.containsKey(HttpHeaders.CONTENT_MD5)) {
			map.put(HttpHeaders.CONTENT_MD5, true);
		}
		if (httpHeaders.containsKey(HttpHeaders.CONTENT_TYPE)) {
			map.put(HttpHeaders.CONTENT_TYPE, true);
		}
		if (httpHeaders.containsKey(HttpHeaders.DIGEST)) {
			map.put(HttpHeaders.DIGEST, true);
		}
		if (signedHeaderNames && signedHeaderNames.length > 0) {
			signedHeaderNames.forEach((e) => map.put(e, true));
		}
		return lowercaseSortedArray(map.keySet());
	}

	/**
	 * Compute the canonical request data that will be included in the data to sign with the request.
	 *
	 * @returns the canonical request data
	 */
	buildCanonicalRequestData(): string {
		return this.#computeCanonicalRequestData(this.canonicalHeaderNames());
	}

	/**
	 * Compute the canonical request data that will be included in the data to sign with the request,
	 * using a specific set of HTTP header names to sign.
	 *
	 * @param sortedLowercaseHeaderNames - the sorted, lower-cased HTTP header names to sign with the request
	 * @returns the canonical request data
	 */
	#computeCanonicalRequestData(sortedLowercaseHeaderNames: string[]): string {
		// 1: HTTP verb
		let result = this.#httpMethod + "\n";

		// 2: Canonical URI
		result += this.#requestPath + "\n";

		// 3: Canonical query string
		result += this.canonicalQueryParameters() + "\n";

		// 4: Canonical headers
		result += this.canonicalHeaders(sortedLowercaseHeaderNames); // already includes newline

		// 5: Signed header names
		result +=
			this.#canonicalSignedHeaderNames(sortedLowercaseHeaderNames) + "\n";

		// 6: Content SHA256, hex encoded
		result += this.canonicalContentSHA256();

		return result;
	}

	/**
	 * Compute the signing key, from a secret key and based on the
	 * configured {@link Net.AuthorizationV2Builder#date date()}.
	 *
	 * This method does not save the signing key for future use in this builder instance
	 * (see {@link Net.AuthorizationV2Builder#saveSigningKey saveSigningKey()} for that).
	 * Use this method if you want to compute a signing key that you can later pass to
	 * {@link Net.AuthorizationV2Builder#buildWithKey buildWithKey()} on some other builder instance.
	 * Signing keys are valid for a maximum of 7 days, granular to whole days only.
	 * To make a signing key expire in fewer than 7 days, configure  a
	 * {@link Net.AuthorizationV2Builder#date date()} value in the past before
	 * calling this method.
	 *
	 * @param secretKey - the secret key string
	 * @returns the computed key
	 */
	computeSigningKey(secretKey: string): CryptoJS.lib.WordArray {
		const datestring = iso8601Date(this.#requestDate);
		const key = HmacSHA256(
			"snws2_request",
			HmacSHA256(datestring, "SNWS2" + secretKey)
		);
		return key;
	}

	/**
	 * Compute the data to be signed by the signing key.
	 *
	 * The signature data takes this form:
	 *
	 * ```
	 * SNWS2-HMAC-SHA256
	 * 20170301T120000Z
	 * Hex(SHA256(canonicalRequestData))
	 * ```
	 *
	 * @param canonicalRequestData - the request data, returned from {@link Net.AuthorizationV2Builder#buildCanonicalRequestData}
	 * @returns the data to sign
	 */
	computeSignatureData(canonicalRequestData: string): string {
		return (
			"SNWS2-HMAC-SHA256\n" +
			iso8601Date(this.#requestDate, true) +
			"\n" +
			Hex.stringify(SHA256(canonicalRequestData))
		);
	}

	/**
	 * Compute a HTTP `Authorization` header value from the configured properties
	 * on the builder, using the provided signing key.
	 *
	 * This method does not save the signing key for future use in this builder instance
	 * (see {@link Net.AuthorizationV2Builder#key key()} for that).
	 *
	 * @param signingKey - the key to sign the computed signature data with
	 * @returns the SNWS2 HTTP Authorization header value
	 */
	buildWithKey(signingKey: CryptoJS.lib.WordArray): string {
		const sortedHeaderNames = this.canonicalHeaderNames();
		const canonicalReq =
			this.#computeCanonicalRequestData(sortedHeaderNames);
		const signatureData = this.computeSignatureData(canonicalReq);
		const signature = Hex.stringify(HmacSHA256(signatureData, signingKey));
		const result =
			"SNWS2 Credential=" +
			this.tokenId +
			",SignedHeaders=" +
			sortedHeaderNames.join(";") +
			",Signature=" +
			signature;
		return result;
	}

	/**
	 * Compute a HTTP `Authorization` header value from the configured
	 * properties on the builder, computing a new signing key based on the
	 * configured {@link Net.AuthorizationV2Builder#date}.
	 *
	 * @param tokenSecret - the secret to sign the authorization with
	 * @return the SNWS2 HTTP Authorization header value
	 */
	build(tokenSecret: string): string {
		const signingKey = this.computeSigningKey(tokenSecret);
		return this.buildWithKey(signingKey);
	}

	/**
	 * Compute a HTTP `Authorization` header value from the configured
	 * properties on the builder, using a signing key configured from a previous
	 * call to {@link Net.AuthorizationV2Builder#saveSigningKey saveSigningKey()}
	 * or {@link Net.AuthorizationV2Builder#key key()}.
	 *
	 * @return the SNWS2 HTTP Authorization header value.
	 * @throws Error if a saved signing key is not configured
	 */
	buildWithSavedKey(): string {
		if (!this.#signingKey) {
			throw new Error("Saved signing key not available.");
		}
		return this.buildWithKey(this.#signingKey);
	}
}

/**
 * Create a case-insensitive string matching function.
 *
 * @param value - the string to perform the case-insensitive comparison against
 * @returns a matching function that performs a case-insensitive comparison
 * @private
 */
function caseInsensitiveEqualsFn(value: string): (e: string) => boolean {
	const valueLc = value.toLowerCase();
	return (e) => valueLc === e.toString().toLowerCase();
}

function _hexEscapeChar(c: string): string {
	return "%" + c.charCodeAt(0).toString(16).toUpperCase();
}

function _encodeURIComponent(str: string): string {
	return encodeURIComponent(str).replace(/[!'()*]/g, _hexEscapeChar);
}

export default AuthorizationV2Builder;
