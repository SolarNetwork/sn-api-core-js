import test from 'ava';

import DatumFilter from 'domain/datumFilter';
import Aggregations from 'domain/aggregation';
import Location from 'domain/location';
import { dateTimeUrlFormat } from 'format/date'

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

test('core:domain:datumFilter:create:copy', t => {
	const f1 = new DatumFilter({nodeId:123, sourceId:'abc'});
	const f2 = new DatumFilter(f1);
	t.not(f1.props, f2.props);
    t.deepEqual(f1.props, f2.props);
});

test('core:domain:datumFilter:userId', t => {
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

test('core:domain:datumFilter:locationIds', t => {
    const filter = new DatumFilter();
	filter.locationIds = [123, 234];
	t.is(filter.locationId, 123);
    t.deepEqual(filter.locationIds, [123, 234]);
    t.deepEqual(filter.props, {locationIds:[123, 234]})
});

test('core:domain:datumFilter:nodeIds:resetLocationId', t => {
	const filter = new DatumFilter();
	filter.locationIds = [123, 234];
	t.deepEqual(filter.locationIds, [123, 234]);
	filter.locationId = 456;
	t.deepEqual(filter.locationIds, [456], 'locationIds array reset to just locationId');
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

test('core:domain:datumFilter:userId', t => {
	const filter = new DatumFilter();
	filter.userId = 123;
    t.is(filter.userId, 123);
    t.deepEqual(filter.props, {userIds:[123]});
});

test('core:domain:datumFilter:userIds', t => {
    const filter = new DatumFilter();
	filter.userIds = [123, 234];
	t.is(filter.userId, 123);
    t.deepEqual(filter.userIds, [123, 234]);
    t.deepEqual(filter.props, {userIds:[123, 234]})
});

test('core:domain:datumFilter:userIds:resetNodeId', t => {
	const filter = new DatumFilter();
	filter.userIds = [123, 234];
	t.deepEqual(filter.userIds, [123, 234]);
	filter.userId = 456;
	t.deepEqual(filter.userIds, [456], 'userIds array reset to just userId');
});

test('core:domain:datumFilter:mostRecent', t => {
	const filter = new DatumFilter();
	t.is(filter.mostRecent, false);
	filter.mostRecent = true;
	t.is(filter.mostRecent, true);
    t.deepEqual(filter.props, {mostRecent:true});
});

test('core:domain:datumFilter:toUriEncoding', t => {
	const date = new Date();
	const filter = new DatumFilter();
	filter.startDate = date;
	filter.nodeId = 123;
	filter.sourceId = 'abc';
	filter.dataPath = 'i.watts';
	filter.tags = ['a', 'b'];
	t.is(filter.toUriEncoding(), 
		'startDate='+encodeURIComponent(dateTimeUrlFormat(date))
		+'&nodeId=123&sourceId=abc&dataPath=i.watts&tags=a,b');
});

test('core:domain:datumFilter:toUriEncoding:startDate', t => {
	const date = new Date();
	const filter = new DatumFilter();
	filter.startDate = date;
	t.is(filter.toUriEncoding(), 'startDate='+encodeURIComponent(dateTimeUrlFormat(date)));
});

test('core:domain:datumFilter:toUriEncoding:endDate', t => {
	const date = new Date();
	const filter = new DatumFilter();
	filter.endDate = date;
	t.is(filter.toUriEncoding(), 'endDate='+encodeURIComponent(dateTimeUrlFormat(date)));
});

test('core:domain:datumFilter:toUriEncoding:mostRecent', t => {
	const filter = new DatumFilter();
	filter.mostRecent = false;
	t.is(filter.toUriEncoding(), '', 'mostRecent not included when false');
	filter.mostRecent = true;
	t.is(filter.toUriEncoding(), 'mostRecent=true', 'mostRecent included when true');
});

test('core:domain:datumFilter:toUriEncoding:pluralProps:single', t => {
	const filter = new DatumFilter({nodeIds:[1], locationIds:[2], sourceIds:['&foo'], userIds:[3]});
	t.is(filter.toUriEncoding(), 'nodeId=1&locationId=2&sourceId=%26foo&userId=3');
});

test('core:domain:datumFilter:toUriEncoding:pluralProps:multi', t => {
	const filter = new DatumFilter({nodeIds:[1,2], locationIds:[5,6], sourceIds:['&foo','bar'], userIds:[3,4]});
	t.is(filter.toUriEncoding(), 'nodeIds=1,2&locationIds=5,6&sourceIds=%26foo,bar&userIds=3,4');
});

test('core:domain:datumFilter:toUriEncoding:aggregation', t => {
	const filter = new DatumFilter();
	filter.aggregation = Aggregations.DayOfWeek;
	t.is(filter.toUriEncoding(), 'aggregation=DayOfWeek');
});

test('core:domain:datumFilter:toUriEncoding:tags', t => {
	const filter = new DatumFilter();
	filter.tags = ['a','b'];
	t.is(filter.toUriEncoding(), 'tags=a,b');
});

test('core:domain:datumFilter:toUriEncoding:location', t => {
	const filter = new DatumFilter();
	const loc = new Location({country:'NZ',timeZoneId:'Pacific/Auckland'});
	filter.location = loc;
	t.is(filter.toUriEncoding(), 'location.country=NZ&location.timeZoneId=Pacific%2FAuckland');
});

test('core:domain:datumFilter:toUriEncoding:query', t => {
	const filter = new DatumFilter();
	filter.query = 'arrrr!';
	t.is(filter.toUriEncoding(), 'query=arrrr!');
});
