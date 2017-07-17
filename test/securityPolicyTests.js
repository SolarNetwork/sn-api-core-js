import test from 'ava';

import Aggregations from 'aggregation';
import LocationPrecisions from 'locationPrecision';
import { default as SecurityPolicy, SecurityPolicyBuilder } from 'securityPolicy';

test('core:securityPolicy:create', t => {
    const p = new SecurityPolicy();
    t.truthy(p);
});

test('core:securityPolicy:build:nodeIds:singleValue', t => {
    const b = new SecurityPolicyBuilder();
    b.withNodeIds(1);
    t.deepEqual(b.nodeIds, new Set([1]));
});

test('core:securityPolicy:build:nodeIds:arrayValue', t => {
    const b = new SecurityPolicyBuilder();
    b.withNodeIds([2, 3]);
    t.deepEqual(b.nodeIds, new Set([2, 3]));
});

test('core:securityPolicy:build:nodeIds:setValue', t => {
    const b = new SecurityPolicyBuilder();
    b.withNodeIds(new Set([3, 4, 5]));
    t.deepEqual(b.nodeIds, new Set([3, 4, 5]));
});

test('core:securityPolicy:build:nodeIds:undefinedValue', t => {
    const b = new SecurityPolicyBuilder();
    b.withNodeIds();
    t.is(b.nodeIds, null);
});

test('core:securityPolicy:build:nodeIds:emptyArrayValue', t => {
    const b = new SecurityPolicyBuilder();
    b.withNodeIds([]);
    t.is(b.nodeIds, null);
});

test('core:securityPolicy:build:nodeIds:emptySetValue', t => {
    const b = new SecurityPolicyBuilder();
    b.withNodeIds(new Set());
    t.is(b.nodeIds, null);
});

test('core:securityPolicy:build:nodeIds:nullValue', t => {
    const b = new SecurityPolicyBuilder();
    b.withNodeIds(null);
    t.is(b.nodeIds, null);
});

test('core:securityPolicy:build:nodeIds:add:singleValue', t => {
    const b = new SecurityPolicyBuilder();
    b.addNodeIds(1);
    t.deepEqual(b.nodeIds, new Set([1]));

    b.addNodeIds(2);
    t.deepEqual(b.nodeIds, new Set([1, 2]));
});

test('core:securityPolicy:build:nodeIds:add:arrayValue', t => {
    const b = new SecurityPolicyBuilder();
    b.addNodeIds([2, 3]);
    t.deepEqual(b.nodeIds, new Set([2, 3]));

    b.addNodeIds([3, 4]);
    t.deepEqual(b.nodeIds, new Set([2, 3, 4]));
});

test('core:securityPolicy:build:nodeIds:add:setValue', t => {
    const b = new SecurityPolicyBuilder();
    b.addNodeIds(new Set([1, 2]));
    t.deepEqual(b.nodeIds, new Set([1, 2]));

    b.addNodeIds(new Set([2, 3]));
    t.deepEqual(b.nodeIds, new Set([1, 2, 3]));
});

test('core:securityPolicy:build:nodeIds:add:undefinedValue', t => {
    const b = new SecurityPolicyBuilder();
    b.addNodeIds();
    t.is(b.nodeIds, null);

    b.withNodeIds(1);
    b.addNodeIds();
    t.deepEqual(b.nodeIds, new Set([1]));
});

test('core:securityPolicy:build:nodeIds:add:emptyArrayValue', t => {
    const b = new SecurityPolicyBuilder();
    b.addNodeIds([]);
    t.is(b.nodeIds, null);

    b.withNodeIds([1]);
    b.addNodeIds([]);
    t.deepEqual(b.nodeIds, new Set([1]));
});

test('core:securityPolicy:build:nodeIds:add:emptySetValue', t => {
    const b = new SecurityPolicyBuilder();
    b.addNodeIds(new Set());
    t.is(b.nodeIds, null);

    b.withNodeIds(new Set([1]));
    b.addNodeIds(new Set());
    t.deepEqual(b.nodeIds, new Set([1]));
});

