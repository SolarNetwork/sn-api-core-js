import test from "ava";

import {
	objectToStringMap,
	stringMapToObject,
} from "../../main/util/objects.js";

test("objectToStringMap:empty", (t) => {
	const m = objectToStringMap(undefined as any);
	t.truthy(m);
	t.is(m.size, 0);
});

test("stringMapToObject:empty", (t) => {
	const o = stringMapToObject(undefined as any);
	t.truthy(o);
	t.deepEqual(o, {});
});
