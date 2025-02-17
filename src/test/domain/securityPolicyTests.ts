import test from "ava";

import Aggregations from "../../main/domain/aggregation.js";
import LocationPrecisions from "../../main/domain/locationPrecision.js";
import {
	default as SecurityPolicy,
	SecurityPolicyBuilder,
} from "../../main/domain/securityPolicy.js";

test("create", (t) => {
	const p = new SecurityPolicy();
	t.truthy(p);
});

test("build:nodeIds:singleValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.withNodeIds(1);
	t.deepEqual(b.nodeIds, new Set([1]));
});

test("build:nodeIds:arrayValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.withNodeIds([2, 3]);
	t.deepEqual(b.nodeIds, new Set([2, 3]));
});

test("build:nodeIds:setValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.withNodeIds(new Set([3, 4, 5]));
	t.deepEqual(b.nodeIds, new Set([3, 4, 5]));
});

test("build:nodeIds:undefinedValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.withNodeIds();
	t.is(b.nodeIds, undefined);
});

test("build:nodeIds:emptyArrayValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.withNodeIds([]);
	t.is(b.nodeIds, undefined);
});

test("build:nodeIds:emptySetValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.withNodeIds(new Set());
	t.is(b.nodeIds, undefined);
});

test("build:nodeIds:add:singleValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.addNodeIds(1);
	t.deepEqual(b.nodeIds, new Set([1]));

	b.addNodeIds(2);
	t.deepEqual(b.nodeIds, new Set([1, 2]));
});

test("build:nodeIds:add:arrayValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.addNodeIds([2, 3]);
	t.deepEqual(b.nodeIds, new Set([2, 3]));

	b.addNodeIds([3, 4]);
	t.deepEqual(b.nodeIds, new Set([2, 3, 4]));
});

test("build:nodeIds:add:setValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.addNodeIds(new Set([1, 2]));
	t.deepEqual(b.nodeIds, new Set([1, 2]));

	b.addNodeIds(new Set([2, 3]));
	t.deepEqual(b.nodeIds, new Set([1, 2, 3]));
});

test("build:nodeIds:add:undefinedValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.addNodeIds();
	t.is(b.nodeIds, undefined);

	b.withNodeIds(1);
	b.addNodeIds();
	t.deepEqual(b.nodeIds, new Set([1]));
});

test("build:nodeIds:add:emptyArrayValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.addNodeIds([]);
	t.is(b.nodeIds, undefined);

	b.withNodeIds([1]);
	b.addNodeIds([]);
	t.deepEqual(b.nodeIds, new Set([1]));
});

test("build:nodeIds:add:emptySetValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.addNodeIds(new Set());
	t.is(b.nodeIds, undefined);

	b.withNodeIds(new Set([1]));
	b.addNodeIds(new Set());
	t.deepEqual(b.nodeIds, new Set([1]));
});

test("build:nodeIds:add:undefinedValue:only", (t) => {
	const b = new SecurityPolicyBuilder();
	b.addNodeIds(undefined);
	t.is(b.nodeIds, undefined);
});

test("build:sourceIds:singleValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.withSourceIds("a");
	t.deepEqual(b.sourceIds, new Set(["a"]));
});

test("build:sourceIds:arrayValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.withSourceIds(["b", "c"]);
	t.deepEqual(b.sourceIds, new Set(["b", "c"]));
});

test("build:sourceIds:setValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.withSourceIds(new Set(["b", "c", "d"]));
	t.deepEqual(b.sourceIds, new Set(["b", "c", "d"]));
});

test("build:sourceIds:undefinedValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.withSourceIds(undefined);
	t.is(b.sourceIds, undefined);
});

test("build:sourceIds:emptyArrayValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.withSourceIds([]);
	t.is(b.sourceIds, undefined);
});

test("build:sourceIds:emptySetValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.withSourceIds(new Set());
	t.is(b.sourceIds, undefined);
});

test("build:sourceIds:add:singleValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.addSourceIds("a");
	t.deepEqual(b.sourceIds, new Set(["a"]));

	b.addSourceIds("b");
	t.deepEqual(b.sourceIds, new Set(["a", "b"]));
});

test("build:sourceIds:add:arrayValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.addSourceIds(["a", "b"]);
	t.deepEqual(b.sourceIds, new Set(["a", "b"]));

	b.addSourceIds(["b", "c"]);
	t.deepEqual(b.sourceIds, new Set(["a", "b", "c"]));
});

test("build:sourceIds:add:setValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.addSourceIds(new Set(["a", "b"]));
	t.deepEqual(b.sourceIds, new Set(["a", "b"]));

	b.addSourceIds(new Set(["b", "c"]));
	t.deepEqual(b.sourceIds, new Set(["a", "b", "c"]));
});

