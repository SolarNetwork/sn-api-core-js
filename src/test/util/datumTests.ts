import test from "ava";

import { mean } from "d3-array";
import Aggregations from "../../main/domain/aggregation.js";
import DatumSamplesTypes from "../../main/domain/datumSamplesType.js";
import DatumStreamMetadata from "../../main/domain/datumStreamMetadata.js";
import DatumStreamTypes from "../../main/domain/datumStreamType.js";
import {
	aggregateNestedDataLayers,
	datumDate,
	datumForStreamData,
	groupedBySourceMetricDataArray,
	normalizeNestedStackDataByDate,
	timeNormalizeDataArray,
} from "../../main/util/datum.js";
import StreamAggregateDatum from "../../main/domain/streamAggregateDatum.js";
import StreamDatum from "../../main/domain/streamDatum.js";

function testNodeMetadata(streamId: string, nodeId: number, sourceId: string) {
	const timeZoneId = "Pacific/Auckland";
	const streamKind = DatumStreamTypes.Node;
	const iNames = ["a", "b", "c"];
	const aNames = ["d", "e"];
	const sNames = ["f"];

	// WHEN
	return new DatumStreamMetadata(
		streamId,
		timeZoneId,
		streamKind,
		nodeId,
		sourceId,
		iNames,
		aNames,
		sNames
	);
}

function testNodeMetadata2(streamId: string, nodeId: number, sourceId: string) {
	const timeZoneId = "Pacific/Auckland";
	const streamKind = DatumStreamTypes.Node;
	const iNames = ["a", "b"];
	const aNames = ["c"];
	const sNames = ["d"];

	// WHEN
	return new DatumStreamMetadata(
		streamId,
		timeZoneId,
		streamKind,
		nodeId,
		sourceId,
		iNames,
		aNames,
		sNames
	);
}

test("datum", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const nodeId = 123;
	const sourceId = "test/source";
	const meta = testNodeMetadata(streamId, nodeId, sourceId);
	const ts = new Date();

	// WHEN
	const d = datumForStreamData(
		[streamId, ts.getTime(), 1, 2, 3, 4, 5, "six", "foo"],
		meta
	)!;

	// THEN
	t.is(d instanceof StreamDatum, true);
	t.is(d.metadata, meta);
	t.is(d.streamId, streamId);
	t.is(d.date.getTime(), ts.getTime());
	t.deepEqual(
		d.propertyValuesForType(DatumSamplesTypes.Instantaneous),
		[1, 2, 3]
	);
	t.deepEqual(
		d.propertyValuesForType(DatumSamplesTypes.Accumulating),
		[4, 5]
	);
	t.deepEqual(d.propertyValuesForType(DatumSamplesTypes.Status), ["six"]);
	t.deepEqual(
		d.propertyValuesForType(DatumSamplesTypes.Tag),
		new Set(["foo"])
	);
});

test("datum:json", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const nodeId = 123;
	const sourceId = "test/source";
	const meta = testNodeMetadata(streamId, nodeId, sourceId);
	const ts = new Date();

	// WHEN
	const d = datumForStreamData(
		`["${streamId}",${ts.getTime()},1,2,3,4,5,"six","foo"]`,
		meta
	)!;

	// THEN
	t.truthy(d);
	t.is(d instanceof StreamDatum, true);
	t.is(d.metadata, meta);
	t.is(d.streamId, streamId);
	t.is(d.date.getTime(), ts.getTime());
	t.deepEqual(
		d.propertyValuesForType(DatumSamplesTypes.Instantaneous),
		[1, 2, 3]
	);
	t.deepEqual(
		d.propertyValuesForType(DatumSamplesTypes.Accumulating),
		[4, 5]
	);
	t.deepEqual(d.propertyValuesForType(DatumSamplesTypes.Status), ["six"]);
	t.deepEqual(
		d.propertyValuesForType(DatumSamplesTypes.Tag),
		new Set(["foo"])
	);
});

test("aggregateDatum", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const nodeId = 123;
	const sourceId = "test/source";
	const meta = testNodeMetadata2(streamId, nodeId, sourceId);
	const ts = [new Date(2022, 4, 1), new Date(2022, 5, 1)];

	// WHEN
	const d = datumForStreamData(
		[
			streamId,
			[ts[0].getTime(), ts[1].getTime()],
			[1, 2, 3, 4],
			[2, 3, 4, 5],
			[4, 5, 6],
			"six",
			"foo",
		],
		meta
	)!;

	// THEN
	t.is(d instanceof StreamAggregateDatum, true);
	t.is(d.metadata, meta);
	t.is(d.streamId, streamId);
	t.is(d.date.getTime(), ts[0].getTime());
	t.deepEqual(
		d.propertyValuesForType(DatumSamplesTypes.Instantaneous),
		[1, 2]
	);
	t.deepEqual(d.propertyValuesForType(DatumSamplesTypes.Accumulating), [4]);
	t.deepEqual(d.propertyValuesForType(DatumSamplesTypes.Status), ["six"]);
	t.deepEqual(
		d.propertyValuesForType(DatumSamplesTypes.Tag),
		new Set(["foo"])
	);
});

