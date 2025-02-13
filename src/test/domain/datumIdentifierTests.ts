import test from "ava";

import DatumIdentifier from "../../main/domain/datumIdentifier.js";
import DatumStreamTypes from "../../main/domain/datumStreamType.js";
import Aggregations from "../../main/domain/aggregation.js";
import { timestampFormat } from "../../main/util/dates.js";

test("create:all", (t) => {
	// GIVEN
	const ts = new Date();
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const kind = DatumStreamTypes.Node;
	const agg = Aggregations.None;
	const nodeId = 123;
	const sourceId = "test/source";

	// WHEN
	const obj = new DatumIdentifier(kind, ts, sourceId, nodeId, agg, streamId);

	// THEN
	t.truthy(obj);
	t.is(obj.kind, kind);
	t.is(obj.streamId, streamId);
	t.is(obj.timestamp, ts);
	t.is(obj.objectId, nodeId);
	t.is(obj.sourceId, sourceId);
});

test("create:stringKind:key", (t) => {
	// GIVEN
	const ts = new Date();
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const kind = "n";
	const agg = Aggregations.None;
	const nodeId = 123;
	const sourceId = "test/source";

	// WHEN
	const obj = new DatumIdentifier(kind, ts, sourceId, nodeId, agg, streamId);

	// THEN
	t.truthy(obj);
	t.is(obj.kind, DatumStreamTypes.Node);
	t.is(obj.streamId, streamId);
	t.is(obj.timestamp, ts);
	t.is(obj.objectId, nodeId);
	t.is(obj.sourceId, sourceId);
});

test("create:stringKind:name", (t) => {
	// GIVEN
	const ts = new Date();
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const kind = "Node";
	const agg = Aggregations.None;
	const nodeId = 123;
	const sourceId = "test/source";

	// WHEN
	const obj = new DatumIdentifier(kind, ts, sourceId, nodeId, agg, streamId);

	// THEN
	t.truthy(obj);
	t.is(obj.kind, DatumStreamTypes.Node);
	t.is(obj.streamId, streamId);
	t.is(obj.timestamp, ts);
	t.is(obj.objectId, nodeId);
	t.is(obj.sourceId, sourceId);
});

test("create:streamStyle", (t) => {
	// GIVEN
	const ts = new Date();
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const kind = DatumStreamTypes.Node;

	// WHEN
	const obj = new DatumIdentifier(kind, ts, streamId);

	// THEN
	t.truthy(obj);
	t.is(obj.kind, kind);
	t.is(obj.streamId, streamId);
	t.is(obj.timestamp, ts);
	t.is(obj.objectId, undefined);
	t.is(obj.sourceId, undefined);
	t.is(obj.aggregation, undefined);
});

test("create:streamStyle:withAgg", (t) => {
	// GIVEN
	const ts = new Date();
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const kind = DatumStreamTypes.Node;
	const agg = Aggregations.None;

	// WHEN
	const obj = new DatumIdentifier(kind, ts, streamId, agg);

	// THEN
	t.truthy(obj);
	t.is(obj.kind, kind);
	t.is(obj.streamId, streamId);
	t.is(obj.timestamp, ts);
	t.is(obj.objectId, undefined);
	t.is(obj.sourceId, undefined);
});

test("factory:node", (t) => {
	// GIVEN
	const ts = new Date();
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const agg = Aggregations.None;
	const nodeId = 123;
	const sourceId = "test/source";

	// WHEN
	const obj = DatumIdentifier.nodeId(ts, sourceId, nodeId, agg, streamId);

	// THEN
	t.truthy(obj);
	t.is(obj.kind, DatumStreamTypes.Node);
	t.is(obj.streamId, streamId);
	t.is(obj.timestamp, ts);
	t.is(obj.objectId, nodeId);
	t.is(obj.sourceId, sourceId);
});

test("factory:node:streamStyle:minimum", (t) => {
	// GIVEN
	const ts = new Date();
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";

	// WHEN
	const ident = DatumIdentifier.nodeId(ts, streamId);

	// THEN
	t.truthy(ident);
	t.is(ident.kind, DatumStreamTypes.Node);
	t.is(ident.streamId, streamId);
	t.is(ident.timestamp, ts);
	t.is(ident.objectId, undefined);
	t.is(ident.sourceId, undefined);
});

test("factory:node:objectAndSourceStyle:minimum", (t) => {
	// GIVEN
	const ts = new Date();
	const sourceId = "test/source";
	const nodeId = 123;

	// WHEN
	const ident = DatumIdentifier.nodeId(ts, sourceId, nodeId);

	// THEN
	t.truthy(ident);
	t.is(ident.kind, DatumStreamTypes.Node);
	t.is(ident.streamId, undefined);
	t.is(ident.timestamp, ts);
	t.is(ident.objectId, nodeId);
	t.is(ident.sourceId, sourceId);
});

