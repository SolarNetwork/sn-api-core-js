import test from 'ava';

import HttpHeaders from 'net/httpHeaders';

test('core:net:httpHeaders:create', t => {
	const headers = new HttpHeaders();
	t.truthy(headers);
});

test('core:net:httpHeaders:constants', t => {
	t.is(HttpHeaders.CONTENT_MD5, 'Content-MD5');
	t.is(HttpHeaders.CONTENT_TYPE, 'Content-Type');
	t.is(HttpHeaders.DATE, 'Date');
	t.is(HttpHeaders.DIGEST, 'Digest');
	t.is(HttpHeaders.HOST, 'Host');
	t.is(HttpHeaders.X_SN_DATE, 'X-SN-Date');
});
