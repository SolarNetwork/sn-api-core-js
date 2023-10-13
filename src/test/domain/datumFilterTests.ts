import test from "ava";

import {
	default as DatumFilter,
	DatumFilterKeys,
} from "../../main/domain/datumFilter.js";
import Aggregations from "../../main/domain/aggregation.js";
import CombiningTypes from "../../main/domain/combiningType.js";
import Location from "../../main/domain/location.js";
import { dateTimeUrlFormat } from "../../main/util/dates.js";

test("create", (t) => {
	const f = new DatumFilter();
	t.truthy(f);
	t.deepEqual(f.props, new Map());
});

test("create:object", (t) => {
	const d = { foo: 1 };
	const f = new DatumFilter(d);
	t.truthy(f);
	t.deepEqual(
		f.props,
		new Map(Object.entries(d)),
		"object properties copied"
	);
});

test("create:copy", (t) => {
	const f1 = new DatumFilter({ nodeId: 123, sourceId: "abc" });
	const f2 = new DatumFilter(f1);
	t.not(f1.props, f2.props);
	t.deepEqual(f1.props, f2.props);
});

test("nodeId", (t) => {
	const filter = new DatumFilter();
	filter.nodeId = 123;
	t.is(filter.nodeId, 123);
	t.deepEqual(filter.props, new Map(Object.entries({ nodeIds: [123] })));

	filter.nodeId = null;
	t.is(filter.nodeId, undefined);
	t.is(filter.nodeIds, undefined);

	filter[DatumFilterKeys.NodeIds] = [1, 2, 3];
	t.deepEqual(filter.nodeIds, [1, 2, 3]);
});

test("nodeIds", (t) => {
	const filter = new DatumFilter();
	filter.nodeIds = [123, 234];
	t.is(filter.nodeId, 123);
	t.deepEqual(filter.nodeIds, [123, 234]);
	t.deepEqual(filter.props, new Map(Object.entries({ nodeIds: [123, 234] })));
});

test("nodeIds:resetNodeId", (t) => {
	const filter = new DatumFilter();
	filter.nodeIds = [123, 234];
	t.deepEqual(filter.nodeIds, [123, 234]);
	filter.nodeId = 456;
	t.deepEqual(filter.nodeIds, [456], "nodeIds array reset to just nodeId");
});

test("locationId", (t) => {
	const filter = new DatumFilter();
	filter.locationId = 123;
	t.is(filter.locationId, 123);
	t.deepEqual(filter.locationIds, [123]);
	t.deepEqual(filter.props, new Map(Object.entries({ locationIds: [123] })));

	filter.locationId = null;
	t.is(filter.locationId, undefined);
	t.is(filter.locationIds, undefined);
});

test("locationIds", (t) => {
	const filter = new DatumFilter();
	filter.locationIds = [123, 234];
	t.is(filter.locationId, 123);
	t.deepEqual(filter.locationIds, [123, 234]);
	t.deepEqual(
		filter.props,
		new Map(Object.entries({ locationIds: [123, 234] }))
	);

	filter.locationIds = null;
	t.is(filter.locationIds, undefined);
});

test("nodeIds:resetLocationId", (t) => {
	const filter = new DatumFilter();
	filter.locationIds = [123, 234];
	t.deepEqual(filter.locationIds, [123, 234]);
	filter.locationId = 456;
	t.deepEqual(
		filter.locationIds,
		[456],
		"locationIds array reset to just locationId"
	);
});

test("sourceId", (t) => {
	const filter = new DatumFilter();
	filter.sourceId = "abc";
	t.is(filter.sourceId, "abc");
	t.deepEqual(filter.props, new Map(Object.entries({ sourceIds: ["abc"] })));

	filter.sourceId = null;
	t.is(filter.sourceId, undefined);
});

