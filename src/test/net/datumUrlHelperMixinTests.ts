import test from "ava";

import DatumUrlHelperMixin from "../../main/net/datumUrlHelperMixin.js";
import Aggregations from "../../main/domain/aggregation.js";
import {
	default as DatumFilter,
	DatumFilterKeys,
} from "../../main/domain/datumFilter.js";
import DatumReadingTypes from "../../main/domain/datumReadingType.js";
import Environment from "../../main/net/environment.js";
import Pagination from "../../main/domain/pagination.js";
import SortDescriptor from "../../main/domain/sortDescriptor.js";
import UrlHelper from "../../main/net/urlHelper.js";

class NodeDatumUrlHelper extends DatumUrlHelperMixin(UrlHelper) {}

test("create", (t) => {
	const helper = new NodeDatumUrlHelper();
	t.truthy(helper);
});

test("create:environment", (t) => {
	const env = new Environment({ host: "example.com" });
	const helper = new NodeDatumUrlHelper(env);
	t.truthy(helper);
	t.is(helper.baseUrl(), "https://example.com");
});

test("baseUrl", (t) => {
	const helper = new NodeDatumUrlHelper();
	t.is(helper.baseUrl(), "https://data.solarnetwork.net");
});

test("reportableIntervalUrl:parameters:nodeId", (t) => {
	const helper = new NodeDatumUrlHelper();
	helper.parameter(DatumFilterKeys.NodeId, 123);

	t.is(
		helper.reportableIntervalUrl(),
		"https://data.solarnetwork.net/range/interval" + "?nodeId=123"
	);

	t.is(
		helper.reportableIntervalUrl(234),
		"https://data.solarnetwork.net/range/interval" + "?nodeId=234",
		"argument node ID overrides parameter"
	);
});

test("reportableIntervalUrl:parameters:nodeIds", (t) => {
	const helper = new NodeDatumUrlHelper();
	helper.parameter(DatumFilterKeys.NodeIds, [234, 123]);

	t.is(
		helper.reportableIntervalUrl(),
		"https://data.solarnetwork.net/range/interval" + "?nodeId=234"
	);
});

test("reportableIntervalUrl:sources", (t) => {
	const helper = new NodeDatumUrlHelper();
	helper.parameter(DatumFilterKeys.NodeId, 123);
	helper.parameter(DatumFilterKeys.SourceId, "abc");

	t.is(
		helper.reportableIntervalUrl(),
		"https://data.solarnetwork.net/range/interval" +
			"?nodeId=123&sourceIds=abc"
	);

	t.is(
		helper.reportableIntervalUrl(undefined, []),
		"https://data.solarnetwork.net/range/interval" + "?nodeId=123",
		"argument empty source IDs used"
	);

	t.is(
		helper.reportableIntervalUrl(undefined, ["one", "two"]),
		"https://data.solarnetwork.net/range/interval" +
			"?nodeId=123&sourceIds=one,two",
		"argument source IDs used"
	);

	t.is(
		helper.reportableIntervalUrl(undefined, ["&one", "=two"]),
		"https://data.solarnetwork.net/range/interval" +
			"?nodeId=123&sourceIds=%26one,%3Dtwo",
		"source IDs URI escaped"
	);
});

test("availableSources:empty", (t) => {
	const helper = new NodeDatumUrlHelper();
	t.is(
		helper.availableSourcesUrl(),
		"https://data.solarnetwork.net/range/sources"
	);
});

test("availableSources:emptyAndNullArgNodeId", (t) => {
	const helper = new NodeDatumUrlHelper();
	const filter = new DatumFilter();
	filter.metadataFilter = "(foo=bar)";
	t.is(
		helper.availableSourcesUrl(filter),
		"https://data.solarnetwork.net/range/sources" +
			"?metadataFilter=(foo%3Dbar)"
	);
});

test("availableSources:withNodeIdsTrue", (t) => {
	const helper = new NodeDatumUrlHelper();
	const filter = new DatumFilter();
	filter.nodeId = 123;
	t.is(
		helper.availableSourcesUrl(filter, true),
		"https://data.solarnetwork.net/range/sources" +
			"?nodeId=123&withNodeIds=true"
	);
});

