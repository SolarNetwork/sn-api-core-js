import test from "ava";

import MultiMap from "../../main/util/multiMap.js";

test("create", (t) => {
	const map = new MultiMap();
	t.truthy(map);
});

test("createWithProps", (t) => {
	const map = new MultiMap({ a: "foo", b: ["bar", "bam"] });
	t.deepEqual(map.value("a"), ["foo"]);
	t.deepEqual(map.value("b"), ["bar", "bam"]);
});

test("put", (t) => {
	const map = new MultiMap();
	t.is(map.put("foo", "bar"), map);
	t.deepEqual(map.value("foo"), ["bar"]);
});

test("put:undefined", (t) => {
	const map = new MultiMap();
	t.is(map.put("foo", undefined), map);
	t.deepEqual(map.keySet(), []);
});

test("put:null", (t) => {
	const map = new MultiMap();
	t.is(map.put("foo", null), map);
	t.deepEqual(map.value("foo"), [null]);
});

test("putArray", (t) => {
	const map = new MultiMap();
	t.is(map.put("foo", ["bar", "bam"]), map);
	t.deepEqual(map.value("foo"), ["bar", "bam"]);
});

test("remove", (t) => {
	const map = new MultiMap();
	t.is(map.put("foo", "bar"), map);
	t.deepEqual(map.remove("foo"), ["bar"]);
	t.true(map.isEmpty());
});

test("remove:missingKey", (t) => {
	const map = new MultiMap();
	t.true(map.remove("foo") === undefined);
});

test("add", (t) => {
	const map = new MultiMap();
	t.is(map.add("foo", "bar"), map);
	t.is(map.add("foo", "bum"), map);
	t.deepEqual(map.value("foo"), ["bar", "bum"]);
});

test("addArray", (t) => {
	const map = new MultiMap();
	t.is(map.add("foo", "bar"), map);
	t.is(map.add("foo", ["bum", "bum"]), map);
	t.deepEqual(map.value("foo"), ["bar", "bum", "bum"]);
});

test("firstValue:undefined", (t) => {
	const map = new MultiMap();
	t.true(map.firstValue("foo") === undefined);
});

test("firstValue:single", (t) => {
	const map = new MultiMap();
	map.put("foo", "bar");
	t.is(map.firstValue("foo"), "bar");
});

test("firstValue:singleCaseInsensitive", (t) => {
	const map = new MultiMap();
	map.put("FOO", "bar");
	t.is(map.firstValue("foo"), "bar");
});

test("firstValue:array", (t) => {
	const map = new MultiMap();
	map.put("foo", ["bim", "bam"]);
	t.is(map.firstValue("foo"), "bim");
});

test("putAll", (t) => {
	const map = new MultiMap();
	t.is(map.putAll({ foo: "bar", bim: "bam" }), map);
	t.deepEqual(map.value("foo"), ["bar"]);
	t.deepEqual(map.value("bim"), ["bam"]);
});

test("putAllWithArray", (t) => {
	const map = new MultiMap();
	t.is(map.putAll({ foo: "bar", bim: ["bam", "bum"] }), map);
	t.deepEqual(map.value("foo"), ["bar"]);
	t.deepEqual(map.value("bim"), ["bam", "bum"]);
});

test("size:empty", (t) => {
	const map = new MultiMap();
	t.is(map.size(), 0);
});

test("size:single", (t) => {
	const map = new MultiMap();
	map.put("foo", "bar");
	t.is(map.size(), 1);
});

test("size:multi", (t) => {
	const map = new MultiMap();
	map.putAll({ foo: "bar", bim: ["bam", "bum"] });
	t.is(map.size(), 2);
});

test("clear:empty", (t) => {
	const map = new MultiMap();
	t.is(map.clear(), map);
	t.is(map.size(), 0);
});

test("clear:multi", (t) => {
	const map = new MultiMap();
	map.putAll({ foo: "bar", bim: ["bam", "bum"] });
	t.is(map.clear(), map);
	t.is(map.size(), 0);
});

test("isEmpty:empty", (t) => {
	const map = new MultiMap();
	t.true(map.isEmpty());
});

test("isEmpty:not", (t) => {
	const map = new MultiMap();
	map.put("foo", "bar");
	t.false(map.isEmpty());
});

test("isEmpty:afterClear", (t) => {
	const map = new MultiMap();
	map.put("foo", "bar");
	t.false(map.isEmpty());
	map.clear();
	t.true(map.isEmpty());
});

test("keySet:empty", (t) => {
	const map = new MultiMap();
	t.deepEqual(map.keySet(), []);
});

test("keySet:single", (t) => {
	const map = new MultiMap();
	map.put("foo", "bar");
	t.deepEqual(map.keySet(), ["foo"]);
});

test("keySet:multi", (t) => {
	const map = new MultiMap();
	map.putAll({ Foo: "bar", Bim: ["bam", "bum"], Baz: "done" });
	t.deepEqual(map.keySet(), ["Foo", "Bim", "Baz"]);
});

test("containsKey", (t) => {
	const map = new MultiMap();
	map.put("foo", "bar");
	t.true(map.containsKey("foo"), "case match");
	t.true(map.containsKey("FoO"), "case insensitive match");
	t.false(map.containsKey("bar"));
});
