import test from "ava";

import { default as log, LogLevel } from "../../main/util/logger.js";

test("logger:level", (t) => {
	t.is(log.level, LogLevel.WARN, "default level");
	log.level = LogLevel.OFF;
	t.is(log.level, LogLevel.OFF);
});

test("logger:level:nonDigit", (t) => {
	(log as any).level = "a";
	t.is(log.level, LogLevel.OFF);
});

test("logger:debug", (t) => {
	log.level = LogLevel.DEBUG;
	log.debug("Hi there, debug!");
	t.pass();
});

test("logger:debug:off", (t) => {
	log.level = LogLevel.INFO;
	log.debug("Hi there, debug!");
	t.pass();
});

test("logger:info", (t) => {
	log.level = LogLevel.INFO;
	log.info("Hi there, info!");
	t.pass();
});

test("logger:warn", (t) => {
	log.level = LogLevel.WARN;
	log.warn("Hi there, warn!");
	t.pass();
});

test("logger:error", (t) => {
	log.level = LogLevel.ERROR;
	log.error("Hi there, error!");
	t.pass();
});
