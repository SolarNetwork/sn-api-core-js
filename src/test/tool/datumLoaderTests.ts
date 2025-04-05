import anyTest, { ExecutionContext, TestFn } from "ava";
import { promisify } from "node:util";
import { MockAgent, setGlobalDispatcher } from "undici";
import Aggregations from "../../main/domain/aggregation.js";
import Datum from "../../main/domain/datum.js";
import DatumFilter from "../../main/domain/datumFilter.js";
import { default as log, LogLevel } from "../../main/util/logger.js";
import { LoaderDataCallbackFn } from "../../main/net/loader.js";
import SolarQueryApi from "../../main/net/solarQueryUrlHelper.js";

import {
	default as DatumLoader,
	DatumLoaderState,
} from "../../main/tool/datumLoader.js";

const test = anyTest as TestFn<{
	agent: MockAgent;
	api: SolarQueryApi;
}>;

log.level = LogLevel.DEBUG;

const BASE_URL = "http://localhost";
const TEST_SOURCE_ID = "test-source";
const TEST_NODE_ID = 123;

const TEST_START_DATE = new Date("Sat, 1 Apr 2017 12:00:00 GMT");
const TEST_END_DATE = new Date("Mon, 1 May 2017 12:00:00 GMT");

test.beforeEach((t) => {
	const agent = new MockAgent();
	agent.disableNetConnect();
	setGlobalDispatcher(agent);
	t.context = {
		agent: agent,
		api: new SolarQueryApi({ protocol: "http", host: "localhost" }),
	};
});

function testFilter(): DatumFilter {
	const filter = new DatumFilter();
	filter.nodeId = TEST_NODE_ID;
	filter.sourceId = TEST_SOURCE_ID;
	filter.startDate = TEST_START_DATE;
	filter.endDate = TEST_END_DATE;
	filter.aggregation = Aggregations.Hour;
	return filter;
}

test.serial("parallel:error:http500", async (t) => {
	// GIVEN
	const path =
		"/solarquery/api/v1/pub/datum/list?nodeId=123&sourceId=test-source&startDate=2017-04-01T12%3A00&endDate=2017-05-01T12%3A00&aggregation=Hour&withoutTotalResultsCount=false&max=2";

	const http = t.context.agent.get(BASE_URL);
	http.intercept({
		path: path,
		method: "GET",
	}).reply(500);

	// WHEN
	const filter = testFilter();
	const loader = new DatumLoader(t.context.api, filter)
		.paginationSize(2)
		.concurrency(Infinity)
		.includeTotalResultsCount(true);

	const error = await t.throwsAsync(() => {
		return loader.fetch();
	});

	// THEN
	t.is(
		error.message,
		`Error requesting data for ${BASE_URL + path}: Internal Server Error`
	);
});

test.serial("noData", async (t) => {
	// GIVEN
	const path =
		"/solarquery/api/v1/pub/datum/list?nodeId=123&sourceId=test-source&startDate=2017-04-01T12%3A00&endDate=2017-05-01T12%3A00&aggregation=Hour&withoutTotalResultsCount=true&max=2";

	const http = t.context.agent.get(BASE_URL);
	http.intercept({
		path: path,
		method: "GET",
	}).reply(200, {
		success: true,
	});

	// WHEN
	const filter = testFilter();
	const loader = new DatumLoader(t.context.api, filter).paginationSize(2);

	const results = await loader.fetch();

	// THEN
	t.deepEqual(results, []);
});

test.serial("urlParameters", async (t) => {
	// GIVEN
	const path =
		"/solarquery/api/v1/pub/datum/list?nodeId=123&sourceId=test-source&startDate=2017-04-01T12%3A00&endDate=2017-05-01T12%3A00&aggregation=Hour&withoutTotalResultsCount=true&max=2&foo=bar";

	const http = t.context.agent.get(BASE_URL);
	http.intercept({
		path: path,
		method: "GET",
	}).reply(200, {
		success: true,
	});

	// WHEN
	const params = { foo: "bar" };
	const filter = testFilter();
	const loader = new DatumLoader(t.context.api, filter)
		.paginationSize(2)
		.parameters(params);

	const results = await loader.fetch();

	// THEN
	t.deepEqual(results, []);
	t.deepEqual(loader.parameters(), params);
});

test.serial("pagintationSize", (t) => {
	// GIVEN

	// WHEN
	const filter = testFilter();
	const loader = new DatumLoader(t.context.api, filter).paginationSize(2);

	// THEN
	t.is(loader.paginationSize(), 2);
});

