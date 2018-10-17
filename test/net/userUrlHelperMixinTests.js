import test from 'ava';

import UrlHelper from 'net/urlHelper';
import NodeUrlHelperMixin from 'net/nodeUrlHelperMixin'
import UserUrlHelperMixin from 'net/userUrlHelperMixin'

class UserUrlHelper extends UserUrlHelperMixin(UrlHelper) {

}

test('user:net:userUrlHelperMixin:create', t => {
	const helper = new UserUrlHelper();
	t.truthy(helper);
});

test('user:net:userUrlHelperMixin:userId', t => {
	const helper = new UserUrlHelper();
	helper.userId = 123;
	t.is(helper.userId, 123);
});

test('user:net:userUrlHelperMixin:userIds', t => {
    const helper = new UserUrlHelper();
	helper.userIds = [123, 234];
	t.is(helper.userId, 123);
	t.deepEqual(helper.userIds, [123, 234]);
});

test('user:net:userUrlHelperMixin:userIds:resetUserId', t => {
	const helper = new UserUrlHelper();
	helper.userIds = [123, 234];
	t.deepEqual(helper.userIds, [123, 234]);
	helper.userId = 456;
	t.deepEqual(helper.userIds, [456], 'userIds array reset to just userId');
});

test('net:user:userUrlHelperMixin:baseUrl', t => {
	const helper = new UserUrlHelper();
	t.is(helper.baseUrl(), 'https://data.solarnetwork.net/solaruser/api/v1/sec');
});

test('net:user:userUrlHelperMixin:whoamiUrl', t => {
	const helper = new UserUrlHelper();
	t.is(helper.whoamiUrl(), 'https://data.solarnetwork.net/solaruser/api/v1/sec/whoami');
});

test('net:user:userUrlHelperMixin:viewNodesUrl', t => {
	const helper = new UserUrlHelper();
	t.is(helper.viewNodesUrl(), 'https://data.solarnetwork.net/solaruser/api/v1/sec/nodes');
});

test('net:user:userUrlHelperMixin:viewPendingNodesUrl', t => {
	const helper = new UserUrlHelper();
	t.is(helper.viewPendingNodesUrl(), 'https://data.solarnetwork.net/solaruser/api/v1/sec/nodes/pending');
});

test('net:user:userUrlHelperMixin:viewArchivedNodesUrl', t => {
	const helper = new UserUrlHelper();
	t.is(helper.viewArchivedNodesUrl(), 'https://data.solarnetwork.net/solaruser/api/v1/sec/nodes/archived');
});

test('net:user:userUrlHelperMixin:nimAuthorizeUrl', t => {
	const helper = new UserUrlHelper();
	t.is(helper.nimAuthorizeUrl(), 'https://data.solarnetwork.net/solaruser/api/v1/sec/user/nim/authorize');
});

class UserNodeUrlHelper extends UserUrlHelperMixin(NodeUrlHelperMixin(UrlHelper)) {
	
}

test('net:user:userNodeUrlHelperMixin:baseUrl', t => {
	const helper = new UserNodeUrlHelper();
	t.is(helper.baseUrl(), 'https://data.solarnetwork.net/solaruser/api/v1/sec');
});

test('net:user:userNodeUrlHelperMixin:nodeId', t => {
	const helper = new UserNodeUrlHelper();
	helper.nodeId = 123;
	t.deepEqual(helper.nodeIds, [123]);
});

test('net:user:userUrlHelperMixin:updateNodeArchivedStatusUrl', t => {
	const helper = new UserNodeUrlHelper();
	helper.nodeId = 123;
	t.is(helper.updateNodeArchivedStatusUrl(), 
		'https://data.solarnetwork.net/solaruser/api/v1/sec/nodes/archived?'
		+'nodeIds=123&archived=false');
	t.is(helper.updateNodeArchivedStatusUrl(234), 
		'https://data.solarnetwork.net/solaruser/api/v1/sec/nodes/archived?'
		+'nodeIds=234&archived=false');
	t.is(helper.updateNodeArchivedStatusUrl([234, 456]), 
		'https://data.solarnetwork.net/solaruser/api/v1/sec/nodes/archived?'
		+'nodeIds=234,456&archived=false');
	t.is(helper.updateNodeArchivedStatusUrl(234, true), 
		'https://data.solarnetwork.net/solaruser/api/v1/sec/nodes/archived?'
		+'nodeIds=234&archived=true');
});
