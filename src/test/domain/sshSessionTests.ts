import test from "ava";

import SshSession from "../../main/domain/sshSession.js";

test("create", (t) => {
	const date = new Date();
	const s = new SshSession(date, "a", 2, "b", 3, 4, 5, 6);
	t.truthy(s);
	t.deepEqual(s.created, date);
	t.is(s.sessionId, "a");
	t.is(s.nodeId, 2);
	t.is(s.sshHost, "b");
	t.is(s.sshPort, 3);
	t.is(s.reverseSshPort, 4);
	t.is(s.startInstructionId, 5);
	t.is(s.stopInstructionId, 6);
});

test("create:createdNumber", (t) => {
	const s = new SshSession(1, "a", 2, "b", 3, 4, 5, 6);
	t.truthy(s);
	t.deepEqual(s.created, new Date(1));
	t.is(s.sessionId, "a");
	t.is(s.nodeId, 2);
	t.is(s.sshHost, "b");
	t.is(s.sshPort, 3);
	t.is(s.reverseSshPort, 4);
	t.is(s.startInstructionId, 5);
	t.is(s.stopInstructionId, 6);
});

test("create:createdString", (t) => {
	const dateStr = "2025-01-01T12:34:56.789Z";
	const s = new SshSession(dateStr, "a", 2, "b", 3, 4, 5, 6);
	t.truthy(s);
	t.deepEqual(s.created, new Date(dateStr));
	t.is(s.sessionId, "a");
	t.is(s.nodeId, 2);
	t.is(s.sshHost, "b");
	t.is(s.sshPort, 3);
	t.is(s.reverseSshPort, 4);
	t.is(s.startInstructionId, 5);
	t.is(s.stopInstructionId, 6);
});

test("toJsonObject", (t) => {
	const result = new SshSession(1, "a", 2, "b", 3, 4, 5, 6).toJsonObject();
	t.deepEqual(result, {
		created: new Date(1).getTime(),
		sessionId: "a",
		nodeId: 2,
		host: "b",
		port: 3,
		reversePort: 4,
		startInstructionId: 5,
		stopInstructionId: 6,
	});
});

test("toJsonObject:noInstructionIds", (t) => {
	const result = new SshSession(1, "a", 2, "b", 3, 4).toJsonObject();
	t.deepEqual(result, {
		created: new Date(1).getTime(),
		sessionId: "a",
		nodeId: 2,
		host: "b",
		port: 3,
		reversePort: 4,
	});
});

test("fromJsonObject", (t) => {
	const obj = {
		created: 1,
		sessionId: "a",
		nodeId: 2,
		host: "b",
		port: 3,
		reversePort: 4,
		startInstructionId: 5,
		stopInstructionId: 6,
	};

	const result = SshSession.fromJsonObject(obj);

	t.deepEqual(result, new SshSession(1, "a", 2, "b", 3, 4, 5, 6));
});

test("fromJsonObject:undefinedValue", (t) => {
	const result = SshSession.fromJsonObject(undefined);
	t.is(result, undefined);
});

test("toJsonEncoding", (t) => {
	const result = new SshSession(1, "a", 2, "b", 3, 4, 5, 6).toJsonEncoding();
	t.deepEqual(JSON.parse(result), {
		created: new Date(1).getTime(),
		sessionId: "a",
		nodeId: 2,
		host: "b",
		port: 3,
		reversePort: 4,
		startInstructionId: 5,
		stopInstructionId: 6,
	});
});

test("fromJsonEncoding", (t) => {
	const json = JSON.stringify({
		created: new Date(1).getTime(),
		sessionId: "a",
		nodeId: 2,
		host: "b",
		port: 3,
		reversePort: 4,
		startInstructionId: 5,
		stopInstructionId: 6,
	});

	const result = SshSession.fromJsonEncoding(json);

	t.deepEqual(result, new SshSession(1, "a", 2, "b", 3, 4, 5, 6));
});

test("fromJsonEncoding:undefinedValue", (t) => {
	const result = SshSession.fromJsonEncoding(undefined);
	t.is(result, undefined);
});
