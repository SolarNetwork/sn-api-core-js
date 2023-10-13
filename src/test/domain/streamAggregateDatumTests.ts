import test from "ava";

import DatumSamplesTypes from "../../main/domain/datumSamplesType.js";
import DatumStreamMetadata from "../../main/domain/datumStreamMetadata.js";
import DatumStreamMetadataRegistry from "../../main/util/datumStreamMetadataRegistry.js";
import DatumStreamTypes from "../../main/domain/datumStreamType.js";
import {
	default as StreamAggregateDatum,
	InstantaneousPropertyStatistics,
	AccumulatingPropertyStatistics,
} from "../../main/domain/streamAggregateDatum.js";

function testNodeMetadata(
	streamId: string,
	nodeId: number,
	sourceId: string
): DatumStreamMetadata {
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

test("construct", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const ts = [new Date(2022, 4, 1), new Date(2022, 5, 1)];

	// WHEN
	const iProps: InstantaneousPropertyStatistics[] = [
		[1, 2, 3, 4],
		[2, 3, 4, 5],
	];
	const aProps: AccumulatingPropertyStatistics[] = [[4, 5, 6]];
	const sProps = ["six"];
	const tags = ["foo"];
	const obj = new StreamAggregateDatum(
		streamId,
		ts,
		iProps,
		aProps,
		sProps,
		tags
	);

	// THEN
	t.truthy(obj);
	t.is(obj.streamId, streamId);
	t.deepEqual(obj.ts, ts);
	t.deepEqual(obj.iProps, iProps);
	t.deepEqual(obj.aProps, aProps);
	t.deepEqual(obj.sProps, sProps);
	t.deepEqual(obj.tags, new Set(tags));
});

test("construct:invalidDate", (t) => {
	// WHEN
	const d = new StreamAggregateDatum("foo", [{}] as any);

	// THEN
	t.is(d.streamId, "foo");
	t.deepEqual(d.ts, [new Date(undefined as any)], "invalid date created");
});

test("construct:nonArrayDate", (t) => {
	// WHEN
	const d = new StreamAggregateDatum("foo", {} as any);

	// THEN
	t.is(d.streamId, "foo");
	t.deepEqual(d.ts, [], "non-array dates turns to empty array");
});

test("toObject", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const ts = [new Date(2022, 4, 1), new Date(2022, 5, 1)];
	const iProps: InstantaneousPropertyStatistics[] = [
		[1, 2, 3, 4],
		[2, 3, 4, 5],
	];
	const aProps: AccumulatingPropertyStatistics[] = [[4, 5, 6]];
	const sProps = ["six"];
	const tags = ["foo"];
	const d = new StreamAggregateDatum(
		streamId,
		ts,
		iProps,
		aProps,
		sProps,
		tags
	);
	const nodeId = 123;
	const sourceId = "test/source";
	const meta = testNodeMetadata(streamId, nodeId, sourceId);

	// WHEN
	const obj = d.toObject(meta);

	// THEN
	t.truthy(obj);
	t.deepEqual(obj, {
		streamId: streamId,
		date: ts[0],
		date_end: ts[1],
		nodeId: nodeId,
		sourceId: sourceId,
		a: 1,
		a_count: 2,
		a_min: 3,
		a_max: 4,
		b: 2,
		b_count: 3,
		b_min: 4,
		b_max: 5,
		c: 4,
		c_start: 5,
		c_end: 6,
		d: "six",
		tags: ["foo"],
	});
});

test("toObject:withoutStatistics", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const ts = [new Date(2022, 4, 1), new Date(2022, 5, 1)];
	const iProps: InstantaneousPropertyStatistics[] = [
		[1, 2, 3, 4],
		[2, 3, 4, 5],
	];
	const aProps: AccumulatingPropertyStatistics[] = [[4, 5, 6]];
	const sProps = ["six"];
	const tags = ["foo"];
	const d = new StreamAggregateDatum(
		streamId,
		ts,
		iProps,
		aProps,
		sProps,
		tags
	);
	const nodeId = 123;
	const sourceId = "test/source";
	const meta = testNodeMetadata(streamId, nodeId, sourceId);

	// WHEN
	const obj = d.toObject(meta, true);

	// THEN
	t.truthy(obj);
	t.deepEqual(obj, {
		streamId: streamId,
		date: ts[0],
		date_end: ts[1],
		nodeId: nodeId,
		sourceId: sourceId,
		a: 1,
		b: 2,
		c: 4,
		d: "six",
		tags: ["foo"],
	});
});

