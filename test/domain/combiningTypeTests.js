import test from "ava";

import { default as CombiningTypes, CombiningType } from "../../src/domain/combiningType.js";

test("domain:combiningType:create", (t) => {
	const obj = new CombiningType("foo", 1);
	t.truthy(obj);
	t.is(obj.name, "foo");
});

test("domain:combiningType:constants", (t) => {
	t.is(CombiningTypes.Average.name, "Average");
	t.is(CombiningTypes.Difference.name, "Difference");
	t.is(CombiningTypes.Sum.name, "Sum");
});
