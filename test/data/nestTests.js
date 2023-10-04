import test from "ava";

import {
	aggregateNestedDataLayers,
	groupedBySourceMetricDataArray,
	normalizeNestedStackDataByDate,
} from "../../src/data/nest.js";

test("data:nest:aggregateNestedDataLayers:simple", (t) => {
	const layerData = [
		{
			key: "A",
			values: [
				{ watts: 123, foo: 1 },
				{ watts: 234, foo: 2 },
			],
		},
		{
			key: "B",
			values: [
				{ watts: 345, foo: 3 },
				{ watts: 456, foo: 4 },
			],
		},
	];
	const result = aggregateNestedDataLayers(layerData, "A and B", ["foo"], ["watts"], {
		combined: true,
	});
	t.deepEqual(result, [
		{
			key: "A and B",
			values: [
				{ watts: 468, foo: 1, combined: true },
				{ watts: 690, foo: 2, combined: true },
			],
		},
	]);
});

test("data:nest:normalizeNestedStackDataByDate:simple", (t) => {
	const layerData = [
		{
			key: "A",
			values: [
				{ date: new Date("2011-12-02 12:00") },
				{ date: new Date("2011-12-02 12:10") },
			],
		},
		{ key: "B", values: [{ date: new Date("2011-12-02 12:00") }] },
	];
	normalizeNestedStackDataByDate(layerData);
	t.deepEqual(layerData, [
		{
			key: "A",
			values: [
				{ date: new Date("2011-12-02 12:00") },
				{ date: new Date("2011-12-02 12:10") },
			],
		},
		{
			key: "B",
			values: [
				{ date: new Date("2011-12-02 12:00") },
				{ date: new Date("2011-12-02 12:10"), sourceId: "B" },
			],
		},
	]);
});

test("data:nest:groupedBySourceMetricDataArray:mappedSources", (t) => {
	const queryData = [
		{ localDate: "2018-05-05", localTime: "11:00", sourceId: "A", watts: 123 },
		{ localDate: "2018-05-05", localTime: "11:00", sourceId: "B", watts: 234 },
		{ localDate: "2018-05-05", localTime: "12:00", sourceId: "A", watts: 345 },
		{ localDate: "2018-05-05", localTime: "12:00", sourceId: "B", watts: 456 },
	];
	const sourceMap = new Map([
		["A", "Generation"],
		["B", "Consumption"],
	]);
	const result = groupedBySourceMetricDataArray(queryData, "watts", sourceMap);
	t.deepEqual(result, [
		{ date: new Date("2018-05-05T11:00Z"), Generation: 123, Consumption: 234 },
		{ date: new Date("2018-05-05T12:00Z"), Generation: 345, Consumption: 456 },
	]);
});

test("data:nest:groupedBySourceMetricDataArray:mappedSources:grouped", (t) => {
	const queryData = [
		{ localDate: "2018-05-05", localTime: "11:00", sourceId: "A", watts: 123 },
		{ localDate: "2018-05-05", localTime: "11:00", sourceId: "B", watts: 234 },
		{ localDate: "2018-05-05", localTime: "11:00", sourceId: "C", watts: 345 },
		{ localDate: "2018-05-05", localTime: "12:00", sourceId: "A", watts: 456 },
		{ localDate: "2018-05-05", localTime: "12:00", sourceId: "B", watts: 567 },
		{ localDate: "2018-05-05", localTime: "12:00", sourceId: "C", watts: 678 },
	];
	const sourceMap = new Map([
		["A", "Generation"],
		["B", "Generation"],
		["C", "Consumption"],
	]);
	const result = groupedBySourceMetricDataArray(queryData, "watts", sourceMap);
	t.deepEqual(result, [
		{ date: new Date("2018-05-05T11:00Z"), Generation: 357, Consumption: 345 },
		{ date: new Date("2018-05-05T12:00Z"), Generation: 1023, Consumption: 678 },
	]);
});

test("data:nest:groupedBySourceMetricDataArray:nullGroup", (t) => {
	const queryData = [
		{ localDate: "2018-05-05", localTime: "11:00", sourceId: "A", watts: 123 },
		{ localDate: "2018-05-05", localTime: "11:00", sourceId: "B", foo: 234 },
		{ localDate: "2018-05-05", localTime: "12:00", sourceId: "A", watts: 345 },
	];
	const sourceMap = new Map([
		["A", "Generation"],
		["B", "Consumption"],
	]);
	const result = groupedBySourceMetricDataArray(queryData, "watts", sourceMap);
	t.deepEqual(
		result,
		[
			{ date: new Date("2018-05-05T11:00Z"), Generation: 123, Consumption: 0 },
			{
				date: new Date("2018-05-05T12:00Z"),
				Generation: 345,
				Consumption: null,
				sourceId: "Consumption",
			},
		],
		"First consumption 0 because of agg on existing input; second null because created after rollup by normalizeNestedStackDataByDate",
	);
});