test('core:securityPolicy:build:nodeIds:add:nullValue', t => {
    const b = new SecurityPolicyBuilder();
    b.addNodeIds(null);
    t.is(b.nodeIds, null);
});

test('core:securityPolicy:build:sourceIds:singleValue', t => {
    const b = new SecurityPolicyBuilder();
    b.withSourceIds('a');
    t.deepEqual(b.sourceIds, new Set(['a']));
});

test('core:securityPolicy:build:sourceIds:arrayValue', t => {
    const b = new SecurityPolicyBuilder();
    b.withSourceIds(['b', 'c']);
    t.deepEqual(b.sourceIds, new Set(['b', 'c']));
});

test('core:securityPolicy:build:sourceIds:setValue', t => {
    const b = new SecurityPolicyBuilder();
    b.withSourceIds(new Set(['b', 'c', 'd']));
    t.deepEqual(b.sourceIds, new Set(['b', 'c', 'd']));
});

test('core:securityPolicy:build:sourceIds:undefinedValue', t => {
    const b = new SecurityPolicyBuilder();
    b.withSourceIds();
    t.is(b.sourceIds, null);
});

test('core:securityPolicy:build:sourceIds:emptyArrayValue', t => {
    const b = new SecurityPolicyBuilder();
    b.withSourceIds([]);
    t.is(b.sourceIds, null);
});

test('core:securityPolicy:build:sourceIds:emptySetValue', t => {
    const b = new SecurityPolicyBuilder();
    b.withSourceIds(new Set());
    t.is(b.sourceIds, null);
});

test('core:securityPolicy:build:sourceIds:nullValue', t => {
    const b = new SecurityPolicyBuilder();
    b.withSourceIds(null);
    t.is(b.sourceIds, null);
});

test('core:securityPolicy:build:sourceIds:add:singleValue', t => {
    const b = new SecurityPolicyBuilder();
    b.addSourceIds('a');
    t.deepEqual(b.sourceIds, new Set(['a']));

    b.addSourceIds('b');
    t.deepEqual(b.sourceIds, new Set(['a', 'b']));
});

test('core:securityPolicy:build:sourceIds:add:arrayValue', t => {
    const b = new SecurityPolicyBuilder();
    b.addSourceIds(['a', 'b']);
    t.deepEqual(b.sourceIds, new Set(['a', 'b']));

    b.addSourceIds(['b', 'c']);
    t.deepEqual(b.sourceIds, new Set(['a', 'b', 'c']));
});

test('core:securityPolicy:build:sourceIds:add:setValue', t => {
    const b = new SecurityPolicyBuilder();
    b.addSourceIds(new Set(['a', 'b']));
    t.deepEqual(b.sourceIds, new Set(['a', 'b']));

    b.addSourceIds(new Set(['b', 'c']));
    t.deepEqual(b.sourceIds, new Set(['a', 'b', 'c']));
});

test('core:securityPolicy:build:sourceIds:add:undefinedValue', t => {
    const b = new SecurityPolicyBuilder();
    b.addSourceIds();
    t.is(b.sourceIds, null);

    b.withSourceIds('a');
    b.addSourceIds();
    t.deepEqual(b.sourceIds, new Set(['a']));
});

test('core:securityPolicy:build:sourceIds:add:emptyArrayValue', t => {
    const b = new SecurityPolicyBuilder();
    b.addSourceIds([]);
    t.is(b.sourceIds, null);

    b.withSourceIds(['a']);
    b.addSourceIds([]);
    t.deepEqual(b.sourceIds, new Set(['a']));
});

test('core:securityPolicy:build:sourceIds:add:emptySetValue', t => {
    const b = new SecurityPolicyBuilder();
    b.addSourceIds(new Set());
    t.is(b.sourceIds, null);

    b.withSourceIds(new Set(['a']));
    b.addSourceIds(new Set());
    t.deepEqual(b.sourceIds, new Set(['a']));
});

test('core:securityPolicy:build:sourceIds:add:nullValue', t => {
    const b = new SecurityPolicyBuilder();
    b.addSourceIds(null);
    t.is(b.sourceIds, null);
});

