import test from "ava";

import Base64 from "crypto-js/enc-base64.js";
import {
	default as HttpMessageSignatureBuilder,
	HttpSignatureAlgorithm,
	SignatureComponent,
} from "../../main/net/httpSignatures.js";
import { serializeBoolean } from "../../main/net/structuredFields.js";

/** The `test-shared-secret` from RFC 9421 appendix B.1.5. */
const TEST_SHARED_SECRET =
	"uzvJfB4u3N0Jy4T7NZ75MDVcr8zSTInedJtkgcu46YW4XByzNJjxBdtjUkdJPBtbmHhIDi6pcl8jsasjlTMtDQ==";

const TEST_CONTENT = '{"hello": "world"}';

const TEST_CONTENT_DIGEST =
	"sha-512=:WZDPaVn/7XgHaAy8pmojAkGWoRx2UFChF41A2svX+TaPm+AbwAgBWnrIiYllu7BNNyealdVLvRwEmTHWXvJwew==:";

const TEST_CREATED = new Date(1618884473 * 1000);

/**
 * The `test-request` message from RFC 9421 appendix B.2:
 *
 * ```
 * POST /foo?param=Value&Pet=dog HTTP/1.1
 * Host: example.com
 * Date: Tue, 20 Apr 2021 02:07:55 GMT
 * Content-Type: application/json
 * Content-Digest: sha-512=:WZDPaVn/...:
 * Content-Length: 18
 *
 * {"hello": "world"}
 * ```
 */
function testRequest(tokenId: string): HttpMessageSignatureBuilder {
	return (
		new HttpMessageSignatureBuilder(tokenId)
			.method("POST")
			.url("https://example.com/foo?param=Value&Pet=dog")
			.header("Date", "Tue, 20 Apr 2021 02:07:55 GMT")
			.header("Content-Type", "application/json")
			.header("Content-Digest", TEST_CONTENT_DIGEST)
			.header("Content-Length", "18")
			.date(TEST_CREATED)
			.tag(undefined)
			// the RFC 9421 test cases use a bare key ID, so opt out of the derived
			// signing key SolarNetwork uses by default
			.derivedSigningKey(false)
	);
}

test("signatureBase:rfc9421:b22:selectiveCoveredComponents", (t) => {
	const builder = testRequest("test-key-rsa-pss")
		.label("sig-b22")
		.covered(
			"@authority",
			"content-digest",
			SignatureComponent.queryParam("Pet")
		)
		.tag("header-example");

	const base = builder.signatureBase();

	t.is(
		base.value,
		'"@authority": example.com\n' +
			'"content-digest": ' +
			TEST_CONTENT_DIGEST +
			"\n" +
			'"@query-param";name="Pet": dog\n' +
			'"@signature-params": ("@authority" "content-digest" ' +
			'"@query-param";name="Pet");created=1618884473' +
			';keyid="test-key-rsa-pss";tag="header-example"',
		"signature base matches RFC 9421 appendix B.2.2"
	);
	t.is(base.lines.length, 4, "one line per component, plus the params line");
});

test("signatureBase:rfc9421:b23:fullCoverage", (t) => {
	const builder = testRequest("test-key-rsa-pss")
		.label("sig-b23")
		.covered(
			"date",
			"@method",
			"@path",
			"@query",
			"@authority",
			"content-type",
			"content-digest",
			"content-length"
		);

	const base = builder.signatureBase();

	t.is(
		base.value,
		'"date": Tue, 20 Apr 2021 02:07:55 GMT\n' +
			'"@method": POST\n' +
			'"@path": /foo\n' +
			'"@query": ?param=Value&Pet=dog\n' +
			'"@authority": example.com\n' +
			'"content-type": application/json\n' +
			'"content-digest": ' +
			TEST_CONTENT_DIGEST +
			"\n" +
			'"content-length": 18\n' +
			'"@signature-params": ("date" "@method" "@path" "@query" ' +
			'"@authority" "content-type" "content-digest" "content-length")' +
			';created=1618884473;keyid="test-key-rsa-pss"',
		"signature base matches RFC 9421 appendix B.2.3"
	);
});