test("sourceIds", (t) => {
	const filter = new DatumFilter();
	filter.sourceIds = ["abc", "234"];
	t.is(filter.sourceId, "abc");
	t.deepEqual(filter.sourceIds, ["abc", "234"]);
	t.deepEqual(
		filter.props,
		new Map(Object.entries({ sourceIds: ["abc", "234"] }))
	);

	filter.sourceIds = null;
	t.is(filter.sourceIds, undefined);
});

test("sourceIds:resetSourceId", (t) => {
	const filter = new DatumFilter();
	filter.sourceIds = ["abc", "234"];
	t.deepEqual(filter.sourceIds, ["abc", "234"]);
	filter.sourceId = "def";
	t.deepEqual(
		filter.sourceIds,
		["def"],
		"sourceIds array reset to just sourceId"
	);
});

test("streamId", (t) => {
	const filter = new DatumFilter();
	filter.streamId = "abd";
	t.is(filter.streamId, "abd");
	t.deepEqual(filter.props, new Map(Object.entries({ streamIds: ["abd"] })));

	filter.streamId = null;
	t.is(filter.streamId, undefined);
});

test("streamIds", (t) => {
	const filter = new DatumFilter();
	filter.streamIds = ["abd", "def"];
	t.is(filter.streamId, "abd");
	t.deepEqual(filter.streamIds, ["abd", "def"]);
	t.deepEqual(
		filter.props,
		new Map(Object.entries({ streamIds: ["abd", "def"] }))
	);

	filter.streamIds = null;
	t.is(filter.streamIds, undefined);
});

test("streamIds:toSingle", (t) => {
	const filter = new DatumFilter();
	filter.streamIds = ["abd", "def"];
	t.deepEqual(filter.streamIds, ["abd", "def"]);
	filter.streamId = "ghi";
	t.deepEqual(
		filter.streamIds,
		["ghi"],
		"streamIds array reset to just streamId"
	);
});

test("userId", (t) => {
	const filter = new DatumFilter();
	filter.userId = 123;
	t.is(filter.userId, 123);
	t.deepEqual(filter.props, new Map(Object.entries({ userIds: [123] })));

	filter.userId = null;
	t.is(filter.userId, undefined);
});

test("userIds", (t) => {
	const filter = new DatumFilter();
	filter.userIds = [123, 234];
	t.is(filter.userId, 123);
	t.deepEqual(filter.userIds, [123, 234]);
	t.deepEqual(filter.props, new Map(Object.entries({ userIds: [123, 234] })));

	filter.userIds = null;
	t.is(filter.userIds, undefined);
});

test("userIds:toSingle", (t) => {
	const filter = new DatumFilter();
	filter.userIds = [123, 234];
	t.deepEqual(filter.userIds, [123, 234]);
	filter.userId = 456;
	t.deepEqual(filter.userIds, [456], "userIds array reset to just userId");
});

test("mostRecent", (t) => {
	const filter = new DatumFilter();
	t.is(filter.mostRecent, false);
	filter.mostRecent = true;
	t.is(filter.mostRecent, true);
	t.deepEqual(filter.props, new Map(Object.entries({ mostRecent: true })));
});

test("metadataFilter", (t) => {
	const filter = new DatumFilter();
	t.is(filter.metadataFilter, undefined);
	filter.metadataFilter = "(t=foo)";
	t.is(filter.metadataFilter, "(t=foo)");
	t.deepEqual(
		filter.props,
		new Map(Object.entries({ metadataFilter: "(t=foo)" }))
	);
});

test("withoutTotalResultsCount", (t) => {
	const filter = new DatumFilter();
	t.is(filter.withoutTotalResultsCount, undefined);
	filter.withoutTotalResultsCount = true;
	t.is(filter.withoutTotalResultsCount, true);
	t.deepEqual(
		filter.props,
		new Map(Object.entries({ withoutTotalResultsCount: true }))
	);

	filter.withoutTotalResultsCount = null;
	t.is(filter.withoutTotalResultsCount, undefined);
});

