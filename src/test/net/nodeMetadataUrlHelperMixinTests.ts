import test from "ava";

import UrlHelper from "../../main/net/urlHelper.js";
import { DatumFilterKeys } from "../../main/domain/datumFilter.js";
import NodeMetadataUrlHelperMixin from "../../main/net/nodeMetadataUrlHelperMixin.js";
import Pagination from "../../main/domain/pagination.js";
import SortDescriptor from "../../main/domain/sortDescriptor.js";

class TestNodeMetadataUrlHelper extends NodeMetadataUrlHelperMixin(UrlHelper) {}

test("create", (t) => {
	const helper = new TestNodeMetadataUrlHelper();
	t.truthy(helper);
});

test("viewNodeMetadataUrl", (t) => {
	const helper = new TestNodeMetadataUrlHelper();
	t.is(
		helper.viewNodeMetadataUrl(123),
		"https://data.solarnetwork.net/nodes/meta/123"
	);
});

test("viewNodeMetadataUrl:parameters", (t) => {
	const helper = new TestNodeMetadataUrlHelper();
	helper.parameter(DatumFilterKeys.NodeId, 123);
	t.is(
		helper.viewNodeMetadataUrl(),
		"https://data.solarnetwork.net/nodes/meta/123"
	);
});

test("viewNodeMetadataUrl:parameters:override", (t) => {
	const helper = new TestNodeMetadataUrlHelper();
	helper.parameter(DatumFilterKeys.NodeId, 123);
	t.is(
		helper.viewNodeMetadataUrl(234),
		"https://data.solarnetwork.net/nodes/meta/234"
	);
});

test("viewNodeMetadataUrl:missingNodeId", (t) => {
	const helper = new TestNodeMetadataUrlHelper();
	const result = t.throws(() => {
		helper.viewNodeMetadataUrl();
	});
	t.true(/.*node ID.*/.test(result.message));
});

test("addNodeMetadataUrl", (t) => {
	const helper = new TestNodeMetadataUrlHelper();
	t.is(
		helper.addNodeMetadataUrl(123),
		"https://data.solarnetwork.net/nodes/meta/123"
	);
});

test("addNodeMetadataUrl:parameters", (t) => {
	const helper = new TestNodeMetadataUrlHelper();
	helper.parameter(DatumFilterKeys.NodeId, 123);
	t.is(
		helper.addNodeMetadataUrl(),
		"https://data.solarnetwork.net/nodes/meta/123"
	);
});

test("addNodeMetadataUrl:parameters:override", (t) => {
	const helper = new TestNodeMetadataUrlHelper();
	helper.parameter(DatumFilterKeys.NodeId, 123);
	t.is(
		helper.addNodeMetadataUrl(234),
		"https://data.solarnetwork.net/nodes/meta/234"
	);
});

test("replaceNodeMetadataUrl", (t) => {
	const helper = new TestNodeMetadataUrlHelper();
	t.is(
		helper.replaceNodeMetadataUrl(123),
		"https://data.solarnetwork.net/nodes/meta/123"
	);
});

test("replaceNodeMetadataUrl:parameters", (t) => {
	const helper = new TestNodeMetadataUrlHelper();
	helper.parameter(DatumFilterKeys.NodeId, 123);
	t.is(
		helper.replaceNodeMetadataUrl(),
		"https://data.solarnetwork.net/nodes/meta/123"
	);
});

test("replaceNodeMetadataUrl:parameters:override", (t) => {
	const helper = new TestNodeMetadataUrlHelper();
	helper.parameter(DatumFilterKeys.NodeId, 123);
	t.is(
		helper.replaceNodeMetadataUrl(234),
		"https://data.solarnetwork.net/nodes/meta/234"
	);
});

test("deleteNodeMetadataUrl", (t) => {
	const helper = new TestNodeMetadataUrlHelper();
	t.is(
		helper.deleteNodeMetadataUrl(123),
		"https://data.solarnetwork.net/nodes/meta/123"
	);
});

test("deleteNodeMetadataUrl:parameters", (t) => {
	const helper = new TestNodeMetadataUrlHelper();
	helper.parameter(DatumFilterKeys.NodeId, 123);
	t.is(
		helper.deleteNodeMetadataUrl(),
		"https://data.solarnetwork.net/nodes/meta/123"
	);
});

test("deleteNodeMetadataUrl:parameters:override", (t) => {
	const helper = new TestNodeMetadataUrlHelper();
	helper.parameter(DatumFilterKeys.NodeId, 123);
	t.is(
		helper.deleteNodeMetadataUrl(234),
		"https://data.solarnetwork.net/nodes/meta/234"
	);
});

test("findNodeMetadataUrl", (t) => {
	const helper = new TestNodeMetadataUrlHelper();
	t.is(
		helper.findNodeMetadataUrl(),
		"https://data.solarnetwork.net/nodes/meta"
	);
});

test("findNodeMetadataUrl:node", (t) => {
	const helper = new TestNodeMetadataUrlHelper();
	t.is(
		helper.findNodeMetadataUrl(123),
		"https://data.solarnetwork.net/nodes/meta?nodeIds=123"
	);
});

test("findNodeMetadataUrl:nodes", (t) => {
	const helper = new TestNodeMetadataUrlHelper();
	t.is(
		helper.findNodeMetadataUrl([123, 234]),
		"https://data.solarnetwork.net/nodes/meta?nodeIds=123,234"
	);
});

test("findNodeMetadataUrl:parameters", (t) => {
	const helper = new TestNodeMetadataUrlHelper();
	helper.parameter(DatumFilterKeys.NodeId, 123);
	t.is(
		helper.findNodeMetadataUrl(),
		"https://data.solarnetwork.net/nodes/meta?nodeIds=123"
	);
});

test("findNodeMetadataUrl:parameters:override", (t) => {
	const helper = new TestNodeMetadataUrlHelper();
	helper.parameter(DatumFilterKeys.NodeId, 123);
	t.is(
		helper.findNodeMetadataUrl(234),
		"https://data.solarnetwork.net/nodes/meta?nodeIds=234"
	);
});

test("findNodeMetadataUrl:parameters:override:null", (t) => {
	const helper = new TestNodeMetadataUrlHelper();
	helper.parameter(DatumFilterKeys.NodeId, 123);
	t.is(
		helper.findNodeMetadataUrl(null),
		"https://data.solarnetwork.net/nodes/meta"
	);
});

test("findNodeMetadataUrl:nodes:sorts", (t) => {
	const helper = new TestNodeMetadataUrlHelper();
	t.is(
		helper.findNodeMetadataUrl(
			[123, 234],
			[new SortDescriptor("node", true)]
		),
		"https://data.solarnetwork.net/nodes/meta?nodeIds=123,234&sorts%5B0%5D.key=node&sorts%5B0%5D.descending=true"
	);
});

test("findNodeMetadataUrl:nodes:pagination", (t) => {
	const helper = new TestNodeMetadataUrlHelper();
	t.is(
		helper.findNodeMetadataUrl([123, 234], undefined, new Pagination(1, 2)),
		"https://data.solarnetwork.net/nodes/meta?nodeIds=123,234&max=1&offset=2"
	);
});

test("findNodeMetadataUrl:nodes:sorts:pagination", (t) => {
	const helper = new TestNodeMetadataUrlHelper();
	t.is(
		helper.findNodeMetadataUrl(
			[123, 234],
			[new SortDescriptor("node")],
			new Pagination(1, 2)
		),
		"https://data.solarnetwork.net/nodes/meta?nodeIds=123,234&sorts%5B0%5D.key=node&max=1&offset=2"
	);
});
