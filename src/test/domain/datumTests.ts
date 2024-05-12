import test from "ava";

import { default as Datum, DatumInfo } from "../../main/domain/datum.js";
import { timestampFormat } from "../../main/util/dates.js";

test("create", (t) => {
	const info: DatumInfo = {
		created: "2024-01-01 12:34:56.789Z",
		localDate: "2024-01-01",
		localTime: "12:34",
		nodeId: 2,
		sourceId: "Foo",
		foo: 1,
		bar: "wow",
	};
	const obj = new Datum(info);
	t.truthy(obj);
	t.is(obj.created, info.created);
	t.is(obj.date.getTime(), new Date(info.created).getTime());
	t.is(obj.nodeId, info.nodeId);
	t.is(obj.sourceId, info.sourceId);
	t.is(obj.foo, info.foo);
	t.is(obj.bar, info.bar);
});

test("create:noDate", (t) => {
	const now = new Date();
	const info: DatumInfo = {
		localDate: "2024-01-01",
		localTime: "12:34",
		nodeId: 2,
		sourceId: "Foo",
		val: 1,
	} as any;
	const obj = new Datum(info);
	t.truthy(obj);
	t.true(obj.date >= now, "Creation date defaulted to now");
	t.is(
		obj.created,
		timestampFormat(obj.date),
		"Creation date string formatted from date."
	);
});
