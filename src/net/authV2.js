import Hex from 'crypto-js/enc-hex';
import HmacSHA256 from 'crypto-js/hmac-sha256';
import SHA256 from 'crypto-js/sha256';
import { parse as uriParse } from 'uri-js';

import { iso8601Date } from '../format/date';
import MultiMap from '../util/multiMap';
import Environment from './environment';
import { HttpMethod, default as HttpHeaders } from './httpHeaders';
import { urlQueryParse } from './urlQuery';

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
 */
class AuthorizationV2Builder {

    /**
     * Constructor.
     * 
     * @param {string} token the auth token to use
     * @param {Environment} [environment] the environment to use; if not provided a default environment will be created 
     */
    constructor(token, environment) {
        this.tokenId = token;
        this.environment = (environment || new Environment());
        this.reset();
    }

    /**
     * Reset to defalut property values.
     *
     * @returns {AuthorizationV2Builder} this object
     */
    reset() {
        this.contentDigest = null;
        this.httpHeaders = new HttpHeaders();
        this.parameters = new MultiMap();
        this.signedHeaderNames = [];
        var host = this.environment.host;
        if ( this.environment.protocol === 'https' || this.environment.port != 80 ) {
            host += ':' +this.environment.port;
        }
        return this.method(HttpMethod.GET).host(host).path('/').date(new Date());
    }

    /**
     * Compute and cache the signing key.
     *
     * Signing keys are derived from the token secret and valid for 7 days, so
     * this method can be used to compute a signing key so that {@link AuthorizationV2Builder#build}
     * can be called later. The signing date will be set to whatever date is
     * currently configured via {@link AuthorizationV2Builder#date}, which defaults to the
     * current time for newly created builder instances.
     *
     * @param {string} tokenSecret the secret to sign the digest with
     * @returns {AuthorizationV2Builder} this object
     */
    saveSigningKey(tokenSecret) {
        this.signingKey = this.computeSigningKey(tokenSecret);
        return this;
    }

    /**
     * Set the HTTP method (verb) to use.
     *
     * @param {string} val the method to use; see the {@link HttpMethod} enum for possible values
     * @returns {AuthorizationV2Builder} this object
     */
    method(val) {
        this.httpMethod = val;
        return this;
    }

    /**
     * Set the HTTP host.
     *
     * This is a shortcut for calling <code>HttpHeaders#put(HttpHeaders.HOST, val)</code>.
     *
     * @param {string} val the HTTP host value to use
     * @returns {AuthorizationV2Builder} this object
     */
    host(val) {
        this.httpHeaders.put(HttpHeaders.HOST, val);
        return this;
    }

    /**
     * Set the HTTP request path to use.
     *
     * @param {string} val the request path to use
     * @returns {AuthorizationV2Builder} this object
     */
    path(val) {
        this.requestPath = val;
        return this;
    }

    /**
     * Set the host, path, and query parameters via a URL string.
     *
     * @param {string} url the URL value to use
     * @returns {AuthorizationV2Builder} this object
     */
    url(url) {
        const uri = uriParse(url);
        let host = uri.host;
        if ( uri.port && ((uri.scheme === 'https' && uri.port !== 443) || (uri.scheme === 'http' && uri.port !== 80)) ) {
            host += ':' + uri.port;
        }
        if ( uri.query ) {
            this.queryParams(urlQueryParse(uri.query));
        }
        return this.host(host).path(uri.path);
    }

    /**
     * Set the HTTP content type.
     *
     * This is a shortcut for calling {@link HttpHeaders#put} with the key {@link HttpHeaders#CONTENT_TYPE}.
     *
     * @param {string} val the HTTP content type value to use
     * @returns {AuthorizationV2Builder} this object
     */
    contentType(val) {
        this.httpHeaders.put(HttpHeaders.CONTENT_TYPE, val);
        return this;
    }

    /**
     * Set the authorization request date.
     *
     * @param {Date} val the date to use; typically the current time, e.g. <code>new Date()</code>
     * @returns {AuthorizationV2Builder} this object
     */
    date(val) {
        this.requestDate = (val ? val : new Date());
        return this;
    }

    /**
     * The authorization request date as a HTTP header string value.
     *
     * @readonly
     * @type {string}
     */
    get requestDateHeaderValue() {
        return this.requestDate.toUTCString();
    }

