import test from "ava";

import DatumFilter from "domain/datumFilter";
import Aggregations from "domain/aggregation";
import CombiningTypes from "domain/combiningType";
import Location from "domain/location";
import { dateTimeUrlFormat } from "format/date";

test("domain:datumFilter:create", t => {
	const f = new DatumFilter();
	t.truthy(f);
	t.deepEqual(f.props, {});
});

test("domain:datumFilter:create:data", t => {
	const d = { foo: 1 };
	const f = new DatumFilter(d);
	t.truthy(f);
	t.is(f.props, d);
});

test("domain:datumFilter:create:copy", t => {
	const f1 = new DatumFilter({ nodeId: 123, sourceId: "abc" });
	const f2 = new DatumFilter(f1);
	t.not(f1.props, f2.props);
	t.deepEqual(f1.props, f2.props);
});

test("domain:datumFilter:nodeId", t => {
	const filter = new DatumFilter();
	filter.nodeId = 123;
	t.is(filter.nodeId, 123);
	t.deepEqual(filter.props, { nodeIds: [123] });
});

test("domain:datumFilter:nodeIds", t => {
	const filter = new DatumFilter();
	filter.nodeIds = [123, 234];
	t.is(filter.nodeId, 123);
	t.deepEqual(filter.nodeIds, [123, 234]);
	t.deepEqual(filter.props, { nodeIds: [123, 234] });
});

test("domain:datumFilter:nodeIds:resetNodeId", t => {
	const filter = new DatumFilter();
	filter.nodeIds = [123, 234];
	t.deepEqual(filter.nodeIds, [123, 234]);
	filter.nodeId = 456;
	t.deepEqual(filter.nodeIds, [456], "nodeIds array reset to just nodeId");
});

test("domain:datumFilter:locationIds", t => {
	const filter = new DatumFilter();
	filter.locationIds = [123, 234];
	t.is(filter.locationId, 123);
	t.deepEqual(filter.locationIds, [123, 234]);
	t.deepEqual(filter.props, { locationIds: [123, 234] });
});

test("domain:datumFilter:nodeIds:resetLocationId", t => {
	const filter = new DatumFilter();
	filter.locationIds = [123, 234];
	t.deepEqual(filter.locationIds, [123, 234]);
	filter.locationId = 456;
	t.deepEqual(filter.locationIds, [456], "locationIds array reset to just locationId");
});

test("domain:datumFilter:sourceId", t => {
	const filter = new DatumFilter();
	filter.sourceId = "abc";
	t.is(filter.sourceId, "abc");
	t.deepEqual(filter.props, { sourceIds: ["abc"] });
});

test("domain:datumFilter:sourceIds", t => {
	const filter = new DatumFilter();
	filter.sourceIds = ["abc", "234"];
	t.is(filter.sourceId, "abc");
	t.deepEqual(filter.sourceIds, ["abc", "234"]);
	t.deepEqual(filter.props, { sourceIds: ["abc", "234"] });
});

test("domain:datumFilter:sourceIds:resetSourceId", t => {
	const filter = new DatumFilter();
	filter.sourceIds = ["abc", "234"];
	t.deepEqual(filter.sourceIds, ["abc", "234"]);
	filter.sourceId = "def";
	t.deepEqual(filter.sourceIds, ["def"], "sourceIds array reset to just sourceId");
});

test("domain:datumFilter:userId", t => {
	const filter = new DatumFilter();
	filter.userId = 123;
	t.is(filter.userId, 123);
	t.deepEqual(filter.props, { userIds: [123] });
});

test("domain:datumFilter:userIds", t => {
	const filter = new DatumFilter();
	filter.userIds = [123, 234];
	t.is(filter.userId, 123);
	t.deepEqual(filter.userIds, [123, 234]);
	t.deepEqual(filter.props, { userIds: [123, 234] });
});

test("domain:datumFilter:userIds:resetNodeId", t => {
	const filter = new DatumFilter();
	filter.userIds = [123, 234];
	t.deepEqual(filter.userIds, [123, 234]);
	filter.userId = 456;
	t.deepEqual(filter.userIds, [456], "userIds array reset to just userId");
});

test("domain:datumFilter:mostRecent", t => {
	const filter = new DatumFilter();
	t.is(filter.mostRecent, false);
	filter.mostRecent = true;
	t.is(filter.mostRecent, true);
	t.deepEqual(filter.props, { mostRecent: true });
});

test("domain:datumFilter:metadataFilter", t => {
	const filter = new DatumFilter();
	t.is(filter.metadataFilter, undefined);
	filter.metadataFilter = "(t=foo)";
	t.is(filter.metadataFilter, "(t=foo)");
	t.deepEqual(filter.props, { metadataFilter: "(t=foo)" });
});

test("domain:datumFilter:withoutTotalResultsCount", t => {
	const filter = new DatumFilter();
	t.is(filter.withoutTotalResultsCount, undefined);
	filter.withoutTotalResultsCount = true;
	t.is(filter.withoutTotalResultsCount, true);
	t.deepEqual(filter.props, { withoutTotalResultsCount: true });
});

test("domain:datumFilter:withoutTotalResultsCount:truthy", t => {
	const filter = new DatumFilter();
	t.is(filter.withoutTotalResultsCount, undefined);
	filter.withoutTotalResultsCount = "yep";
	t.is(filter.withoutTotalResultsCount, true);
	t.deepEqual(filter.props, { withoutTotalResultsCount: true });
});

