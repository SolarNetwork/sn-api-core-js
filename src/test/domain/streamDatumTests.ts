import test from "ava";

import DatumStreamMetadata from "../../main/domain/datumStreamMetadata.js";
import DatumStreamMetadataRegistry from "../../main/util/datumStreamMetadataRegistry.js";
import DatumStreamTypes from "../../main/domain/datumStreamType.js";
import StreamDatum from "../../main/domain/streamDatum.js";
import DatumSamplesTypes from "../../main/domain/datumSamplesType.js";

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

test("construct", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const ts = new Date();

	// WHEN
	const obj = new StreamDatum(
		streamId,
		ts,
		[1, 2, 3],
		[4, 5],
		["six"],
		new Set(["foo"])
	);

	// THEN
	t.truthy(obj);
	t.is(obj.streamId, streamId);
	t.is(obj.ts, ts);
	t.deepEqual(obj.iProps, [1, 2, 3]);
	t.deepEqual(obj.aProps, [4, 5]);
	t.deepEqual(obj.sProps, ["six"]);
	t.deepEqual(obj.tags, new Set(["foo"]));
});

test("construct:stringDate", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const ts = "2024-01-01T01:23:45.678Z";

	// WHEN
	const obj = new StreamDatum(
		streamId,
		ts,
		[1, 2, 3],
		[4, 5],
		["six"],
		new Set(["foo"])
	);

	// THEN
	t.deepEqual(obj.ts, new Date(ts));
});

test("construct:arrayTags", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const ts = new Date();

	// WHEN
	const obj = new StreamDatum(
		streamId,
		ts,
		[1, 2, 3],
		[4, 5],
		["six"],
		["foo"]
	);

	// THEN
	t.deepEqual(obj.tags, new Set(["foo"]));
});

test("toObject", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const ts = new Date();
	const d = new StreamDatum(
		streamId,
		ts,
		[1, 2, 3],
		[4, 5],
		["six"],
		new Set(["foo"])
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
		date: ts,
		nodeId: nodeId,
		sourceId: sourceId,
		a: 1,
		b: 2,
		c: 3,
		d: 4,
		e: 5,
		f: "six",
		tags: ["foo"],
	});
});

test("toObject:noMeta", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const ts = new Date();
	const d = new StreamDatum(
		streamId,
		ts,
		[1, 2, 3],
		[4, 5],
		["six"],
		new Set(["foo"])
	);

	// WHEN
	const obj = d.toObject();

	// THEN
	t.is(obj, undefined, "no meta results in undefined");
});

test("toObject:metaRegistry", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const ts = new Date();
	const d = new StreamDatum(
		streamId,
		ts,
		[1, 2, 3],
		[4, 5],
		["six"],
		new Set(["foo"])
	);
	const nodeId = 123;
	const sourceId = "test/source";
	const meta = testNodeMetadata(streamId, nodeId, sourceId);

	// WHEN
	const obj = d.toObject(new DatumStreamMetadataRegistry([meta]));

	// THEN
	t.truthy(obj);
	t.deepEqual(obj, {
		streamId: streamId,
		date: ts,
		nodeId: nodeId,
		sourceId: sourceId,
		a: 1,
		b: 2,
		c: 3,
		d: 4,
		e: 5,
		f: "six",
		tags: ["foo"],
	});
});

test("toObject:constructorMeta", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const ts = new Date();

	const nodeId = 123;
	const sourceId = "test/source";
	const meta = testNodeMetadata(streamId, nodeId, sourceId);

	const d = new StreamDatum(
		streamId,
		ts,
		[1, 2, 3],
		[4, 5],
		["six"],
		new Set(["foo"]),
		meta
	);

	// WHEN
	const obj = d.toObject();

	// THEN
	t.deepEqual(obj, {
		streamId: streamId,
		date: ts,
		nodeId: nodeId,
		sourceId: sourceId,
		a: 1,
		b: 2,
		c: 3,
		d: 4,
		e: 5,
		f: "six",
		tags: ["foo"],
	});
});

