import test from "ava";

import { dateFormat } from "../../main/util/dates.js";
import AuthTokenUrlHelperMixin from "../../main/net/authTokenUrlHelperMixin.js";
import Environment from "../../main/net/environment.js";
import UrlHelper from "../../main/net/urlHelper.js";

class TestUrlHelper extends AuthTokenUrlHelperMixin(UrlHelper) {}

test("create", (t) => {
	const helper = new TestUrlHelper();
	t.truthy(helper);
	t.is(helper.baseUrl(), "https://data.solarnetwork.net");
});

test("create:env", (t) => {
	const env = new Environment({ host: "example.com" });
	const helper = new TestUrlHelper(env);
	t.truthy(helper);
	t.is(helper.baseUrl(), "https://example.com");
});

test("refreshV2Url", (t) => {
	const helper = new TestUrlHelper();
	const date = new Date("1970-01-01");
	t.is(
		helper.refreshTokenV2Url(date),
		"https://data.solarnetwork.net/auth-tokens/refresh/v2?date=1970-01-01"
	);
});

test("refreshV2Url:today", (t) => {
	const helper = new TestUrlHelper();
	const expectedDateParam = dateFormat(new Date());
	t.is(
		helper.refreshTokenV2Url(),
		`https://data.solarnetwork.net/auth-tokens/refresh/v2?date=${expectedDateParam}`
	);
});