test('core:securityPolicy:build:aggregations:singleValue', t => {
    const b = new SecurityPolicyBuilder();
    b.withAggregations(Aggregations.Hour);
    t.deepEqual(b.aggregations, new Set([Aggregations.Hour]));
});

test('core:securityPolicy:build:aggregations:arrayValue', t => {
    const b = new SecurityPolicyBuilder();
    b.withAggregations([Aggregations.Hour, Aggregations.Month]);
    t.deepEqual(b.aggregations, new Set([Aggregations.Hour, Aggregations.Month]));
});

test('core:securityPolicy:build:aggregations:setValue', t => {
    const b = new SecurityPolicyBuilder();
    b.withAggregations(new Set([Aggregations.Hour, Aggregations.Month]));
    t.deepEqual(b.aggregations, new Set([Aggregations.Hour, Aggregations.Month]));
});

test('core:securityPolicy:build:aggregations:undefinedValue', t => {
    const b = new SecurityPolicyBuilder();
    b.withAggregations();
    t.is(b.aggregations, null);
});

test('core:securityPolicy:build:aggregations:emptyArrayValue', t => {
    const b = new SecurityPolicyBuilder();
    b.withAggregations([]);
    t.is(b.aggregations, null);
});

test('core:securityPolicy:build:aggregations:emptySetValue', t => {
    const b = new SecurityPolicyBuilder();
    b.withAggregations(new Set());
    t.is(b.aggregations, null);
});

test('core:securityPolicy:build:aggregations:nullValue', t => {
    const b = new SecurityPolicyBuilder();
    b.withAggregations(null);
    t.is(b.aggregations, null);
});

test('core:securityPolicy:build:aggregations:add:singleValue', t => {
    const b = new SecurityPolicyBuilder();
    b.addAggregations(Aggregations.Hour);
    t.deepEqual(b.aggregations, new Set([Aggregations.Hour]));

    b.addAggregations(Aggregations.Day);
    t.deepEqual(b.aggregations, new Set([Aggregations.Hour, Aggregations.Day]));
});

test('core:securityPolicy:build:aggregations:add:arrayValue', t => {
    const b = new SecurityPolicyBuilder();
    b.addAggregations([Aggregations.Hour, Aggregations.Day]);
    t.deepEqual(b.aggregations, new Set([Aggregations.Hour, Aggregations.Day]));

    b.addAggregations([Aggregations.Day, Aggregations.Month]);
    t.deepEqual(b.aggregations, new Set([Aggregations.Hour, Aggregations.Day, Aggregations.Month]));
});

test('core:securityPolicy:build:aggregations:add:setValue', t => {
    const b = new SecurityPolicyBuilder();
    b.addAggregations(new Set([Aggregations.Hour, Aggregations.Day]));
    t.deepEqual(b.aggregations, new Set([Aggregations.Hour, Aggregations.Day]));

    b.addAggregations(new Set([Aggregations.Day, Aggregations.Month]));
    t.deepEqual(b.aggregations, new Set([Aggregations.Hour, Aggregations.Day, Aggregations.Month]));
});

test('core:securityPolicy:build:aggregations:add:undefinedValue', t => {
    const b = new SecurityPolicyBuilder();
    b.addAggregations();
    t.is(b.aggregations, null);

    b.withAggregations(Aggregations.Hour);
    b.addAggregations();
    t.deepEqual(b.aggregations, new Set([Aggregations.Hour]));
});

test('core:securityPolicy:build:aggregations:add:emptyArrayValue', t => {
    const b = new SecurityPolicyBuilder();
    b.addAggregations([]);
    t.is(b.aggregations, null);

    b.withAggregations([Aggregations.Hour]);
    b.addAggregations([]);
    t.deepEqual(b.aggregations, new Set([Aggregations.Hour]));
});

test('core:securityPolicy:build:aggregations:add:emptySetValue', t => {
    const b = new SecurityPolicyBuilder();
    b.addAggregations(new Set());
    t.is(b.aggregations, null);

    b.withAggregations(new Set([Aggregations.Hour]));
    b.addAggregations(new Set());
    t.deepEqual(b.aggregations, new Set([Aggregations.Hour]));
});

