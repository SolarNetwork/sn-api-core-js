import test from "ava";

import Base64 from "crypto-js/enc-base64.js";
import Hex from "crypto-js/enc-hex.js";
import Environment from "../../main/net/environment.js";
import {
	HttpMethod,
	default as HttpHeaders,
} from "../../main/net/httpHeaders.js";
import MultiMap from "../../main/util/multiMap.js";
import AuthV2 from "../../main/net/authV2.js";

const TEST_TOKEN_ID = "test-token-id";
const TEST_TOKEN_SECRET = "test-token-secret";
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

function getTestDate() {
	return new Date("Tue, 25 Apr 2017 14:30:00 GMT");
}

function floorToUtcDay(date: Date): Date {
	date.setUTCHours(0);
	date.setUTCMinutes(0);
	date.setUTCSeconds(0);
	date.setUTCMilliseconds(0);
	return date;
}

test("requestDateHeaderValue", (t) => {
	const builder = new AuthV2(TEST_TOKEN_ID);
	builder.date(getTestDate());

	const headerDate = builder.requestDateHeaderValue;
	t.is(headerDate, "Tue, 25 Apr 2017 14:30:00 GMT");
});

test("simpleGet", (t) => {
	const builder = new AuthV2(TEST_TOKEN_ID);
	builder.date(getTestDate()).host("localhost").path("/api/test");

	const canonicalRequestData = builder.buildCanonicalRequestData();
	t.is(
		canonicalRequestData,
		"GET\n/api/test\n\ndate:Tue, 25 Apr 2017 14:30:00 GMT\nhost:localhost\ndate;host\n" +
			AuthV2.EMPTY_STRING_SHA256_HEX
	);

	const result = builder.build(TEST_TOKEN_SECRET);
	t.is(
		result,
		"SNWS2 Credential=test-token-id,SignedHeaders=date;host,Signature=4739139d3d370f147b6585795c309b1c6d7d7f59943081f7dd943f689cfa59a3"
	);
});

test("simpleGet:proxy", (t) => {
	const env = new Environment({
		host: "data.solarnetwork.net",
		protocol: "https",
		port: 443,
		proxyHost: "proxy.example.com",
		proxyPort: 8443,
	});
	const builder = new AuthV2(TEST_TOKEN_ID, env)
		.date(getTestDate())
		.path("/api/test")
		.snDate(true);

	const canonicalRequestData = builder.buildCanonicalRequestData();
	t.is(
		canonicalRequestData,
		"GET\n/api/test\n\nhost:data.solarnetwork.net\nx-sn-date:Tue, 25 Apr 2017 14:30:00 GMT\nhost;x-sn-date\n" +
			AuthV2.EMPTY_STRING_SHA256_HEX
	);

	const result = builder.build(TEST_TOKEN_SECRET);
	t.is(
		result,
		"SNWS2 Credential=test-token-id,SignedHeaders=host;x-sn-date,Signature=e70f99fd237e74912ac594b70bda27a84c1d41c4a3c7050d80c729496c7bff1f"
	);
});

test("simpleGetWithUndefinedContentType", (t) => {
	const builder = new AuthV2(TEST_TOKEN_ID);
	builder.date(getTestDate()).host("localhost").path("/api/test"); //.contentType(undefined);

	const canonicalRequestData = builder.buildCanonicalRequestData();
	t.is(
		canonicalRequestData,
		"GET\n/api/test\n\ndate:Tue, 25 Apr 2017 14:30:00 GMT\nhost:localhost\ndate;host\n" +
			AuthV2.EMPTY_STRING_SHA256_HEX
	);

	const result = builder.build(TEST_TOKEN_SECRET);
	t.is(
		result,
		"SNWS2 Credential=test-token-id,SignedHeaders=date;host,Signature=4739139d3d370f147b6585795c309b1c6d7d7f59943081f7dd943f689cfa59a3"
	);
});