test("withoutTotalResultsCount:truthy", (t) => {
	const filter = new DatumFilter();
	t.is(filter.withoutTotalResultsCount, undefined);
	(filter as any).withoutTotalResultsCount = "yep";
	t.is(filter.withoutTotalResultsCount, true);
	t.deepEqual(
		filter.props,
		new Map(Object.entries({ withoutTotalResultsCount: true }))
	);
});

test("toUriEncoding", (t) => {
	const date = new Date();
	const filter = new DatumFilter();
	filter.startDate = date;
	filter.nodeId = 123;
	filter.sourceId = "abc";
	filter.dataPath = "i.watts";
	filter.tags = ["a", "b"];
	t.is(
		filter.toUriEncoding(),
		"startDate=" +
			encodeURIComponent(dateTimeUrlFormat(date)) +
			"&nodeId=123&sourceId=abc&dataPath=i.watts&tags=a,b"
	);
});

test("toUriEncoding:startDate", (t) => {
	const date = new Date();
	const filter = new DatumFilter();
	filter.startDate = date;
	t.is(
		filter.toUriEncoding(),
		"startDate=" + encodeURIComponent(dateTimeUrlFormat(date))
	);
});

test("toUriEncoding:endDate", (t) => {
	const date = new Date();
	const filter = new DatumFilter();
	filter.endDate = date;
	t.is(
		filter.toUriEncoding(),
		"endDate=" + encodeURIComponent(dateTimeUrlFormat(date))
	);
});

test("toUriEncoding:localStartDate", (t) => {
	const date = new Date("2024-01-01T00:00");
	const filter = new DatumFilter();
	filter.localStartDate = date;
	t.is(
		filter.toUriEncoding(),
		"localStartDate=" + encodeURIComponent("2024-01-01")
	);
});

test("toUriEncoding:localStartDate:full", (t) => {
	const date = new Date("2024-01-01T01:02");
	const filter = new DatumFilter();
	filter.localStartDate = date;
	t.is(
		filter.toUriEncoding(),
		"localStartDate=" + encodeURIComponent("2024-01-01T01:02")
	);
});

test("toUriEncoding:localEndDate", (t) => {
	const date = new Date("2024-01-01T00:00");
	const filter = new DatumFilter();
	filter.localEndDate = date;
	t.is(
		filter.toUriEncoding(),
		"localEndDate=" + encodeURIComponent("2024-01-01")
	);
});

test("toUriEncoding:localEndDate:full", (t) => {
	const date = new Date("2024-01-01T01:02");
	const filter = new DatumFilter();
	filter.localEndDate = date;
	t.is(
		filter.toUriEncoding(),
		"localEndDate=" + encodeURIComponent("2024-01-01T01:02")
	);
});

test("toUriEncoding:mostRecent", (t) => {
	const filter = new DatumFilter();
	filter.mostRecent = false;
	t.is(filter.toUriEncoding(), "", "mostRecent not included when false");
	filter.mostRecent = true;
	t.is(
		filter.toUriEncoding(),
		"mostRecent=true",
		"mostRecent included when true"
	);
});

test("toUriEncoding:pluralProps:single", (t) => {
	const filter = new DatumFilter({
		nodeIds: [1],
		locationIds: [2],
		sourceIds: ["&foo"],
		userIds: [3],
	});
	t.is(
		filter.toUriEncoding(),
		"nodeId=1&locationId=2&sourceId=%26foo&userId=3"
	);
});

test("toUriEncoding:pluralProps:multi", (t) => {
	const filter = new DatumFilter({
		nodeIds: [1, 2],
		locationIds: [5, 6],
		sourceIds: ["&foo", "bar"],
		userIds: [3, 4],
	});
	t.is(
		filter.toUriEncoding(),
		"nodeIds=1,2&locationIds=5,6&sourceIds=%26foo,bar&userIds=3,4"
	);
});

test("toUriEncoding:aggregation", (t) => {
	const filter = new DatumFilter();
	filter.aggregation = Aggregations.DayOfWeek;
	t.is(filter.toUriEncoding(), "aggregation=DayOfWeek");
});