test("domain:datumFilter:toUriEncoding", t => {
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

test("domain:datumFilter:toUriEncoding:startDate", t => {
	const date = new Date();
	const filter = new DatumFilter();
	filter.startDate = date;
	t.is(filter.toUriEncoding(), "startDate=" + encodeURIComponent(dateTimeUrlFormat(date)));
});

test("domain:datumFilter:toUriEncoding:endDate", t => {
	const date = new Date();
	const filter = new DatumFilter();
	filter.endDate = date;
	t.is(filter.toUriEncoding(), "endDate=" + encodeURIComponent(dateTimeUrlFormat(date)));
});

test("domain:datumFilter:toUriEncoding:mostRecent", t => {
	const filter = new DatumFilter();
	filter.mostRecent = false;
	t.is(filter.toUriEncoding(), "", "mostRecent not included when false");
	filter.mostRecent = true;
	t.is(filter.toUriEncoding(), "mostRecent=true", "mostRecent included when true");
});

test("domain:datumFilter:toUriEncoding:pluralProps:single", t => {
	const filter = new DatumFilter({
		nodeIds: [1],
		locationIds: [2],
		sourceIds: ["&foo"],
		userIds: [3]
	});
	t.is(filter.toUriEncoding(), "nodeId=1&locationId=2&sourceId=%26foo&userId=3");
});

test("domain:datumFilter:toUriEncoding:pluralProps:multi", t => {
	const filter = new DatumFilter({
		nodeIds: [1, 2],
		locationIds: [5, 6],
		sourceIds: ["&foo", "bar"],
		userIds: [3, 4]
	});
	t.is(filter.toUriEncoding(), "nodeIds=1,2&locationIds=5,6&sourceIds=%26foo,bar&userIds=3,4");
});

test("domain:datumFilter:toUriEncoding:aggregation", t => {
	const filter = new DatumFilter();
	filter.aggregation = Aggregations.DayOfWeek;
	t.is(filter.toUriEncoding(), "aggregation=DayOfWeek");
});

test("domain:datumFilter:toUriEncoding:partialAggregation", t => {
	const filter = new DatumFilter();
	filter.partialAggregation = Aggregations.Day;
	t.is(filter.toUriEncoding(), "partialAggregation=Day");
});

test("domain:datumFilter:toUriEncoding:tags", t => {
	const filter = new DatumFilter();
	filter.tags = ["a", "b"];
	t.is(filter.toUriEncoding(), "tags=a,b");
});

test("domain:datumFilter:toUriEncoding:location", t => {
	const filter = new DatumFilter();
	const loc = new Location({ country: "NZ", timeZoneId: "Pacific/Auckland" });
	filter.location = loc;
	t.is(filter.toUriEncoding(), "location.country=NZ&location.timeZoneId=Pacific%2FAuckland");
});

test("domain:datumFilter:toUriEncoding:query", t => {
	const filter = new DatumFilter();
	filter.query = "arrrr!";
	t.is(filter.toUriEncoding(), "query=arrrr!");
});

test("domain:datumFilter:toUriEncoding:metadataFilter", t => {
	const filter = new DatumFilter();
	filter.metadataFilter = "(&(t=foo)(t=bar))";
	t.is(filter.toUriEncoding(), "metadataFilter=(%26(t%3Dfoo)(t%3Dbar))");
});

test("domain:datumFilter:combiningType", t => {
	const filter = new DatumFilter();
	t.is(filter.combiningType, undefined);
	filter.combiningType = CombiningTypes.Average;
	t.is(filter.combiningType, CombiningTypes.Average);
	t.deepEqual(filter.props, { combiningType: CombiningTypes.Average });
});

test("domain:datumFilter:combiningType:toUriEncoding", t => {
	const filter = new DatumFilter();
	t.is(filter.combiningType, undefined);
	filter.combiningType = CombiningTypes.Average;
	t.is(filter.toUriEncoding(), "combiningType=Average");
});

test("domain:datumFilter:nodeIdMaps", t => {
	const filter = new DatumFilter();
	t.is(filter.nodeIdMaps, undefined);
	const m = new Map([[-1, new Set([1, 2, 3])], [-2, new Set([4, 5])]]);
	filter.nodeIdMaps = m;
	t.is(filter.nodeIdMaps, m);
});

test("domain:datumFilter:nodeIdMaps:toUriEncoding", t => {
	const filter = new DatumFilter();
	t.is(filter.nodeIdMaps, undefined);
	const m = new Map([[-1, new Set([1, 2, 3])], [-2, new Set([4, 5])]]);
	filter.combiningType = CombiningTypes.Sum;
	filter.nodeIdMaps = m;
	t.is(
		filter.toUriEncoding(),
		"combiningType=Sum&nodeIdMaps=-1%3A1%2C2%2C3&nodeIdMaps=-2%3A4%2C5"
	);
});

test("domain:datumFilter:sourceIdMaps", t => {
	const filter = new DatumFilter();
	t.is(filter.sourceIdMaps, undefined);
	const m = new Map([["FOO", new Set(["A", "B", "C"])], ["BAR", new Set(["D", "E"])]]);
	filter.sourceIdMaps = m;
	t.is(filter.sourceIdMaps, m);
});

test("domain:datumFilter:sourceIdMaps:toUriEncoding", t => {
	const filter = new DatumFilter();
	t.is(filter.nodeIdMaps, undefined);
	const m = new Map([["FOO", new Set(["A", "B", "C"])], ["BAR", new Set(["D", "E"])]]);
	filter.combiningType = CombiningTypes.Sum;
	filter.sourceIdMaps = m;
	t.is(
		filter.toUriEncoding(),
		"combiningType=Sum&sourceIdMaps=FOO%3AA%2CB%2CC&sourceIdMaps=BAR%3AD%2CE"
	);
});