test("toObject:metaRegistry", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const ts = [new Date(2022, 4, 1), new Date(2022, 5, 1)];
	const iProps: InstantaneousPropertyStatistics[] = [
		[1, 2, 3, 4],
		[2, 3, 4, 5],
	];
	const aProps: AccumulatingPropertyStatistics[] = [[4, 5, 6]];
	const sProps = ["six"];
	const tags = ["foo"];
	const d = new StreamAggregateDatum(
		streamId,
		ts,
		iProps,
		aProps,
		sProps,
		tags
	);
	const nodeId = 123;
	const sourceId = "test/source";
	const meta = testNodeMetadata(streamId, nodeId, sourceId);

	// WHEN
	const obj = d.toObject(new DatumStreamMetadataRegistry([meta]), true);

	// THEN
	t.truthy(obj);
	t.deepEqual(obj, {
		streamId: streamId,
		date: ts[0],
		date_end: ts[1],
		nodeId: nodeId,
		sourceId: sourceId,
		a: 1,
		b: 2,
		c: 4,
		d: "six",
		tags: ["foo"],
	});
});

test("toObject:constructorMeta", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const ts = [new Date(2022, 4, 1), new Date(2022, 5, 1)];
	const iProps: InstantaneousPropertyStatistics[] = [
		[1, 2, 3, 4],
		[2, 3, 4, 5],
	];
	const aProps: AccumulatingPropertyStatistics[] = [[4, 5, 6]];
	const sProps = ["six"];
	const tags = ["foo"];

	const nodeId = 123;
	const sourceId = "test/source";
	const meta = testNodeMetadata(streamId, nodeId, sourceId);

	const d = new StreamAggregateDatum(
		streamId,
		ts,
		iProps,
		aProps,
		sProps,
		tags,
		meta
	);

	// WHEN
	const obj = d.toObject();

	// THEN
	t.deepEqual(obj, {
		streamId: streamId,
		date: ts[0],
		date_end: ts[1],
		nodeId: nodeId,
		sourceId: sourceId,
		a: 1,
		a_count: 2,
		a_min: 3,
		a_max: 4,
		b: 2,
		b_count: 3,
		b_min: 4,
		b_max: 5,
		c: 4,
		c_start: 5,
		c_end: 6,
		d: "six",
		tags: ["foo"],
	});
});

test("toObject:constructorMetaRegistry", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const ts = [new Date(2022, 4, 1), new Date(2022, 5, 1)];
	const iProps: InstantaneousPropertyStatistics[] = [
		[1, 2, 3, 4],
		[2, 3, 4, 5],
	];
	const aProps: AccumulatingPropertyStatistics[] = [[4, 5, 6]];
	const sProps = ["six"];
	const tags = ["foo"];

	const nodeId = 123;
	const sourceId = "test/source";
	const meta = testNodeMetadata(streamId, nodeId, sourceId);

	const d = new StreamAggregateDatum(
		streamId,
		ts,
		iProps,
		aProps,
		sProps,
		tags,
		new DatumStreamMetadataRegistry([meta])
	);

	// WHEN
	const obj = d.toObject();

	// THEN
	t.deepEqual(obj, {
		streamId: streamId,
		date: ts[0],
		date_end: ts[1],
		nodeId: nodeId,
		sourceId: sourceId,
		a: 1,
		a_count: 2,
		a_min: 3,
		a_max: 4,
		b: 2,
		b_count: 3,
		b_min: 4,
		b_max: 5,
		c: 4,
		c_start: 5,
		c_end: 6,
		d: "six",
		tags: ["foo"],
	});
});

test("toObject:invalidData", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const ts = [new Date(2022, 4, 1), new Date(2022, 5, 1)];
	const iProps: InstantaneousPropertyStatistics[] = "foo" as any;
	const aProps: AccumulatingPropertyStatistics[] = undefined as any;
	const sProps = ["six"];
	const tags = ["foo"];
	const d = new StreamAggregateDatum(
		streamId,
		ts,
		iProps,
		aProps,
		sProps,
		tags
	);
	const nodeId = 123;
	const sourceId = "test/source";
	const meta = testNodeMetadata(streamId, nodeId, sourceId);

	// WHEN
	const obj = d.toObject(meta, true);

	// THEN
	t.truthy(obj);
	t.deepEqual(
		obj,
		{
			streamId: streamId,
			date: ts[0],
			date_end: ts[1],
			nodeId: nodeId,
			sourceId: sourceId,
			d: "six",
			tags: ["foo"],
		},
		"invalid property data skipped"
	);
});