test("build:sourceIds:add:undefinedValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.addSourceIds();
	t.is(b.sourceIds, undefined);

	b.withSourceIds("a");
	b.addSourceIds();
	t.deepEqual(b.sourceIds, new Set(["a"]));
});

test("build:sourceIds:add:emptyArrayValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.addSourceIds([]);
	t.is(b.sourceIds, undefined);

	b.withSourceIds(["a"]);
	b.addSourceIds([]);
	t.deepEqual(b.sourceIds, new Set(["a"]));
});

test("build:sourceIds:add:emptySetValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.addSourceIds(new Set());
	t.is(b.sourceIds, undefined);

	b.withSourceIds(new Set(["a"]));
	b.addSourceIds(new Set());
	t.deepEqual(b.sourceIds, new Set(["a"]));
});

test("build:sourceIds:add:undefinedValue:only", (t) => {
	const b = new SecurityPolicyBuilder();
	b.addSourceIds(undefined);
	t.is(b.sourceIds, undefined);
});

test("build:aggregations:singleValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.withAggregations(Aggregations.Hour);
	t.deepEqual(b.aggregations, new Set([Aggregations.Hour]));
});

test("build:aggregations:arrayValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.withAggregations([Aggregations.Hour, Aggregations.Month]);
	t.deepEqual(
		b.aggregations,
		new Set([Aggregations.Hour, Aggregations.Month])
	);
});

test("build:aggregations:setValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.withAggregations(new Set([Aggregations.Hour, Aggregations.Month]));
	t.deepEqual(
		b.aggregations,
		new Set([Aggregations.Hour, Aggregations.Month])
	);
});

test("build:aggregations:string:singleValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.withAggregations("Hour");
	t.deepEqual(b.aggregations, new Set([Aggregations.Hour]));
});

test("build:aggregations:string:arrayValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.withAggregations(["Hour", "Month"]);
	t.deepEqual(
		b.aggregations,
		new Set([Aggregations.Hour, Aggregations.Month])
	);
});

test("build:aggregations:string:setValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.withAggregations(new Set(["Hour", "Month"]));
	t.deepEqual(
		b.aggregations,
		new Set([Aggregations.Hour, Aggregations.Month])
	);
});

test("build:aggregations:emptyArrayValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.withAggregations([]);
	t.is(b.aggregations, undefined);
});

test("build:aggregations:emptySetValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.withAggregations(new Set());
	t.is(b.aggregations, undefined);
});

test("build:aggregations:undefinedValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.withAggregations(undefined);
	t.is(b.aggregations, undefined);
});

test("build:aggregations:add:singleValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.addAggregations(Aggregations.Hour);
	t.deepEqual(b.aggregations, new Set([Aggregations.Hour]));

	b.addAggregations(Aggregations.Day);
	t.deepEqual(b.aggregations, new Set([Aggregations.Hour, Aggregations.Day]));
});

test("build:aggregations:add:arrayValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.addAggregations([Aggregations.Hour, Aggregations.Day]);
	t.deepEqual(b.aggregations, new Set([Aggregations.Hour, Aggregations.Day]));

	b.addAggregations([Aggregations.Day, Aggregations.Month]);
	t.deepEqual(
		b.aggregations,
		new Set([Aggregations.Hour, Aggregations.Day, Aggregations.Month])
	);
});

test("build:aggregations:add:setValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.addAggregations(new Set([Aggregations.Hour, Aggregations.Day]));
	t.deepEqual(b.aggregations, new Set([Aggregations.Hour, Aggregations.Day]));

	b.addAggregations(new Set([Aggregations.Day, Aggregations.Month]));
	t.deepEqual(
		b.aggregations,
		new Set([Aggregations.Hour, Aggregations.Day, Aggregations.Month])
	);
});

test("build:aggregations:add:string:singleValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.addAggregations("Hour");
	t.deepEqual(b.aggregations, new Set([Aggregations.Hour]));

	b.addAggregations("Day");
	t.deepEqual(b.aggregations, new Set([Aggregations.Hour, Aggregations.Day]));
});

test("build:aggregations:add:string:arrayValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.addAggregations(["Hour", "Day"]);
	t.deepEqual(b.aggregations, new Set([Aggregations.Hour, Aggregations.Day]));

	b.addAggregations(["Day", "Month"]);
	t.deepEqual(
		b.aggregations,
		new Set([Aggregations.Hour, Aggregations.Day, Aggregations.Month])
	);
});

test("build:aggregations:add:string:setValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.addAggregations(new Set(["Hour", "Day"]));
	t.deepEqual(b.aggregations, new Set([Aggregations.Hour, Aggregations.Day]));

	b.addAggregations(new Set(["Day", "Month"]));
	t.deepEqual(
		b.aggregations,
		new Set([Aggregations.Hour, Aggregations.Day, Aggregations.Month])
	);
});

