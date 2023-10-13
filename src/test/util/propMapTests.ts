import test from "ava";

import PropMap from "../../main/util/propMap.js";
import Aggregations from "../../main/domain/aggregation.js";
import Location from "../../main/domain/location.js";
import SortDescriptor from "../../main/domain/sortDescriptor.js";
import Pagination from "../../main/domain/pagination.js";

test("create", (t) => {
	const m = new PropMap();
	t.truthy(m);
	t.deepEqual(m.props, new Map());
});

test("create:map", (t) => {
	const map = new Map<string, any>();
	map.set("foo", 1);
	const m = new PropMap(map);
	t.truthy(m);
	t.not(m.props, map, "Map argument is copied");
	t.deepEqual(m.props, map, "Map entries copied");
});

test("create:object", (t) => {
	const d = { foo: 1 };
	const m = new PropMap(d);
	t.truthy(m);
	t.deepEqual(
		m.props,
		new Map(Object.entries(d)),
		"object properties copied"
	);
});

test("create:copy", (t) => {
	const d = { foo: 1 };
	const p = new PropMap(d);
	const m = new PropMap(p);
	t.truthy(m);
	t.deepEqual(m.props, new Map(Object.entries(d)));
});

test("toUriEncoding:empty", (t) => {
	const m = new PropMap();
	t.is(m.toUriEncoding(), "");
	t.is(m.toUriEncoding("foo"), "");
});

test("toUriEncoding:single", (t) => {
	const m = new PropMap({ foo: "bar" });
	t.is(m.toUriEncoding(), "foo=bar");
	t.is(m.toUriEncoding("foo"), "foo.foo=bar");
});

test("toUriEncoding:multi", (t) => {
	const m = new PropMap({ foo: "bar", a: 1 });
	t.is(m.toUriEncoding(), "foo=bar&a=1");
	t.is(m.toUriEncoding("foo"), "foo.foo=bar&foo.a=1");
});

test("toUriEncoding:array:empty", (t) => {
	const m = new PropMap({ foo: [] });
	t.is(m.toUriEncoding(), "foo=");
	t.is(m.toUriEncoding("foo"), "foo.foo=");
});

test("toUriEncoding:array:single", (t) => {
	const m = new PropMap({ foo: [1] });
	t.is(m.toUriEncoding(), "foo=1");
	t.is(m.toUriEncoding("foo"), "foo.foo=1");
});

test("toUriEncoding:array:multi", (t) => {
	const m = new PropMap({ foo: [1, 2, 3] });
	t.is(m.toUriEncoding(), "foo=1,2,3");
	t.is(m.toUriEncoding("foo"), "foo.foo=1,2,3");
});

test("toUriEncoding:escaped", (t) => {
	const m = new PropMap({ "$foo!": "=bar", bim: ["&?y", "e", "!@#"] });
	t.is(m.toUriEncoding(), "%24foo!=%3Dbar&bim=%26%3Fy,e,!%40%23");
	t.is(
		m.toUriEncoding("$f"),
		"%24f.%24foo!=%3Dbar&%24f.bim=%26%3Fy,e,!%40%23"
	);
});

test("toUriEncoding:array:callbackFn:single", (t) => {
	const m = new PropMap({ foos: [1], bars: [2], bams: [3, 4] });
	t.is(
		m.toUriEncoding(undefined, (k, v) => {
			if (k === "foos") {
				return ["foo", v];
			} else if (k === "bars") {
				return undefined;
			}
			return k;
		}),
		"foo=1&bams=3,4"
	);
});

test("toUriEncoding:array:callbackFn:forceMultiKey", (t) => {
	const m = new PropMap({ foos: [1, 2, 3] });
	t.is(
		m.toUriEncoding(undefined, (k, v) => {
			return [k, v, true];
		}),
		"foos=1&foos=2&foos=3"
	);
});

test("toUriEncoding:enums", (t) => {
	const m = new PropMap({
		foo: Aggregations.Hour,
		bar: [Aggregations.Week, Aggregations.Month],
	});
	t.is(m.toUriEncoding(), "foo=Hour&bar=Week,Month");
});

