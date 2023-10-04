import test from "ava";

import DatumStreamMetadata from "../../src/domain/datumStreamMetadata.js";
import DatumStreamTypes from "../../src/domain/datumStreamType.js";
import { AggregateDatum, Datum } from "../../src/domain/streamDatumMetadataMixin.js";
import { datumForStreamData } from "../../src/util/streamDatumUtils.js";

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
		sNames,
	);
}

test("util:streamDatumUtils:datumForStreamData:datum", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const nodeId = 123;
	const sourceId = "test/source";
	const meta = testNodeMetadata(streamId, nodeId, sourceId);
	const ts = new Date();

	// WHEN
	const d = datumForStreamData([streamId, ts.getTime(), 1, 2, 3, 4, 5, "six", "foo"], meta);

	// THEN
	t.truthy(d);
	t.is(d instanceof Datum, true);
	t.is(d.metadata, meta);
	t.is(d.streamId, streamId);
	t.is(d.ts.getTime(), ts.getTime());
	t.deepEqual(d.iProps, [1, 2, 3]);
	t.deepEqual(d.aProps, [4, 5]);
	t.deepEqual(d.sProps, ["six"]);
	t.deepEqual(d.tags, new Set(["foo"]));
});

test("util:streamDatumUtils:datumForStreamData:datum:json", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const nodeId = 123;
	const sourceId = "test/source";
	const meta = testNodeMetadata(streamId, nodeId, sourceId);
	const ts = new Date();

	// WHEN
	const d = datumForStreamData(`["${streamId}",${ts.getTime()},1,2,3,4,5,"six","foo"]`, meta);

	// THEN
	t.truthy(d);
	t.is(d instanceof Datum, true);
	t.is(d.metadata, meta);
	t.is(d.streamId, streamId);
	t.is(d.ts.getTime(), ts.getTime());
	t.deepEqual(d.iProps, [1, 2, 3]);
	t.deepEqual(d.aProps, [4, 5]);
	t.deepEqual(d.sProps, ["six"]);
	t.deepEqual(d.tags, new Set(["foo"]));
});

test("util:streamDatumUtils:datumForStreamData:aggregateDatum", (t) => {
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
		meta,
	);

	// THEN
	t.truthy(d);
	t.is(d instanceof AggregateDatum, true);
	t.is(d.metadata, meta);
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

test("util:streamDatumUtils:datumForStreamData:aggregateDatum:json", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const nodeId = 123;
	const sourceId = "test/source";
	const meta = testNodeMetadata2(streamId, nodeId, sourceId);
	const ts = [new Date(2022, 4, 1), new Date(2022, 5, 1)];

	// WHEN
	const d = datumForStreamData(
		`["${streamId}",[${ts[0].getTime()},${ts[1].getTime()}],[1,2,3,4],[2,3,4,5],[4,5,6],"six","foo"]`,
		meta,
	);

	// THEN
	t.truthy(d);
	t.is(d instanceof AggregateDatum, true);
	t.is(d.metadata, meta);
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
