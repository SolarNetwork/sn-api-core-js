import test from "ava";

import { default as GeneralMetadata } from "../../main/domain/generalMetadata.js";

test("create:empty", (t) => {
	const meta = new GeneralMetadata();
	t.truthy(meta);
	t.is(meta.info, undefined);
	t.is(meta.propertyInfo, undefined);
	t.is(meta.tags, undefined);
});

test("create:values", (t) => {
	const m = new Map<string, any>();
	const pm = new Map<string, Map<string, any>>();
	const tags = new Set<string>();
	const meta = new GeneralMetadata(m, pm, tags);
	t.truthy(meta);
	t.is(meta.info, m);
	t.is(meta.propertyInfo, pm);
	t.is(meta.tags, tags);
});

test("create:values:arrayTags", (t) => {
	const meta = new GeneralMetadata(undefined, undefined, ["foo", "bar"]);
	t.deepEqual(meta.tags, new Set(["foo", "bar"]), "array results in set");
});

test("create:values:invalidTags", (t) => {
	const meta = new GeneralMetadata(undefined, undefined, "foo" as any);
	t.is(meta.tags, undefined, "not set or array results in undefined");
});

test("fromJsonEncoding", (t) => {
	const meta = GeneralMetadata.fromJsonEncoding(
		'{"m":{"a":1},"pm":{"b":{"c":2}},"t":["3","4"]}'
	);
	t.truthy(meta);
	t.is(meta.info?.size, 1);
	t.is(meta.info?.get("a"), 1);
	t.is(meta.propertyInfo?.size, 1);
	t.is(meta.propertyInfo?.get("b")?.size, 1);
	t.is(meta.propertyInfo?.get("b")?.get("c"), 2);
	t.deepEqual(meta.tags, new Set(["3", "4"]));
});

test("fromJsonEncoding:empty", (t) => {
	const meta = GeneralMetadata.fromJsonEncoding("{}");
	t.truthy(meta);
	t.is(meta.info, undefined);
	t.is(meta.propertyInfo, undefined);
	t.is(meta.tags, undefined);
});

test("toJsonEncoding", (t) => {
	const m = new Map([["a", 1]]);
	const pm = new Map([["b", new Map([["c", 2]])]]);
	const tags = new Set(["3", "4"]);
	const meta = new GeneralMetadata(m, pm, tags);
	const json = meta.toJsonEncoding();
	t.is(json, '{"m":{"a":1},"pm":{"b":{"c":2}},"t":["3","4"]}');
});