test("aggregateDatum:json", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const nodeId = 123;
	const sourceId = "test/source";
	const meta = testNodeMetadata2(streamId, nodeId, sourceId);
	const ts = [new Date(2022, 4, 1), new Date(2022, 5, 1)];

	// WHEN
	const d = datumForStreamData(
		`["${streamId}",[${ts[0].getTime()},${ts[1].getTime()}],[1,2,3,4],[2,3,4,5],[4,5,6],"six","foo"]`,
		meta
	)!;

	// THEN
	t.is(d instanceof StreamAggregateDatum, true);
	t.is(d.metadata, meta);
	t.is(d.streamId, streamId);
	t.is(d.date.getTime(), ts[0].getTime());
	t.deepEqual(
		d.propertyValuesForType(DatumSamplesTypes.Instantaneous),
		[1, 2]
	);
	t.deepEqual(d.propertyValuesForType(DatumSamplesTypes.Accumulating), [4]);
	t.deepEqual(d.propertyValuesForType(DatumSamplesTypes.Status), ["six"]);
	t.deepEqual(
		d.propertyValuesForType(DatumSamplesTypes.Tag),
		new Set(["foo"])
	);
});

test("datumForStreamData:invalidArgs", (t) => {
	t.is(datumForStreamData({} as any, undefined as any), undefined);
});

test("datumDate:undefined", (t) => {
	const result = datumDate(undefined);
	t.is(result, null, "null returned for undefined input");
});

test("datumDate:noDateProperty", (t) => {
	const result = datumDate({ foo: "bar" } as any);
	t.is(
		result,
		null,
		"null returned for input without a recognized date property"
	);
});

test("datumDate:date", (t) => {
	const date = new Date("2017-01-01T12:12:12.123Z");
	const result = datumDate({ date: date });
	t.is(result, date, "Date returned directly");
});

test("datumDate:date:invalidValue", (t) => {
	const result = datumDate({ date: "bar" } as any);
	t.is(result, null, "null returned for input with an invalid date object");
});

test("datumDate:localDate", (t) => {
	const date = new Date("2017-01-02T00:00:00.000Z");
	const result = datumDate({ localDate: "2017-01-02" });
	t.is(
		result?.toISOString(),
		date.toISOString(),
		"Local date parsed as UTC date"
	);
});

test("datumDate:localDateAndTime", (t) => {
	const date = new Date("2017-01-02T12:34:00.000Z");
	const result = datumDate({ localDate: "2017-01-02", localTime: "12:34" });
	t.is(
		result?.toISOString(),
		date.toISOString(),
		"Local date and time parsed as UTC date"
	);
});

test("datumDate:created:iso", (t) => {
	const date = new Date("2017-01-02T12:34:56.789Z");
	const result = datumDate({ created: "2017-01-02T12:34:56.789Z" });
	t.is(
		result?.toISOString(),
		date.toISOString(),
		"ISO timestamp parsed as UTC date"
	);
});

test("timeNormalizeDataArray:invalidInput", (t) => {
	t.deepEqual(
		timeNormalizeDataArray([], Aggregations.ThirtyMinute),
		[],
		"empty array unchanged"
	);

	const bad = {} as any;
	t.is(
		timeNormalizeDataArray(bad, Aggregations.ThirtyMinute),
		bad,
		"bad input returned"
	);
});

test("timeNormalizeDataArray:simple", (t) => {
	const queryData = [
		{
			date: new Date("2018-05-05T11:00Z"),
			Generation: 357,
			Consumption: 345,
		},
		{
			date: new Date("2018-05-05T12:00Z"),
			Generation: 1023,
			Consumption: 678,
		},
	];
	timeNormalizeDataArray(queryData, Aggregations.ThirtyMinute);
	t.deepEqual(queryData, [
		{
			date: new Date("2018-05-05T11:00Z"),
			Generation: 357,
			Consumption: 345,
		},
		{
			date: new Date("2018-05-05T11:30Z"),
			Generation: null,
			Consumption: null,
		},
		{
			date: new Date("2018-05-05T12:00Z"),
			Generation: 1023,
			Consumption: 678,
		},
	]);
});