test("availableSources:withNodeIdsFalse", (t) => {
	const helper = new NodeDatumUrlHelper();
	const filter = new DatumFilter();
	filter.nodeId = 123;
	t.is(
		helper.availableSourcesUrl(filter, false),
		"https://data.solarnetwork.net/range/sources" +
			"?nodeId=123&withNodeIds=false"
	);
});

test("availableSources:withNodeIds:helperFilter", (t) => {
	const helper = new NodeDatumUrlHelper();
	helper.parameter(DatumFilterKeys.NodeId, 123);
	t.is(
		helper.availableSourcesUrl(undefined, true),
		"https://data.solarnetwork.net/range/sources" +
			"?nodeId=123&withNodeIds=true"
	);
});

test("availableSources:default", (t) => {
	const helper = new NodeDatumUrlHelper();
	helper.parameter(DatumFilterKeys.NodeId, 123);
	t.is(
		helper.availableSourcesUrl(),
		"https://data.solarnetwork.net/range/sources" + "?nodeId=123"
	);

	helper.parameter(DatumFilterKeys.NodeIds, [123, 234]);
	t.is(
		helper.availableSourcesUrl(),
		"https://data.solarnetwork.net/range/sources" + "?nodeIds=123,234"
	);
});

test("availableSources:argNodeId", (t) => {
	const helper = new NodeDatumUrlHelper();
	helper.parameter(DatumFilterKeys.NodeId, 123);
	const filter = new DatumFilter();
	filter.nodeId = 234;
	t.is(
		helper.availableSourcesUrl(filter),
		"https://data.solarnetwork.net/range/sources" + "?nodeId=234"
	);
	filter.nodeIds = [234, 345];
	t.is(
		helper.availableSourcesUrl(filter),
		"https://data.solarnetwork.net/range/sources" + "?nodeIds=234,345"
	);
});

test("availableSources:metadataFilter", (t) => {
	const helper = new NodeDatumUrlHelper();
	helper.parameter(DatumFilterKeys.NodeId, 123);
	const filter = helper.datumFilter();
	filter.metadataFilter = "(foo=bar)";
	t.is(
		helper.availableSourcesUrl(filter),
		"https://data.solarnetwork.net/range/sources" +
			"?nodeId=123&metadataFilter=(foo%3Dbar)"
	);
});

test("availableSources:dates", (t) => {
	const helper = new NodeDatumUrlHelper();
	helper.parameter(DatumFilterKeys.NodeId, 123);
	const filter = helper.datumFilter();
	filter.startDate = new Date("2017-01-01T12:12:12.123Z");
	filter.endDate = new Date(filter.startDate.getTime() + 24 * 60 * 60 * 1000);
	t.is(
		helper.availableSourcesUrl(filter),
		"https://data.solarnetwork.net/range/sources" +
			"?nodeId=123&startDate=2017-01-01T12%3A12&endDate=2017-01-02T12%3A12"
	);
});

test("datumFilter:nodesAndSources", (t) => {
	const helper = new NodeDatumUrlHelper();
	helper.parameter(DatumFilterKeys.NodeId, 123);
	let filter = helper.datumFilter();
	t.deepEqual(filter.properties(), { nodeIds: [123] });

	helper.parameter(DatumFilterKeys.SourceId, "abc");
	filter = helper.datumFilter();
	t.deepEqual(filter.properties(), { nodeIds: [123], sourceIds: ["abc"] });
});

test("listDatumUrl", (t) => {
	const helper = new NodeDatumUrlHelper();
	const filter = new DatumFilter();
	filter.nodeId = 123;
	filter.aggregation = Aggregations.Hour;
	filter.startDate = new Date("2017-01-01T12:12:12.123Z");
	filter.endDate = new Date(filter.startDate.getTime() + 24 * 60 * 60 * 1000);
	t.is(
		helper.listDatumUrl(
			filter,
			[new SortDescriptor("foo")],
			new Pagination(1, 2)
		),
		"https://data.solarnetwork.net/datum/list?" +
			"nodeId=123&aggregation=Hour&startDate=2017-01-01T12%3A12&endDate=2017-01-02T12%3A12" +
			"&sorts%5B0%5D.key=foo&max=1&offset=2"
	);
});

