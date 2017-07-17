import test from 'ava';

import Pagination from 'pagination';
import SortDescriptor from 'sortDescriptor';

import { DatumMetadataUrlHelper } from 'net/datumMetadataUrlHelperMixin'

test('core:net:datumMetadataUrlHelperMixin:create', t => {
	const helper = new DatumMetadataUrlHelper();
	t.truthy(helper);
});

test('core:net:datumMetadataUrlHelperMixin:viewDatumMetadataUrl:empty', t => {
    const helper = new DatumMetadataUrlHelper();
    const result = helper.viewDatumMetadataUrl();
	t.is(result, 'https://data.solarnetwork.net/solarquery/api/v1/sec/datum/meta/null');
});

test('core:net:datumMetadataUrlHelperMixin:viewDatumMetadataUrl:nodeIdParam', t => {
	const helper = new DatumMetadataUrlHelper();
	helper.nodeId = 123;
    const result = helper.viewDatumMetadataUrl();
	t.is(result, 'https://data.solarnetwork.net/solarquery/api/v1/sec/datum/meta/123');
});

test('core:net:datumMetadataUrlHelperMixin:viewDatumMetadataUrl:nodeIdArgOverrideParam', t => {
	const helper = new DatumMetadataUrlHelper();
	helper.nodeId = 123;
    const result = helper.viewDatumMetadataUrl(234);
	t.is(result, 'https://data.solarnetwork.net/solarquery/api/v1/sec/datum/meta/234');
});

test('core:net:datumMetadataUrlHelperMixin:viewDatumMetadataUrl:sourceIdParam', t => {
	const helper = new DatumMetadataUrlHelper();
	helper.sourceId = 'foo';
    const result = helper.viewDatumMetadataUrl();
	t.is(result, 'https://data.solarnetwork.net/solarquery/api/v1/sec/datum/meta/null?sourceId=foo');
});

test('core:net:datumMetadataUrlHelperMixin:viewDatumMetadataUrl:nodeAndSourceIdParams', t => {
	const helper = new DatumMetadataUrlHelper();
	helper.nodeId = 123;
	helper.sourceId = 'foo';
    const result = helper.viewDatumMetadataUrl();
	t.is(result, 'https://data.solarnetwork.net/solarquery/api/v1/sec/datum/meta/123?sourceId=foo');
});

test('core:net:datumMetadataUrlHelperMixin:viewDatumMetadataUrl:sourceIdArgOverrideParam', t => {
	const helper = new DatumMetadataUrlHelper();
	helper.sourceId = 'foo';
    const result = helper.viewDatumMetadataUrl(123, 'bar');
	t.is(result, 'https://data.solarnetwork.net/solarquery/api/v1/sec/datum/meta/123?sourceId=bar');
});

test('core:net:datumMetadataUrlHelperMixin:viewDatumMetadataUrl:sourceIdArgNullOverrideParam', t => {
	const helper = new DatumMetadataUrlHelper();
	helper.sourceId = 'foo';
    const result = helper.viewDatumMetadataUrl(123, null);
	t.is(result, 'https://data.solarnetwork.net/solarquery/api/v1/sec/datum/meta/123');
});

test('core:net:datumMetadataUrlHelperMixin:addDatumMetadataUrl:nodeIdSourceIdArgs', t => {
	const helper = new DatumMetadataUrlHelper();
    const result = helper.addDatumMetadataUrl(123, 'bar');
	t.is(result, 'https://data.solarnetwork.net/solarquery/api/v1/sec/datum/meta/123?sourceId=bar');
});


test('core:net:datumMetadataUrlHelperMixin:replaceDatumMetadataUrl:nodeIdSourceIdArgs', t => {
	const helper = new DatumMetadataUrlHelper();
    const result = helper.replaceDatumMetadataUrl(123, 'bar');
	t.is(result, 'https://data.solarnetwork.net/solarquery/api/v1/sec/datum/meta/123?sourceId=bar');
});

test('core:net:datumMetadataUrlHelperMixin:deleteDatumMetadataUrl:nodeIdSourceIdArgs', t => {
	const helper = new DatumMetadataUrlHelper();
    const result = helper.deleteDatumMetadataUrl(123, 'bar');
	t.is(result, 'https://data.solarnetwork.net/solarquery/api/v1/sec/datum/meta/123?sourceId=bar');
});

test('core:net:datumMetadataUrlHelperMixin:findDatumMetadataUrl:sorted', t => {
	const helper = new DatumMetadataUrlHelper();
	t.is(helper.findDatumMetadataUrl(123, 'foo', [new SortDescriptor('bar')]),
		'https://data.solarnetwork.net/solarquery/api/v1/sec/datum/meta/123?'
		+'sourceId=foo&sortDescriptors%5B0%5D.key=bar');
	t.is(helper.findDatumMetadataUrl(123, 'foo', [new SortDescriptor('bar', true)]),
		'https://data.solarnetwork.net/solarquery/api/v1/sec/datum/meta/123?'
		+'sourceId=foo&sortDescriptors%5B0%5D.key=bar&sortDescriptors%5B0%5D.descending=true');
});

test('core:net:datumMetadataUrlHelperMixin:findDatumMetadataUrl:paginated', t => {
	const helper = new DatumMetadataUrlHelper();
	t.is(helper.findDatumMetadataUrl(123, 'foo', null, new Pagination(1, 2)),
		'https://data.solarnetwork.net/solarquery/api/v1/sec/datum/meta/123?'
		+'sourceId=foo&max=1&offset=2');
});

test('core:net:datumMetadataUrlHelperMixin:findDatumMetadataUrl:sortedAndPaginated', t => {
	const helper = new DatumMetadataUrlHelper();
	t.is(helper.findDatumMetadataUrl(123, 'foo', [new SortDescriptor('bar')], new Pagination(1, 2)),
		'https://data.solarnetwork.net/solarquery/api/v1/sec/datum/meta/123?'
		+'sourceId=foo&sortDescriptors%5B0%5D.key=bar&max=1&offset=2');
});