test("build:aggregations:add:undefinedValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.addAggregations();
	t.is(b.aggregations, undefined);

	b.withAggregations(Aggregations.Hour);
	b.addAggregations();
	t.deepEqual(b.aggregations, new Set([Aggregations.Hour]));
});

test("build:aggregations:add:emptyArrayValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.addAggregations([]);
	t.is(b.aggregations, undefined);

	b.withAggregations([Aggregations.Hour]);
	b.addAggregations([]);
	t.deepEqual(b.aggregations, new Set([Aggregations.Hour]));
});

test("build:aggregations:add:emptySetValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.addAggregations(new Set());
	t.is(b.aggregations, undefined);

	b.withAggregations(new Set([Aggregations.Hour]));
	b.addAggregations(new Set());
	t.deepEqual(b.aggregations, new Set([Aggregations.Hour]));
});

test("build:aggregations:add:undefinedValue:only", (t) => {
	const b = new SecurityPolicyBuilder();
	b.addAggregations(undefined);
	t.is(b.aggregations, undefined);
});

test("build:locationPrecisions:singleValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.withLocationPrecisions(LocationPrecisions.Region);
	t.deepEqual(b.locationPrecisions, new Set([LocationPrecisions.Region]));
});

test("build:locationPrecisions:arrayValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.withLocationPrecisions([
		LocationPrecisions.Region,
		LocationPrecisions.Country,
	]);
	t.deepEqual(
		b.locationPrecisions,
		new Set([LocationPrecisions.Region, LocationPrecisions.Country])
	);
});

test("build:locationPrecisions:setValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.withLocationPrecisions(
		new Set([LocationPrecisions.Region, LocationPrecisions.Country])
	);
	t.deepEqual(
		b.locationPrecisions,
		new Set([LocationPrecisions.Region, LocationPrecisions.Country])
	);
});

test("build:locationPrecisions:emptyArrayValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.withLocationPrecisions([]);
	t.is(b.locationPrecisions, undefined);
});

test("build:locationPrecisions:emptySetValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.withLocationPrecisions(new Set());
	t.is(b.locationPrecisions, undefined);
});

test("build:locationPrecisions:undefinedValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.withLocationPrecisions(undefined);
	t.is(b.locationPrecisions, undefined);
});

test("build:locationPrecisions:add:singleValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.addLocationPrecisions(LocationPrecisions.Region);
	t.deepEqual(b.locationPrecisions, new Set([LocationPrecisions.Region]));

	b.addLocationPrecisions(LocationPrecisions.TimeZone);
	t.deepEqual(
		b.locationPrecisions,
		new Set([LocationPrecisions.Region, LocationPrecisions.TimeZone])
	);
});

test("build:locationPrecisions:add:arrayValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.addLocationPrecisions([
		LocationPrecisions.Region,
		LocationPrecisions.TimeZone,
	]);
	t.deepEqual(
		b.locationPrecisions,
		new Set([LocationPrecisions.Region, LocationPrecisions.TimeZone])
	);

	b.addLocationPrecisions([
		LocationPrecisions.TimeZone,
		LocationPrecisions.Country,
	]);
	t.deepEqual(
		b.locationPrecisions,
		new Set([
			LocationPrecisions.Region,
			LocationPrecisions.TimeZone,
			LocationPrecisions.Country,
		])
	);
});

test("build:locationPrecisions:add:setValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.addLocationPrecisions(
		new Set([LocationPrecisions.Region, LocationPrecisions.TimeZone])
	);
	t.deepEqual(
		b.locationPrecisions,
		new Set([LocationPrecisions.Region, LocationPrecisions.TimeZone])
	);

	b.addLocationPrecisions(
		new Set([LocationPrecisions.TimeZone, LocationPrecisions.Country])
	);
	t.deepEqual(
		b.locationPrecisions,
		new Set([
			LocationPrecisions.Region,
			LocationPrecisions.TimeZone,
			LocationPrecisions.Country,
		])
	);
});

test("build:locationPrecisions:add:undefinedValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.addLocationPrecisions();
	t.is(b.locationPrecisions, undefined);

	b.withLocationPrecisions(LocationPrecisions.Region);
	b.addLocationPrecisions();
	t.deepEqual(b.locationPrecisions, new Set([LocationPrecisions.Region]));
});

test("build:locationPrecisions:add:emptyArrayValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.addLocationPrecisions([]);
	t.is(b.locationPrecisions, undefined);

	b.withLocationPrecisions([LocationPrecisions.Region]);
	b.addLocationPrecisions([]);
	t.deepEqual(b.locationPrecisions, new Set([LocationPrecisions.Region]));
});

