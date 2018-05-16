import test from 'ava';

import Aggregations from 'domain/aggregation';

import {
    timeNormalizeDataArray,
} from 'data/array'

test('data:array:timeNormalizeDataArray:simple', t => {
    const queryData = [
        {date : new Date('2018-05-05T11:00Z'), Generation : 357, Consumption: 345},
        {date : new Date('2018-05-05T12:00Z'), Generation : 1023, Consumption: 678}
    ];
    timeNormalizeDataArray(queryData, Aggregations.ThirtyMinute);
    t.deepEqual(queryData, [
        {date : new Date('2018-05-05T11:00Z'), Generation : 357, Consumption: 345},
        {date : new Date('2018-05-05T11:30Z'), Generation : null, Consumption: null},
        {date : new Date('2018-05-05T12:00Z'), Generation : 1023, Consumption: 678}
    ]);
});

test('data:array:timeNormalizeDataArray:fillMulti', t => {
    const queryData = [
        {date : new Date('2018-05-05T11:00Z'), Generation : 357, Consumption: 345},
        {date : new Date('2018-05-05T12:00Z'), Generation : 1023, Consumption: 678}
    ];
    timeNormalizeDataArray(queryData, Aggregations.FifteenMinute);
    t.deepEqual(queryData, [
        {date : new Date('2018-05-05T11:00Z'), Generation : 357, Consumption: 345},
        {date : new Date('2018-05-05T11:15Z'), Generation : null, Consumption: null},
        {date : new Date('2018-05-05T11:30Z'), Generation : null, Consumption: null},
        {date : new Date('2018-05-05T11:45Z'), Generation : null, Consumption: null},
        {date : new Date('2018-05-05T12:00Z'), Generation : 1023, Consumption: 678}
    ]);
});