test('core:securityPolicy:build:aggregations:add:nullValue', t => {
    const b = new SecurityPolicyBuilder();
    b.addAggregations(null);
    t.is(b.aggregations, null);
});

test('core:securityPolicy:build:locationPrecisions:singleValue', t => {
    const b = new SecurityPolicyBuilder();
    b.withLocationPrecisions(LocationPrecisions.Region);
    t.deepEqual(b.locationPrecisions, new Set([LocationPrecisions.Region]));
});

test('core:securityPolicy:build:locationPrecisions:arrayValue', t => {
    const b = new SecurityPolicyBuilder();
    b.withLocationPrecisions([LocationPrecisions.Region, LocationPrecisions.Country]);
    t.deepEqual(b.locationPrecisions, new Set([LocationPrecisions.Region, LocationPrecisions.Country]));
});

test('core:securityPolicy:build:locationPrecisions:setValue', t => {
    const b = new SecurityPolicyBuilder();
    b.withLocationPrecisions(new Set([LocationPrecisions.Region, LocationPrecisions.Country]));
    t.deepEqual(b.locationPrecisions, new Set([LocationPrecisions.Region, LocationPrecisions.Country]));
});

test('core:securityPolicy:build:locationPrecisions:undefinedValue', t => {
    const b = new SecurityPolicyBuilder();
    b.withLocationPrecisions();
    t.is(b.locationPrecisions, null);
});

test('core:securityPolicy:build:locationPrecisions:emptyArrayValue', t => {
    const b = new SecurityPolicyBuilder();
    b.withLocationPrecisions([]);
    t.is(b.locationPrecisions, null);
});

test('core:securityPolicy:build:locationPrecisions:emptySetValue', t => {
    const b = new SecurityPolicyBuilder();
    b.withLocationPrecisions(new Set());
    t.is(b.locationPrecisions, null);
});

test('core:securityPolicy:build:locationPrecisions:nullValue', t => {
    const b = new SecurityPolicyBuilder();
    b.withLocationPrecisions(null);
    t.is(b.locationPrecisions, null);
});

test('core:securityPolicy:build:locationPrecisions:add:singleValue', t => {
    const b = new SecurityPolicyBuilder();
    b.addLocationPrecisions(LocationPrecisions.Region);
    t.deepEqual(b.locationPrecisions, new Set([LocationPrecisions.Region]));

    b.addLocationPrecisions(LocationPrecisions.TimeZone);
    t.deepEqual(b.locationPrecisions, new Set([LocationPrecisions.Region, LocationPrecisions.TimeZone]));
});

test('core:securityPolicy:build:locationPrecisions:add:arrayValue', t => {
    const b = new SecurityPolicyBuilder();
    b.addLocationPrecisions([LocationPrecisions.Region, LocationPrecisions.TimeZone]);
    t.deepEqual(b.locationPrecisions, new Set([LocationPrecisions.Region, LocationPrecisions.TimeZone]));

    b.addLocationPrecisions([LocationPrecisions.TimeZone, LocationPrecisions.Country]);
    t.deepEqual(b.locationPrecisions, new Set([LocationPrecisions.Region, LocationPrecisions.TimeZone, LocationPrecisions.Country]));
});

test('core:securityPolicy:build:locationPrecisions:add:setValue', t => {
    const b = new SecurityPolicyBuilder();
    b.addLocationPrecisions(new Set([LocationPrecisions.Region, LocationPrecisions.TimeZone]));
    t.deepEqual(b.locationPrecisions, new Set([LocationPrecisions.Region, LocationPrecisions.TimeZone]));

    b.addLocationPrecisions(new Set([LocationPrecisions.TimeZone, LocationPrecisions.Country]));
    t.deepEqual(b.locationPrecisions, new Set([LocationPrecisions.Region, LocationPrecisions.TimeZone, LocationPrecisions.Country]));
});