test("build:locationPrecisions:add:emptySetValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.addLocationPrecisions(new Set());
	t.is(b.locationPrecisions, undefined);

	b.withLocationPrecisions(new Set([LocationPrecisions.Region]));
	b.addLocationPrecisions(new Set());
	t.deepEqual(b.locationPrecisions, new Set([LocationPrecisions.Region]));
});

test("build:locationPrecisions:add:undefinedValue:only", (t) => {
	const b = new SecurityPolicyBuilder();
	b.addLocationPrecisions(undefined);
	t.is(b.locationPrecisions, undefined);
});

test("build:nodeMetadataPaths:singleValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.withNodeMetadataPaths("a");
	t.deepEqual(b.nodeMetadataPaths, new Set(["a"]));
});

test("build:nodeMetadataPaths:arrayValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.withNodeMetadataPaths(["b", "c"]);
	t.deepEqual(b.nodeMetadataPaths, new Set(["b", "c"]));
});

test("build:nodeMetadataPaths:setValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.withNodeMetadataPaths(new Set(["b", "c", "d"]));
	t.deepEqual(b.nodeMetadataPaths, new Set(["b", "c", "d"]));
});

test("build:nodeMetadataPaths:emptyArrayValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.withNodeMetadataPaths([]);
	t.is(b.nodeMetadataPaths, undefined);
});

test("build:nodeMetadataPaths:emptySetValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.withNodeMetadataPaths(new Set());
	t.is(b.nodeMetadataPaths, undefined);
});

test("build:nodeMetadataPaths:undefinedValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.withNodeMetadataPaths(undefined);
	t.is(b.nodeMetadataPaths, undefined);
});

test("build:nodeMetadataPaths:add:singleValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.addNodeMetadataPaths("a");
	t.deepEqual(b.nodeMetadataPaths, new Set(["a"]));

	b.addNodeMetadataPaths("b");
	t.deepEqual(b.nodeMetadataPaths, new Set(["a", "b"]));
});

test("build:nodeMetadataPaths:add:arrayValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.addNodeMetadataPaths(["a", "b"]);
	t.deepEqual(b.nodeMetadataPaths, new Set(["a", "b"]));

	b.addNodeMetadataPaths(["b", "c"]);
	t.deepEqual(b.nodeMetadataPaths, new Set(["a", "b", "c"]));
});

test("build:nodeMetadataPaths:add:setValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.addNodeMetadataPaths(new Set(["a", "b"]));
	t.deepEqual(b.nodeMetadataPaths, new Set(["a", "b"]));

	b.addNodeMetadataPaths(new Set(["b", "c"]));
	t.deepEqual(b.nodeMetadataPaths, new Set(["a", "b", "c"]));
});

test("build:nodeMetadataPaths:add:undefinedValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.addNodeMetadataPaths();
	t.is(b.nodeMetadataPaths, undefined);

	b.withNodeMetadataPaths("a");
	b.addNodeMetadataPaths();
	t.deepEqual(b.nodeMetadataPaths, new Set(["a"]));
});

test("build:nodeMetadataPaths:add:emptyArrayValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.addNodeMetadataPaths([]);
	t.is(b.nodeMetadataPaths, undefined);

	b.withNodeMetadataPaths(["a"]);
	b.addNodeMetadataPaths([]);
	t.deepEqual(b.nodeMetadataPaths, new Set(["a"]));
});

test("build:nodeMetadataPaths:add:emptySetValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.addNodeMetadataPaths(new Set());
	t.is(b.nodeMetadataPaths, undefined);

	b.withNodeMetadataPaths(new Set(["a"]));
	b.addNodeMetadataPaths(new Set());
	t.deepEqual(b.nodeMetadataPaths, new Set(["a"]));
});

test("build:nodeMetadataPaths:add:undefinedValue:only", (t) => {
	const b = new SecurityPolicyBuilder();
	b.addNodeMetadataPaths(undefined);
	t.is(b.nodeMetadataPaths, undefined);
});

test("build:userMetadataPaths:singleValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.withUserMetadataPaths("a");
	t.deepEqual(b.userMetadataPaths, new Set(["a"]));
});

test("build:userMetadataPaths:arrayValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.withUserMetadataPaths(["b", "c"]);
	t.deepEqual(b.userMetadataPaths, new Set(["b", "c"]));
});

test("build:userMetadataPaths:setValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.withUserMetadataPaths(new Set(["b", "c", "d"]));
	t.deepEqual(b.userMetadataPaths, new Set(["b", "c", "d"]));
});

test("build:userMetadataPaths:emptyArrayValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.withUserMetadataPaths([]);
	t.is(b.userMetadataPaths, undefined);
});