test("sign:rfc9421:b25:hmacSha256", (t) => {
	const builder = testRequest("test-shared-secret")
		.label("sig-b25")
		.covered("date", "@authority", "content-type");
	const signingKey = Base64.parse(TEST_SHARED_SECRET);

	const base = builder.signatureBase();
	const signature = builder.signWithKey(signingKey);

	t.is(
		base.value,
		'"date": Tue, 20 Apr 2021 02:07:55 GMT\n' +
			'"@authority": example.com\n' +
			'"content-type": application/json\n' +
			'"@signature-params": ("date" "@authority" "content-type")' +
			';created=1618884473;keyid="test-shared-secret"',
		"signature base matches RFC 9421 appendix B.2.5"
	);
	t.is(
		signature,
		"pxcQw6G3AjtMBQjwo8XzkZf/bws5LelbaMk5rGIGtE8=",
		"hmac-sha256 signature matches RFC 9421 appendix B.2.5"
	);
	t.is(
		builder.signatureHeaderValueWithKey(signingKey),
		"sig-b25=:pxcQw6G3AjtMBQjwo8XzkZf/bws5LelbaMk5rGIGtE8=:",
		"Signature header value matches RFC 9421 appendix B.2.5"
	);
	t.is(
		builder.signatureInputHeaderValue(),
		'sig-b25=("date" "@authority" "content-type");created=1618884473' +
			';keyid="test-shared-secret"',
		"Signature-Input header value matches RFC 9421 appendix B.2.5"
	);
});

test("signatureBase:rfc9421:b26:ed25519", (t) => {
	// the ed25519 algorithm is not supported yet, but the signature base for this
	// test case is, and it is the part both ends have to agree on
	const builder = testRequest("test-key-ed25519")
		.label("sig-b26")
		.covered(
			"date",
			"@method",
			"@path",
			"@authority",
			"content-type",
			"content-length"
		);

	const base = builder.signatureBase();

	t.is(
		base.value,
		'"date": Tue, 20 Apr 2021 02:07:55 GMT\n' +
			'"@method": POST\n' +
			'"@path": /foo\n' +
			'"@authority": example.com\n' +
			'"content-type": application/json\n' +
			'"content-length": 18\n' +
			'"@signature-params": ("date" "@method" "@path" "@authority" ' +
			'"content-type" "content-length");created=1618884473' +
			';keyid="test-key-ed25519"',
		"signature base matches RFC 9421 appendix B.2.6"
	);
});

test("derivedComponents:queryParamEncoding", (t) => {
	const builder = new HttpMessageSignatureBuilder("test")
		.url(
			"https://www.example.com/parameters?var=this%20is%20a%20big%0Amultiline%20value" +
				"&bar=with+plus+whitespace&fa%C3%A7ade%22%3A%20=something"
		)
		.tag(undefined)
		.covered(
			SignatureComponent.queryParam("var"),
			SignatureComponent.queryParam("bar"),
			SignatureComponent.queryParam("fa%C3%A7ade%22%3A%20")
		);

	const base = builder.signatureBase();

	t.deepEqual(
		base.lines.slice(0, 3),
		[
			'"@query-param";name="var": this%20is%20a%20big%0Amultiline%20value',
			'"@query-param";name="bar": with%20plus%20whitespace',
			'"@query-param";name="fa%C3%A7ade%22%3A%20": something',
		],
		"query parameter values match RFC 9421 section 2.2.8"
	);
});

test("derivedComponents:authorityAndQueryNormalization", (t) => {
	const builder = new HttpMessageSignatureBuilder("test")
		.url("https://WWW.Example.COM:443/")
		.tag(undefined)
		.covered("@authority", "@path", "@query", "@scheme", "@target-uri");

	const base = builder.signatureBase();

	t.deepEqual(
		base.lines.slice(0, 5),
		[
			'"@authority": www.example.com',
			'"@path": /',
			'"@query": ?',
			'"@scheme": https',
			'"@target-uri": https://www.example.com/',
		],
		"the host is lower-cased, the default port omitted, and an absent query is a lone ?"
	);
});

test("derivedComponents:nonDefaultPort", (t) => {
	const builder = new HttpMessageSignatureBuilder("test")
		.url("https://www.example.com:8443/path")
		.tag(undefined)
		.covered("@authority");

	t.is(
		builder.signatureBase().lines[0],
		'"@authority": www.example.com:8443',
		"a non-default port is included in the authority"
	);
});

