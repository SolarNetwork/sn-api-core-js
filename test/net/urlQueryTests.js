'use strict';

import test from 'ava';

import { urlQueryParse, urlQueryEncode } from 'net/urlQuery';
import urlQuery from 'net/urlQuery';

test('core:net:urlQuery:encode:simple', t => {
	t.is(urlQueryEncode({foo:'bar'}), 'foo=bar');
});

test('core:net:urlQuery:encode:array', t => {
	t.is(urlQueryEncode({foo:['one','two']}), 'foo=one&foo=two');
});

test('core:net:urlQuery:encode:multi', t => {
	t.is(urlQueryEncode({foo:'bar', bim:'bam', life:42}), 'foo=bar&bim=bam&life=42');
});

test('core:net:urlQuery:encode:escaped', t => {
	t.is(urlQueryEncode({foo:'sn == crazy & cool!'}), 'foo=sn%20%3D%3D%20crazy%20%26%20cool!');
});

test('core:net:urlQuery:encode:custom', t => {
	t.is(urlQueryEncode({foo:'bar'}, function(v) { return v.toUpperCase(); }), 'FOO=BAR');
});

test('core:net:urlQuery:parse:simple', t => {
	t.deepEqual(urlQueryParse('foo=bar'), {foo:'bar'});
});

test('core:net:urlQuery:parse:array', t => {
	t.deepEqual(urlQueryParse('foo=one&foo=two'), {foo:['one','two']});
});

test('core:net:urlQuery:parse:multi', t => {
	t.deepEqual(urlQueryParse('foo=bar&bim=bam&life=42'), {foo:'bar', bim:'bam', life:'42'});
});

test('core:net:urlQuery:parse:escaped', t => {
	t.deepEqual(urlQueryParse('foo=sn%20%3D%3D%20crazy%20%26%20cool!'), {foo:'sn == crazy & cool!'});
});

test('core:net:urlQuery:defaultExport', t => {
	t.is(urlQuery.urlQueryParse, urlQueryParse);
	t.is(urlQuery.urlQueryEncode, urlQueryEncode);
});