test("build:userMetadataPaths:emptySetValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.withUserMetadataPaths(new Set());
	t.is(b.userMetadataPaths, undefined);
});

test("build:userMetadataPaths:undefinedValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.withUserMetadataPaths(undefined);
	t.is(b.userMetadataPaths, undefined);
});

test("build:userMetadataPaths:add:singleValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.addUserMetadataPaths("a");
	t.deepEqual(b.userMetadataPaths, new Set(["a"]));

	b.addUserMetadataPaths("b");
	t.deepEqual(b.userMetadataPaths, new Set(["a", "b"]));
});

test("build:userMetadataPaths:add:arrayValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.addUserMetadataPaths(["a", "b"]);
	t.deepEqual(b.userMetadataPaths, new Set(["a", "b"]));

	b.addUserMetadataPaths(["b", "c"]);
	t.deepEqual(b.userMetadataPaths, new Set(["a", "b", "c"]));
});

test("build:userMetadataPaths:add:setValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.addUserMetadataPaths(new Set(["a", "b"]));
	t.deepEqual(b.userMetadataPaths, new Set(["a", "b"]));

	b.addUserMetadataPaths(new Set(["b", "c"]));
	t.deepEqual(b.userMetadataPaths, new Set(["a", "b", "c"]));
});

test("build:userMetadataPaths:add:undefinedValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.addUserMetadataPaths();
	t.is(b.userMetadataPaths, undefined);

	b.withUserMetadataPaths("a");
	b.addUserMetadataPaths();
	t.deepEqual(b.userMetadataPaths, new Set(["a"]));
});

test("build:userMetadataPaths:add:emptyArrayValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.addUserMetadataPaths([]);
	t.is(b.userMetadataPaths, undefined);

	b.withUserMetadataPaths(["a"]);
	b.addUserMetadataPaths([]);
	t.deepEqual(b.userMetadataPaths, new Set(["a"]));
});

test("build:userMetadataPaths:add:emptySetValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.addUserMetadataPaths(new Set());
	t.is(b.userMetadataPaths, undefined);

	b.withUserMetadataPaths(new Set(["a"]));
	b.addUserMetadataPaths(new Set());
	t.deepEqual(b.userMetadataPaths, new Set(["a"]));
});

test("build:userMetadataPaths:add:undefinedValue:only", (t) => {
	const b = new SecurityPolicyBuilder();
	b.addUserMetadataPaths(undefined);
	t.is(b.userMetadataPaths, undefined);
});

test("build:minAggregation", (t) => {
	const b = new SecurityPolicyBuilder();
	b.withMinAggregation(Aggregations.Month);
	t.is(b.minAggregation, Aggregations.Month);
});

test("build:minAggregation:string", (t) => {
	const b = new SecurityPolicyBuilder();
	b.withMinAggregation("Month");
	t.is(b.minAggregation, Aggregations.Month);
});

test("build:buildAggregations:min", (t) => {
	const b = new SecurityPolicyBuilder();
	b.withMinAggregation(Aggregations.Month);

	const policy = b.build();

	t.deepEqual(
		policy.aggregations,
		new Set([
			Aggregations.Month,
			Aggregations.Year,
			Aggregations.RunningTotal,
		])
	);
});

test("build:buildAggregations:aggs", (t) => {
	const b = new SecurityPolicyBuilder();
	b.withAggregations(Aggregations.Month);

	const policy = b.build();
	t.deepEqual(policy.aggregations, new Set([Aggregations.Month]));
});

test("build:buildAggregations:minTrumpsAggs", (t) => {
	const b = new SecurityPolicyBuilder();
	b.withMinAggregation(Aggregations.Week);
	b.withAggregations(Aggregations.Month);

	const policy = b.build();
	t.deepEqual(
		policy.aggregations,
		new Set([
			Aggregations.Week,
			Aggregations.WeekOfYear,
			Aggregations.Month,
			Aggregations.Year,
			Aggregations.RunningTotal,
		])
	);
});

test("build:minLocationPrecision", (t) => {
	const b = new SecurityPolicyBuilder();
	b.withMinLocationPrecision(LocationPrecisions.Country);
	t.is(b.minLocationPrecision, LocationPrecisions.Country);
});

test("build:minLocationPrecision:string", (t) => {
	const b = new SecurityPolicyBuilder();
	b.withMinLocationPrecision("Country");
	t.is(b.minLocationPrecision, LocationPrecisions.Country);
});

test("build:buildLocationPrecisions:min", (t) => {
	const b = new SecurityPolicyBuilder();
	b.withMinLocationPrecision(LocationPrecisions.TimeZone);

	const policy = b.build();
	t.deepEqual(
		policy.locationPrecisions,
		new Set([LocationPrecisions.TimeZone, LocationPrecisions.Country])
	);
});

