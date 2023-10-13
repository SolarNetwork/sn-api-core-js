import test from "ava";

import {
	default as QueryUrlHelper,
	SolarQueryPathKey,
	SolarQueryPublicPathKey,
} from "../../main/net/solarQueryUrlHelper.js";

test("create", (t) => {
	const helper = new QueryUrlHelper();
	t.truthy(helper);
});

test("baseUrl", (t) => {
	const helper = new QueryUrlHelper();
	t.is(
		helper.baseUrl(),
		"https://data.solarnetwork.net/solarquery/api/v1/sec"
	);
});

test("publicQuery", (t) => {
	const helper = new QueryUrlHelper();
	helper.publicQuery = true;
	t.is(
		helper.baseUrl(),
		"https://data.solarnetwork.net/solarquery/api/v1/pub"
	);
});

test("baseUrl:customEnvironment", (t) => {
	const env = {} as any;
	env[SolarQueryPathKey] = "/fooquery";
	env[SolarQueryPublicPathKey] = true;
	const helper = new QueryUrlHelper(env);
	t.is(helper.baseUrl(), "https://data.solarnetwork.net/fooquery/api/v1/pub");

	helper.env(SolarQueryPublicPathKey, false);
	t.is(helper.baseUrl(), "https://data.solarnetwork.net/fooquery/api/v1/sec");
});

test("listAllNodeIdsUrl", (t) => {
	const helper = new QueryUrlHelper();
	t.is(
		helper.listAllNodeIdsUrl(),
		"https://data.solarnetwork.net/solarquery/api/v1/sec/nodes"
	);
});
