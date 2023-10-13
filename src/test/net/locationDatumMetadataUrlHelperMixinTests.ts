import test from "ava";

import {
	default as DatumFilter,
	DatumFilterKeys,
} from "../../main/domain/datumFilter.js";
import Location from "../../main/domain/location.js";
import Pagination from "../../main/domain/pagination.js";
import SortDescriptor from "../../main/domain/sortDescriptor.js";
import UrlHelper from "../../main/net/urlHelper.js";

import LocationDatumMetadataUrlHelperMixin from "../../main/net/locationDatumMetadataUrlHelperMixin.js";

class LocationDatumMetadataUrlHelper extends LocationDatumMetadataUrlHelperMixin(
	UrlHelper
) {}

test("create", (t) => {
	const helper = new LocationDatumMetadataUrlHelper();
	t.truthy(helper);
});

test("viewLocationDatumMetadataUrl:empty", (t) => {
	const helper = new LocationDatumMetadataUrlHelper();
	const result = helper.viewLocationDatumMetadataUrl();
	t.is(result, "https://data.solarnetwork.net/location/meta/undefined");
});

test("viewLocationDatumMetadataUrl:locationIdParam", (t) => {
	const helper = new LocationDatumMetadataUrlHelper();
	helper.parameter(DatumFilterKeys.LocationId, 123);
	const result = helper.viewLocationDatumMetadataUrl();
	t.is(result, "https://data.solarnetwork.net/location/meta/123");
});

test("viewLocationDatumMetadataUrl:locationIdArgOverrideParam", (t) => {
	const helper = new LocationDatumMetadataUrlHelper();
	helper.parameter(DatumFilterKeys.LocationId, 123);
	const result = helper.viewLocationDatumMetadataUrl(234);
	t.is(result, "https://data.solarnetwork.net/location/meta/234");
});

test("viewLocationDatumMetadataUrl:sourceIdParam", (t) => {
	const helper = new LocationDatumMetadataUrlHelper();
	helper.parameter(DatumFilterKeys.SourceId, "foo");
	const result = helper.viewLocationDatumMetadataUrl();
	t.is(
		result,
		"https://data.solarnetwork.net/location/meta/undefined?sourceId=foo"
	);
});

test("viewLocationDatumMetadataUrl:locationAndSourceIdParams", (t) => {
	const helper = new LocationDatumMetadataUrlHelper();
	helper.parameter(DatumFilterKeys.LocationId, 123);
	helper.parameter(DatumFilterKeys.SourceId, "foo");
	const result = helper.viewLocationDatumMetadataUrl();
	t.is(
		result,
		"https://data.solarnetwork.net/location/meta/123?sourceId=foo"
	);
});

test("viewLocationDatumMetadataUrl:sourceIdArgOverrideParam", (t) => {
	const helper = new LocationDatumMetadataUrlHelper();
	helper.parameter(DatumFilterKeys.SourceId, "foo");
	const result = helper.viewLocationDatumMetadataUrl(123, "bar");
	t.is(
		result,
		"https://data.solarnetwork.net/location/meta/123?sourceId=bar"
	);
});

test("viewLocationDatumMetadataUrl:sourceIdArgMissingWithParam", (t) => {
	const helper = new LocationDatumMetadataUrlHelper();
	helper.parameter(DatumFilterKeys.SourceId, "foo");
	const result = helper.viewLocationDatumMetadataUrl(123);
	t.is(
		result,
		"https://data.solarnetwork.net/location/meta/123?sourceId=foo"
	);
});

test("addLocationDatumMetadataUrl:locationIdSourceIdArgs", (t) => {
	const helper = new LocationDatumMetadataUrlHelper();
	const result = helper.addLocationDatumMetadataUrl(123, "bar");
	t.is(
		result,
		"https://data.solarnetwork.net/location/meta/123?sourceId=bar"
	);
});

test("replaceLocationDatumMetadataUrl:locationIdSourceIdArgs", (t) => {
	const helper = new LocationDatumMetadataUrlHelper();
	const result = helper.replaceLocationDatumMetadataUrl(123, "bar");
	t.is(
		result,
		"https://data.solarnetwork.net/location/meta/123?sourceId=bar"
	);
});

test("deleteLocationDatumMetadataUrl:locationIdSourceIdArgs", (t) => {
	const helper = new LocationDatumMetadataUrlHelper();
	const result = helper.deleteLocationDatumMetadataUrl(123, "bar");
	t.is(
		result,
		"https://data.solarnetwork.net/location/meta/123?sourceId=bar"
	);
});

test("findLocationDatumMetadataUrl:sorted", (t) => {
	const helper = new LocationDatumMetadataUrlHelper();
	const filter = new DatumFilter();
	filter.locationId = 123;
	filter.sourceId = "foo";
	t.is(
		helper.findLocationDatumMetadataUrl(filter, [
			new SortDescriptor("bar"),
		]),
		"https://data.solarnetwork.net/location/meta?" +
			"locationId=123&sourceId=foo&sorts%5B0%5D.key=bar"
	);
	t.is(
		helper.findLocationDatumMetadataUrl(filter, [
			new SortDescriptor("bar", true),
		]),
		"https://data.solarnetwork.net/location/meta?" +
			"locationId=123&sourceId=foo&sorts%5B0%5D.key=bar&sorts%5B0%5D.descending=true"
	);
});

test("findLocationDatumMetadataUrl:general", (t) => {
	const helper = new LocationDatumMetadataUrlHelper();
	const filter = new DatumFilter();
	filter.query = "blah";
	filter.location = new Location({ country: "NZ" });
	filter.sourceId = "foo";
	t.is(
		helper.findLocationDatumMetadataUrl(filter),
		"https://data.solarnetwork.net/location/meta?" +
			"query=blah&location.country=NZ&sourceId=foo"
	);
});

test("findLocationDatumMetadataUrl:paginated", (t) => {
	const helper = new LocationDatumMetadataUrlHelper();
	const filter = new DatumFilter();
	filter.locationId = 123;
	filter.sourceId = "foo";
	t.is(
		helper.findLocationDatumMetadataUrl(
			filter,
			undefined,
			new Pagination(1, 2)
		),
		"https://data.solarnetwork.net/location/meta?" +
			"locationId=123&sourceId=foo&max=1&offset=2"
	);
});

test("findLocationDatumMetadataUrl:sortedAndPaginated", (t) => {
	const helper = new LocationDatumMetadataUrlHelper();
	const filter = new DatumFilter();
	filter.locationId = 123;
	filter.sourceId = "foo";
	t.is(
		helper.findLocationDatumMetadataUrl(
			filter,
			[new SortDescriptor("bar")],
			new Pagination(1, 2)
		),
		"https://data.solarnetwork.net/location/meta?" +
			"locationId=123&sourceId=foo&sorts%5B0%5D.key=bar&max=1&offset=2"
	);
});