test("toObject:constructorMetaRegistry", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const ts = new Date();

	const nodeId = 123;
	const sourceId = "test/source";
	const meta = testNodeMetadata(streamId, nodeId, sourceId);

	const d = new StreamDatum(
		streamId,
		ts,
		[1, 2, 3],
		[4, 5],
		["six"],
		new Set(["foo"]),
		new DatumStreamMetadataRegistry([meta])
	);

	// WHEN
	const obj = d.toObject();

	// THEN
	t.deepEqual(obj, {
		streamId: streamId,
		date: ts,
		nodeId: nodeId,
		sourceId: sourceId,
		a: 1,
		b: 2,
		c: 3,
		d: 4,
		e: 5,
		f: "six",
		tags: ["foo"],
	});
});

test("toObject:constructorMeta:override", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const ts = new Date();

	const nodeId = 123;
	const sourceId = "test/source";
	const meta = testNodeMetadata(streamId, nodeId, sourceId);

	const d = new StreamDatum(
		streamId,
		ts,
		[1, 2, 3],
		[4, 5],
		["six"],
		new Set(["foo"]),
		meta
	);

	// WHEN
	const meta2 = testNodeMetadata("foo", 234, "bar");

	const obj = d.toObject(meta2)!;

	// THEN
	t.is(obj.streamId, streamId, "stream ID not overridden by metadata");
	t.is(obj.nodeId, 234, "node ID from argument metadata");
	t.is(obj.sourceId, "bar", "source ID from argument metadata");
});

test("toObject:location", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const ts = new Date(2022, 4, 1);
	const iProps = [1];
	const d = new StreamDatum(streamId, ts, iProps);
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
	const obj = d.toObject(meta);

	// THEN
	t.truthy(obj);
	t.deepEqual(
		obj,
		{
			streamId: streamId,
			date: ts,
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
			StreamDatum.fromJsonEncoding("foo", meta);
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
	t.is(StreamDatum.fromJsonEncoding("{}", meta), undefined);
});

test("fromJsonEncoding:noMeta", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const ts = new Date(2022, 4, 1);

	// THEN
	t.is(
		StreamDatum.fromJsonEncoding(
			`["${streamId}",${ts.getTime()}]`,
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
	const ts = new Date();

	// WHEN
	const d = StreamDatum.fromJsonEncoding(
		`["${streamId}",${ts.getTime()},1,2,3,4,5,"six","foo"]`,
		meta
	)!;

	// THEN
	t.truthy(d);
	t.is(d.streamId, streamId);
	t.is(d.ts.getTime(), ts.getTime());
	t.deepEqual(d.iProps, [1, 2, 3]);
	t.deepEqual(d.aProps, [4, 5]);
	t.deepEqual(d.sProps, ["six"]);
	t.deepEqual(d.tags, new Set(["foo"]));
});

test("fromJsonEncoding:registry:embedded", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const nodeId = 123;
	const sourceId = "test/source";
	const meta = testNodeMetadata(streamId, nodeId, sourceId);
	const reg = new DatumStreamMetadataRegistry([meta]);
	const ts = new Date();

	// WHEN
	const d = StreamDatum.fromJsonEncoding(
		`["${streamId}",${ts.getTime()},1,2,3,4,5,"six","foo"]`,
		reg
	)!;

	// THEN
	t.truthy(d);
	t.is(d.streamId, streamId);
	t.is(d.ts.getTime(), ts.getTime());
	t.deepEqual(d.iProps, [1, 2, 3]);
	t.deepEqual(d.aProps, [4, 5]);
	t.deepEqual(d.sProps, ["six"]);
	t.deepEqual(d.tags, new Set(["foo"]));
});

test("fromJsonEncoding:registry", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const nodeId = 123;
	const sourceId = "test/source";
	const meta = testNodeMetadata(streamId, nodeId, sourceId);
	const reg = new DatumStreamMetadataRegistry([meta]);
	const ts = new Date();

	// WHEN
	const d = StreamDatum.fromJsonEncoding(
		`[0,${ts.getTime()},1,2,3,4,5,"six","foo"]`,
		reg
	)!;

	// THEN
	t.truthy(d);
	t.is(d.streamId, streamId);
	t.is(d.ts.getTime(), ts.getTime());
	t.deepEqual(d.iProps, [1, 2, 3]);
	t.deepEqual(d.aProps, [4, 5]);
	t.deepEqual(d.sProps, ["six"]);
	t.deepEqual(d.tags, new Set(["foo"]));
});

