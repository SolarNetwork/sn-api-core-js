import test from "ava";

import SortDescriptor from "../../main/domain/sortDescriptor.js";

test("create", (t) => {
	const s = new SortDescriptor("foo");
	t.truthy(s);
	t.is(s.key, "foo");
	t.false(s.descending);
});

test("create:descending", (t) => {
	const s = new SortDescriptor("foo", true);
	t.is(s.key, "foo");
	t.true(s.descending);
});

test("create:ascending", (t) => {
	const s = new SortDescriptor("foo", false);
	t.is(s.key, "foo");
	t.false(s.descending);
});

test("toUriEncoding:ascending", (t) => {
	const s = new SortDescriptor("foo", false);
	t.is(s.toUriEncoding(), "key=foo");
});

test("toUriEncoding:descending", (t) => {
	const s = new SortDescriptor("foo", true);
	t.is(s.toUriEncoding(), "key=foo&descending=true");
});

test("toUriEncoding:indexed:ascending", (t) => {
	const s = new SortDescriptor("foo", false);
	t.is(s.toUriEncoding(0), "sorts%5B0%5D.key=foo");
});

test("toUriEncoding:indexed:descending", (t) => {
	const s = new SortDescriptor("foo", true);
	t.is(
		s.toUriEncoding(0),
		"sorts%5B0%5D.key=foo&sorts%5B0%5D.descending=true"
	);
});

test("toUriEncoding:indexed:descending:customPropName", (t) => {
	const s = new SortDescriptor("foo", true);
	t.is(
		s.toUriEncoding(0, "cookies"),
		"cookies%5B0%5D.key=foo&cookies%5B0%5D.descending=true"
	);
});
