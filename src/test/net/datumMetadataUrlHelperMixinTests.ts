import test from "ava";

import {
	default as DatumFilter,
	DatumFilterKeys,
} from "../../main/domain/datumFilter.js";
import Pagination from "../../main/domain/pagination.js";
import SortDescriptor from "../../main/domain/sortDescriptor.js";
import UrlHelper from "../../main/net/urlHelper.js";

import DatumMetadataUrlHelperMixin from "../../main/net/datumMetadataUrlHelperMixin.js";

class NodeDatumMetadataUrlHelper extends DatumMetadataUrlHelperMixin(
	UrlHelper
) {}

test("create", (t) => {
	const helper = new NodeDatumMetadataUrlHelper();
	t.truthy(helper);
});

test("viewNodeDatumMetadataUrl:empty", (t) => {
	const helper = new NodeDatumMetadataUrlHelper();
	const result = helper.viewNodeDatumMetadataUrl();
	t.is(result, "https://data.solarnetwork.net/datum/meta/undefined");
});

test("viewNodeDatumMetadataUrl:nodeIdParam", (t) => {
	const helper = new NodeDatumMetadataUrlHelper();
	helper.parameter(DatumFilterKeys.NodeId, 123);
	const result = helper.viewNodeDatumMetadataUrl();
	t.is(result, "https://data.solarnetwork.net/datum/meta/123");
});

test("viewNodeDatumMetadataUrl:nodeIdArgOverrideParam", (t) => {
	const helper = new NodeDatumMetadataUrlHelper();
	helper.parameter(DatumFilterKeys.NodeId, 123);
	const result = helper.viewNodeDatumMetadataUrl(234);
	t.is(result, "https://data.solarnetwork.net/datum/meta/234");
});

test("viewNodeDatumMetadataUrl:sourceIdParam", (t) => {
	const helper = new NodeDatumMetadataUrlHelper();
	helper.parameter(DatumFilterKeys.SourceId, "foo");
	const result = helper.viewNodeDatumMetadataUrl();
	t.is(
		result,
		"https://data.solarnetwork.net/datum/meta/undefined?sourceId=foo"
	);
});

test("viewNodeDatumMetadataUrl:nodeAndSourceIdParams", (t) => {
	const helper = new NodeDatumMetadataUrlHelper();
	helper.parameter(DatumFilterKeys.NodeId, 123);
	helper.parameter(DatumFilterKeys.SourceId, "foo");
	const result = helper.viewNodeDatumMetadataUrl();
	t.is(result, "https://data.solarnetwork.net/datum/meta/123?sourceId=foo");
});

test("viewNodeDatumMetadataUrl:sourceIdArgOverrideParam", (t) => {
	const helper = new NodeDatumMetadataUrlHelper();
	helper.parameter(DatumFilterKeys.SourceId, "foo");
	const result = helper.viewNodeDatumMetadataUrl(123, "bar");
	t.is(result, "https://data.solarnetwork.net/datum/meta/123?sourceId=bar");
});

test("viewNodeDatumMetadataUrl:sourceIdArgMissingWithParam", (t) => {
	const helper = new NodeDatumMetadataUrlHelper();
	helper.parameter(DatumFilterKeys.SourceId, "foo");
	const result = helper.viewNodeDatumMetadataUrl(123);
	t.is(result, "https://data.solarnetwork.net/datum/meta/123?sourceId=foo");
});

test("addNodeDatumMetadataUrl:nodeIdSourceIdArgs", (t) => {
	const helper = new NodeDatumMetadataUrlHelper();
	const result = helper.addNodeDatumMetadataUrl(123, "bar");
	t.is(result, "https://data.solarnetwork.net/datum/meta/123?sourceId=bar");
});

test("replaceNodeDatumMetadataUrl:nodeIdSourceIdArgs", (t) => {
	const helper = new NodeDatumMetadataUrlHelper();
	const result = helper.replaceNodeDatumMetadataUrl(123, "bar");
	t.is(result, "https://data.solarnetwork.net/datum/meta/123?sourceId=bar");
});

test("deleteNodeDatumMetadataUrl:nodeIdSourceIdArgs", (t) => {
	const helper = new NodeDatumMetadataUrlHelper();
	const result = helper.deleteNodeDatumMetadataUrl(123, "bar");
	t.is(result, "https://data.solarnetwork.net/datum/meta/123?sourceId=bar");
});

