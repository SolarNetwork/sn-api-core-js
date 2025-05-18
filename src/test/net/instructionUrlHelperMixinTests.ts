import test from "ava";

import { DatumFilterKeys } from "../../main/domain/datumFilter.js";
import InstructionStates from "../../main/domain/instructionState.js";
import { default as InstructionUrlHelperMixin } from "../../main/net/instructionUrlHelperMixin.js";
import UrlHelper from "../../main/net/urlHelper.js";

class NodeInstructionUrlHelper extends InstructionUrlHelperMixin(UrlHelper) {}

test("create", (t) => {
	const helper = new NodeInstructionUrlHelper();
	t.truthy(helper);
});

test("viewInstructionUrl", (t) => {
	const helper = new NodeInstructionUrlHelper();
	t.is(
		helper.viewInstructionUrl(123),
		"https://data.solarnetwork.net/instr/view?id=123"
	);
});

test("updateInstructionStateUrl", (t) => {
	const helper = new NodeInstructionUrlHelper();
	t.is(
		helper.updateInstructionStateUrl(123, InstructionStates.Queued),
		"https://data.solarnetwork.net/instr/updateState?id=123&state=Queued"
	);
});

test("viewActiveInstructionsUrl", (t) => {
	const helper = new NodeInstructionUrlHelper();
	helper.parameter(DatumFilterKeys.NodeId, 123);
	t.is(
		helper.viewActiveInstructionsUrl(),
		"https://data.solarnetwork.net/instr/viewActive?nodeId=123"
	);
	t.is(
		helper.viewActiveInstructionsUrl(234),
		"https://data.solarnetwork.net/instr/viewActive?nodeId=234"
	);
});

test("viewPendingInstructionsUrl", (t) => {
	const helper = new NodeInstructionUrlHelper();
	helper.parameter(DatumFilterKeys.NodeId, 123);
	t.is(
		helper.viewPendingInstructionsUrl(),
		"https://data.solarnetwork.net/instr/viewPending?nodeId=123"
	);
	t.is(
		helper.viewPendingInstructionsUrl(234),
		"https://data.solarnetwork.net/instr/viewPending?nodeId=234"
	);
});

test("instructionParameter", (t) => {
	const param = NodeInstructionUrlHelper.instructionParameter("foo", "bar");
	t.deepEqual(param, { name: "foo", value: "bar" });
});

test("queueInstructionUrl", (t) => {
	const helper = new NodeInstructionUrlHelper();
	helper.parameter(DatumFilterKeys.NodeId, 123);
	t.is(
		helper.queueInstructionUrl("foo"),
		"https://data.solarnetwork.net/instr/add/foo?nodeId=123"
	);
});

test("queueInstructionUrl:nodeId", (t) => {
	const helper = new NodeInstructionUrlHelper();
	helper.parameter(DatumFilterKeys.NodeId, 123);
	t.is(
		helper.queueInstructionUrl("foo", undefined, 234),
		"https://data.solarnetwork.net/instr/add/foo?nodeId=234"
	);
});

test("queueInstructionUrl:nodeId:topicRequestParam", (t) => {
	const helper = new NodeInstructionUrlHelper();
	helper.parameter(DatumFilterKeys.NodeId, 123);
	t.is(
		helper.queueInstructionUrl("foo", undefined, 234, true),
		"https://data.solarnetwork.net/instr/add?topic=foo&nodeId=234"
	);
});

test("queueInstructionUrl:parameter", (t) => {
	const helper = new NodeInstructionUrlHelper();
	helper.parameter(DatumFilterKeys.NodeId, 123);
	t.is(
		helper.queueInstructionUrl("foo", [{ name: "bim", value: "bam" }]),
		"https://data.solarnetwork.net/instr/add/foo?" +
			"nodeId=123" +
			"&parameters%5B0%5D.name=bim" +
			"&parameters%5B0%5D.value=bam"
	);
});

test("queueInstructionUrl:parameters", (t) => {
	const helper = new NodeInstructionUrlHelper();
	helper.parameter(DatumFilterKeys.NodeId, 123);
	t.is(
		helper.queueInstructionUrl("foo", [
			{ name: "bim", value: "bam" },
			{ name: "ding", value: "dong" },
		]),
		"https://data.solarnetwork.net/instr/add/foo?" +
			"nodeId=123" +
			"&parameters%5B0%5D.name=bim" +
			"&parameters%5B0%5D.value=bam" +
			"&parameters%5B1%5D.name=ding" +
			"&parameters%5B1%5D.value=dong"
	);
});