test("timeNormalizeDataArray:fillMulti", (t) => {
	const queryData = [
		{
			date: new Date("2018-05-05T11:00Z"),
			Generation: 357,
			Consumption: 345,
		},
		{
			date: new Date("2018-05-05T12:00Z"),
			Generation: 1023,
			Consumption: 678,
		},
	];
	timeNormalizeDataArray(queryData, Aggregations.FifteenMinute);
	t.deepEqual(queryData, [
		{
			date: new Date("2018-05-05T11:00Z"),
			Generation: 357,
			Consumption: 345,
		},
		{
			date: new Date("2018-05-05T11:15Z"),
			Generation: null,
			Consumption: null,
		},
		{
			date: new Date("2018-05-05T11:30Z"),
			Generation: null,
			Consumption: null,
		},
		{
			date: new Date("2018-05-05T11:45Z"),
			Generation: null,
			Consumption: null,
		},
		{
			date: new Date("2018-05-05T12:00Z"),
			Generation: 1023,
			Consumption: 678,
		},
	]);
});

test("aggregateNestedDataLayers:simple", (t) => {
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
	const result = aggregateNestedDataLayers(
		layerData,
		"A and B",
		["foo"],
		["watts"],
		{
			combined: true,
		}
	);
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

test("aggregateNestedDataLayers:empty", (t) => {
	const layerData = [] as any[];
	const result = aggregateNestedDataLayers(layerData, "A and B");
	t.deepEqual(result, []);
});

test("normalizeNestedStackDataByDate:simple", (t) => {
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

test("normalizeNestedStackDataByDate:fillTemplte", (t) => {
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
	normalizeNestedStackDataByDate(layerData, { foo: "bar" });
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
				{
					date: new Date("2011-12-02 12:10"),
					sourceId: "B",
					foo: "bar",
				},
			],
		},
	]);
});

test("normalizeNestedStackDataByDate:fillFunction", (t) => {
	const layerData = [
		{
			key: "A",
			values: [
				{ date: new Date("2011-12-02 12:00") },
				{ date: new Date("2011-12-02 12:10") },
				{ date: new Date("2011-12-02 12:20") },
				{ date: new Date("2011-12-02 12:30") },
			],
		},
		{
			key: "B",
			values: [
				//{ date: new Date("2011-12-02 12:00") },
				{ date: new Date("2011-12-02 12:20") },
			],
		},
	];
	let i = 0;
	normalizeNestedStackDataByDate(
		layerData,
		undefined,
		(datum, key, prevDatum) => {
			if (key === "B") {
				datum.filled = i++;
				if (prevDatum) {
					datum.prevDate = prevDatum.date;
				}
			}
		}
	);
	t.deepEqual(layerData, [
		{
			key: "A",
			values: [
				{ date: new Date("2011-12-02 12:00") },
				{ date: new Date("2011-12-02 12:10") },
				{ date: new Date("2011-12-02 12:20") },
				{ date: new Date("2011-12-02 12:30") },
			],
		},
		{
			key: "B",
			values: [
				{
					date: new Date("2011-12-02 12:00"),
					sourceId: "B",
					filled: 0,
				},
				{
					date: new Date("2011-12-02 12:10"),
					sourceId: "B",
					filled: 1,
					prevDate: new Date("2011-12-02 12:00"),
				},
				{ date: new Date("2011-12-02 12:20") },
				{
					date: new Date("2011-12-02 12:30"),
					sourceId: "B",
					filled: 2,
					prevDate: new Date("2011-12-02 12:20"),
				},
			],
		},
	]);
});

test("groupedBySourceMetricDataArray:mappedSources", (t) => {
	const queryData = [
		{
			localDate: "2018-05-05",
			localTime: "11:00",
			sourceId: "A",
			watts: 123,
		},
		{
			localDate: "2018-05-05",
			localTime: "11:00",
			sourceId: "B",
			watts: 234,
		},
		{
			localDate: "2018-05-05",
			localTime: "11:00",
			sourceId: "C",
			watts: 1000,
		},
		{
			localDate: "2018-05-05",
			localTime: "12:00",
			sourceId: "A",
			watts: 345,
		},
		{
			localDate: "2018-05-05",
			localTime: "12:00",
			sourceId: "B",
			watts: 456,
		},
		{
			localDate: "2018-05-05",
			localTime: "12:00",
			sourceId: "C",
			watts: 4000,
		},
	];
	const sourceMap = new Map([
		["A", "Generation"],
		["B", "Consumption"],
	]);
	const result = groupedBySourceMetricDataArray(
		queryData,
		"watts",
		sourceMap
	);
	t.deepEqual(result, [
		{
			date: new Date("2018-05-05T11:00Z"),
			Generation: 123,
			Consumption: 234,
			C: 1000,
		},
		{
			date: new Date("2018-05-05T12:00Z"),
			Generation: 345,
			Consumption: 456,
			C: 4000,
		},
	]);
});