test("toUriEncoding:partialAggregation", (t) => {
	const filter = new DatumFilter();
	filter.partialAggregation = Aggregations.Day;
	t.is(filter.toUriEncoding(), "partialAggregation=Day");
});

test("toUriEncoding:tags", (t) => {
	const filter = new DatumFilter();
	filter.tags = ["a", "b"];
	t.is(filter.toUriEncoding(), "tags=a,b");
});

test("toUriEncoding:location", (t) => {
	const filter = new DatumFilter();
	const loc = new Location({ country: "NZ", timeZoneId: "Pacific/Auckland" });
	filter.location = loc;
	t.is(
		filter.toUriEncoding(),
		"location.country=NZ&location.timeZoneId=Pacific%2FAuckland"
	);
});

test("toUriEncoding:query", (t) => {
	const filter = new DatumFilter();
	filter.query = "arrrr!";
	t.is(filter.toUriEncoding(), "query=arrrr!");
});

test("toUriEncoding:metadataFilter", (t) => {
	const filter = new DatumFilter();
	filter.metadataFilter = "(&(t=foo)(t=bar))";
	t.is(filter.toUriEncoding(), "metadataFilter=(%26(t%3Dfoo)(t%3Dbar))");
});

test("combiningType", (t) => {
	const filter = new DatumFilter();
	t.is(filter.combiningType, undefined);
	filter.combiningType = CombiningTypes.Average;
	t.is(filter.combiningType, CombiningTypes.Average);
	t.deepEqual(
		filter.props,
		new Map(Object.entries({ combiningType: CombiningTypes.Average }))
	);

	filter.combiningType = null;
	t.is(filter.combiningType, undefined);
});

test("combiningType:toUriEncoding", (t) => {
	const filter = new DatumFilter();
	t.is(filter.combiningType, undefined);
	filter.combiningType = CombiningTypes.Average;
	t.is(filter.toUriEncoding(), "combiningType=Average");
});

test("nodeIdMaps", (t) => {
	const filter = new DatumFilter();
	t.is(filter.nodeIdMaps, undefined);
	const m = new Map([
		[-1, new Set([1, 2, 3])],
		[-2, new Set([4, 5])],
	]);
	filter.nodeIdMaps = m;
	t.is(filter.nodeIdMaps, m);

	filter.nodeIdMaps = "foo" as any;
	t.is(filter.nodeIdMaps, undefined, "only Map argument is allowed");
});

test("nodeIdMaps:toUriEncoding", (t) => {
	const filter = new DatumFilter();
	t.is(filter.nodeIdMaps, undefined);
	const m = new Map([
		[-1, new Set([1, 2, 3])],
		[-2, new Set([4, 5])],
	]);
	filter.combiningType = CombiningTypes.Sum;
	filter.nodeIdMaps = m;
	t.is(
		filter.toUriEncoding(),
		"combiningType=Sum&nodeIdMaps=-1%3A1%2C2%2C3&nodeIdMaps=-2%3A4%2C5"
	);
});

test("nodeIdMaps:invalidValue:toUriEncoding", (t) => {
	const filter = new DatumFilter();
	t.is(filter.nodeIdMaps, undefined);
	const m = new Map<number, any>([
		[-1, new Set([1, 2, 3])],
		[-2, "bar"],
	]);
	filter.combiningType = CombiningTypes.Sum;
	filter.nodeIdMaps = m as any;
	t.is(filter.toUriEncoding(), "combiningType=Sum&nodeIdMaps=-1%3A1%2C2%2C3");

	filter.nodeIdMaps = new Map();
	t.is(filter.toUriEncoding(), "combiningType=Sum");
});

test("nodeIdMaps:emptyMap:toUriEncoding", (t) => {
	const filter = new DatumFilter();
	t.is(filter.nodeIdMaps, undefined);
	const m = new Map();
	filter.combiningType = CombiningTypes.Sum;
	filter.nodeIdMaps = m;
	t.is(filter.toUriEncoding(), "combiningType=Sum");
});

