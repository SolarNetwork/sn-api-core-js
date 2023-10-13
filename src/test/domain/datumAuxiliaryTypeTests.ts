import test from "ava";

import {
	default as DatumAuxiliaryTypes,
	DatumAuxiliaryType,
	DatumAuxiliaryTypeNames,
} from "../../main/domain/datumAuxiliaryType.js";

test("create", (t) => {
	const obj = new DatumAuxiliaryType("foo");
	t.truthy(obj);
	t.is(obj.name, "foo");
});

test("enumValues", (t) => {
	const values: readonly DatumAuxiliaryType[] =
		DatumAuxiliaryType.enumValues();
	t.deepEqual(values, [DatumAuxiliaryTypes.Reset]);
});

test("constants", (t) => {
	t.is(DatumAuxiliaryTypes.Reset.name, DatumAuxiliaryTypeNames.Reset);
});