test("queueInstructionUrl:parameter:nodeId", (t) => {
	const helper = new NodeInstructionUrlHelper();
	helper.parameter(DatumFilterKeys.NodeId, 123);
	t.is(
		helper.queueInstructionUrl("foo", [{ name: "bim", value: "bam" }], 234),
		"https://data.solarnetwork.net/instr/add/foo?" +
			"nodeId=234" +
			"&parameters%5B0%5D.name=bim" +
			"&parameters%5B0%5D.value=bam"
	);
});

test("queueInstructionUrl:parameter:nodeId:topicRequestParam", (t) => {
	const helper = new NodeInstructionUrlHelper();
	helper.parameter(DatumFilterKeys.NodeId, 123);
	t.is(
		helper.queueInstructionUrl(
			"foo",
			[{ name: "bim", value: "bam" }],
			234,
			true
		),
		"https://data.solarnetwork.net/instr/add?topic=foo" +
			"&nodeId=234" +
			"&parameters%5B0%5D.name=bim" +
			"&parameters%5B0%5D.value=bam"
	);
});

test("queueInstructionsUrl", (t) => {
	const helper = new NodeInstructionUrlHelper();
	helper.parameter(DatumFilterKeys.NodeIds, [123, 234]);
	t.is(
		helper.queueInstructionsUrl("foo"),
		"https://data.solarnetwork.net/instr/add/foo?nodeIds=123,234"
	);
});

test("queueInstructionsUrl:nodeIds", (t) => {
	const helper = new NodeInstructionUrlHelper();
	helper.parameter(DatumFilterKeys.NodeIds, [123, 234]);
	t.is(
		helper.queueInstructionsUrl("foo", undefined, [345, 456]),
		"https://data.solarnetwork.net/instr/add/foo?nodeIds=345,456"
	);
});

test("queueInstructionsUrl:nodeIds:topicRequestParam", (t) => {
	const helper = new NodeInstructionUrlHelper();
	helper.parameter(DatumFilterKeys.NodeIds, [123, 234]);
	t.is(
		helper.queueInstructionsUrl("foo", undefined, [345, 456], true),
		"https://data.solarnetwork.net/instr/add?topic=foo&nodeIds=345,456"
	);
});

test("queueInstructionsUrl:noNodeIds", (t) => {
	const helper = new NodeInstructionUrlHelper();
	t.is(
		helper.queueInstructionsUrl("foo"),
		"https://data.solarnetwork.net/instr/add/foo"
	);
});

test("queueInstructionsUrl:nodeIds:empty", (t) => {
	const helper = new NodeInstructionUrlHelper();
	helper.parameter(DatumFilterKeys.NodeIds, [123, 234]);
	t.is(
		helper.queueInstructionsUrl("foo", undefined, []),
		"https://data.solarnetwork.net/instr/add/foo"
	);
});

test("queueInstructionsUrl:parameter", (t) => {
	const helper = new NodeInstructionUrlHelper();
	helper.parameter(DatumFilterKeys.NodeIds, [123, 234]);
	t.is(
		helper.queueInstructionsUrl("foo", [{ name: "bim", value: "bam" }]),
		"https://data.solarnetwork.net/instr/add/foo?" +
			"nodeIds=123,234" +
			"&parameters%5B0%5D.name=bim" +
			"&parameters%5B0%5D.value=bam"
	);
});

test("queueInstructionsUrl:parameter:topicRequestParam", (t) => {
	const helper = new NodeInstructionUrlHelper();
	helper.parameter(DatumFilterKeys.NodeIds, [123, 234]);
	t.is(
		helper.queueInstructionsUrl(
			"foo",
			[{ name: "bim", value: "bam" }],
			undefined,
			true
		),
		"https://data.solarnetwork.net/instr/add?topic=foo" +
			"&nodeIds=123,234" +
			"&parameters%5B0%5D.name=bim" +
			"&parameters%5B0%5D.value=bam"
	);
});

