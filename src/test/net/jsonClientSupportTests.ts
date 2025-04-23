import anyTest, { TestFn } from "ava";
import { MockAgent, setGlobalDispatcher } from "undici";

import { default as log, LogLevel } from "../../main/util/logger.js";
import SolarQueryApi from "../../main/net/solarQueryUrlHelper.js";

import JsonClientSupport from "../../main/net/jsonClientSupport.js";

const test = anyTest as TestFn<{
	agent: MockAgent;
	api: SolarQueryApi;
}>;

log.level = LogLevel.DEBUG;

class TestClient extends JsonClientSupport<SolarQueryApi, any> {
	#url: string;
	#jitter?: number;

	constructor(api: SolarQueryApi, url: string, jitter?: number) {
		super(api);
		this.#url = url;
		this.#jitter = jitter;
	}

	/**
	 * Initiate loading the data.
	 *
	 * @returns a `Promise` for the final results
	 */
	fetch(): Promise<any> {
		return new Promise((resolve, reject) => {
			this.requestor(
				this.#url,
				undefined,
				this.#jitter
			)((error, results) => {
				if (error) {
					reject(error);
				} else {
					resolve(results || []);
				}
			});
		});
	}
}

test.beforeEach((t) => {
	const agent = new MockAgent();
	agent.disableNetConnect();
	setGlobalDispatcher(agent);
	t.context = {
		agent: agent,
		api: new SolarQueryApi({ protocol: "http", host: "localhost" }),
	};
});

test.serial("fetch:http404", async (t) => {
	// GIVEN
	const url = "http://localhost/foo";
	const http = t.context.agent.get("http://localhost");
	http.intercept({
		path: "/foo",
		method: "GET",
	}).reply(404);

	// WHEN
	const client = new TestClient(t.context.api, url);

	const error = await t.throwsAsync(() => {
		return client.fetch();
	});

	t.is(
		error.message,
		"Error requesting data for http://localhost/foo: Not Found"
	);
});

test.serial("fetch:jitter", async (t) => {
	// GIVEN
	const url = "http://localhost/foo";
	const http = t.context.agent.get("http://localhost");
	http.intercept({
		path: "/foo",
		method: "GET",
	}).reply(200, {
		success: true,
		data: "hi",
	});

	// WHEN
	const client = new TestClient(t.context.api, url, 1000);
	const start = new Date();
	const result = await client.fetch();
	const end = new Date();

	t.is(result, "hi", "Requested URL with delay returned data result.");
	t.true(
		end.getTime() - start.getTime() >= 1000,
		"At least delay ms has elapsed."
	);
});

test.serial("fetch:result:error:message", async (t) => {
	// GIVEN
	const url = "http://localhost/foo";
	const http = t.context.agent.get("http://localhost");
	http.intercept({
		path: "/foo",
		method: "GET",
	}).reply(200, {
		success: false,
		message: "boo",
	});

	// WHEN
	const client = new TestClient(t.context.api, url);

	const error = await t.throwsAsync(() => {
		return client.fetch();
	});

	t.is(
		error.message,
		"Error requesting data for http://localhost/foo: non-success result returned (boo)"
	);
});
