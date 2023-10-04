import test from "ava";

import { default as DatumStreamTypes, DatumStreamType } from "../../src/domain/datumStreamType.js";

test("domain:datumStreamType:create", (t) => {
	const obj = new DatumStreamType("foo", "bar");
	t.truthy(obj);
	t.is(obj.name, "foo");
	t.is(obj.key, "bar");
});

test("domain:datumStreamType:types", (t) => {
	t.is(DatumStreamTypes.Node.name, "Node");
	t.is(DatumStreamTypes.Node.key, "n");
	t.is(DatumStreamTypes.Location.name, "Location");
	t.is(DatumStreamTypes.Location.key, "l");
});

test("domain:datumStreamType:valueOf", (t) => {
	t.is(DatumStreamType.valueOf("Node"), DatumStreamTypes.Node);
	t.is(DatumStreamType.valueOf("n"), DatumStreamTypes.Node);
	t.is(DatumStreamType.valueOf("Location"), DatumStreamTypes.Location);
	t.is(DatumStreamType.valueOf("l"), DatumStreamTypes.Location);
});