test("queueInstructionsUrl:parameters", (t) => {
	const helper = new NodeInstructionUrlHelper();
	helper.parameter(DatumFilterKeys.NodeIds, [123, 234]);
	t.is(
		helper.queueInstructionsUrl("foo", [
			{ name: "bim", value: "bam" },
			{ name: "ding", value: "dong" },
		]),
		"https://data.solarnetwork.net/instr/add/foo?" +
			"nodeIds=123,234" +
			"&parameters%5B0%5D.name=bim" +
			"&parameters%5B0%5D.value=bam" +
			"&parameters%5B1%5D.name=ding" +
			"&parameters%5B1%5D.value=dong"
	);
});

test("queueInstructionsUrl:parameter:nodeId", (t) => {
	const helper = new NodeInstructionUrlHelper();
	helper.parameter(DatumFilterKeys.NodeIds, [123, 234]);
	t.is(
		helper.queueInstructionsUrl(
			"foo",
			[{ name: "bim", value: "bam" }],
			[345, 456]
		),
		"https://data.solarnetwork.net/instr/add/foo?" +
			"nodeIds=345,456" +
			"&parameters%5B0%5D.name=bim" +
			"&parameters%5B0%5D.value=bam"
	);
});

test("queueInstructionsUrl:parameter:noNodeIds", (t) => {
	const helper = new NodeInstructionUrlHelper();
	t.is(
		helper.queueInstructionsUrl("foo", [{ name: "bim", value: "bam" }]),
		"https://data.solarnetwork.net/instr/add/foo" +
			"?parameters%5B0%5D.name=bim" +
			"&parameters%5B0%5D.value=bam"
	);
});

test("queueInstructionRequest:simple", (t) => {
	const helper = new NodeInstructionUrlHelper();
	const result = helper.queueInstructionRequest(
		"foo",
		[{ name: "bim", value: "bam" }],
		123
	);
	t.deepEqual(result, {
		nodeId: 123,
		topic: "foo",
		params: {
			bim: "bam",
		},
	});
});

test("queueInstructionRequest:simple:noTopic", (t) => {
	const helper = new NodeInstructionUrlHelper();
	const result = helper.queueInstructionRequest(
		undefined,
		[{ name: "bim", value: "bam" }],
		123
	);
	t.deepEqual(result, {
		nodeId: 123,
		params: {
			bim: "bam",
		},
	});
});

test("queueInstructionRequest:simple:empty", (t) => {
	const helper = new NodeInstructionUrlHelper();
	helper.parameter(DatumFilterKeys.NodeId, 123);
	const result = helper.queueInstructionRequest();
	t.deepEqual(result, {
		nodeId: 123,
	});
});

test("queueInstructionRequest:simple:missingName", (t) => {
	const helper = new NodeInstructionUrlHelper();
	const result = helper.queueInstructionRequest(
		"foo",
		[{ name: "", value: "bam" }],
		123
	);
	t.deepEqual(result, {
		nodeId: 123,
		topic: "foo",
	});
});

test("queueInstructionRequest:simple:missingName:multiple", (t) => {
	const helper = new NodeInstructionUrlHelper();
	const result = helper.queueInstructionRequest(
		"foo",
		[
			{ name: "", value: "bam" },
			{ name: "", value: "blarf" },
			{ name: "bim", value: "blamo" },
		],
		123
	);
	t.deepEqual(result, {
		nodeId: 123,
		topic: "foo",
		params: {
			bim: "blamo",
		},
	});
});

test("queueInstructionRequest:standard", (t) => {
	const helper = new NodeInstructionUrlHelper();
	const parameters = [
		{ name: "key", value: "placeholder" },
		{ name: "type", value: "me" },
		{ name: "value", value: "RockinIt" },
		{ name: "key", value: "placeholder" },
		{ name: "type", value: "you" },
		{ name: "value", value: "AwesomeSauce" },
	];
	const result = helper.queueInstructionRequest("foo", parameters, 123);
	t.deepEqual(result, {
		nodeId: 123,
		topic: "foo",
		parameters: parameters,
	});
});

test("queueInstructionRequest:executionDate:noParameters", (t) => {
	const helper = new NodeInstructionUrlHelper();
	const date = new Date();
	const result = helper.queueInstructionRequest(
		"foo",
		[{ name: "bim", value: "bam" }],
		123,
		date
	);
	t.deepEqual(result, {
		nodeId: 123,
		topic: "foo",
		params: {
			bim: "bam",
			executionDate: date.toISOString(),
		},
	});
});

