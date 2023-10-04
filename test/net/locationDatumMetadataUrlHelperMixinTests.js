import test from "ava";

import DatumFilter from "../../src/domain/datumFilter.js";
import Location from "../../src/domain/location.js";
import Pagination from "../../src/domain/pagination.js";
import SortDescriptor from "../../src/domain/sortDescriptor.js";

import { LocationDatumMetadataUrlHelper } from "../../src/net/locationDatumMetadataUrlHelperMixin.js";

test("core:net:locationLocationDatumMetadataUrlHelperMixin:create", (t) => {
	const helper = new LocationDatumMetadataUrlHelper();
	t.truthy(helper);
});

test("core:net:locationLocationDatumMetadataUrlHelperMixin:viewLocationDatumMetadataUrl:empty", (t) => {
	const helper = new LocationDatumMetadataUrlHelper();
	const result = helper.viewLocationDatumMetadataUrl();
	t.is(result, "https://data.solarnetwork.net/solarquery/api/v1/sec/location/meta/null");
});

test("core:net:locationLocationDatumMetadataUrlHelperMixin:viewLocationDatumMetadataUrl:locationIdParam", (t) => {
	const helper = new LocationDatumMetadataUrlHelper();
	helper.locationId = 123;
	const result = helper.viewLocationDatumMetadataUrl();
	t.is(result, "https://data.solarnetwork.net/solarquery/api/v1/sec/location/meta/123");
});

test("core:net:locationLocationDatumMetadataUrlHelperMixin:viewLocationDatumMetadataUrl:locationIdArgOverrideParam", (t) => {
	const helper = new LocationDatumMetadataUrlHelper();
	helper.locationId = 123;
	const result = helper.viewLocationDatumMetadataUrl(234);
	t.is(result, "https://data.solarnetwork.net/solarquery/api/v1/sec/location/meta/234");
});

test("core:net:locationLocationDatumMetadataUrlHelperMixin:viewLocationDatumMetadataUrl:sourceIdParam", (t) => {
	const helper = new LocationDatumMetadataUrlHelper();
	helper.sourceId = "foo";
	const result = helper.viewLocationDatumMetadataUrl();
	t.is(
		result,
		"https://data.solarnetwork.net/solarquery/api/v1/sec/location/meta/null?sourceId=foo",
	);
});

test("core:net:locationLocationDatumMetadataUrlHelperMixin:viewLocationDatumMetadataUrl:locationAndSourceIdParams", (t) => {
	const helper = new LocationDatumMetadataUrlHelper();
	helper.locationId = 123;
	helper.sourceId = "foo";
	const result = helper.viewLocationDatumMetadataUrl();
	t.is(
		result,
		"https://data.solarnetwork.net/solarquery/api/v1/sec/location/meta/123?sourceId=foo",
	);
});

test("core:net:locationLocationDatumMetadataUrlHelperMixin:viewLocationDatumMetadataUrl:sourceIdArgOverrideParam", (t) => {
	const helper = new LocationDatumMetadataUrlHelper();
	helper.sourceId = "foo";
	const result = helper.viewLocationDatumMetadataUrl(123, "bar");
	t.is(
		result,
		"https://data.solarnetwork.net/solarquery/api/v1/sec/location/meta/123?sourceId=bar",
	);
});

test("core:net:locationLocationDatumMetadataUrlHelperMixin:viewLocationDatumMetadataUrl:sourceIdArgNullOverrideParam", (t) => {
	const helper = new LocationDatumMetadataUrlHelper();
	helper.sourceId = "foo";
	const result = helper.viewLocationDatumMetadataUrl(123, null);
	t.is(result, "https://data.solarnetwork.net/solarquery/api/v1/sec/location/meta/123");
});

