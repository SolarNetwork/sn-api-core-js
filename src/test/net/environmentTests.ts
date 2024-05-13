import test from "ava";

import Environment from "../../main/net/environment.js";

test("create", (t) => {
	const env = new Environment();
	t.truthy(env);
	t.is(env.protocol, "https");
	t.is(env.host, "data.solarnetwork.net");
	t.is(env.port, 443);
});

test("createWithConfig", (t) => {
	const env = new Environment({ host: "example.com", protocol: "http" });
	t.truthy(env);
	t.is(env.protocol, "http");
	t.is(env.host, "example.com");
	t.is(env.port, 80);
});

test("createWithConfig:locationWithPort", (t) => {
	const env = new Environment({
		host: "example.com:9000",
		hostname: "example.com",
		port: 9000,
		protocol: "http:",
	});
	t.truthy(env);
	t.is(env.protocol, "http");
	t.is(env.host, "example.com");
	t.is(env.port, 9000);
});

test("createWithConfig:location:tls", (t) => {
	const env = new Environment({ host: "example.com", protocol: "https:" });
	t.truthy(env);
	t.is(env.protocol, "https");
	t.is(env.host, "example.com");
	t.is(env.port, 443);
});

test("useTls", (t) => {
	const env = new Environment();
	t.true(env.useTls());
	env.protocol = "http";
	t.false(env.useTls());
});

test("createWithConfig:proxyUrlPrefix", (t) => {
	const prefix = "https://query.solarnetwork.net/1";
	const env = new Environment({
		proxyUrlPrefix: prefix,
	});
	t.truthy(env);
	t.is(env.protocol, "https");
	t.is(env.host, "data.solarnetwork.net");
	t.is(env.port, 443);
	t.is(env.proxyUrlPrefix, prefix);
});

test("createWithURL:http", (t) => {
	const env = new Environment(new URL("http://example.com:1234/some/place"));
	t.truthy(env);
	t.is(env.protocol, "http");
	t.is(env.host, "example.com");
	t.is(env.port, 1234);
	t.false(env.useTls());
});

test("createWithURL:https:defaultPort", (t) => {
	const env = new Environment(new URL("https://example.com"));
	t.truthy(env);
	t.is(env.protocol, "https");
	t.is(env.host, "example.com");
	t.is(env.port, 443);
	t.true(env.useTls());
});

test("createWithURL:https:explicitPort", (t) => {
	const env = new Environment(new URL("https://example.com:4444"));
	t.truthy(env);
	t.is(env.protocol, "https");
	t.is(env.host, "example.com");
	t.is(env.port, 4444);
	t.true(env.useTls());
});
