import test from 'ava';

import {default as InstructionStates, InstructionState } from 'InstructionState';

test('user:instructionState:create', t => {
	const obj = new InstructionState('foo');
    t.truthy(obj);
    t.is(obj.name, 'foo');
});

test('user:instructionState:enumsValue', t => {
	t.is(InstructionStates.Unknown.name, 'Unknown');
	t.is(InstructionStates.Queued.name, 'Queued');
	t.is(InstructionStates.Received.name, 'Received');
	t.is(InstructionStates.Executing.name, 'Executing');
	t.is(InstructionStates.Declined.name, 'Declined');
	t.is(InstructionStates.Completed.name, 'Completed');
});
