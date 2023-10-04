import test from "ava";

import { LocationDatumUrlHelper } from "../../src/net/locationDatumUrlHelperMixin.js";
import Aggregations from "../../src/domain/aggregation.js";
import DatumFilter from "../../src/domain/datumFilter.js";
import Pagination from "../../src/domain/pagination.js";
import SortDescriptor from "../../src/domain/sortDescriptor.js";

test("core:net:locationDatumUrlHelperMixin:create", (t) => {
	const helper = new LocationDatumUrlHelper();
	t.truthy(helper);
});

test("core:net:locationDatumUrlHelperMixin:baseUrl", (t) => {
	const helper = new LocationDatumUrlHelper();
	t.is(helper.baseUrl(), "https://data.solarnetwork.net/solarquery/api/v1/sec");
});

test("core:net:locationDatumUrlHelperMixin:reportableintervalUrl", (t) => {
	const helper = new LocationDatumUrlHelper();
	helper.locationId = 123;

	t.is(
		helper.reportableIntervalUrl(),
		"https://data.solarnetwork.net/solarquery/api/v1/sec/location/datum/interval" +
			"?locationId=123",
	);

	t.is(
		helper.reportableIntervalUrl(234),
		"https://data.solarnetwork.net/solarquery/api/v1/sec/location/datum/interval" +
			"?locationId=234",
		"argument location ID used",
	);
});

test("core:net:locationDatumUrlHelperMixin:reportableintervalUrl:source", (t) => {
	const helper = new LocationDatumUrlHelper();
	helper.locationId = 123;
	helper.sourceId = "abc";

	t.is(
		helper.reportableIntervalUrl(),
		"https://data.solarnetwork.net/solarquery/api/v1/sec/location/datum/interval" +
			"?locationId=123&sourceId=abc",
	);

	t.is(
		helper.reportableIntervalUrl(null, null),
		"https://data.solarnetwork.net/solarquery/api/v1/sec/location/datum/interval" +
			"?locationId=123",
		"argument null source IDs used",
	);

	t.is(
		helper.reportableIntervalUrl(null, "one"),
		"https://data.solarnetwork.net/solarquery/api/v1/sec/location/datum/interval" +
			"?locationId=123&sourceId=one",
		"argument source IDs used",
	);

	t.is(
		helper.reportableIntervalUrl(null, "&one"),
		"https://data.solarnetwork.net/solarquery/api/v1/sec/location/datum/interval" +
			"?locationId=123&sourceId=%26one",
		"source IDs URI escaped",
	);
});

test("core:net:locationDatumUrlHelperMixin:availableSources:empty", (t) => {
	const helper = new LocationDatumUrlHelper();
	t.is(
		helper.availableSourcesUrl(),
		"https://data.solarnetwork.net/solarquery/api/v1/sec/location/datum/sources" +
			"?locationId=null",
	);
});

test("core:net:locationDatumUrlHelperMixin:availableSources:prop", (t) => {
	const helper = new LocationDatumUrlHelper();
	helper.locationId = 123;
	t.is(
		helper.availableSourcesUrl(),
		"https://data.solarnetwork.net/solarquery/api/v1/sec/location/datum/sources" +
			"?locationId=123",
	);

	helper.locationIds = [123, 234];
	t.is(
		helper.availableSourcesUrl(),
		"https://data.solarnetwork.net/solarquery/api/v1/sec/location/datum/sources" +
			"?locationId=123",
	);
});

test("core:net:locationDatumUrlHelperMixin:availableSources:argLocationId", (t) => {
	const helper = new LocationDatumUrlHelper();
	helper.locationId = 123;
	t.is(
		helper.availableSourcesUrl(234),
		"https://data.solarnetwork.net/solarquery/api/v1/sec/location/datum/sources" +
			"?locationId=234",
	);
});

test("core:net:locationDatumUrlHelperMixin:availableSources:startDate", (t) => {
	const helper = new LocationDatumUrlHelper();
	const start = new Date("2017-01-01T12:12:12.123Z");
	t.is(
		helper.availableSourcesUrl(123, start),
		"https://data.solarnetwork.net/solarquery/api/v1/sec/location/datum/sources" +
			"?locationId=123&start=2017-01-01T12%3A12",
	);
});

test("core:net:locationDatumUrlHelperMixin:availableSources:endDate", (t) => {
	const helper = new LocationDatumUrlHelper();
	const end = new Date("2017-01-01T12:12:12.123Z");
	t.is(
		helper.availableSourcesUrl(123, null, end),
		"https://data.solarnetwork.net/solarquery/api/v1/sec/location/datum/sources" +
			"?locationId=123&end=2017-01-01T12%3A12",
	);
});

test("core:net:locationDatumUrlHelperMixin:availableSources:startAndEndDate", (t) => {
	const helper = new LocationDatumUrlHelper();
	const start = new Date("2017-01-01T12:12:12.123Z");
	const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
	t.is(
		helper.availableSourcesUrl(123, start, end),
		"https://data.solarnetwork.net/solarquery/api/v1/sec/location/datum/sources" +
			"?locationId=123" +
			"&start=2017-01-01T12%3A12" +
			"&end=2017-01-02T12%3A12",
	);
});

test("core:net:locationDatumUrlHelperMixin:listDatumUrl", (t) => {
	const helper = new LocationDatumUrlHelper();
	const filter = new DatumFilter();
	filter.locationId = 123;
	filter.aggregation = Aggregations.Hour;
	filter.startDate = new Date("2017-01-01T12:12:12.123Z");
	filter.endDate = new Date(filter.startDate.getTime() + 24 * 60 * 60 * 1000);
	t.is(
		helper.listDatumUrl(filter, [new SortDescriptor("foo")], new Pagination(1, 2)),
		"https://data.solarnetwork.net/solarquery/api/v1/sec/location/datum/list?" +
			"locationId=123&aggregation=Hour&startDate=2017-01-01T12%3A12&endDate=2017-01-02T12%3A12" +
			"&sorts%5B0%5D.key=foo&max=1&offset=2",
	);
});

test("core:net:locationDatumUrlHelperMixin:mostRecentDatumUrl", (t) => {
	const helper = new LocationDatumUrlHelper();
	const filter = new DatumFilter();
	filter.locationId = 123;
	filter.startDate = new Date("2017-01-01T12:12:12.123Z");
	filter.endDate = new Date(filter.startDate.getTime() + 24 * 60 * 60 * 1000);
	t.is(
		helper.mostRecentDatumUrl(filter, [new SortDescriptor("foo")], new Pagination(1, 2)),
		"https://data.solarnetwork.net/solarquery/api/v1/sec/location/datum/mostRecent?" +
			"locationId=123&startDate=2017-01-01T12%3A12&endDate=2017-01-02T12%3A12" +
			"&sorts%5B0%5D.key=foo&max=1&offset=2",
	);
});
