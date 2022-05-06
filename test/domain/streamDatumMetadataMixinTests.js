import test from "ava";

import DatumStreamMetadata from "domain/datumStreamMetadata";
import DatumStreamTypes from "domain/datumStreamType";
import { AggregateDatum, Datum } from "domain/streamDatumMetadataMixin";

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
		sNames
	);
}

function testNodeMetadata2(streamId, nodeId, sourceId) {
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

test("domain:streamDatumMetadataMixin:datum:toObject", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const ts = new Date();
	const nodeId = 123;
	const sourceId = "test/source";
	const meta = testNodeMetadata(streamId, nodeId, sourceId);
	const d = new Datum(streamId, ts, [1, 2, 3], [4, 5], ["six"], new Set(["foo"]), meta);

	// WHEN
	const obj = d.toObject();

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

test("domain:streamDatumMetadataMixin:aggregateDatum:toObject", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const ts = [new Date(2022, 4, 1), new Date(2022, 5, 1)];
	const iProps = [
		[1, 2, 3, 4],
		[2, 3, 4, 5],
	];
	const aProps = [[4, 5, 6]];
	const sProps = ["six"];
	const tags = ["foo"];
	const nodeId = 123;
	const sourceId = "test/source";
	const meta = testNodeMetadata2(streamId, nodeId, sourceId);
	const d = new AggregateDatum(streamId, ts, iProps, aProps, sProps, tags, meta);

	// WHEN
	const obj = d.toObject();

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
