import test from 'ava';

import Base64 from 'crypto-js/enc-base64';
import Hex from 'crypto-js/enc-hex';
import { HttpMethod, default as HttpHeaders } from 'net/httpHeaders';

import AuthV2 from 'net/authV2';

const TEST_TOKEN_ID = 'test-token-id';
const TEST_TOKEN_SECRET = 'test-token-secret'

function getTestDate() {
	return new Date('Tue, 25 Apr 2017 14:30:00 GMT');
}

test('core:net:authV2:requestDateHeaderValue', t => {
	const builder = new AuthV2(TEST_TOKEN_ID);
	builder.date(getTestDate());

	const headerDate = builder.requestDateHeaderValue;
	t.is(headerDate, 'Tue, 25 Apr 2017 14:30:00 GMT');
});

test('core:net:authV2:simpleGet', t => {
	const builder = new AuthV2(TEST_TOKEN_ID);
	builder.date(getTestDate()).host('localhost').path('/api/test');

	const canonicalRequestData = builder.buildCanonicalRequestData();
	t.is(canonicalRequestData,
		"GET\n/api/test\n\ndate:Tue, 25 Apr 2017 14:30:00 GMT\nhost:localhost\ndate;host\n"
		+ AuthV2.EMPTY_STRING_SHA256_HEX);

	const result = builder.build(TEST_TOKEN_SECRET);
	t.is(result, "SNWS2 Credential=test-token-id,SignedHeaders=date;host,Signature=4739139d3d370f147b6585795c309b1c6d7d7f59943081f7dd943f689cfa59a3");
});

test('core:net:authV2:simpleGetWithSavedKey', t => {
    const builder = new AuthV2(TEST_TOKEN_ID);
    builder.date(getTestDate()).host('localhost').path('/api/test').saveSigningKey(TEST_TOKEN_SECRET);

    const canonicalRequestData = builder.buildCanonicalRequestData();
    t.is(canonicalRequestData,
        "GET\n/api/test\n\ndate:Tue, 25 Apr 2017 14:30:00 GMT\nhost:localhost\ndate;host\n"
        + AuthV2.EMPTY_STRING_SHA256_HEX);

    const result = builder.buildWithSavedKey();
    t.is(result, "SNWS2 Credential=test-token-id,SignedHeaders=date;host,Signature=4739139d3d370f147b6585795c309b1c6d7d7f59943081f7dd943f689cfa59a3");
});

test('core:new:authV2:signingKeyValid:noKey', t => {
    const builder = new AuthV2(TEST_TOKEN_ID);
	builder.date(getTestDate());
	t.is(builder.signingKeyValid, false);
});

test('core:new:authV2:signingKeyValid:expired', t => {
    const builder = new AuthV2(TEST_TOKEN_ID);
	builder.date(getTestDate()).saveSigningKey(TEST_TOKEN_SECRET);
	t.is(builder.signingKeyValid, false);
});

test('core:new:authV2:signingKeyValid:valid', t => {
    const builder = new AuthV2(TEST_TOKEN_ID);
	builder.date(new Date()).saveSigningKey(TEST_TOKEN_SECRET);
	t.is(builder.signingKeyValid, true);
});

test('core:net:authV2:xSnDate:header', t => {
	const reqDate = getTestDate();
	const builder = new AuthV2(TEST_TOKEN_ID);
	builder.date(reqDate).host('localhost').path('/api/test').header('X-SN-Date', reqDate.toUTCString());

	t.is(builder.useSnDate, true);

	const canonicalRequestData = builder.buildCanonicalRequestData();
	t.is(canonicalRequestData,
		"GET\n/api/test\n\nhost:localhost\nx-sn-date:Tue, 25 Apr 2017 14:30:00 GMT\nhost;x-sn-date\n"
		+ AuthV2.EMPTY_STRING_SHA256_HEX);

	const result = builder.build(TEST_TOKEN_SECRET);
	t.is(result, "SNWS2 Credential=test-token-id,SignedHeaders=host;x-sn-date,Signature=c14fe9f67560fb9a37d2aa7c40b40c260a5936f999877e2469b8ddb1da7c0eb9");
});

