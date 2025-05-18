import test from "ava";

import Environment from "../../main/net/environment.js";
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

test("toRequestUrl:basic", (t) => {
	const helper = new QueryUrlHelper();
	t.is(
		helper.toRequestUrl(helper.baseUrl()),
		"https://data.solarnetwork.net/solarquery/api/v1/sec"
	);
});

test("toRequestUrl:proxy:basic", (t) => {
	const prefix = "https://query.solarnetwork.net";
	const env = new Environment({
		proxyUrlPrefix: prefix,
	});
	const helper = new QueryUrlHelper(env);
	t.is(
		helper.toRequestUrl(helper.baseUrl()),
		prefix + "/solarquery/api/v1/sec"
	);
});

test("toRequestUrl:proxy:withContextPath", (t) => {
	const prefix = "https://query.solarnetwork.net/1m";
	const env = new Environment({
		proxyUrlPrefix: prefix,
	});
	const helper = new QueryUrlHelper(env);
	t.is(
		helper.toRequestUrl(helper.baseUrl()),
		prefix + "/solarquery/api/v1/sec"
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

test("listAllNodeIdsUrl:toRequestUrl", (t) => {
	const helper = new QueryUrlHelper();
	t.is(
		helper.toRequestUrl(helper.listAllNodeIdsUrl()),
		"https://data.solarnetwork.net/solarquery/api/v1/sec/nodes"
	);
});

test("listAllNodeIdsUrl:toRequestUrl:proxy", (t) => {
	const proxy = "https://foo.example/foo/bar";
	const env = new Environment({
		proxyUrlPrefix: proxy,
	});
	const helper = new QueryUrlHelper(env);
	t.is(
		helper.toRequestUrl(helper.listAllNodeIdsUrl()),
		proxy + "/solarquery/api/v1/sec/nodes"
	);
});

test("viewNodeMetadataUrl", (t) => {
	const helper = new QueryUrlHelper();
	t.is(
		helper.viewNodeMetadataUrl(123),
		"https://data.solarnetwork.net/solarquery/api/v1/sec/nodes/meta/123"
	);
});