test("groupedBySourceMetricDataArray:mappedSources:grouped", (t) => {
	const queryData = [
		{
			localDate: "2018-05-05",
			localTime: "11:00",
			sourceId: "A",
			watts: 123,
		},
		{
			localDate: "2018-05-05",
			localTime: "11:00",
			sourceId: "B",
			watts: 234,
		},
		{
			localDate: "2018-05-05",
			localTime: "11:00",
			sourceId: "C",
			watts: 345,
		},
		{
			localDate: "2018-05-05",
			localTime: "12:00",
			sourceId: "A",
			watts: 456,
		},
		{
			localDate: "2018-05-05",
			localTime: "12:00",
			sourceId: "B",
			watts: 567,
		},
		{
			localDate: "2018-05-05",
			localTime: "12:00",
			sourceId: "C",
			watts: 678,
		},
	];
	const sourceMap = new Map([
		["A", "Generation"],
		["B", "Generation"],
		["C", "Consumption"],
	]);
	const result = groupedBySourceMetricDataArray(
		queryData,
		"watts",
		sourceMap
	);
	t.deepEqual(result, [
		{
			date: new Date("2018-05-05T11:00Z"),
			Generation: 357,
			Consumption: 345,
		},
		{
			date: new Date("2018-05-05T12:00Z"),
			Generation: 1023,
			Consumption: 678,
		},
	]);
});

test("groupedBySourceMetricDataArray:mappedSources:grouped:explicitAggFn", (t) => {
	const queryData = [
		{
			localDate: "2018-05-05",
			localTime: "11:00",
			sourceId: "A.1",
			watts: 123,
		},
		{
			localDate: "2018-05-05",
			localTime: "11:00",
			sourceId: "A.2",
			watts: 1000,
		},
		{
			localDate: "2018-05-05",
			localTime: "11:00",
			sourceId: "B",
			watts: 234,
		},
		{
			localDate: "2018-05-05",
			localTime: "12:00",
			sourceId: "A.1",
			watts: 345,
		},
		{
			localDate: "2018-05-05",
			localTime: "12:00",
			sourceId: "A.2",
			watts: 3000,
		},
		{
			localDate: "2018-05-05",
			localTime: "12:00",
			sourceId: "B",
			watts: 456,
		},
	];
	const sourceMap = new Map([
		["A.1", "Generation"],
		["A.2", "Generation"],
		["B", "Consumption"],
	]);
	const result = groupedBySourceMetricDataArray(
		queryData,
		"watts",
		sourceMap,
		mean
	);
	t.deepEqual(
		result,
		[
			{
				date: new Date("2018-05-05T11:00Z"),
				Generation: (123 + 1000) / 2,
				Consumption: 234,
			},
			{
				date: new Date("2018-05-05T12:00Z"),
				Generation: (345 + 3000) / 2,
				Consumption: 456,
			},
		],
		"average agg function used to combine sources"
	);
});

test("groupedBySourceMetricDataArray:nullGroup", (t) => {
	const queryData = [
		{
			localDate: "2018-05-05",
			localTime: "11:00",
			sourceId: "A",
			watts: 123,
		},
		{
			localDate: "2018-05-05",
			localTime: "11:00",
			sourceId: "B",
			foo: 234,
		},
		{
			localDate: "2018-05-05",
			localTime: "12:00",
			sourceId: "A",
			watts: 345,
		},
	];
	const sourceMap = new Map([
		["A", "Generation"],
		["B", "Consumption"],
	]);
	const result = groupedBySourceMetricDataArray(
		queryData,
		"watts",
		sourceMap
	);
	t.deepEqual(
		result,
		[
			{
				date: new Date("2018-05-05T11:00Z"),
				Generation: 123,
				Consumption: 0,
			},
			{
				date: new Date("2018-05-05T12:00Z"),
				Generation: 345,
				Consumption: null,
				sourceId: "Consumption",
			},
		],
		"First consumption 0 because of agg on existing input; second null because created after rollup by normalizeNestedStackDataByDate"
	);
});
