import test from 'ava';

import { NodeDatumUrlHelper } from 'net/nodeDatumUrlHelperMixin';
import Aggregations from 'domain/aggregation';
import DatumFilter from 'domain/datumFilter';
import Pagination from 'domain/pagination';
import SortDescriptor from 'domain/sortDescriptor';

test('core:net:nodeDatumUrlHelperMixin:create', t => {
	const helper = new NodeDatumUrlHelper();
	t.truthy(helper);
});

test('core:net:nodeDatumUrlHelperMixin:baseUrl', t => {
	const helper = new NodeDatumUrlHelper();
	t.is(helper.baseUrl(), 'https://data.solarnetwork.net/solarquery/api/v1/sec');
});

test('core:net:nodeDatumUrlHelperMixin:reportableintervalUrl', t => {
    const helper = new NodeDatumUrlHelper();
    helper.nodeId = 123;

    t.is(helper.reportableIntervalUrl(),
        'https://data.solarnetwork.net/solarquery/api/v1/sec/range/interval'
            +'?nodeId=123');

    t.is(helper.reportableIntervalUrl(234),
        'https://data.solarnetwork.net/solarquery/api/v1/sec/range/interval'
            +'?nodeId=234',
        'argument node ID used');        
});

test('core:net:nodeDatumUrlHelperMixin:reportableintervalUrl:sources', t => {
    const helper = new NodeDatumUrlHelper();
    helper.nodeId = 123;
    helper.sourceId = 'abc';

    t.is(helper.reportableIntervalUrl(),
        'https://data.solarnetwork.net/solarquery/api/v1/sec/range/interval'
        +'?nodeId=123&sourceIds=abc');

    t.is(helper.reportableIntervalUrl(null,[]),
        'https://data.solarnetwork.net/solarquery/api/v1/sec/range/interval'
            +'?nodeId=123',
        'argument empty source IDs used');        

    t.is(helper.reportableIntervalUrl(null,['one','two']),
        'https://data.solarnetwork.net/solarquery/api/v1/sec/range/interval'
            +'?nodeId=123&sourceIds=one,two',
        'argument source IDs used');        

    t.is(helper.reportableIntervalUrl(null,['&one','=two']),
        'https://data.solarnetwork.net/solarquery/api/v1/sec/range/interval'
            +'?nodeId=123&sourceIds=%26one,%3Dtwo',
        'source IDs URI escaped');        
});

test('core:net:nodeDatumUrlHelperMixin:availableSources:empty', t => {
    const helper = new NodeDatumUrlHelper();
    t.is(helper.availableSourcesUrl(),
        'https://data.solarnetwork.net/solarquery/api/v1/sec/range/sources');
});

test('core:net:nodeDatumUrlHelperMixin:availableSources:emptyAndNullArgNodeId', t => {
    const helper = new NodeDatumUrlHelper();
    const filter = new DatumFilter();
    filter.metadataFilter = '(foo=bar)';
    t.is(helper.availableSourcesUrl(filter),
        'https://data.solarnetwork.net/solarquery/api/v1/sec/range/sources'
            +'?metadataFilter=(foo%3Dbar)');
});

test('core:net:nodeDatumUrlHelperMixin:availableSources:default', t => {
    const helper = new NodeDatumUrlHelper();
    helper.nodeId = 123;
    t.is(helper.availableSourcesUrl(),
        'https://data.solarnetwork.net/solarquery/api/v1/sec/range/sources'
            +'?nodeId=123');

    helper.nodeIds = [123, 234];
    t.is(helper.availableSourcesUrl(),
        'https://data.solarnetwork.net/solarquery/api/v1/sec/range/sources'
            +'?nodeIds=123,234');
});

test('core:net:nodeDatumUrlHelperMixin:availableSources:argNodeId', t => {
    const helper = new NodeDatumUrlHelper();
    helper.nodeId = 123;
    const filter = new DatumFilter();
    filter.nodeId = 234;
    t.is(helper.availableSourcesUrl(filter),
        'https://data.solarnetwork.net/solarquery/api/v1/sec/range/sources'
            +'?nodeId=234');
    filter.nodeIds = [234, 345];
    t.is(helper.availableSourcesUrl(filter),
        'https://data.solarnetwork.net/solarquery/api/v1/sec/range/sources'
            +'?nodeIds=234,345');
});

test('core:net:nodeDatumUrlHelperMixin:availableSources:metadataFilter', t => {
    const helper = new NodeDatumUrlHelper();
    helper.nodeId = 123;
    const filter = helper.datumFilter();
    filter.metadataFilter = '(foo=bar)';
    t.is(helper.availableSourcesUrl(filter),
        'https://data.solarnetwork.net/solarquery/api/v1/sec/range/sources'
            +'?nodeId=123&metadataFilter=(foo%3Dbar)');
});

