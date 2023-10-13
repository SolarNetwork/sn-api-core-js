import test from "ava";

import { utcHour, utcDay } from "d3-time";
import {
	iso8601Date,
	rollingQueryDateRange,
	seasonForDate,
} from "../../main/util/dates.js";
import Aggregations from "../../main/domain/aggregation.js";

test("rollingQueryDateRange:currentEndDate", (t) => {
	const hourEnd = utcHour.ceil(new Date());
	const hourStart = utcDay.offset(hourEnd, -1);
	const range = rollingQueryDateRange(Aggregations.Hour, 1);
	t.deepEqual(range, {
		timeUnit: Aggregations.Day,
		timeCount: 1,
		start: hourStart,
		end: hourEnd,
		aggregate: Aggregations.Hour,
	});
});

test("rollingQueryDateRange:minutes:count", (t) => {
	const end = new Date("2017-01-01T12:12:12.123Z");
	const range = rollingQueryDateRange(Aggregations.TenMinute, 2, end);
	t.deepEqual(range, {
		timeUnit: Aggregations.Hour,
		timeCount: 2,
		start: new Date("2017-01-01T10:20:00.000Z"),
		end: new Date("2017-01-01T12:20:00.000Z"),
		aggregate: Aggregations.TenMinute,
	});
});

test("rollingQueryDateRange:minutes:config", (t) => {
	const end = new Date("2017-01-01T12:12:12.123Z");
	const range = rollingQueryDateRange(
		Aggregations.TenMinute,
		{ numHours: 2 },
		end
	);
	t.deepEqual(range, {
		timeUnit: Aggregations.Hour,
		timeCount: 2,
		start: new Date("2017-01-01T10:20:00.000Z"),
		end: new Date("2017-01-01T12:20:00.000Z"),
		aggregate: Aggregations.TenMinute,
	});
});

test("rollingQueryDateRange:hours:count", (t) => {
	const end = new Date("2017-01-01T12:12:12.123Z");
	const range = rollingQueryDateRange(Aggregations.Hour, 2, end);
	t.deepEqual(range, {
		timeUnit: Aggregations.Day,
		timeCount: 2,
		start: new Date("2016-12-30T13:00:00.000Z"),
		end: new Date("2017-01-01T13:00:00.000Z"),
		aggregate: Aggregations.Hour,
	});
});

test("rollingQueryDateRange:hours:count:exactEnd", (t) => {
	const end = new Date("2017-01-01T12:00:00.000Z");
	const range = rollingQueryDateRange(Aggregations.Hour, 2, end);
	t.deepEqual(
		range,
		{
			timeUnit: Aggregations.Day,
			timeCount: 2,
			start: new Date("2016-12-30T13:00:00.000Z"),
			end: new Date("2017-01-01T13:00:00.000Z"),
			aggregate: Aggregations.Hour,
		},
		"two days worth using exclusive end date rolled forward from exact input end date"
	);
});

test("rollingQueryDateRange:hours:config", (t) => {
	const end = new Date("2017-01-01T12:12:12.123Z");
	const range = rollingQueryDateRange(Aggregations.Hour, { numDays: 2 }, end);
	t.deepEqual(range, {
		timeUnit: Aggregations.Day,
		timeCount: 2,
		start: new Date("2016-12-30T13:00:00.000Z"),
		end: new Date("2017-01-01T13:00:00.000Z"),
		aggregate: Aggregations.Hour,
	});
});

test("rollingQueryDateRange:hours:config:propUndefined", (t) => {
	const end = new Date("2017-01-01T12:12:12.123Z");
	const range = rollingQueryDateRange(
		Aggregations.Hour,
		{ numYears: 1 },
		end
	);
	t.deepEqual(
		range,
		{
			timeUnit: Aggregations.Day,
			timeCount: 1,
			start: new Date("2016-12-31T13:00:00.000Z"),
			end: new Date("2017-01-01T13:00:00.000Z"),
			aggregate: Aggregations.Hour,
		},
		"one day used when numDays config property missing"
	);
});

test("rollingQueryDateRange:hours:config:undefined", (t) => {
	const end = new Date("2017-01-01T12:12:12.123Z");
	const range = rollingQueryDateRange(
		Aggregations.Hour,
		undefined as any,
		end
	);
	t.deepEqual(
		range,
		{
			timeUnit: Aggregations.Day,
			timeCount: 1,
			start: new Date("2016-12-31T13:00:00.000Z"),
			end: new Date("2017-01-01T13:00:00.000Z"),
			aggregate: Aggregations.Hour,
		},
		"one day used when undefined passed"
	);
});

test("rollingQueryDateRange:hours:config:nan", (t) => {
	const end = new Date("2017-01-01T12:12:12.123Z");
	const range = rollingQueryDateRange(
		Aggregations.Hour,
		{ numDays: "foo" as any },
		end
	);
	t.deepEqual(
		range,
		{
			timeUnit: Aggregations.Day,
			timeCount: 1,
			start: new Date("2016-12-31T13:00:00.000Z"),
			end: new Date("2017-01-01T13:00:00.000Z"),
			aggregate: Aggregations.Hour,
		},
		"one day used when config prop not a number"
	);
});