test("toUriEncoding:location", (t) => {
	const m = new PropMap({
		foo: "bar",
		location: new Location({
			country: "NZ",
			timeZoneId: "Pacific/Auckland",
		}),
	});
	t.is(
		m.toUriEncoding(),
		"foo=bar&location.country=NZ&location.timeZoneId=Pacific%2FAuckland"
	);
});

test("prop:get", (t) => {
	const m = new PropMap({
		a: "A",
		b: "B",
		c: "C",
	});
	t.is(m.prop("a"), "A", "existing property value returned");
});

test("prop:get:undefined", (t) => {
	const m = new PropMap({
		a: "A",
		b: "B",
		c: "C",
	});
	t.is(m.prop("z"), undefined, "unknown property value returns undefined");
});

test("prop:set:add", (t) => {
	const m = new PropMap({
		a: "A",
		b: "B",
		c: "C",
	});
	t.is(m.prop("d", "D"), m, "setter returns this");
	t.is(m.prop("d"), "D", "value has been added");
});

test("prop:set:update", (t) => {
	const m = new PropMap({
		a: "A",
		b: "B",
		c: "C",
	});
	t.is(m.prop("a", "AAA"), m, "setter returns this");
	t.is(m.prop("a"), "AAA", "value has been updated");
});

test("prop:remove", (t) => {
	const m = new PropMap({
		a: "A",
		b: "B",
		c: "C",
	});
	t.is(m.prop("a", null), m, "setter returns this");
	t.is(m.prop("a"), undefined, "value has been removed");
	t.is(m.prop("d", null), m, "setter returns this");
	t.is(m.prop("d"), undefined, "value does not exist");
});

test("properties:update", (t) => {
	const m = new PropMap({
		a: "A",
		b: "B",
		c: "C",
	});
	t.is(
		m.properties({
			a: "AAA",
			b: null,
			d: "D",
		}),
		m,
		"updater returns this"
	);
	t.is(m.prop("a"), "AAA", "value has been update");
	t.is(m.prop("b"), undefined, "value has been removed");
	t.is(m.prop("d"), "D", "value has been added");
});

test("properties:update:Map", (t) => {
	const m = new PropMap({
		a: "A",
		b: "B",
		c: "C",
	});
	t.is(
		m.properties(
			new Map(
				Object.entries({
					a: "AAA",
					b: null,
					d: "D",
				})
			)
		),
		m,
		"updater returns this"
	);
	t.is(m.prop("a"), "AAA", "value has been update");
	t.is(m.prop("b"), undefined, "value has been removed");
	t.is(m.prop("d"), "D", "value has been added");
});

test("properties:get", (t) => {
	const data = {
		a: "A",
		b: "B",
		c: "C",
	};
	const m = new PropMap(data);
	t.deepEqual(m.properties(), data);
});

test("toUriEncodingWithSorting", (t) => {
	const data = {
		a: "A",
		b: "B",
		c: "C",
	};
	const m = new PropMap(data);
	const sorts = [new SortDescriptor("s1"), new SortDescriptor("s2", true)];
	const page = new Pagination(1, 2);
	t.is(
		m.toUriEncodingWithSorting(sorts, page),
		"a=A&b=B&c=C&sorts%5B0%5D.key=s1&sorts%5B1%5D.key=s2&sorts%5B1%5D.descending=true&max=1&offset=2"
	);
});

test("toUriEncoding:nestedPropMap", (t) => {
	const data = {
		a: "A",
		b: new PropMap({ c: "C" }),
	};
	const m = new PropMap(data);
	t.is(m.toUriEncoding(), "a=A&b.c=C");
});

test("toUriEncoding:nestedNestedPropMap", (t) => {
	const data = {
		a: "A",
		b: new PropMap({ c: new PropMap({ d: "D" }) }),
	};
	const m = new PropMap(data);
	t.is(m.toUriEncoding(), "a=A&b.c.d=D");
});

test("iterate", (t) => {
	const m = new PropMap({ a: "A", b: 2 });

	const seen = new Set<string>();
	for (const [k, v] of m) {
		if (k === "a") {
			t.is(v, "A");
		} else if (k === "b") {
			t.is(v, 2);
		}
		seen.add(k);
	}
	t.deepEqual(seen, new Set(["a", "b"]));
});
