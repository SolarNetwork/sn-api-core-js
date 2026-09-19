import { default as HttpHeaders } from "./httpHeaders.js";
import { SfItem, SfParameters } from "./structuredFields.js";
/**
 * Signature algorithms from the RFC 9421 HTTP Signature Algorithms registry.
 */
declare enum HttpSignatureAlgorithm {
    /** HMAC using SHA-256. */
    HmacSha256 = "hmac-sha256"
}
/** The `Signature-Input` HTTP header name. */
declare const SIGNATURE_INPUT_HEADER = "Signature-Input";
/** The `Signature` HTTP header name. */
declare const SIGNATURE_HEADER = "Signature";
/** The `Accept-Signature` HTTP header name. */
declare const ACCEPT_SIGNATURE_HEADER = "Accept-Signature";
/** The `Content-Digest` HTTP header name. */
declare const CONTENT_DIGEST_HEADER = "Content-Digest";
/**
 * A single covered component identifier, as defined in RFC 9421 section 2.
 */
declare class SignatureComponent {
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
    constructor(name: string, params?: SfParameters);
    /**
     * Create a component for a named query parameter.
     *
     * @param name - the encoded query parameter name
     * @returns the component
     */
    static queryParam(name: string): SignatureComponent;
    /** Test if this is a derived component, rather than an HTTP field. */
    get isDerived(): boolean;
    /** Get the serialized component identifier, including any parameters. */
    get identifier(): string;
    /** Get this component as a structured field item. */
    get item(): SfItem;
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
declare class HttpMessageSignatureBuilder {
    #private;
    /** The SolarNet auth token value. */
    tokenId: string;
    /** The signed HTTP headers. */
    httpHeaders: HttpHeaders;
    /**
     * Constructor.
     *
     * @param token - the auth token to use
     * @param url - the request URL to use
     */
    constructor(token: string, url?: string);
    /**
     * Reset to default property values.
     *
     * The token ID, label, tag, algorithm, and signing key mode are preserved.
     *
     * @returns this object
     */
    reset(): this;
    /**
     * Set the signature label.
     *
     * @param val - the label to use
     * @returns this object
     */
    label(val: string): this;
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
    /**
     * Set an HTTP header value.
     *
     * @param headerName - the header name
     * @param headerValue - the header value
     * @returns this object
     */
    header(headerName: string, headerValue: string): this;
    /**
     * Set the HTTP `Content-Type` header.
     *
     * @param val - the content type to use
     * @returns this object
     */
    contentType(val: string): this;
    /**
     * Compute a `Content-Digest` HTTP header for the request content.
     *
     * The computed header value is saved on {@link Net.HttpMessageSignatureBuilder#httpHeaders},
     * and _must_ also be passed on the HTTP request for the signature to verify.
     *
     * @param content - the request body content to digest
     * @returns this object
     */
    contentDigest(content: string): this;
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
    /**
     * Set the signature expiration date.
     *
     * @param val - the expiration date, or `undefined` for none
     * @returns this object
     */
    expires(val?: Date): this;
    /**
     * Set the signature nonce.
     *
     * @param val - the nonce, or `undefined` for none
     * @returns this object
     */
    nonce(val?: string): this;
    /**
     * Set the signature algorithm.
     *
     * The `alg` signature parameter is optional in RFC 9421, and is omitted unless set
     * here.
     *
     * @param val - the algorithm, or `undefined` to omit the parameter
     * @returns this object
     */
    algorithm(val?: HttpSignatureAlgorithm): this;
    /**
     * Set the application tag.
     *
     * SolarNetwork uses this to pick the signature meant for authentication when a
     * request carries more than one. It defaults to `solarnetwork`.
     *
     * @param val - the tag, or `undefined` for none
     * @returns this object
     */
    tag(val?: string): this;
    /**
     * Set whether to derive the signing key from the token secret and the signing date.
     *
     * This is enabled by default, so that a token secret need not be handed to whatever
     * signs the request.
     *
     * @param val - `true` to derive a signing key, `false` to use the token secret itself
     * @returns this object
     */
    derivedSigningKey(val: boolean): this;
    /**
     * Add covered components, in signing order.
     *
     * @param components - the components to cover, either names or component objects
     * @returns this object
     */
    covered(...components: (string | SignatureComponent)[]): this;
    /**
     * Cover the minimum set of components SolarNetwork requires.
     *
     * That is the request method, authority, and path, along with the query when the
     * request has one, the content type and content digest when the request has content,
     * and every `X-SN-*` header configured on this builder.
     *
     * @returns this object
     */
    coverRequiredComponents(): this;
    /** Get the covered components, in signing order. */
    get coveredComponents(): SignatureComponent[];
    /** Get the `keyid` signature parameter value. */
    get keyId(): string;
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
    computeSigningKey(tokenSecret: string): CryptoJS.lib.WordArray | string;
    /**
     * Compute the serialized signature parameters.
     *
     * This is the value of the `@signature-params` line of the signature base, and also
     * the `Signature-Input` member value.
     *
     * @returns the serialized signature parameters
     */
    signatureParams(): string;
    /**
     * Compute the signature base.
     *
     * @returns the signature base
     * @throws Error if a covered component value is not available
     */
    signatureBase(): SignatureBaseResult;
    /**
     * Compute the signature value, using a signing key.
     *
     * @param signingKey - the signing key
     * @returns the Base64 encoded signature value
     */
    signWithKey(signingKey: CryptoJS.lib.WordArray | string): string;
    /**
     * Compute the signature value, using a token secret.
     *
     * @param tokenSecret - the token secret
     * @returns the Base64 encoded signature value
     */
    sign(tokenSecret: string): string;
    /**
     * Get the `Signature-Input` HTTP header value.
     *
     * @returns the header value
     */
    signatureInputHeaderValue(): string;
    /**
     * Get the `Signature` HTTP header value, using a token secret.
     *
     * @param tokenSecret - the token secret
     * @returns the header value
     */
    signatureHeaderValue(tokenSecret: string): string;
    /**
     * Get the `Signature` HTTP header value, using a signing key.
     *
     * @param signingKey - the signing key
     * @returns the header value
     */
    signatureHeaderValueWithKey(signingKey: CryptoJS.lib.WordArray | string): string;
}
export default HttpMessageSignatureBuilder;
export { ACCEPT_SIGNATURE_HEADER, CONTENT_DIGEST_HEADER, HttpSignatureAlgorithm, SIGNATURE_HEADER, SIGNATURE_INPUT_HEADER, SignatureComponent, type SignatureBaseResult, };
//# sourceMappingURL=httpSignatures.d.ts.map