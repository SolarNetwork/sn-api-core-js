import test from "ava";

import SolarSshApi from "../../main/net/solarSshUrlHelper.js";
import SolarUserApi from "../../main/net/solarUserUrlHelper.js";
import { SolarSshPathKey } from "../../main/net/solarSshUrlHelperMixin.js";

import { DatumFilterKeys } from "../../main/domain/datumFilter.js";
import { default as Environment } from "../../main/net/environment.js";
import {
	default as HttpHeaders,
	HttpContentType,
	HttpMethod,
} from "../../main/net/httpHeaders.js";
import MultiMap from "../../main/util/multiMap.js";
import SshSession from "../../main/domain/sshSession.js";

const NO_NODE_ID_ERR_MSG = /.*node ID.*/;
const NO_SESSION_ERR_MSG = /.*SSH session.*/;
const NO_INSTRUCTION_ID_ERR_MSG = /.*instruction ID.*/;

test("create", (t) => {
	const helper = new SolarSshApi();
	t.truthy(helper);
});

test("baseUrl", (t) => {
	const helper = new SolarSshApi();
	t.is(helper.baseUrl(), "https://ssh.solarnetwork.net:8443/api/v1");
});

test("baseUrl:customEnvironment", (t) => {
	const env = new Environment();
	env.host = "ssh.test";
	env.port = 1234;
	env.value(SolarSshPathKey, "/foo");
	const helper = new SolarSshApi(env);
	t.is(helper.baseUrl(), "https://ssh.test:1234/foo/api/v1");
});

test("baseUrl:customEnvironment:object", (t) => {
	const env = {} as any;
	env.host = "ssh.test";
	env.port = 1234;
	env[SolarSshPathKey] = "/foo";
	const helper = new SolarSshApi(env);
	t.is(helper.baseUrl(), "https://ssh.test:1234/foo/api/v1");
});

test("sshSession:undefined", (t) => {
	const helper = new SolarSshApi();
	t.is(helper.sshSession, undefined);
});

test("sshSession", (t) => {
	const helper = new SolarSshApi();
	const session = new SshSession(new Date(), "a", 1, "b", 2, 3);
	helper.sshSession = session;
	t.is(helper.sshSession, session);
});

test("sshSessionId:undefined", (t) => {
	const helper = new SolarSshApi();
	t.is(helper.sshSessionId, undefined);
});

test("sshSessionId", (t) => {
	const helper = new SolarSshApi();
	const session = new SshSession(new Date(), "a", 1, "b", 2, 3);
	helper.sshSession = session;
	t.is(helper.sshSessionId, session.sessionId);
});

test("createSshSessionAuthBuilder", (t) => {
	const helper = new SolarSshApi();
	const auth = helper.createSshSessionAuthBuilder(123);
	t.true(auth.useSnDate);
	t.is(auth.method(), HttpMethod.GET);
	t.is(
		auth.httpHeaders.firstValue(HttpHeaders.HOST),
		"data.solarnetwork.net"
	);
	t.is(auth.path(), "/solaruser/api/v1/sec/instr/viewPending");
	t.deepEqual(auth.parameters, new MultiMap({ nodeId: 123 }));
});

test("createSshSessionAuthBuilder:parameter", (t) => {
	const helper = new SolarSshApi();
	helper.parameter(DatumFilterKeys.NodeId, 123);
	const auth = helper.createSshSessionAuthBuilder();
	t.deepEqual(auth.parameters, new MultiMap({ nodeId: 123 }));
});

test("createSshSessionAuthBuilder:customSolarUserApi", (t) => {
	const userApi = new SolarUserApi(new Environment({ host: "user.test" }));
	const helper = new SolarSshApi(undefined, userApi);
	const auth = helper.createSshSessionAuthBuilder(123);
	t.is(auth.httpHeaders.firstValue(HttpHeaders.HOST), "user.test");
});

test("createSshSessionAuthBuilder:noNodeId", (t) => {
	const helper = new SolarSshApi();
	t.throws(() => helper.createSshSessionAuthBuilder(), {
		message: NO_NODE_ID_ERR_MSG,
	});
});

test("startSshSessionAuthBuilder", (t) => {
	const helper = new SolarSshApi();
	const session = new SshSession(new Date(), "a", 1, "b", 2, 3);
	const auth = helper.startSshSessionAuthBuilder(session);
	t.true(auth.useSnDate);
	t.is(auth.method(), HttpMethod.POST);
	t.is(
		auth.httpHeaders.firstValue(HttpHeaders.HOST),
		"data.solarnetwork.net"
	);
	t.is(
		auth.httpHeaders.firstValue(HttpHeaders.CONTENT_TYPE),
		HttpContentType.FORM_URLENCODED
	);
	t.is(auth.path(), "/solaruser/api/v1/sec/instr/add");
	t.deepEqual(
		auth.parameters.mapValue(),
		new Map<string, string>([
			["topic", "StartRemoteSsh"],
			["nodeId", "1"],
			["parameters[0].name", "host"],
			["parameters[0].value", "b"],
			["parameters[1].name", "user"],
			["parameters[1].value", "a"],
			["parameters[2].name", "port"],
			["parameters[2].value", "2"],
			["parameters[3].name", "rport"],
			["parameters[3].value", "3"],
		])
	);
});

