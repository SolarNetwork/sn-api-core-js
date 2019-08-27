import test from "ava";

import { default as Aggregations, Aggregation } from "domain/aggregation";

test("domain:aggregation:create", t => {
	const obj = new Aggregation("foo", 1);
	t.truthy(obj);
	t.is(obj.name, "foo");
	t.is(obj.level, 1);
});

test("domain:aggregation:compare:lt", t => {
	const left = new Aggregation("foo", 1);
	const right = new Aggregation("bar", 2);
	t.is(left.compareTo(right), -1);
});

test("domain:aggregation:compare:gt", t => {
	const left = new Aggregation("foo", 2);
	const right = new Aggregation("bar", 1);
	t.is(left.compareTo(right), 1);
});

test("domain:aggregation:compare:eq", t => {
	const left = new Aggregation("foo", 1);
	const right = new Aggregation("bar", 1);
	t.is(left.compareTo(right), 0);
});

test("domain:aggregation:aggregations", t => {
	t.is(Aggregations.Minute.name, "Minute");
	t.is(Aggregations.FiveMinute.name, "FiveMinute");
	t.is(Aggregations.TenMinute.name, "TenMinute");
	t.is(Aggregations.FifteenMinute.name, "FifteenMinute");
	t.is(Aggregations.ThirtyMinute.name, "ThirtyMinute");
	t.is(Aggregations.Hour.name, "Hour");
	t.is(Aggregations.HourOfDay.name, "HourOfDay");
	t.is(Aggregations.SeasonalHourOfDay.name, "SeasonalHourOfDay");
	t.is(Aggregations.Day.name, "Day");
	t.is(Aggregations.DayOfWeek.name, "DayOfWeek");
	t.is(Aggregations.SeasonalDayOfWeek.name, "SeasonalDayOfWeek");
	t.is(Aggregations.Week.name, "Week");
	t.is(Aggregations.WeekOfYear.name, "WeekOfYear");
	t.is(Aggregations.Month.name, "Month");
	t.is(Aggregations.Year.name, "Year");
	t.is(Aggregations.RunningTotal.name, "RunningTotal");
});

test("domain:aggregation:minimumEnumSet", t => {
	const cache = new Map();
	let result = Aggregation.minimumEnumSet(Aggregations.Month, cache);
	t.deepEqual(
		result,
		new Set([Aggregations.Month, Aggregations.Year, Aggregations.RunningTotal])
	);

	result = Aggregation.minimumEnumSet(Aggregations.Week);
	t.deepEqual(
		result,
		new Set([
			Aggregations.Week,
			Aggregations.WeekOfYear,
			Aggregations.Month,
			Aggregations.Year,
			Aggregations.RunningTotal
		])
	);

	result = Aggregation.minimumEnumSet(new Aggregation("foo", Number.MAX_VALUE));
	t.is(result, null);
});
