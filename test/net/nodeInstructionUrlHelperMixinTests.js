import test from 'ava';

import InstructionStates from 'domain/instructionState';
import { NodeInstructionUrlHelper, instructionParameter } from 'net/nodeInstructionUrlHelperMixin'

test('user:nodeInstructionUrlHelperMixin:create', t => {
	const helper = new NodeInstructionUrlHelper();
	t.truthy(helper);
});

test('user:nodeInstructionUrlHelperMixin:viewInstructionUrl', t => {
	const helper = new NodeInstructionUrlHelper();
	t.is(helper.viewInstructionUrl(123),
		'https://data.solarnetwork.net/solaruser/api/v1/sec/instr/view?id=123');
});

test('user:nodeInstructionUrlHelperMixin:updateInstructionStateUrl', t => {
	const helper = new NodeInstructionUrlHelper();
	t.is(helper.updateInstructionStateUrl(123, InstructionStates.Queued),
		'https://data.solarnetwork.net/solaruser/api/v1/sec/instr/updateState?id=123&state=Queued');
});

test('user:nodeInstructionUrlHelperMixin:viewActiveInstructionsUrl', t => {
	const helper = new NodeInstructionUrlHelper();
	helper.nodeId = 123;
	t.is(helper.viewActiveInstructionsUrl(),
		'https://data.solarnetwork.net/solaruser/api/v1/sec/instr/viewActive?nodeId=123');
	t.is(helper.viewActiveInstructionsUrl(234),
		'https://data.solarnetwork.net/solaruser/api/v1/sec/instr/viewActive?nodeId=234');
});

test('user:nodeInstructionUrlHelperMixin:viewPendingInstructionsUrl', t => {
	const helper = new NodeInstructionUrlHelper();
	helper.nodeId = 123;
	t.is(helper.viewPendingInstructionsUrl(),
		'https://data.solarnetwork.net/solaruser/api/v1/sec/instr/viewPending?nodeId=123');
	t.is(helper.viewPendingInstructionsUrl(234),
		'https://data.solarnetwork.net/solaruser/api/v1/sec/instr/viewPending?nodeId=234');
});

test('user:nodeInstructionUrlHelperMixin:instructionParameter', t => {
	// static class access
	let param = NodeInstructionUrlHelper.instructionParameter('foo', 'bar');
	t.deepEqual(param, {name:'foo', value:'bar'});

	// direct import access
	param = instructionParameter('bim', 'bam');
	t.deepEqual(param, {name:'bim', value:'bam'});
});

test('user:nodeInstructionUrlHelperMixin:queueInstructionUrl', t => {
	const helper = new NodeInstructionUrlHelper();
	helper.nodeId = 123;
	t.is(helper.queueInstructionUrl('foo'),
		'https://data.solarnetwork.net/solaruser/api/v1/sec/instr/add?nodeId=123&topic=foo');
});

test('user:nodeInstructionUrlHelperMixin:queueInstructionUrl:nodeId', t => {
	const helper = new NodeInstructionUrlHelper();
	helper.nodeId = 123;
	t.is(helper.queueInstructionUrl('foo', null, 234),
		'https://data.solarnetwork.net/solaruser/api/v1/sec/instr/add?nodeId=234&topic=foo');
});

test('user:nodeInstructionUrlHelperMixin:queueInstructionUrl:parameter', t => {
	const helper = new NodeInstructionUrlHelper();
	helper.nodeId = 123;
	t.is(helper.queueInstructionUrl('foo', [
			{name:'bim', value:'bam'},
		]),
		'https://data.solarnetwork.net/solaruser/api/v1/sec/instr/add?'
			+'nodeId=123&topic=foo'
			+'&parameters%5B0%5D.name=bim'
			+'&parameters%5B0%5D.value=bam');
});

test('user:nodeInstructionUrlHelperMixin:queueInstructionUrl:parameters', t => {
	const helper = new NodeInstructionUrlHelper();
	helper.nodeId = 123;
	t.is(helper.queueInstructionUrl('foo', [
			{name:'bim', value:'bam'},
			{name:'ding', value:'dong'},
		]),
		'https://data.solarnetwork.net/solaruser/api/v1/sec/instr/add?'
			+'nodeId=123&topic=foo'
			+'&parameters%5B0%5D.name=bim'
			+'&parameters%5B0%5D.value=bam'
			+'&parameters%5B1%5D.name=ding'
			+'&parameters%5B1%5D.value=dong');
});

test('user:nodeInstructionUrlHelperMixin:queueInstructionUrl:parameter:nodeId', t => {
	const helper = new NodeInstructionUrlHelper();
	helper.nodeId = 123;
	t.is(helper.queueInstructionUrl('foo', [
			{name:'bim', value:'bam'},
		], 234),
		'https://data.solarnetwork.net/solaruser/api/v1/sec/instr/add?'
			+'nodeId=234&topic=foo'
			+'&parameters%5B0%5D.name=bim'
			+'&parameters%5B0%5D.value=bam');
});