test.serial("pagintationSize:default", (t) => {
	// GIVEN

	// WHEN
	const filter = testFilter();
	const loader = new DatumLoader(t.context.api, filter);

	// THEN
	t.is(loader.paginationSize(), 1000, "Default pagination size");
});

test.serial("pagintationSize:NaN", (t) => {
	// GIVEN

	// WHEN
	const filter = testFilter();
	const loader = new DatumLoader(t.context.api, filter).paginationSize(
		"two" as any
	);

	// THEN
	t.is(
		loader.paginationSize(),
		1000,
		"NaN pagination size reverts to default size"
	);
});

test.serial("state:initial", (t) => {
	// GIVEN

	// WHEN
	const filter = testFilter();
	const loader = new DatumLoader(t.context.api, filter);

	// THEN
	t.is(loader.state(), DatumLoaderState.Ready, "Initial state is Ready");
});

test.serial("load:noCallback", (t) => {
	// GIVEN

	// WHEN
	const filter = testFilter();
	const loader = new DatumLoader(t.context.api, filter).paginationSize(2);

	const error = t.throws(() => {
		return loader.load();
	});

	// THEN
	t.is(error.message, "No callback provided.");
});

test.serial("incremental:fetch", async (t) => {
	// GIVEN

	// WHEN
	const filter = testFilter();
	const loader = new DatumLoader(t.context.api, filter)
		.paginationSize(2)
		.incremental(true);

	const error = await t.throwsAsync(() => {
		return loader.fetch();
	});

	// THEN
	t.is(loader.incremental(), true);
	t.is(
		error.message,
		"Incremental mode is not supported via fetch(), use load(callback) instead."
	);
});

test.serial("readingMode", async (t) => {
	// GIVEN
	const path =
		"/solarquery/api/v1/pub/datum/reading?nodeId=123&sourceId=test-source&startDate=2017-04-01T12%3A00&endDate=2017-05-01T12%3A00&aggregation=Hour&withoutTotalResultsCount=true&readingType=Difference&max=2";

	const http = t.context.agent.get(BASE_URL);
	http.intercept({
		path: path,
		method: "GET",
	}).reply(200, {
		success: true,
	});

	// WHEN
	const filter = testFilter();
	const loader = new DatumLoader(t.context.api, filter)
		.paginationSize(2)
		.readings(true);

	const results = await loader.fetch();

	// THEN
	t.is(loader.readings(), true);
	t.deepEqual(results, []);
	t.is(loader.state(), DatumLoaderState.Done, "Final state is Done");
});

test.serial("missingTotalResults", async (t) => {
	// GIVEN
	const path =
		"/solarquery/api/v1/pub/datum/list?nodeId=123&sourceId=test-source&startDate=2017-04-01T12%3A00&endDate=2017-05-01T12%3A00&aggregation=Hour&withoutTotalResultsCount=false&max=2";
	const http = t.context.agent.get(BASE_URL);
	http.intercept({
		path: path,
		method: "GET",
	}).reply(200, {
		success: true,
		data: {
			startingOffset: 0,
			returnedResultCount: 0,
			results: [],
		},
	});

	// WHEN
	const filter = testFilter();
	const loader = new DatumLoader(t.context.api, filter)
		.paginationSize(2)
		.includeTotalResultsCount(true);

	const results = await loader.fetch();

	// THEN
	t.deepEqual(results, []);
});

