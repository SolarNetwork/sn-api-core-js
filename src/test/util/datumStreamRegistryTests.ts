import test from "ava";

import DatumSamplesTypes from "../../main/domain/datumSamplesType.js";
import DatumStreamMetadata from "../../main/domain/datumStreamMetadata.js";
import DatumStreamMetadataRegistry from "../../main/util/datumStreamMetadataRegistry.js";
import DatumStreamTypes from "../../main/domain/datumStreamType.js";

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

test("empty", (t) => {
	// WHEN
	const obj = new DatumStreamMetadataRegistry();

	// THEN
	t.truthy(obj);
	t.deepEqual(obj.metadataStreamIds(), new Set());
	t.deepEqual(obj.metadataStreamIdsList(), []);
});

test("indexOfMetadataStreamId:notFound", (t) => {
	// GIVEN
	const obj = new DatumStreamMetadataRegistry();

	// WHEN
	const idx = obj.indexOfMetadataStreamId("foo");

	// THEN
	t.is(idx, -1, "-1 returned when stream ID not found");
});

test("metadataForObjectSource:notFound", (t) => {
	// GIVEN
	const obj = new DatumStreamMetadataRegistry();

	// WHEN
	const result = obj.metadataForObjectSource(1, "foo");

	// THEN
	t.is(result, undefined, "undefined returned when IDs not found");
});

test("populated", (t) => {
	// GIVEN
	const metas = [] as DatumStreamMetadata[];
	const metaMap = new Map<string, DatumStreamMetadata>();
	for (let i = 1; i <= 5; i += 1) {
		const streamId = `${i}-a-b-c`;
		const meta = testNodeMetadata(streamId, i, `source/${i}`);
		metas.push(meta);
		metaMap.set(streamId, meta);
	}

	// WHEN
	const obj = new DatumStreamMetadataRegistry(metas);

	// THEN
	t.truthy(obj);
	const expectedStreamIds = [
		"1-a-b-c",
		"2-a-b-c",
		"3-a-b-c",
		"4-a-b-c",
		"5-a-b-c",
	];
	t.deepEqual(obj.metadataStreamIds(), new Set(expectedStreamIds));
	t.deepEqual(obj.metadataStreamIdsList(), expectedStreamIds);
	for (let i = 1; i <= 5; i += 1) {
		const streamId = `${i}-a-b-c`;
		const expected = metaMap.get(streamId);
		t.is(obj.metadataForStreamId(streamId), expected);
		t.is(obj.metadataForObjectSource(i, `source/${i}`), expected);
		t.is(
			obj.metadataForObjectSource(
				i,
				`source/${i}`,
				DatumStreamTypes.Node
			),
			expected
		);
		t.is(
			obj.metadataForObjectSource(
				i,
				`source/${i}`,
				DatumStreamTypes.Location
			),
			undefined,
			"search for wrong type returns undefined"
		);
		t.is(obj.metadataAt(i - 1), expected);
		t.is(obj.indexOfMetadataStreamId(streamId), i - 1);
	}

	t.is(
		obj.indexOfMetadataStreamId("foo"),
		-1,
		"-1 returned when stream ID not found"
	);

	t.is(obj.metadataAt(-99), undefined, "underbound index returns undefined");
	t.is(obj.metadataAt(99), undefined, "overbound index returns undefined");
});

test("addMetadata", (t) => {
	// GIVEN
	const metas = [] as DatumStreamMetadata[];
	const metaMap = new Map<string, DatumStreamMetadata>();
	for (let i = 1; i <= 3; i += 1) {
		const streamId = `${i}-a-b-c`;
		const meta = testNodeMetadata(streamId, i, `source/${i}`);
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
		const streamId = `${i}-a-b-c`;
		const expected = metaMap.get(streamId);
		t.is(obj.metadataForStreamId(streamId), expected);
		t.is(obj.metadataForObjectSource(i, `source/${i}`), expected);
	}
	t.is(obj.metadataForStreamId(addedMeta.streamId), addedMeta);
});

test("fromJsonEncoding:undefined", (t) => {
	t.is(
		DatumStreamMetadataRegistry.fromJsonEncoding(undefined as any),
		undefined,
		"undefined returned for undefined input"
	);
});

test("fromJsonEncoding:emptyArray", (t) => {
	// WHEN
	const reg = DatumStreamMetadataRegistry.fromJsonEncoding("[]")!;

	// THEN
	t.truthy(reg);
	t.deepEqual(reg.metadataStreamIds(), new Set());
	t.deepEqual(reg.metadataStreamIdsList(), []);
});

test("fromJsonEncoding:notArray", (t) => {
	t.is(
		DatumStreamMetadataRegistry.fromJsonEncoding("{}"),
		undefined,
		"undefined returned for non-array input"
	);
});

test("fromJsonEncoding", (t) => {
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
	)!;

	// THEN
	t.truthy(reg);
	t.deepEqual(reg.metadataStreamIdsList(), [streamId]);
	const meta = reg.metadataForStreamId(streamId)!;
	t.is(meta.streamId, streamId);
	t.is(meta.timeZoneId, "Pacific/Auckland");
	t.is(meta.kind, DatumStreamTypes.Node);
	t.is(meta.objectId, nodeId);
	t.is(meta.sourceId, sourceId);
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

test("toJsonEncoding", (t) => {
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

test("toJsonEncoding:multi", (t) => {
	// GIVEN
	const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
	const nodeId = 123;
	const sourceId = "test/source";
	const meta = testNodeMetadata(streamId, nodeId, sourceId);

	const streamId2 = "foo";
	const nodeId2 = 123;
	const sourceId2 = "test/source2";
	const meta2 = testNodeMetadata(streamId2, nodeId2, sourceId2);

	const reg = new DatumStreamMetadataRegistry([meta, meta2]);

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
			'","i":["a","b","c"],"a":["d","e"],"s":["f"]},{"streamId":"' +
			streamId2 +
			'","zone":"Pacific/Auckland","kind":"n","objectId":' +
			nodeId2 +
			',"sourceId":"' +
			sourceId2 +
			'","i":["a","b","c"],"a":["d","e"],"s":["f"]}]'
	);
});
