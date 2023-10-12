import test from "ava";

import {
	default as CombiningTypes,
	CombiningType,
	CombiningTypeNames,
} from "../../main/domain/combiningType.js";

test("create", (t) => {
	const obj = new CombiningType("foo");
	t.truthy(obj);
	t.is(obj.name, "foo");
});

test("enumValues", (t) => {
	const values: readonly CombiningType[] = CombiningType.enumValues();
	t.deepEqual(values, [
		CombiningTypes.Average,
		CombiningTypes.Sum,
		CombiningTypes.Difference,
	]);
});

test("constants", (t) => {
	t.is(CombiningTypes.Average.name, CombiningTypeNames.Average);
	t.is(CombiningTypes.Sum.name, CombiningTypeNames.Sum);
	t.is(CombiningTypes.Difference.name, CombiningTypeNames.Difference);
});
