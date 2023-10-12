import test from "ava";

import LocationDatumUrlHelperMixin from "../../main/net/locationDatumUrlHelperMixin.js";
import Aggregations from "../../main/domain/aggregation.js";
import {
	default as DatumFilter,
	DatumFilterKeys,
} from "../../main/domain/datumFilter.js";
import Pagination from "../../main/domain/pagination.js";
import SortDescriptor from "../../main/domain/sortDescriptor.js";
import UrlHelper from "../../main/net/urlHelper.js";

class LocationDatumUrlHelper extends LocationDatumUrlHelperMixin(UrlHelper) {}

test("create", (t) => {
	const helper = new LocationDatumUrlHelper();
	t.truthy(helper);
});

test("baseUrl", (t) => {
	const helper = new LocationDatumUrlHelper();
	t.is(helper.baseUrl(), "https://data.solarnetwork.net");
});

test("reportableintervalUrl", (t) => {
	const helper = new LocationDatumUrlHelper();
	helper.parameter(DatumFilterKeys.LocationId, 123);

	t.is(
		helper.reportableIntervalUrl(),
		"https://data.solarnetwork.net/location/datum/interval" +
			"?locationId=123"
	);

	t.is(
		helper.reportableIntervalUrl(234),
		"https://data.solarnetwork.net/location/datum/interval" +
			"?locationId=234",
		"argument location ID used"
	);
});

test("reportableintervalUrl:source", (t) => {
	const helper = new LocationDatumUrlHelper();
	helper.parameter(DatumFilterKeys.LocationId, 123);
	helper.parameter(DatumFilterKeys.SourceId, "abc");

	t.is(
		helper.reportableIntervalUrl(),
		"https://data.solarnetwork.net/location/datum/interval" +
			"?locationId=123&sourceId=abc"
	);

	t.is(
		helper.reportableIntervalUrl(),
		"https://data.solarnetwork.net/location/datum/interval" +
			"?locationId=123&sourceId=abc",
		"argument null source IDs used"
	);

	t.is(
		helper.reportableIntervalUrl(undefined, "one"),
		"https://data.solarnetwork.net/location/datum/interval" +
			"?locationId=123&sourceId=one",
		"argument source IDs used"
	);

	t.is(
		helper.reportableIntervalUrl(undefined, "&one"),
		"https://data.solarnetwork.net/location/datum/interval" +
			"?locationId=123&sourceId=%26one",
		"source IDs URI escaped"
	);
});

test("availableSources:empty", (t) => {
	const helper = new LocationDatumUrlHelper();
	t.is(
		helper.availableSourcesUrl(),
		"https://data.solarnetwork.net/location/datum/sources" +
			"?locationId=undefined"
	);
});

test("availableSources:prop", (t) => {
	const helper = new LocationDatumUrlHelper();
	helper.parameter(DatumFilterKeys.LocationId, 123);
	t.is(
		helper.availableSourcesUrl(),
		"https://data.solarnetwork.net/location/datum/sources" +
			"?locationId=123"
	);

	helper.parameter(DatumFilterKeys.LocationIds, [123, 234]);
	t.is(
		helper.availableSourcesUrl(),
		"https://data.solarnetwork.net/location/datum/sources" +
			"?locationId=123"
	);
});

test("availableSources:argLocationId", (t) => {
	const helper = new LocationDatumUrlHelper();
	helper.parameter(DatumFilterKeys.LocationId, 123);
	t.is(
		helper.availableSourcesUrl(234),
		"https://data.solarnetwork.net/location/datum/sources" +
			"?locationId=234"
	);
});

test("availableSources:startDate", (t) => {
	const helper = new LocationDatumUrlHelper();
	const start = new Date("2017-01-01T12:12:12.123Z");
	t.is(
		helper.availableSourcesUrl(123, start),
		"https://data.solarnetwork.net/location/datum/sources" +
			"?locationId=123&start=2017-01-01T12%3A12"
	);
});

test("availableSources:endDate", (t) => {
	const helper = new LocationDatumUrlHelper();
	const end = new Date("2017-01-01T12:12:12.123Z");
	t.is(
		helper.availableSourcesUrl(123, undefined, end),
		"https://data.solarnetwork.net/location/datum/sources" +
			"?locationId=123&end=2017-01-01T12%3A12"
	);
});

test("availableSources:startAndEndDate", (t) => {
	const helper = new LocationDatumUrlHelper();
	const start = new Date("2017-01-01T12:12:12.123Z");
	const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
	t.is(
		helper.availableSourcesUrl(123, start, end),
		"https://data.solarnetwork.net/location/datum/sources" +
			"?locationId=123" +
			"&start=2017-01-01T12%3A12" +
			"&end=2017-01-02T12%3A12"
	);
});

test("listDatumUrl", (t) => {
	const helper = new LocationDatumUrlHelper();
	const filter = new DatumFilter();
	filter.locationId = 123;
	filter.aggregation = Aggregations.Hour;
	filter.startDate = new Date("2017-01-01T12:12:12.123Z");
	filter.endDate = new Date(filter.startDate.getTime() + 24 * 60 * 60 * 1000);
	t.is(
		helper.listDatumUrl(
			filter,
			[new SortDescriptor("foo")],
			new Pagination(1, 2)
		),
		"https://data.solarnetwork.net/location/datum/list?" +
			"locationId=123&aggregation=Hour&startDate=2017-01-01T12%3A12&endDate=2017-01-02T12%3A12" +
			"&sorts%5B0%5D.key=foo&max=1&offset=2"
	);
});

test("listDatumUrl:empty", (t) => {
	const helper = new LocationDatumUrlHelper();
	t.is(
		helper.listDatumUrl(),
		"https://data.solarnetwork.net/location/datum/list"
	);
});

test("mostRecentDatumUrl", (t) => {
	const helper = new LocationDatumUrlHelper();
	const filter = new DatumFilter();
	filter.locationId = 123;
	filter.startDate = new Date("2017-01-01T12:12:12.123Z");
	filter.endDate = new Date(filter.startDate.getTime() + 24 * 60 * 60 * 1000);
	t.is(
		helper.mostRecentDatumUrl(
			filter,
			[new SortDescriptor("foo")],
			new Pagination(1, 2)
		),
		"https://data.solarnetwork.net/location/datum/mostRecent?" +
			"locationId=123&startDate=2017-01-01T12%3A12&endDate=2017-01-02T12%3A12" +
			"&sorts%5B0%5D.key=foo&max=1&offset=2"
	);
});

test("mostRecentDatumUrl:empty", (t) => {
	const helper = new LocationDatumUrlHelper();
	const filter = new DatumFilter();
	filter.locationId = 123;
	filter.startDate = new Date("2017-01-01T12:12:12.123Z");
	filter.endDate = new Date(filter.startDate.getTime() + 24 * 60 * 60 * 1000);
	t.is(
		helper.mostRecentDatumUrl(),
		"https://data.solarnetwork.net/location/datum/mostRecent"
	);
});
