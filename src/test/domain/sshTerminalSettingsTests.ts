import test from "ava";

import SshTerminalSettings from "../../main/domain/sshTerminalSettings.js";

test("create", (t) => {
	const s = new SshTerminalSettings();
	t.truthy(s);
	t.deepEqual(
		s,
		new SshTerminalSettings(80, 24, 640, 480, "xterm", new Map()),
		"Default property values configured."
	);
});

test("toJsonObject", (t) => {
	const result = new SshTerminalSettings(1, 2, 3, 4, "a", {
		b: "c",
	}).toJsonObject();
	t.deepEqual(result, {
		cols: 1,
		lines: 2,
		width: 3,
		height: 4,
		type: "a",
		environment: { b: "c" },
	});
});

test("toJsonObject:emptyEnvironment", (t) => {
	const result = new SshTerminalSettings(1, 2, 3, 4, "a", {}).toJsonObject();
	t.deepEqual(result, {
		cols: 1,
		lines: 2,
		width: 3,
		height: 4,
		type: "a",
	});
});

test("fromJsonObject", (t) => {
	const obj = {
		cols: 1,
		lines: 2,
		width: 3,
		height: 4,
		type: "a",
		environment: { b: "c" },
	};

	const result = SshTerminalSettings.fromJsonObject(obj);

	t.deepEqual(
		result,
		new SshTerminalSettings(1, 2, 3, 4, "a", {
			b: "c",
		})
	);
});

test("fromJsonObject:undefinedValue", (t) => {
	const result = SshTerminalSettings.fromJsonObject(undefined);
	t.is(result, undefined);
});

test("toJsonEncoding", (t) => {
	const result = new SshTerminalSettings(1, 2, 3, 4, "a", {
		b: "c",
	}).toJsonEncoding();
	t.deepEqual(JSON.parse(result), {
		cols: 1,
		lines: 2,
		width: 3,
		height: 4,
		type: "a",
		environment: { b: "c" },
	});
});

test("fromJsonEncoding", (t) => {
	const json = JSON.stringify({
		cols: 1,
		lines: 2,
		width: 3,
		height: 4,
		type: "a",
		environment: { b: "c" },
	});

	const result = SshTerminalSettings.fromJsonEncoding(json);

	t.deepEqual(
		result,
		new SshTerminalSettings(1, 2, 3, 4, "a", {
			b: "c",
		})
	);
});

test("fromJsonEncoding:undefinedValue", (t) => {
	const result = SshTerminalSettings.fromJsonEncoding(undefined);
	t.is(result, undefined);
});