test("toObject:invalidMeta", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const ts = [new Date(2022, 4, 1), new Date(2022, 5, 1)];
	const iProps: InstantaneousPropertyStatistics[] = [
		[1, 2, 3, 4],
		[2, 3, 4, 5],
	];
	const aProps: AccumulatingPropertyStatistics[] = [[4, 5, 6]];
	const sProps = ["six"];
	const tags = ["foo"];
	const d = new StreamAggregateDatum(
		streamId,
		ts,
		iProps,
		aProps,
		sProps,
		tags
	);
	const nodeId = 123;
	const sourceId = "test/source";
	const meta = new DatumStreamMetadata(
		streamId,
		"Etc/UTC",
		DatumStreamTypes.Node,
		nodeId,
		sourceId,
		"foo" as any,
		"bar" as any,
		["d"]
	);

	// WHEN
	const obj = d.toObject(meta, true);

	// THEN
	t.truthy(obj);
	t.deepEqual(
		obj,
		{
			streamId: streamId,
			date: ts[0],
			date_end: ts[1],
			nodeId: nodeId,
			sourceId: sourceId,
			d: "six",
			tags: ["foo"],
		},
		"invalid property data skipped"
	);
});

test("toObject:noMeta", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const ts = [new Date(2022, 4, 1), new Date(2022, 5, 1)];
	const iProps: InstantaneousPropertyStatistics[] = [
		[1, 2, 3, 4],
		[2, 3, 4, 5],
	];
	const aProps: AccumulatingPropertyStatistics[] = [[4, 5, 6]];
	const sProps = ["six"];
	const tags = ["foo"];
	const d = new StreamAggregateDatum(
		streamId,
		ts,
		iProps,
		aProps,
		sProps,
		tags
	);

	// WHEN
	const obj = d.toObject(undefined, true);

	// THEN
	t.is(obj, undefined, "no object if no metadata");
});

test("toObject:location", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const ts = [new Date(2022, 4, 1), new Date(2022, 5, 1)];
	const iProps: InstantaneousPropertyStatistics[] = [[1, 2, 3, 4]];
	const d = new StreamAggregateDatum(streamId, ts, iProps);
	const locId = 123;
	const sourceId = "test/source";
	const meta = new DatumStreamMetadata(
		streamId,
		"Etc/UTC",
		DatumStreamTypes.Location,
		locId,
		sourceId,
		["a"]
	);

	// WHEN
	const obj = d.toObject(meta, true);

	// THEN
	t.truthy(obj);
	t.deepEqual(
		obj,
		{
			streamId: streamId,
			date: ts[0],
			date_end: ts[1],
			locationId: locId,
			sourceId: sourceId,
			a: 1,
		},
		"location type produces locationId property"
	);
});

test("fromJsonEncoding:invalidJson", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const nodeId = 123;
	const sourceId = "test/source";
	const meta = testNodeMetadata(streamId, nodeId, sourceId);

	// THEN
	t.throws(
		() => {
			StreamAggregateDatum.fromJsonEncoding("foo", meta);
		},
		{ instanceOf: SyntaxError },
		"invalid JSON throws SyntaxError"
	);
});

test("fromJsonEncoding:invalid", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const nodeId = 123;
	const sourceId = "test/source";
	const meta = testNodeMetadata(streamId, nodeId, sourceId);

	// THEN
	t.is(StreamAggregateDatum.fromJsonEncoding("{}", meta), undefined);
});

test("fromJsonEncoding:noMeta", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const ts = [new Date(2022, 4, 1), new Date(2022, 5, 1)];

	// THEN
	t.is(
		StreamAggregateDatum.fromJsonEncoding(
			`["${streamId}",[${ts[0].getTime()},${ts[1].getTime()}]]`,
			undefined as any
		),
		undefined
	);
});

test("fromJsonEncoding:embedded", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const nodeId = 123;
	const sourceId = "test/source";
	const meta = testNodeMetadata(streamId, nodeId, sourceId);
	const ts = [new Date(2022, 4, 1), new Date(2022, 5, 1)];

	// WHEN
	const d = StreamAggregateDatum.fromJsonEncoding(
		`["${streamId}",[${ts[0].getTime()},${ts[1].getTime()}],[1,2,3,4],[2,3,4,5],[4,5,6],"six","foo"]`,
		meta
	)!;

	// THEN
	t.truthy(d);
	t.is(d.streamId, streamId);
	t.is(d.ts[0].getTime(), ts[0].getTime());
	t.is(d.ts[1].getTime(), ts[1].getTime());
	t.deepEqual(d.iProps, [
		[1, 2, 3, 4],
		[2, 3, 4, 5],
	]);
	t.deepEqual(d.aProps, [[4, 5, 6]]);
	t.deepEqual(d.sProps, ["six"]);
	t.deepEqual(d.tags, new Set(["foo"]));
});

