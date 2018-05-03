import test from 'ava';

import { rollingQueryDateRange } from 'util/date'
import Aggregations from 'domain/aggregation';

test('util:date:rollingQueryDateRange:minutes:count', t => {
    const end = new Date('2017-01-01T12:12:12.123Z');
    const range = rollingQueryDateRange(Aggregations.TenMinute, 2, end);
    t.deepEqual(range, {
        timeUnit: Aggregations.Hour,
        timeCount: 2,
        start: new Date('2017-01-01T10:20:00.000Z'),
        end: new Date('2017-01-01T12:20:00.000Z'),
        aggregate: Aggregations.TenMinute
    });
});

test('util:date:rollingQueryDateRange:minutes:config', t => {
    const end = new Date('2017-01-01T12:12:12.123Z');
    const range = rollingQueryDateRange(Aggregations.TenMinute, {numHours:2}, end);
    t.deepEqual(range, {
        timeUnit: Aggregations.Hour,
        timeCount: 2,
        start: new Date('2017-01-01T10:20:00.000Z'),
        end: new Date('2017-01-01T12:20:00.000Z'),
        aggregate: Aggregations.TenMinute
    });
});

test('util:date:rollingQueryDateRange:hours:count', t => {
    const end = new Date('2017-01-01T12:12:12.123Z');
    const range = rollingQueryDateRange(Aggregations.Hour, 2, end);
    t.deepEqual(range, {
        timeUnit: Aggregations.Day,
        timeCount: 2,
        start: new Date('2016-12-30T13:00:00.000Z'),
        end: new Date('2017-01-01T13:00:00.000Z'),
        aggregate: Aggregations.Hour
    });
});

test('util:date:rollingQueryDateRange:hours:config', t => {
    const end = new Date('2017-01-01T12:12:12.123Z');
    const range = rollingQueryDateRange(Aggregations.Hour, {numDays:2}, end);
    t.deepEqual(range, {
        timeUnit: Aggregations.Day,
        timeCount: 2,
        start: new Date('2016-12-30T13:00:00.000Z'),
        end: new Date('2017-01-01T13:00:00.000Z'),
        aggregate: Aggregations.Hour
    });
});

test('util:date:rollingQueryDateRange:days:count', t => {
    const end = new Date('2017-01-01T12:12:12.123Z');
    const range = rollingQueryDateRange(Aggregations.Day, 2, end);
    t.deepEqual(range, {
        timeUnit: Aggregations.Month,
        timeCount: 2,
        start: new Date('2016-11-01T00:00:00.000Z'),
        end: new Date('2017-01-02T00:00:00.000Z'),
        aggregate: Aggregations.Day
    });
});

test('util:date:rollingQueryDateRange:days:config', t => {
    const end = new Date('2017-01-01T12:12:12.123Z');
    const range = rollingQueryDateRange(Aggregations.Day, {numMonths:2}, end);
    t.deepEqual(range, {
        timeUnit: Aggregations.Month,
        timeCount: 2,
        start: new Date('2016-11-01T00:00:00.000Z'),
        end: new Date('2017-01-02T00:00:00.000Z'),
        aggregate: Aggregations.Day
    });
});

test('util:date:rollingQueryDateRange:months:count', t => {
    const end = new Date('2017-01-01T12:12:12.123Z');
    const range = rollingQueryDateRange(Aggregations.Month, 2, end);
    t.deepEqual(range, {
        timeUnit: Aggregations.Year,
        timeCount: 2,
        start: new Date('2015-01-01T00:00:00.000Z'),
        end: new Date('2017-02-01T00:00:00.000Z'),
        aggregate: Aggregations.Month
    });
});

test('util:date:rollingQueryDateRange:months:config', t => {
    const end = new Date('2017-01-01T12:12:12.123Z');
    const range = rollingQueryDateRange(Aggregations.Month, {numYears:2}, end);
    t.deepEqual(range, {
        timeUnit: Aggregations.Year,
        timeCount: 2,
        start: new Date('2015-01-01T00:00:00.000Z'),
        end: new Date('2017-02-01T00:00:00.000Z'),
        aggregate: Aggregations.Month
    });
});
