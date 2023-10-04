import test from "ava";

import { default as HttpHeaders, HttpContentType, HttpMethod } from "../../src/net/httpHeaders.js";

test("core:net:httpHeaders:create", (t) => {
	const headers = new HttpHeaders();
	t.truthy(headers);
});

test("core:net:httpHeaders:constants", (t) => {
	t.is(HttpHeaders.ACCEPT, "Accept");
	t.is(HttpHeaders.AUTHORIZATION, "Authorization");
	t.is(HttpHeaders.CONTENT_MD5, "Content-MD5");
	t.is(HttpHeaders.CONTENT_TYPE, "Content-Type");
	t.is(HttpHeaders.DATE, "Date");
	t.is(HttpHeaders.DIGEST, "Digest");
	t.is(HttpHeaders.HOST, "Host");
	t.is(HttpHeaders.X_SN_DATE, "X-SN-Date");
});

test("core:net:httpMethod:constants", (t) => {
	t.is(HttpMethod.DELETE, "DELETE");
	t.is(HttpMethod.GET, "GET");
	t.is(HttpMethod.HEAD, "HEAD");
	t.is(HttpMethod.OPTIONS, "OPTIONS");
	t.is(HttpMethod.PATCH, "PATCH");
	t.is(HttpMethod.POST, "POST");
	t.is(HttpMethod.PUT, "PUT");
	t.is(HttpMethod.TRACE, "TRACE");
});

test("core:net:contentType:constants", (t) => {
	t.is(HttpContentType.APPLICATION_JSON, "application/json");
	t.is(HttpContentType.APPLICATION_JSON_UTF8, "application/json; charset=UTF-8");
	t.is(HttpContentType.FORM_URLENCODED, "application/x-www-form-urlencoded");
	t.is(HttpContentType.FORM_URLENCODED_UTF8, "application/x-www-form-urlencoded; charset=UTF-8");
});
