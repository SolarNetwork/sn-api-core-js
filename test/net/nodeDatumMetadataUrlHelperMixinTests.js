import test from 'ava';

import Pagination from 'domain/pagination';
import SortDescriptor from 'domain/sortDescriptor';

import { NodeDatumMetadataUrlHelper } from 'net/nodeDatumMetadataUrlHelperMixin'

test('core:net:nodeDatumMetadataUrlHelperMixin:create', t => {
	const helper = new NodeDatumMetadataUrlHelper();
	t.truthy(helper);
});

test('core:net:nodeDatumMetadataUrlHelperMixin:viewNodeDatumMetadataUrl:empty', t => {
    const helper = new NodeDatumMetadataUrlHelper();
    const result = helper.viewNodeDatumMetadataUrl();
	t.is(result, 'https://data.solarnetwork.net/solarquery/api/v1/sec/datum/meta/null');
});

test('core:net:nodeDatumMetadataUrlHelperMixin:viewNodeDatumMetadataUrl:nodeIdParam', t => {
	const helper = new NodeDatumMetadataUrlHelper();
	helper.nodeId = 123;
    const result = helper.viewNodeDatumMetadataUrl();
	t.is(result, 'https://data.solarnetwork.net/solarquery/api/v1/sec/datum/meta/123');
});

test('core:net:nodeDatumMetadataUrlHelperMixin:viewNodeDatumMetadataUrl:nodeIdArgOverrideParam', t => {
	const helper = new NodeDatumMetadataUrlHelper();
	helper.nodeId = 123;
    const result = helper.viewNodeDatumMetadataUrl(234);
	t.is(result, 'https://data.solarnetwork.net/solarquery/api/v1/sec/datum/meta/234');
});

test('core:net:nodeDatumMetadataUrlHelperMixin:viewNodeDatumMetadataUrl:sourceIdParam', t => {
	const helper = new NodeDatumMetadataUrlHelper();
	helper.sourceId = 'foo';
    const result = helper.viewNodeDatumMetadataUrl();
	t.is(result, 'https://data.solarnetwork.net/solarquery/api/v1/sec/datum/meta/null?sourceId=foo');
});

test('core:net:nodeDatumMetadataUrlHelperMixin:viewNodeDatumMetadataUrl:nodeAndSourceIdParams', t => {
	const helper = new NodeDatumMetadataUrlHelper();
	helper.nodeId = 123;
	helper.sourceId = 'foo';
    const result = helper.viewNodeDatumMetadataUrl();
	t.is(result, 'https://data.solarnetwork.net/solarquery/api/v1/sec/datum/meta/123?sourceId=foo');
});

test('core:net:nodeDatumMetadataUrlHelperMixin:viewNodeDatumMetadataUrl:sourceIdArgOverrideParam', t => {
	const helper = new NodeDatumMetadataUrlHelper();
	helper.sourceId = 'foo';
    const result = helper.viewNodeDatumMetadataUrl(123, 'bar');
	t.is(result, 'https://data.solarnetwork.net/solarquery/api/v1/sec/datum/meta/123?sourceId=bar');
});

test('core:net:nodeDatumMetadataUrlHelperMixin:viewNodeDatumMetadataUrl:sourceIdArgNullOverrideParam', t => {
	const helper = new NodeDatumMetadataUrlHelper();
	helper.sourceId = 'foo';
    const result = helper.viewNodeDatumMetadataUrl(123, null);
	t.is(result, 'https://data.solarnetwork.net/solarquery/api/v1/sec/datum/meta/123');
});

test('core:net:nodeDatumMetadataUrlHelperMixin:addNodeDatumMetadataUrl:nodeIdSourceIdArgs', t => {
	const helper = new NodeDatumMetadataUrlHelper();
    const result = helper.addNodeDatumMetadataUrl(123, 'bar');
	t.is(result, 'https://data.solarnetwork.net/solarquery/api/v1/sec/datum/meta/123?sourceId=bar');
});


test('core:net:nodeDatumMetadataUrlHelperMixin:replaceNodeDatumMetadataUrl:nodeIdSourceIdArgs', t => {
	const helper = new NodeDatumMetadataUrlHelper();
    const result = helper.replaceNodeDatumMetadataUrl(123, 'bar');
	t.is(result, 'https://data.solarnetwork.net/solarquery/api/v1/sec/datum/meta/123?sourceId=bar');
});

test('core:net:nodeDatumMetadataUrlHelperMixin:deleteNodeDatumMetadataUrl:nodeIdSourceIdArgs', t => {
	const helper = new NodeDatumMetadataUrlHelper();
    const result = helper.deleteNodeDatumMetadataUrl(123, 'bar');
	t.is(result, 'https://data.solarnetwork.net/solarquery/api/v1/sec/datum/meta/123?sourceId=bar');
});

test('core:net:nodeDatumMetadataUrlHelperMixin:findNodeDatumMetadataUrl:sorted', t => {
	const helper = new NodeDatumMetadataUrlHelper();
	t.is(helper.findNodeDatumMetadataUrl(123, 'foo', [new SortDescriptor('bar')]),
		'https://data.solarnetwork.net/solarquery/api/v1/sec/datum/meta/123?'
		+'sourceId=foo&sorts%5B0%5D.key=bar');
	t.is(helper.findNodeDatumMetadataUrl(123, 'foo', [new SortDescriptor('bar', true)]),
		'https://data.solarnetwork.net/solarquery/api/v1/sec/datum/meta/123?'
		+'sourceId=foo&sorts%5B0%5D.key=bar&sorts%5B0%5D.descending=true');
});

test('core:net:nodeDatumMetadataUrlHelperMixin:findNodeDatumMetadataUrl:paginated', t => {
	const helper = new NodeDatumMetadataUrlHelper();
	t.is(helper.findNodeDatumMetadataUrl(123, 'foo', null, new Pagination(1, 2)),
		'https://data.solarnetwork.net/solarquery/api/v1/sec/datum/meta/123?'
		+'sourceId=foo&max=1&offset=2');
});

test('core:net:nodeDatumMetadataUrlHelperMixin:findNodeDatumMetadataUrl:sortedAndPaginated', t => {
	const helper = new NodeDatumMetadataUrlHelper();
	t.is(helper.findNodeDatumMetadataUrl(123, 'foo', [new SortDescriptor('bar')], new Pagination(1, 2)),
		'https://data.solarnetwork.net/solarquery/api/v1/sec/datum/meta/123?'
		+'sourceId=foo&sorts%5B0%5D.key=bar&max=1&offset=2');
});
