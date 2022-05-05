import test from "ava";

import DatumSamplesTypes from "domain/datumSamplesType";
import DatumStreamMetadata from "domain/datumStreamMetadata";
import DatumStreamMetadataRegistry from "util/datumStreamMetadataRegistry";
import DatumStreamTypes from "domain/datumStreamType";

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

test("util:datumStreamMetadataRegistry:empty", t => {
	// WHEN
	const obj = new DatumStreamMetadataRegistry();

	// THEN
	t.truthy(obj);
	t.deepEqual(obj.metadataStreamIds(), new Set());
	t.deepEqual(obj.metadataStreamIdsList(), []);
});

test("util:datumStreamMetadataRegistry:populated", t => {
	// GIVEN
	let metas = [];
	let metaMap = new Map();
	for (let i = 1; i <= 5; i += 1) {
		let streamId = `${i}-a-b-c`;
		let meta = testNodeMetadata(streamId, i, `source/${i}`);
		metas.push(meta);
		metaMap.set(streamId, meta);
	}

	// WHEN
	const obj = new DatumStreamMetadataRegistry(metas);

	// THEN
	t.truthy(obj);
	const expectedStreamIds = ["1-a-b-c", "2-a-b-c", "3-a-b-c", "4-a-b-c", "5-a-b-c"];
	t.deepEqual(obj.metadataStreamIds(), new Set(expectedStreamIds));
	t.deepEqual(obj.metadataStreamIdsList(), expectedStreamIds);
	for (let i = 1; i <= 5; i += 1) {
		let streamId = `${i}-a-b-c`;
		let expected = metaMap.get(streamId);
		t.is(obj.metadataForStreamId(streamId), expected);
		t.is(obj.metadataForObjectSource(i, `source/${i}`), expected);
	}
});

test("util:datumStreamMetadataRegistry:addMetadata", t => {
	// GIVEN
	let metas = [];
	let metaMap = new Map();
	for (let i = 1; i <= 3; i += 1) {
		let streamId = `${i}-a-b-c`;
		let meta = testNodeMetadata(streamId, i, `source/${i}`);
		metas.push(meta);
		metaMap.set(streamId, meta);
	}
	const obj = new DatumStreamMetadataRegistry(metas);

	// WHEN
	const addedMeta = testNodeMetadata("foo-bar", 100, "bam/pow");
	obj.addMetadata(addedMeta);

	// THEN
	t.truthy(obj);
	const expectedStreamIds = ["1-a-b-c", "2-a-b-c", "3-a-b-c", "foo-bar"];
	t.deepEqual(obj.metadataStreamIds(), new Set(expectedStreamIds));
	t.deepEqual(obj.metadataStreamIdsList(), expectedStreamIds);
	for (let i = 1; i <= 3; i += 1) {
		let streamId = `${i}-a-b-c`;
		let expected = metaMap.get(streamId);
		t.is(obj.metadataForStreamId(streamId), expected);
		t.is(obj.metadataForObjectSource(i, `source/${i}`), expected);
	}
	t.is(obj.metadataForStreamId(addedMeta.streamId), addedMeta);
});

test("util:datumStreamMetadataRegistry:fromJsonEncoding", t => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const nodeId = 123;
	const sourceId = "test/source";

	// WHEN
	const reg = DatumStreamMetadataRegistry.fromJsonEncoding(
		'[{"streamId":"' +
			streamId +
			'","zone":"Pacific/Auckland","kind":"n","objectId":' +
			nodeId +
			',"sourceId":"' +
			sourceId +
			'","i":["a","b","c"],"a":["d","e"],"s":["f"]}]'
	);

	// THEN
	t.truthy(reg);
	t.deepEqual(reg.metadataStreamIdsList(), [streamId]);
	let meta = reg.metadataForStreamId(streamId);
	t.is(meta.streamId, streamId);
	t.is(meta.timeZoneId, "Pacific/Auckland");
	t.is(meta.kind, DatumStreamTypes.Node);
	t.is(meta.objectId, nodeId);
	t.is(meta.sourceId, sourceId);
	t.is(meta.instantaneousLength, 3);
	t.deepEqual(meta.propertyNamesForType(DatumSamplesTypes.Instantaneous), ["a", "b", "c"]);
	t.is(meta.accumulatingLength, 2);
	t.deepEqual(meta.propertyNamesForType(DatumSamplesTypes.Accumulating), ["d", "e"]);
	t.is(meta.statusLength, 1);
	t.deepEqual(meta.propertyNamesForType(DatumSamplesTypes.Status), ["f"]);
});

test("util:datumStreamMetadataRegistry:toJsonEncoding", t => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const nodeId = 123;
	const sourceId = "test/source";
	const meta = testNodeMetadata(streamId, nodeId, sourceId);
	const reg = new DatumStreamMetadataRegistry([meta]);

	// WHEN
	const json = reg.toJsonEncoding();
	t.is(
		json,
		'[{"streamId":"' +
			streamId +
			'","zone":"Pacific/Auckland","kind":"n","objectId":' +
			nodeId +
			',"sourceId":"' +
			sourceId +
			'","i":["a","b","c"],"a":["d","e"],"s":["f"]}]'
	);
});