test("simpleGetWithNullContentType", (t) => {
	const builder = new AuthV2(TEST_TOKEN_ID);
	builder
		.date(getTestDate())
		.host("localhost")
		.path("/api/test")
		.contentType(null as any);

	const canonicalRequestData = builder.buildCanonicalRequestData();
	t.is(
		canonicalRequestData,
		"GET\n/api/test\n\ncontent-type:\ndate:Tue, 25 Apr 2017 14:30:00 GMT\nhost:localhost\ncontent-type;date;host\n" +
			AuthV2.EMPTY_STRING_SHA256_HEX
	);

	const result = builder.build(TEST_TOKEN_SECRET);
	t.is(
		result,
		"SNWS2 Credential=test-token-id,SignedHeaders=content-type;date;host,Signature=00f309ee00978dc772cb01aba857d57983a7d3ac3b9ab8916a7702c61d6e07b6"
	);
});

test("simpleGetWithSavedKey", (t) => {
	const builder = new AuthV2(TEST_TOKEN_ID);
	builder
		.date(getTestDate())
		.host("localhost")
		.path("/api/test")
		.saveSigningKey(TEST_TOKEN_SECRET);

	const canonicalRequestData = builder.buildCanonicalRequestData();
	t.is(
		canonicalRequestData,
		"GET\n/api/test\n\ndate:Tue, 25 Apr 2017 14:30:00 GMT\nhost:localhost\ndate;host\n" +
			AuthV2.EMPTY_STRING_SHA256_HEX
	);

	const result = builder.buildWithSavedKey();
	t.is(
		result,
		"SNWS2 Credential=test-token-id,SignedHeaders=date;host,Signature=4739139d3d370f147b6585795c309b1c6d7d7f59943081f7dd943f689cfa59a3"
	);
});

test("buildWithSavedKey:noKey", (t) => {
	const builder = new AuthV2(TEST_TOKEN_ID);
	builder.date(getTestDate()).host("localhost").path("/api/test");

	t.throws(
		() => {
			builder.buildWithSavedKey();
		},
		{ instanceOf: Error },
		"error thrown when no saved key"
	);
});

test("simpleGetWithProvidedKey", (t) => {
	const builder = new AuthV2(TEST_TOKEN_ID);
	builder.date(getTestDate()).host("localhost").path("/api/test");
	const signKey = builder.computeSigningKey(TEST_TOKEN_SECRET);
	const result = builder.buildWithKey(signKey);
	t.is(
		result,
		"SNWS2 Credential=test-token-id,SignedHeaders=date;host,Signature=4739139d3d370f147b6585795c309b1c6d7d7f59943081f7dd943f689cfa59a3"
	);
});

test("signingKeyValid:noKey", (t) => {
	const builder = new AuthV2(TEST_TOKEN_ID);
	builder.date(getTestDate());
	t.is(builder.signingKeyValid, false);
});

test("signingKeyValid:expired", (t) => {
	const builder = new AuthV2(TEST_TOKEN_ID);
	builder.date(getTestDate()).saveSigningKey(TEST_TOKEN_SECRET);
	t.is(builder.signingKeyValid, false);
});

test("signingKeyValid:valid", (t) => {
	const builder = new AuthV2(TEST_TOKEN_ID);
	builder.date(new Date()).saveSigningKey(TEST_TOKEN_SECRET);
	t.is(builder.signingKeyValid, true);
});

test("key:get", (t) => {
	const builder = new AuthV2(TEST_TOKEN_ID);
	const signDate = getTestDate();
	builder.date(signDate).saveSigningKey(TEST_TOKEN_SECRET);

	t.deepEqual(
		builder.key(),
		Hex.parse(
			"bf7885e8bd107a79f5c6e13001a4fa15fbd43221ad39ca47fde96191d302dbf4"
		),
		"Signing key returned."
	);
});

test("key:set", (t) => {
	const builder = new AuthV2(TEST_TOKEN_ID);
	const signDate = getTestDate();
	const signKey = Hex.parse(
		"bf7885e8bd107a79f5c6e13001a4fa15fbd43221ad39ca47fde96191d302dbf4"
	);
	builder
		.key(signKey, signDate)
		.date(signDate)
		.path("/test/path")
		.snDate(true);

	t.is(builder.signingKeyValid, false, "Signing key is expired.");
	t.deepEqual(
		builder.signingKeyExpirationDate,
		floorToUtcDay(new Date(signDate.getTime() + SEVEN_DAYS)),
		"Signing key expiration date 7 days from sign date."
	);
	t.is(
		builder.buildWithSavedKey(),
		"SNWS2 Credential=test-token-id,SignedHeaders=host;x-sn-date,Signature=79cb002ee35b5cfe2d54421de6550cdcfc39c9defae874cc93ee74e426e81c23",
		"Authorization value builds with externally provided signing key."
	);
});

