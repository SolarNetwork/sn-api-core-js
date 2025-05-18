import test from "ava";

import { default as HttpHeaders } from "../../main/net/httpHeaders.js";

test("create", (t) => {
	const headers = new HttpHeaders();
	t.truthy(headers);
});

test("constants", (t) => {
	t.is(HttpHeaders.ACCEPT, "Accept");
	t.is(HttpHeaders.AUTHORIZATION, "Authorization");
	t.is(HttpHeaders.CONTENT_MD5, "Content-MD5");
	t.is(HttpHeaders.CONTENT_TYPE, "Content-Type");
	t.is(HttpHeaders.DATE, "Date");
	t.is(HttpHeaders.DIGEST, "Digest");
	t.is(HttpHeaders.HOST, "Host");
	t.is(
		HttpHeaders.X_SN_PRE_SIGNED_AUTHORIZATION,
		"X-SN-PreSignedAuthorization"
	);
	t.is(HttpHeaders.X_SN_DATE, "X-SN-Date");
});
