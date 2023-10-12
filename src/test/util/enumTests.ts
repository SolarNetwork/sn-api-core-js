import test from "ava";

import Enum from "../../main/util/enum.js";

enum Foo {
	A = "a",
	B = "b",
}

class FooEnum extends Enum {
	constructor(name: string) {
		super(name);
		if (this.constructor === FooEnum) {
			Object.freeze(this);
		}
	}
	static enumValues(): readonly FooEnum[] {
		return FooEnumValues;
	}
}

const FooEnumValues: readonly FooEnum[] = Object.freeze([
	new FooEnum(Foo.A),
	new FooEnum(Foo.B),
]);

test("abstract:enumValues", (t) => {
	t.deepEqual(
		Enum.enumValues(),
		[],
		"empty array in abstract implementation"
	);
});

test("construct", (t) => {
	const v = Foo.A;
	const e = new FooEnum(v);
	t.is(e.name, v, "name from constructor returned");
});

test("frozen", (t) => {
	const e = new FooEnum(Foo.A);
	t.throws(
		() => {
			(e as any)["foo"] = "bar";
		},
		{ instanceOf: TypeError },
		"object is frozen"
	);
});

test("enumValues", (t) => {
	t.is(FooEnum.enumValues(), FooEnumValues, "enumValues returned");
});

test("enumsValue", (t) => {
	t.deepEqual(FooEnum.enumsValue(FooEnum.enumValues()), {
		a: FooEnumValues[0],
		b: FooEnumValues[1],
	});
});

test("valueOf", (t) => {
	t.is(FooEnum.valueOf("a"), FooEnumValues[0], "enum value returned");
	t.is(FooEnum.valueOf("b"), FooEnumValues[1], "enum value returned");
});

test("valueOf:invalid", (t) => {
	t.is(
		FooEnum.valueOf("not valid"),
		undefined,
		"invalid value returns undefined"
	);
});

class BadEnum extends Enum {
	static enumValues(): readonly BadEnum[] {
		// intentionally return not-an-array
		return {} as any;
	}
}

test("valueOf:notArray", (t) => {
	t.is(
		BadEnum.valueOf("a"),
		undefined,
		"bad enum implementation results in undefined"
	);
});

test("namesFor", (t) => {
	t.deepEqual(FooEnum.namesFor(FooEnumValues), ["a", "b"], "names extracted");
});

test("namesFor:set", (t) => {
	const s = new Set<FooEnum>();
	s.add(FooEnumValues[0]);
	s.add(FooEnumValues[1]);
	t.deepEqual(FooEnum.namesFor(s), ["a", "b"]);
});

test("equals:values", (t) => {
	t.is(FooEnumValues[0].equals("a"), true);
	t.is(FooEnumValues[0].equals("A"), false);
});

class BarEnum extends Enum {
	constructor(name: string) {
		super(name);
		if (this.constructor === BarEnum) {
			Object.freeze(this);
		}
	}
	static enumValues(): readonly BarEnum[] {
		return BarEnumValues;
	}
}

const BarEnumValues: readonly BarEnum[] = Object.freeze([
	new BarEnum(Foo.A),
	new BarEnum(Foo.B),
]);

test("equals:anotherEnum", (t) => {
	t.is(
		FooEnumValues[0].equals(new FooEnum(Foo.A)),
		true,
		"different instances with same value are equal"
	);
	t.is(
		FooEnumValues[0].equals(FooEnumValues[0]),
		true,
		"same instances are equal"
	);
	t.is(
		FooEnumValues[1].equals(new BarEnum(Foo.A)),
		false,
		"different types with same value are not equal"
	);
});
