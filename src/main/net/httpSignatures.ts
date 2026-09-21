import Base64 from "crypto-js/enc-base64.js";
import HmacSHA256 from "crypto-js/hmac-sha256.js";
import SHA256 from "crypto-js/sha256.js";

import { iso8601Date } from "../util/dates.js";
import { default as HttpHeaders, HttpMethod } from "./httpHeaders.js";
import {
	SfByteSequence,
	SfItem,
	SfParameters,
	serializeDictionaryMember,
	serializeInnerList,
	serializeItem,
	serializeString,
} from "./structuredFields.js";

/**
 * Signature algorithms from the RFC 9421 HTTP Signature Algorithms registry.
 */
enum HttpSignatureAlgorithm {
	/** HMAC using SHA-256. */
	HmacSha256 = "hmac-sha256",
}

/** The `Signature-Input` HTTP header name. */
const SIGNATURE_INPUT_HEADER = "Signature-Input";

/** The `Signature` HTTP header name. */
const SIGNATURE_HEADER = "Signature";

/** The `Accept-Signature` HTTP header name. */
const ACCEPT_SIGNATURE_HEADER = "Accept-Signature";

/** The `Content-Digest` HTTP header name. */
const CONTENT_DIGEST_HEADER = "Content-Digest";

/** The scheme literal used when deriving a signing key. */
const SIGNING_KEY_SCHEME = "SNWS3";

/** The message used to sign the derived signing key. */
const SIGNING_KEY_MESSAGE = "snws3_request";

/** The default application tag for SolarNetwork signatures. */
const DEFAULT_TAG = "solarnetwork";

/**
 * A single covered component identifier, as defined in RFC 9421 section 2.
 */
class SignatureComponent {
	/** The component name, in lower case. */
	readonly name: string;

	/** The component parameters, in serialization order. */
	readonly params?: SfParameters;

	/**
	 * Constructor.
	 *
	 * @param name - the component name, which will be lower-cased
	 * @param params - the component parameters, in serialization order
	 */
	constructor(name: string, params?: SfParameters) {
		this.name = name.toLowerCase();
		this.params = params;
	}

	/**
	 * Create a component for a named query parameter.
	 *
	 * @param name - the encoded query parameter name
	 * @returns the component
	 */
	static queryParam(name: string): SignatureComponent {
		return new SignatureComponent(
			"@query-param",
			new Map([["name", name]])
		);
	}

	/** Test if this is a derived component, rather than an HTTP field. */
	get isDerived(): boolean {
		return this.name.startsWith("@");
	}

	/** Get the serialized component identifier, including any parameters. */
	get identifier(): string {
		return serializeItem(this.item);
	}

	/** Get this component as a structured field item. */
	get item(): SfItem {
		return { value: this.name, params: this.params };
	}
}

/**
 * The result of computing a signature base.
 *
 * The individual lines are kept alongside the joined value because the signature
 * base is the exact string the signer and the verifier must both produce: when a
 * signature is rejected, comparing the two line by line is what locates the
 * difference.
 */
interface SignatureBaseResult {
	/** The individual lines, the last of which is the `@signature-params` line. */
	lines: string[];

	/** The complete signature base value. */
	value: string;

	/** The serialized signature parameters, which is also the `Signature-Input` member value. */
	signatureParams: string;
}