test("core:net:locationLocationDatumMetadataUrlHelperMixin:addLocationDatumMetadataUrl:locationIdSourceIdArgs", (t) => {
	const helper = new LocationDatumMetadataUrlHelper();
	const result = helper.addLocationDatumMetadataUrl(123, "bar");
	t.is(
		result,
		"https://data.solarnetwork.net/solarquery/api/v1/sec/location/meta/123?sourceId=bar",
	);
});

test("core:net:locationLocationDatumMetadataUrlHelperMixin:replaceLocationDatumMetadataUrl:locationIdSourceIdArgs", (t) => {
	const helper = new LocationDatumMetadataUrlHelper();
	const result = helper.replaceLocationDatumMetadataUrl(123, "bar");
	t.is(
		result,
		"https://data.solarnetwork.net/solarquery/api/v1/sec/location/meta/123?sourceId=bar",
	);
});

test("core:net:locationLocationDatumMetadataUrlHelperMixin:deleteLocationDatumMetadataUrl:locationIdSourceIdArgs", (t) => {
	const helper = new LocationDatumMetadataUrlHelper();
	const result = helper.deleteLocationDatumMetadataUrl(123, "bar");
	t.is(
		result,
		"https://data.solarnetwork.net/solarquery/api/v1/sec/location/meta/123?sourceId=bar",
	);
});

test("core:net:locationLocationDatumMetadataUrlHelperMixin:findLocationDatumMetadataUrl:sorted", (t) => {
	const helper = new LocationDatumMetadataUrlHelper();
	const filter = new DatumFilter();
	filter.locationId = 123;
	filter.sourceId = "foo";
	t.is(
		helper.findLocationDatumMetadataUrl(filter, [new SortDescriptor("bar")]),
		"https://data.solarnetwork.net/solarquery/api/v1/sec/location/meta?" +
			"locationId=123&sourceId=foo&sorts%5B0%5D.key=bar",
	);
	t.is(
		helper.findLocationDatumMetadataUrl(filter, [new SortDescriptor("bar", true)]),
		"https://data.solarnetwork.net/solarquery/api/v1/sec/location/meta?" +
			"locationId=123&sourceId=foo&sorts%5B0%5D.key=bar&sorts%5B0%5D.descending=true",
	);
});

test("core:net:locationLocationDatumMetadataUrlHelperMixin:findLocationDatumMetadataUrl:general", (t) => {
	const helper = new LocationDatumMetadataUrlHelper();
	const filter = new DatumFilter();
	filter.query = "blah";
	filter.location = new Location({ country: "NZ" });
	filter.sourceId = "foo";
	t.is(
		helper.findLocationDatumMetadataUrl(filter),
		"https://data.solarnetwork.net/solarquery/api/v1/sec/location/meta?" +
			"query=blah&location.country=NZ&sourceId=foo",
	);
});

test("core:net:locationLocationDatumMetadataUrlHelperMixin:findLocationDatumMetadataUrl:paginated", (t) => {
	const helper = new LocationDatumMetadataUrlHelper();
	const filter = new DatumFilter();
	filter.locationId = 123;
	filter.sourceId = "foo";
	t.is(
		helper.findLocationDatumMetadataUrl(filter, null, new Pagination(1, 2)),
		"https://data.solarnetwork.net/solarquery/api/v1/sec/location/meta?" +
			"locationId=123&sourceId=foo&max=1&offset=2",
	);
});

test("core:net:locationLocationDatumMetadataUrlHelperMixin:findLocationDatumMetadataUrl:sortedAndPaginated", (t) => {
	const helper = new LocationDatumMetadataUrlHelper();
	const filter = new DatumFilter();
	filter.locationId = 123;
	filter.sourceId = "foo";
	t.is(
		helper.findLocationDatumMetadataUrl(
			filter,
			[new SortDescriptor("bar")],
			new Pagination(1, 2),
		),
		"https://data.solarnetwork.net/solarquery/api/v1/sec/location/meta?" +
			"locationId=123&sourceId=foo&sorts%5B0%5D.key=bar&max=1&offset=2",
	);
});
