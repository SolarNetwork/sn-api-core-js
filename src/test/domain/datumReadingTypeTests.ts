import test from "ava";

import {
	default as DatumReadingTypes,
	DatumReadingType,
	DatumReadingTypeNames,
} from "../../main/domain/datumReadingType.js";

test("create", (t) => {
	const obj = new DatumReadingType("foo", "bar");
	t.truthy(obj);
	t.is(obj.name, "foo");
	t.is(obj.key, "bar");
});

test("enumValues", (t) => {
	const values: readonly DatumReadingType[] = DatumReadingType.enumValues();
	t.deepEqual(values, [
		DatumReadingTypes.CalculatedAt,
		DatumReadingTypes.CalculatedAtDifference,
		DatumReadingTypes.NearestDifference,
		DatumReadingTypes.Difference,
		DatumReadingTypes.DifferenceWithin,
	]);
});

test("constants", (t) => {
	t.is(
		DatumReadingTypes.CalculatedAt.name,
		DatumReadingTypeNames.CalculatedAt
	);
	t.is(DatumReadingTypes.CalculatedAt.key, "at");
	t.is(
		DatumReadingTypes.CalculatedAtDifference.name,
		DatumReadingTypeNames.CalculatedAtDifference
	);
	t.is(DatumReadingTypes.CalculatedAtDifference.key, "atd");
	t.is(DatumReadingTypes.Difference.name, DatumReadingTypeNames.Difference);
	t.is(DatumReadingTypes.Difference.key, "delta");
	t.is(
		DatumReadingTypes.DifferenceWithin.name,
		DatumReadingTypeNames.DifferenceWithin
	);
	t.is(DatumReadingTypes.DifferenceWithin.key, "change");
	t.is(
		DatumReadingTypes.NearestDifference.name,
		DatumReadingTypeNames.NearestDifference
	);
	t.is(DatumReadingTypes.NearestDifference.key, "diff");
});

test("valueOf", (t) => {
	t.is(DatumReadingType.valueOf("Difference"), DatumReadingTypes.Difference);
	t.is(DatumReadingType.valueOf("delta"), DatumReadingTypes.Difference);
});