test("pageZeroNoMax", (t) => {
	const helper = new NodeDatumUrlHelper();
	const filter = new DatumFilter();
	filter.nodeId = 123;
	filter.aggregation = Aggregations.Hour;
	filter.startDate = new Date("2017-01-01T12:12:12.123Z");
	filter.endDate = new Date(filter.startDate.getTime() + 24 * 60 * 60 * 1000);
	t.is(
		helper.listDatumUrl(filter, undefined, new Pagination()),
		"https://data.solarnetwork.net/datum/list?" +
			"nodeId=123&aggregation=Hour&startDate=2017-01-01T12%3A12&endDate=2017-01-02T12%3A12"
	);
});

test("listDatumUrl:defaultFilter", (t) => {
	const helper = new NodeDatumUrlHelper();
	helper.parameter(DatumFilterKeys.NodeId, 123);

	helper.parameter(DatumFilterKeys.SourceId, "abc");

	t.is(
		helper.listDatumUrl(),
		"https://data.solarnetwork.net/datum/list?" + "nodeId=123&sourceId=abc"
	);
});

test("mostRecentDatumUrl", (t) => {
	const helper = new NodeDatumUrlHelper();
	const filter = new DatumFilter();
	filter.nodeId = 123;
	filter.startDate = new Date("2017-01-01T12:12:12.123Z");
	filter.endDate = new Date(filter.startDate.getTime() + 24 * 60 * 60 * 1000);
	t.is(
		helper.mostRecentDatumUrl(
			filter,
			[new SortDescriptor("foo")],
			new Pagination(1, 2)
		),
		"https://data.solarnetwork.net/datum/mostRecent?" +
			"nodeId=123&startDate=2017-01-01T12%3A12&endDate=2017-01-02T12%3A12" +
			"&sorts%5B0%5D.key=foo&max=1&offset=2"
	);
});

test("mostRecentDatumUrl:defaultFilter", (t) => {
	const helper = new NodeDatumUrlHelper();
	helper.parameter(DatumFilterKeys.NodeId, 123);

	helper.parameter(DatumFilterKeys.SourceId, "abc");

	t.is(
		helper.mostRecentDatumUrl(),
		"https://data.solarnetwork.net/datum/mostRecent?" +
			"nodeId=123&sourceId=abc"
	);
});

test("datumReadingUrl", (t) => {
	const helper = new NodeDatumUrlHelper();
	const filter = new DatumFilter();
	filter.nodeId = 123;
	filter.startDate = new Date("2017-01-01T12:12:12.123Z");
	filter.endDate = new Date(filter.startDate.getTime() + 24 * 60 * 60 * 1000);
	t.is(
		helper.datumReadingUrl(
			DatumReadingTypes.NearestDifference,
			filter,
			"P1D"
		),
		"https://data.solarnetwork.net/datum/reading?" +
			"nodeId=123&startDate=2017-01-01T12%3A12&endDate=2017-01-02T12%3A12" +
			"&readingType=NearestDifference&tolerance=P1D"
	);
});

test("datumReadingUrl:parameters", (t) => {
	const helper = new NodeDatumUrlHelper();
	helper.parameters.values({
		nodeId: 123,
		startDate: new Date("2017-01-01T12:12Z"),
		endDate: new Date("2017-01-02T12:12Z"),
	});
	t.is(
		helper.datumReadingUrl(DatumReadingTypes.Difference),
		"https://data.solarnetwork.net/datum/reading?" +
			"nodeId=123&startDate=2017-01-01T12%3A12&endDate=2017-01-02T12%3A12" +
			"&readingType=Difference"
	);
});

test("datumReadingUrl:withoutTolerance", (t) => {
	const helper = new NodeDatumUrlHelper();
	const filter = new DatumFilter();
	filter.nodeId = 123;
	filter.sourceId = "foo";
	filter.startDate = new Date("2017-01-01T12:12:12.123Z");
	t.is(
		helper.datumReadingUrl(DatumReadingTypes.CalculatedAt, filter),
		"https://data.solarnetwork.net/datum/reading?" +
			"nodeId=123&sourceId=foo&startDate=2017-01-01T12%3A12" +
			"&readingType=CalculatedAt"
	);
});