test('core:securityPolicy:build:locationPrecisions:add:undefinedValue', t => {
    const b = new SecurityPolicyBuilder();
    b.addLocationPrecisions();
    t.is(b.locationPrecisions, null);

    b.withLocationPrecisions(LocationPrecisions.Region);
    b.addLocationPrecisions();
    t.deepEqual(b.locationPrecisions, new Set([LocationPrecisions.Region]));
});

test('core:securityPolicy:build:locationPrecisions:add:emptyArrayValue', t => {
    const b = new SecurityPolicyBuilder();
    b.addLocationPrecisions([]);
    t.is(b.locationPrecisions, null);

    b.withLocationPrecisions([LocationPrecisions.Region]);
    b.addLocationPrecisions([]);
    t.deepEqual(b.locationPrecisions, new Set([LocationPrecisions.Region]));
});

test('core:securityPolicy:build:locationPrecisions:add:emptySetValue', t => {
    const b = new SecurityPolicyBuilder();
    b.addLocationPrecisions(new Set());
    t.is(b.locationPrecisions, null);

    b.withLocationPrecisions(new Set([LocationPrecisions.Region]));
    b.addLocationPrecisions(new Set());
    t.deepEqual(b.locationPrecisions, new Set([LocationPrecisions.Region]));
});

test('core:securityPolicy:build:locationPrecisions:add:nullValue', t => {
    const b = new SecurityPolicyBuilder();
    b.addLocationPrecisions(null);
    t.is(b.locationPrecisions, null);
});

test('core:securityPolicy:build:nodeMetadataPaths:singleValue', t => {
    const b = new SecurityPolicyBuilder();
    b.withNodeMetadataPaths('a');
    t.deepEqual(b.nodeMetadataPaths, new Set(['a']));
});

test('core:securityPolicy:build:nodeMetadataPaths:arrayValue', t => {
    const b = new SecurityPolicyBuilder();
    b.withNodeMetadataPaths(['b', 'c']);
    t.deepEqual(b.nodeMetadataPaths, new Set(['b', 'c']));
});

test('core:securityPolicy:build:nodeMetadataPaths:setValue', t => {
    const b = new SecurityPolicyBuilder();
    b.withNodeMetadataPaths(new Set(['b', 'c', 'd']));
    t.deepEqual(b.nodeMetadataPaths, new Set(['b', 'c', 'd']));
});

test('core:securityPolicy:build:nodeMetadataPaths:undefinedValue', t => {
    const b = new SecurityPolicyBuilder();
    b.withNodeMetadataPaths();
    t.is(b.nodeMetadataPaths, null);
});

test('core:securityPolicy:build:nodeMetadataPaths:emptyArrayValue', t => {
    const b = new SecurityPolicyBuilder();
    b.withNodeMetadataPaths([]);
    t.is(b.nodeMetadataPaths, null);
});

test('core:securityPolicy:build:nodeMetadataPaths:emptySetValue', t => {
    const b = new SecurityPolicyBuilder();
    b.withNodeMetadataPaths(new Set());
    t.is(b.nodeMetadataPaths, null);
});

test('core:securityPolicy:build:nodeMetadataPaths:nullValue', t => {
    const b = new SecurityPolicyBuilder();
    b.withNodeMetadataPaths(null);
    t.is(b.nodeMetadataPaths, null);
});

test('core:securityPolicy:build:nodeMetadataPaths:add:singleValue', t => {
    const b = new SecurityPolicyBuilder();
    b.addNodeMetadataPaths('a');
    t.deepEqual(b.nodeMetadataPaths, new Set(['a']));

    b.addNodeMetadataPaths('b');
    t.deepEqual(b.nodeMetadataPaths, new Set(['a', 'b']));
});

test('core:securityPolicy:build:nodeMetadataPaths:add:arrayValue', t => {
    const b = new SecurityPolicyBuilder();
    b.addNodeMetadataPaths(['a', 'b']);
    t.deepEqual(b.nodeMetadataPaths, new Set(['a', 'b']));

    b.addNodeMetadataPaths(['b', 'c']);
    t.deepEqual(b.nodeMetadataPaths, new Set(['a', 'b', 'c']));
});

