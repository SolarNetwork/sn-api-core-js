import test from 'ava';

import DatumFilter from 'domain/datumFilter';

test('core:domain:datumFilter:create', t => {
	const f = new DatumFilter();
    t.truthy(f);
    t.deepEqual(f.props, {});
});

test('core:domain:datumFilter:create:data', t => {
    const d = {foo:1};
	const f = new DatumFilter(d);
    t.truthy(f);
    t.is(f.props, d);
});

test('core:domain:datumFilter:nodeId', t => {
	const filter = new DatumFilter();
	filter.nodeId = 123;
    t.is(filter.nodeId, 123);
    t.deepEqual(filter.props, {nodeIds:[123]});
});

test('core:domain:datumFilter:nodeIds', t => {
    const filter = new DatumFilter();
	filter.nodeIds = [123, 234];
	t.is(filter.nodeId, 123);
    t.deepEqual(filter.nodeIds, [123, 234]);
    t.deepEqual(filter.props, {nodeIds:[123, 234]})
});

test('core:domain:datumFilter:nodeIds:resetNodeId', t => {
	const filter = new DatumFilter();
	filter.nodeIds = [123, 234];
	t.deepEqual(filter.nodeIds, [123, 234]);
	filter.nodeId = 456;
	t.deepEqual(filter.nodeIds, [456], 'nodeIds array reset to just nodeId');
});

test('core:domain:datumFilter:sourceId', t => {
	const filter = new DatumFilter();
	filter.sourceId = 'abc';
	t.is(filter.sourceId, 'abc');
    t.deepEqual(filter.props, {sourceIds:['abc']})
});

test('core:domain:datumFilter:sourceIds', t => {
    const filter = new DatumFilter();
	filter.sourceIds = ['abc', '234'];
	t.is(filter.sourceId, 'abc');
	t.deepEqual(filter.sourceIds, ['abc', '234']);
    t.deepEqual(filter.props, {sourceIds:['abc','234']})
});

test('core:domain:datumFilter:sourceIds:resetSourceId', t => {
	const filter = new DatumFilter();
	filter.sourceIds = ['abc', '234'];
	t.deepEqual(filter.sourceIds, ['abc', '234']);
	filter.sourceId = 'def';
	t.deepEqual(filter.sourceIds, ['def'], 'sourceIds array reset to just sourceId');
});