test("datumReadingUrl:withSortsAndPagination", (t) => {
	const helper = new NodeDatumUrlHelper();
	const filter = new DatumFilter();
	filter.nodeId = 123;
	filter.sourceId = "foo";
	filter.startDate = new Date("2017-01-01T12:12:12.123Z");
	filter.aggregation = Aggregations.Hour;
	t.is(
		helper.datumReadingUrl(
			DatumReadingTypes.Difference,
			filter,
			undefined,
			[new SortDescriptor("foo")],
			new Pagination(1, 2)
		),
		"https://data.solarnetwork.net/datum/reading?" +
			"nodeId=123&sourceId=foo&startDate=2017-01-01T12%3A12&aggregation=Hour&readingType=Difference" +
			"&sorts%5B0%5D.key=foo&max=1&offset=2"
	);
});

test("streamDatumUrl", (t) => {
	const helper = new NodeDatumUrlHelper();
	const filter = new DatumFilter();
	filter.nodeId = 123;
	filter.aggregation = Aggregations.Hour;
	filter.startDate = new Date("2017-01-01T12:12:12.123Z");
	filter.endDate = new Date(filter.startDate.getTime() + 24 * 60 * 60 * 1000);
	t.is(
		helper.streamDatumUrl(
			filter,
			[new SortDescriptor("foo")],
			new Pagination(1, 2)
		),
		"https://data.solarnetwork.net/datum/stream/datum?" +
			"nodeId=123&aggregation=Hour&startDate=2017-01-01T12%3A12&endDate=2017-01-02T12%3A12" +
			"&sorts%5B0%5D.key=foo&max=1&offset=2"
	);
});

test("streamDatumUrl:parameters", (t) => {
	const filter = new DatumFilter();
	filter.nodeId = 123;
	filter.aggregation = Aggregations.Hour;
	filter.startDate = new Date("2017-01-01T12:12:12.123Z");
	filter.endDate = new Date(filter.startDate.getTime() + 24 * 60 * 60 * 1000);

	const helper = new NodeDatumUrlHelper();
	helper.parameters.values(filter);
	t.is(
		helper.streamDatumUrl(),
		"https://data.solarnetwork.net/datum/stream/datum?" +
			"nodeId=123&aggregation=Hour&startDate=2017-01-01T12%3A12&endDate=2017-01-02T12%3A12"
	);
});

test("streamReadingUrl", (t) => {
	const helper = new NodeDatumUrlHelper();
	const filter = new DatumFilter();
	filter.nodeId = 123;
	filter.startDate = new Date("2017-01-01T12:12:12.123Z");
	filter.endDate = new Date(filter.startDate.getTime() + 24 * 60 * 60 * 1000);
	t.is(
		helper.streamReadingUrl(DatumReadingTypes.Difference, filter),
		"https://data.solarnetwork.net/datum/stream/reading?" +
			"nodeId=123&startDate=2017-01-01T12%3A12&endDate=2017-01-02T12%3A12" +
			"&readingType=Difference"
	);
});

test("streamReadingUrl:parameters", (t) => {
	const filter = new DatumFilter();
	filter.nodeId = 123;
	filter.startDate = new Date("2017-01-01T12:12:12.123Z");
	filter.endDate = new Date(filter.startDate.getTime() + 24 * 60 * 60 * 1000);
	const helper = new NodeDatumUrlHelper();
	helper.parameters.values(filter);
	t.is(
		helper.streamReadingUrl(DatumReadingTypes.Difference),
		"https://data.solarnetwork.net/datum/stream/reading?" +
			"nodeId=123&startDate=2017-01-01T12%3A12&endDate=2017-01-02T12%3A12" +
			"&readingType=Difference"
	);
});

test("streamReadingUrl:tolerance", (t) => {
	const helper = new NodeDatumUrlHelper();
	const filter = new DatumFilter();
	filter.nodeId = 123;
	filter.startDate = new Date("2017-01-01T12:12:12.123Z");
	filter.endDate = new Date(filter.startDate.getTime() + 24 * 60 * 60 * 1000);
	t.is(
		helper.streamReadingUrl(
			DatumReadingTypes.DifferenceWithin,
			filter,
			"P1M"
		),
		"https://data.solarnetwork.net/datum/stream/reading?" +
			"nodeId=123&startDate=2017-01-01T12%3A12&endDate=2017-01-02T12%3A12" +
			"&readingType=DifferenceWithin&tolerance=P1M"
	);
});
