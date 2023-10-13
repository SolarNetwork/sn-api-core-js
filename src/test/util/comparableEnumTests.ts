import test from "ava";

import ComparableEnum from "../../main/util/comparableEnum.js";

enum FooComparable {
	A = "A",
	B = "B",
	C = "C",
	D = "D",
}

class FooComparableEnum extends ComparableEnum {
	constructor(name: string, value: number) {
		super(name, value);
		if (this.constructor === FooComparableEnum) {
			Object.freeze(this);
		}
	}

	static enumValues() {
		return FooComparableEnumValues;
	}
}

const FooComparableEnumValues = Object.freeze([
	new FooComparableEnum(FooComparable.A, 1),
	new FooComparableEnum(FooComparable.B, 5),
	new FooComparableEnum(FooComparable.C, 10),
	new FooComparableEnum(FooComparable.D, 10),
]);

type FooComparableEnumsType = { [key in FooComparable]: FooComparableEnum };

const FooComparableEnums = FooComparableEnum.enumsValue(
	FooComparableEnumValues
) as FooComparableEnumsType;

test("construct", (t) => {
	const obj = new FooComparableEnum("foo", 1);
	t.truthy(obj);
	t.is(obj.name, "foo");
	t.is(obj.value, 1);
});

test("frozen", (t) => {
	const obj = new FooComparableEnum("foo", 1);
	t.throws(
		() => {
			(obj as any).foo = "bar";
		},
		{ instanceOf: TypeError },
		"object is frozen"
	);
});

test("compare:lt", (t) => {
	const left = new FooComparableEnum("foo", 1);
	const right = new FooComparableEnum("bar", 2);
	t.is(left.compareTo(right), -1);
});

test("compare:gt", (t) => {
	const left = new FooComparableEnum("foo", 2);
	const right = new FooComparableEnum("bar", 1);
	t.is(left.compareTo(right), 1);
});

test("compare:eq", (t) => {
	const left = new FooComparableEnum("foo", 1);
	const right = new FooComparableEnum("bar", 1);
	t.is(left.compareTo(right), 0);
});

test("compare:same", (t) => {
	const o = new FooComparableEnum("foo", 1);
	t.is(o.compareTo(o), 0);
});

test("compare:undefined", (t) => {
	const o = new FooComparableEnum("foo", 1);
	t.is(o.compareTo(undefined), 1);
});

test("enumsValue", (t) => {
	t.deepEqual(FooComparableEnums, {
		A: FooComparableEnumValues[0],
		B: FooComparableEnumValues[1],
		C: FooComparableEnumValues[2],
		D: FooComparableEnumValues[3],
	});
});

test("minimumEnumSet", (t) => {
	const cache = new Map<string, Set<FooComparableEnum>>();
	let result = FooComparableEnum.minimumEnumSet(FooComparableEnums.D, cache);
	t.deepEqual(result, new Set([FooComparableEnums.C, FooComparableEnums.D]));
	t.is(
		result,
		FooComparableEnum.minimumEnumSet(FooComparableEnums.D, cache),
		"return cached set"
	);

	result = FooComparableEnum.minimumEnumSet(FooComparableEnums.B);
	t.deepEqual(
		result,
		new Set([
			FooComparableEnums.B,
			FooComparableEnums.C,
			FooComparableEnums.D,
		])
	);

	result = FooComparableEnum.minimumEnumSet(
		new FooComparableEnum("foo", Number.MAX_SAFE_INTEGER)
	);
	t.is(result, undefined);
});

test("minimumEnumSet:undefined", (t) => {
	t.is(
		FooComparableEnum.minimumEnumSet(undefined),
		undefined,
		"undefined returned if undefined provided"
	);
});