test("queueInstructionRequest:executionDate:addParameter", (t) => {
	const helper = new NodeInstructionUrlHelper();
	const date = new Date();
	const result = helper.queueInstructionRequest("foo", undefined, 123, date);
	t.deepEqual(
		result,
		{
			nodeId: 123,
			topic: "foo",
			params: {
				executionDate: date.toISOString(),
			},
		},
		"execution date parameter added"
	);
});

test("queueInstructionRequest:executionDate:replaceParameter", (t) => {
	const helper = new NodeInstructionUrlHelper();
	const date = new Date();
	const result = helper.queueInstructionRequest(
		"foo",
		[{ name: "executionDate", value: "blah" }],
		123,
		date
	);
	t.deepEqual(
		result,
		{
			nodeId: 123,
			topic: "foo",
			params: {
				executionDate: date.toISOString(),
			},
		},
		"execution date argument replaces execution date parameter"
	);
});

test("queueInstructionRequest:executionDate:addParameter:standard", (t) => {
	// GIVEN
	const helper = new NodeInstructionUrlHelper();
	const parameters = [
		{ name: "key", value: "placeholder" },
		{ name: "type", value: "me" },
		{ name: "value", value: "RockinIt" },
		{ name: "key", value: "placeholder" },
		{ name: "type", value: "you" },
		{ name: "value", value: "AwesomeSauce" },
	];
	const date = new Date();

	// WHEN
	const result = helper.queueInstructionRequest("foo", parameters, 123, date);

	// THEN
	const parametersWithDate = [...parameters];
	parametersWithDate.push({
		name: "executionDate",
		value: date.toISOString(),
	});
	t.deepEqual(
		result,
		{
			nodeId: 123,
			topic: "foo",
			parameters: parametersWithDate,
		},
		"execution date added to parameters list"
	);
});

test("canUseSimpleRequest:noParameters", (t) => {
	t.true(
		NodeInstructionUrlHelper.canUseSimpleRequest(),
		"undefined parameters are simple"
	);
});

test("canUseSimpleRequest:singleParameter", (t) => {
	const parameters = [{ name: "key", value: "placeholder" }];

	t.true(
		NodeInstructionUrlHelper.canUseSimpleRequest(parameters),
		"single parameter is simple"
	);
});

test("canUseSimpleRequest:noDuplicateNames", (t) => {
	const parameters = [
		{ name: "a", value: "placeholder" },
		{ name: "b", value: "placeholder" },
		{ name: "c", value: "placeholder" },
	];

	t.true(
		NodeInstructionUrlHelper.canUseSimpleRequest(parameters),
		"no duplicate names is simple"
	);
});

test("canUseSimpleRequest:duplicateNames", (t) => {
	const parameters = [
		{ name: "key", value: "placeholder1" },
		{ name: "key", value: "placeholder2" },
	];

	t.false(
		NodeInstructionUrlHelper.canUseSimpleRequest(parameters),
		"duplicate names is not simple"
	);
});

test("execInstructionUrl", (t) => {
	const helper = new NodeInstructionUrlHelper();
	helper.parameter(DatumFilterKeys.NodeId, 123);
	t.is(
		helper.execInstructionUrl("foo"),
		"https://data.solarnetwork.net/instr/exec/foo?nodeId=123"
	);
});

test("execInstructionUrl:nodeId", (t) => {
	const helper = new NodeInstructionUrlHelper();
	helper.parameter(DatumFilterKeys.NodeId, 123);
	t.is(
		helper.execInstructionUrl("foo", undefined, 234),
		"https://data.solarnetwork.net/instr/exec/foo?nodeId=234"
	);
});

test("execInstructionUrl:parameter", (t) => {
	const helper = new NodeInstructionUrlHelper();
	helper.parameter(DatumFilterKeys.NodeId, 123);
	t.is(
		helper.execInstructionUrl("foo", [{ name: "bim", value: "bam" }]),
		"https://data.solarnetwork.net/instr/exec/foo?" +
			"nodeId=123" +
			"&parameters%5B0%5D.name=bim" +
			"&parameters%5B0%5D.value=bam"
	);
});

