import MultiMap from '../util/multiMap';

export const HttpMethod = Object.freeze({
	GET: 'GET',
	HEAD: 'HEAD',
	POST: 'POST',
	PUT: 'PUT',
	PATCH: 'PATCH',
	DELETE: 'DELETE',
	OPTIONS: 'OPTIONS',
	TRACE: 'TRACE',
});

/**
 * Support for HTTP headers.
 * 
 * @extends MultiMap
 */
class HttpHeaders extends MultiMap {
	constructor() {
		super();
	}

}

Object.defineProperties(HttpHeaders, {
	/**
	 * The <code>Content-MD5</code> header.
	 * 
	 * @memberof HttpHeaders
	 * @readonly
	 * @type {string}
	 */
	'CONTENT_MD5':		{ value: 'Content-MD5' },

	/**
	 * The <code>Content-Type</code> header.
	 * 
	 * @memberof HttpHeaders
	 * @readonly
	 * @type {string}
	 */
	'CONTENT_TYPE': 	{ value: 'Content-Type' },

	/**
	 * The <code>Date</code> header.
	 * 
	 * @memberof HttpHeaders
	 * @readonly
	 * @type {string}
	 */
	'DATE':				{ value: 'Date' },

	/**
	 * The <code>Digest</code> header.
	 * 
	 * @memberof HttpHeaders
	 * @readonly
	 * @type {string}
	 */
	'DIGEST':			{ value: 'Digest' },

	/**
	 * The <code>Host</code> header.
	 * 
	 * @memberof HttpHeaders
	 * @readonly
	 * @type {string}
	 */
	'HOST': 			{ value: 'Host' },

	/**
	 * The <code>X-SN-Date</code> header.
	 * 
	 * @memberof HttpHeaders
	 * @readonly
	 * @type {string}
	 */
	'X_SN_DATE': 		{ value: 'X-SN-Date' },
});

export default HttpHeaders;
