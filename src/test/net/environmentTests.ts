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