test("sourceIdMaps", (t) => {
	const filter = new DatumFilter();
	t.is(filter.sourceIdMaps, undefined);
	const m = new Map([
		["FOO", new Set(["A", "B", "C"])],
		["BAR", new Set(["D", "E"])],
	]);
	filter.sourceIdMaps = m;
	t.is(filter.sourceIdMaps, m);

	filter.sourceIdMaps = "foo" as any;
	t.is(filter.sourceIdMaps, undefined, "only Map argument allowed");
});

test("sourceIdMaps:toUriEncoding", (t) => {
	const filter = new DatumFilter();
	t.is(filter.nodeIdMaps, undefined);
	const m = new Map([
		["FOO", new Set(["A", "B", "C"])],
		["BAR", new Set(["D", "E"])],
	]);
	filter.combiningType = CombiningTypes.Sum;
	filter.sourceIdMaps = m;
	t.is(
		filter.toUriEncoding(),
		"combiningType=Sum&sourceIdMaps=FOO%3AA%2CB%2CC&sourceIdMaps=BAR%3AD%2CE"
	);
});

test("startDate", (t) => {
	const filter = new DatumFilter();
	t.is(filter.startDate, undefined);

	const date = new Date();
	filter.startDate = date;
	t.is(filter.startDate, date);

	filter.startDate = null;
	t.is(filter.startDate, undefined);
});

test("endDate", (t) => {
	const filter = new DatumFilter();
	t.is(filter.endDate, undefined);

	const date = new Date();
	filter.endDate = date;
	t.is(filter.endDate, date);

	filter.endDate = null;
	t.is(filter.endDate, undefined);
});

test("localStartDate", (t) => {
	const filter = new DatumFilter();
	t.is(filter.localStartDate, undefined);

	const date = new Date();
	filter.localStartDate = date;
	t.is(filter.localStartDate, date);

	filter.localStartDate = null;
	t.is(filter.localStartDate, undefined);
});

test("localEndDate", (t) => {
	const filter = new DatumFilter();
	t.is(filter.localEndDate, undefined);

	const date = new Date();
	filter.localEndDate = date;
	t.is(filter.localEndDate, date);

	filter.localEndDate = null;
	t.is(filter.localEndDate, undefined);
});

test("dataPath", (t) => {
	const filter = new DatumFilter();
	t.is(filter.dataPath, undefined);

	filter.dataPath = "foo";
	t.is(filter.dataPath, "foo");

	filter.dataPath = null;
	t.is(filter.dataPath, undefined);
});

test("aggregation", (t) => {
	const filter = new DatumFilter();
	t.is(filter.aggregation, undefined);

	filter.aggregation = Aggregations.Month;
	t.is(filter.aggregation, Aggregations.Month);

	filter.aggregation = null;
	t.is(filter.aggregation, undefined);
});

test("partialAggregation", (t) => {
	const filter = new DatumFilter();
	t.is(filter.partialAggregation, undefined);

	filter.partialAggregation = Aggregations.Month;
	t.is(filter.partialAggregation, Aggregations.Month);

	filter.partialAggregation = null;
	t.is(filter.partialAggregation, undefined);
});

test("tags", (t) => {
	const filter = new DatumFilter();
	t.is(filter.tags, undefined);

	const tags = ["foo", "bar"];
	filter.tags = tags;
	t.is(filter.tags, tags);

	filter.tags = null;
	t.is(filter.tags, undefined);
});

test("location", (t) => {
	const filter = new DatumFilter();
	t.is(filter.location, undefined);

	const loc = new Location();
	filter.location = loc;
	t.is(filter.location, loc);

	filter.location = null;
	t.is(filter.location, undefined);
});

test("query", (t) => {
	const filter = new DatumFilter();
	t.is(filter.query, undefined);

	filter.query = "foo";
	t.is(filter.query, "foo");

	filter.query = null;
	t.is(filter.query, undefined);
});

