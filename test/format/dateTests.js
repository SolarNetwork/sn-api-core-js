'use strict';

import test from 'ava';

import { dateTimeFormat, timestampFormat, dateFormat, dateTimeUrlFormat, dateParser } from 'format/date';

const kTestDate = new Date('2017-01-01T12:12:12.123Z');

test('core:format:dateTime', t => {
	const s = dateFormat(kTestDate);
	t.is(s, '2017-01-01');
});

test('core:format:dateTimeFormat', t => {
	const s = dateTimeFormat(kTestDate);
	t.is(s, '2017-01-01 12:12');
});

test('core:format:dateTimeFormatURL', t => {
	const s = dateTimeUrlFormat(kTestDate);
	t.is(s, '2017-01-01T12:12');
});

test('core:format:timestamp', t => {
	const s = timestampFormat(kTestDate);
	t.is(s, '2017-01-01 12:12:12.123Z');
});

test('core:format:dateParser:dateTimeURL', t => {
	const d = dateParser('2017-01-01T12:12');
	t.truthy(d, 'date parsed');
	t.is(d.getTime(), new Date('2017-01-01T12:12').getTime());
});

test('core:format:dateParser:timestamp', t => {
	const d = dateParser('2017-01-01 12:12:12.123Z');
	t.truthy(d, 'date parsed');
	t.is(d.getTime(), kTestDate.getTime());
});

test('core:format:dateParser:dateTime', t => {
	const d = dateParser('2017-01-01 12:12');
	t.truthy(d, 'date parsed');
	t.is(d.getTime(), new Date('2017-01-01T12:12').getTime());
});

test('core:format:dateParser:date', t => {
	const d = dateParser('2017-01-01');
	t.truthy(d, 'date parsed');
	t.is(d.getTime(), new Date('2017-01-01').getTime());
});
