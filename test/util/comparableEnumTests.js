import test from "ava";

import ComparableEnum from "util/comparableEnum";

class TestEnum extends ComparableEnum {
	constructor(name, value) {
		super(name, value);
		if (this.constructor === TestEnum) {
			Object.freeze(this);
		}
	}

	static enumValues() {
		return TestEnumValues;
	}
}

const TestEnumValues = Object.freeze([
	new TestEnum("A", 1),
	new TestEnum("B", 5),
	new TestEnum("C", 10),
	new TestEnum("D", 10)
]);

const TestEnums = TestEnum.enumsValue(TestEnumValues);

test("util:comparableEnum:create", t => {
	const obj = new ComparableEnum("foo", 1);
	t.truthy(obj);
	t.is(obj.name, "foo");
	t.is(obj.value, 1);
});

test("util:comparableEnum:frozen", t => {
	const obj = new ComparableEnum("foo", 1);
	t.throws(
		() => {
			obj.foo = "bar";
		},
		TypeError,
		"object is frozen"
	);
});

test("util:comparableEnum:compare:lt", t => {
	const left = new ComparableEnum("foo", 1);
	const right = new ComparableEnum("bar", 2);
	t.is(left.compareTo(right), -1);
});

test("util:comparableEnum:compare:gt", t => {
	const left = new ComparableEnum("foo", 2);
	const right = new ComparableEnum("bar", 1);
	t.is(left.compareTo(right), 1);
});

test("util:comparableEnum:compare:eq", t => {
	const left = new ComparableEnum("foo", 1);
	const right = new ComparableEnum("bar", 1);
	t.is(left.compareTo(right), 0);
});

test("util:comparableEnum:enumsValue", t => {
	t.deepEqual(TestEnums, {
		A: TestEnumValues[0],
		B: TestEnumValues[1],
		C: TestEnumValues[2],
		D: TestEnumValues[3]
	});
});

test("util:comparableEnum:minimumEnumSet", t => {
	const cache = new Map();
	let result = TestEnum.minimumEnumSet(TestEnums.D, cache);
	t.deepEqual(result, new Set([TestEnums.C, TestEnums.D]));
	t.is(result, TestEnum.minimumEnumSet(TestEnums.D, cache), "return cached set");

	result = TestEnum.minimumEnumSet(TestEnums.B);
	t.deepEqual(result, new Set([TestEnums.B, TestEnums.C, TestEnums.D]));

	result = TestEnum.minimumEnumSet(new TestEnum("foo", Number.MAX_SAFE_INTEGER));
	t.is(result, null);
});
