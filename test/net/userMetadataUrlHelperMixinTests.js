import test from 'ava';

import { UserMetadataUrlHelper } from 'net/userMetadataUrlHelperMixin'
import UserMetadataFilter from 'domain/userMetadataFilter'

test('user:net:userMetadataUrlHelperMixin:create', t => {
	const helper = new UserMetadataUrlHelper();
	t.truthy(helper);
});

test('user:net:userMetadataUrlHelperMixin:findUserMetadataUrl:noFilter', t => {
	const helper = new UserMetadataUrlHelper();
	const result = helper.findUserMetadataUrl();
	t.is(result, 'https://data.solarnetwork.net/solaruser/api/v1/sec/users/meta');
});

test('user:net:userMetadataUrlHelperMixin:findUserMetadataUrl:userId', t => {
	const helper = new UserMetadataUrlHelper();
	const filter = new UserMetadataFilter();
	filter.userId = 123;
	const result = helper.findUserMetadataUrl(filter);
	t.is(result, 'https://data.solarnetwork.net/solaruser/api/v1/sec/users/meta?userId=123');
});

test('user:net:userMetadataUrlHelperMixin:findUserMetadataUrl:userIds', t => {
	const helper = new UserMetadataUrlHelper();
	const filter = new UserMetadataFilter();
	filter.userIds = [123,234];
	const result = helper.findUserMetadataUrl(filter);
	t.is(result, 'https://data.solarnetwork.net/solaruser/api/v1/sec/users/meta?userIds=123,234');
});

test('user:net:userMetadataUrlHelperMixin:findUserMetadataUrl:tags', t => {
	const helper = new UserMetadataUrlHelper();
	const filter = new UserMetadataFilter();
	filter.tags = ['foo', 'bar'];
	const result = helper.findUserMetadataUrl(filter);
	t.is(result, 'https://data.solarnetwork.net/solaruser/api/v1/sec/users/meta?tags=foo,bar');
});

test('user:net:userMetadataUrlHelperMixin:findUserMetadataUrl:userIdsAndTags', t => {
	const helper = new UserMetadataUrlHelper();
	const filter = new UserMetadataFilter();
	filter.userIds = [123, 234];
	filter.tags = ['foo', 'bar'];
	const result = helper.findUserMetadataUrl(filter);
	t.is(result, 'https://data.solarnetwork.net/solaruser/api/v1/sec/users/meta?userIds=123,234&tags=foo,bar');
});

test('user:net:userMetadataUrlHelperMixin:viewUserMetadataUrl:noUser', t => {
	const helper = new UserMetadataUrlHelper();
	const result = helper.viewUserMetadataUrl();
	t.is(result, 'https://data.solarnetwork.net/solaruser/api/v1/sec/users/meta');
});

test('user:net:userMetadataUrlHelperMixin:viewUserMetadataUrl:helperUser', t => {
	const helper = new UserMetadataUrlHelper();
	helper.userId = 123;
	const result = helper.viewUserMetadataUrl();
	t.is(result, 'https://data.solarnetwork.net/solaruser/api/v1/sec/users/meta/123');
});

test('user:net:userMetadataUrlHelperMixin:viewUserMetadataUrl:helperUsers', t => {
	const helper = new UserMetadataUrlHelper();
	helper.userIds = [123, 234];
	const result = helper.viewUserMetadataUrl();
	t.is(result, 'https://data.solarnetwork.net/solaruser/api/v1/sec/users/meta/123');
});

test('user:net:userMetadataUrlHelperMixin:viewUserMetadataUrl:argOverridesHelperUsers', t => {
	const helper = new UserMetadataUrlHelper();
	helper.userId = 123;
	const result = helper.viewUserMetadataUrl(234);
	t.is(result, 'https://data.solarnetwork.net/solaruser/api/v1/sec/users/meta/234');
});

test('user:net:userMetadataUrlHelperMixin:viewUserMetadataUrl:argUsers', t => {
	const helper = new UserMetadataUrlHelper();
	const result = helper.viewUserMetadataUrl([123, 234]);
	t.is(result, 'https://data.solarnetwork.net/solaruser/api/v1/sec/users/meta/123');
});

test('user:net:userMetadataUrlHelperMixin:viewUserMetadataUrl:argUsers', t => {
	const helper = new UserMetadataUrlHelper();
	helper.userId = 123;
	const result = helper.viewUserMetadataUrl(null);
	t.is(result, 'https://data.solarnetwork.net/solaruser/api/v1/sec/users/meta');
});

test('user:net:userMetadataUrlHelperMixin:addUserMetadataUrl', t => {
	const helper = new UserMetadataUrlHelper();
	helper.userId = 123;
	t.is(helper.addUserMetadataUrl(), 
		'https://data.solarnetwork.net/solaruser/api/v1/sec/users/meta/123');
	t.is(helper.addUserMetadataUrl(234), 
		'https://data.solarnetwork.net/solaruser/api/v1/sec/users/meta/234');
});

test('user:net:userMetadataUrlHelperMixin:replaceUserMetadataUrl', t => {
	const helper = new UserMetadataUrlHelper();
	helper.userId = 123;
	t.is(helper.replaceUserMetadataUrl(), 
		'https://data.solarnetwork.net/solaruser/api/v1/sec/users/meta/123');
	t.is(helper.replaceUserMetadataUrl(234), 
		'https://data.solarnetwork.net/solaruser/api/v1/sec/users/meta/234');
});

test('user:net:userMetadataUrlHelperMixin:deleteUserMetadataUrl', t => {
	const helper = new UserMetadataUrlHelper();
	helper.userId = 123;
	t.is(helper.deleteUserMetadataUrl(), 
		'https://data.solarnetwork.net/solaruser/api/v1/sec/users/meta/123');
	t.is(helper.deleteUserMetadataUrl(234), 
		'https://data.solarnetwork.net/solaruser/api/v1/sec/users/meta/234');
});