test('core:net:authV2:xSnDate:signedHeader', t => {
	const reqDate = getTestDate();
	const builder = new AuthV2(TEST_TOKEN_ID);
	builder.date(reqDate).host('localhost').path('/api/test')
		.signedHttpHeaders(['X-SN-Date']);

	t.is(builder.useSnDate, true);

	const canonicalRequestData = builder.buildCanonicalRequestData();
	t.is(canonicalRequestData,
		"GET\n/api/test\n\nhost:localhost\nx-sn-date:Tue, 25 Apr 2017 14:30:00 GMT\nhost;x-sn-date\n"
		+ AuthV2.EMPTY_STRING_SHA256_HEX);

	const result = builder.build(TEST_TOKEN_SECRET);
	t.is(result, "SNWS2 Credential=test-token-id,SignedHeaders=host;x-sn-date,Signature=c14fe9f67560fb9a37d2aa7c40b40c260a5936f999877e2469b8ddb1da7c0eb9");
});

test('core:net:authV2:snDate', t => {
	const reqDate = getTestDate();
	const builder = new AuthV2(TEST_TOKEN_ID);
	builder.snDate(true).date(reqDate).host('localhost').path('/api/test');

	t.is(builder.useSnDate, true);

	const canonicalRequestData = builder.buildCanonicalRequestData();
	t.is(canonicalRequestData,
		"GET\n/api/test\n\nhost:localhost\nx-sn-date:Tue, 25 Apr 2017 14:30:00 GMT\nhost;x-sn-date\n"
		+ AuthV2.EMPTY_STRING_SHA256_HEX);

	const result = builder.build(TEST_TOKEN_SECRET);
	t.is(result, "SNWS2 Credential=test-token-id,SignedHeaders=host;x-sn-date,Signature=c14fe9f67560fb9a37d2aa7c40b40c260a5936f999877e2469b8ddb1da7c0eb9");
});

test('core:net:authV2:useSnDate', t => {
	const reqDate = getTestDate();
	const builder = new AuthV2(TEST_TOKEN_ID);
	builder.useSnDate = true;
	builder.date(reqDate).host('localhost').path('/api/test');

	t.is(builder.useSnDate, true);

	const canonicalRequestData = builder.buildCanonicalRequestData();
	t.is(canonicalRequestData,
		"GET\n/api/test\n\nhost:localhost\nx-sn-date:Tue, 25 Apr 2017 14:30:00 GMT\nhost;x-sn-date\n"
		+ AuthV2.EMPTY_STRING_SHA256_HEX);

	const result = builder.build(TEST_TOKEN_SECRET);
	t.is(result, "SNWS2 Credential=test-token-id,SignedHeaders=host;x-sn-date,Signature=c14fe9f67560fb9a37d2aa7c40b40c260a5936f999877e2469b8ddb1da7c0eb9");
});

test('core:net:authV2:useSnDate:disableSignedHeaderName', t => {
	const builder = new AuthV2(TEST_TOKEN_ID);
	builder.date(getTestDate()).host('localhost').path('/api/test')
		.signedHttpHeaders(['X-SN-Date']);

	t.is(builder.useSnDate, true);

	builder.useSnDate = false;

	t.deepEqual(builder.signedHeaderNames, []);
});

test('core:net:authV2:useSnDate:disableHeader', t => {
	const builder = new AuthV2(TEST_TOKEN_ID);
	const reqDate = getTestDate();
	builder.date(reqDate).host('localhost').path('/api/test')
		.header('X-SN-Date', reqDate.toUTCString());

	t.is(builder.useSnDate, true);

	builder.useSnDate = false;

	t.is(builder.httpHeaders.containsKey('X-SN-Date'), false);
});

test('core:net:authV2:queryParams', t => {
	const reqDate = getTestDate();
	const params = {foo: 'bar', bim: 'bam'};

	const builder = new AuthV2(TEST_TOKEN_ID);
	builder.date(reqDate).host('localhost').path('/api/query').queryParams(params);

	const canonicalRequestData = builder.buildCanonicalRequestData();
	t.is(canonicalRequestData,
		"GET\n/api/query\nbim=bam&foo=bar\ndate:Tue, 25 Apr 2017 14:30:00 GMT\nhost:localhost\ndate;host\n"
		+ AuthV2.EMPTY_STRING_SHA256_HEX);

	const result = builder.build(TEST_TOKEN_SECRET);
	t.is(result, "SNWS2 Credential=test-token-id,SignedHeaders=date;host,Signature=c597ed8061d9d12e12ead3d8d6fc03b28a877e8639548f31556b4760be09a4b8");
});

