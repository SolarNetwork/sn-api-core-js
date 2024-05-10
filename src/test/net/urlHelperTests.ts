import test from "ava";

import Environment from "../../main/net/environment.js";
import { DatumFilterKeys } from "../../main/domain/datumFilter.js";
import UrlHelper from "../../main/net/urlHelper.js";

test("static:resolveTemplateUrl", (t) => {
	const result = UrlHelper.resolveTemplateUrl("/some/{mode}/path?foo={foo}", {
		mode: "crazy",
		foo: "bar",
	});
	t.is(result, "/some/crazy/path?foo=bar");
});

test("static:resolveTemplateUrl:uirEncoded", (t) => {
	const result = UrlHelper.resolveTemplateUrl("/some/{mode}/path?foo={foo}", {
		mode: "crazy/cool",
		foo: "bar&grille",
	});
	t.is(result, "/some/crazy%2Fcool/path?foo=bar%26grille");
});

test("create", (t) => {
	const helper = new UrlHelper();
	t.truthy(helper);
	t.truthy(helper.parameters);
});

test("create:environment", (t) => {
	const env = new Environment();
	const helper = new UrlHelper(env);
	t.is(helper.environment, env);
});

test("create:environmentObject", (t) => {
	const helper = new UrlHelper({ foo: "bar" } as any);
	const env = helper.environment;
	t.is(env.value("foo"), "bar");
});

test("hostUrl", (t) => {
	const helper = new UrlHelper();
	t.is(helper.hostUrl(), "https://data.solarnetwork.net");
});

test("hostUrl:http", (t) => {
	const env = new Environment({
		protocol: "http",
	});
	const helper = new UrlHelper(env);
	t.is(helper.hostUrl(), "http://data.solarnetwork.net");
});

test("hostUrl:customHost", (t) => {
	const env = new Environment({
		host: "foo.example.com:8443",
	});
	const helper = new UrlHelper(env);
	t.is(helper.hostUrl(), "https://foo.example.com:8443");
});

test("hostUrl:customPort", (t) => {
	const env = new Environment({
		port: 8443,
	});
	const helper = new UrlHelper(env);
	t.is(helper.hostUrl(), "https://data.solarnetwork.net:8443");
});

test("hostUrl:removedPort", (t) => {
	const env = new Environment();
	env.port = undefined;
	const helper = new UrlHelper(env);
	t.is(helper.hostUrl(), "https://data.solarnetwork.net");
});

test("hostUrl:proxy:ignored", (t) => {
	const env = new Environment({
		proxyHost: "proxy.example.com",
		proxyPort: 8443,
	});
	const helper = new UrlHelper(env);
	t.is(
		helper.hostUrl(),
		"https://data.solarnetwork.net",
		"The old proxyHost/proxyPort undocumented properties are ignored."
	);
});

test("hostWebSocketUrl", (t) => {
	const helper = new UrlHelper();
	t.is(helper.hostWebSocketUrl(), "wss://data.solarnetwork.net");
});

test("hostWebSocketUrl:ws", (t) => {
	const env = new Environment({
		protocol: "http",
	});
	const helper = new UrlHelper(env);
	t.is(helper.hostWebSocketUrl(), "ws://data.solarnetwork.net");
});

test("hostWebSocketUrl:customHost", (t) => {
	const env = new Environment({
		host: "foo.example.com:8443",
	});
	const helper = new UrlHelper(env);
	t.is(helper.hostWebSocketUrl(), "wss://foo.example.com:8443");
});

test("hostWebSocketUrl:customPort", (t) => {
	const env = new Environment({
		port: 8443,
	});
	const helper = new UrlHelper(env);
	t.is(helper.hostWebSocketUrl(), "wss://data.solarnetwork.net:8443");
});

test("hostWebSocketUrl:removedPort", (t) => {
	const env = new Environment();
	env.port = undefined;
	const helper = new UrlHelper(env);
	t.is(helper.hostWebSocketUrl(), "wss://data.solarnetwork.net");
});

test("hostWebSocketUrl:proxy:ignored", (t) => {
	const env = new Environment({
		proxyHost: "proxy.example.com",
		proxyPort: 8443,
	});
	const helper = new UrlHelper(env);
	t.is(
		helper.hostWebSocketUrl(),
		"wss://data.solarnetwork.net",
		"The old proxyHost/proxyPort undocumented properties are ignored."
	);
});

test("baseUrl", (t) => {
	const helper = new UrlHelper();
	t.is(helper.baseUrl(), "https://data.solarnetwork.net");
});

test("resolveTemplateUrl", (t) => {
	const helper = new UrlHelper();
	helper.parameters.values({ mode: "crazy", foo: "bar" });
	const result = helper.resolveTemplateUrl("/some/{mode}/path?foo={foo}");
	t.is(result, "/some/crazy/path?foo=bar");
});

test("resolveTemplateUrl:missingValue", (t) => {
	const helper = new UrlHelper();
	helper.parameters.values({ foo: "bar" });
	const result = helper.resolveTemplateUrl("/some/path?foo={foo}&bar={bar}");
	t.is(
		result,
		"/some/path?foo=bar&bar=",
		"missing param results in empty string"
	);
});