test('core:net:nodeDatumUrlHelperMixin:availableSources:dates', t => {
    const helper = new NodeDatumUrlHelper();
    helper.nodeId = 123;
    const filter = helper.datumFilter();
    filter.startDate = new Date('2017-01-01T12:12:12.123Z');
    filter.endDate = new Date(filter.startDate.getTime() + 24 * 60 * 60 * 1000);
    t.is(helper.availableSourcesUrl(filter),
        'https://data.solarnetwork.net/solarquery/api/v1/sec/range/sources'
            +'?nodeId=123&startDate=2017-01-01T12%3A12&endDate=2017-01-02T12%3A12');
});

test('core:net:nodeDatumUrlHelperMixin:listDatumUrl:defaultFilter', t => {
    const helper = new NodeDatumUrlHelper();
    helper.nodeId = 123;
    let filter = helper.datumFilter();
	t.deepEqual(filter.props, {nodeIds:[123]});

    helper.sourceId = 'abc';
    filter = helper.datumFilter();
	t.deepEqual(filter.props, {nodeIds:[123], sourceIds:['abc']});
});

test('core:net:nodeDatumUrlHelperMixin:listDatumUrl', t => {
    const helper = new NodeDatumUrlHelper();
    const filter = new DatumFilter();
    filter.nodeId = 123;
    filter.aggregation = Aggregations.Hour;
    filter.startDate = new Date('2017-01-01T12:12:12.123Z');
    filter.endDate = new Date(filter.startDate.getTime() + 24 * 60 * 60 * 1000);
	t.is(helper.listDatumUrl(filter, [new SortDescriptor('foo')], new Pagination(1, 2)),
		'https://data.solarnetwork.net/solarquery/api/v1/sec/datum/list?'
        +'nodeId=123&aggregation=Hour&startDate=2017-01-01T12%3A12&endDate=2017-01-02T12%3A12'
        +'&sorts%5B0%5D.key=foo&max=1&offset=2');
});

test('core:net:nodeDatumUrlHelperMixin:pageZeroNoMax', t => {
    const helper = new NodeDatumUrlHelper();
    const filter = new DatumFilter();
    filter.nodeId = 123;
    filter.aggregation = Aggregations.Hour;
    filter.startDate = new Date('2017-01-01T12:12:12.123Z');
    filter.endDate = new Date(filter.startDate.getTime() + 24 * 60 * 60 * 1000);
	t.is(helper.listDatumUrl(filter, undefined, new Pagination()),
		'https://data.solarnetwork.net/solarquery/api/v1/sec/datum/list?'
        +'nodeId=123&aggregation=Hour&startDate=2017-01-01T12%3A12&endDate=2017-01-02T12%3A12');
});

test('core:net:nodeDatumUrlHelperMixin:listDatumUrl:defaultFilter', t => {
    const helper = new NodeDatumUrlHelper();
    helper.nodeId = 123;
    helper.sourceId = 'abc';
	t.is(helper.listDatumUrl(),
		'https://data.solarnetwork.net/solarquery/api/v1/sec/datum/list?'
        +'nodeId=123&sourceId=abc');
});

test('core:net:nodeDatumUrlHelperMixin:mostRecentDatumUrl', t => {
    const helper = new NodeDatumUrlHelper();
    const filter = new DatumFilter();
    filter.nodeId = 123;
    filter.startDate = new Date('2017-01-01T12:12:12.123Z');
    filter.endDate = new Date(filter.startDate.getTime() + 24 * 60 * 60 * 1000);
	t.is(helper.mostRecentDatumUrl(filter, [new SortDescriptor('foo')], new Pagination(1, 2)),
		'https://data.solarnetwork.net/solarquery/api/v1/sec/datum/mostRecent?'
        +'nodeId=123&startDate=2017-01-01T12%3A12&endDate=2017-01-02T12%3A12'
        +'&sorts%5B0%5D.key=foo&max=1&offset=2');
});

test('core:net:nodeDatumUrlHelperMixin:mostRecentDatumUrl:defaultFilter', t => {
    const helper = new NodeDatumUrlHelper();
    helper.nodeId = 123;
    helper.sourceId = 'abc';
	t.is(helper.mostRecentDatumUrl(),
		'https://data.solarnetwork.net/solarquery/api/v1/sec/datum/mostRecent?'
        +'nodeId=123&sourceId=abc');
});
