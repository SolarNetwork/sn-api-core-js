import test from 'ava';

import SortDescriptor from 'domain/sortDescriptor';

test('core:sortDescriptor:create', t => {
    const s = new SortDescriptor('foo');
    t.truthy(s);
    t.is(s.key, 'foo');
    t.false(s.descending);
});

test('core:sortDescriptor:create:descending', t => {
    const s = new SortDescriptor('foo', true);
    t.is(s.key, 'foo');
    t.true(s.descending);
});

test('core:sortDescriptor:create:ascending', t => {
    const s = new SortDescriptor('foo', false);
    t.is(s.key, 'foo');
    t.false(s.descending);
});

test('core:sortDescriptor:toUriEncoding:ascending', t => {
    const s = new SortDescriptor('foo', false);
    t.is(s.toUriEncoding(), 'key=foo');
});

test('core:sortDescriptor:toUriEncoding:descending', t => {
    const s = new SortDescriptor('foo', true);
    t.is(s.toUriEncoding(), 'key=foo&descending=true');
});

test('core:sortDescriptor:toUriEncoding:indexed:ascending', t => {
    const s = new SortDescriptor('foo', false);
    t.is(s.toUriEncoding(0), 'sorts%5B0%5D.key=foo');
});

test('core:sortDescriptor:toUriEncoding:indexed:descending', t => {
    const s = new SortDescriptor('foo', true);
    t.is(s.toUriEncoding(0), 'sorts%5B0%5D.key=foo&sorts%5B0%5D.descending=true');
});

test('core:sortDescriptor:toUriEncoding:indexed:descending:customPropName', t => {
    const s = new SortDescriptor('foo', true);
    t.is(s.toUriEncoding(0, 'cookies'), 'cookies%5B0%5D.key=foo&cookies%5B0%5D.descending=true');
});