test("date:setInvalid", (t) => {
	// GIVEN
	const date = getTestDate();
	const builder = new AuthV2(TEST_TOKEN_ID).date(date);

	// WHEN
	const now = new Date();
	builder.date("blah" as any);

	const d = builder.date();
	t.true(d >= now, "date reset to current date when non-Date object passed");
});

test("key:set:reqDate", (t) => {
	const builder = new AuthV2(TEST_TOKEN_ID);
	const signDate = getTestDate();
	const signKey = Hex.parse(
		"bf7885e8bd107a79f5c6e13001a4fa15fbd43221ad39ca47fde96191d302dbf4"
	);
	builder.date(signDate).key(signKey).path("/test/path").snDate(true);

	t.is(builder.signingKeyValid, false, "Signing key is expired.");
	t.deepEqual(
		builder.signingKeyExpirationDate,
		floorToUtcDay(new Date(signDate.getTime() + SEVEN_DAYS)),
		"Signing key expiration date 7 days from sign date."
	);
	t.is(
		builder.buildWithSavedKey(),
		"SNWS2 Credential=test-token-id,SignedHeaders=host;x-sn-date,Signature=79cb002ee35b5cfe2d54421de6550cdcfc39c9defae874cc93ee74e426e81c23",
		"Authorization value builds with externally provided signing key."
	);
});

test("xSnDate:header", (t) => {
	const reqDate = getTestDate();
	const builder = new AuthV2(TEST_TOKEN_ID);
	builder
		.date(reqDate)
		.host("localhost")
		.path("/api/test")
		.header("X-SN-Date", reqDate.toUTCString());

	t.is(builder.useSnDate, true);

	const canonicalRequestData = builder.buildCanonicalRequestData();
	t.is(
		canonicalRequestData,
		"GET\n/api/test\n\nhost:localhost\nx-sn-date:Tue, 25 Apr 2017 14:30:00 GMT\nhost;x-sn-date\n" +
			AuthV2.EMPTY_STRING_SHA256_HEX
	);

	const result = builder.build(TEST_TOKEN_SECRET);
	t.is(
		result,
		"SNWS2 Credential=test-token-id,SignedHeaders=host;x-sn-date,Signature=c14fe9f67560fb9a37d2aa7c40b40c260a5936f999877e2469b8ddb1da7c0eb9"
	);
});

test("xSnDate:signedHeader", (t) => {
	const reqDate = getTestDate();
	const builder = new AuthV2(TEST_TOKEN_ID);
	builder
		.date(reqDate)
		.host("localhost")
		.path("/api/test")
		.signedHttpHeaders(["X-SN-Date"]);

	t.is(builder.useSnDate, true);

	const canonicalRequestData = builder.buildCanonicalRequestData();
	t.is(
		canonicalRequestData,
		"GET\n/api/test\n\nhost:localhost\nx-sn-date:Tue, 25 Apr 2017 14:30:00 GMT\nhost;x-sn-date\n" +
			AuthV2.EMPTY_STRING_SHA256_HEX
	);

	const result = builder.build(TEST_TOKEN_SECRET);
	t.is(
		result,
		"SNWS2 Credential=test-token-id,SignedHeaders=host;x-sn-date,Signature=c14fe9f67560fb9a37d2aa7c40b40c260a5936f999877e2469b8ddb1da7c0eb9"
	);
});

test("snDate", (t) => {
	const reqDate = getTestDate();
	const builder = new AuthV2(TEST_TOKEN_ID);
	builder.snDate(true).date(reqDate).host("localhost").path("/api/test");

	t.is(builder.useSnDate, true);

	const canonicalRequestData = builder.buildCanonicalRequestData();
	t.is(
		canonicalRequestData,
		"GET\n/api/test\n\nhost:localhost\nx-sn-date:Tue, 25 Apr 2017 14:30:00 GMT\nhost;x-sn-date\n" +
			AuthV2.EMPTY_STRING_SHA256_HEX
	);

	const result = builder.build(TEST_TOKEN_SECRET);
	t.is(
		result,
		"SNWS2 Credential=test-token-id,SignedHeaders=host;x-sn-date,Signature=c14fe9f67560fb9a37d2aa7c40b40c260a5936f999877e2469b8ddb1da7c0eb9"
	);
});