test('core:securityPolicy:build:nodeMetadataPaths:add:setValue', t => {
    const b = new SecurityPolicyBuilder();
    b.addNodeMetadataPaths(new Set(['a', 'b']));
    t.deepEqual(b.nodeMetadataPaths, new Set(['a', 'b']));

    b.addNodeMetadataPaths(new Set(['b', 'c']));
    t.deepEqual(b.nodeMetadataPaths, new Set(['a', 'b', 'c']));
});

test('core:securityPolicy:build:nodeMetadataPaths:add:undefinedValue', t => {
    const b = new SecurityPolicyBuilder();
    b.addNodeMetadataPaths();
    t.is(b.nodeMetadataPaths, null);

    b.withNodeMetadataPaths('a');
    b.addNodeMetadataPaths();
    t.deepEqual(b.nodeMetadataPaths, new Set(['a']));
});

test('core:securityPolicy:build:nodeMetadataPaths:add:emptyArrayValue', t => {
    const b = new SecurityPolicyBuilder();
    b.addNodeMetadataPaths([]);
    t.is(b.nodeMetadataPaths, null);

    b.withNodeMetadataPaths(['a']);
    b.addNodeMetadataPaths([]);
    t.deepEqual(b.nodeMetadataPaths, new Set(['a']));
});

test('core:securityPolicy:build:nodeMetadataPaths:add:emptySetValue', t => {
    const b = new SecurityPolicyBuilder();
    b.addNodeMetadataPaths(new Set());
    t.is(b.nodeMetadataPaths, null);

    b.withNodeMetadataPaths(new Set(['a']));
    b.addNodeMetadataPaths(new Set());
    t.deepEqual(b.nodeMetadataPaths, new Set(['a']));
});

test('core:securityPolicy:build:nodeMetadataPaths:add:nullValue', t => {
    const b = new SecurityPolicyBuilder();
    b.addNodeMetadataPaths(null);
    t.is(b.nodeMetadataPaths, null);
});

test('core:securityPolicy:build:userMetadataPaths:singleValue', t => {
    const b = new SecurityPolicyBuilder();
    b.withUserMetadataPaths('a');
    t.deepEqual(b.userMetadataPaths, new Set(['a']));
});

test('core:securityPolicy:build:userMetadataPaths:arrayValue', t => {
    const b = new SecurityPolicyBuilder();
    b.withUserMetadataPaths(['b', 'c']);
    t.deepEqual(b.userMetadataPaths, new Set(['b', 'c']));
});

test('core:securityPolicy:build:userMetadataPaths:setValue', t => {
    const b = new SecurityPolicyBuilder();
    b.withUserMetadataPaths(new Set(['b', 'c', 'd']));
    t.deepEqual(b.userMetadataPaths, new Set(['b', 'c', 'd']));
});

test('core:securityPolicy:build:userMetadataPaths:undefinedValue', t => {
    const b = new SecurityPolicyBuilder();
    b.withUserMetadataPaths();
    t.is(b.userMetadataPaths, null);
});

test('core:securityPolicy:build:userMetadataPaths:emptyArrayValue', t => {
    const b = new SecurityPolicyBuilder();
    b.withUserMetadataPaths([]);
    t.is(b.userMetadataPaths, null);
});

test('core:securityPolicy:build:userMetadataPaths:emptySetValue', t => {
    const b = new SecurityPolicyBuilder();
    b.withUserMetadataPaths(new Set());
    t.is(b.userMetadataPaths, null);
});

test('core:securityPolicy:build:userMetadataPaths:nullValue', t => {
    const b = new SecurityPolicyBuilder();
    b.withUserMetadataPaths(null);
    t.is(b.userMetadataPaths, null);
});

test('core:securityPolicy:build:userMetadataPaths:add:singleValue', t => {
    const b = new SecurityPolicyBuilder();
    b.addUserMetadataPaths('a');
    t.deepEqual(b.userMetadataPaths, new Set(['a']));

    b.addUserMetadataPaths('b');
    t.deepEqual(b.userMetadataPaths, new Set(['a', 'b']));
});