/**
 * A builder for RFC 9421 HTTP message signatures on a SolarNetwork API request.
 *
 * This is the RFC 9421 counterpart to {@link Net.AuthorizationV2Builder}, and uses the
 * same security token credentials. A request is signed by covering a set of message
 * components; SolarNetwork requires a minimum set of them, which
 * {@link Net.HttpMessageSignatureBuilder#coverRequiredComponents coverRequiredComponents()}
 * configures:
 *
 * ```
 * const builder = new HttpMessageSignatureBuilder("my-token")
 *     .method(HttpMethod.GET)
 *     .url("https://data.solarnetwork.net/solarquery/api/v1/sec/datum/stream/datum?nodeId=123")
 *     .coverRequiredComponents();
 *
 * headers.set("Signature-Input", builder.signatureInputHeaderValue());
 * headers.set("Signature", builder.signatureHeaderValue("my-token-secret"));
 * ```
 *
 * By default the signing key is derived from the token secret and the signing date,
 * which works like the SNWS2 signing key in that it expires, and so can be handed to a
 * signer without disclosing the secret. To sign with the token secret itself instead,
 * which is what any RFC 9421 implementation can do with only the token ID and secret:
 *
 * ```
 * builder.derivedSigningKey(false);
 * ```
 *
 * ## Post requests
 *
 * RFC 9421 has no notion of message content: a request body is covered by covering a
 * `Content-Digest` field that digests it. Use
 * {@link Net.HttpMessageSignatureBuilder#contentDigest contentDigest()} to compute that
 * field, and pass the same value on the request.
 *
 * ```
 * const body = JSON.stringify({foo: "bar"});
 * const builder = new HttpMessageSignatureBuilder("my-token")
 *     .method(HttpMethod.POST)
 *     .url("https://data.solarnetwork.net/solaruser/api/v1/sec/...")
 *     .contentType("application/json")
 *     .contentDigest(body)
 *     .coverRequiredComponents();
 * ```
 */
class HttpMessageSignatureBuilder {
	/** The SolarNet auth token value. */
	tokenId: string;

	/** The signed HTTP headers. */
	httpHeaders: HttpHeaders;

	#label: string;
	#httpMethod: string;
	#url: URL;
	#components: SignatureComponent[];
	#created: Date;
	#expires?: Date;
	#nonce?: string;
	#algorithm?: HttpSignatureAlgorithm;
	#tag?: string;
	#derivedSigningKey: boolean;

	/**
	 * Constructor.
	 *
	 * @param token - the auth token to use
	 * @param url - the request URL to use
	 */
	constructor(token: string, url?: string) {
		this.tokenId = token;
		this.httpHeaders = new HttpHeaders();
		this.#label = "sn";
		this.#httpMethod = HttpMethod.GET;
		// the WHATWG URL parser is used rather than the uri-js parser AuthorizationV2Builder
		// uses, because RFC 9421 section 2.2.7 requires that percent-encoded octets in the
		// query are not decoded, and uri-js normalizes them away
		this.#url = new URL(url || "https://data.solarnetwork.net/");
		this.#components = [];
		this.#created = new Date();
		this.#tag = DEFAULT_TAG;
		this.#derivedSigningKey = true;
	}

	/**
	 * Reset to default property values.
	 *
	 * The token ID, label, tag, algorithm, and signing key mode are preserved.
	 *
	 * @returns this object
	 */
	reset(): this {
		this.#httpMethod = HttpMethod.GET;
		this.#components = [];
		this.#created = new Date();
		this.#expires = undefined;
		this.#nonce = undefined;
		this.httpHeaders.clear();
		return this;
	}

	/**
	 * Set the signature label.
	 *
	 * @param val - the label to use
	 * @returns this object
	 */
	label(val: string): this {
		this.#label = val;
		return this;
	}

	/**
	 * Get the HTTP method (verb) to use.
	 *
	 * @returns the HTTP method to use
	 */
	method(): string;

	/**
	 * Set the HTTP method (verb) to use.
	 *
	 * @param val - the method to use; see the {@link Net.HttpMethod} enum for possible values
	 * @returns this object
	 */
	method(val: string): this;

	method(val?: string): string | this {
		if (val === undefined) {
			return this.#httpMethod;
		}
		this.#httpMethod = val;
		return this;
	}

	/**
	 * Get the request URL.
	 *
	 * @returns the request URL
	 */
	url(): string;

	/**
	 * Set the request URL.
	 *
	 * @param val - the absolute request URL to use
	 * @returns this object
	 */
	url(val: string): this;

	url(val?: string): string | this {
		if (val === undefined) {
			return this.#url.toString();
		}
		this.#url = new URL(val);
		return this;
	}

	/**
	 * Set an HTTP header value.
	 *
	 * @param headerName - the header name
	 * @param headerValue - the header value
	 * @returns this object
	 */
	header(headerName: string, headerValue: string): this {
		this.httpHeaders.put(headerName, headerValue);
		return this;
	}