test("findNodeDatumMetadataUrl:sorted", (t) => {
	const helper = new NodeDatumMetadataUrlHelper();
	t.is(
		helper.findNodeDatumMetadataUrl(123, "foo", [
			new SortDescriptor("bar"),
		]),
		"https://data.solarnetwork.net/datum/meta/123?" +
			"sourceId=foo&sorts%5B0%5D.key=bar"
	);
	t.is(
		helper.findNodeDatumMetadataUrl(123, "foo", [
			new SortDescriptor("bar", true),
		]),
		"https://data.solarnetwork.net/datum/meta/123?" +
			"sourceId=foo&sorts%5B0%5D.key=bar&sorts%5B0%5D.descending=true"
	);
});

test("findNodeDatumMetadataUrl:parameters", (t) => {
	const filter = new DatumFilter();
	filter.nodeId = 123;
	filter.sourceId = "foo";
	const helper = new NodeDatumMetadataUrlHelper();
	helper.parameters.values(filter);
	t.is(
		helper.findNodeDatumMetadataUrl(),
		"https://data.solarnetwork.net/datum/meta/123?sourceId=foo"
	);
});

test("findNodeDatumMetadataUrl:paginated", (t) => {
	const helper = new NodeDatumMetadataUrlHelper();
	t.is(
		helper.findNodeDatumMetadataUrl(
			123,
			"foo",
			undefined,
			new Pagination(1, 2)
		),
		"https://data.solarnetwork.net/datum/meta/123?" +
			"sourceId=foo&max=1&offset=2"
	);
});

test("findNodeDatumMetadataUrl:sortedAndPaginated", (t) => {
	const helper = new NodeDatumMetadataUrlHelper();
	t.is(
		helper.findNodeDatumMetadataUrl(
			123,
			"foo",
			[new SortDescriptor("bar")],
			new Pagination(1, 2)
		),
		"https://data.solarnetwork.net/datum/meta/123?" +
			"sourceId=foo&sorts%5B0%5D.key=bar&max=1&offset=2"
	);
});

test("viewUserMetadataUrl:noUser", (t) => {
	const helper = new NodeDatumMetadataUrlHelper();
	const result = helper.viewUserMetadataUrl();
	t.is(result, "https://data.solarnetwork.net/users/meta");
});

test("viewUserMetadataUrl:helperUser", (t) => {
	const helper = new NodeDatumMetadataUrlHelper();
	helper.parameter(DatumFilterKeys.UserId, 123);
	const result = helper.viewUserMetadataUrl();
	t.is(result, "https://data.solarnetwork.net/users/meta/123");
});

test("viewUserMetadataUrl:helperUsers", (t) => {
	const helper = new NodeDatumMetadataUrlHelper();
	helper.parameter(DatumFilterKeys.UserIds, [123, 234]);
	const result = helper.viewUserMetadataUrl();
	t.is(result, "https://data.solarnetwork.net/users/meta/123");
});

test("viewUserMetadataUrl:argOverridesHelperUsers", (t) => {
	const helper = new NodeDatumMetadataUrlHelper();
	helper.parameter(DatumFilterKeys.UserId, 123);
	const result = helper.viewUserMetadataUrl(234);
	t.is(result, "https://data.solarnetwork.net/users/meta/234");
});

test("viewUserMetadataUrl:argUsers", (t) => {
	const helper = new NodeDatumMetadataUrlHelper();
	const result = helper.viewUserMetadataUrl([123, 234] as any);
	t.is(result, "https://data.solarnetwork.net/users/meta/123");
});

test("viewUserMetadataUrl:argUsers:empty", (t) => {
	const helper = new NodeDatumMetadataUrlHelper();
	const result = helper.viewUserMetadataUrl([] as any);
	t.is(result, "https://data.solarnetwork.net/users/meta");
});

test("viewUserMetadataUrl:argNull", (t) => {
	const helper = new NodeDatumMetadataUrlHelper();
	helper.parameter(DatumFilterKeys.UserId, 123);
	const result = helper.viewUserMetadataUrl();
	t.is(result, "https://data.solarnetwork.net/users/meta/123");
});