test("startSshSessionAuthBuilder:parameter", (t) => {
	const helper = new SolarSshApi();
	const session = new SshSession(new Date(), "a", 1, "b", 2, 3);
	helper.sshSession = session;
	const auth = helper.startSshSessionAuthBuilder();
	t.true(auth.useSnDate);
	t.is(auth.method(), HttpMethod.POST);
	t.is(
		auth.httpHeaders.firstValue(HttpHeaders.HOST),
		"data.solarnetwork.net"
	);
	t.is(
		auth.httpHeaders.firstValue(HttpHeaders.CONTENT_TYPE),
		HttpContentType.FORM_URLENCODED
	);
	t.is(auth.path(), "/solaruser/api/v1/sec/instr/add");
	t.deepEqual(
		auth.parameters.mapValue(),
		new Map<string, string>([
			["topic", "StartRemoteSsh"],
			["nodeId", "1"],
			["parameters[0].name", "host"],
			["parameters[0].value", "b"],
			["parameters[1].name", "user"],
			["parameters[1].value", "a"],
			["parameters[2].name", "port"],
			["parameters[2].value", "2"],
			["parameters[3].name", "rport"],
			["parameters[3].value", "3"],
		])
	);
});

test("startSshSessionAuthBuilder:noSession", (t) => {
	const helper = new SolarSshApi();
	t.throws(() => helper.startSshSessionAuthBuilder(), {
		message: NO_SESSION_ERR_MSG,
	});
});

test("startSshSessionAuthBuilder:noNodeId", (t) => {
	const helper = new SolarSshApi();
	const session = new SshSession(
		new Date(),
		"a",
		undefined as any,
		"b",
		2,
		3
	);
	t.throws(() => helper.startSshSessionAuthBuilder(session), {
		message: NO_NODE_ID_ERR_MSG,
	});
});

test("stopSshSessionAuthBuilder", (t) => {
	const helper = new SolarSshApi();
	const session = new SshSession(new Date(), "a", 1, "b", 2, 3);
	const auth = helper.stopSshSessionAuthBuilder(session);
	t.true(auth.useSnDate);
	t.is(auth.method(), HttpMethod.POST);
	t.is(
		auth.httpHeaders.firstValue(HttpHeaders.HOST),
		"data.solarnetwork.net"
	);
	t.is(
		auth.httpHeaders.firstValue(HttpHeaders.CONTENT_TYPE),
		HttpContentType.FORM_URLENCODED
	);
	t.is(auth.path(), "/solaruser/api/v1/sec/instr/add");
	t.deepEqual(
		auth.parameters.mapValue(),
		new Map<string, string>([
			["topic", "StopRemoteSsh"],
			["nodeId", "1"],
			["parameters[0].name", "host"],
			["parameters[0].value", "b"],
			["parameters[1].name", "user"],
			["parameters[1].value", "a"],
			["parameters[2].name", "port"],
			["parameters[2].value", "2"],
			["parameters[3].name", "rport"],
			["parameters[3].value", "3"],
		])
	);
});

test("stopSshSessionAuthBuilder:parameter", (t) => {
	const helper = new SolarSshApi();
	const session = new SshSession(new Date(), "a", 1, "b", 2, 3);
	helper.sshSession = session;
	const auth = helper.stopSshSessionAuthBuilder();
	t.true(auth.useSnDate);
	t.is(auth.method(), HttpMethod.POST);
	t.is(
		auth.httpHeaders.firstValue(HttpHeaders.HOST),
		"data.solarnetwork.net"
	);
	t.is(
		auth.httpHeaders.firstValue(HttpHeaders.CONTENT_TYPE),
		HttpContentType.FORM_URLENCODED
	);
	t.is(auth.path(), "/solaruser/api/v1/sec/instr/add");
	t.deepEqual(
		auth.parameters.mapValue(),
		new Map<string, string>([
			["topic", "StopRemoteSsh"],
			["nodeId", "1"],
			["parameters[0].name", "host"],
			["parameters[0].value", "b"],
			["parameters[1].name", "user"],
			["parameters[1].value", "a"],
			["parameters[2].name", "port"],
			["parameters[2].value", "2"],
			["parameters[3].name", "rport"],
			["parameters[3].value", "3"],
		])
	);
});

