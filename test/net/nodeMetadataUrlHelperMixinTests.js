import test from 'ava';

import Pagination from 'pagination';
import SortDescriptor from 'sortDescriptor';

import { NodeMetadataUrlHelper } from 'net/nodeMetadataUrlHelperMixin'

test('user:nodeMetadataUrlHelperMixin:create', t => {
	const helper = new NodeMetadataUrlHelper();
	t.truthy(helper);
});

test('user:nodeUrlHelperMixin:viewNodeMetadataUrl', t => {
	const helper = new NodeMetadataUrlHelper();
	helper.nodeId = 123;
	t.is(helper.viewNodeMetadataUrl(), 
		'https://data.solarnetwork.net/solaruser/api/v1/sec/nodes/meta/123');
	t.is(helper.viewNodeMetadataUrl(234), 
		'https://data.solarnetwork.net/solaruser/api/v1/sec/nodes/meta/234');
});

test('user:nodeUrlHelperMixin:addNodeMetadataUrl', t => {
	const helper = new NodeMetadataUrlHelper();
	helper.nodeId = 123;
	t.is(helper.addNodeMetadataUrl(), 
		'https://data.solarnetwork.net/solaruser/api/v1/sec/nodes/meta/123');
	t.is(helper.addNodeMetadataUrl(234), 
		'https://data.solarnetwork.net/solaruser/api/v1/sec/nodes/meta/234');
});

test('user:nodeUrlHelperMixin:replaceNodeMetadataUrl', t => {
	const helper = new NodeMetadataUrlHelper();
	helper.nodeId = 123;
	t.is(helper.replaceNodeMetadataUrl(), 
		'https://data.solarnetwork.net/solaruser/api/v1/sec/nodes/meta/123');
	t.is(helper.replaceNodeMetadataUrl(234), 
		'https://data.solarnetwork.net/solaruser/api/v1/sec/nodes/meta/234');
});

test('user:nodeUrlHelperMixin:deleteNodeMetadataUrl', t => {
	const helper = new NodeMetadataUrlHelper();
	helper.nodeId = 123;
	t.is(helper.deleteNodeMetadataUrl(), 
		'https://data.solarnetwork.net/solaruser/api/v1/sec/nodes/meta/123');
	t.is(helper.deleteNodeMetadataUrl(234), 
		'https://data.solarnetwork.net/solaruser/api/v1/sec/nodes/meta/234');
});

test('user:nodeUrlHelperMixin:findNodeMetadataUrl', t => {
	const helper = new NodeMetadataUrlHelper();
	helper.nodeId = 123;
	t.is(helper.findNodeMetadataUrl(),
		'https://data.solarnetwork.net/solaruser/api/v1/sec/nodes/meta?nodeIds=123');
	t.is(helper.findNodeMetadataUrl(234),
		'https://data.solarnetwork.net/solaruser/api/v1/sec/nodes/meta?nodeIds=234');
	t.is(helper.findNodeMetadataUrl([123,234]),
		'https://data.solarnetwork.net/solaruser/api/v1/sec/nodes/meta?nodeIds=123,234');
	t.is(helper.findNodeMetadataUrl(null),
		'https://data.solarnetwork.net/solaruser/api/v1/sec/nodes/meta');
});

test('user:nodeUrlHelperMixin:findNodeMetadataUrl:sorted', t => {
	const helper = new NodeMetadataUrlHelper();
	helper.nodeId = 123;
	t.is(helper.findNodeMetadataUrl(234, [new SortDescriptor('foo')]),
		'https://data.solarnetwork.net/solaruser/api/v1/sec/nodes/meta?'
		+'nodeIds=234&sortDescriptors%5B0%5D.key=foo');
	t.is(helper.findNodeMetadataUrl(234, [new SortDescriptor('foo', true)]),
		'https://data.solarnetwork.net/solaruser/api/v1/sec/nodes/meta?'
		+'nodeIds=234&sortDescriptors%5B0%5D.key=foo&sortDescriptors%5B0%5D.descending=true');
});

test('user:nodeUrlHelperMixin:findNodeMetadataUrl:paginated', t => {
	const helper = new NodeMetadataUrlHelper();
	helper.nodeId = 123;
	t.is(helper.findNodeMetadataUrl(234, null, new Pagination(1, 2)),
		'https://data.solarnetwork.net/solaruser/api/v1/sec/nodes/meta?'
		+'nodeIds=234&max=1&offset=2');
});

test('user:nodeUrlHelperMixin:findNodeMetadataUrl:sortedAndPaginated', t => {
	const helper = new NodeMetadataUrlHelper();
	helper.nodeId = 123;
	t.is(helper.findNodeMetadataUrl(234, [new SortDescriptor('foo')], new Pagination(1, 2)),
		'https://data.solarnetwork.net/solaruser/api/v1/sec/nodes/meta?'
		+'nodeIds=234&sortDescriptors%5B0%5D.key=foo&max=1&offset=2');
});
