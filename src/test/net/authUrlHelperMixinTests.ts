import test from "ava";

import AuthUrlHelperMixin from "../../main/net/authUrlHelperMixin.js";
import UrlHelper from "../../main/net/urlHelper.js";

class TestUrlHelper extends AuthUrlHelperMixin(UrlHelper) {}

test("net:user:userUrlHelperMixin:whoamiUrl", (t) => {
	const helper = new TestUrlHelper();
	t.is(helper.whoamiUrl(), "https://data.solarnetwork.net/whoami");
});
