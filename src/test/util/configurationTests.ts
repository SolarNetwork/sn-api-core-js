import test from "ava";

import Configuration from "../../main/util/configuration.js";
import PropMap from "../../main/util/propMap.js";

test("create", (t) => {
	const conf = new Configuration();
	t.truthy(conf);
});

interface Enviro {
	host: string;
	protocol: string;
}

type Env = Configuration & Enviro;

test("createWithConfig", (t) => {
	const data = { host: "example.com", protocol: "http" };
	const conf = new Configuration(data) as unknown as Env;
	t.truthy(conf);
	t.is(conf.value("protocol"), "http");
	t.is(conf.protocol, "http");
	t.is(conf.value("host"), "example.com");
	t.is(conf.host, "example.com");
	t.deepEqual(conf.values(), data);
});

test("setter", (t) => {
	const data = { host: "example.com", protocol: "http" };
	const conf = new Configuration(data) as unknown as Env;
	t.truthy(conf);
	conf.protocol = "https";
	t.is(conf.protocol, "https");
	t.deepEqual(conf.values(), { host: data.host, protocol: "https" });
});

interface Toggler {
	debug: boolean;
}

type Tog = Configuration & Toggler;

test("toggle", (t) => {
	const conf = new Configuration() as unknown as Tog;
	conf.toggle("debug");
	t.true(conf.debug);
	t.deepEqual(conf.values(), { debug: true });

	conf.toggle("debug");
	t.true(conf.debug === undefined);
	t.deepEqual(conf.values(), {});
});

test("toggle:undefined", (t) => {
	const conf = new Configuration();
	t.is(conf.toggle(undefined as any), conf);
});

test("enabled", (t) => {
	const conf = new Configuration({ some: "other", not: false, no: null });
	conf.toggle("debug");
	t.true(conf.enabled("debug"));
	t.false(conf.enabled("foo"));

	conf.toggle("debug");
	t.false(conf.enabled("debug"));

	t.true(conf.enabled("some"));
	t.false(conf.enabled("not"));
	t.false(conf.enabled("no"));
});

test("enabled:undefined", (t) => {
	const conf = new Configuration();
	t.is(conf.enabled(undefined as any), false);
});

test("values:get", (t) => {
	const conf = new Configuration({ some: "other", not: false, no: null });
	const result = conf.values();
	t.deepEqual(result, { some: "other", not: false });
});

test("values:set", (t) => {
	const conf = new Configuration();
	conf.values({ some: "other", not: false, no: null });
	const result = conf.values();
	t.deepEqual(result, { some: "other", not: false });
});

test("values:set:map", (t) => {
	const conf = new Configuration();
	conf.values(
		new Map(Object.entries({ some: "other", not: false, no: null }))
	);
	const result = conf.values();
	t.deepEqual(result, { some: "other", not: false });
});

test("values:set:PropMap", (t) => {
	const conf = new Configuration();
	const pmap = new PropMap({ some: "other", not: false, no: null });
	conf.values(pmap);
	const result = conf.values();
	t.deepEqual(result, { some: "other", not: false });
});
test("toJson", (t) => {
	const conf = new Configuration();
	conf.values({ some: "other", not: false, no: null });
	const json = JSON.stringify(conf);
	const result = JSON.parse(json);
	t.deepEqual(result, {
		some: "other",
		not: false,
	});
});
