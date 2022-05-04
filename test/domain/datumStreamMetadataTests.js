import test from "ava";

import DatumStreamMetadata from "domain/datumStreamMetadata";
import DatumStreamTypes from "domain/datumStreamType";
import DatumSamplesTypes from "domain/datumSamplesType";

test("domain:datumStreamMetadata:create:node", t => {
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
	t.is(obj.locationId, null);
	t.is(obj.sourceId, sourceId);
	t.deepEqual(obj.propertyNamesForType(DatumSamplesTypes.Instantaneous), iNames);
	t.deepEqual(obj.propertyNamesForType(DatumSamplesTypes.Accumulating), aNames);
	t.deepEqual(obj.propertyNamesForType(DatumSamplesTypes.Status), sNames);
});

test("domain:datumStreamMetadata:create:location", t => {
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
	t.is(obj.nodeId, null);
	t.is(obj.locationId, locId);
	t.is(obj.sourceId, sourceId);
	t.deepEqual(obj.propertyNamesForType(DatumSamplesTypes.Instantaneous), iNames);
	t.deepEqual(obj.propertyNamesForType(DatumSamplesTypes.Accumulating), aNames);
	t.deepEqual(obj.propertyNamesForType(DatumSamplesTypes.Status), sNames);
});

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

test("domain:datumStreamMetadata:propertyNames", t => {
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
	t.deepEqual(meta.propertyNamesForType(DatumSamplesTypes.Instantaneous), ["a", "b", "c"]);
	t.is(meta.accumulatingLength, 2);
	t.deepEqual(meta.propertyNamesForType(DatumSamplesTypes.Accumulating), ["d", "e"]);
	t.is(meta.statusLength, 1);
	t.deepEqual(meta.propertyNamesForType(DatumSamplesTypes.Status), ["f"]);
});

test("domain:datumStreamMetadata:fromJsonEncoding", t => {
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
	t.is(meta.streamId, "7714f762-2361-4ec2-98ab-7e96807b32a6");
	t.is(meta.timeZoneId, "Pacific/Auckland");
	t.is(meta.kind, DatumStreamTypes.Node);
	t.is(meta.objectId, 123);
	t.is(meta.sourceId, "test/source");
	t.is(meta.instantaneousLength, 3);
	t.deepEqual(meta.propertyNamesForType(DatumSamplesTypes.Instantaneous), ["a", "b", "c"]);
	t.is(meta.accumulatingLength, 2);
	t.deepEqual(meta.propertyNamesForType(DatumSamplesTypes.Accumulating), ["d", "e"]);
	t.is(meta.statusLength, 1);
	t.deepEqual(meta.propertyNamesForType(DatumSamplesTypes.Status), ["f"]);
});

test("domain:datumStreamMetadata:toJsonEncoding", t => {
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