test.serial("load:serial:multiPage:lastPageFull", async (t) => {
	// GIVEN
	const allResults = [
		{
			created: "2017-07-04 12:00:00.000Z",
			nodeId: 123,
			sourceId: "test-source",
			val: 0,
		},
		{
			created: "2017-07-04 13:00:00.000Z",
			nodeId: 123,
			sourceId: "test-source",
			val: 1,
		},
		{
			created: "2017-07-04 14:00:00.000Z",
			nodeId: 123,
			sourceId: "test-source",
			val: 0,
		},
		{
			created: "2017-07-04 15:00:00.000Z",
			nodeId: 123,
			sourceId: "test-source",
			val: 1,
		},
		{
			created: "2017-07-04 16:00:00.000Z",
			nodeId: 123,
			sourceId: "test-source",
			val: 0,
		},
		{
			created: "2017-07-04 17:00:00.000Z",
			nodeId: 123,
			sourceId: "test-source",
			val: 1,
		},
	];

	const http = t.context.agent.get(BASE_URL);
	http.intercept({
		path: "/solarquery/api/v1/pub/datum/list?nodeId=123&sourceId=test-source&startDate=2017-04-01T12%3A00&endDate=2017-05-01T12%3A00&aggregation=Hour&withoutTotalResultsCount=true&max=2",
		method: "GET",
	}).reply(200, {
		success: true,
		data: {
			totalResults: 6,
			startingOffset: 0,
			returnedResultCount: 2,
			results: allResults.slice(0, 2),
		},
	});
	http.intercept({
		path: "/solarquery/api/v1/pub/datum/list?nodeId=123&sourceId=test-source&startDate=2017-04-01T12%3A00&endDate=2017-05-01T12%3A00&aggregation=Hour&withoutTotalResultsCount=true&max=2&offset=2",
		method: "GET",
	}).reply(200, {
		success: true,
		data: {
			totalResults: null,
			startingOffset: 2,
			returnedResultCount: 2,
			results: allResults.slice(2, 4),
		},
	});
	http.intercept({
		path: "/solarquery/api/v1/pub/datum/list?nodeId=123&sourceId=test-source&startDate=2017-04-01T12%3A00&endDate=2017-05-01T12%3A00&aggregation=Hour&withoutTotalResultsCount=true&max=2&offset=4",
		method: "GET",
	}).reply(200, {
		success: true,
		data: {
			totalResults: null,
			startingOffset: 4,
			returnedResultCount: 2,
			results: allResults.slice(4, 6),
		},
	});
	http.intercept({
		path: "/solarquery/api/v1/pub/datum/list?nodeId=123&sourceId=test-source&startDate=2017-04-01T12%3A00&endDate=2017-05-01T12%3A00&aggregation=Hour&withoutTotalResultsCount=true&max=2&offset=6",
		method: "GET",
	}).reply(200, {
		success: true,
		data: {
			totalResults: null,
			startingOffset: 6,
			returnedResultCount: 0,
			results: [],
		},
	});

	// WHEN
	const filter = testFilter();
	const loader = new DatumLoader(t.context.api, filter).paginationSize(2);

	const results = await loader.fetch();

	// THEN
	t.deepEqual(results, allResults);
});

test.serial("load:serial:multiPage:lastPagePartial", async (t) => {
	// GIVEN
	const allResults = [
		{
			created: "2017-07-04 12:00:00.000Z",
			nodeId: 123,
			sourceId: "test-source",
			val: 0,
		},
		{
			created: "2017-07-04 13:00:00.000Z",
			nodeId: 123,
			sourceId: "test-source",
			val: 1,
		},
		{
			created: "2017-07-04 14:00:00.000Z",
			nodeId: 123,
			sourceId: "test-source",
			val: 0,
		},
		{
			created: "2017-07-04 15:00:00.000Z",
			nodeId: 123,
			sourceId: "test-source",
			val: 1,
		},
		{
			created: "2017-07-04 16:00:00.000Z",
			nodeId: 123,
			sourceId: "test-source",
			val: 0,
		},
	];

	const http = t.context.agent.get(BASE_URL);
	http.intercept({
		path: "/solarquery/api/v1/pub/datum/list?nodeId=123&sourceId=test-source&startDate=2017-04-01T12%3A00&endDate=2017-05-01T12%3A00&aggregation=Hour&withoutTotalResultsCount=true&max=2",
		method: "GET",
	}).reply(200, {
		success: true,
		data: {
			totalResults: null,
			startingOffset: 0,
			returnedResultCount: 2,
			results: allResults.slice(0, 2),
		},
	});
	http.intercept({
		path: "/solarquery/api/v1/pub/datum/list?nodeId=123&sourceId=test-source&startDate=2017-04-01T12%3A00&endDate=2017-05-01T12%3A00&aggregation=Hour&withoutTotalResultsCount=true&max=2&offset=2",
		method: "GET",
	}).reply(200, {
		success: true,
		data: {
			totalResults: null,
			startingOffset: 2,
			returnedResultCount: 2,
			results: allResults.slice(2, 4),
		},
	});
	http.intercept({
		path: "/solarquery/api/v1/pub/datum/list?nodeId=123&sourceId=test-source&startDate=2017-04-01T12%3A00&endDate=2017-05-01T12%3A00&aggregation=Hour&withoutTotalResultsCount=true&max=2&offset=4",
		method: "GET",
	}).reply(200, {
		success: true,
		data: {
			totalResults: null,
			startingOffset: 4,
			returnedResultCount: 1,
			results: allResults.slice(4, 5),
		},
	});

	// WHEN
	const filter = testFilter();
	const loader = new DatumLoader(t.context.api, filter).paginationSize(2);

	const results = await loader.fetch();

	// THEN
	t.deepEqual(results, allResults);
});

