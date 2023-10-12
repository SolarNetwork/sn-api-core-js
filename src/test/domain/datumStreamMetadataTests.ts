import test from "ava";

import DatumStreamMetadata from "../../main/domain/datumStreamMetadata.js";
import DatumStreamTypes from "../../main/domain/datumStreamType.js";
import DatumSamplesTypes from "../../main/domain/datumSamplesType.js";

test("create:node", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const timeZoneId = "Pacific/Auckland";
	const streamKind = DatumStreamTypes.Node;
	const nodeId = 123;
	const sourceId = "test/source";
	const iNames = ["a", "b", "c"];
	const aNames = ["d", "e"];
	const sNames = ["f"];

	// WHEN
	const obj = new DatumStreamMetadata(
		streamId,
		timeZoneId,
		streamKind,
		nodeId,
		sourceId,
		iNames,
		aNames,
		sNames
	);

	// THEN
	t.truthy(obj);
	t.is(obj.streamId, streamId);
	t.is(obj.timeZoneId, timeZoneId);
	t.is(obj.kind, streamKind);
	t.is(obj.objectId, nodeId);
	t.is(obj.nodeId, nodeId);
	t.is(obj.locationId, undefined);
	t.is(obj.sourceId, sourceId);
	t.deepEqual(
		obj.propertyNamesForType(DatumSamplesTypes.Instantaneous),
		iNames
	);
	t.deepEqual(
		obj.propertyNamesForType(DatumSamplesTypes.Accumulating),
		aNames
	);
	t.deepEqual(obj.propertyNamesForType(DatumSamplesTypes.Status), sNames);

	t.is(
		obj.propertyNamesForType(DatumSamplesTypes.Tag),
		undefined,
		"tag type not supported"
	);
	t.is(
		obj.propertyNamesForType({} as any),
		undefined,
		"invalid type returns undefined"
	);
});

test("create:node:factory", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const timeZoneId = "Pacific/Auckland";
	const nodeId = 123;
	const sourceId = "test/source";
	const iNames = ["a", "b", "c"];
	const aNames = ["d", "e"];
	const sNames = ["f"];

	// WHEN
	const obj = DatumStreamMetadata.nodeMetadata(
		streamId,
		timeZoneId,
		nodeId,
		sourceId,
		iNames,
		aNames,
		sNames
	);

	// THEN
	t.truthy(obj);
	t.is(obj.streamId, streamId);
	t.is(obj.timeZoneId, timeZoneId);
	t.is(obj.kind, DatumStreamTypes.Node);
	t.is(obj.objectId, nodeId);
	t.is(obj.nodeId, nodeId);
	t.is(obj.locationId, undefined);
	t.is(obj.sourceId, sourceId);
	t.deepEqual(
		obj.propertyNamesForType(DatumSamplesTypes.Instantaneous),
		iNames
	);
	t.deepEqual(
		obj.propertyNamesForType(DatumSamplesTypes.Accumulating),
		aNames
	);
	t.deepEqual(obj.propertyNamesForType(DatumSamplesTypes.Status), sNames);

	t.is(
		obj.propertyNamesForType(DatumSamplesTypes.Tag),
		undefined,
		"tag type not supported"
	);
	t.is(
		obj.propertyNamesForType({} as any),
		undefined,
		"invalid type returns undefined"
	);
});

test("create:node:unknownType", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const timeZoneId = "Pacific/Auckland";
	const nodeId = 123;
	const sourceId = "test/source";
	const iNames = ["a", "b", "c"];
	const aNames = ["d", "e"];
	const sNames = ["f"];

	// WHEN
	const obj = new DatumStreamMetadata(
		streamId,
		timeZoneId,
		"foo" as any,
		nodeId,
		sourceId,
		iNames,
		aNames,
		sNames
	);

	// THEN
	t.truthy(obj);
	t.is(obj.streamId, streamId);
	t.is(obj.timeZoneId, timeZoneId);
	t.is(obj.kind, DatumStreamTypes.Node, "unknown type defaults to Node");
	t.is(obj.objectId, nodeId);
	t.is(obj.nodeId, nodeId);
	t.is(obj.locationId, undefined);
	t.is(obj.sourceId, sourceId);
	t.deepEqual(
		obj.propertyNamesForType(DatumSamplesTypes.Instantaneous),
		iNames
	);
	t.deepEqual(
		obj.propertyNamesForType(DatumSamplesTypes.Accumulating),
		aNames
	);
	t.deepEqual(obj.propertyNamesForType(DatumSamplesTypes.Status), sNames);

	t.is(
		obj.propertyNamesForType(DatumSamplesTypes.Tag),
		undefined,
		"tag type not supported"
	);
	t.is(
		obj.propertyNamesForType({} as any),
		undefined,
		"invalid type returns undefined"
	);
});

