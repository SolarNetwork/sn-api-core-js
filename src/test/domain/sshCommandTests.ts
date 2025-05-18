import test from "ava";

import {
	default as SshCommand,
	SolarSshCommandAttachSsh,
} from "../../main/domain/sshCommand.js";
import SshTerminalSettings from "../../main/domain/sshTerminalSettings.js";
import { Environment } from "../../main/net/index.js";

test("create", (t) => {
	const s = new SshCommand("a");
	t.truthy(s);
	t.is(s.command, "a");
	t.is(s.data, undefined);
});

test("create:withData", (t) => {
	const data = { b: "c" };
	const s = new SshCommand("a", data);
	t.truthy(s);
	t.is(s.command, "a");
	t.is(s.data, data);
});

test("create:attachSshCommand", (t) => {
	const s = SshCommand.attachSshCommand("a", 1, "b", "c");
	t.truthy(s, "Instance created.");
	t.is(s.command, SolarSshCommandAttachSsh);
	t.deepEqual(s.data, {
		authorization: "a",
		"authorization-date": 1,
		username: "b",
		password: "c",
	});
});

test("create:attachSshCommand:date", (t) => {
	const date = new Date();
	const s = SshCommand.attachSshCommand("a", date, "b", "c");
	t.truthy(s, "Instance created.");
	t.is(s.command, SolarSshCommandAttachSsh);
	t.deepEqual(s.data, {
		authorization: "a",
		"authorization-date": date.getTime(),
		username: "b",
		password: "c",
	});
});

test("create:attachSshCommand:terminalSettings", (t) => {
	const termSettings = new SshTerminalSettings(1, 2, 3, 4, "t", { e: 5 });
	const s = SshCommand.attachSshCommand("a", 1, "b", "c", termSettings);
	t.truthy(s, "Instance created.");
	t.is(s.command, SolarSshCommandAttachSsh);
	t.deepEqual(s.data, {
		authorization: "a",
		"authorization-date": 1,
		username: "b",
		password: "c",
		cols: 1,
		lines: 2,
		width: 3,
		height: 4,
		type: "t",
		environment: { e: 5 },
	});
});

test("toJsonObject", (t) => {
	const result = new SshCommand("a", {
		b: "c",
	}).toJsonObject();
	t.deepEqual(result, {
		cmd: "a",
		data: { b: "c" },
	});
});

test("toJsonObject:noData", (t) => {
	const result = new SshCommand("a").toJsonObject();
	t.deepEqual(result, {
		cmd: "a",
	});
});

test("toJsonObject:dataJsonEncodable", (t) => {
	const result = new SshCommand(
		"a",
		new SshTerminalSettings(1, 2, 3, 4, "t")
	).toJsonObject();
	t.deepEqual(result, {
		cmd: "a",
		data: {
			cols: 1,
			lines: 2,
			width: 3,
			height: 4,
			type: "t",
		},
	});
});

test("fromJsonObject", (t) => {
	const obj = {
		cmd: "a",
		data: { b: "c" },
	};

	const result = SshCommand.fromJsonObject(obj);

	t.deepEqual(
		result,
		new SshCommand("a", {
			b: "c",
		})
	);
});

test("fromJsonObject:undefinedValue", (t) => {
	const result = SshCommand.fromJsonObject(undefined);
	t.is(result, undefined);
});

test("fromJsonObject:dataDecoder", (t) => {
	const obj = {
		cmd: "a",
		data: {
			cols: 1,
			lines: 2,
			width: 3,
			height: 4,
			type: "t",
			environment: { e: 5 },
		},
	};

	const result = SshCommand.fromJsonObject(
		obj,
		SshTerminalSettings.fromJsonObject
	);

	t.deepEqual(
		result,
		new SshCommand("a", new SshTerminalSettings(1, 2, 3, 4, "t", { e: 5 }))
	);
});

test("toJsonEncoding", (t) => {
	const result = new SshCommand("a", {
		b: "c",
	}).toJsonEncoding();
	t.deepEqual(JSON.parse(result), {
		cmd: "a",
		data: { b: "c" },
	});
});

test("fromJsonEncoding", (t) => {
	const json = JSON.stringify({
		cmd: "a",
		data: { b: "c" },
	});

	const result = SshCommand.fromJsonEncoding(json);

	t.deepEqual(
		result,
		new SshCommand("a", {
			b: "c",
		})
	);
});

test("fromJsonEncoding:undefinedValue", (t) => {
	const result = SshCommand.fromJsonEncoding(undefined);
	t.is(result, undefined);
});
