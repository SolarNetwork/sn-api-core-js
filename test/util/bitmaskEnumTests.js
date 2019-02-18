import test from 'ava';

import BitmaskEnum from 'util/bitmaskEnum';

class TestEnum extends BitmaskEnum {
    constructor(name, value) {
        super(name, value);
        if ( this.constructor === TestEnum ) {
            Object.freeze(this);
        }
    }
    
	static enumValues() {
		return TestEnumValues;
	}
}

const TestEnumValues = Object.freeze([
    new TestEnum('A', 1),
    new TestEnum('B', 2),
    new TestEnum('C', 3),
    new TestEnum('D', 4),
]);

const TestEnums = TestEnum.enumsValue(TestEnumValues);

test('core:bitmaskEnum:create', t => {
	const obj = new BitmaskEnum('foo', 1);
    t.truthy(obj);
    t.is(obj.name, 'foo');
    t.is(obj.bitmaskBitOffset, 0);
    t.is(obj.bitmaskBitNumber, 1);
});

test('core:bitmaskEnum:frozen', t => {
    const obj = new BitmaskEnum('foo', 1);
    t.throws(() => {
        obj.foo = 'bar';
    }, TypeError, 'object is frozen');
});

test('core:bitmaskEnum:enumsValue', t => {
    t.deepEqual(TestEnums, {
        A: TestEnumValues[0],
        B: TestEnumValues[1],
        C: TestEnumValues[2],
        D: TestEnumValues[3],
    });
});

test('core:bitmaskEnum:setForBitmask', t => {
    const set = BitmaskEnum.setForBitmask(5, TestEnumValues);
    t.deepEqual(set, new Set([TestEnumValues[0], TestEnumValues[2]]));
});

test('core:bitmaskEnum:bitmaskForSet', t => {
    const vals = [TestEnumValues[0], TestEnumValues[2], TestEnumValues[3]];
    t.is(BitmaskEnum.bitmaskValue(vals), 13);
});