test("useSnDate", (t) => {
	const reqDate = getTestDate();
	const builder = new AuthV2(TEST_TOKEN_ID);
	builder.useSnDate = true;
	builder.date(reqDate).host("localhost").path("/api/test");

	t.is(builder.useSnDate, true);

	const canonicalRequestData = builder.buildCanonicalRequestData();
	t.is(
		canonicalRequestData,
		"GET\n/api/test\n\nhost:localhost\nx-sn-date:Tue, 25 Apr 2017 14:30:00 GMT\nhost;x-sn-date\n" +
			AuthV2.EMPTY_STRING_SHA256_HEX
	);

	const result = builder.build(TEST_TOKEN_SECRET);
	t.is(
		result,
		"SNWS2 Credential=test-token-id,SignedHeaders=host;x-sn-date,Signature=c14fe9f67560fb9a37d2aa7c40b40c260a5936f999877e2469b8ddb1da7c0eb9"
	);
});

test("useSnDate:disableSignedHeaderName", (t) => {
	// GIVEN
	const builder = new AuthV2(TEST_TOKEN_ID);
	builder
		.date(getTestDate())
		.url("https://example.com:443/path")
		.signedHttpHeaders([HttpHeaders.X_SN_DATE]);

	// WHEN
	t.is(builder.useSnDate, true);
	builder.useSnDate = false;

	// THEN
	t.is(
		builder.build(TEST_TOKEN_SECRET),
		"SNWS2 Credential=test-token-id,SignedHeaders=date;host,Signature=0ba4f4469e9e0d48b7ca046e189032881c08e67a00c007fadb00242c4301fe31",
		"Calling useSnDate(false) removed the X-SN-Date HTTP header from the signature."
	);
});

test("useSnDate:disableHeader", (t) => {
	const builder = new AuthV2(TEST_TOKEN_ID);
	const reqDate = getTestDate();
	builder
		.date(reqDate)
		.host("localhost")
		.path("/api/test")
		.header("X-SN-Date", reqDate.toUTCString());

	t.is(builder.useSnDate, true);

	builder.useSnDate = false;

	t.false(builder.httpHeaders.containsKey("X-SN-Date"));
});

test("useSnDate:noHeaders", (t) => {
	// GIVEN
	const builder = new AuthV2(TEST_TOKEN_ID);

	// THEN
	t.false(builder.useSnDate, "default is not to use SN date header");
});

test("useSnDate:addToSignedHeaders", (t) => {
	// GIVEN
	const builder = new AuthV2(TEST_TOKEN_ID).signedHttpHeaders(["x-foo"]);

	// WHEN
	builder.useSnDate = true;

	t.deepEqual(
		builder.signedHttpHeaders(),
		["x-foo", "X-SN-Date"],
		"X-SN-Date header added"
	);
});

test("queryParams", (t) => {
	const reqDate = getTestDate();
	const params = { foo: "bar", bim: "bam" };

	const builder = new AuthV2(TEST_TOKEN_ID);
	builder
		.date(reqDate)
		.host("localhost")
		.path("/api/query")
		.queryParams(params);

	const canonicalRequestData = builder.buildCanonicalRequestData();
	t.is(
		canonicalRequestData,
		"GET\n/api/query\nbim=bam&foo=bar\ndate:Tue, 25 Apr 2017 14:30:00 GMT\nhost:localhost\ndate;host\n" +
			AuthV2.EMPTY_STRING_SHA256_HEX
	);

	const result = builder.build(TEST_TOKEN_SECRET);
	t.is(
		result,
		"SNWS2 Credential=test-token-id,SignedHeaders=date;host,Signature=c597ed8061d9d12e12ead3d8d6fc03b28a877e8639548f31556b4760be09a4b8"
	);
});

