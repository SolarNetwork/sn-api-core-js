import test from "ava";

import {
	default as DatumStreamTypes,
	DatumStreamType,
	DatumStreamTypeNames,
} from "../../main/domain/datumStreamType.js";

test("create", (t) => {
	const obj = new DatumStreamType("foo", "bar");
	t.truthy(obj);
	t.is(obj.name, "foo");
	t.is(obj.key, "bar");
});

test("enumValues", (t) => {
	const values: readonly DatumStreamType[] = DatumStreamType.enumValues();
	t.deepEqual(values, [DatumStreamTypes.Node, DatumStreamTypes.Location]);
});

test("constants", (t) => {
	t.is(DatumStreamTypes.Node.name, DatumStreamTypeNames.Node);
	t.is(DatumStreamTypes.Node.key, "n");
	t.is(DatumStreamTypes.Location.name, DatumStreamTypeNames.Location);
	t.is(DatumStreamTypes.Location.key, "l");
});

test("valueOf", (t) => {
	t.is(DatumStreamType.valueOf("Node"), DatumStreamTypes.Node);
	t.is(DatumStreamType.valueOf("n"), DatumStreamTypes.Node);
	t.is(DatumStreamType.valueOf("Location"), DatumStreamTypes.Location);
	t.is(DatumStreamType.valueOf("l"), DatumStreamTypes.Location);
});