test('core:net:authV2:queryParamsWithEscapedCharacters', t => {
	const reqDate = getTestDate();
	const params = {foo: '/path/*'};

	const builder = new AuthV2(TEST_TOKEN_ID);
	builder.useSnDate = true;
	builder.date(reqDate).host('localhost').path('/api/query').queryParams(params);

	const canonicalRequestData = builder.buildCanonicalRequestData();
	t.is(canonicalRequestData,
		"GET\n/api/query\nfoo=%2Fpath%2F%2A\nhost:localhost\nx-sn-date:Tue, 25 Apr 2017 14:30:00 GMT\nhost;x-sn-date\n"
		+ AuthV2.EMPTY_STRING_SHA256_HEX);

	const result = builder.build(TEST_TOKEN_SECRET);
	t.is(result, "SNWS2 Credential=test-token-id,SignedHeaders=host;x-sn-date,Signature=6e5ae54fe70543a590335a5ab9a29dc089dba4ac75fe15875e716f226c74b6e0");
});

test('core:net:authV2:url', t => {
	const reqDate = getTestDate();
	const url = 'http://example.com/path';

	const builder = new AuthV2(TEST_TOKEN_ID);
	builder.date(reqDate).url(url);

	const canonicalRequestData = builder.buildCanonicalRequestData();
	t.is(canonicalRequestData,
		"GET\n/path\n\ndate:Tue, 25 Apr 2017 14:30:00 GMT\nhost:example.com\ndate;host\n"
		+ AuthV2.EMPTY_STRING_SHA256_HEX);

	const result = builder.build(TEST_TOKEN_SECRET);
	t.is(result, "SNWS2 Credential=test-token-id,SignedHeaders=date;host,Signature=0ba4f4469e9e0d48b7ca046e189032881c08e67a00c007fadb00242c4301fe31");
});

test('core:net:authV2:url:queryParams', t => {
	const reqDate = getTestDate();
	const url = 'https://example.com:8443/path?foo=bar&bim=bam';

	const builder = new AuthV2(TEST_TOKEN_ID);
	builder.date(reqDate).url(url);

	const canonicalRequestData = builder.buildCanonicalRequestData();
	t.is(canonicalRequestData,
		"GET\n/path\nbim=bam&foo=bar\ndate:Tue, 25 Apr 2017 14:30:00 GMT\nhost:example.com:8443\ndate;host\n"
		+ AuthV2.EMPTY_STRING_SHA256_HEX);

	const result = builder.build(TEST_TOKEN_SECRET);
	t.is(result, "SNWS2 Credential=test-token-id,SignedHeaders=date;host,Signature=c3a429e748d2ecd1f734c5a9f562e0c353f4a0d9a48a9492c0637178bb1f15dc");
});

test('core:net:authV2:url:httpsStandardPort', t => {
	const reqDate = getTestDate();
	const url = 'https://example.com:443/path';

	const builder = new AuthV2(TEST_TOKEN_ID);
	builder.date(reqDate).url(url);

	const canonicalRequestData = builder.buildCanonicalRequestData();
	t.is(canonicalRequestData,
		"GET\n/path\n\ndate:Tue, 25 Apr 2017 14:30:00 GMT\nhost:example.com\ndate;host\n"
		+ AuthV2.EMPTY_STRING_SHA256_HEX);

	const result = builder.build(TEST_TOKEN_SECRET);
	t.is(result, "SNWS2 Credential=test-token-id,SignedHeaders=date;host,Signature=0ba4f4469e9e0d48b7ca046e189032881c08e67a00c007fadb00242c4301fe31");
});

test('core:net:authV2:url:wssStandardPort', t => {
	const reqDate = getTestDate();
	const url = 'wss://example.com:443/path';

	const builder = new AuthV2(TEST_TOKEN_ID);
	builder.date(reqDate).url(url);

	const canonicalRequestData = builder.buildCanonicalRequestData();
	t.is(canonicalRequestData,
		"GET\n/path\n\ndate:Tue, 25 Apr 2017 14:30:00 GMT\nhost:example.com\ndate;host\n"
		+ AuthV2.EMPTY_STRING_SHA256_HEX);

	const result = builder.build(TEST_TOKEN_SECRET);
	t.is(result, "SNWS2 Credential=test-token-id,SignedHeaders=date;host,Signature=0ba4f4469e9e0d48b7ca046e189032881c08e67a00c007fadb00242c4301fe31");
});

