import test from "ava";

import Configuration from "util/configuration";

test("util:configuration:create", t => {
  const conf = new Configuration();
  t.truthy(conf);
});

test("util:configuration:createWithConfig", t => {
  const data = { host: "example.com", protocol: "http" };
  const conf = new Configuration(data);
  t.truthy(conf);
  t.is(conf.value("protocol"), "http");
  t.is(conf.protocol, "http");
  t.is(conf.value("host"), "example.com");
  t.is(conf.host, "example.com");
  t.deepEqual(conf.map, data);
});

test("util:configuration:toggle", t => {
  const conf = new Configuration();
  conf.toggle("debug");
  t.true(conf.debug);
  t.deepEqual(conf.map, { debug: true });

  conf.toggle("debug");
  t.true(conf.debug === undefined);
  t.deepEqual(conf.map, {});
});

test("util:configuration:enabled", t => {
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

test("util:configuration:values:get", t => {
  const conf = new Configuration({ some: "other", not: false, no: null });
  const result = conf.values();
  t.deepEqual(result, { some: "other", not: false });
});

test("util:configuration:values:set", t => {
  const conf = new Configuration();
  conf.values({ some: "other", not: false, no: null });
  const result = conf.values();
  t.deepEqual(result, { some: "other", not: false });
});

test("util:configuration:toJson", t => {
  const conf = new Configuration();
  conf.values({ some: "other", not: false, no: null });
  const json = JSON.stringify(conf);
  const result = JSON.parse(json);
  t.deepEqual(result, {
    map: { some: "other", not: false },
    some: "other",
    not: false
  });
});
