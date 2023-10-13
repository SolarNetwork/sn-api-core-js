import test from "ava";

import KeyedEnum from "../../main/util/keyedEnum.js";

enum FooKeyed {
	A = "A",
	B = "B",
	C = "C",
	D = "D",
}

class FooKeyedEnum extends KeyedEnum {
	constructor(name: string, value: string) {
		super(name, value);
		if (this.constructor === FooKeyedEnum) {
			Object.freeze(this);
		}
	}

	static enumValues() {
		return FooKeyedEnumValues;
	}
}

const FooKeyedEnumValues = Object.freeze([
	new FooKeyedEnum(FooKeyed.A, "a"),
	new FooKeyedEnum(FooKeyed.B, "b"),
	new FooKeyedEnum(FooKeyed.C, "c"),
	new FooKeyedEnum(FooKeyed.D, "d"),
]);

type FooKeyedEnumsType = { [key in FooKeyed]: FooKeyedEnum };

const FooKeyedEnums = FooKeyedEnum.enumsValue(
	FooKeyedEnumValues
) as FooKeyedEnumsType;

test("construct", (t) => {
	const obj = new FooKeyedEnum("foo", "bar");
	t.truthy(obj);
	t.is(obj.name, "foo");
	t.is(obj.key, "bar");
});

test("frozen", (t) => {
	const obj = new FooKeyedEnum("foo", "bar");
	t.throws(
		() => {
			(obj as any).foo = "bar";
		},
		{ instanceOf: TypeError },
		"object is frozen"
	);
});

test("enumsValue", (t) => {
	t.deepEqual(FooKeyedEnums, {
		A: FooKeyedEnumValues[0],
		B: FooKeyedEnumValues[1],
		C: FooKeyedEnumValues[2],
		D: FooKeyedEnumValues[3],
	});
});

test("valueOf:key", (t) => {
	t.is(
		FooKeyedEnum.valueOf("a"),
		FooKeyedEnumValues[0],
		"value found via key"
	);
});

test("valueOf:name", (t) => {
	t.is(
		FooKeyedEnum.valueOf("A"),
		FooKeyedEnumValues[0],
		"value found via name"
	);
});

test("valueOf:invalid", (t) => {
	t.is(
		FooKeyedEnum.valueOf("not valid"),
		undefined,
		"invalid value returns undefined"
	);
});

class BadKeyedEnum extends KeyedEnum {
	static enumValues(): readonly BadKeyedEnum[] {
		// intentionally return not-an-array
		return {} as any;
	}
}

test("valueOf:notArray", (t) => {
	t.is(
		BadKeyedEnum.valueOf("a"),
		undefined,
		"bad enum implementation results in undefined"
	);
});
