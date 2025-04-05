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

	constructor(api: SolarQueryApi, url: string) {
		super(api);
		this.#url = url;
	}

	/**
	 * Initiate loading the data.
	 *
	 * @returns a `Promise` for the final results
	 */
	fetch(): Promise<any> {
		return new Promise((resolve, reject) => {
			this.requestor(this.#url)((error, results) => {
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