test("queryParams:MultiMap", (t) => {
	const reqDate = getTestDate();
	const params = new MultiMap({ foo: "bar", bim: "bam" });

	const builder = new AuthV2(TEST_TOKEN_ID);
	builder
		.date(reqDate)
		.host("localhost")
		.path("/api/query")
		.queryParams(params);

	const canonicalRequestData = builder.buildCanonicalRequestData();
	t.is(
		canonicalRequestData,
		"GET\n/api/query\nbim=bam&foo=bar\ndate:Tue, 25 Apr 2017 14:30:00 GMT\nhost:localhost\ndate;host\n" +
			AuthV2.EMPTY_STRING_SHA256_HEX
	);

	const result = builder.build(TEST_TOKEN_SECRET);
	t.is(
		result,
		"SNWS2 Credential=test-token-id,SignedHeaders=date;host,Signature=c597ed8061d9d12e12ead3d8d6fc03b28a877e8639548f31556b4760be09a4b8"
	);
});

test("queryParamsWithEscapedCharacters", (t) => {
	const reqDate = getTestDate();
	const params = { foo: "/path/*" };

	const builder = new AuthV2(TEST_TOKEN_ID);
	builder.useSnDate = true;
	builder
		.date(reqDate)
		.host("localhost")
		.path("/api/query")
		.queryParams(params);

	const canonicalRequestData = builder.buildCanonicalRequestData();
	t.is(
		canonicalRequestData,
		"GET\n/api/query\nfoo=%2Fpath%2F%2A\nhost:localhost\nx-sn-date:Tue, 25 Apr 2017 14:30:00 GMT\nhost;x-sn-date\n" +
			AuthV2.EMPTY_STRING_SHA256_HEX
	);

	const result = builder.build(TEST_TOKEN_SECRET);
	t.is(
		result,
		"SNWS2 Credential=test-token-id,SignedHeaders=host;x-sn-date,Signature=6e5ae54fe70543a590335a5ab9a29dc089dba4ac75fe15875e716f226c74b6e0"
	);
});

test("url", (t) => {
	const reqDate = getTestDate();
	const url = "http://example.com/path";

	const builder = new AuthV2(TEST_TOKEN_ID);
	builder.date(reqDate).url(url);

	const canonicalRequestData = builder.buildCanonicalRequestData();
	t.is(
		canonicalRequestData,
		"GET\n/path\n\ndate:Tue, 25 Apr 2017 14:30:00 GMT\nhost:example.com\ndate;host\n" +
			AuthV2.EMPTY_STRING_SHA256_HEX
	);

	const result = builder.build(TEST_TOKEN_SECRET);
	t.is(
		result,
		"SNWS2 Credential=test-token-id,SignedHeaders=date;host,Signature=0ba4f4469e9e0d48b7ca046e189032881c08e67a00c007fadb00242c4301fe31"
	);
});

test("url:withoutHost", (t) => {
	const reqDate = getTestDate();
	const url = "http://example.com/path";

	const builder = new AuthV2(TEST_TOKEN_ID);
	builder.date(reqDate).url(url, true);

	const canonicalRequestData = builder.buildCanonicalRequestData();
	t.is(
		canonicalRequestData,
		"GET\n/path\n\ndate:Tue, 25 Apr 2017 14:30:00 GMT\nhost:data.solarnetwork.net\ndate;host\n" +
			AuthV2.EMPTY_STRING_SHA256_HEX
	);

	const result = builder.build(TEST_TOKEN_SECRET);
	t.is(
		result,
		"SNWS2 Credential=test-token-id,SignedHeaders=date;host,Signature=1fdfdc7954cb386b97991736cf70c0c8e86c9d6ea28c74e9333678f03c075730"
	);
});

test("url:queryParams", (t) => {
	const reqDate = getTestDate();
	const url = "https://example.com:8443/path?foo=bar&bim=bam";

	const builder = new AuthV2(TEST_TOKEN_ID);
	builder.date(reqDate).url(url);

	const canonicalRequestData = builder.buildCanonicalRequestData();
	t.is(
		canonicalRequestData,
		"GET\n/path\nbim=bam&foo=bar\ndate:Tue, 25 Apr 2017 14:30:00 GMT\nhost:example.com:8443\ndate;host\n" +
			AuthV2.EMPTY_STRING_SHA256_HEX
	);

	const result = builder.build(TEST_TOKEN_SECRET);
	t.is(
		result,
		"SNWS2 Credential=test-token-id,SignedHeaders=date;host,Signature=c3a429e748d2ecd1f734c5a9f562e0c353f4a0d9a48a9492c0637178bb1f15dc"
	);
});

