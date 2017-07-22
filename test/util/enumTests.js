import test from 'ava';

import Enum from 'util/enum';

class TestEnum extends Enum {
    constructor(name) {
        super(name);
        if ( this.constructor === TestEnum ) {
            Object.freeze(this);
        }
    }
    
	static enumValues() {
		return TestEnumValues;
	}
}

const TestEnumValues = Object.freeze([
    new TestEnum('A'),
    new TestEnum('B'),
    new TestEnum('C'),
    new TestEnum('D'),
]);

test('core:enum:create', t => {
	const obj = new Enum('foo');
    t.truthy(obj);
    t.is(obj.name, 'foo');
});

test('core:enum:frozen', t => {
    const obj = new Enum('foo');
    t.throws(() => {
        obj.foo = 'bar';
    }, TypeError, 'object is frozen');
});

test('core:enum:enumsValue', t => {
    t.deepEqual(TestEnum.enumsValue(TestEnumValues), {
        A: TestEnumValues[0],
        B: TestEnumValues[1],
        C: TestEnumValues[2],
        D: TestEnumValues[3],
    });
});

test('core:enum:valueOf', t => {
    t.is(TestEnum.valueOf('A'), TestEnumValues[0]);
    t.is(TestEnum.valueOf('D'), TestEnumValues[3]);
});
