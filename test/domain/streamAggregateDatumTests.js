import test from "ava";

import DatumStreamMetadata from "domain/datumStreamMetadata";
import DatumStreamMetadataRegistry from "util/datumStreamMetadataRegistry";
import DatumStreamTypes from "domain/datumStreamType";
import StreamAggregateDatum from "domain/streamAggregateDatum";

function testNodeMetadata(streamId, nodeId, sourceId) {
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

test("domain:streamAggregateDatum:construct", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const ts = [new Date(2022, 4, 1), new Date(2022, 5, 1)];

	// WHEN
	const iProps = [
		[1, 2, 3, 4],
		[2, 3, 4, 5],
	];
	const aProps = [[4, 5, 6]];
	const sProps = ["six"];
	const tags = ["foo"];
	const obj = new StreamAggregateDatum(streamId, ts, iProps, aProps, sProps, tags);

	// THEN
	t.truthy(obj);
	t.is(obj.streamId, streamId);
	t.deepEqual(obj.ts, ts);
	t.deepEqual(obj.iProps, iProps);
	t.deepEqual(obj.aProps, aProps);
	t.deepEqual(obj.sProps, sProps);
	t.deepEqual(obj.tags, new Set(tags));
});

test("domain:streamAggregateDatum:toObject", (t) => {
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
	const d = new StreamAggregateDatum(streamId, ts, iProps, aProps, sProps, tags);
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

test("domain:streamAggregateDatum:toObject:withoutStatistics", (t) => {
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
	const d = new StreamAggregateDatum(streamId, ts, iProps, aProps, sProps, tags);
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

test("domain:streamAggregateDatum:fromJsonEncoding:embedded", (t) => {
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
	);

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

test("domain:streamAggregateDatum:fromJsonEncoding:registry", (t) => {
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
	);

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

test("domain:streamAggregateDatum:toJsonEncoding:embedded", (t) => {
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

test("domain:streamAggregateDatum:toJsonEncoding:registry", (t) => {
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
	t.is(
		json,
		`[0,[${ts[0].getTime()},${ts[1].getTime()}],[1,2,3,4],[2,3,4,5],[4,5,6],"six","foo"]`
	);
});