test("rollingQueryDateRange:days:count", (t) => {
	const end = new Date("2017-01-01T12:12:12.123Z");
	const range = rollingQueryDateRange(Aggregations.Day, 2, end);
	t.deepEqual(range, {
		timeUnit: Aggregations.Month,
		timeCount: 2,
		start: new Date("2016-11-01T00:00:00.000Z"),
		end: new Date("2017-01-02T00:00:00.000Z"),
		aggregate: Aggregations.Day,
	});
});

test("rollingQueryDateRange:days:config", (t) => {
	const end = new Date("2017-01-01T12:12:12.123Z");
	const range = rollingQueryDateRange(
		Aggregations.Day,
		{ numMonths: 2 },
		end
	);
	t.deepEqual(range, {
		timeUnit: Aggregations.Month,
		timeCount: 2,
		start: new Date("2016-11-01T00:00:00.000Z"),
		end: new Date("2017-01-02T00:00:00.000Z"),
		aggregate: Aggregations.Day,
	});
});

test("rollingQueryDateRange:months:count", (t) => {
	const end = new Date("2017-01-01T12:12:12.123Z");
	const range = rollingQueryDateRange(Aggregations.Month, 2, end);
	t.deepEqual(range, {
		timeUnit: Aggregations.Year,
		timeCount: 2,
		start: new Date("2015-01-01T00:00:00.000Z"),
		end: new Date("2017-02-01T00:00:00.000Z"),
		aggregate: Aggregations.Month,
	});
});

test("rollingQueryDateRange:months:config", (t) => {
	const end = new Date("2017-01-01T12:12:12.123Z");
	const range = rollingQueryDateRange(
		Aggregations.Month,
		{ numYears: 2 },
		end
	);
	t.deepEqual(range, {
		timeUnit: Aggregations.Year,
		timeCount: 2,
		start: new Date("2015-01-01T00:00:00.000Z"),
		end: new Date("2017-02-01T00:00:00.000Z"),
		aggregate: Aggregations.Month,
	});
});

test("iso8601Date:date", (t) => {
	const date = new Date("2017-11-22T12:34:56.789Z");
	const result = iso8601Date(date);
	t.is(result, "20171122");
});

test("iso8601Date:date:zeroPad", (t) => {
	const date = new Date("2017-01-02T12:34:56.789Z");
	const result = iso8601Date(date);
	t.is(result, "20170102", "month and year padded with zeros");
});
test("iso8601Date:timestamp", (t) => {
	const date = new Date("2017-01-02T12:34:56.789Z");
	const result = iso8601Date(date, true);
	t.is(result, "20170102T123456Z");
});

test("iso8601Date:timestamp:zeroPad", (t) => {
	const date = new Date("2017-01-02T01:02:03.789Z");
	const result = iso8601Date(date, true);
	t.is(result, "20170102T010203Z", "hour, minute, second padded with zeros");
});

test("seasonForDate:date", (t) => {
	t.is(seasonForDate(new Date("2023-03-01")), 0);
	t.is(seasonForDate(new Date("2023-04-01")), 0);
	t.is(seasonForDate(new Date("2023-05-01")), 0);
	t.is(seasonForDate(new Date("2023-06-01")), 1);
	t.is(seasonForDate(new Date("2023-07-01")), 1);
	t.is(seasonForDate(new Date("2023-08-01")), 1);
	t.is(seasonForDate(new Date("2023-09-01")), 2);
	t.is(seasonForDate(new Date("2023-10-01")), 2);
	t.is(seasonForDate(new Date("2023-11-01")), 2);
	t.is(seasonForDate(new Date("2023-12-01")), 3);
	t.is(seasonForDate(new Date("2024-01-01")), 3);
	t.is(seasonForDate(new Date("2024-02-01")), 3);
});

test("seasonForDate:date:UTC", (t) => {
	t.is(seasonForDate(new Date(Date.UTC(2023, 2, 1))), 0);
	t.is(seasonForDate(new Date(Date.UTC(2023, 3, 1))), 0);
	t.is(seasonForDate(new Date(Date.UTC(2023, 4, 1))), 0);
	t.is(seasonForDate(new Date(Date.UTC(2023, 5, 1))), 1);
	t.is(seasonForDate(new Date(Date.UTC(2023, 6, 1))), 1);
	t.is(seasonForDate(new Date(Date.UTC(2023, 7, 1))), 1);
	t.is(seasonForDate(new Date(Date.UTC(2023, 8, 1))), 2);
	t.is(seasonForDate(new Date(Date.UTC(2023, 9, 1))), 2);
	t.is(seasonForDate(new Date(Date.UTC(2023, 10, 1))), 2);
	t.is(seasonForDate(new Date(Date.UTC(2023, 11, 1))), 3);
	t.is(seasonForDate(new Date(Date.UTC(2024, 0, 1))), 3);
	t.is(seasonForDate(new Date(Date.UTC(2024, 1, 1))), 3);
});

test("seasonForDate:num", (t) => {
	t.is(seasonForDate(2), 0);
	t.is(seasonForDate(3), 0);
	t.is(seasonForDate(4), 0);
	t.is(seasonForDate(5), 1);
	t.is(seasonForDate(6), 1);
	t.is(seasonForDate(7), 1);
	t.is(seasonForDate(8), 2);
	t.is(seasonForDate(9), 2);
	t.is(seasonForDate(10), 2);
	t.is(seasonForDate(11), 3);
	t.is(seasonForDate(0), 3);
	t.is(seasonForDate(1), 3);
});
