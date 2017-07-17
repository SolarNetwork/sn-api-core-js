import test from 'ava';

import GeneralMetadata from 'generalMetadata';

test('core:generalMetadata:create:empty', t => {
    const meta = new GeneralMetadata();
    t.truthy(meta);
    t.is(meta.info, null);
    t.is(meta.propertyInfo, null);
    t.is(meta.tags, null);
});

test('core:generalMetadata:create:values', t => {
    const m = new Map();
    const pm = new Map();
    const tags = new Set();
    const meta = new GeneralMetadata(m, pm, tags);
    t.truthy(meta);
    t.is(meta.info, m);
    t.is(meta.propertyInfo, pm);
    t.is(meta.tags, tags);
});

test('core:generalMetadata:fromJsonEncoding', t => {
    const meta = GeneralMetadata.fromJsonEncoding('{"m":{"a":1},"pm":{"b":{"c":2}},"t":["3","4"]}');
    t.truthy(meta);
    t.is(meta.info.size, 1);
    t.is(meta.info.get('a'), 1);
    t.is(meta.propertyInfo.size, 1);
    t.is(meta.propertyInfo.get('b').size, 1);
    t.is(meta.propertyInfo.get('b').get('c'), 2);
    t.deepEqual(meta.tags, new Set(["3", "4"]));
});

test('core:generalMetadata:toJsonEncoding', t => {
    const m = new Map([['a', 1]]);
    const pm = new Map([['b', new Map([['c', 2]])]]);
    const tags = new Set(['3', '4']);
    const meta = new GeneralMetadata(m, pm, tags);
    const json = meta.toJsonEncoding();
    t.is(json, '{"m":{"a":1},"pm":{"b":{"c":2}},"t":["3","4"]}');
});
