import test from "ava";

import {
	default as DatumReadingTypes,
	DatumReadingType,
} from "../../src/domain/datumReadingType.js";

test("domain:datumReadingType:create", (t) => {
	const obj = new DatumReadingType("foo", "bar");
	t.truthy(obj);
	t.is(obj.name, "foo");
	t.is(obj.key, "bar");
});

test("domain:datumReadingType:aggregations", (t) => {
	t.is(DatumReadingTypes.CalculatedAt.name, "CalculatedAt");
	t.is(DatumReadingTypes.CalculatedAt.key, "at");
	t.is(DatumReadingTypes.CalculatedAtDifference.name, "CalculatedAtDifference");
	t.is(DatumReadingTypes.CalculatedAtDifference.key, "atd");
	t.is(DatumReadingTypes.Difference.name, "Difference");
	t.is(DatumReadingTypes.Difference.key, "delta");
	t.is(DatumReadingTypes.DifferenceWithin.name, "DifferenceWithin");
	t.is(DatumReadingTypes.DifferenceWithin.key, "change");
	t.is(DatumReadingTypes.NearestDifference.name, "NearestDifference");
	t.is(DatumReadingTypes.NearestDifference.key, "diff");
});

test("domain:datumReadingType:valueOf", (t) => {
	t.is(DatumReadingType.valueOf("Difference"), DatumReadingTypes.Difference);
	t.is(DatumReadingType.valueOf("delta"), DatumReadingTypes.Difference);
});
