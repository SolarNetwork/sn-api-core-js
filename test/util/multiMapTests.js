import test from 'ava';

import MultiMap from 'util/multiMap';

test('core:multiMap:create', t => {
	const map = new MultiMap();
	t.truthy(map);
});

test('core:multiMap:createWithProps', t => {
	const map = new MultiMap({a:'foo', b:['bar', 'bam']});
	t.deepEqual(map.value('a'), ['foo']);
	t.deepEqual(map.value('b'), ['bar', 'bam']);
});

test('core:multiMap:put', t => {
	const map = new MultiMap();
	t.is(map.put('foo', 'bar'), map);
	t.deepEqual(map.value('foo'), ['bar']);
});

test('core:multiMap:put:undefined', t => {
	const map = new MultiMap();
	t.is(map.put('foo', undefined), map);
	t.deepEqual(map.keySet(), []);
});

test('core:multiMap:put:null', t => {
	const map = new MultiMap();
	t.is(map.put('foo', null), map);
	t.deepEqual(map.value('foo'), [null]);
});

test('core:multiMap:putArray', t => {
	const map = new MultiMap();
	t.is(map.put('foo', ['bar', 'bam']), map);
	t.deepEqual(map.value('foo'), ['bar', 'bam']);
});

test('core:multiMap:remove', t => {
	const map = new MultiMap();
	t.is(map.put('foo', 'bar'), map);
	t.deepEqual(map.remove('foo'), ['bar']);
	t.true(map.isEmpty());
});

test('core:multiMap:remove:missingKey', t => {
	const map = new MultiMap();
	t.true(map.remove('foo') === undefined);
});

test('core:multiMap:add', t => {
    const map = new MultiMap();
    t.is(map.add('foo', 'bar'), map);
    t.is(map.add('foo', 'bum'), map);
    t.deepEqual(map.value('foo'), ['bar', 'bum']);
});

test('core:multiMap:addArray', t => {
    const map = new MultiMap();
    t.is(map.add('foo', 'bar'), map);
    t.is(map.add('foo', ['bum', 'bum']), map);
    t.deepEqual(map.value('foo'), ['bar', 'bum', 'bum']);
});

test('core:multiMap:firstValue:undefined', t => {
	const map = new MultiMap();
	t.true(map.firstValue('foo') === undefined);
});

test('core:multiMap:firstValue:single', t => {
	const map = new MultiMap();
	map.put('foo', 'bar');
	t.is(map.firstValue('foo'), 'bar');
});

test('core:multiMap:firstValue:singleCaseInsensitive', t => {
	const map = new MultiMap();
	map.put('FOO', 'bar');
	t.is(map.firstValue('foo'), 'bar');
});

test('core:multiMap:firstValue:array', t => {
	const map = new MultiMap();
	map.put('foo', ['bim', 'bam']);
	t.is(map.firstValue('foo'), 'bim');
});

test('core:multiMap:putAll', t => {
	const map = new MultiMap();
	t.is(map.putAll({foo:'bar', bim:'bam'}), map);
	t.deepEqual(map.value('foo'), ['bar']);
	t.deepEqual(map.value('bim'), ['bam']);
});

test('core:multiMap:putAllWithArray', t => {
	const map = new MultiMap();
	t.is(map.putAll({foo:'bar', bim:['bam', 'bum']}), map);
	t.deepEqual(map.value('foo'), ['bar']);
	t.deepEqual(map.value('bim'), ['bam', 'bum']);
});

test('core:multiMap:size:empty', t => {
	const map = new MultiMap();
	t.is(map.size(), 0);
});

test('core:multiMap:size:single', t => {
	const map = new MultiMap();
	map.put('foo', 'bar');
	t.is(map.size(), 1);
});

test('core:multiMap:size:multi', t => {
	const map = new MultiMap();
	map.putAll({foo:'bar', bim:['bam', 'bum']});
	t.is(map.size(), 2);
});

test('core:multiMap:clear:empty', t => {
	const map = new MultiMap();
	t.is(map.clear(), map);
	t.is(map.size(), 0);
});

test('core:multiMap:clear:multi', t => {
	const map = new MultiMap();
	map.putAll({foo:'bar', bim:['bam', 'bum']});
	t.is(map.clear(), map);
	t.is(map.size(), 0);
});

test('core:multiMap:isEmpty:empty', t => {
	const map = new MultiMap();
	t.true(map.isEmpty());
});

test('core:multiMap:isEmpty:not', t => {
	const map = new MultiMap();
	map.put('foo', 'bar');
	t.false(map.isEmpty());
});

test('core:multiMap:isEmpty:afterClear', t => {
	const map = new MultiMap();
	map.put('foo', 'bar');
	t.false(map.isEmpty());
	map.clear();
	t.true(map.isEmpty());
});

test('core:multiMap:keySet:empty', t => {
	const map = new MultiMap();
	t.deepEqual(map.keySet(), []);
});

test('core:multiMap:keySet:single', t => {
	const map = new MultiMap();
	map.put('foo', 'bar');
	t.deepEqual(map.keySet(), ['foo']);
});

test('core:multiMap:keySet:multi', t => {
	const map = new MultiMap();
	map.putAll({Foo:'bar', Bim:['bam', 'bum'], Baz:'done'});
	t.deepEqual(map.keySet(), ['Foo', 'Bim', 'Baz']);
});

test('core:multiMap:containsKey', t => {
	const map = new MultiMap();
	map.put('foo', 'bar');
	t.true(map.containsKey('foo'), 'case match');
	t.true(map.containsKey('FoO'), 'case insensitive match');
	t.false(map.containsKey('bar'));
});