test("derivedComponents:percentEncodingPreserved", (t) => {
	const builder = new HttpMessageSignatureBuilder("test")
		.url("https://www.example.com/path?param=value&baz=bat%2Dman")
		.tag(undefined)
		.covered("@query");

	t.is(
		builder.signatureBase().lines[0],
		'"@query": ?param=value&baz=bat%2Dman',
		"percent-encoded octets in the query are not decoded"
	);
});

test("signingKey:default", (t) => {
	const builder = new HttpMessageSignatureBuilder("abc123").date(
		TEST_CREATED
	);

	t.is(
		builder.keyId,
		"abc123:20210420",
		"a derived signing key is used unless the caller opts out"
	);
});

test("signingKey:direct", (t) => {
	const builder = new HttpMessageSignatureBuilder("abc123")
		.date(TEST_CREATED)
		.derivedSigningKey(false);

	t.is(builder.keyId, "abc123", "the key ID is the token ID alone");
	t.is(
		builder.computeSigningKey("s3cr3t"),
		"s3cr3t",
		"the signing key is the token secret itself"
	);
});

test("signingKey:derived", (t) => {
	const builder = new HttpMessageSignatureBuilder("abc123")
		.date(TEST_CREATED)
		.derivedSigningKey(true);

	t.is(
		builder.keyId,
		"abc123:20210420",
		"the key ID carries the signing date"
	);
	const key = builder.computeSigningKey("s3cr3t");
	t.not(key, "s3cr3t", "the signing key is not the token secret");
	t.is(
		(key as CryptoJS.lib.WordArray).sigBytes,
		32,
		"the signing key is a HMAC-SHA256 digest"
	);
});

test("contentDigest", (t) => {
	const builder = new HttpMessageSignatureBuilder("abc123").contentDigest(
		TEST_CONTENT
	);

	t.is(
		builder.httpHeaders.firstValue("Content-Digest"),
		"sha-256=:X48E9qOokqqrvdts8nOJRJN3OWDUoyWxBf7kbu9DBPE=:",
		"a sha-256 Content-Digest field is computed for the content"
	);
});

test("contentDigestHeaderValue", (t) => {
	const builder = new HttpMessageSignatureBuilder("abc123").contentDigest(
		TEST_CONTENT
	);

	t.is(
		builder.contentDigestHeaderValue(),
		"sha-256=:X48E9qOokqqrvdts8nOJRJN3OWDUoyWxBf7kbu9DBPE=:",
		"the computed Content-Digest field value is returned"
	);
});

test("contentDigestHeaderValue:notSet", (t) => {
	const builder = new HttpMessageSignatureBuilder("abc123");

	t.is(
		builder.contentDigestHeaderValue(),
		undefined,
		"undefined is returned when no content digest has been computed"
	);
});

test("contentDigestHeaderValue:explicitHeader", (t) => {
	const builder = new HttpMessageSignatureBuilder("abc123").header(
		"Content-Digest",
		TEST_CONTENT_DIGEST
	);

	t.is(
		builder.contentDigestHeaderValue(),
		TEST_CONTENT_DIGEST,
		"a Content-Digest field set directly on the builder is returned, even a sha-512 one"
	);
});

test("contentDigestHeaderValue:reset", (t) => {
	const builder = new HttpMessageSignatureBuilder("abc123").contentDigest(
		TEST_CONTENT
	);

	builder.reset();

	t.is(
		builder.contentDigestHeaderValue(),
		undefined,
		"the content digest is cleared along with the other HTTP headers"
	);
});

test("contentDigestHeaderValue:matchesSignedValue", (t) => {
	const builder = new HttpMessageSignatureBuilder("abc123")
		.method("POST")
		.url("https://data.solarnetwork.net/solaruser/api/v1/sec/nodes")
		.contentType("application/json")
		.contentDigest(TEST_CONTENT)
		.date(TEST_CREATED)
		.coverRequiredComponents();

	const base = builder.signatureBase();

	t.true(
		base.lines.includes(
			'"content-digest": ' + builder.contentDigestHeaderValue()
		),
		"the value returned is the one the signature covers, so sending it on the request verifies"
	);
});