test("fromJsonEncoding:indexedMeta", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const nodeId = 123;
	const sourceId = "test/source";
	const meta = testNodeMetadata(streamId, nodeId, sourceId);
	const ts = new Date();

	// WHEN
	const d = StreamDatum.fromJsonEncoding(
		`[0,${ts.getTime()},1,2,3,4,5,"six","foo"]`,
		meta
	)!;

	// THEN
	t.truthy(d);
	t.is(d.streamId, streamId);
	t.is(d.ts.getTime(), ts.getTime());
	t.deepEqual(d.iProps, [1, 2, 3]);
	t.deepEqual(d.aProps, [4, 5]);
	t.deepEqual(d.sProps, ["six"]);
	t.deepEqual(d.tags, new Set(["foo"]));
});

test("fromJsonEncoding:indexedMeta:invalidMeta", (t) => {
	// GIVEN
	const ts = new Date();

	// WHEN
	const d = StreamDatum.fromJsonEncoding(
		`[0,${ts.getTime()},1,2,3,4,5,"six","foo"]`,
		{} as any
	);

	// THEN
	t.is(d, undefined, "no parsing when invalid meta instance");
});

test("toJsonEncoding:embedded", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const ts = new Date();
	const d = new StreamDatum(
		streamId,
		ts,
		[1, 2, 3],
		[4, 5],
		["six"],
		new Set(["foo"])
	);

	// WHEN
	const json = d.toJsonEncoding();
	t.is(json, `["${streamId}",${ts.getTime()},1,2,3,4,5,"six","foo"]`);
});

test("toJsonEncoding:registry", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const ts = new Date();
	const nodeId = 123;
	const sourceId = "test/source";
	const meta = testNodeMetadata(streamId, nodeId, sourceId);
	const reg = new DatumStreamMetadataRegistry([meta]);
	const d = new StreamDatum(
		streamId,
		ts,
		[1, 2, 3],
		[4, 5],
		["six"],
		new Set(["foo"])
	);

	// WHEN
	const json = d.toJsonEncoding(reg);

	// THEN
	t.is(json, `[0,${ts.getTime()},1,2,3,4,5,"six","foo"]`);
});

test("propertyValuesForType", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const ts = new Date();
	const d = new StreamDatum(
		streamId,
		ts,
		[1, 2, 3],
		[4, 5],
		["six"],
		new Set(["foo"])
	);

	// THEN
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

test("propertyValuesForType:missing", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const ts = new Date();
	const d = new StreamDatum(streamId, ts);

	// THEN
	t.is(d.propertyValuesForType(DatumSamplesTypes.Instantaneous), undefined);
	t.is(d.propertyValuesForType(DatumSamplesTypes.Accumulating), undefined);
	t.is(d.propertyValuesForType(DatumSamplesTypes.Status), undefined);
	t.is(d.propertyValuesForType(DatumSamplesTypes.Tag), undefined);
});

test("propertyValuesForType:unknown", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const ts = new Date();
	const d = new StreamDatum(
		streamId,
		ts,
		[1, 2, 3],
		[4, 5],
		["six"],
		new Set(["foo"])
	);

	// THEN
	t.is(d.propertyValuesForType("foo" as any), undefined);
	t.is(d.propertyValuesForType(undefined as any), undefined);
});