test("fromJsonObject:undefined", (t) => {
	const ident = DatumIdentifier.fromJsonObject(undefined);
	t.is(ident, undefined, "undefined returned on undefined input");
});

test("fromJsonEncoding", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const nodeId = 123;
	const sourceId = "test/source";
	const ts = "2025-01-02 03:04:05.678Z";

	// WHEN
	const ident = DatumIdentifier.fromJsonEncoding(
		`{"kind":"n","timestamp":"${ts}","streamId":"${streamId}","objectId":${nodeId},"sourceId":"${sourceId}"}`
	);

	// THEN
	t.truthy(ident);
	if (!ident) {
		return;
	}
	t.is(ident.kind, DatumStreamTypes.Node);
	t.deepEqual(ident.timestamp, new Date(ts));
	t.is(ident.streamId, streamId);
	t.is(ident.objectId, nodeId);
	t.is(ident.sourceId, sourceId);
	t.is(ident.aggregation, undefined);
});

test("fromJsonEncoding:withAgg", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const nodeId = 123;
	const sourceId = "test/source";
	const ts = "2025-01-02 03:04:05.678Z";
	const agg = Aggregations.None;

	// WHEN
	const ident = DatumIdentifier.fromJsonEncoding(
		`{"kind":"n","timestamp":"${ts}","streamId":"${streamId}","objectId":${nodeId},"sourceId":"${sourceId}","aggregation":"${agg.name}"}`
	);

	// THEN
	t.truthy(ident);
	if (!ident) {
		return;
	}
	t.is(ident.kind, DatumStreamTypes.Node);
	t.deepEqual(ident.timestamp, new Date(ts));
	t.is(ident.streamId, streamId);
	t.is(ident.objectId, nodeId);
	t.is(ident.sourceId, sourceId);
	t.is(ident.aggregation, agg);
});

test("fromJsonEncoding:unknownKind", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const nodeId = 123;
	const sourceId = "test/source";
	const ts = "2025-01-02 03:04:05.678Z";

	// WHEN
	const ident = DatumIdentifier.fromJsonEncoding(
		`{"kind":"NOT A KIND","timestamp":"${ts}","streamId":"${streamId}","objectId":${nodeId},"sourceId":"${sourceId}"}`
	);

	// THEN
	t.truthy(ident);
	if (!ident) {
		return;
	}
	t.is(ident.kind, DatumStreamTypes.Node, "unknown kind defaults to Node");
	t.deepEqual(ident.timestamp, new Date(ts));
	t.is(ident.streamId, streamId);
	t.is(ident.objectId, nodeId);
	t.is(ident.sourceId, sourceId);
	t.is(ident.aggregation, undefined);
});

test("fromJsonEncoding:noKind", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const nodeId = 123;
	const sourceId = "test/source";
	const ts = "2025-01-02 03:04:05.678Z";

	// WHEN
	const ident = DatumIdentifier.fromJsonEncoding(
		`{"timestamp":"${ts}","streamId":"${streamId}","objectId":${nodeId},"sourceId":"${sourceId}"}`
	);

	// THEN
	t.truthy(ident);
	if (!ident) {
		return;
	}
	t.is(ident.kind, DatumStreamTypes.Node, "missing kind defaults to Node");
	t.deepEqual(ident.timestamp, new Date(ts));
	t.is(ident.streamId, streamId);
	t.is(ident.objectId, nodeId);
	t.is(ident.sourceId, sourceId);
	t.is(ident.aggregation, undefined);
});

test("toJsonObject", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const nodeId = 123;
	const sourceId = "test/source";
	const ts = "2025-01-02 03:04:05.678Z";
	const agg = Aggregations.None;

	const ident = DatumIdentifier.nodeId(ts, sourceId, nodeId, agg, streamId);

	// WHEN
	const obj = ident.toJsonObject();
	t.deepEqual(obj, {
		kind: "n",
		timestamp: ts,
		streamId: streamId,
		objectId: nodeId,
		sourceId: sourceId,
		aggregation: agg.name,
	});
});

test("toJsonEncoding", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const nodeId = 123;
	const sourceId = "test/source";
	const ts = "2025-01-02 03:04:05.678Z";
	const agg = Aggregations.None;

	const ident = DatumIdentifier.nodeId(ts, sourceId, nodeId, agg, streamId);

	// WHEN
	const json = ident.toJsonEncoding();
	t.is(
		json,
		`{"kind":"n","timestamp":"${ts}","streamId":"${streamId}","objectId":${nodeId},"sourceId":"${sourceId}","aggregation":"${agg.name}"}`
	);
});

test("toJsonEncoding:noAgg", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const nodeId = 123;
	const sourceId = "test/source";
	const ts = "2025-01-02 03:04:05.678Z";

	const ident = DatumIdentifier.nodeId(
		ts,
		sourceId,
		nodeId,
		undefined,
		streamId
	);

	// WHEN
	const json = ident.toJsonEncoding();
	t.is(
		json,
		`{"kind":"n","timestamp":"${ts}","streamId":"${streamId}","objectId":${nodeId},"sourceId":"${sourceId}"}`
	);
});

