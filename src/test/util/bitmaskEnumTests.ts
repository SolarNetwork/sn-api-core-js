import test from "ava";

import BitmaskEnum from "../../main/util/bitmaskEnum.js";

enum FooBitmask {
	A = "A",
	B = "B",
	C = "C",
	D = "D",
}

class FooBitmaskEnum extends BitmaskEnum {
	constructor(name: string, value: number) {
		super(name, value);
		if (this.constructor === FooBitmaskEnum) {
			Object.freeze(this);
		}
	}

	static enumValues() {
		return FooBitmaskEnumValues;
	}
}

const FooBitmaskEnumValues = Object.freeze([
	new FooBitmaskEnum(FooBitmask.A, 1),
	new FooBitmaskEnum(FooBitmask.B, 2),
	new FooBitmaskEnum(FooBitmask.C, 3),
	new FooBitmaskEnum(FooBitmask.D, 4),
]);

type FooBitmaskEnumsType = { [key in FooBitmask]: FooBitmaskEnum };

const TestEnums = FooBitmaskEnum.enumsValue(
	FooBitmaskEnumValues
) as FooBitmaskEnumsType;

test("construct", (t) => {
	const obj = new FooBitmaskEnum("foo", 1);
	t.truthy(obj);
	t.is(obj.name, "foo");
	t.is(obj.bitmaskBitOffset, 0);
	t.is(obj.bitmaskBitNumber, 1);
});

test("frozen", (t) => {
	const obj = new FooBitmaskEnum("foo", 1);
	t.throws(
		() => {
			(obj as any).foo = "bar";
		},
		{ instanceOf: TypeError },
		"object is frozen"
	);
});

test("enumsValue", (t) => {
	t.deepEqual(TestEnums, {
		A: FooBitmaskEnumValues[0],
		B: FooBitmaskEnumValues[1],
		C: FooBitmaskEnumValues[2],
		D: FooBitmaskEnumValues[3],
	});
});

test("enumForBitNumber", (t) => {
	const e = BitmaskEnum.enumForBitNumber(2, FooBitmaskEnumValues);
	t.is(e, TestEnums.B);
});

test("enumForBitNumber:invalid", (t) => {
	const e = BitmaskEnum.enumForBitNumber(99, FooBitmaskEnumValues);
	t.is(e, undefined, "undefined returned for invalid bit number");
});

test("setForBitmaskEnum", (t) => {
	const set = BitmaskEnum.setForBitmaskEnum(5, FooBitmaskEnum);
	t.deepEqual(set, new Set([TestEnums.A, TestEnums.C]));
});

test("setForBitmask", (t) => {
	const set = BitmaskEnum.setForBitmask(5, FooBitmaskEnumValues);
	t.deepEqual(set, new Set([TestEnums.A, TestEnums.C]));
});

test("setForBitmask:negative", (t) => {
	const set = BitmaskEnum.setForBitmask(-1, FooBitmaskEnumValues);
	t.deepEqual(set, new Set());
});

test("setForBitmask:undefined", (t) => {
	const set = BitmaskEnum.setForBitmask(5, undefined);
	t.deepEqual(set, new Set());
});

test("bitmaskForSet", (t) => {
	const vals = [TestEnums.A, TestEnums.C, TestEnums.D];
	t.is(BitmaskEnum.bitmaskValue(vals), 13);
});