test("resolveTemplateUrl:pathReduction", (t) => {
	const helper = new UrlHelper();
	helper.parameters.values({ foo: "bar" });
	const result = helper.resolveTemplateUrl("/some/{mode}/path?foo={foo}");
	t.is(result, "/some/path?foo=bar", "double slash reduced to single slash");
});

test("resolveTemplatePath", (t) => {
	const helper = new UrlHelper();
	helper.parameters.values({ mode: "crazy", foo: "bar" });
	const result = helper.resolveTemplatePath("/some/{mode}/path?foo={foo}");
	t.is(result, "https://data.solarnetwork.net/some/crazy/path?foo=bar");
});

test("env", (t) => {
	const helper = new UrlHelper();
	t.is(helper.env("host"), "data.solarnetwork.net");
	t.is(helper.env("fooPath", "/foo"), helper.environment);
	t.is(helper.env("fooPath"), "/foo");
	t.is(helper.environment.value("fooPath"), "/foo");
});

test("parameter", (t) => {
	const helper = new UrlHelper();
	t.is(helper.parameter("foo", "bar"), helper.parameters);
	t.is(helper.parameter("foo"), "bar");
	t.is(helper.parameters.value("foo"), "bar");
});

test("param", (t) => {
	const helper = new UrlHelper();
	helper.parameter("foo", "bar");
	helper.parameter("bars", [1, 2, 3]);

	t.is(helper.param("foo"), "bar");
	t.deepEqual(helper.param("bars"), [1, 2, 3]);
	t.is(helper.param("bar"), 1, "first element of 'bars' parameter returned");
	t.is(helper.param("blah"), undefined);
});

test("param:plurals", (t) => {
	const helper = new UrlHelper();
	helper.parameter(DatumFilterKeys.NodeId, 1);
	helper.parameter(DatumFilterKeys.SourceIds, ["a", "b"]);
	helper.parameter("foo", [1, 2]);

	t.deepEqual(
		helper.param(DatumFilterKeys.NodeIds),
		[1],
		"plural form of parameter returned as array"
	);
	t.deepEqual(
		helper.param(DatumFilterKeys.SourceIds),
		["a", "b"],
		"plural form of parameter returned directly"
	);
	t.deepEqual(
		helper.param("foos"),
		[1, 2],
		"singular param that is already an array is returned as such"
	);
});

test("datumFilter", (t) => {
	const helper = new UrlHelper();
	helper.parameter(DatumFilterKeys.NodeIds, [1, 2, 3]);
	helper.parameter(DatumFilterKeys.SourceIds, ["a", "b", "c"]);

	t.like(helper.datumFilter(), {
		nodeIds: [1, 2, 3],
		sourceIds: ["a", "b", "c"],
	});
});

test("datumFilter:singulars", (t) => {
	const helper = new UrlHelper();
	helper.parameter(DatumFilterKeys.NodeId, 1);
	helper.parameter(DatumFilterKeys.SourceId, "a");

	t.like(helper.datumFilter(), {
		nodeIds: [1],
		sourceIds: ["a"],
	});
});

test("proxyUrlPrefix:basic", (t) => {
	const prefix = "https://query.solarnetwork.net";
	const env = new Environment({
		proxyUrlPrefix: prefix,
	});
	const helper = new UrlHelper(env);
	t.is(helper.hostUrl(), "https://data.solarnetwork.net");
	t.is(helper.hostRequestUrl(), prefix);
});

test("proxyUrlPrefix:nonStandardPort", (t) => {
	const prefix = "https://query.solarnetwork.net:8765";
	const env = new Environment({
		proxyUrlPrefix: prefix,
	});
	const helper = new UrlHelper(env);
	t.is(helper.hostUrl(), "https://data.solarnetwork.net");
	t.is(helper.hostRequestUrl(), prefix);
});

test("proxyUrlPrefix:withContextPath", (t) => {
	const prefix = "https://query.solarnetwork.net/1m";
	const env = new Environment({
		proxyUrlPrefix: prefix,
	});
	const helper = new UrlHelper(env);
	t.is(helper.hostUrl(), "https://data.solarnetwork.net");
	t.is(helper.hostRequestUrl(), prefix);
});

test("toRequestUrl:normal", (t) => {
	const url = "https://some.host/some/path";
	const helper = new UrlHelper();
	t.is(
		helper.toRequestUrl(url),
		url,
		"URL unchanged without proxy configured."
	);
});

test("toRequestUrl:proxy", (t) => {
	const prefix = "https://foo.example.com:9876";
	const env = new Environment({
		proxyUrlPrefix: prefix,
	});
	const url = "https://some.host/some/path";
	const helper = new UrlHelper(env);
	t.is(
		helper.toRequestUrl(url),
		prefix + "/some/path",
		"Proxy prefix replaces host."
	);
});

test("toRequestUrl:proxy:withContextPath", (t) => {
	const prefix = "https://query.solarnetwork.net/1m";
	const env = new Environment({
		proxyUrlPrefix: prefix,
	});
	const url = "https://some.host/some/path";
	const helper = new UrlHelper(env);
	t.is(
		helper.toRequestUrl(url),
		prefix + "/some/path",
		"Proxy prefix replaces host."
	);
});
