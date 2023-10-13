import test from "ava";

import { urlQueryParse, urlQueryEncode } from "../../main/net/urls.js";

test("encode:simple", (t) => {
	t.is(urlQueryEncode({ foo: "bar" }), "foo=bar");
});

test("encode:array", (t) => {
	t.is(urlQueryEncode({ foo: ["one", "two"] }), "foo=one&foo=two");
});

test("encode:multi", (t) => {
	t.is(
		urlQueryEncode({ foo: "bar", bim: "bam", life: 42 }),
		"foo=bar&bim=bam&life=42"
	);
});

test("encode:escaped", (t) => {
	t.is(
		urlQueryEncode({ foo: "sn == crazy & cool!" }),
		"foo=sn%20%3D%3D%20crazy%20%26%20cool!"
	);
});

test("encode:custom", (t) => {
	t.is(
		urlQueryEncode({ foo: "bar" }, function (v) {
			return (v as string).toUpperCase();
		}),
		"FOO=BAR"
	);
});

test("parse:simple", (t) => {
	t.deepEqual(urlQueryParse("foo=bar"), { foo: "bar" });
});

test("parse:leadingQuestion", (t) => {
	t.deepEqual(urlQueryParse("?foo=bar"), { foo: "bar" });
});

test("parse:array", (t) => {
	t.deepEqual(urlQueryParse("foo=one&foo=two"), { foo: ["one", "two"] });
});

test("parse:array:forced", (t) => {
	t.deepEqual(urlQueryParse("foo=one&bar=two", new Set(["foo"])), {
		foo: ["one"],
		bar: "two",
	});
});

test("parse:multi", (t) => {
	t.deepEqual(urlQueryParse("foo=bar&bim=bam&life=42"), {
		foo: "bar",
		bim: "bam",
		life: "42",
	});
});

test("parse:escaped", (t) => {
	t.deepEqual(urlQueryParse("foo=sn%20%3D%3D%20crazy%20%26%20cool!"), {
		foo: "sn == crazy & cool!",
	});
});
