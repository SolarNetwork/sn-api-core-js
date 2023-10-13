import test from "ava";

import UrlHelper from "../../main/net/urlHelper.js";
import {
	default as DatumFilter,
	DatumFilterKeys,
} from "../../main/domain/datumFilter.js";
import NodesUrlHelperMixin from "../../main/net/nodesUrlHelperMixin.js";

class TestNodesUrlHelper extends NodesUrlHelperMixin(UrlHelper) {}

test("create", (t) => {
	const helper = new TestNodesUrlHelper();
	t.truthy(helper);
});

test("listAllNodeIdsUrl", (t) => {
	const helper = new TestNodesUrlHelper();
	t.is(helper.listAllNodeIdsUrl(), "https://data.solarnetwork.net/nodes");
});

test("findSourcesUrl", (t) => {
	const helper = new TestNodesUrlHelper();
	const filter = new DatumFilter();
	filter.nodeId = 123;
	t.is(
		helper.findSourcesUrl(filter),
		"https://data.solarnetwork.net/nodes/sources?nodeId=123"
	);
});

test("findSourcesUrl:parameters", (t) => {
	const helper = new TestNodesUrlHelper();
	helper.parameter(DatumFilterKeys.NodeId, 123);
	t.is(
		helper.findSourcesUrl(),
		"https://data.solarnetwork.net/nodes/sources?nodeId=123"
	);
});

test("findSourcesUrl:parameters:override", (t) => {
	const helper = new TestNodesUrlHelper();
	helper.parameter(DatumFilterKeys.NodeId, 123);
	const filter = new DatumFilter();
	filter.nodeId = 234;
	filter.localStartDate = new Date("2024-01-02T00:00");
	t.is(
		helper.findSourcesUrl(filter),
		"https://data.solarnetwork.net/nodes/sources?nodeId=234&localStartDate=2024-01-02"
	);
});