test.serial("serial:multiPage:lastPagePartial:incremental", async (t) => {
	// GIVEN
	const allResults = [
		{
			created: "2017-07-04 12:00:00.000Z",
			nodeId: 123,
			sourceId: "test-source",
			val: 0,
		},
		{
			created: "2017-07-04 13:00:00.000Z",
			nodeId: 123,
			sourceId: "test-source",
			val: 1,
		},
		{
			created: "2017-07-04 14:00:00.000Z",
			nodeId: 123,
			sourceId: "test-source",
			val: 0,
		},
		{
			created: "2017-07-04 15:00:00.000Z",
			nodeId: 123,
			sourceId: "test-source",
			val: 1,
		},
		{
			created: "2017-07-04 16:00:00.000Z",
			nodeId: 123,
			sourceId: "test-source",
			val: 0,
		},
	];

	const http = t.context.agent.get(BASE_URL);
	http.intercept({
		path: "/solarquery/api/v1/pub/datum/list?nodeId=123&sourceId=test-source&startDate=2017-04-01T12%3A00&endDate=2017-05-01T12%3A00&aggregation=Hour&withoutTotalResultsCount=true&max=2",
		method: "GET",
	}).reply(200, {
		success: true,
		data: {
			totalResults: null,
			startingOffset: 0,
			returnedResultCount: 2,
			results: allResults.slice(0, 2),
		},
	});
	http.intercept({
		path: "/solarquery/api/v1/pub/datum/list?nodeId=123&sourceId=test-source&startDate=2017-04-01T12%3A00&endDate=2017-05-01T12%3A00&aggregation=Hour&withoutTotalResultsCount=true&max=2&offset=2",
		method: "GET",
	}).reply(200, {
		success: true,
		data: {
			totalResults: null,
			startingOffset: 2,
			returnedResultCount: 2,
			results: allResults.slice(2, 4),
		},
	});
	http.intercept({
		path: "/solarquery/api/v1/pub/datum/list?nodeId=123&sourceId=test-source&startDate=2017-04-01T12%3A00&endDate=2017-05-01T12%3A00&aggregation=Hour&withoutTotalResultsCount=true&max=2&offset=4",
		method: "GET",
	}).reply(200, {
		success: true,
		data: {
			totalResults: null,
			startingOffset: 4,
			returnedResultCount: 1,
			results: allResults.slice(4, 5),
		},
	});

	// WHEN
	const filter = testFilter();
	const loader = new DatumLoader(t.context.api, filter)
		.paginationSize(2)
		.incremental(true);

	const incResults: any[] = [];
	await new Promise<void>((resolve, reject) => {
		loader.load((error, results) => {
			try {
				t.falsy(error, "No error generated.");
				incResults.splice(incResults.length, 0, results);
				if (incResults.length == 3) {
					resolve();
				}
			} catch (error) {
				reject(error);
			}
		});
	});

	// THEN
	t.deepEqual(incResults, [
		allResults.slice(0, 2),
		allResults.slice(0, 4),
		allResults.slice(0, 5),
	]);
});

const withLoaderCallback =
	(
		fn: (
			t: ExecutionContext<{ agent: MockAgent; api: SolarQueryApi }>,
			end: LoaderDataCallbackFn<Datum[]>
		) => void
	) =>
	async (t: ExecutionContext<{ agent: MockAgent; api: SolarQueryApi }>) => {
		await promisify(fn)(t);
		t.pass();
	};

test.serial(
	"serial:multiPage:lastPagePartial:callbackProperty",
	withLoaderCallback(
		(
			t: ExecutionContext<{ agent: MockAgent; api: SolarQueryApi }>,
			end: LoaderDataCallbackFn<Datum[]>
		) => {
			// GIVEN
			const allResults = [
				{
					created: "2017-07-04 12:00:00.000Z",
					nodeId: 123,
					sourceId: "test-source",
					val: 0,
				},
				{
					created: "2017-07-04 13:00:00.000Z",
					nodeId: 123,
					sourceId: "test-source",
					val: 1,
				},
			];

			const http = t.context.agent.get(BASE_URL);
			http.intercept({
				path: "/solarquery/api/v1/pub/datum/list?nodeId=123&sourceId=test-source&startDate=2017-04-01T12%3A00&endDate=2017-05-01T12%3A00&aggregation=Hour&withoutTotalResultsCount=false&max=2",
				method: "GET",
			}).reply(200, {
				success: true,
				data: {
					totalResults: 2,
					startingOffset: 0,
					returnedResultCount: 2,
					results: allResults,
				},
			});

			// WHEN
			const filter = testFilter();

			const loader = new DatumLoader(t.context.api, filter)
				.paginationSize(2)
				.includeTotalResultsCount(true)
				.callback((error, results) => {
					t.falsy(error, "No error generated.");
					t.deepEqual(results, allResults);
					end(undefined, results);
				});

			loader.load();

			t.truthy(loader.callback());
		}
	)
);