	/**
	 * Set the HTTP `Content-Type` header.
	 *
	 * @param val - the content type to use
	 * @returns this object
	 */
	contentType(val: string): this {
		return this.header(HttpHeaders.CONTENT_TYPE, val);
	}

	/**
	 * Compute a `Content-Digest` HTTP header for the request content.
	 *
	 * The computed header value is saved on {@link Net.HttpMessageSignatureBuilder#httpHeaders},
	 * and _must_ also be passed on the HTTP request for the signature to verify. The
	 * {@link Net.HttpMessageSignatureBuilder#contentDigestHeaderValue} method can be used to
	 * obtain the header value after calling this method.
	 *
	 * @param content - the request body content to digest
	 * @returns this object
	 */
	contentDigest(content: string): this {
		const value = "sha-256=:" + Base64.stringify(SHA256(content)) + ":";
		return this.header(CONTENT_DIGEST_HEADER, value);
	}

	/**
	 * Get the `Content-Digest` HTTP header value.
	 *
	 * The {@link Net.HttpMessageSignatureBuilder#contentDigest} method should
	 * be called to compute the header value before calling this method.
	 *
	 * @returns the header value, or `undefined` if none set
	 */
	contentDigestHeaderValue(): string | undefined {
		return this.httpHeaders.firstValue(CONTENT_DIGEST_HEADER);
	}

	/**
	 * Get the request date.
	 *
	 * @returns the signature creation date
	 */
	date(): Date;

	/**
	 * Set the request date.
	 *
	 * @param val - the signature creation date to use
	 * @returns this object
	 */
	date(val: Date): this;

	date(val?: Date): Date | this {
		if (val === undefined) {
			return this.#created;
		}
		this.#created = val;
		return this;
	}

	/**
	 * Set the signature expiration date.
	 *
	 * @param val - the expiration date, or `undefined` for none
	 * @returns this object
	 */
	expires(val?: Date): this {
		this.#expires = val;
		return this;
	}

	/**
	 * Set the signature nonce.
	 *
	 * @param val - the nonce, or `undefined` for none
	 * @returns this object
	 */
	nonce(val?: string): this {
		this.#nonce = val;
		return this;
	}

	/**
	 * Set the signature algorithm.
	 *
	 * The `alg` signature parameter is optional in RFC 9421, and is omitted unless set
	 * here.
	 *
	 * @param val - the algorithm, or `undefined` to omit the parameter
	 * @returns this object
	 */
	algorithm(val?: HttpSignatureAlgorithm): this {
		this.#algorithm = val;
		return this;
	}

	/**
	 * Set the application tag.
	 *
	 * SolarNetwork uses this to pick the signature meant for authentication when a
	 * request carries more than one. It defaults to `solarnetwork`.
	 *
	 * @param val - the tag, or `undefined` for none
	 * @returns this object
	 */
	tag(val?: string): this {
		this.#tag = val;
		return this;
	}

	/**
	 * Set whether to derive the signing key from the token secret and the signing date.
	 *
	 * This is enabled by default, so that a token secret need not be handed to whatever
	 * signs the request.
	 *
	 * @param val - `true` to derive a signing key, `false` to use the token secret itself
	 * @returns this object
	 */
	derivedSigningKey(val: boolean): this {
		this.#derivedSigningKey = val;
		return this;
	}

