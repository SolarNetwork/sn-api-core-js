'use strict';

import test from 'ava';

import moment from 'moment';

import { dateTimeFormat, timestampFormat, dateFormat, dateTimeUrlFormat, dateParser, seasonForDate } from 'format/date';

const kTestDate = new Date('2017-01-01T12:12:12.123Z');

test('format:date:dateTime', t => {
	const s = dateFormat(kTestDate);
	t.is(s, '2017-01-01');
});

test('format:date:dateTimeFormat', t => {
	const s = dateTimeFormat(kTestDate);
	t.is(s, '2017-01-01 12:12');
});

test('format:date:dateTimeFormatURL', t => {
	const s = dateTimeUrlFormat(kTestDate);
	t.is(s, '2017-01-01T12:12');
});

test('format:date:timestamp', t => {
	const s = timestampFormat(kTestDate);
	t.is(s, '2017-01-01 12:12:12.123Z');
});

test('format:date:dateParser:dateTimeURL', t => {
	const d = dateParser('2017-01-01T12:12');
	t.truthy(d, 'date parsed');
	t.is(d.getTime(), new Date('2017-01-01T12:12').getTime());
});

test('format:date:dateParser:timestamp', t => {
	const d = dateParser('2017-01-01 12:12:12.123Z');
	t.truthy(d, 'date parsed');
	t.is(d.getTime(), kTestDate.getTime());
});

test('format:date:dateParser:dateTime', t => {
	const d = dateParser('2017-01-01 12:12');
	t.truthy(d, 'date parsed');
	t.is(d.getTime(), new Date('2017-01-01T12:12').getTime());
});

test('format:date:dateParser:date', t => {
	const d = dateParser('2017-01-01');
	t.truthy(d, 'date parsed');
	t.is(d.getTime(), new Date('2017-01-01').getTime());
});

test('format:date:seasonForDate:autumn', t => {
	const d = moment('2017-03-01 00Z');
	const end = moment('2017-06-01 00Z');
	while ( d.isBefore(end) ) {
		const s = seasonForDate(d.toDate());
		t.is(s, 0, d.utc().format() +' is autumn');
		d.add(1, 'M');
	}
});

test('format:date:seasonForDate:winter', t => {
	const d = moment('2017-06-01 00Z');
	const end = moment('2017-09-01 00Z');
	while ( d.isBefore(end) ) {
		const s = seasonForDate(d.toDate());
		t.is(s, 1, d.utc().format() +' is winter');
		d.add(1, 'M');
	}
});

test('format:date:seasonForDate:spring', t => {
	const d = moment('2017-09-01 00Z');
	const end = moment('2017-12-01 00Z');
	while ( d.isBefore(end) ) {
		const s = seasonForDate(d.toDate());
		t.is(s, 2, d.utc().format() +' is spring');
		d.add(1, 'M');
	}
});

test('format:date:seasonForDate:summer', t => {
	const d = moment('2017-12-01 00Z');
	const end = moment('2018-03-01 00Z');
	while ( d.isBefore(end) ) {
		const s = seasonForDate(d.toDate());
		t.is(s, 3, d.utc().format() +' is summer');
		d.add(1, 'M');
	}
});
