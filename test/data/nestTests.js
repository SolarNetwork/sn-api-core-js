import test from 'ava';

import { aggregateNestedDataLayers, normalizeNestedStackDataByDate } from 'data/nest'

test('data:nest:aggregateNestedDataLayers:simple', t => {
    const layerData = [
        { key : 'A', values : [{watts : 123, foo : 1}, {watts : 234, foo : 2}] },
        { key : 'B', values : [{watts : 345, foo : 3}, {watts : 456, foo : 4}] }
    ];
    const result = aggregateNestedDataLayers(layerData, 'A and B', ['foo'], ['watts'], {'combined' : true});
    t.deepEqual(result, [
        { key : 'A and B', values : [{watts : 468, foo : 1, combined : true}, {watts : 690, foo : 2, combined : true}] }
    ]);
});

test('data:nest:normalizeNestedStackDataByDate:simple', t => {
    const layerData = [
        { key : 'A', values : [{date : new Date('2011-12-02 12:00')}, {date : new Date('2011-12-02 12:10')}] },
        { key : 'B', values : [{date : new Date('2011-12-02 12:00')}] }
    ];
    normalizeNestedStackDataByDate(layerData);
    t.deepEqual(layerData, [
        { key : 'A', values : [{date : new Date('2011-12-02 12:00')}, {date : new Date('2011-12-02 12:10')}] },
        { key : 'B', values : [{date : new Date('2011-12-02 12:00')}, {date : new Date('2011-12-02 12:10'), sourceId: 'B'}] }
    ]);
});