test("stopSshSessionAuthBuilder:noSession", (t) => {
	const helper = new SolarSshApi();
	t.throws(() => helper.stopSshSessionAuthBuilder(), {
		message: NO_SESSION_ERR_MSG,
	});
});

test("stopSshSessionAuthBuilder:noNodeId", (t) => {
	const helper = new SolarSshApi();
	const session = new SshSession(
		new Date(),
		"a",
		undefined as any,
		"b",
		2,
		3
	);
	t.throws(() => helper.stopSshSessionAuthBuilder(session), {
		message: NO_NODE_ID_ERR_MSG,
	});
});

test("viewStartRemoteSshInstructionUrl", (t) => {
	const helper = new SolarSshApi();
	const session = new SshSession(new Date(), "a", 1, "b", 2, 3, 4, 5);
	t.is(
		helper.viewStartRemoteSshInstructionUrl(session),
		`https://data.solarnetwork.net/solaruser/api/v1/sec/instr/view?id=${session.startInstructionId}`
	);
});

test("viewStartRemoteSshInstructionUrl:parameter", (t) => {
	const helper = new SolarSshApi();
	const session = new SshSession(new Date(), "a", 1, "b", 2, 3, 4, 5);
	helper.sshSession = session;
	t.is(
		helper.viewStartRemoteSshInstructionUrl(),
		`https://data.solarnetwork.net/solaruser/api/v1/sec/instr/view?id=${session.startInstructionId}`
	);
});

test("viewStartRemoteSshInstructionUrl:noSession", (t) => {
	const helper = new SolarSshApi();
	t.throws(() => helper.viewStartRemoteSshInstructionUrl(), {
		message: NO_SESSION_ERR_MSG,
	});
});

test("viewStartRemoteSshInstructionUrl:noInstructionId", (t) => {
	const helper = new SolarSshApi();
	const session = new SshSession(
		new Date(),
		"a",
		1,
		"b",
		2,
		3,
		undefined as any,
		5
	);
	t.throws(() => helper.viewStartRemoteSshInstructionUrl(session), {
		message: NO_INSTRUCTION_ID_ERR_MSG,
	});
});

test("viewStartRemoteSshInstructionAuthBuilder", (t) => {
	const helper = new SolarSshApi();
	const session = new SshSession(new Date(), "a", 1, "b", 2, 3, 4, 5);
	const auth = helper.viewStartRemoteSshInstructionAuthBuilder(session);
	t.true(auth.useSnDate);
	t.is(auth.method(), HttpMethod.GET);
	t.is(
		auth.httpHeaders.firstValue(HttpHeaders.HOST),
		"data.solarnetwork.net"
	);
	t.is(auth.path(), "/solaruser/api/v1/sec/instr/view");
	t.deepEqual(
		auth.parameters.mapValue(),
		new Map<string, string>([["id", String(session.startInstructionId)]])
	);
});

test("viewStartRemoteSshInstructionAuthBuilder:parameter", (t) => {
	const helper = new SolarSshApi();
	const session = new SshSession(new Date(), "a", 1, "b", 2, 3, 4, 5);
	helper.sshSession = session;
	const auth = helper.viewStartRemoteSshInstructionAuthBuilder();
	t.true(auth.useSnDate);
	t.is(auth.method(), HttpMethod.GET);
	t.is(
		auth.httpHeaders.firstValue(HttpHeaders.HOST),
		"data.solarnetwork.net"
	);
	t.is(auth.path(), "/solaruser/api/v1/sec/instr/view");
	t.deepEqual(
		auth.parameters.mapValue(),
		new Map<string, string>([["id", String(session.startInstructionId)]])
	);
});

test("viewStartRemoteSshInstructionAuthBuilder:noSession", (t) => {
	const helper = new SolarSshApi();
	t.throws(() => helper.viewStartRemoteSshInstructionAuthBuilder(), {
		message: NO_SESSION_ERR_MSG,
	});
});

test("viewStartRemoteSshInstructionAuthBuilder:noInstructionId", (t) => {
	const helper = new SolarSshApi();
	const session = new SshSession(
		new Date(),
		"a",
		1,
		"b",
		2,
		3,
		undefined as any,
		5
	);
	t.throws(() => helper.viewStartRemoteSshInstructionAuthBuilder(session), {
		message: NO_INSTRUCTION_ID_ERR_MSG,
	});
});

test("viewStopRemoteSshInstructionUrl", (t) => {
	const helper = new SolarSshApi();
	const session = new SshSession(new Date(), "a", 1, "b", 2, 3, 4, 5);
	t.is(
		helper.viewStopRemoteSshInstructionUrl(session),
		`https://data.solarnetwork.net/solaruser/api/v1/sec/instr/view?id=${session.stopInstructionId}`
	);
});

