import test from "ava";

import {
	default as DatumSamplesTypes,
	DatumSamplesType,
	DatumSamplesTypeNames,
} from "../../main/domain/datumSamplesType.js";

test("create", (t) => {
	const obj = new DatumSamplesType("foo", "bar");
	t.truthy(obj);
	t.is(obj.name, "foo");
	t.is(obj.key, "bar");
});

test("enumValues", (t) => {
	const values: readonly DatumSamplesType[] = DatumSamplesType.enumValues();
	t.deepEqual(values, [
		DatumSamplesTypes.Instantaneous,
		DatumSamplesTypes.Accumulating,
		DatumSamplesTypes.Status,
		DatumSamplesTypes.Tag,
	]);
});

test("constants", (t) => {
	t.is(
		DatumSamplesTypes.Instantaneous.name,
		DatumSamplesTypeNames.Instantaneous
	);
	t.is(DatumSamplesTypes.Instantaneous.key, "i");
	t.is(
		DatumSamplesTypes.Accumulating.name,
		DatumSamplesTypeNames.Accumulating
	);
	t.is(DatumSamplesTypes.Accumulating.key, "a");
	t.is(DatumSamplesTypes.Status.name, DatumSamplesTypeNames.Status);
	t.is(DatumSamplesTypes.Status.key, "s");
	t.is(DatumSamplesTypes.Tag.name, DatumSamplesTypeNames.Tag);
	t.is(DatumSamplesTypes.Tag.key, "t");
});

test("valueOf", (t) => {
	t.is(
		DatumSamplesType.valueOf("Instantaneous"),
		DatumSamplesTypes.Instantaneous
	);
	t.is(DatumSamplesType.valueOf("i"), DatumSamplesTypes.Instantaneous);
	t.is(
		DatumSamplesType.valueOf("Accumulating"),
		DatumSamplesTypes.Accumulating
	);
	t.is(DatumSamplesType.valueOf("a"), DatumSamplesTypes.Accumulating);
	t.is(DatumSamplesType.valueOf("Status"), DatumSamplesTypes.Status);
	t.is(DatumSamplesType.valueOf("s"), DatumSamplesTypes.Status);
	t.is(DatumSamplesType.valueOf("Tag"), DatumSamplesTypes.Tag);
	t.is(DatumSamplesType.valueOf("t"), DatumSamplesTypes.Tag);
});