test("fromJsonEncoding:registry", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const nodeId = 123;
	const sourceId = "test/source";
	const meta = testNodeMetadata(streamId, nodeId, sourceId);
	const ts = [new Date(2022, 4, 1), new Date(2022, 5, 1)];
	const reg = new DatumStreamMetadataRegistry([meta]);

	// WHEN
	const d = StreamAggregateDatum.fromJsonEncoding(
		`[0,[${ts[0].getTime()},${ts[1].getTime()}],[1,2,3,4],[2,3,4,5],[4,5,6],"six","foo"]`,
		reg
	)!;

	// THEN
	t.truthy(d);
	t.is(d.streamId, streamId);
	t.is(d.ts[0].getTime(), ts[0].getTime());
	t.is(d.ts[1].getTime(), ts[1].getTime());
	t.deepEqual(d.iProps, [
		[1, 2, 3, 4],
		[2, 3, 4, 5],
	]);
	t.deepEqual(d.aProps, [[4, 5, 6]]);
	t.deepEqual(d.sProps, ["six"]);
	t.deepEqual(d.tags, new Set(["foo"]));
});

test("fromJsonEncoding:indexedMeta", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const nodeId = 123;
	const sourceId = "test/source";
	const meta = testNodeMetadata(streamId, nodeId, sourceId);
	const ts = [new Date(2022, 4, 1), new Date(2022, 5, 1)];

	// WHEN
	const d = StreamAggregateDatum.fromJsonEncoding(
		`[0,[${ts[0].getTime()},${ts[1].getTime()}],[1,2,3,4],[2,3,4,5],[4,5,6],"six","foo"]`,
		meta
	)!;

	// THEN
	t.truthy(d, "datum parsed, index ignored as metadata provided explicitly");
	t.is(d.streamId, streamId);
	t.is(d.ts[0].getTime(), ts[0].getTime());
	t.is(d.ts[1].getTime(), ts[1].getTime());
	t.deepEqual(d.iProps, [
		[1, 2, 3, 4],
		[2, 3, 4, 5],
	]);
	t.deepEqual(d.aProps, [[4, 5, 6]]);
	t.deepEqual(d.sProps, ["six"]);
	t.deepEqual(d.tags, new Set(["foo"]));
});

test("fromJsonEncoding:embedded:registry", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const nodeId = 123;
	const sourceId = "test/source";
	const meta = testNodeMetadata(streamId, nodeId, sourceId);
	const ts = [new Date(2022, 4, 1), new Date(2022, 5, 1)];
	const reg = new DatumStreamMetadataRegistry([meta]);

	// WHEN
	const d = StreamAggregateDatum.fromJsonEncoding(
		`["${streamId}",[${ts[0].getTime()},${ts[1].getTime()}],[1,2,3,4],[2,3,4,5],[4,5,6],"six","foo"]`,
		reg
	)!;

	// THEN
	t.truthy(d);
	t.is(d.streamId, streamId);
	t.is(d.ts[0].getTime(), ts[0].getTime());
	t.is(d.ts[1].getTime(), ts[1].getTime());
	t.deepEqual(d.iProps, [
		[1, 2, 3, 4],
		[2, 3, 4, 5],
	]);
	t.deepEqual(d.aProps, [[4, 5, 6]]);
	t.deepEqual(d.sProps, ["six"]);
	t.deepEqual(d.tags, new Set(["foo"]));
});

test("fromJsonEncoding:invalidMeta", (t) => {
	// GIVEN
	const ts = [new Date(2022, 4, 1), new Date(2022, 5, 1)];

	// WHEN
	const d = StreamAggregateDatum.fromJsonEncoding(
		`[0,[${ts[0].getTime()},${ts[1].getTime()}],[1,2,3,4],[2,3,4,5],[4,5,6],"six","foo"]`,
		{} as any
	);

	// THEN
	t.is(d, undefined, "invalid meta results in undefined");
});

test("fromJsonEncoding:embedded:invalidMeta", (t) => {
	// GIVEN
	const ts = [new Date(2022, 4, 1), new Date(2022, 5, 1)];

	// WHEN
	const d = StreamAggregateDatum.fromJsonEncoding(
		`["foo",[${ts[0].getTime()},${ts[1].getTime()}],[1,2,3,4],[2,3,4,5],[4,5,6],"six","foo"]`,
		{} as any
	);

	// THEN
	t.is(d, undefined, "invalid meta results in undefined");
});

