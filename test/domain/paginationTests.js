'use strict';

import test from 'ava';

import Pagination from 'domain/pagination';

test('core:pagination:create', t => {
    const p = new Pagination();
    t.is(p.max, 0);
    t.is(p.offset, 0);
});

test('core:pagination:create:max', t => {
    const p = new Pagination(1);
    t.is(p.max, 1);
    t.is(p.offset, 0);
});

test('core:pagination:create:maxAndOffset', t => {
    const p = new Pagination(1, 2);
    t.is(p.max, 1);
    t.is(p.offset, 2);
});

test('core:pagination:copy', t => {
    const p = new Pagination(50);
    const p2 = p.withOffset(100);
    t.is(p2.max, 50);
    t.is(p2.offset, 100);
});

test('core:pagination:toUriEncoded:empty', t => {
    const p = new Pagination();
    t.is(p.toUriEncoding(), '');
});

test('core:pagination:toUriEncoded:max', t => {
    const p = new Pagination(1);
    t.is(p.toUriEncoding(), 'max=1');
});

test('core:pagination:toUriEncoded:offset', t => {
    const p = new Pagination(0, 100);
    t.is(p.toUriEncoding(), 'offset=100');
});

test('core:pagination:toUriEncoded:maxAndOffset', t => {
    const p = new Pagination(50, 100);
    t.is(p.toUriEncoding(), 'max=50&offset=100');
});