test("propertyNames", (t) => {
	const filter = new DatumFilter();
	t.is(filter.propertyName, undefined);
	t.is(filter.propertyNames, undefined);

	filter.propertyName = "foo";
	t.is(filter.propertyName, "foo");
	t.deepEqual(filter.propertyNames, ["foo"]);

	filter.propertyNames = ["bar", "foo"];
	t.is(filter.propertyName, "bar", "first value returned");
	t.deepEqual(filter.propertyNames, ["bar", "foo"]);

	filter.propertyName = null;
	t.is(filter.propertyName, undefined);
	t.is(filter.propertyNames as any, undefined);

	filter.propertyNames = ["bar", "foo"];
	filter.propertyNames = null;
	t.is(filter.propertyName, undefined);
	t.is(filter.propertyNames, undefined);
});

test("instantaneousPropertyNames", (t) => {
	const filter = new DatumFilter();
	t.is(filter.instantaneousPropertyName, undefined);
	t.is(filter.instantaneousPropertyNames, undefined);

	filter.instantaneousPropertyName = "foo";
	t.is(filter.instantaneousPropertyName, "foo");
	t.deepEqual(filter.instantaneousPropertyNames, ["foo"]);

	filter.instantaneousPropertyNames = ["bar", "foo"];
	t.is(filter.instantaneousPropertyName, "bar", "first value returned");
	t.deepEqual(filter.instantaneousPropertyNames, ["bar", "foo"]);

	filter.instantaneousPropertyName = null;
	t.is(filter.instantaneousPropertyName, undefined);
	t.is(filter.instantaneousPropertyNames as any, undefined);

	filter.instantaneousPropertyNames = ["bar", "foo"];
	filter.instantaneousPropertyNames = null;
	t.is(filter.instantaneousPropertyName, undefined);
	t.is(filter.instantaneousPropertyNames, undefined);
});

test("accumulatingPropertyNames", (t) => {
	const filter = new DatumFilter();
	t.is(filter.accumulatingPropertyName, undefined);
	t.is(filter.accumulatingPropertyNames, undefined);

	filter.accumulatingPropertyName = "foo";
	t.is(filter.accumulatingPropertyName, "foo");
	t.deepEqual(filter.accumulatingPropertyNames, ["foo"]);

	filter.accumulatingPropertyNames = ["bar", "foo"];
	t.is(filter.accumulatingPropertyName, "bar", "first value returned");
	t.deepEqual(filter.accumulatingPropertyNames, ["bar", "foo"]);

	filter.accumulatingPropertyName = null;
	t.is(filter.accumulatingPropertyName, undefined);
	t.is(filter.accumulatingPropertyNames as any, undefined);

	filter.accumulatingPropertyNames = ["bar", "foo"];
	filter.accumulatingPropertyNames = null;
	t.is(filter.accumulatingPropertyName, undefined);
	t.is(filter.accumulatingPropertyNames, undefined);
});

test("statusPropertyNames", (t) => {
	const filter = new DatumFilter();
	t.is(filter.statusPropertyName, undefined);
	t.is(filter.statusPropertyNames, undefined);

	filter.statusPropertyName = "foo";
	t.is(filter.statusPropertyName, "foo");
	t.deepEqual(filter.statusPropertyNames, ["foo"]);

	filter.statusPropertyNames = ["bar", "foo"];
	t.is(filter.statusPropertyName, "bar", "first value returned");
	t.deepEqual(filter.statusPropertyNames, ["bar", "foo"]);

	filter.statusPropertyName = null;
	t.is(filter.statusPropertyName, undefined);
	t.is(filter.statusPropertyNames as any, undefined);

	filter.statusPropertyNames = ["bar", "foo"];
	filter.statusPropertyNames = null;
	t.is(filter.statusPropertyName, undefined);
	t.is(filter.statusPropertyNames, undefined);
});
