/**
 * Parse the query portion of a URL string, and return a parameter object for the
 * parsed key/value pairs.
 *
 * <p>Multiple parameters of the same name will be stored as an array on the returned object.</p>
 *
 * @param {string} search the query portion of the URL, which may optionally include
 *                        the leading `?` character
 * @param {Set<String>} [multiValueKeys] if provided, a set of keys for which to always treat
 *                                       as a multi-value array, even if there is only one value
 * @return {object} the parsed query parameters, as a parameter object
 * @alias module:net~urlQueryParse
 */
function urlQueryParse(search, multiValueKeys) {
	var params = {};
	var pairs;
	var pair;
	var i, len, k, v;
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
				} else if (multiValueKeys && multiValueKeys.has(k)) {
					params[k] = [v];
				} else {
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
 * <p>If an object property has an array value, multiple URL parameters will be encoded for that property.</p>
 *
 * <p>The optional `encoderFn` argument is a function that accepts a string value
 * and should return a URI-safe string for that value.</p>
 *
 * @param {object} parameters an object to encode as URL parameters
 * @param {function} encoderFn an optional function to encode each URI component with;
 *                             if not provided the built-in `encodeURIComponent()` function
 *                             will be used
 * @return {string} the encoded query parameters
 * @alias module:net~urlQueryEncode
 */
function urlQueryEncode(parameters, encoderFn) {
	var result = "",
		prop,
		val,
		i,
		len;
	const encoder = encoderFn || encodeURIComponent;
	function handleValue(k, v) {
		if (result.length) {
			result += "&";
		}
		result += encoder(k) + "=" + encoder(v);
	}
	if (parameters) {
		for (prop in parameters) {
			if (parameters.hasOwnProperty(prop)) {
				val = parameters[prop];
				if (Array.isArray(val)) {
					for (i = 0, len = val.length; i < len; i++) {
						handleValue(prop, val[i]);
					}
				} else {
					handleValue(prop, val);
				}
			}
		}
	}
	return result;
}

export { urlQueryParse, urlQueryEncode };

export default {
	urlQueryParse: urlQueryParse,
	urlQueryEncode: urlQueryEncode
};