test.serial("serial:multiPage:missingData", async (t) => {
	// GIVEN
	const allResults = [
		{
			created: "2017-07-04 12:00:00.000Z",
			nodeId: 123,
			sourceId: "test-source",
			val: 0,
		},
		{
			created: "2017-07-04 13:00:00.000Z",
			nodeId: 123,
			sourceId: "test-source",
			val: 1,
		},
	];

	const http = t.context.agent.get(BASE_URL);
	http.intercept({
		path: "/solarquery/api/v1/pub/datum/list?nodeId=123&sourceId=test-source&startDate=2017-04-01T12%3A00&endDate=2017-05-01T12%3A00&aggregation=Hour&withoutTotalResultsCount=true&max=2",
		method: "GET",
	}).reply(200, {
		success: true,
		data: {
			totalResults: null,
			startingOffset: 0,
			returnedResultCount: 2,
			results: allResults.slice(0, 2),
		},
	});
	http.intercept({
		path: "/solarquery/api/v1/pub/datum/list?nodeId=123&sourceId=test-source&startDate=2017-04-01T12%3A00&endDate=2017-05-01T12%3A00&aggregation=Hour&withoutTotalResultsCount=true&max=2&offset=2",
		method: "GET",
	}).reply(200, {
		success: true,
	});

	// WHEN
	const filter = testFilter();
	const loader = new DatumLoader(t.context.api, filter).paginationSize(2);

	const results = await loader.fetch();

	// THEN
	t.deepEqual(results, allResults);
});

test.serial("load:parallel:multiPage:missingData", async (t) => {
	// GIVEN
	const allResults = [
		{
			created: "2017-07-04 12:00:00.000Z",
			nodeId: 123,
			sourceId: "test-source",
			val: 0,
		},
		{
			created: "2017-07-04 13:00:00.000Z",
			nodeId: 123,
			sourceId: "test-source",
			val: 1,
		},
		{
			created: "2017-07-04 14:00:00.000Z",
			nodeId: 123,
			sourceId: "test-source",
			val: 0,
		},
		{
			created: "2017-07-04 15:00:00.000Z",
			nodeId: 123,
			sourceId: "test-source",
			val: 1,
		},
		{
			created: "2017-07-04 16:00:00.000Z",
			nodeId: 123,
			sourceId: "test-source",
			val: 0,
		},
	];

	const http = t.context.agent.get(BASE_URL);
	http.intercept({
		path: "/solarquery/api/v1/pub/datum/list?nodeId=123&sourceId=test-source&startDate=2017-04-01T12%3A00&endDate=2017-05-01T12%3A00&aggregation=Hour&withoutTotalResultsCount=false&max=2",
		method: "GET",
	}).reply(200, {
		success: true,
		data: {
			totalResults: 6,
			startingOffset: 0,
			returnedResultCount: 2,
			results: allResults.slice(0, 2),
		},
	});
	http.intercept({
		path: "/solarquery/api/v1/pub/datum/list?nodeId=123&sourceId=test-source&startDate=2017-04-01T12%3A00&endDate=2017-05-01T12%3A00&aggregation=Hour&withoutTotalResultsCount=true&max=2&offset=2",
		method: "GET",
	}).reply(200, {
		success: true,
	});
	http.intercept({
		path: "/solarquery/api/v1/pub/datum/list?nodeId=123&sourceId=test-source&startDate=2017-04-01T12%3A00&endDate=2017-05-01T12%3A00&aggregation=Hour&withoutTotalResultsCount=true&max=2&offset=4",
		method: "GET",
	}).reply(200, {
		success: true,
		data: {
			totalResults: null,
			startingOffset: 4,
			returnedResultCount: 1,
			results: allResults.slice(4, 5),
		},
	});

	// WHEN
	const filter = testFilter();
	const loader = new DatumLoader(t.context.api, filter)
		.paginationSize(2)
		.concurrency(Infinity);

	const error = await t.throwsAsync(() => {
		return loader.fetch();
	});

	// THEN
	t.is(loader.concurrency(), Infinity);
	t.is(
		error.message,
		`One or more requests did not return a result, but no error was reported.`
	);
});

