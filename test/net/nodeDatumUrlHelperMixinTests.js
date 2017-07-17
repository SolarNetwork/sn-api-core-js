import test from 'ava';

import { NodeDatumUrlHelper } from 'net/nodeDatumUrlHelperMixin';

test('query:net:nodeDatumUrlHelperMixin:create', t => {
	const helper = new NodeDatumUrlHelper();
	t.truthy(helper);
});

test('query:net:nodeDatumUrlHelperMixin:baseUrl', t => {
	const helper = new NodeDatumUrlHelper();
	t.is(helper.baseUrl(), 'https://data.solarnetwork.net/solarquery/api/v1/sec');
});

test('query:net:nodeDatumUrlHelperMixin:reportableintervalUrl', t => {
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

test('query:net:nodeDatumUrlHelperMixin:reportableintervalUrl:sources', t => {
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

test('query:net:nodeDatumUrlHelperMixin:availableSources:empty', t => {
    const helper = new NodeDatumUrlHelper();
    t.is(helper.availableSourcesUrl(),
        'https://data.solarnetwork.net/solarquery/api/v1/sec/range/sources');
});

test('query:net:nodeDatumUrlHelperMixin:availableSources:emptyAndNullArgNodeId', t => {
    const helper = new NodeDatumUrlHelper();
    t.is(helper.availableSourcesUrl(null),
        'https://data.solarnetwork.net/solarquery/api/v1/sec/range/sources');
});

test('query:net:nodeDatumUrlHelperMixin:availableSources:emptyAndNullArgNodeId', t => {
    const helper = new NodeDatumUrlHelper();
    t.is(helper.availableSourcesUrl(null, '(foo=bar)'),
        'https://data.solarnetwork.net/solarquery/api/v1/sec/range/sources'
            +'?metadataFilter=(foo%3Dbar)');
});

test('query:net:nodeDatumUrlHelperMixin:availableSources:default', t => {
    const helper = new NodeDatumUrlHelper();
    helper.nodeId = 123;
    t.is(helper.availableSourcesUrl(),
        'https://data.solarnetwork.net/solarquery/api/v1/sec/range/sources'
            +'?nodeIds=123');

    helper.nodeIds = [123, 234];
    t.is(helper.availableSourcesUrl(),
        'https://data.solarnetwork.net/solarquery/api/v1/sec/range/sources'
            +'?nodeIds=123,234');
});

test('query:net:nodeDatumUrlHelperMixin:availableSources:argNodeId', t => {
    const helper = new NodeDatumUrlHelper();
    helper.nodeId = 123;
    t.is(helper.availableSourcesUrl(234),
        'https://data.solarnetwork.net/solarquery/api/v1/sec/range/sources'
            +'?nodeIds=234');
    t.is(helper.availableSourcesUrl([234, 345]),
        'https://data.solarnetwork.net/solarquery/api/v1/sec/range/sources'
            +'?nodeIds=234,345');
});

test('query:net:nodeDatumUrlHelperMixin:availableSources:metadataFilter', t => {
    const helper = new NodeDatumUrlHelper();
    t.is(helper.availableSourcesUrl(123, '(foo=bar)'),
        'https://data.solarnetwork.net/solarquery/api/v1/sec/range/sources'
            +'?nodeIds=123&metadataFilter=(foo%3Dbar)');
});
