import test from "ava";

import UserMetadataUrlHelperMixin from "../../main/net/userMetadataUrlHelperMixin.js";
import {
	default as UserMetadataFilter,
	UserMetadataFilterKeys,
} from "../../main/domain/userMetadataFilter.js";
import UrlHelper from "../../main/net/urlHelper.js";

class UserMetadataUrlHelper extends UserMetadataUrlHelperMixin(UrlHelper) {}

test("create", (t) => {
	const helper = new UserMetadataUrlHelper();
	t.truthy(helper);
});

test("findUserMetadataUrl:noFilter", (t) => {
	const helper = new UserMetadataUrlHelper();
	const result = helper.findUserMetadataUrl(undefined as any);
	t.is(result, "https://data.solarnetwork.net/users/meta");
});

test("findUserMetadataUrl:userId", (t) => {
	const helper = new UserMetadataUrlHelper();
	const filter = new UserMetadataFilter();
	filter.userId = 123;
	const result = helper.findUserMetadataUrl(filter);
	t.is(result, "https://data.solarnetwork.net/users/meta?userId=123");
});

test("findUserMetadataUrl:userIds", (t) => {
	const helper = new UserMetadataUrlHelper();
	const filter = new UserMetadataFilter();
	filter.userIds = [123, 234];
	const result = helper.findUserMetadataUrl(filter);
	t.is(result, "https://data.solarnetwork.net/users/meta?userIds=123,234");
});

test("findUserMetadataUrl:tags", (t) => {
	const helper = new UserMetadataUrlHelper();
	const filter = new UserMetadataFilter();
	filter.tags = ["foo", "bar"];
	const result = helper.findUserMetadataUrl(filter);
	t.is(result, "https://data.solarnetwork.net/users/meta?tags=foo,bar");
});

test("findUserMetadataUrl:userIdsAndTags", (t) => {
	const helper = new UserMetadataUrlHelper();
	const filter = new UserMetadataFilter();
	filter.userIds = [123, 234];
	filter.tags = ["foo", "bar"];
	const result = helper.findUserMetadataUrl(filter);
	t.is(
		result,
		"https://data.solarnetwork.net/users/meta?userIds=123,234&tags=foo,bar"
	);
});

test("viewUserMetadataUrl:noUser", (t) => {
	const helper = new UserMetadataUrlHelper();
	const result = helper.viewUserMetadataUrl();
	t.is(result, "https://data.solarnetwork.net/users/meta");
});

test("viewUserMetadataUrl:emptyUsersArray", (t) => {
	const helper = new UserMetadataUrlHelper();
	helper.parameter(UserMetadataFilterKeys.UserId, []);
	const result = helper.viewUserMetadataUrl();
	t.is(result, "https://data.solarnetwork.net/users/meta");
});

test("viewUserMetadataUrl:helperUser", (t) => {
	const helper = new UserMetadataUrlHelper();
	helper.parameter(UserMetadataFilterKeys.UserId, 123);
	const result = helper.viewUserMetadataUrl();
	t.is(result, "https://data.solarnetwork.net/users/meta/123");
});

test("viewUserMetadataUrl:helperUsers", (t) => {
	const helper = new UserMetadataUrlHelper();
	helper.parameter(UserMetadataFilterKeys.UserIds, [123, 234]);
	const result = helper.viewUserMetadataUrl();
	t.is(result, "https://data.solarnetwork.net/users/meta/123");
});

test("viewUserMetadataUrl:argOverridesHelperUsers", (t) => {
	const helper = new UserMetadataUrlHelper();
	helper.parameter(UserMetadataFilterKeys.UserId, 123);
	const result = helper.viewUserMetadataUrl(234);
	t.is(result, "https://data.solarnetwork.net/users/meta/234");
});

test("viewUserMetadataUrl:argUsers", (t) => {
	const helper = new UserMetadataUrlHelper();
	const result = helper.viewUserMetadataUrl([123, 234] as any);
	t.is(result, "https://data.solarnetwork.net/users/meta/123");
});

test("viewUserMetadataUrl:argNull", (t) => {
	const helper = new UserMetadataUrlHelper();
	helper.parameter(UserMetadataFilterKeys.UserId, 123);
	const result = helper.viewUserMetadataUrl();
	t.is(result, "https://data.solarnetwork.net/users/meta/123");
});

test("addUserMetadataUrl", (t) => {
	const helper = new UserMetadataUrlHelper();
	helper.parameter(UserMetadataFilterKeys.UserId, 123);
	t.is(
		helper.addUserMetadataUrl(),
		"https://data.solarnetwork.net/users/meta/123"
	);
	t.is(
		helper.addUserMetadataUrl(234),
		"https://data.solarnetwork.net/users/meta/234"
	);
});

test("replaceUserMetadataUrl", (t) => {
	const helper = new UserMetadataUrlHelper();
	helper.parameter(UserMetadataFilterKeys.UserId, 123);
	t.is(
		helper.replaceUserMetadataUrl(),
		"https://data.solarnetwork.net/users/meta/123"
	);
	t.is(
		helper.replaceUserMetadataUrl(234),
		"https://data.solarnetwork.net/users/meta/234"
	);
});

test("deleteUserMetadataUrl", (t) => {
	const helper = new UserMetadataUrlHelper();
	helper.parameter(UserMetadataFilterKeys.UserId, 123);
	t.is(
		helper.deleteUserMetadataUrl(),
		"https://data.solarnetwork.net/users/meta/123"
	);
	t.is(
		helper.deleteUserMetadataUrl(234),
		"https://data.solarnetwork.net/users/meta/234"
	);
});
