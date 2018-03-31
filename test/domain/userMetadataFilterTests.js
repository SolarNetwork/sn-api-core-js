import test from 'ava';

import UserMetadataFilter from 'domain/userMetadataFilter';

test('core:domain:userMetadataFilter:create', t => {
	const f = new UserMetadataFilter();
    t.truthy(f);
    t.deepEqual(f.props, {});
});

test('core:domain:userMetadataFilter:create:data', t => {
    const d = {foo:1};
	const f = new UserMetadataFilter(d);
    t.truthy(f);
    t.is(f.props, d);
});

test('core:domain:userMetadataFilter:create:copy', t => {
	const f1 = new UserMetadataFilter({userId:123, tags:['abc']});
	const f2 = new UserMetadataFilter(f1);
	t.not(f1.props, f2.props);
    t.deepEqual(f1.props, f2.props);
});

test('core:domain:userMetadataFilter:userId', t => {
	const filter = new UserMetadataFilter();
	filter.userId = 123;
    t.is(filter.userId, 123);
    t.deepEqual(filter.props, {userIds:[123]});
});

test('core:domain:userMetadataFilter:userIds', t => {
    const filter = new UserMetadataFilter();
	filter.userIds = [123, 234];
	t.is(filter.userId, 123);
    t.deepEqual(filter.userIds, [123, 234]);
    t.deepEqual(filter.props, {userIds:[123, 234]})
});

test('core:domain:userMetadataFilter:userIds:resetUserId', t => {
	const filter = new UserMetadataFilter();
	filter.userIds = [123, 234];
	t.deepEqual(filter.userIds, [123, 234]);
	filter.userId = 456;
	t.deepEqual(filter.userIds, [456], 'userIds array reset to just userId');
});

test('core:domain:userMetadataFilter:toUriEncoding', t => {
	const filter = new UserMetadataFilter();
	filter.userId = 123;
	filter.tags = ['a', 'b'];
	t.is(filter.toUriEncoding(), 'userId=123&tags=a,b');
});

test('core:domain:userMetadataFilter:toUriEncoding:pluralProps:single', t => {
	const filter = new UserMetadataFilter({userIds:[3]});
	t.is(filter.toUriEncoding(), 'userId=3');
});

test('core:domain:userMetadataFilter:toUriEncoding:pluralProps:multi', t => {
	const filter = new UserMetadataFilter({userIds:[3,4]});
	t.is(filter.toUriEncoding(), 'userIds=3,4');
});

test('core:domain:userMetadataFilter:toUriEncoding:tags', t => {
	const filter = new UserMetadataFilter();
	filter.tags = ['a','b'];
	t.is(filter.toUriEncoding(), 'tags=a,b');
});
