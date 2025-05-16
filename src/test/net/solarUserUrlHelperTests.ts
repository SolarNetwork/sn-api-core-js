import test from "ava";

import {
	default as UserUrlHelper,
	SolarUserPathKey,
} from "../../main/net/solarUserUrlHelper.js";

test("create", (t) => {
	const helper = new UserUrlHelper();
	t.truthy(helper);
});

test("baseUrl", (t) => {
	const helper = new UserUrlHelper();
	t.is(
		helper.baseUrl(),
		"https://data.solarnetwork.net/solaruser/api/v1/sec"
	);
});

test("baseUrl:customEnvironment", (t) => {
	const env = {} as any;
	env[SolarUserPathKey] = "/foouser";
	const helper = new UserUrlHelper(env);
	t.is(helper.baseUrl(), "https://data.solarnetwork.net/foouser/api/v1/sec");
});

test("listAllNodeIdsUrl", (t) => {
	const helper = new UserUrlHelper();
	t.is(
		helper.whoamiUrl(),
		"https://data.solarnetwork.net/solaruser/api/v1/sec/whoami"
	);
});

test("viewNodeMetadataUrl", (t) => {
	const helper = new UserUrlHelper();
	t.is(
		helper.viewNodeMetadataUrl(123),
		"https://data.solarnetwork.net/solaruser/api/v1/sec/nodes/meta/123"
	);
});