test("build:buildLocationPrecisions:singleValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.withLocationPrecisions(LocationPrecisions.Region);

	const policy = b.build();
	t.deepEqual(
		policy.locationPrecisions,
		new Set([LocationPrecisions.Region])
	);
});

test("build:buildLocationPrecisions:arrayValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.withLocationPrecisions([
		LocationPrecisions.Region,
		LocationPrecisions.TimeZone,
	]);

	const policy = b.build();
	t.deepEqual(
		policy.locationPrecisions,
		new Set([LocationPrecisions.Region, LocationPrecisions.TimeZone])
	);
});

test("build:buildLocationPrecisions:setValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.withLocationPrecisions(
		new Set([LocationPrecisions.Region, LocationPrecisions.TimeZone])
	);

	const policy = b.build();
	t.deepEqual(
		policy.locationPrecisions,
		new Set([LocationPrecisions.Region, LocationPrecisions.TimeZone])
	);
});

test("build:buildLocationPrecisions:undefinedValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.withLocationPrecisions(undefined);

	const policy = b.build();
	t.is(policy.locationPrecisions, undefined);
});

test("build:buildLocationPrecisions:emptySetValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.withLocationPrecisions(new Set());

	const policy = b.build();
	t.is(policy.locationPrecisions, undefined);
});

test("build:buildLocationPrecisions:emptyArrayValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.withLocationPrecisions([]);

	const policy = b.build();
	t.is(policy.locationPrecisions, undefined);
});

test("build:buildLocationPrecisions::string:singleValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.withLocationPrecisions("Region");

	const policy = b.build();
	t.deepEqual(
		policy.locationPrecisions,
		new Set([LocationPrecisions.Region])
	);
});

test("build:buildLocationPrecisions:string:arrayValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.withLocationPrecisions(["Region", "TimeZone"]);

	const policy = b.build();
	t.deepEqual(
		policy.locationPrecisions,
		new Set([LocationPrecisions.Region, LocationPrecisions.TimeZone])
	);
});

test("build:buildLocationPrecisions:string:setValue", (t) => {
	const b = new SecurityPolicyBuilder();
	b.withLocationPrecisions(new Set(["Region", "TimeZone"]));

	const policy = b.build();
	t.deepEqual(
		policy.locationPrecisions,
		new Set([LocationPrecisions.Region, LocationPrecisions.TimeZone])
	);
});

test("build:buildLocationPrecisions:minTrumpsAggs", (t) => {
	const b = new SecurityPolicyBuilder();
	b.withMinLocationPrecision(LocationPrecisions.TimeZone);
	b.withLocationPrecisions(LocationPrecisions.Region);

	const policy = b.build();
	t.deepEqual(
		policy.locationPrecisions,
		new Set([LocationPrecisions.TimeZone, LocationPrecisions.Country])
	);
});

test("build:typical", (t) => {
	const result = new SecurityPolicyBuilder()
		.withNodeIds([1, 2])
		.withSourceIds(["a", "b"])
		.withMinAggregation(Aggregations.Week)
		.withMinLocationPrecision(LocationPrecisions.TimeZone)
		.withNodeMetadataPaths(["c", "d"])
		.withUserMetadataPaths(["e", "f"])
		.build();
	t.deepEqual(result.nodeIds, new Set([1, 2]));
	t.deepEqual(result.sourceIds, new Set(["a", "b"]));
	t.is(result.minAggregation, Aggregations.Week);
	t.deepEqual(
		result.aggregations,
		new Set([
			Aggregations.Week,
			Aggregations.WeekOfYear,
			Aggregations.Month,
			Aggregations.Year,
			Aggregations.RunningTotal,
		])
	);
	t.is(result.minLocationPrecision, LocationPrecisions.TimeZone);
	t.deepEqual(
		result.locationPrecisions,
		new Set([LocationPrecisions.TimeZone, LocationPrecisions.Country])
	);
	t.deepEqual(result.nodeMetadataPaths, new Set(["c", "d"]));
	t.deepEqual(result.userMetadataPaths, new Set(["e", "f"]));
});

test("build:withPolicy", (t) => {
	const policy = new SecurityPolicyBuilder()
		.withNodeIds([1, 2])
		.withSourceIds(["a", "b"])
		.withMinAggregation(Aggregations.Week)
		.withMinLocationPrecision(LocationPrecisions.TimeZone)
		.withNodeMetadataPaths(["c", "d"])
		.withUserMetadataPaths(["e", "f"])
		.build();
	const result = new SecurityPolicyBuilder().withPolicy(policy).build();
	t.deepEqual(result.nodeIds, new Set([1, 2]));
	t.deepEqual(result.sourceIds, new Set(["a", "b"]));
	t.is(result.minAggregation, Aggregations.Week);
	t.deepEqual(
		result.aggregations,
		new Set([
			Aggregations.Week,
			Aggregations.WeekOfYear,
			Aggregations.Month,
			Aggregations.Year,
			Aggregations.RunningTotal,
		])
	);
	t.is(result.minLocationPrecision, LocationPrecisions.TimeZone);
	t.deepEqual(
		result.locationPrecisions,
		new Set([LocationPrecisions.TimeZone, LocationPrecisions.Country])
	);
	t.deepEqual(result.nodeMetadataPaths, new Set(["c", "d"]));
	t.deepEqual(result.userMetadataPaths, new Set(["e", "f"]));
});

