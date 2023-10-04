import test from "ava";

import DatumStreamMetadata from "../../src/domain/datumStreamMetadata.js";
import DatumStreamMetadataRegistry from "../../src/util/datumStreamMetadataRegistry.js";
import DatumStreamTypes from "../../src/domain/datumStreamType.js";
import StreamDatum from "../../src/domain/streamDatum.js";

function testNodeMetadata(streamId, nodeId, sourceId) {
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
		sNames,
	);
}

test("domain:streamDatum:construct", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const ts = new Date();

	// WHEN
	const obj = new StreamDatum(streamId, ts, [1, 2, 3], [4, 5], ["six"], new Set(["foo"]));

	// THEN
	t.truthy(obj);
	t.is(obj.streamId, streamId);
	t.is(obj.ts, ts);
	t.deepEqual(obj.iProps, [1, 2, 3]);
	t.deepEqual(obj.aProps, [4, 5]);
	t.deepEqual(obj.sProps, ["six"]);
	t.deepEqual(obj.tags, new Set(["foo"]));
});

test("domain:streamDatum:toObject", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const ts = new Date();
	const d = new StreamDatum(streamId, ts, [1, 2, 3], [4, 5], ["six"], new Set(["foo"]));
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

test("domain:streamDatum:fromJsonEncoding:embedded", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const nodeId = 123;
	const sourceId = "test/source";
	const meta = testNodeMetadata(streamId, nodeId, sourceId);
	const ts = new Date();

	// WHEN
	const d = StreamDatum.fromJsonEncoding(
		`["${streamId}",${ts.getTime()},1,2,3,4,5,"six","foo"]`,
		meta,
	);

	// THEN
	t.truthy(d);
	t.is(d.streamId, streamId);
	t.is(d.ts.getTime(), ts.getTime());
	t.deepEqual(d.iProps, [1, 2, 3]);
	t.deepEqual(d.aProps, [4, 5]);
	t.deepEqual(d.sProps, ["six"]);
	t.deepEqual(d.tags, new Set(["foo"]));
});

test("domain:streamDatum:fromJsonEncoding:registry", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const nodeId = 123;
	const sourceId = "test/source";
	const meta = testNodeMetadata(streamId, nodeId, sourceId);
	const reg = new DatumStreamMetadataRegistry([meta]);
	const ts = new Date();

	// WHEN
	const d = StreamDatum.fromJsonEncoding(`[0,${ts.getTime()},1,2,3,4,5,"six","foo"]`, reg);

	// THEN
	t.truthy(d);
	t.is(d.streamId, streamId);
	t.is(d.ts.getTime(), ts.getTime());
	t.deepEqual(d.iProps, [1, 2, 3]);
	t.deepEqual(d.aProps, [4, 5]);
	t.deepEqual(d.sProps, ["six"]);
	t.deepEqual(d.tags, new Set(["foo"]));
});

test("domain:streamDatum:toJsonEncoding:embedded", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const ts = new Date();
	const d = new StreamDatum(streamId, ts, [1, 2, 3], [4, 5], ["six"], new Set(["foo"]));

	// WHEN
	const json = d.toJsonEncoding();
	t.is(json, `["${streamId}",${ts.getTime()},1,2,3,4,5,"six","foo"]`);
});

test("domain:streamDatum:toJsonEncoding:registry", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const ts = new Date();
	const nodeId = 123;
	const sourceId = "test/source";
	const meta = testNodeMetadata(streamId, nodeId, sourceId);
	const reg = new DatumStreamMetadataRegistry([meta]);
	const d = new StreamDatum(streamId, ts, [1, 2, 3], [4, 5], ["six"], new Set(["foo"]));

	// WHEN
	const json = d.toJsonEncoding(reg);
	t.is(json, `[0,${ts.getTime()},1,2,3,4,5,"six","foo"]`);
});