test.serial("load:parallel:multiPage:missingDataResult", async (t) => {
	// GIVEN
	const allResults = [
		{
			created: "2017-07-04 12:00:00.000Z",
			nodeId: 123,
			sourceId: "test-source",
			val: 0,
		},
		{
			created: "2017-07-04 13:00:00.000Z",
			nodeId: 123,
			sourceId: "test-source",
			val: 1,
		},
		{
			created: "2017-07-04 14:00:00.000Z",
			nodeId: 123,
			sourceId: "test-source",
			val: 0,
		},
		{
			created: "2017-07-04 15:00:00.000Z",
			nodeId: 123,
			sourceId: "test-source",
			val: 1,
		},
		{
			created: "2017-07-04 16:00:00.000Z",
			nodeId: 123,
			sourceId: "test-source",
			val: 0,
		},
	];

	const http = t.context.agent.get(BASE_URL);
	http.intercept({
		path: "/solarquery/api/v1/pub/datum/list?nodeId=123&sourceId=test-source&startDate=2017-04-01T12%3A00&endDate=2017-05-01T12%3A00&aggregation=Hour&withoutTotalResultsCount=false&max=2",
		method: "GET",
	}).reply(200, {
		success: true,
		data: {
			totalResults: 6,
			startingOffset: 0,
			returnedResultCount: 2,
			results: allResults.slice(0, 2),
		},
	});
	http.intercept({
		path: "/solarquery/api/v1/pub/datum/list?nodeId=123&sourceId=test-source&startDate=2017-04-01T12%3A00&endDate=2017-05-01T12%3A00&aggregation=Hour&withoutTotalResultsCount=true&max=2&offset=2",
		method: "GET",
	}).reply(200, {
		success: true,
	});
	http.intercept({
		path: "/solarquery/api/v1/pub/datum/list?nodeId=123&sourceId=test-source&startDate=2017-04-01T12%3A00&endDate=2017-05-01T12%3A00&aggregation=Hour&withoutTotalResultsCount=true&max=2&offset=4",
		method: "GET",
	}).reply(200, {
		success: true,
		data: {
			totalResults: null,
			startingOffset: 4,
			returnedResultCount: 1,
			results: allResults.slice(4, 5),
		},
	});

	// WHEN
	const filter = testFilter();
	const loader = new DatumLoader(t.context.api, filter)
		.paginationSize(2)
		.concurrency(Infinity);

	const error = await t.throwsAsync(() => {
		return loader.fetch();
	});

	// THEN
	t.is(
		error.message,
		`One or more requests did not return a result, but no error was reported.`
	);
});

test.serial("load:parallel:multiPage:gapData", async (t) => {
	// GIVEN
	const allResults = [
		{
			created: "2017-07-04 12:00:00.000Z",
			nodeId: 123,
			sourceId: "test-source",
			val: 0,
		},
		{
			created: "2017-07-04 13:00:00.000Z",
			nodeId: 123,
			sourceId: "test-source",
			val: 1,
		},
		{
			created: "2017-07-04 14:00:00.000Z",
			nodeId: 123,
			sourceId: "test-source",
			val: 0,
		},
		{
			created: "2017-07-04 15:00:00.000Z",
			nodeId: 123,
			sourceId: "test-source",
			val: 1,
		},
		{
			created: "2017-07-04 16:00:00.000Z",
			nodeId: 123,
			sourceId: "test-source",
			val: 0,
		},
	];

	const http = t.context.agent.get(BASE_URL);
	http.intercept({
		path: "/solarquery/api/v1/pub/datum/list?nodeId=123&sourceId=test-source&startDate=2017-04-01T12%3A00&endDate=2017-05-01T12%3A00&aggregation=Hour&withoutTotalResultsCount=false&max=2",
		method: "GET",
	}).reply(200, {
		success: true,
		data: {
			totalResults: 6,
			startingOffset: 0,
			returnedResultCount: 2,
			results: allResults.slice(0, 2),
		},
	});
	http.intercept({
		path: "/solarquery/api/v1/pub/datum/list?nodeId=123&sourceId=test-source&startDate=2017-04-01T12%3A00&endDate=2017-05-01T12%3A00&aggregation=Hour&withoutTotalResultsCount=true&max=2&offset=2",
		method: "GET",
	}).reply(200, {
		success: true,
		data: {
			totalResults: null,
			startingOffset: 2,
			returnedResultCount: 0,
		},
	});
	http.intercept({
		path: "/solarquery/api/v1/pub/datum/list?nodeId=123&sourceId=test-source&startDate=2017-04-01T12%3A00&endDate=2017-05-01T12%3A00&aggregation=Hour&withoutTotalResultsCount=true&max=2&offset=4",
		method: "GET",
	}).reply(200, {
		success: true,
		data: {
			totalResults: null,
			startingOffset: 4,
			returnedResultCount: 1,
			results: allResults.slice(4, 5),
		},
	});

	// WHEN
	const filter = testFilter();
	const loader = new DatumLoader(t.context.api, filter)
		.paginationSize(2)
		.concurrency(Infinity);

	const results = await loader.fetch();

	// THEN
	t.deepEqual(results, allResults.slice(0, 2).concat(allResults.slice(4, 5)));
});