test("coverRequiredComponents:get", (t) => {
	const builder = new HttpMessageSignatureBuilder("abc123")
		.url(
			"https://data.solarnetwork.net/solarquery/api/v1/sec/datum?nodeId=1"
		)
		.coverRequiredComponents();

	t.deepEqual(
		builder.coveredComponents.map((c) => c.name),
		["@method", "@authority", "@path", "@query"],
		"a GET with a query covers the method, authority, path, and query"
	);
});

test("coverRequiredComponents:post", (t) => {
	const builder = new HttpMessageSignatureBuilder("abc123")
		.method("POST")
		.url("https://data.solarnetwork.net/solaruser/api/v1/sec/nodes")
		.contentType("application/json")
		.contentDigest('{"foo":"bar"}')
		.header("X-SN-Thing", "value")
		.coverRequiredComponents();

	t.deepEqual(
		builder.coveredComponents.map((c) => c.name),
		[
			"@method",
			"@authority",
			"@path",
			"content-type",
			"content-digest",
			"x-sn-thing",
		],
		"a POST covers the content type, content digest, and any X-SN-* header"
	);
});

test("signatureInputAndSignatureHeaderValues", (t) => {
	const builder = new HttpMessageSignatureBuilder("abc123")
		.label("sn")
		.url("https://data.solarnetwork.net/solarquery/api/v1/sec/datum")
		.date(TEST_CREATED)
		.algorithm(HttpSignatureAlgorithm.HmacSha256)
		.derivedSigningKey(false)
		.coverRequiredComponents();

	t.is(
		builder.signatureInputHeaderValue(),
		'sn=("@method" "@authority" "@path");created=1618884473' +
			';alg="hmac-sha256";keyid="abc123";tag="solarnetwork"',
		"Signature-Input carries the covered components and parameters in order"
	);
	const signature = builder.signatureHeaderValue("s3cr3t");
	t.true(signature.startsWith("sn=:"), "Signature carries the label");
	t.true(signature.endsWith(":"), "Signature value is a Byte Sequence");
});

test("error:missingField", (t) => {
	const builder = new HttpMessageSignatureBuilder("abc123")
		.url("https://www.example.com/")
		.covered("x-not-here");

	const error = t.throws(() => builder.signatureBase());
	t.regex(error!.message, /x-not-here/);
});

test("error:duplicateComponent", (t) => {
	const builder = new HttpMessageSignatureBuilder("abc123")
		.url("https://www.example.com/")
		.covered("@method", "@method");

	const error = t.throws(() => builder.signatureBase());
	t.regex(error!.message, /more than once/);
});

test("error:unknownDerivedComponent", (t) => {
	const builder = new HttpMessageSignatureBuilder("abc123")
		.url("https://www.example.com/")
		.covered("@nope");

	const error = t.throws(() => builder.signatureBase());
	t.regex(error!.message, /not supported/);
});

test("error:missingQueryParam", (t) => {
	const builder = new HttpMessageSignatureBuilder("abc123")
		.url("https://www.example.com/path?a=1")
		.covered(SignatureComponent.queryParam("b"));

	const error = t.throws(() => builder.signatureBase());
	t.regex(error!.message, /not present/);
});

test("error:repeatedQueryParam", (t) => {
	const builder = new HttpMessageSignatureBuilder("abc123")
		.url("https://www.example.com/path?a=1&a=2")
		.covered(SignatureComponent.queryParam("a"));

	const error = t.throws(() => builder.signatureBase());
	t.regex(error!.message, /more than once/);
});

test("reset", (t) => {
	const builder = testRequest("abc123")
		.label("x")
		.tag("keep-me")
		.covered("@method")
		.expires(new Date(1618884573 * 1000))
		.nonce("abc");

	builder.reset();

	t.is(builder.method(), "GET", "the method is back to the default");
	t.is(builder.coveredComponents.length, 0, "covered components are cleared");
	t.is(builder.httpHeaders.size(), 0, "the HTTP headers are cleared");
	t.is(
		builder.keyId,
		"abc123",
		"the token and signing key mode are preserved"
	);
	builder.date(TEST_CREATED).covered("@method");
	t.is(
		builder.signatureInputHeaderValue(),
		'x=("@method");created=1618884473;keyid="abc123";tag="keep-me"',
		"the label and tag are preserved, and expires and nonce are cleared"
	);
});