    /**
     * Control using the <code>X-SN-Date</code> HTTP header versus the <code>Date</code> header.
     *
     * <p>Set to <code>true</code> to use the <code>X-SN-Date</code> header, <code>false</code> to use 
     * the <code>Date</code> header. This will return <code>true</code> if <code>X-SN-Date</code> has been
     * added to the <code>signedHeaderNames</code> property or has been added to the <code>httpHeaders</code>
     * property.</p>
     *
     * @type {boolean}
     */
    get useSnDate() {
        let signedHeaders = this.signedHeaderNames;
        let existingIndex = (Array.isArray(signedHeaders)
            ? signedHeaders.findIndex(caseInsensitiveEqualsFn(HttpHeaders.X_SN_DATE))
            : -1);
        return existingIndex >= 0 || this.httpHeaders.containsKey(HttpHeaders.X_SN_DATE);
    }

    set useSnDate(enabled) {
        let signedHeaders = this.signedHeaderNames;
        let existingIndex = (Array.isArray(signedHeaders)
            ? signedHeaders.findIndex(caseInsensitiveEqualsFn(HttpHeaders.X_SN_DATE))
            : -1);
        if ( enabled && existingIndex < 0 ) {
            signedHeaders = (signedHeaders
                ? signedHeaders.concat(HttpHeaders.X_SN_DATE)
                : [HttpHeaders.X_SN_DATE]);
            this.signedHeaderNames = signedHeaders;
        } else if ( !enabled && existingIndex >= 0 ) {
            signedHeaders.splice(existingIndex, 1);
            this.signedHeaderNames = signedHeaders;
        }

        // also clear from httpHeaders
        this.httpHeaders.remove(HttpHeaders.X_SN_DATE);
    }

    /**
     * Set the <code>useSnDate</code> property.
     *
     * @param {boolean} enabled <code>true</code> to use the <code>X-SN-Date</code> header, <code>false</code> to use <code>Date</code>
     * @returns {AuthorizationV2Builder} this object
     */
    snDate(enabled) {
        this.useSnDate = enabled;
        return this;
    }

    /**
     * Set a HTTP header value.
     *
     * This is a shortcut for calling <code>HttpHeaders#put(headerName, val)</code>.
     *
     * @param {string} headerName the header name to set
     * @param {string} headerValue the header value to set
     * @returns {AuthorizationV2Builder} this object
     */
    header(headerName, headerValue) {
        this.httpHeaders.put(headerName, headerValue);
        return this;
    }

    /**
     * Set the HTTP headers to use with the request.
     *
     * The headers object must include all headers necessary by the
     * authentication scheme, and any additional headers also configured via
     * {@link AuthorizationV2Builder#signedHttpHeaders}.
     *
     * @param {HttpHeaders} headers the HTTP headers to use
     * @returns {AuthorizationV2Builder} this object
     */
    headers(headers) {
        this.httpHeaders = headers;
        return this;
    }

    /**
     * Set the HTTP <code>GET</code> query parameters, or <code>POST</code> form-encoded
     * parameters.
     *
     * @param {MultiMap|Object} params the parameters to use, as either a {@link MultiMap} or simple <code>Object</code>
     * @returns {AuthorizationV2Builder} this object
     */
    queryParams(params) {
        if ( params instanceof MultiMap ) {
            this.parameters = params;
        } else {
            this.parameters.putAll(params);
        }
        return this;
    }

    /**
     * Set additional HTTP header names to sign with the authentication.
     *
     * @param {sring[]} signedHeaderNames additional HTTP header names to include in the signature
     * @returns {AuthorizationV2Builder} this object
     */
    signedHttpHeaders(signedHeaderNames) {
        this.signedHeaderNames = signedHeaderNames;
        return this;
    }

    /**
     * Set the HTTP request body content SHA-256 digest value.
     *
     * @param {string|WordArray} digest the digest value to use; if a string it is assumed to be Hex encoded
     * @returns {AuthorizationV2Builder} this object
     */
    contentSHA256(digest) {
        var contentDigest;
        if ( typeof digest === 'string' ) {
            contentDigest = Hex.parse(digest);
        } else {
            contentDigest = digest;
        }
        this.contentDigest = contentDigest;
        return this;
    }

    /**
     * Compute the canonical query parameters.
     * 
     * @returns {string} the canonical query parameters string value
     */
    canonicalQueryParameters() {
        const keys = this.parameters.keySet();
        if ( keys.length < 1 ) {
            return '';
        }
        keys.sort();
        const len = keys.length;
        var first = true,
            result = '';
        for ( let i = 0; i < len; i += 1 ) {
            let key = keys[i];
            let vals = this.parameters.value(key);
            const valsLen = vals.length;
            for ( let j = 0; j < valsLen; j += 1 ) {
                if ( first ) {
                    first = false;
                } else {
                    result += '&';
                }
                result += _encodeURIComponent(key) + '=' + _encodeURIComponent(vals[j]);
            }
        }
        return result;
    }

