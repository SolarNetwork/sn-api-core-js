import test from "ava";

import UrlHelper from "../../main/net/urlHelper.js";
import {
	default as SolarSshUrlHelperMixin,
	SolarSshPathKey,
} from "../../main/net/solarSshUrlHelperMixin.js";
import { DatumFilterKeys } from "../../main/domain/datumFilter.js";

class TestUrlHelper extends SolarSshUrlHelperMixin(UrlHelper) {}

function newHelper(): TestUrlHelper {
	const helper = new TestUrlHelper();
	helper.environment.host = "ssh.test";
	return helper;
}

const NO_NODE_ID_ERR_MSG = /.*node ID.*/;
const NO_SESSION_ID_ERR_MSG = /.*session ID.*/;

test("create", (t) => {
	const helper = newHelper();
	t.truthy(helper);
});

test("terminalWebSocketUrl", (t) => {
	const helper = newHelper();
	t.is(helper.terminalWebSocketUrl("a"), "wss://ssh.test/ssh?sessionId=a");
});

test("terminalWebSocketUrl:withContext", (t) => {
	const helper = newHelper();
	helper.environment.props.set(SolarSshPathKey, "/foo");
	t.is(
		helper.terminalWebSocketUrl("a"),
		"wss://ssh.test/foo/ssh?sessionId=a"
	);
});

test("terminalWebSocketUrl:noSessionId", (t) => {
	const helper = newHelper();
	const error = t.throws(() => {
		helper.terminalWebSocketUrl(undefined as any);
	});
	t.true(NO_SESSION_ID_ERR_MSG.test(error.message));
});

test("httpProxyUrl", (t) => {
	const helper = newHelper();
	t.is(helper.httpProxyUrl("a"), "https://ssh.test/nodeproxy/a/");
});

test("httpProxyUrl:withContext", (t) => {
	const helper = newHelper();
	helper.environment.props.set(SolarSshPathKey, "/foo");
	t.is(helper.httpProxyUrl("a"), "https://ssh.test/foo/nodeproxy/a/");
});

test("httpProxyUrl:noSessionId", (t) => {
	const helper = newHelper();
	const error = t.throws(() => {
		helper.httpProxyUrl(undefined as any);
	});
	t.true(NO_SESSION_ID_ERR_MSG.test(error.message));
});

test("createSshSessionUrl", (t) => {
	const helper = newHelper();
	t.is(
		helper.createSshSessionUrl(123),
		"https://ssh.test/ssh/session/new?nodeId=123"
	);
});

test("createSshSessionUrl:noNodeId", (t) => {
	const helper = newHelper();
	const error = t.throws(() => {
		helper.createSshSessionUrl(undefined as any);
	});
	t.true(NO_NODE_ID_ERR_MSG.test(error.message));
});

test("createSshSessionUrl:parameter", (t) => {
	const helper = newHelper();
	helper.parameter(DatumFilterKeys.NodeId, 123);
	t.is(
		helper.createSshSessionUrl(),
		"https://ssh.test/ssh/session/new?nodeId=123"
	);
});

test("createSshSessionUrl:parameter:override", (t) => {
	const helper = newHelper();
	helper.parameter(DatumFilterKeys.NodeId, 123);
	t.is(
		helper.createSshSessionUrl(234),
		"https://ssh.test/ssh/session/new?nodeId=234"
	);
});

test("startSshSessionUrl", (t) => {
	const helper = newHelper();
	t.is(
		helper.startSshSessionUrl("abc"),
		"https://ssh.test/ssh/session/abc/start"
	);
});

test("startSshSessionUrl:noSessionId", (t) => {
	const helper = newHelper();
	const error = t.throws(() => {
		helper.startSshSessionUrl(undefined as any);
	});
	t.true(NO_SESSION_ID_ERR_MSG.test(error.message));
});

test("stopSshSessionUrl", (t) => {
	const helper = newHelper();
	t.is(
		helper.stopSshSessionUrl("abc"),
		"https://ssh.test/ssh/session/abc/stop"
	);
});

test("stopSshSessionUrl:noSessionId", (t) => {
	const helper = newHelper();
	const error = t.throws(() => {
		helper.stopSshSessionUrl(undefined as any);
	});
	t.true(NO_SESSION_ID_ERR_MSG.test(error.message));
});
