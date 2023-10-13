import test from "ava";

import moment from "moment";

import {
	dateFormat,
	dateParser,
	dateTimeFormat,
	dateTimeUrlFormat,
	dateUrlFormat,
	localDateUrlFormat,
	seasonForDate,
	timestampFormat,
} from "../../main/util/dates.js";

const kTestDate = new Date("2017-01-01T12:12:12.123Z");

test("dateTime", (t) => {
	const s = dateFormat(kTestDate);
	t.is(s, "2017-01-01");
});

test("dateTimeFormat", (t) => {
	const s = dateTimeFormat(kTestDate);
	t.is(s, "2017-01-01 12:12");
});

test("dateTimeFormatURL", (t) => {
	const s = dateTimeUrlFormat(kTestDate);
	t.is(s, "2017-01-01T12:12");
});

test("timestamp", (t) => {
	const s = timestampFormat(kTestDate);
	t.is(s, "2017-01-01 12:12:12.123Z");
});

test("dateParser:dateTimeURL", (t) => {
	const d = dateParser("2017-01-01T12:12");
	t.truthy(d, "date parsed");
	t.is(d?.getTime(), new Date("2017-01-01T12:12Z").getTime());
});

test("dateParser:timestamp", (t) => {
	const d = dateParser("2017-01-01 12:12:12.123Z");
	t.truthy(d, "date parsed");
	t.is(d?.getTime(), kTestDate.getTime());
});

test("dateParser:dateTime", (t) => {
	const d = dateParser("2017-01-01 12:12");
	t.truthy(d, "date parsed");
	t.is(d?.getTime(), new Date("2017-01-01T12:12Z").getTime());
});

test("dateParser:date", (t) => {
	const d = dateParser("2017-01-01");
	t.truthy(d, "date parsed");
	t.is(d?.getTime(), new Date("2017-01-01").getTime());
});

test("seasonForDate:autumn", (t) => {
	const d = moment("2017-03-01 00Z");
	const end = moment("2017-06-01 00Z");
	while (d.isBefore(end)) {
		const s = seasonForDate(d.toDate());
		t.is(s, 0, d.utc().format() + " is autumn");
		d.add(1, "M");
	}
});

test("seasonForDate:winter", (t) => {
	const d = moment("2017-06-01 00Z");
	const end = moment("2017-09-01 00Z");
	while (d.isBefore(end)) {
		const s = seasonForDate(d.toDate());
		t.is(s, 1, d.utc().format() + " is winter");
		d.add(1, "M");
	}
});

test("seasonForDate:spring", (t) => {
	const d = moment("2017-09-01 00Z");
	const end = moment("2017-12-01 00Z");
	while (d.isBefore(end)) {
		const s = seasonForDate(d.toDate());
		t.is(s, 2, d.utc().format() + " is spring");
		d.add(1, "M");
	}
});

test("seasonForDate:summer", (t) => {
	const d = moment("2017-12-01 00Z");
	const end = moment("2018-03-01 00Z");
	while (d.isBefore(end)) {
		const s = seasonForDate(d.toDate());
		t.is(s, 3, d.utc().format() + " is summer");
		d.add(1, "M");
	}
});

test("dateUrlFormat:full", (t) => {
	t.is(
		dateUrlFormat(new Date(Date.UTC(2024, 0, 1, 2, 3))),
		"2024-01-01T02:03"
	);
});

test("dateUrlFormat:short", (t) => {
	t.is(dateUrlFormat(new Date(Date.UTC(2024, 0, 1))), "2024-01-01");
});

test("localDateUrlFormat:full", (t) => {
	t.is(
		localDateUrlFormat(new Date("2024-01-02T03:04:05.678")),
		"2024-01-02T03:04"
	);
});

test("localDateUrlFormat:short", (t) => {
	t.is(localDateUrlFormat(new Date("2024-01-02T00:00:05.678")), "2024-01-02");
});
