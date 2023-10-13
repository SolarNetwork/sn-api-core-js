import test from "ava";

import UserMetadataFilter from "../../main/domain/userMetadataFilter.js";

test("create", (t) => {
	const f = new UserMetadataFilter();
	t.truthy(f);
	t.deepEqual(f.props, new Map());
});

test("create:object", (t) => {
	const d = { foo: 1 };
	const f = new UserMetadataFilter(d);
	t.truthy(f);
	t.deepEqual(
		f.props,
		new Map(Object.entries(d)),
		"object properties copied"
	);
});

test("create:copy", (t) => {
	const f1 = new UserMetadataFilter({ userId: 123, tags: ["abc"] });
	const f2 = new UserMetadataFilter(f1);
	t.not(f1.props, f2.props);
	t.deepEqual(f1.props, f2.props);
});

test("userId", (t) => {
	const filter = new UserMetadataFilter();
	filter.userId = 123;
	t.is(filter.userId, 123);
	t.deepEqual(filter.props, new Map(Object.entries({ userIds: [123] })));

	filter.userId = null;
	t.is(filter.userId, undefined);
});

test("userIds", (t) => {
	const filter = new UserMetadataFilter();
	filter.userIds = [123, 234];
	t.is(filter.userId, 123);
	t.deepEqual(filter.userIds, [123, 234]);
	t.deepEqual(filter.props, new Map(Object.entries({ userIds: [123, 234] })));

	filter.userIds = null;
	t.is(filter.userIds, undefined);
});

test("userIds:resetUserId", (t) => {
	const filter = new UserMetadataFilter();
	filter.userIds = [123, 234];
	t.deepEqual(filter.userIds, [123, 234]);
	filter.userId = 456;
	t.deepEqual(filter.userIds, [456], "userIds array reset to just userId");
});

test("tags", (t) => {
	const filter = new UserMetadataFilter();
	filter.tags = ["a", "b"];
	t.deepEqual(filter.tags, ["a", "b"]);
	t.deepEqual(filter.props, new Map(Object.entries({ tags: ["a", "b"] })));

	filter.tags = null;
	t.is(filter.tags, undefined);
});

test("toUriEncoding", (t) => {
	const filter = new UserMetadataFilter();
	filter.userId = 123;
	filter.tags = ["a", "b"];
	t.is(filter.toUriEncoding(), "userId=123&tags=a,b");
});

test("toUriEncoding:pluralProps:single", (t) => {
	const filter = new UserMetadataFilter({ userIds: [3] });
	t.is(filter.toUriEncoding(), "userId=3");
});

test("toUriEncoding:pluralProps:multi", (t) => {
	const filter = new UserMetadataFilter({ userIds: [3, 4] });
	t.is(filter.toUriEncoding(), "userIds=3,4");
});

test("toUriEncoding:tags", (t) => {
	const filter = new UserMetadataFilter();
	filter.tags = ["a", "b"];
	t.is(filter.toUriEncoding(), "tags=a,b");
});