test("toJsonEncoding", (t) => {
	const result = new SecurityPolicyBuilder()
		.withNodeIds([1, 2])
		.withSourceIds(["a", "b"])
		.withMinAggregation(Aggregations.Week)
		.withMinLocationPrecision(LocationPrecisions.TimeZone)
		.withNodeMetadataPaths(["c", "d"])
		.withUserMetadataPaths(["e", "f"])
		.build()
		.toJsonEncoding();
	t.deepEqual(JSON.parse(result), {
		nodeIds: [1, 2],
		sourceIds: ["a", "b"],
		minAggregation: "Week",
		aggregations: ["Week", "WeekOfYear", "Month", "Year", "RunningTotal"],
		minLocationPrecision: "TimeZone",
		locationPrecisions: ["TimeZone", "Country"],
		nodeMetadataPaths: ["c", "d"],
		userMetadataPaths: ["e", "f"],
	});
});

test("fromJsonEncoding", (t) => {
	const json = JSON.stringify({
		nodeIds: [1, 2],
		sourceIds: ["a", "b"],
		minAggregation: "Week",
		aggregations: ["Week", "WeekOfYear", "Month", "Year", "RunningTotal"],
		minLocationPrecision: "TimeZone",
		locationPrecisions: ["TimeZone", "Country"],
		nodeMetadataPaths: ["c", "d"],
		userMetadataPaths: ["e", "f"],
	});

	const result = SecurityPolicy.fromJsonEncoding(json);

	t.deepEqual(
		result,
		new SecurityPolicyBuilder()
			.withNodeIds([1, 2])
			.withSourceIds(["a", "b"])
			.withMinAggregation(Aggregations.Week)
			.withMinLocationPrecision(LocationPrecisions.TimeZone)
			.withNodeMetadataPaths(["c", "d"])
			.withUserMetadataPaths(["e", "f"])
			.build()
	);
});

test("fromJsonEncoding:undefinedValue", (t) => {
	const result = SecurityPolicy.fromJsonEncoding(undefined);
	t.is(result, undefined);
});

test("toJsonObject", (t) => {
	const result = new SecurityPolicyBuilder()
		.withNodeIds([1, 2])
		.withSourceIds(["a", "b"])
		.withMinAggregation(Aggregations.Week)
		.withMinLocationPrecision(LocationPrecisions.TimeZone)
		.withNodeMetadataPaths(["c", "d"])
		.withUserMetadataPaths(["e", "f"])
		.build()
		.toJsonObject();
	t.deepEqual(result, {
		nodeIds: [1, 2],
		sourceIds: ["a", "b"],
		minAggregation: "Week",
		aggregations: ["Week", "WeekOfYear", "Month", "Year", "RunningTotal"],
		minLocationPrecision: "TimeZone",
		locationPrecisions: ["TimeZone", "Country"],
		nodeMetadataPaths: ["c", "d"],
		userMetadataPaths: ["e", "f"],
	});
});

test("fromJsonObject", (t) => {
	const obj = {
		nodeIds: [1, 2],
		sourceIds: ["a", "b"],
		minAggregation: "Week",
		aggregations: ["Week", "WeekOfYear", "Month", "Year", "RunningTotal"],
		minLocationPrecision: "TimeZone",
		locationPrecisions: ["TimeZone", "Country"],
		nodeMetadataPaths: ["c", "d"],
		userMetadataPaths: ["e", "f"],
	};

	const result = SecurityPolicy.fromJsonObject(obj);

	t.deepEqual(
		result,
		new SecurityPolicyBuilder()
			.withNodeIds([1, 2])
			.withSourceIds(["a", "b"])
			.withMinAggregation(Aggregations.Week)
			.withMinLocationPrecision(LocationPrecisions.TimeZone)
			.withNodeMetadataPaths(["c", "d"])
			.withUserMetadataPaths(["e", "f"])
			.build()
	);
});

test("fromJsonObject:undefinedValue", (t) => {
	const result = SecurityPolicy.fromJsonObject(undefined);
	t.is(result, undefined);
});