    /**
     * Compute the canonical HTTP headers string value.
     * 
     * @param {string[]} sortedLowercaseHeaderNames the sorted, lower-cased HTTP header names to include
     * @returns {string} the canonical headers string value
     */
    canonicalHeaders(sortedLowercaseHeaderNames) {
        var result = '',
            headerName,
            headerValue;
        const len = sortedLowercaseHeaderNames.length;
        for ( let i = 0; i < len; i += 1 ) {
            headerName = sortedLowercaseHeaderNames[i];
            if ( "date" === headerName ||  "x-sn-date" === headerName ) {
                headerValue = this.requestDate.toUTCString();
            } else {
                headerValue = this.httpHeaders.firstValue(headerName);
            }
            result += headerName +':' + (headerValue ? headerValue.trim() : '') + '\n';
        }
        return result;
    }

    /**
     * Compute the canonical signed header names value from an array of HTTP header names.
     * 
     * @param {string[]} sortedLowercaseHeaderNames the sorted, lower-cased HTTP header names to include
     * @returns {string} the canonical signed header names string value
     * @private
     */
    canonicalSignedHeaderNames(sortedLowercaseHeaderNames) {
        return sortedLowercaseHeaderNames.join(';');
    }

    /**
     * Get the canonical request content SHA256 digest, hex encoded.
     * 
     * @returns {string} the hex-encoded SHA256 digest of the request content
     */
    canonicalContentSHA256() {
        return (this.contentDigest
            ? Hex.stringify(this.contentDigest)
            : AuthorizationV2Builder.EMPTY_STRING_SHA256_HEX);
    }

    /**
     * Compute the canonical HTTP header names to include in the signature.
     * 
     * @returns {string[]} the sorted, lower-cased HTTP header names to include
     */
    canonicalHeaderNames() {
        const httpHeaders = this.httpHeaders;
        const signedHeaderNames = this.signedHeaderNames;

        // use a MultiMap to take advantage of case-insensitive keys
        const map = new MultiMap();

        map.put(HttpHeaders.HOST, true);
        if ( this.useSnDate ) {
            map.put(HttpHeaders.X_SN_DATE, true);
        } else {
            map.put(HttpHeaders.DATE, true);
        }
        if ( httpHeaders.containsKey(HttpHeaders.CONTENT_MD5) ) {
            map.put(HttpHeaders.CONTENT_MD5, true);
        }
        if ( httpHeaders.containsKey(HttpHeaders.CONTENT_TYPE) ) {
            map.put(HttpHeaders.CONTENT_TYPE, true);
        }
        if ( httpHeaders.containsKey(HttpHeaders.DIGEST) ) {
            map.put(HttpHeaders.DIGEST, true);
        }
        if ( signedHeaderNames && signedHeaderNames.length > 0 ) {
            signedHeaderNames.forEach(e => map.put(e, true));
        }
        return lowercaseSortedArray(map.keySet());
    }

    /**
     * Compute the canonical request data that will be included in the data to sign with the request.
     * 
     * @returns {string} the canonical request data
     */
    buildCanonicalRequestData() {
        return this.computeCanonicalRequestData(this.canonicalHeaderNames());
    }

    /**
     * Compute the canonical request data that will be included in the data to sign with the request,
     * using a specific set of HTTP header names to sign.
     * 
     * @param {string[]} sortedLowercaseHeaderNames the sorted, lower-cased HTTP header names to sign with the request
     * @returns {string} the canonical request data
     * @private
     */
    computeCanonicalRequestData(sortedLowercaseHeaderNames) {
        // 1: HTTP verb
        var result = this.httpMethod +'\n';

        // 2: Canonical URI
        result += this.requestPath + '\n';

        // 3: Canonical query string
        result += this.canonicalQueryParameters() + '\n';

        // 4: Canonical headers
        result += this.canonicalHeaders(sortedLowercaseHeaderNames); // already includes newline

        // 5: Signed header names
        result += this.canonicalSignedHeaderNames(sortedLowercaseHeaderNames) + '\n';

        // 6: Content SHA256, hex encoded
        result += this.canonicalContentSHA256();

        return result;
    }