test('core:net:authV2:url:wsNonStandardPort', t => {
	const reqDate = getTestDate();
	const url = 'ws://example.com:8080/path';

	const builder = new AuthV2(TEST_TOKEN_ID);
	builder.date(reqDate).url(url);

	const canonicalRequestData = builder.buildCanonicalRequestData();
	t.is(canonicalRequestData,
		"GET\n/path\n\ndate:Tue, 25 Apr 2017 14:30:00 GMT\nhost:example.com:8080\ndate;host\n"
		+ AuthV2.EMPTY_STRING_SHA256_HEX);

	const result = builder.build(TEST_TOKEN_SECRET);
	t.is(result, "SNWS2 Credential=test-token-id,SignedHeaders=date;host,Signature=6d5ca23447d47afaee7b4e42680b3a6bfaf0e23aa410d2b9f27f54f14d63f7a7");
});


test('core:net:authV2:simplePost', t => {
	const reqDate = getTestDate();
	const reqBodySha256Hex = "226e49e13d16e5e8aa0d62e58cd63361bf097d3e2b2444aa3044334628a2e8de";
	const reqBodySha256 = Hex.parse(reqBodySha256Hex);
	const reqBodySha256Base64 = Base64.stringify(reqBodySha256);

	const builder = new AuthV2(TEST_TOKEN_ID);
	builder.date(reqDate).host("localhost").method(HttpMethod.POST).path("/api/post")
			.header(HttpHeaders.DIGEST, "sha-256=" + reqBodySha256Base64)
			.header(HttpHeaders.CONTENT_TYPE, 'application/json;charset=UTF-8')
			.contentSHA256(reqBodySha256);

	const canonicalRequestData = builder.buildCanonicalRequestData();
	t.is(canonicalRequestData,
		"POST\n/api/post\n\ncontent-type:application/json;charset=UTF-8\n"
		+ "date:Tue, 25 Apr 2017 14:30:00 GMT\n"
		+ "digest:sha-256=" + reqBodySha256Base64
		+ "\nhost:localhost\ncontent-type;date;digest;host\n" + reqBodySha256Hex);

	const result = builder.build(TEST_TOKEN_SECRET);
	t.is(result, "SNWS2 Credential=test-token-id,SignedHeaders=content-type;date;digest;host,Signature=ad609dd757c1f7f08a519919ab5e109ec61477cf612c6a0d29cac66d54c3987e");
});

test('core:net:authV2:simplePostWithComputedDigest', t => {
	const reqDate = getTestDate();
	const reqBodySha256Hex = "2d8bd7d9bb5f85ba643f0110d50cb506a1fe439e769a22503193ea6046bb87f7";
	const reqBodySha256 = Hex.parse(reqBodySha256Hex);
	const reqBodySha256Base64 = Base64.stringify(reqBodySha256);

	const builder = new AuthV2(TEST_TOKEN_ID);
	builder.date(reqDate).host("localhost").method(HttpMethod.POST).path("/api/post")
			.header(HttpHeaders.CONTENT_TYPE, 'text/plain;charset=UTF-8')
			.computeContentDigest('Hello.');

	const canonicalRequestData = builder.buildCanonicalRequestData();
	t.is(canonicalRequestData,
		"POST\n/api/post\n\ncontent-type:text/plain;charset=UTF-8\n"
		+ "date:Tue, 25 Apr 2017 14:30:00 GMT\n"
		+ "digest:sha-256=" + reqBodySha256Base64
		+ "\nhost:localhost\ncontent-type;date;digest;host\n" + reqBodySha256Hex);

	t.is(builder.httpHeaders.firstValue(HttpHeaders.DIGEST), 'sha-256='+reqBodySha256Base64);

	const result = builder.build(TEST_TOKEN_SECRET);
	t.is(result, "SNWS2 Credential=test-token-id,SignedHeaders=content-type;date;digest;host,Signature=3da29e2ceb916ad31b4ffe920afcf94c879d0c4abaaed92941875ac4549f3cf6");
});