test("addPolicy", (t) => {
	const policy1 = new SecurityPolicyBuilder()
		.withNodeIds([1, 2])
		.withSourceIds(["a", "b"])
		.withAggregations(Aggregations.Hour)
		.withLocationPrecisions(LocationPrecisions.TimeZone)
		.withNodeMetadataPaths(["c", "d"])
		.withUserMetadataPaths(["e", "f"])
		.build();

	const policy2 = new SecurityPolicyBuilder()
		.withNodeIds([3])
		.withSourceIds(["S"])
		.withAggregations(Aggregations.Month)
		.withLocationPrecisions(LocationPrecisions.Country)
		.withNodeMetadataPaths(["N"])
		.withUserMetadataPaths(["U"])
		.build();

	const b = new SecurityPolicyBuilder()
		.withPolicy(policy1)
		.addPolicy(policy2);

	const result = b.build();
	t.deepEqual(result.nodeIds, new Set([1, 2, 3]));
	t.deepEqual(result.sourceIds, new Set(["a", "b", "S"]));
	t.deepEqual(
		result.aggregations,
		new Set([Aggregations.Hour, Aggregations.Month])
	);
	t.deepEqual(
		result.locationPrecisions,
		new Set([LocationPrecisions.TimeZone, LocationPrecisions.Country])
	);
	t.deepEqual(result.nodeMetadataPaths, new Set(["c", "d", "N"]));
	t.deepEqual(result.userMetadataPaths, new Set(["e", "f", "U"]));
});

test("addPolicy:mins", (t) => {
	const policy1 = new SecurityPolicyBuilder()
		.withMinAggregation(Aggregations.Hour)
		.withMinLocationPrecision(LocationPrecisions.TimeZone)
		.build();

	const policy2 = new SecurityPolicyBuilder()
		.withMinAggregation(Aggregations.Month)
		.withMinLocationPrecision(LocationPrecisions.Region)
		.build();

	const b = new SecurityPolicyBuilder()
		.withPolicy(policy1)
		.addPolicy(policy2);

	const result = b.build();
	t.is(result.minAggregation, Aggregations.Month);
	t.is(result.minLocationPrecision, LocationPrecisions.Region);
});

test("restrict:empty", (t) => {
	const policy = SecurityPolicy.fromJsonObject({
		nodeIds: [1, 2],
		sourceIds: ["a", "b"],
	})!;

	t.deepEqual(policy.restrict({}), {});
});

test("restrict:nodes", (t) => {
	const policy = SecurityPolicy.fromJsonObject({
		nodeIds: [1, 2],
	})!;

	t.deepEqual(policy.restrict({ nodeIds: new Set([1, 2, 3, 4]) }), {
		nodeIds: new Set([1, 2]),
	});
});

test("restrict:nodes:noRestrictions", (t) => {
	const policy = SecurityPolicy.fromJsonObject({})!;

	t.deepEqual(policy.restrict({ nodeIds: new Set([1, 2, 3, 4]) }), {
		nodeIds: new Set([1, 2, 3, 4]),
	});
});

test("restrict:sources", (t) => {
	const policy = SecurityPolicy.fromJsonObject({
		sourceIds: ["a", "b"],
	})!;

	t.deepEqual(policy.restrict({ sourceIds: new Set(["a", "b", "c", "d"]) }), {
		sourceIds: new Set(["a", "b"]),
	});
});

test("restrict:sources:noRestrictions", (t) => {
	const policy = SecurityPolicy.fromJsonObject({})!;

	t.deepEqual(policy.restrict({ sourceIds: new Set(["a", "b", "c", "d"]) }), {
		sourceIds: new Set(["a", "b", "c", "d"]),
	});
});

test("restrict:sources:pattern", (t) => {
	const policy = SecurityPolicy.fromJsonObject({
		sourceIds: ["/s1/**", "/s2/*"],
	})!;

	t.deepEqual(
		policy.restrict({
			sourceIds: new Set([
				"/s1",
				"/s1/a",
				"/s1/a/b",
				"/s2/a",
				"/s2/a/b",
				"/s3/a",
			]),
		}),
		{
			sourceIds: new Set(["/s1/a", "/s1/a/b", "/s2/a"]),
		}
	);
});

test("restrict:nodesAndSources", (t) => {
	const policy = SecurityPolicy.fromJsonObject({
		nodeIds: [1, 2, 3],
		sourceIds: ["/s1/**", "/s2/*"],
	})!;

	t.deepEqual(
		policy.restrict({
			nodeIds: new Set([2, 3, 4, 5, 6]),
			sourceIds: new Set([
				"/s1",
				"/s1/a",
				"/s1/a/b",
				"/s2/a",
				"/s2/a/b",
				"/s3/a",
			]),
		}),
		{
			nodeIds: new Set([2, 3]),
			sourceIds: new Set(["/s1/a", "/s1/a/b", "/s2/a"]),
		}
	);
});