test("create:location", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const timeZoneId = "Pacific/Auckland";
	const streamKind = DatumStreamTypes.Location;
	const locId = 123;
	const sourceId = "test/source";
	const iNames = ["a", "b", "c"];
	const aNames = ["d", "e"];
	const sNames = ["f"];

	// WHEN
	const obj = new DatumStreamMetadata(
		streamId,
		timeZoneId,
		streamKind,
		locId,
		sourceId,
		iNames,
		aNames,
		sNames
	);

	// THEN
	t.truthy(obj);
	t.is(obj.streamId, streamId);
	t.is(obj.timeZoneId, timeZoneId);
	t.is(obj.kind, streamKind);
	t.is(obj.objectId, locId);
	t.is(obj.nodeId, undefined);
	t.is(obj.locationId, locId);
	t.is(obj.sourceId, sourceId);
	t.deepEqual(
		obj.propertyNamesForType(DatumSamplesTypes.Instantaneous),
		iNames
	);
	t.deepEqual(
		obj.propertyNamesForType(DatumSamplesTypes.Accumulating),
		aNames
	);
	t.deepEqual(obj.propertyNamesForType(DatumSamplesTypes.Status), sNames);
});

test("create:location:factory", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const timeZoneId = "Pacific/Auckland";
	const locId = 123;
	const sourceId = "test/source";
	const iNames = ["a", "b", "c"];
	const aNames = ["d", "e"];
	const sNames = ["f"];

	// WHEN
	const obj = DatumStreamMetadata.locationMetadata(
		streamId,
		timeZoneId,
		locId,
		sourceId,
		iNames,
		aNames,
		sNames
	);

	// THEN
	t.truthy(obj);
	t.is(obj.streamId, streamId);
	t.is(obj.timeZoneId, timeZoneId);
	t.is(obj.kind, DatumStreamTypes.Location);
	t.is(obj.objectId, locId);
	t.is(obj.nodeId, undefined);
	t.is(obj.locationId, locId);
	t.is(obj.sourceId, sourceId);
	t.deepEqual(
		obj.propertyNamesForType(DatumSamplesTypes.Instantaneous),
		iNames
	);
	t.deepEqual(
		obj.propertyNamesForType(DatumSamplesTypes.Accumulating),
		aNames
	);
	t.deepEqual(obj.propertyNamesForType(DatumSamplesTypes.Status), sNames);
});

function testNodeMetadata(
	streamId: string,
	nodeId: number,
	sourceId: string
): DatumStreamMetadata {
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

test("propertyNames", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const nodeId = 123;
	const sourceId = "test/source";

	// WHEN
	const meta = testNodeMetadata(streamId, nodeId, sourceId);

	// THEN
	t.truthy(meta);
	t.deepEqual(meta.propertyNames, ["a", "b", "c", "d", "e", "f"]);
	t.is(meta.instantaneousLength, 3);
	t.deepEqual(meta.propertyNamesForType(DatumSamplesTypes.Instantaneous), [
		"a",
		"b",
		"c",
	]);
	t.is(meta.accumulatingLength, 2);
	t.deepEqual(meta.propertyNamesForType(DatumSamplesTypes.Accumulating), [
		"d",
		"e",
	]);
	t.is(meta.statusLength, 1);
	t.deepEqual(meta.propertyNamesForType(DatumSamplesTypes.Status), ["f"]);
});

test("fromJsonObject:undefined", (t) => {
	const meta = DatumStreamMetadata.fromJsonObject(undefined);
	t.is(meta, undefined, "undefined returned on undefined input");
});