test('core:securityPolicy:build:userMetadataPaths:add:arrayValue', t => {
    const b = new SecurityPolicyBuilder();
    b.addUserMetadataPaths(['a', 'b']);
    t.deepEqual(b.userMetadataPaths, new Set(['a', 'b']));

    b.addUserMetadataPaths(['b', 'c']);
    t.deepEqual(b.userMetadataPaths, new Set(['a', 'b', 'c']));
});

test('core:securityPolicy:build:userMetadataPaths:add:setValue', t => {
    const b = new SecurityPolicyBuilder();
    b.addUserMetadataPaths(new Set(['a', 'b']));
    t.deepEqual(b.userMetadataPaths, new Set(['a', 'b']));

    b.addUserMetadataPaths(new Set(['b', 'c']));
    t.deepEqual(b.userMetadataPaths, new Set(['a', 'b', 'c']));
});

test('core:securityPolicy:build:userMetadataPaths:add:undefinedValue', t => {
    const b = new SecurityPolicyBuilder();
    b.addUserMetadataPaths();
    t.is(b.userMetadataPaths, null);

    b.withUserMetadataPaths('a');
    b.addUserMetadataPaths();
    t.deepEqual(b.userMetadataPaths, new Set(['a']));
});

test('core:securityPolicy:build:userMetadataPaths:add:emptyArrayValue', t => {
    const b = new SecurityPolicyBuilder();
    b.addUserMetadataPaths([]);
    t.is(b.userMetadataPaths, null);

    b.withUserMetadataPaths(['a']);
    b.addUserMetadataPaths([]);
    t.deepEqual(b.userMetadataPaths, new Set(['a']));
});

test('core:securityPolicy:build:userMetadataPaths:add:emptySetValue', t => {
    const b = new SecurityPolicyBuilder();
    b.addUserMetadataPaths(new Set());
    t.is(b.userMetadataPaths, null);

    b.withUserMetadataPaths(new Set(['a']));
    b.addUserMetadataPaths(new Set());
    t.deepEqual(b.userMetadataPaths, new Set(['a']));
});

test('core:securityPolicy:build:userMetadataPaths:add:nullValue', t => {
    const b = new SecurityPolicyBuilder();
    b.addUserMetadataPaths(null);
    t.is(b.userMetadataPaths, null);
});

test('core:securityPolicy:build:minAggregation', t => {
    const b = new SecurityPolicyBuilder();
    b.withMinAggregation(Aggregations.Month);
    t.is(b.minAggregation, Aggregations.Month);
});

test('core:securityPolicy:build:buildAggregations:min', t => {
    const b = new SecurityPolicyBuilder();
    b.withMinAggregation(Aggregations.Month);
    t.deepEqual(b.buildAggregations(), new Set([Aggregations.Month, Aggregations.RunningTotal]));
});

test('core:securityPolicy:build:buildAggregations:aggs', t => {
    const b = new SecurityPolicyBuilder();
    b.withAggregations(Aggregations.Month);
    t.deepEqual(b.buildAggregations(), new Set([Aggregations.Month]));
});

test('core:securityPolicy:build:buildAggregations:minTrumpsAggs', t => {
    const b = new SecurityPolicyBuilder();
    b.withMinAggregation(Aggregations.Week);
    b.withAggregations(Aggregations.Month);
    t.deepEqual(b.buildAggregations(), new Set([Aggregations.Week, Aggregations.WeekOfYear, 
        Aggregations.Month, Aggregations.RunningTotal]));
});

test('core:securityPolicy:build:minLocationPrecision', t => {
    const b = new SecurityPolicyBuilder();
    b.withMinLocationPrecision(LocationPrecisions.Country);
    t.is(b.minLocationPrecision, LocationPrecisions.Country);
});

test('core:securityPolicy:build:buildLocationPrecisions:min', t => {
    const b = new SecurityPolicyBuilder();
    b.withMinLocationPrecision(LocationPrecisions.TimeZone);
    t.deepEqual(b.buildLocationPrecisions(), new Set([LocationPrecisions.TimeZone, LocationPrecisions.Country]));
});

