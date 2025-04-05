import anyTest, { TestFn } from "ava";
import { MockAgent, setGlobalDispatcher } from "undici";

import DatumFilter from "../../main/domain/datumFilter.js";
import { default as log, LogLevel } from "../../main/util/logger.js";
import AuthorizationV2Builder from "../../main/net/authV2.js";
import HttpHeaders from "../../main/net/httpHeaders.js";
import SolarQueryApi from "../../main/net/solarQueryUrlHelper.js";

import DatumSourceFinder from "../../main/tool/datumSourceFinder.js";

const test = anyTest as TestFn<{
	agent: MockAgent;
	api: SolarQueryApi;
	auth: AuthorizationV2Builder;
}>;

log.level = LogLevel.DEBUG;

const BASE_URL = "http://localhost";
const TEST_TOKEN_ID = "test-token";
const TEST_TOKEN_SECRET = "secret";

test.beforeEach((t) => {
	const agent = new MockAgent();
	agent.disableNetConnect();
	setGlobalDispatcher(agent);
	const api = new SolarQueryApi({ protocol: "http", host: "localhost" });
	const auth = new AuthorizationV2Builder(TEST_TOKEN_ID, api.environment);
	auth.saveSigningKey(TEST_TOKEN_SECRET);
	t.context = {
		agent: agent,
		api: api,
		auth: auth,
	};
});

function testFilter(nodeId?: number, sourceIds?: string[]): DatumFilter {
	const filter = new DatumFilter();
	if (nodeId) {
		filter.nodeId = nodeId;
	}
	if (sourceIds) {
		filter.sourceIds = sourceIds;
	}
	return filter;
}

test("construct:public", (t) => {
	const finder = new DatumSourceFinder(t.context.api, testFilter());
	t.truthy(finder);
});

test.serial("fetch:oneNode", async (t) => {
	// GIVEN
	const http = t.context.agent.get(BASE_URL);
	const queryResult = [
		{ nodeId: 123, sourceId: "a" },
		{ nodeId: 123, sourceId: "b" },
		{ nodeId: 123, sourceId: "c" },
	];
	http.intercept({
		path: "/solarquery/api/v1/pub/range/sources?nodeId=123&withNodeIds=true",
		method: "GET",
	}).reply(200, {
		success: true,
		data: queryResult,
	});

	// WHEN
	const finder = new DatumSourceFinder(t.context.api, testFilter(123));
	const sources = await finder.fetch();

	// THEN
	t.deepEqual(sources, { 123: ["a", "b", "c"] });
});

test.serial("fetch:error:http500", async (t) => {
	// GIVEN
	const path =
		"/solarquery/api/v1/pub/range/sources?nodeId=123&withNodeIds=true";
	const http = t.context.agent.get(BASE_URL);
	http.intercept({
		path: path,
		method: "GET",
	}).reply(500);

	// WHEN
	const finder = new DatumSourceFinder(t.context.api, testFilter(123));
	const error = await t.throwsAsync(() => {
		return finder.fetch();
	});

	// THEN
	t.is(
		error.message,
		`Error requesting data for ${BASE_URL + path}: Internal Server Error`
	);
});

test.serial("fetch:oneNode:filter", async (t) => {
	// GIVEN
	const http = t.context.agent.get(BASE_URL);
	const queryResult = [
		{ nodeId: 123, sourceId: "a" },
		{ nodeId: 123, sourceId: "b" },
		{ nodeId: 123, sourceId: "c" },
	];
	http.intercept({
		path: "/solarquery/api/v1/pub/range/sources?startDate=2017-01-01T12%3A00&metadataFilter=(t%3Dfoo)&nodeId=123&withNodeIds=true",
		method: "GET",
	}).reply(200, {
		success: true,
		data: queryResult,
	});

	// WHEN
	const filter = testFilter(123);
	filter.startDate = new Date("2017-01-01T12:00:00.000Z");
	filter.metadataFilter = "(t=foo)";
	const finder = new DatumSourceFinder(t.context.api, filter);
	const sources = await finder.fetch();

	// THEN
	t.deepEqual(sources, { 123: ["a", "b", "c"] });
});