test("url:httpsStandardPort", (t) => {
	const reqDate = getTestDate();
	const url = "https://example.com:443/path";

	const builder = new AuthV2(TEST_TOKEN_ID);
	builder.date(reqDate).url(url);

	const canonicalRequestData = builder.buildCanonicalRequestData();
	t.is(
		canonicalRequestData,
		"GET\n/path\n\ndate:Tue, 25 Apr 2017 14:30:00 GMT\nhost:example.com\ndate;host\n" +
			AuthV2.EMPTY_STRING_SHA256_HEX
	);

	const result = builder.build(TEST_TOKEN_SECRET);
	t.is(
		result,
		"SNWS2 Credential=test-token-id,SignedHeaders=date;host,Signature=0ba4f4469e9e0d48b7ca046e189032881c08e67a00c007fadb00242c4301fe31"
	);
});

test("url:httpsImpliedPort", (t) => {
	const reqDate = getTestDate();
	const url = "https://example.com/path";

	const builder = new AuthV2(TEST_TOKEN_ID);
	builder.date(reqDate).url(url);

	const canonicalRequestData = builder.buildCanonicalRequestData();
	t.is(
		canonicalRequestData,
		"GET\n/path\n\ndate:Tue, 25 Apr 2017 14:30:00 GMT\nhost:example.com\ndate;host\n" +
			AuthV2.EMPTY_STRING_SHA256_HEX
	);

	const result = builder.build(TEST_TOKEN_SECRET);
	t.is(
		result,
		"SNWS2 Credential=test-token-id,SignedHeaders=date;host,Signature=0ba4f4469e9e0d48b7ca046e189032881c08e67a00c007fadb00242c4301fe31"
	);
});

test("url:httpsImpliedPort:forced:https", (t) => {
	const reqDate = getTestDate();
	const url = "https://example.com/path";

	const builder = new AuthV2(TEST_TOKEN_ID);
	builder.forceHostPort = true;
	builder.date(reqDate).url(url);

	const canonicalRequestData = builder.buildCanonicalRequestData();
	t.is(
		canonicalRequestData,
		"GET\n/path\n\ndate:Tue, 25 Apr 2017 14:30:00 GMT\nhost:example.com:443\ndate;host\n" +
			AuthV2.EMPTY_STRING_SHA256_HEX
	);

	const result = builder.build(TEST_TOKEN_SECRET);
	t.is(
		result,
		"SNWS2 Credential=test-token-id,SignedHeaders=date;host,Signature=5691e0f9366084fd81d50bba679e6c57fbbc85faca87a154ad3e1b29afb2e818"
	);
});

test("url:httpsImpliedPort:forced:http", (t) => {
	const reqDate = getTestDate();
	const url = "http://example.com/path";

	const builder = new AuthV2(TEST_TOKEN_ID);
	builder.environment.port = 80;
	builder.forceHostPort = true;
	builder.date(reqDate).url(url);

	const canonicalRequestData = builder.buildCanonicalRequestData();
	t.is(
		canonicalRequestData,
		"GET\n/path\n\ndate:Tue, 25 Apr 2017 14:30:00 GMT\nhost:example.com\ndate;host\n" +
			AuthV2.EMPTY_STRING_SHA256_HEX
	);

	const result = builder.build(TEST_TOKEN_SECRET);
	t.is(
		result,
		"SNWS2 Credential=test-token-id,SignedHeaders=date;host,Signature=0ba4f4469e9e0d48b7ca046e189032881c08e67a00c007fadb00242c4301fe31"
	);
});

test("url:wssStandardPort", (t) => {
	const reqDate = getTestDate();
	const url = "wss://example.com:443/path";

	const builder = new AuthV2(TEST_TOKEN_ID);
	builder.date(reqDate).url(url);

	const canonicalRequestData = builder.buildCanonicalRequestData();
	t.is(
		canonicalRequestData,
		"GET\n/path\n\ndate:Tue, 25 Apr 2017 14:30:00 GMT\nhost:example.com\ndate;host\n" +
			AuthV2.EMPTY_STRING_SHA256_HEX
	);

	const result = builder.build(TEST_TOKEN_SECRET);
	t.is(
		result,
		"SNWS2 Credential=test-token-id,SignedHeaders=date;host,Signature=0ba4f4469e9e0d48b7ca046e189032881c08e67a00c007fadb00242c4301fe31"
	);
});