test.serial("load:parallel:multiPage:gapDataFirstPage", async (t) => {
	// GIVEN
	const allResults = [
		{
			created: "2017-07-04 12:00:00.000Z",
			nodeId: 123,
			sourceId: "test-source",
			val: 0,
		},
		{
			created: "2017-07-04 13:00:00.000Z",
			nodeId: 123,
			sourceId: "test-source",
			val: 1,
		},
		{
			created: "2017-07-04 14:00:00.000Z",
			nodeId: 123,
			sourceId: "test-source",
			val: 0,
		},
		{
			created: "2017-07-04 15:00:00.000Z",
			nodeId: 123,
			sourceId: "test-source",
			val: 1,
		},
		{
			created: "2017-07-04 16:00:00.000Z",
			nodeId: 123,
			sourceId: "test-source",
			val: 0,
		},
	];

	const http = t.context.agent.get(BASE_URL);
	http.intercept({
		path: "/solarquery/api/v1/pub/datum/list?nodeId=123&sourceId=test-source&startDate=2017-04-01T12%3A00&endDate=2017-05-01T12%3A00&aggregation=Hour&withoutTotalResultsCount=false&max=2",
		method: "GET",
	}).reply(200, {
		success: true,
		data: {
			totalResults: 6,
			startingOffset: 0,
			returnedResultCount: 2,
			results: [],
		},
	});
	http.intercept({
		path: "/solarquery/api/v1/pub/datum/list?nodeId=123&sourceId=test-source&startDate=2017-04-01T12%3A00&endDate=2017-05-01T12%3A00&aggregation=Hour&withoutTotalResultsCount=true&max=2&offset=2",
		method: "GET",
	}).reply(200, {
		success: true,
		data: {
			totalResults: null,
			startingOffset: 2,
			returnedResultCount: 2,
			results: allResults.slice(0, 2),
		},
	});
	http.intercept({
		path: "/solarquery/api/v1/pub/datum/list?nodeId=123&sourceId=test-source&startDate=2017-04-01T12%3A00&endDate=2017-05-01T12%3A00&aggregation=Hour&withoutTotalResultsCount=true&max=2&offset=4",
		method: "GET",
	}).reply(200, {
		success: true,
		data: {
			totalResults: null,
			startingOffset: 4,
			returnedResultCount: 2,
			results: allResults.slice(2, 4),
		},
	});

	// WHEN
	const filter = testFilter();
	const loader = new DatumLoader(t.context.api, filter)
		.paginationSize(2)
		.concurrency(Infinity);

	const results = await loader.fetch();

	// THEN
	t.is(loader.includeTotalResultsCount(), false);
	t.deepEqual(results, allResults.slice(0, 4));
});

