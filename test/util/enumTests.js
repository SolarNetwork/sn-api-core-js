import test from "ava";

import Enum from "../../src/util/enum.js";

class TestEnum extends Enum {
	constructor(name) {
		super(name);
		if (this.constructor === TestEnum) {
			Object.freeze(this);
		}
	}

	static enumValues() {
		return TestEnumValues;
	}
}

const TestEnumValues = Object.freeze([
	new TestEnum("A"),
	new TestEnum("B"),
	new TestEnum("C"),
	new TestEnum("D"),
]);

test("core:enum:create", (t) => {
	const obj = new Enum("foo");
	t.truthy(obj);
	t.is(obj.name, "foo");
});

test("core:enum:frozen", (t) => {
	const obj = new Enum("foo");
	t.throws(
		() => {
			obj.foo = "bar";
		},
		{ instanceOf: TypeError },
		"object is frozen",
	);
});

test("core:enum:enumsValue", (t) => {
	t.deepEqual(TestEnum.enumsValue(TestEnumValues), {
		A: TestEnumValues[0],
		B: TestEnumValues[1],
		C: TestEnumValues[2],
		D: TestEnumValues[3],
	});
});

test("core:enum:valueOf", (t) => {
	t.is(TestEnum.valueOf("A"), TestEnumValues[0]);
	t.is(TestEnum.valueOf("D"), TestEnumValues[3]);
});

test("core:enum:namesFor:array", (t) => {
	t.deepEqual(TestEnum.namesFor([TestEnumValues[0], TestEnumValues[2]]), ["A", "C"]);
});

test("core:enum:namesFor:set", (t) => {
	const s = new Set();
	s.add(TestEnumValues[1]);
	s.add(TestEnumValues[2]);
	t.deepEqual(TestEnum.namesFor(s), ["B", "C"]);
});

test("core:enum:equals", (t) => {
	t.is(TestEnumValues[0].equals("A"), true);
	t.is(TestEnumValues[1].equals("a"), false);
});

test("core:enum:equals:anotherEnum", (t) => {
	t.is(TestEnumValues[0].equals(new TestEnum("A")), true);
	t.is(TestEnumValues[0].equals(TestEnumValues[0]), true);
	t.is(TestEnumValues[1].equals(new Enum("A")), false);
});
