import test from "ava";

import {
	default as Aggregations,
	Aggregation,
	AggregationNames,
} from "../../main/domain/aggregation.js";

test("create", (t) => {
	const obj = new Aggregation("foo", 1);
	t.truthy(obj);
	t.is(obj.name, "foo");
	t.is(obj.level, 1);
});

test("compare:lt", (t) => {
	const left = new Aggregation("foo", 1);
	const right = new Aggregation("bar", 2);
	t.is(left.compareTo(right), -1);
});

test("compare:gt", (t) => {
	const left = new Aggregation("foo", 2);
	const right = new Aggregation("bar", 1);
	t.is(left.compareTo(right), 1);
});

test("compare:eq", (t) => {
	const left = new Aggregation("foo", 1);
	const right = new Aggregation("bar", 1);
	t.is(left.compareTo(right), 0);
});

test("aggregations", (t) => {
	t.is(Aggregations.Minute.name, AggregationNames.Minute);
	t.is(Aggregations.FiveMinute.name, AggregationNames.FiveMinute);
	t.is(Aggregations.TenMinute.name, AggregationNames.TenMinute);
	t.is(Aggregations.FifteenMinute.name, AggregationNames.FifteenMinute);
	t.is(Aggregations.ThirtyMinute.name, AggregationNames.ThirtyMinute);
	t.is(Aggregations.Hour.name, AggregationNames.Hour);
	t.is(Aggregations.HourOfDay.name, AggregationNames.HourOfDay);
	t.is(
		Aggregations.SeasonalHourOfDay.name,
		AggregationNames.SeasonalHourOfDay
	);
	t.is(Aggregations.Day.name, AggregationNames.Day);
	t.is(Aggregations.DayOfWeek.name, AggregationNames.DayOfWeek);
	t.is(
		Aggregations.SeasonalDayOfWeek.name,
		AggregationNames.SeasonalDayOfWeek
	);
	t.is(Aggregations.Week.name, AggregationNames.Week);
	t.is(Aggregations.WeekOfYear.name, AggregationNames.WeekOfYear);
	t.is(Aggregations.Month.name, AggregationNames.Month);
	t.is(Aggregations.Year.name, AggregationNames.Year);
	t.is(Aggregations.RunningTotal.name, AggregationNames.RunningTotal);
});

test("minimumEnumSet", (t) => {
	const cache = new Map();
	let result = Aggregation.minimumEnumSet(Aggregations.Month, cache);
	t.deepEqual(
		result,
		new Set([
			Aggregations.Month,
			Aggregations.Year,
			Aggregations.RunningTotal,
		])
	);

	result = Aggregation.minimumEnumSet(Aggregations.Week);
	t.deepEqual(
		result,
		new Set([
			Aggregations.Week,
			Aggregations.WeekOfYear,
			Aggregations.Month,
			Aggregations.Year,
			Aggregations.RunningTotal,
		])
	);

	result = Aggregation.minimumEnumSet(
		new Aggregation("foo", Number.MAX_VALUE)
	);
	t.is(result, undefined);
});
