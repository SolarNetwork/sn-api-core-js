import test from "ava";

import {
	default as DatumSamplesTypes,
	DatumSamplesType,
} from "../../src/domain/datumSamplesType.js";

test("domain:datumSamplesType:create", (t) => {
	const obj = new DatumSamplesType("foo", "bar");
	t.truthy(obj);
	t.is(obj.name, "foo");
	t.is(obj.key, "bar");
});

test("domain:datumSamplesType:aggregations", (t) => {
	t.is(DatumSamplesTypes.Instantaneous.name, "Instantaneous");
	t.is(DatumSamplesTypes.Instantaneous.key, "i");
	t.is(DatumSamplesTypes.Accumulating.name, "Accumulating");
	t.is(DatumSamplesTypes.Accumulating.key, "a");
	t.is(DatumSamplesTypes.Status.name, "Status");
	t.is(DatumSamplesTypes.Status.key, "s");
});

test("domain:datumSamplesType:valueOf", (t) => {
	t.is(DatumSamplesType.valueOf("Instantaneous"), DatumSamplesTypes.Instantaneous);
	t.is(DatumSamplesType.valueOf("i"), DatumSamplesTypes.Instantaneous);
	t.is(DatumSamplesType.valueOf("Accumulating"), DatumSamplesTypes.Accumulating);
	t.is(DatumSamplesType.valueOf("a"), DatumSamplesTypes.Accumulating);
	t.is(DatumSamplesType.valueOf("Status"), DatumSamplesTypes.Status);
	t.is(DatumSamplesType.valueOf("s"), DatumSamplesTypes.Status);
});