test("toJsonEncoding:streamStyle", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const ts = "2025-01-02 03:04:05.678Z";

	const ident = DatumIdentifier.nodeId(ts, streamId);

	// WHEN
	const json = ident.toJsonEncoding();
	t.is(json, `{"kind":"n","timestamp":"${ts}","streamId":"${streamId}"}`);
});

test("toJsonEncoding:streamStyle:location", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const ts = "2025-01-02 03:04:05.678Z";

	const ident = DatumIdentifier.locationId(ts, streamId);

	// WHEN
	const json = ident.toJsonEncoding();
	t.is(json, `{"kind":"l","timestamp":"${ts}","streamId":"${streamId}"}`);
});

test("toJsonEncoding:objectSourceStyle", (t) => {
	// GIVEN
	const nodeId = 123;
	const sourceId = "test/source";
	const ts = "2025-01-02 03:04:05.678Z";

	const ident = DatumIdentifier.nodeId(ts, sourceId, nodeId);

	// WHEN
	const json = ident.toJsonEncoding();
	t.is(
		json,
		`{"kind":"n","timestamp":"${ts}","objectId":${nodeId},"sourceId":"${sourceId}"}`
	);
});

test("toJsonEncoding:objectSourceStyle:location", (t) => {
	// GIVEN
	const nodeId = 123;
	const sourceId = "test/source";
	const ts = "2025-01-02 03:04:05.678Z";

	const ident = DatumIdentifier.locationId(ts, sourceId, nodeId);

	// WHEN
	const json = ident.toJsonEncoding();

	// THEN
	t.is(
		json,
		`{"kind":"l","timestamp":"${ts}","objectId":${nodeId},"sourceId":"${sourceId}"}`
	);
});

test("fullySpeced:objectAndSourceStyle", (t) => {
	// GIVEN
	const ident = DatumIdentifier.nodeId(
		"2025-01-02 03:04:05.678Z",
		"test/source",
		123
	);

	// THEN
	t.is(ident.isFullySpecified(), true);
});

test("fullySpeced:streaemStyle", (t) => {
	// GIVEN
	const ident = DatumIdentifier.nodeId(
		"2025-01-02 03:04:05.678Z",
		"7714f762-2361-4ec2-98ab-7e96807b32a6"
	);

	// THEN
	t.is(ident.isFullySpecified(), true);
});

test("fullySpeced:noIds", (t) => {
	// GIVEN
	const ident = new DatumIdentifier(
		DatumStreamTypes.Node,
		"2025-01-02 03:04:05.678Z",
		undefined as any
	);

	// THEN
	t.is(ident.objectId, undefined);
	t.is(ident.sourceId, undefined);
	t.is(ident.isFullySpecified(), false, "no stream or object or source IDs");
});

test("fullySpeced:onlyObjectId", (t) => {
	// GIVEN
	const nodeId = 123;
	const ident = new DatumIdentifier(
		DatumStreamTypes.Node,
		"2025-01-02 03:04:05.678Z",
		undefined as any,
		nodeId
	);

	// THEN
	t.is(ident.objectId, nodeId);
	t.is(ident.sourceId, undefined);
	t.is(ident.streamId, undefined);
	t.is(ident.isFullySpecified(), false, "only object ID");
});

test("fullySpeced:noTimestamp", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const ident = new DatumIdentifier(
		DatumStreamTypes.Node,
		undefined as any,
		streamId,
		undefined as any,
		Aggregations.None,
		undefined as any
	);

	// THEN
	t.is(ident.timestamp, undefined as any);
	t.is(ident.objectId, undefined);
	t.is(ident.sourceId, undefined);
	t.is(ident.streamId, streamId);
	t.is(ident.isFullySpecified(), false, "no timestamp");
});

test("jsonArrayRoundtrip", (t) => {
	// GIVEN
	const ts = new Date();
	const data = [
		DatumIdentifier.nodeId(ts, "meter/1", 327),
		DatumIdentifier.nodeId(ts, "meter/2", 327),
	];

	// WHEN
	const reqBodyJson = `[${data.map((id) => id.toJsonEncoding()).join(",")}]`;

	// THEN
	t.is(
		reqBodyJson,
		`[{"kind":"n","timestamp":"${timestampFormat(
			ts
		)}","objectId":327,"sourceId":"meter/1"},{"kind":"n","timestamp":"${timestampFormat(
			ts
		)}","objectId":327,"sourceId":"meter/2"}]`
	);

	const roundTrip = (JSON.parse(reqBodyJson) as object[]).map((o) =>
		DatumIdentifier.fromJsonObject(o)
	);
	t.deepEqual(roundTrip, data);
});
