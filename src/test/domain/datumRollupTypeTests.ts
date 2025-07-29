import test from "ava";

import {
	default as DatumRollupTypes,
	DatumRollupType,
	DatumRollupTypeNames,
} from "../../main/domain/datumRollupType.js";

test("create", (t) => {
	const obj = new DatumRollupType("foo", "bar");
	t.truthy(obj);
	t.is(obj.name, "foo");
	t.is(obj.key, "bar");
});

test("enumValues", (t) => {
	const values: readonly DatumRollupType[] = DatumRollupType.enumValues();
	t.deepEqual(values, [
		DatumRollupTypes.None,
		DatumRollupTypes.All,
		DatumRollupTypes.Time,
		DatumRollupTypes.Node,
		DatumRollupTypes.Source,
	]);
});

test("constants", (t) => {
	t.is(DatumRollupTypes.None.name, DatumRollupTypeNames.None);
	t.is(DatumRollupTypes.None.key, "0");
	t.is(DatumRollupTypes.All.name, DatumRollupTypeNames.All);
	t.is(DatumRollupTypes.All.key, "a");
	t.is(DatumRollupTypes.Time.name, DatumRollupTypeNames.Time);
	t.is(DatumRollupTypes.Time.key, "t");
	t.is(DatumRollupTypes.Node.name, DatumRollupTypeNames.Node);
	t.is(DatumRollupTypes.Node.key, "n");
	t.is(DatumRollupTypes.Source.name, DatumRollupTypeNames.Source);
	t.is(DatumRollupTypes.Source.key, "s");
});

test("valueOf", (t) => {
	t.is(DatumRollupType.valueOf("Time"), DatumRollupTypes.Time);
	t.is(DatumRollupType.valueOf("t"), DatumRollupTypes.Time);
});