test.serial("load:proxy:multiPage:parallel", (t) => {
	const http = t.context.agent.get("https://query-proxy");
	const allResults = [
		{
			created: "2017-07-04 12:00:00.000Z",
			nodeId: 123,
			sourceId: "test-source",
			val: 0,
		},
		{
			created: "2017-07-04 13:00:00.000Z",
			nodeId: 123,
			sourceId: "test-source",
			val: 1,
		},
		{
			created: "2017-07-04 14:00:00.000Z",
			nodeId: 123,
			sourceId: "test-source",
			val: 0,
		},
		{
			created: "2017-07-04 15:00:00.000Z",
			nodeId: 123,
			sourceId: "test-source",
			val: 1,
		},
		{
			created: "2017-07-04 16:00:00.000Z",
			nodeId: 123,
			sourceId: "test-source",
			val: 0,
		},
		{
			created: "2017-07-04 17:00:00.000Z",
			nodeId: 123,
			sourceId: "test-source",
			val: 1,
		},
	];
	// expect 3 page queries: one for first page and total result count, 2 more for remaining pages
	http.intercept({
		path: "/path/solarquery/api/v1/pub/datum/list?nodeId=123&sourceId=test-source&startDate=2017-04-01T12%3A00&endDate=2017-05-01T12%3A00&aggregation=Hour&withoutTotalResultsCount=false&max=2",
		method: "GET",
	}).reply(200, {
		success: true,
		data: {
			totalResults: 6,
			startingOffset: 0,
			returnedResultCount: 2,
			results: allResults.slice(0, 2),
		},
	});
	http.intercept({
		path: "/path/solarquery/api/v1/pub/datum/list?nodeId=123&sourceId=test-source&startDate=2017-04-01T12%3A00&endDate=2017-05-01T12%3A00&aggregation=Hour&withoutTotalResultsCount=true&max=2&offset=2",
		method: "GET",
	}).reply(200, {
		success: true,
		data: {
			totalResults: null,
			startingOffset: 2,
			returnedResultCount: 2,
			results: allResults.slice(2, 4),
		},
	});
	http.intercept({
		path: "/path/solarquery/api/v1/pub/datum/list?nodeId=123&sourceId=test-source&startDate=2017-04-01T12%3A00&endDate=2017-05-01T12%3A00&aggregation=Hour&withoutTotalResultsCount=true&max=2&offset=4",
		method: "GET",
	}).reply(200, {
		success: true,
		data: {
			totalResults: null,
			startingOffset: 4,
			returnedResultCount: 2,
			results: allResults.slice(4, 6),
		},
	});

	const proxyUrl = "https://query-proxy/path";
	const filter = testFilter();
	const loader = new DatumLoader(t.context.api, filter)
		.proxyUrl(proxyUrl)
		.paginationSize(2)
		.concurrency(Infinity)
		.includeTotalResultsCount(true);
	t.truthy(loader);
	t.is(loader.proxyUrl(), proxyUrl);
	t.is(loader.includeTotalResultsCount(), true);

	return new Promise((resolve, reject) => {
		loader.load((error, results) => {
			try {
				t.falsy(error, "No error generated.");
				t.deepEqual(results, allResults, "All pages returned.");
				resolve();
			} catch (error) {
				reject(error);
			}
		});
	});
});

test.serial("load:proxy:multiPage:parallel:oneRequestReturnsNoData", (t) => {
	const http = t.context.agent.get("https://query-proxy");
	// expect 3 page queries, but 2nd fails to respond
	http.intercept({
		path: "/path/solarquery/api/v1/pub/datum/list?nodeId=123&sourceId=test-source&startDate=2017-04-01T12%3A00&endDate=2017-05-01T12%3A00&aggregation=Hour&withoutTotalResultsCount=false&max=2",
		method: "GET",
	}).reply(200, {
		success: true,
		data: {
			totalResults: 6,
			startingOffset: 0,
			returnedResultCount: 2,
			results: [
				{
					created: "2017-07-04 12:00:00.000Z",
					nodeId: 123,
					sourceId: "test-source",
					val: 0,
				},
				{
					created: "2017-07-04 13:00:00.000Z",
					nodeId: 123,
					sourceId: "test-source",
					val: 1,
				},
			],
		},
	});
	http.intercept({
		path: "/path/solarquery/api/v1/pub/datum/list?nodeId=123&sourceId=test-source&startDate=2017-04-01T12%3A00&endDate=2017-05-01T12%3A00&aggregation=Hour&withoutTotalResultsCount=true&max=2&offset=2",
		method: "GET",
	}).reply(200, {});
	http.intercept({
		path: "/path/solarquery/api/v1/pub/datum/list?nodeId=123&sourceId=test-source&startDate=2017-04-01T12%3A00&endDate=2017-05-01T12%3A00&aggregation=Hour&withoutTotalResultsCount=true&max=2&offset=4",
		method: "GET",
	}).reply(200, {
		success: true,
		data: {
			totalResults: null,
			startingOffset: 4,
			returnedResultCount: 2,
			results: [
				{
					created: "2017-07-04 16:00:00.000Z",
					nodeId: 123,
					sourceId: "test-source",
					val: 0,
				},
				{
					created: "2017-07-04 17:00:00.000Z",
					nodeId: 123,
					sourceId: "test-source",
					val: 1,
				},
			],
		},
	});

	const filter = testFilter();
	const loader = new DatumLoader(t.context.api, filter)
		.proxyUrl("https://query-proxy/path")
		.paginationSize(2)
		.concurrency(Infinity)
		.includeTotalResultsCount(true);
	t.truthy(loader);

	return new Promise((resolve, reject) => {
		loader.load((error, results) => {
			try {
				t.truthy(error);
				t.is(
					error!.message,
					"Error requesting data for https://query-proxy/path/solarquery/api/v1/pub/datum/list?nodeId=123&sourceId=test-source&startDate=2017-04-01T12%3A00&endDate=2017-05-01T12%3A00&aggregation=Hour&withoutTotalResultsCount=true&max=2&offset=2: non-success result returned"
				);
				t.truthy(results);
				resolve();
			} catch (error) {
				reject(error);
			}
		});
	});
});