test("fromJsonEncoding", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const nodeId = 123;
	const sourceId = "test/source";

	// WHEN
	const meta = DatumStreamMetadata.fromJsonEncoding(
		'{"streamId":"' +
			streamId +
			'","zone":"Pacific/Auckland","kind":"n","objectId":' +
			nodeId +
			',"sourceId":"' +
			sourceId +
			'","i":["a","b","c"],"a":["d","e"],"s":["f"]}'
	);

	// THEN
	t.truthy(meta);
	if (!meta) {
		return;
	}
	t.is(meta.streamId, "7714f762-2361-4ec2-98ab-7e96807b32a6");
	t.is(meta.timeZoneId, "Pacific/Auckland");
	t.is(meta.kind, DatumStreamTypes.Node);
	t.is(meta.objectId, 123);
	t.is(meta.sourceId, "test/source");
	t.is(meta.instantaneousLength, 3);
	t.deepEqual(meta.propertyNamesForType(DatumSamplesTypes.Instantaneous), [
		"a",
		"b",
		"c",
	]);
	t.is(meta.accumulatingLength, 2);
	t.deepEqual(meta.propertyNamesForType(DatumSamplesTypes.Accumulating), [
		"d",
		"e",
	]);
	t.is(meta.statusLength, 1);
	t.deepEqual(meta.propertyNamesForType(DatumSamplesTypes.Status), ["f"]);
});

test("fromJsonEncoding:unknownType", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const nodeId = 123;
	const sourceId = "test/source";

	// WHEN
	const meta = DatumStreamMetadata.fromJsonEncoding(
		'{"streamId":"' +
			streamId +
			'","zone":"Pacific/Auckland","kind":"NOT A KIND","objectId":' +
			nodeId +
			',"sourceId":"' +
			sourceId +
			'","i":["a","b","c"],"a":["d","e"],"s":["f"]}'
	);

	// THEN
	t.truthy(meta);
	if (!meta) {
		return;
	}
	t.is(meta.kind, DatumStreamTypes.Node);
});

test("toJsonEncoding", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const nodeId = 123;
	const sourceId = "test/source";
	const meta = testNodeMetadata(streamId, nodeId, sourceId);

	// WHEN
	const json = meta.toJsonEncoding();
	t.is(
		json,
		'{"streamId":"' +
			streamId +
			'","zone":"Pacific/Auckland","kind":"n","objectId":' +
			nodeId +
			',"sourceId":"' +
			sourceId +
			'","i":["a","b","c"],"a":["d","e"],"s":["f"]}'
	);
});

test("propertyNames:undefined", (t) => {
	const meta = DatumStreamMetadata.fromJsonEncoding(
		'{"streamId":"foo","zone":"Pacific/Auckland","kind":"n","objectId":1,"sourceId":"bar"}'
	);

	t.is(meta?.propertyNamesLength, 0);
	t.is(
		meta?.propertyNames,
		undefined,
		"undefined returned when no property names available"
	);
	t.is(meta?.instantaneousLength, 0);
	t.is(
		meta?.instantaneousNames,
		undefined,
		"undefined returned when no property names available"
	);
	t.is(meta?.accumulatingLength, 0);
	t.is(
		meta?.accumulatingNames,
		undefined,
		"undefined returned when no property names available"
	);
	t.is(meta?.statusLength, 0);
	t.is(
		meta?.statusNames,
		undefined,
		"undefined returned when no property names available"
	);
});

test("instantaneousNames", (t) => {
	const meta = DatumStreamMetadata.fromJsonEncoding(
		'{"streamId":"foo","zone":"Pacific/Auckland","kind":"n","objectId":1,"sourceId":"bar","i":["a","b"]}'
	);

	t.is(meta?.instantaneousLength, 2);
	t.deepEqual(meta?.instantaneousNames, ["a", "b"]);
});

test("accumulatingNames", (t) => {
	const meta = DatumStreamMetadata.fromJsonEncoding(
		'{"streamId":"foo","zone":"Pacific/Auckland","kind":"n","objectId":1,"sourceId":"bar","a":["a","b"]}'
	);

	t.is(meta?.accumulatingLength, 2);
	t.deepEqual(meta?.accumulatingNames, ["a", "b"]);
});

test("statusNames", (t) => {
	const meta = DatumStreamMetadata.fromJsonEncoding(
		'{"streamId":"foo","zone":"Pacific/Auckland","kind":"n","objectId":1,"sourceId":"bar","s":["a","b"]}'
	);

	t.is(meta?.statusLength, 2);
	t.deepEqual(meta?.statusNames, ["a", "b"]);
});
