import test from "ava";

import AuthTokenStatuses from "../../main/domain/authTokenStatus.js";
import AuthTokenTypes from "../../main/domain/authTokenType.js";
import UrlHelper from "../../main/net/urlHelper.js";
import UserAuthTokenUrlHelperMixin from "../../main/net/userAuthTokenUrlHelperMixin.js";

class UserAuthTokenUrlHelper extends UserAuthTokenUrlHelperMixin(UrlHelper) {}

test("create", (t) => {
	const helper = new UserAuthTokenUrlHelper();
	t.truthy(helper);
});

test("listAllTokensUrl", (t) => {
	const helper = new UserAuthTokenUrlHelper();
	t.is(
		helper.listAllAuthTokensUrl(),
		"https://data.solarnetwork.net/user/auth-tokens"
	);
});

test("generateAuthTokenUrl", (t) => {
	const helper = new UserAuthTokenUrlHelper();
	t.is(
		helper.generateAuthTokenUrl(AuthTokenTypes.User),
		"https://data.solarnetwork.net/user/auth-tokens/generate/User"
	);
});

test("deleteAuthTokenUrl", (t) => {
	const helper = new UserAuthTokenUrlHelper();
	t.is(
		helper.deleteAuthTokenUrl("foo^!bar"),
		"https://data.solarnetwork.net/user/auth-tokens/foo%5E!bar"
	);
});

test("updateAuthTokenSecurityPolicyUrl", (t) => {
	const helper = new UserAuthTokenUrlHelper();
	t.is(
		helper.updateAuthTokenSecurityPolicyUrl("foo^!bar"),
		"https://data.solarnetwork.net/user/auth-tokens/foo%5E!bar"
	);
});

test("replaceAuthTokenSecurityPolicyUrl", (t) => {
	const helper = new UserAuthTokenUrlHelper();
	t.is(
		helper.replaceAuthTokenSecurityPolicyUrl("foo^!bar"),
		"https://data.solarnetwork.net/user/auth-tokens/foo%5E!bar"
	);
});

test("updateAuthTokenStatusUrl", (t) => {
	const helper = new UserAuthTokenUrlHelper();
	t.is(
		helper.updateAuthTokenStatusUrl("foo^!bar", AuthTokenStatuses.Disabled),
		"https://data.solarnetwork.net/user/auth-tokens/foo%5E!bar?status=Disabled"
	);
});