test("viewStopRemoteSshInstructionUrl:parameter", (t) => {
	const helper = new SolarSshApi();
	const session = new SshSession(new Date(), "a", 1, "b", 2, 3, 4, 5);
	helper.sshSession = session;
	t.is(
		helper.viewStopRemoteSshInstructionUrl(),
		`https://data.solarnetwork.net/solaruser/api/v1/sec/instr/view?id=${session.stopInstructionId}`
	);
});

test("viewStopRemoteSshInstructionUrl:noSession", (t) => {
	const helper = new SolarSshApi();
	t.throws(() => helper.viewStopRemoteSshInstructionUrl(), {
		message: NO_SESSION_ERR_MSG,
	});
});

test("viewStopRemoteSshInstructionUrl:noInstructionId", (t) => {
	const helper = new SolarSshApi();
	const session = new SshSession(
		new Date(),
		"a",
		1,
		"b",
		2,
		3,
		4,
		undefined as any
	);
	t.throws(() => helper.viewStopRemoteSshInstructionUrl(session), {
		message: NO_INSTRUCTION_ID_ERR_MSG,
	});
});

test("viewStopRemoteSshInstructionAuthBuilder", (t) => {
	const helper = new SolarSshApi();
	const session = new SshSession(new Date(), "a", 1, "b", 2, 3, 4, 5);
	const auth = helper.viewStopRemoteSshInstructionAuthBuilder(session);
	t.true(auth.useSnDate);
	t.is(auth.method(), HttpMethod.GET);
	t.is(
		auth.httpHeaders.firstValue(HttpHeaders.HOST),
		"data.solarnetwork.net"
	);
	t.is(auth.path(), "/solaruser/api/v1/sec/instr/view");
	t.deepEqual(
		auth.parameters.mapValue(),
		new Map<string, string>([["id", String(session.stopInstructionId)]])
	);
});

test("viewStopRemoteSshInstructionAuthBuilder:parameter", (t) => {
	const helper = new SolarSshApi();
	const session = new SshSession(new Date(), "a", 1, "b", 2, 3, 4, 5);
	helper.sshSession = session;
	const auth = helper.viewStopRemoteSshInstructionAuthBuilder();
	t.true(auth.useSnDate);
	t.is(auth.method(), HttpMethod.GET);
	t.is(
		auth.httpHeaders.firstValue(HttpHeaders.HOST),
		"data.solarnetwork.net"
	);
	t.is(auth.path(), "/solaruser/api/v1/sec/instr/view");
	t.deepEqual(
		auth.parameters.mapValue(),
		new Map<string, string>([["id", String(session.stopInstructionId)]])
	);
});

test("viewStopRemoteSshInstructionAuthBuilder:noSession", (t) => {
	const helper = new SolarSshApi();
	t.throws(() => helper.viewStopRemoteSshInstructionAuthBuilder(), {
		message: NO_SESSION_ERR_MSG,
	});
});

test("viewStopRemoteSshInstructionAuthBuilder:noInstructionId", (t) => {
	const helper = new SolarSshApi();
	const session = new SshSession(
		new Date(),
		"a",
		1,
		"b",
		2,
		3,
		4,
		undefined as any
	);
	t.throws(() => helper.viewStopRemoteSshInstructionAuthBuilder(session), {
		message: NO_INSTRUCTION_ID_ERR_MSG,
	});
});

test("connectTerminalWebSocketAuthBuilder", (t) => {
	const helper = new SolarSshApi();
	const auth = helper.connectTerminalWebSocketAuthBuilder(123);
	t.true(auth.useSnDate);
	t.is(auth.method(), HttpMethod.GET);
	t.is(
		auth.httpHeaders.firstValue(HttpHeaders.HOST),
		"data.solarnetwork.net"
	);
	t.is(auth.path(), "/solaruser/api/v1/sec/nodes/meta/123");
});

test("connectTerminalWebSocketAuthBuilder:parameter", (t) => {
	const helper = new SolarSshApi();
	helper.parameter(DatumFilterKeys.NodeId, 123);
	const auth = helper.connectTerminalWebSocketAuthBuilder();
	t.is(auth.path(), "/solaruser/api/v1/sec/nodes/meta/123");
});

test("connectTerminalWebSocketAuthBuilder:parameter:override", (t) => {
	const helper = new SolarSshApi();
	helper.parameter(DatumFilterKeys.NodeId, 123);
	const auth = helper.connectTerminalWebSocketAuthBuilder(234);
	t.is(auth.path(), "/solaruser/api/v1/sec/nodes/meta/234");
});

test("connectTerminalWebSocketAuthBuilder:noNodeId", (t) => {
	const helper = new SolarSshApi();
	t.throws(() => helper.connectTerminalWebSocketAuthBuilder(), {
		message: NO_NODE_ID_ERR_MSG,
	});
});