    /**
     * Compute the signing key, from a secret key.
     * 
     * @param {string} secretKey the secret key string 
     * @returns {CryptoJS#Hash} the computed key
     * @private
     */
    computeSigningKey(secretKey) {
        const datestring = iso8601Date(this.requestDate);
        const key = HmacSHA256('snws2_request', HmacSHA256(datestring, 'SNWS2' + secretKey));
        return key;
    }

    /**
     * Compute the data to be signed by the signing key.
     * 
     * @param {string} canonicalRequestData the request data, returned from {@link AuthorizationV2Builder#buildCanonicalRequestData}
     * @returns {string} the data to sign
     * @private
     */
    computeSignatureData(canonicalRequestData) {
        /*- signature data is like:

            SNWS2-HMAC-SHA256\n
            20170301T120000Z\n
            Hex(SHA256(canonicalRequestData))
        */
        return "SNWS2-HMAC-SHA256\n" + iso8601Date(this.requestDate, true) + "\n"
                + Hex.stringify(SHA256(canonicalRequestData));
    }

    /**
     * Compute a HTTP <code>Authorization</code> header value from the configured properties
     * on the builder, using the provided signing key.
     * 
     * @param {CryptoJS#Hash} signingKey the key to sign the computed signature data with
     * @returns {string} the SNWS2 HTTP Authorization header value
     * @private
     */
    buildWithKey(signingKey) {
        const sortedHeaderNames = this.canonicalHeaderNames();
        const canonicalReq = this.computeCanonicalRequestData(sortedHeaderNames);
        const signatureData = this.computeSignatureData(canonicalReq);
        const signature = Hex.stringify(HmacSHA256(signatureData, signingKey));
        let result = 'SNWS2 Credential=' + this.tokenId
            + ',SignedHeaders=' + sortedHeaderNames.join(';')
            + ',Signature=' +signature;
        return result;
    }

    /**
     * Compute a HTTP <code>Authorization</code> header value from the configured
     * properties on the builder, computing a new signing key based on the
     * configured {@link AuthorizationV2Builder#date}.
     *
     * @param {string} tokenSecret the secret to sign the authorization with
     * @return {string} the SNWS2 HTTP Authorization header value
     */
    build(tokenSecret) {
        const signingKey = this.computeSigningKey(tokenSecret);
        return this.buildWithKey(signingKey);
    }

    /**
     * Compute a HTTP <code>Authorization</code> header value from the configured
     * properties on the builder, using a signing key configured from a previous
     * call to {@link AuthorizationV2Builder#saveSigningKey}.
     *
     * @return {string} the SNWS2 HTTP Authorization header value.
     */
    buildWithSavedKey() {
        return this.buildWithKey(this.signingKey);
    }

}

/**
 * @function stringMatchFn
 * @param {string} e the element to test
 * @returns {boolean} <code>true</code> if the element matches
 * @private
 */


/**
 * Create a case-insensitive string matching function.
 * 
 * @param {string} value the string to perform the case-insensitive comparison against
 * @returns {stringMatchFn} a matching function that performs a case-insensitive comparison
 * @private
 */
function caseInsensitiveEqualsFn(value) {
    const valueLc = value.toLowerCase();
    return e => valueLc === e.toString().toLowerCase();
}

/**
 * Create a new array of lower-cased and sorted strings from another array.
 * 
 * @param {string[]} items the items to lower-case and sort
 * @returns {string[]} a new array of the lower-cased and sorted items
 * @private
 */
function lowercaseSortedArray(items) {
    const sortedItems = [];
    const len = items.length;
    for ( let i = 0; i < len; i += 1 ) {
        sortedItems.push(items[i].toLowerCase());
    }
    sortedItems.sort();
    return sortedItems;
}

function _hexEscapeChar(c) {
    return '%' + c.charCodeAt(0).toString(16);
}

function _encodeURIComponent(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, _hexEscapeChar);
}

Object.defineProperties(AuthorizationV2Builder, {
    /**
     * The hex-encoded value for an empty SHA256 digest value.
     * 
     * @memberof AuthorizationV2Builder
     * @readonly
     * @type {string}
     */
    EMPTY_STRING_SHA256_HEX:    { value: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },

    /**
     * The SolarNetwork V2 authorization scheme.
     * 
     * @memberof AuthorizationV2Builder
     * @readonly
     * @type {string}
     */
    SNWS2_AUTH_SCHEME:          { value: 'SNWS2' },
});

export default AuthorizationV2Builder;
