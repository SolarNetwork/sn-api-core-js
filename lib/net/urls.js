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
function urlQueryParse(search, multiValueKeys) {
    const params = {};
    let pairs;
    let pair;
    let i, len, k, v;
    if (search !== undefined && search.length > 0) {
        // remove any leading ? character
        if (search.match(/^\?/)) {
            search = search.substring(1);
        }
        pairs = search.split("&");
        for (i = 0, len = pairs.length; i < len; i++) {
            pair = pairs[i].split("=", 2);
            if (pair.length === 2) {
                k = decodeURIComponent(pair[0]);
                v = decodeURIComponent(pair[1]);
                if (params[k]) {
                    if (!Array.isArray(params[k])) {
                        params[k] = [params[k]]; // turn into array;
                    }
                    params[k].push(v);
                }
                else if (multiValueKeys && multiValueKeys.has(k)) {
                    params[k] = [v];
                }
                else {
                    params[k] = v;
                }
            }
        }
    }
    return params;
}
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
function urlQueryEncode(parameters, encoderFn) {
    let result = "";
    const encoder = encoderFn || encodeURIComponent;
    function handleValue(k, v) {
        if (result.length) {
            result += "&";
        }
        result += encoder(k) + "=" + encoder(v);
    }
    if (parameters) {
        for (const prop in parameters) {
            if (Object.prototype.hasOwnProperty.call(parameters, prop)) {
                const val = parameters[prop];
                if (Array.isArray(val)) {
                    for (let i = 0, len = val.length; i < len; i++) {
                        handleValue(prop, val[i]);
                    }
                }
                else {
                    handleValue(prop, val);
                }
            }
        }
    }
    return result;
}
export { urlQueryParse, urlQueryEncode };
//# sourceMappingURL=urls.js.map