test('core:securityPolicy:build:buildAggregations:aggs', t => {
    const b = new SecurityPolicyBuilder();
    b.withLocationPrecisions(LocationPrecisions.Region);
    t.deepEqual(b.buildLocationPrecisions(), new Set([LocationPrecisions.Region]));
});

test('core:securityPolicy:build:buildAggregations:minTrumpsAggs', t => {
    const b = new SecurityPolicyBuilder();
    b.withMinLocationPrecision(LocationPrecisions.TimeZone);
    b.withLocationPrecisions(LocationPrecisions.Region);
    t.deepEqual(b.buildLocationPrecisions(), new Set([LocationPrecisions.TimeZone, LocationPrecisions.Country]));
});

test('core:securityPolicy:build:typical', t => {
    const result = new SecurityPolicyBuilder()
        .withNodeIds([1, 2])
        .withSourceIds(['a', 'b'])
        .withMinAggregation(Aggregations.Week)
        .withMinLocationPrecision(LocationPrecisions.TimeZone)
        .withNodeMetadataPaths(['c', 'd'])
        .withUserMetadataPaths(['e', 'f'])
        .build();
    t.deepEqual(result.nodeIds, new Set([1, 2]));
    t.deepEqual(result.sourceIds, new Set(['a', 'b']));
    t.is(result.minAggregation, Aggregations.Week);
    t.deepEqual(result.aggregations, new Set([Aggregations.Week, Aggregations.WeekOfYear, Aggregations.Month, Aggregations.RunningTotal]));
    t.is(result.minLocationPrecision, LocationPrecisions.TimeZone);
    t.deepEqual(result.locationPrecisions, new Set([LocationPrecisions.TimeZone, LocationPrecisions.Country]));
    t.deepEqual(result.nodeMetadataPaths, new Set(['c', 'd']));
    t.deepEqual(result.userMetadataPaths, new Set(['e', 'f']));
});

test('core:securityPolicy:build:withPolicy', t => {
    const policy = new SecurityPolicyBuilder()
        .withNodeIds([1, 2])
        .withSourceIds(['a', 'b'])
        .withMinAggregation(Aggregations.Week)
        .withMinLocationPrecision(LocationPrecisions.TimeZone)
        .withNodeMetadataPaths(['c', 'd'])
        .withUserMetadataPaths(['e', 'f'])
        .build();
    const result = new SecurityPolicyBuilder()
        .withPolicy(policy)
        .build();
    t.deepEqual(result.nodeIds, new Set([1, 2]));
    t.deepEqual(result.sourceIds, new Set(['a', 'b']));
    t.is(result.minAggregation, Aggregations.Week);
    t.deepEqual(result.aggregations, new Set([Aggregations.Week, Aggregations.WeekOfYear, Aggregations.Month, Aggregations.RunningTotal]));
    t.is(result.minLocationPrecision, LocationPrecisions.TimeZone);
    t.deepEqual(result.locationPrecisions, new Set([LocationPrecisions.TimeZone, LocationPrecisions.Country]));
    t.deepEqual(result.nodeMetadataPaths, new Set(['c', 'd']));
    t.deepEqual(result.userMetadataPaths, new Set(['e', 'f']));
});

test('core:securityPolicy:toJsonEncoding', t => {
    const result = new SecurityPolicyBuilder()
        .withNodeIds([1, 2])
        .withSourceIds(['a', 'b'])
        .withMinAggregation(Aggregations.Week)
        .withMinLocationPrecision(LocationPrecisions.TimeZone)
        .withNodeMetadataPaths(['c', 'd'])
        .withUserMetadataPaths(['e', 'f'])
        .build().toJsonEncoding();
    t.deepEqual(JSON.parse(result), {
        nodeIds: [1, 2],
        sourceIds: ['a', 'b'],
        minAggregation: 'Week',
        aggregations: ['Week', 'WeekOfYear', 'Month', 'RunningTotal'],
        minLocationPrecision: 'TimeZone',
        locationPrecisions: ['TimeZone', 'Country'],
        nodeMetadataPaths: ['c', 'd'],
        userMetadataPaths: ['e', 'f'],
    });
});
