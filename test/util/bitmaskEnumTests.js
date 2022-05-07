import test from "ava";

import BitmaskEnum from "util/bitmaskEnum";

class TestEnum extends BitmaskEnum {
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
	new TestEnum("B", 2),
	new TestEnum("C", 3),
	new TestEnum("D", 4)
]);

const TestEnums = TestEnum.enumsValue(TestEnumValues);

test("util:bitmaskEnum:create", t => {
	const obj = new BitmaskEnum("foo", 1);
	t.truthy(obj);
	t.is(obj.name, "foo");
	t.is(obj.bitmaskBitOffset, 0);
	t.is(obj.bitmaskBitNumber, 1);
});

test("util:bitmaskEnum:frozen", t => {
	const obj = new BitmaskEnum("foo", 1);
	t.throws(
		() => {
			obj.foo = "bar";
		},
		{ instanceOf: TypeError },
		"object is frozen"
	);
});

test("util:bitmaskEnum:enumsValue", t => {
	t.deepEqual(TestEnums, {
		A: TestEnumValues[0],
		B: TestEnumValues[1],
		C: TestEnumValues[2],
		D: TestEnumValues[3]
	});
});

test("util:bitmaskEnum:enumForBitNumber", t => {
	const e = BitmaskEnum.enumForBitNumber(2, TestEnumValues);
	t.is(e, TestEnums.B);
});

test("util:bitmaskEnum:setForBitmask", t => {
	const set = BitmaskEnum.setForBitmask(5, TestEnumValues);
	t.deepEqual(set, new Set([TestEnums.A, TestEnums.C]));
});

test("util:bitmaskEnum:bitmaskForSet", t => {
	const vals = [TestEnums.A, TestEnums.C, TestEnums.D];
	t.is(BitmaskEnum.bitmaskValue(vals), 13);
});