test("url:wsNonStandardPort", (t) => {
	const reqDate = getTestDate();
	const url = "ws://example.com:8080/path";

	const builder = new AuthV2(TEST_TOKEN_ID);
	builder.date(reqDate).url(url);

	const canonicalRequestData = builder.buildCanonicalRequestData();
	t.is(
		canonicalRequestData,
		"GET\n/path\n\ndate:Tue, 25 Apr 2017 14:30:00 GMT\nhost:example.com:8080\ndate;host\n" +
			AuthV2.EMPTY_STRING_SHA256_HEX
	);

	const result = builder.build(TEST_TOKEN_SECRET);
	t.is(
		result,
		"SNWS2 Credential=test-token-id,SignedHeaders=date;host,Signature=6d5ca23447d47afaee7b4e42680b3a6bfaf0e23aa410d2b9f27f54f14d63f7a7"
	);
});

test("method", (t) => {
	// GIVEN
	const builder = new AuthV2(TEST_TOKEN_ID);

	// WHEN
	const m = builder.method();
	builder.method(HttpMethod.POST);

	// THEN
	t.is(m, HttpMethod.GET, "default method is GET");
	t.is(builder.method(), HttpMethod.POST, "method updated");
});

test("path", (t) => {
	// GIVEN
	const builder = new AuthV2(TEST_TOKEN_ID);

	// WHEN
	const p = builder.path();
	builder.path("/foo");

	// THEN
	t.is(p, "/", "default path is /");
	t.is(builder.path(), "/foo", "path updated");
});

test("simplePost", (t) => {
	const reqDate = getTestDate();
	const reqBodySha256Hex =
		"226e49e13d16e5e8aa0d62e58cd63361bf097d3e2b2444aa3044334628a2e8de";
	const reqBodySha256 = Hex.parse(reqBodySha256Hex);
	const reqBodySha256Base64 = Base64.stringify(reqBodySha256);

	const builder = new AuthV2(TEST_TOKEN_ID);
	builder
		.date(reqDate)
		.host("localhost")
		.method(HttpMethod.POST)
		.path("/api/post")
		.header(HttpHeaders.DIGEST, "sha-256=" + reqBodySha256Base64)
		.contentType("application/json;charset=UTF-8")
		.contentSHA256(reqBodySha256);

	const canonicalRequestData = builder.buildCanonicalRequestData();
	t.is(
		canonicalRequestData,
		"POST\n/api/post\n\ncontent-type:application/json;charset=UTF-8\n" +
			"date:Tue, 25 Apr 2017 14:30:00 GMT\n" +
			"digest:sha-256=" +
			reqBodySha256Base64 +
			"\nhost:localhost\ncontent-type;date;digest;host\n" +
			reqBodySha256Hex
	);

	const result = builder.build(TEST_TOKEN_SECRET);
	t.is(
		result,
		"SNWS2 Credential=test-token-id,SignedHeaders=content-type;date;digest;host,Signature=ad609dd757c1f7f08a519919ab5e109ec61477cf612c6a0d29cac66d54c3987e"
	);
});

test("simplePost:contentSHA256:hex", (t) => {
	const reqDate = getTestDate();
	const reqBodySha256Hex =
		"226e49e13d16e5e8aa0d62e58cd63361bf097d3e2b2444aa3044334628a2e8de";
	const reqBodySha256 = Hex.parse(reqBodySha256Hex);
	const reqBodySha256Base64 = Base64.stringify(reqBodySha256);

	const builder = new AuthV2(TEST_TOKEN_ID);
	builder
		.date(reqDate)
		.host("localhost")
		.method(HttpMethod.POST)
		.path("/api/post")
		.header(HttpHeaders.DIGEST, "sha-256=" + reqBodySha256Base64)
		.contentType("application/json;charset=UTF-8")
		.contentSHA256(reqBodySha256Hex);

	const canonicalRequestData = builder.buildCanonicalRequestData();
	t.is(
		canonicalRequestData,
		"POST\n/api/post\n\ncontent-type:application/json;charset=UTF-8\n" +
			"date:Tue, 25 Apr 2017 14:30:00 GMT\n" +
			"digest:sha-256=" +
			reqBodySha256Base64 +
			"\nhost:localhost\ncontent-type;date;digest;host\n" +
			reqBodySha256Hex
	);

	const result = builder.build(TEST_TOKEN_SECRET);
	t.is(
		result,
		"SNWS2 Credential=test-token-id,SignedHeaders=content-type;date;digest;host,Signature=ad609dd757c1f7f08a519919ab5e109ec61477cf612c6a0d29cac66d54c3987e"
	);
});

