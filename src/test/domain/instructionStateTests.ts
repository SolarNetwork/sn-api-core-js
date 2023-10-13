import test from "ava";

import {
	default as InstructionStates,
	InstructionState,
	InstructionStateNames,
} from "../../main/domain/instructionState.js";

test("create", (t) => {
	const obj = new InstructionState("foo");
	t.truthy(obj);
	t.is(obj.name, "foo");
});

test("enumValues", (t) => {
	const values: readonly InstructionState[] = InstructionState.enumValues();
	t.deepEqual(values, [
		InstructionStates.Unknown,
		InstructionStates.Queued,
		InstructionStates.Queuing,
		InstructionStates.Received,
		InstructionStates.Executing,
		InstructionStates.Declined,
		InstructionStates.Completed,
	]);
});

test("enumsValue", (t) => {
	t.is(InstructionStates.Unknown.name, InstructionStateNames.Unknown);
	t.is(InstructionStates.Queued.name, InstructionStateNames.Queued);
	t.is(InstructionStates.Queuing.name, InstructionStateNames.Queuing);
	t.is(InstructionStates.Received.name, InstructionStateNames.Received);
	t.is(InstructionStates.Executing.name, InstructionStateNames.Executing);
	t.is(InstructionStates.Declined.name, InstructionStateNames.Declined);
	t.is(InstructionStates.Completed.name, InstructionStateNames.Completed);
});