test("toJsonEncoding:embedded", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const ts = [new Date(2022, 4, 1), new Date(2022, 5, 1)];
	const d = new StreamAggregateDatum(
		streamId,
		ts,
		[
			[1, 2, 3, 4],
			[2, 3, 4, 5],
		],
		[[4, 5, 6]],
		["six"],
		["foo"]
	);

	// WHEN
	const json = d.toJsonEncoding();
	t.is(
		json,
		`["${streamId}",[${ts[0].getTime()},${ts[1].getTime()}],[1,2,3,4],[2,3,4,5],[4,5,6],"six","foo"]`
	);
});

test("toJsonEncoding:registry", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const ts = [new Date(2022, 4, 1), new Date(2022, 5, 1)];
	const d = new StreamAggregateDatum(
		streamId,
		ts,
		[
			[1, 2, 3, 4],
			[2, 3, 4, 5],
		],
		[[4, 5, 6]],
		["six"],
		["foo"]
	);
	const nodeId = 123;
	const sourceId = "test/source";
	const meta = testNodeMetadata(streamId, nodeId, sourceId);
	const reg = new DatumStreamMetadataRegistry([meta]);

	// WHEN
	const json = d.toJsonEncoding(reg);

	// THEN
	t.is(
		json,
		`[0,[${ts[0].getTime()},${ts[1].getTime()}],[1,2,3,4],[2,3,4,5],[4,5,6],"six","foo"]`
	);
});

test("toJsonObject:empty", (t) => {
	// GIVEN
	const streamId = "foo";
	const ts = [new Date(2022, 4, 1), new Date(2022, 5, 1)];
	const d = new StreamAggregateDatum(streamId, ts);

	// WHEN
	const data = d.toJsonObject();

	// THEN
	t.deepEqual(data, [streamId, [ts[0].getTime(), ts[1].getTime()]]);
});

test("toJsonObject:invalidDate", (t) => {
	// GIVEN
	const streamId = "foo";
	const ts = [new Date(2022, 4, 1), new Date(undefined as any)];
	const d = new StreamAggregateDatum(streamId, ts);

	// WHEN
	const data = d.toJsonObject();

	// THEN
	t.deepEqual(
		data,
		[streamId, [ts[0].getTime(), null]],
		"invalid date returned as `null`"
	);
});

test("propertyValuesForType", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const ts = [new Date(2022, 4, 1), new Date(2022, 5, 1)];
	const d = new StreamAggregateDatum(
		streamId,
		ts,
		[
			[1, 2, 3, 4],
			[2, 3, 4, 5],
		],
		[[4, 5, 6]],
		["six"],
		["foo"]
	);

	// THEN
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

test("propertyValuesForType:missing", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const ts = [new Date(2022, 4, 1), new Date(2022, 5, 1)];
	const d = new StreamAggregateDatum(streamId, ts);

	// THEN
	t.is(d.propertyValuesForType(DatumSamplesTypes.Instantaneous), undefined);
	t.is(d.propertyValuesForType(DatumSamplesTypes.Accumulating), undefined);
	t.is(d.propertyValuesForType(DatumSamplesTypes.Status), undefined);
	t.is(d.propertyValuesForType(DatumSamplesTypes.Tag), undefined);
});

test("propertyValuesForType:unknown", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const ts = [new Date(2022, 4, 1), new Date(2022, 5, 1)];
	const d = new StreamAggregateDatum(
		streamId,
		ts,
		[
			[1, 2, 3, 4],
			[2, 3, 4, 5],
		],
		[[4, 5, 6]],
		["six"],
		["foo"]
	);

	// THEN
	t.is(d.propertyValuesForType("foo" as any), undefined);
	t.is(d.propertyValuesForType(undefined as any), undefined);
});

test("streamedDatum:date", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const ts = [new Date(2022, 4, 1), new Date(2022, 5, 1)];
	const d = new StreamAggregateDatum(
		streamId,
		ts,
		[
			[1, 2, 3, 4],
			[2, 3, 4, 5],
		],
		[[4, 5, 6]],
		["six"],
		["foo"]
	);

	t.is(d.date, ts[0]);
});

test("streamedDatum:date:missing", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const d = new StreamAggregateDatum(
		streamId,
		[],
		[
			[1, 2, 3, 4],
			[2, 3, 4, 5],
		],
		[[4, 5, 6]],
		["six"],
		["foo"]
	);

	t.deepEqual(
		d.date,
		new Date(undefined as any),
		"invalid date returned when no date available"
	);
});