test.serial("fetch:oneNode:noData", async (t) => {
	// GIVEN
	const http = t.context.agent.get(BASE_URL);
	http.intercept({
		path: "/solarquery/api/v1/pub/range/sources?nodeId=123&withNodeIds=true",
		method: "GET",
	}).reply(200, {
		success: true,
	});

	// WHEN
	const finder = new DatumSourceFinder(t.context.api, testFilter(123));
	const sources = await finder.fetch();

	// THEN
	t.deepEqual(sources, {});
});

test.serial("oneNode:sec", async (t) => {
	// GIVEN
	const http = t.context.agent.get(BASE_URL);
	const queryResult = [
		{ nodeId: 123, sourceId: "a" },
		{ nodeId: 123, sourceId: "b" },
		{ nodeId: 123, sourceId: "c" },
	];
	http.intercept({
		path: "/solarquery/api/v1/sec/range/sources?nodeId=123&withNodeIds=true",
		method: "GET",
		headers: (headers: any): boolean => {
			return t.regex(
				headers[HttpHeaders.AUTHORIZATION.toLowerCase()],
				/^SNWS2 Credential=test-token,SignedHeaders=host;x-sn-date,Signature=/
			);
		},
	}).reply(200, {
		success: true,
		data: queryResult,
	});

	// WHEN
	const finder = new DatumSourceFinder(
		t.context.api,
		testFilter(123),
		t.context.auth
	);
	const sources = await finder.fetch();

	// THEN
	t.deepEqual(sources, { 123: ["a", "b", "c"] });
});

test.serial("fetch:multiNode", async (t) => {
	// GIVEN
	const http = t.context.agent.get(BASE_URL);
	const queryResults = [
		[
			{ nodeId: 123, sourceId: "a" },
			{ nodeId: 123, sourceId: "b" },
			{ nodeId: 123, sourceId: "c" },
		],
		[
			{ nodeId: 234, sourceId: "b" },
			{ nodeId: 234, sourceId: "c" },
			{ nodeId: 234, sourceId: "d" },
		],
	];
	http.intercept({
		path: "/solarquery/api/v1/pub/range/sources?nodeId=123&withNodeIds=true",
		method: "GET",
	}).reply(200, {
		success: true,
		data: queryResults[0],
	});
	http.intercept({
		path: "/solarquery/api/v1/pub/range/sources?nodeId=234&withNodeIds=true",
		method: "GET",
	}).reply(200, {
		success: true,
		data: queryResults[1],
	});

	// WHEN
	const finder = new DatumSourceFinder(t.context.api, [
		testFilter(123),
		testFilter(234),
	]);
	const sources = await finder.fetch();

	// THEN
	t.deepEqual(sources, {
		123: ["a", "b", "c"],
		234: ["b", "c", "d"],
	});
});

test.serial("fetch:multiNode:mixed", async (t) => {
	// GIVEN
	const http = t.context.agent.get(BASE_URL);
	const queryResults = [
		[
			{ nodeId: 123, sourceId: "a" },
			{ nodeId: 234, sourceId: "b" },
			{ nodeId: 345, sourceId: "c" },
		],
		[
			{ nodeId: 234, sourceId: "d" },
			{ nodeId: 345, sourceId: "e" },
			{ nodeId: 456, sourceId: "f" },
		],
	];
	http.intercept({
		path: "/solarquery/api/v1/pub/range/sources?nodeId=123&withNodeIds=true",
		method: "GET",
	}).reply(200, {
		success: true,
		data: queryResults[0],
	});
	http.intercept({
		path: "/solarquery/api/v1/pub/range/sources?nodeId=234&withNodeIds=true",
		method: "GET",
	}).reply(200, {
		success: true,
		data: queryResults[1],
	});

	// WHEN
	const finder = new DatumSourceFinder(t.context.api, [
		testFilter(123),
		testFilter(234),
	]);
	const sources = await finder.fetch();

	// THEN
	t.deepEqual(sources, {
		123: ["a"],
		234: ["b", "d"],
		345: ["c", "e"],
		456: ["f"],
	});
});
