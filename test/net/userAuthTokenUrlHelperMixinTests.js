import test from 'ava';

import AuthTokenStatuses from 'domain/authTokenStatus';
import AuthTokenTypes from 'domain/authTokenType';
import { UserAuthTokenUrlHelper } from 'net/userAuthTokenUrlHelperMixin';

test('user:userAuthTokenUrlHelperMixin:create', t => {
	const helper = new UserAuthTokenUrlHelper();
	t.truthy(helper);
});

test('user:userAuthTokenUrlHelperMixin:listAllTokensUrl', t => {
	const helper = new UserAuthTokenUrlHelper();
	t.is(helper.listAllAuthTokensUrl(), 
		'https://data.solarnetwork.net/solaruser/api/v1/sec/user/auth-tokens');
});

test('user:userAuthTokenUrlHelperMixin:generateAuthTokenUrl', t => {
	const helper = new UserAuthTokenUrlHelper();
	t.is(helper.generateAuthTokenUrl(AuthTokenTypes.User), 
		'https://data.solarnetwork.net/solaruser/api/v1/sec/user/auth-tokens/generate/User');
});

test('user:userAuthTokenUrlHelperMixin:deleteAuthTokenUrl', t => {
	const helper = new UserAuthTokenUrlHelper();
	t.is(helper.deleteAuthTokenUrl('foo^!bar'), 
		'https://data.solarnetwork.net/solaruser/api/v1/sec/user/auth-tokens/foo%5E!bar');
});

test('user:userAuthTokenUrlHelperMixin:updateAuthTokenSecurityPolicyUrl', t => {
	const helper = new UserAuthTokenUrlHelper();
	t.is(helper.updateAuthTokenSecurityPolicyUrl('foo^!bar'), 
		'https://data.solarnetwork.net/solaruser/api/v1/sec/user/auth-tokens/foo%5E!bar');
});

test('user:userAuthTokenUrlHelperMixin:replaceAuthTokenSecurityPolicyUrl', t => {
	const helper = new UserAuthTokenUrlHelper();
	t.is(helper.replaceAuthTokenSecurityPolicyUrl('foo^!bar'), 
		'https://data.solarnetwork.net/solaruser/api/v1/sec/user/auth-tokens/foo%5E!bar');
});

test('user:userAuthTokenUrlHelperMixin:updateAuthTokenStatusUrl', t => {
	const helper = new UserAuthTokenUrlHelper();
	t.is(helper.updateAuthTokenStatusUrl('foo^!bar', AuthTokenStatuses.Disabled), 
		'https://data.solarnetwork.net/solaruser/api/v1/sec/user/auth-tokens/foo%5E!bar?status=Disabled');
});