	/**
	 * Add covered components, in signing order.
	 *
	 * @param components - the components to cover, either names or component objects
	 * @returns this object
	 */
	covered(...components: (string | SignatureComponent)[]): this {
		for (const c of components) {
			this.#components.push(
				typeof c === "string" ? new SignatureComponent(c) : c
			);
		}
		return this;
	}

	/**
	 * Cover the minimum set of components SolarNetwork requires.
	 *
	 * That is the request method, authority, and path, along with the query when the
	 * request has one, the content type and content digest when the request has content,
	 * and every `X-SN-*` header configured on this builder.
	 *
	 * @returns this object
	 */
	coverRequiredComponents(): this {
		this.covered("@method", "@authority", "@path");
		if (this.#url.search) {
			this.covered("@query");
		}
		const names = this.httpHeaders.keySet();
		for (const name of names) {
			const lc = name.toLowerCase();
			if (
				lc === "content-type" ||
				lc === "content-digest" ||
				lc.startsWith("x-sn-")
			) {
				this.covered(lc);
			}
		}
		return this;
	}

	/** Get the covered components, in signing order. */
	get coveredComponents(): SignatureComponent[] {
		return this.#components.slice();
	}

	/** Get the `keyid` signature parameter value. */
	get keyId(): string {
		// iso8601Date() with no time renders the YYYYMMDD form the signing key uses
		return this.#derivedSigningKey
			? this.tokenId + ":" + iso8601Date(this.#created)
			: this.tokenId;
	}

	/**
	 * Compute the signing key from a token secret.
	 *
	 * When a derived signing key is configured this is
	 * `HMAC(HMAC("SNWS3"+secret, "YYYYMMDD"), "snws3_request")`, which expires like an
	 * SNWS2 signing key does. Otherwise it is the token secret itself.
	 *
	 * @param tokenSecret - the token secret
	 * @returns the signing key
	 */
	computeSigningKey(tokenSecret: string): CryptoJS.lib.WordArray | string {
		if (!this.#derivedSigningKey) {
			return tokenSecret;
		}
		const datestring = iso8601Date(this.#created);
		return HmacSHA256(
			SIGNING_KEY_MESSAGE,
			HmacSHA256(datestring, SIGNING_KEY_SCHEME + tokenSecret)
		);
	}

	/**
	 * Compute the serialized signature parameters.
	 *
	 * This is the value of the `@signature-params` line of the signature base, and also
	 * the `Signature-Input` member value.
	 *
	 * @returns the serialized signature parameters
	 */
	signatureParams(): string {
		const params: SfParameters = new Map();
		params.set("created", Math.floor(this.#created.getTime() / 1000));
		if (this.#expires) {
			params.set("expires", Math.floor(this.#expires.getTime() / 1000));
		}
		if (this.#nonce) {
			params.set("nonce", this.#nonce);
		}
		if (this.#algorithm) {
			params.set("alg", this.#algorithm);
		}
		params.set("keyid", this.keyId);
		if (this.#tag) {
			params.set("tag", this.#tag);
		}
		return serializeInnerList(
			this.#components.map((c) => c.item),
			params
		);
	}

	/**
	 * Compute the signature base.
	 *
	 * @returns the signature base
	 * @throws Error if a covered component value is not available
	 */
	signatureBase(): SignatureBaseResult {
		const lines: string[] = [];
		const seen = new Set<string>();
		for (const component of this.#components) {
			const identifier = component.identifier;
			if (seen.has(identifier)) {
				throw new Error(
					"The component " +
						identifier +
						" is covered more than once."
				);
			}
			seen.add(identifier);
			lines.push(identifier + ": " + this.#componentValue(component));
		}
		const signatureParams = this.signatureParams();
		lines.push(
			serializeString("@signature-params") + ": " + signatureParams
		);
		return { lines, value: lines.join("\n"), signatureParams };
	}

	#componentValue(component: SignatureComponent): string {
		if (!component.isDerived) {
			const values = this.httpHeaders.value(component.name);
			if (!values || values.length < 1) {
				throw new Error(
					"The [" +
						component.name +
						"] HTTP field is covered by the signature but is not set."
				);
			}
			return values.map((v) => String(v).trim()).join(", ");
		}
		const url = this.#url;
		switch (component.name) {
			case "@method":
				return this.#httpMethod;
			case "@target-uri":
				return (
					url.protocol + "//" + url.host + url.pathname + url.search
				);
			case "@authority":
				// URL already lower-cases the host and omits a default port
				return url.host;
			case "@scheme":
				return url.protocol.slice(0, -1);
			case "@request-target":
				return url.pathname + url.search;
			case "@path":
				return url.pathname;
			case "@query":
				return url.search || "?";
			case "@query-param":
				return this.#queryParamValue(component);
			default:
				throw new Error(
					"The derived component " +
						component.identifier +
						" is not supported."
				);
		}
	}

	#queryParamValue(component: SignatureComponent): string {
		const encodedName = component.params?.get("name");
		if (typeof encodedName !== "string") {
			throw new Error(
				"The component " +
					component.identifier +
					" requires a 'name' parameter."
			);
		}
		const values = queryParamValues(
			this.#url.search.replace(/^\?/, ""),
			decodeQueryComponent(encodedName)
		);
		if (values.length < 1) {
			throw new Error(
				"The query parameter covered by " +
					component.identifier +
					" is not present in the request."
			);
		}
		if (values.length > 1) {
			throw new Error(
				"The query parameter covered by " +
					component.identifier +
					" occurs more than once in the request."
			);
		}
		return values[0];
	}

	/**
	 * Compute the signature value, using a signing key.
	 *
	 * @param signingKey - the signing key
	 * @returns the Base64 encoded signature value
	 */
	signWithKey(signingKey: CryptoJS.lib.WordArray | string): string {
		return Base64.stringify(
			HmacSHA256(this.signatureBase().value, signingKey)
		);
	}

	/**
	 * Compute the signature value, using a token secret.
	 *
	 * @param tokenSecret - the token secret
	 * @returns the Base64 encoded signature value
	 */
	sign(tokenSecret: string): string {
		return this.signWithKey(this.computeSigningKey(tokenSecret));
	}

	/**
	 * Get the `Signature-Input` HTTP header value.
	 *
	 * @returns the header value
	 */
	signatureInputHeaderValue(): string {
		return serializeDictionaryMember(this.#label, this.signatureParams());
	}

	/**
	 * Get the `Signature` HTTP header value, using a token secret.
	 *
	 * @param tokenSecret - the token secret
	 * @returns the header value
	 */
	signatureHeaderValue(tokenSecret: string): string {
		return this.signatureHeaderValueWithKey(
			this.computeSigningKey(tokenSecret)
		);
	}

	/**
	 * Get the `Signature` HTTP header value, using a signing key.
	 *
	 * @param signingKey - the signing key
	 * @returns the header value
	 */
	signatureHeaderValueWithKey(
		signingKey: CryptoJS.lib.WordArray | string
	): string {
		return serializeDictionaryMember(
			this.#label,
			serializeItem({
				value: new SfByteSequence(this.signWithKey(signingKey)),
			})
		);
	}
}

/**
 * Decode a query string component.
 *
 * This applies the `application/x-www-form-urlencoded` parsing rules: a `+` character
 * means a space, and percent-encoded octets are decoded as UTF-8.
 *
 * @param value - the raw value
 * @returns the decoded value
 */
function decodeQueryComponent(value: string): string {
	return decodeURIComponent(value.replace(/\+/g, " "));
}

/**
 * Encode a query string component.
 *
 * This applies the "percent-encode after encoding" process with the
 * `application/x-www-form-urlencoded` percent-encode set. Note that unlike the full
 * form-urlencoded serializer, a space is encoded as `%20` rather than `+`, which is
 * what RFC 9421 section 2.2.8 calls for.
 *
 * @param value - the decoded value
 * @returns the encoded value
 */
function encodeQueryComponent(value: string): string {
	return encodeURIComponent(value).replace(
		/[!'()~]/g,
		(c) => "%" + c.charCodeAt(0).toString(16).toUpperCase()
	);
}

/**
 * Get the encoded values of a named query parameter.
 *
 * @param rawQuery - the raw query string, without the leading `?` character
 * @param name - the decoded parameter name to look for
 * @returns the encoded values, in query string order
 */
function queryParamValues(rawQuery: string, name: string): string[] {
	const result: string[] = [];
	if (!rawQuery) {
		return result;
	}
	for (const pair of rawQuery.split("&")) {
		if (!pair) {
			continue;
		}
		const idx = pair.indexOf("=");
		const rawName = idx < 0 ? pair : pair.substring(0, idx);
		if (decodeQueryComponent(rawName) !== name) {
			continue;
		}
		const rawValue = idx < 0 ? "" : pair.substring(idx + 1);
		result.push(encodeQueryComponent(decodeQueryComponent(rawValue)));
	}
	return result;
}

export default HttpMessageSignatureBuilder;
export {
	ACCEPT_SIGNATURE_HEADER,
	CONTENT_DIGEST_HEADER,
	HttpSignatureAlgorithm,
	SIGNATURE_HEADER,
	SIGNATURE_INPUT_HEADER,
	SignatureComponent,
	type SignatureBaseResult,
};