test("simplePost:contentMD5", (t) => {
	const reqBodySha256Hex =
		"226e49e13d16e5e8aa0d62e58cd63361bf097d3e2b2444aa3044334628a2e8de";

	const builder = new AuthV2(TEST_TOKEN_ID);
	builder
		.date(getTestDate())
		.host("localhost")
		.method(HttpMethod.POST)
		.path("/api/post")
		.header(HttpHeaders.CONTENT_MD5, "foobar")
		.contentType("application/json;charset=UTF-8")
		.contentSHA256(reqBodySha256Hex);
	const canonicalRequestData = builder.buildCanonicalRequestData();
	t.is(
		canonicalRequestData,
		"POST\n/api/post\n" +
			"\ncontent-md5:foobar\ncontent-type:application/json;charset=UTF-8" +
			"\ndate:Tue, 25 Apr 2017 14:30:00 GMT" +
			"\nhost:localhost\ncontent-md5;content-type;date;host\n" +
			reqBodySha256Hex
	);

	const result = builder.build(TEST_TOKEN_SECRET);
	t.is(
		result,
		"SNWS2 Credential=test-token-id,SignedHeaders=content-md5;content-type;date;host,Signature=c031b1470d2410d60676996380c3bdc5f7edf289f724fb1b5fa1a29dce02ea57"
	);
});

test("simplePostWithComputedDigest", (t) => {
	const reqDate = getTestDate();
	const reqBodySha256Hex =
		"2d8bd7d9bb5f85ba643f0110d50cb506a1fe439e769a22503193ea6046bb87f7";
	const reqBodySha256 = Hex.parse(reqBodySha256Hex);
	const reqBodySha256Base64 = Base64.stringify(reqBodySha256);

	const builder = new AuthV2(TEST_TOKEN_ID);
	builder
		.date(reqDate)
		.host("localhost")
		.method(HttpMethod.POST)
		.path("/api/post")
		.contentType("text/plain;charset=UTF-8")
		.computeContentDigest("Hello.");

	const canonicalRequestData = builder.buildCanonicalRequestData();
	t.is(
		canonicalRequestData,
		"POST\n/api/post\n\ncontent-type:text/plain;charset=UTF-8\n" +
			"date:Tue, 25 Apr 2017 14:30:00 GMT\n" +
			"digest:sha-256=" +
			reqBodySha256Base64 +
			"\nhost:localhost\ncontent-type;date;digest;host\n" +
			reqBodySha256Hex
	);

	t.is(
		builder.httpHeaders.firstValue(HttpHeaders.DIGEST),
		"sha-256=" + reqBodySha256Base64
	);

	const result = builder.build(TEST_TOKEN_SECRET);
	t.is(
		result,
		"SNWS2 Credential=test-token-id,SignedHeaders=content-type;date;digest;host,Signature=3da29e2ceb916ad31b4ffe920afcf94c879d0c4abaaed92941875ac4549f3cf6"
	);
});

test("httpHeaders", (t) => {
	// GIVEN
	const headers = new HttpHeaders({
		"x-foo": "foobar",
	});
	const builder = new AuthV2(TEST_TOKEN_ID)
		.headers(headers)
		.date(getTestDate())
		.url("http://example.com/path");

	// THEN
	t.is(
		builder.buildCanonicalRequestData(),
		"GET\n/path\n\n" +
			"date:Tue, 25 Apr 2017 14:30:00 GMT" +
			"\nhost:example.com\ndate;host" +
			"\ne3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
	);
	t.is(
		builder.build(TEST_TOKEN_SECRET),
		"SNWS2 Credential=test-token-id,SignedHeaders=date;host,Signature=0ba4f4469e9e0d48b7ca046e189032881c08e67a00c007fadb00242c4301fe31"
	);
	t.is(headers.firstValue("x-foo"), "foobar");
});
