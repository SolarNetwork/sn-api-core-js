import test from "ava";

import UrlHelper from "../../main/net/urlHelper.js";
import UserNodesUrlHelperMixin from "../../main/net/userNodesUrlHelperMixin.js";
import { DatumFilterKeys } from "../../main/domain/datumFilter.js";

class UserUrlHelper extends UserNodesUrlHelperMixin(UrlHelper) {}

test("create", (t) => {
	const helper = new UserUrlHelper();
	t.truthy(helper);
});

test("viewNodesUrl", (t) => {
	const helper = new UserUrlHelper();
	t.is(helper.viewNodesUrl(), "https://data.solarnetwork.net/nodes");
});

test("viewPendingNodesUrl", (t) => {
	const helper = new UserUrlHelper();
	t.is(
		helper.viewPendingNodesUrl(),
		"https://data.solarnetwork.net/nodes/pending"
	);
});

test("viewArchivedNodesUrl", (t) => {
	const helper = new UserUrlHelper();
	t.is(
		helper.viewArchivedNodesUrl(),
		"https://data.solarnetwork.net/nodes/archived"
	);
});

test("updateNodeArchivedStatusUrl", (t) => {
	const helper = new UserUrlHelper();
	helper.parameter(DatumFilterKeys.NodeId, 123);
	t.is(
		helper.updateNodeArchivedStatusUrl(false),
		"https://data.solarnetwork.net/nodes/archived?" +
			"nodeIds=123&archived=false"
	);
	t.is(
		helper.updateNodeArchivedStatusUrl(false, 234),
		"https://data.solarnetwork.net/nodes/archived?" +
			"nodeIds=234&archived=false"
	);
	t.is(
		helper.updateNodeArchivedStatusUrl(false, [234, 456]),
		"https://data.solarnetwork.net/nodes/archived?" +
			"nodeIds=234,456&archived=false"
	);
	t.is(
		helper.updateNodeArchivedStatusUrl(true, 234),
		"https://data.solarnetwork.net/nodes/archived?" +
			"nodeIds=234&archived=true"
	);
});

test("updateNodeArchivedStatusUrl:noNodes", (t) => {
	const helper = new UserUrlHelper();
	t.is(
		helper.updateNodeArchivedStatusUrl(true),
		"https://data.solarnetwork.net/nodes/archived?" +
			"nodeIds=&archived=true"
	);
});