test("accessors", (t) => {
	const builder = new HttpMessageSignatureBuilder("abc123")
		.method("PUT")
		.url("https://www.example.com/a/b?c=d")
		.date(TEST_CREATED);

	t.is(builder.method(), "PUT", "the method reads back");
	t.is(
		builder.url(),
		"https://www.example.com/a/b?c=d",
		"the URL reads back"
	);
	t.is(
		builder.date().getTime(),
		TEST_CREATED.getTime(),
		"the date reads back"
	);
});

test("signatureParams:expiresAndNonce", (t) => {
	const builder = testRequest("abc123")
		.label("sn")
		.covered("@method")
		.expires(new Date(1618884573 * 1000))
		.nonce("n-1")
		.tag(undefined);

	t.is(
		builder.signatureInputHeaderValue(),
		'sn=("@method");created=1618884473;expires=1618884573;nonce="n-1"' +
			';keyid="abc123"',
		"expires and nonce are included when set"
	);
});

test("sign:matchesSignWithKey", (t) => {
	const builder = testRequest("abc123").covered("@method", "@authority");

	t.is(
		builder.sign("s3cr3t"),
		builder.signWithKey(builder.computeSigningKey("s3cr3t")),
		"sign() derives the key and signs with it"
	);
});

test("derivedComponents:requestTarget", (t) => {
	const builder = new HttpMessageSignatureBuilder("test")
		.url("https://www.example.com/path?param=value")
		.tag(undefined)
		.covered("@request-target");

	t.is(
		builder.signatureBase().lines[0],
		'"@request-target": /path?param=value',
		"the request target is the path and query"
	);
});

test("queryParam:skipsEmptyPairs", (t) => {
	const builder = new HttpMessageSignatureBuilder("test")
		.url("https://www.example.com/path?a=1&&b=2")
		.tag(undefined)
		.covered(SignatureComponent.queryParam("b"));

	t.is(
		builder.signatureBase().lines[0],
		'"@query-param";name="b": 2',
		"an empty pair in the query string is ignored"
	);
});

test("error:queryParamWithoutName", (t) => {
	const builder = new HttpMessageSignatureBuilder("test")
		.url("https://www.example.com/path?a=1")
		.covered(new SignatureComponent("@query-param"));

	const error = t.throws(() => builder.signatureBase());
	t.regex(error!.message, /requires a 'name' parameter/);
});

test("error:queryParamWithoutQueryString", (t) => {
	const builder = new HttpMessageSignatureBuilder("test")
		.url("https://www.example.com/path")
		.covered(SignatureComponent.queryParam("a"));

	const error = t.throws(() => builder.signatureBase());
	t.regex(error!.message, /not present/);
});

test("serialization:stringEscaping", (t) => {
	const builder = testRequest('ab"c\\d')
		.label("sn")
		.covered("@method")
		.tag('tag"with\\quotes');

	t.is(
		builder.signatureInputHeaderValue(),
		'sn=("@method");created=1618884473;keyid="ab\\"c\\\\d"' +
			';tag="tag\\"with\\\\quotes"',
		"quotes and backslashes are escaped in String values"
	);
});

test("serialization:booleanComponentParameter", (t) => {
	const builder = testRequest("abc123")
		.label("sn")
		.tag(undefined)
		.covered(
			new SignatureComponent(
				"content-digest",
				new Map<string, string | boolean>([["sf", false]])
			)
		);

	t.is(
		builder.signatureInputHeaderValue(),
		'sn=("content-digest";sf=?0);created=1618884473;keyid="abc123"',
		"a false parameter is serialized as an explicit Boolean"
	);
});

test("queryParam:valuelessParameter", (t) => {
	const builder = new HttpMessageSignatureBuilder("test")
		.url("https://www.example.com/path?flag&a=1")
		.tag(undefined)
		.covered(SignatureComponent.queryParam("flag"));

	t.is(
		builder.signatureBase().lines[0],
		'"@query-param";name="flag": ',
		"a query parameter with no value has an empty component value"
	);
});

test("structuredFields:serializeBoolean", (t) => {
	// RFC 9651 serializes a true parameter as a bare flag, so the builder never
	// reaches this arm; the primitive is still specified for both values
	t.is(serializeBoolean(true), "?1", "true serializes as ?1");
	t.is(serializeBoolean(false), "?0", "false serializes as ?0");
});
