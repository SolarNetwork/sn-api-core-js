import test from "ava";

import InstructionStates, {
	InstructionStateNames,
} from "../../main/domain/instructionState.js";
import {
	default as Instruction,
	InstructionInfo,
} from "../../main/domain/instruction.js";

test("create", (t) => {
	const info: InstructionInfo = {
		id: 1,
		created: "2024-01-01 12:34:56.789Z",
		nodeId: 2,
		topic: "Foo",
		instructionDate: "2024-01-02 12:34:56.789Z",
		state: "Completed",
		statusDate: "2024-01-03 12:34:56.789Z",
		parameters: [{ name: "a", value: "b" }],
		resultParameters: {
			foo: "bar",
		},
	};
	const obj = new Instruction(info);
	t.truthy(obj);
	t.is(obj.id, info.id);
	t.is(obj.created, info.created);
	t.is(obj.nodeId, info.nodeId);
	t.is(obj.topic, info.topic);
	t.is(obj.date.getTime(), new Date(info.instructionDate).getTime());
	t.is(obj.state, info.state);
	t.is(obj.instructionState, InstructionStates.Completed);
	t.is(obj.statusDate, info.statusDate);
	t.is(obj.updateDate.getTime(), new Date(info.statusDate).getTime());
	t.deepEqual(obj.parameters, info.parameters);
	t.deepEqual(obj.resultParameters, info.resultParameters);
});

test("create:parameter", (t) => {
	const name = "foo";
	const val = "bar";
	const obj = Instruction.parameter(name, val);
	t.is(obj.name, name);
	t.is(obj.value, val);
});

test("create:unknownState", (t) => {
	const info: InstructionInfo = {
		id: 1,
		created: "2024-01-01 12:34:56.789Z",
		nodeId: 2,
		topic: "Foo",
		instructionDate: "2024-01-02 12:34:56.789Z",
		state: "Not A State" as keyof typeof InstructionStateNames,
		statusDate: "2024-01-03 12:34:56.789Z",
	};
	const obj = new Instruction(info);
	t.truthy(obj);
	t.is(obj.instructionState, InstructionStates.Unknown);
});

test("create:noDates", (t) => {
	const now = new Date();
	const info: InstructionInfo = {
		id: 1,
		nodeId: 2,
		topic: "Foo",
		state: InstructionStates.Completed,
	} as any;
	const obj = new Instruction(info);
	t.truthy(obj);
	t.true(obj.date >= now, "Creation date defaulted to now");
	t.is(obj.updateDate, obj.date, "Update date defaulted to date");
});