test("execInstructionUrl:parameters", (t) => {
	const helper = new NodeInstructionUrlHelper();
	helper.parameter(DatumFilterKeys.NodeId, 123);
	t.is(
		helper.execInstructionUrl("foo", [
			{ name: "bim", value: "bam" },
			{ name: "ding", value: "dong" },
		]),
		"https://data.solarnetwork.net/instr/exec/foo?" +
			"nodeId=123" +
			"&parameters%5B0%5D.name=bim" +
			"&parameters%5B0%5D.value=bam" +
			"&parameters%5B1%5D.name=ding" +
			"&parameters%5B1%5D.value=dong"
	);
});

test("execInstructionUrl:parameter:nodeId", (t) => {
	const helper = new NodeInstructionUrlHelper();
	helper.parameter(DatumFilterKeys.NodeId, 123);
	t.is(
		helper.execInstructionUrl("foo", [{ name: "bim", value: "bam" }], 234),
		"https://data.solarnetwork.net/instr/exec/foo?" +
			"nodeId=234" +
			"&parameters%5B0%5D.name=bim" +
			"&parameters%5B0%5D.value=bam"
	);
});

test("execInstructionUrl:nodeIds:param", (t) => {
	const helper = new NodeInstructionUrlHelper();
	helper.parameter(DatumFilterKeys.NodeIds, [123, 234]);
	t.is(
		helper.execInstructionUrl("foo"),
		"https://data.solarnetwork.net/instr/exec/foo?nodeIds=123,234"
	);
});

test("execInstructionUrl:nodeIds", (t) => {
	const helper = new NodeInstructionUrlHelper();
	helper.parameter(DatumFilterKeys.NodeIds, [123, 234]);
	t.is(
		helper.execInstructionUrl("foo", undefined, [345, 456]),
		"https://data.solarnetwork.net/instr/exec/foo?nodeIds=345,456"
	);
});

test("execInstructionUrl:noNodeIds", (t) => {
	const helper = new NodeInstructionUrlHelper();
	t.is(
		helper.execInstructionUrl("foo"),
		"https://data.solarnetwork.net/instr/exec/foo"
	);
});

test("execInstructionUrl:nodeIds:empty", (t) => {
	const helper = new NodeInstructionUrlHelper();
	helper.parameter(DatumFilterKeys.NodeIds, [123, 234]);
	t.is(
		helper.execInstructionUrl("foo", undefined, []),
		"https://data.solarnetwork.net/instr/exec/foo"
	);
});

test("execInstructionUrl:parameter:nodeIds", (t) => {
	const helper = new NodeInstructionUrlHelper();
	helper.parameter(DatumFilterKeys.NodeIds, [123, 234]);
	t.is(
		helper.execInstructionUrl("foo", [{ name: "bim", value: "bam" }]),
		"https://data.solarnetwork.net/instr/exec/foo?" +
			"nodeIds=123,234" +
			"&parameters%5B0%5D.name=bim" +
			"&parameters%5B0%5D.value=bam"
	);
});

test("execInstructionUrl:parameters:nodeIds:arg", (t) => {
	const helper = new NodeInstructionUrlHelper();
	helper.parameter(DatumFilterKeys.NodeIds, [123, 234]);
	t.is(
		helper.execInstructionUrl("foo", [
			{ name: "bim", value: "bam" },
			{ name: "ding", value: "dong" },
		]),
		"https://data.solarnetwork.net/instr/exec/foo?" +
			"nodeIds=123,234" +
			"&parameters%5B0%5D.name=bim" +
			"&parameters%5B0%5D.value=bam" +
			"&parameters%5B1%5D.name=ding" +
			"&parameters%5B1%5D.value=dong"
	);
});

test("execInstructionUrl:parameter:nodeIds:arg", (t) => {
	const helper = new NodeInstructionUrlHelper();
	helper.parameter(DatumFilterKeys.NodeIds, [123, 234]);
	t.is(
		helper.execInstructionUrl(
			"foo",
			[{ name: "bim", value: "bam" }],
			[345, 456]
		),
		"https://data.solarnetwork.net/instr/exec/foo?" +
			"nodeIds=345,456" +
			"&parameters%5B0%5D.name=bim" +
			"&parameters%5B0%5D.value=bam"
	);
});
