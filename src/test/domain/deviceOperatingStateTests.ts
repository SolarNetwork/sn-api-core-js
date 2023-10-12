import test from "ava";

import {
	default as DeviceOperatingStates,
	DeviceOperatingState,
	DeviceOperatingStateNames,
} from "../../main/domain/deviceOperatingState.js";

test("create", (t) => {
	const obj = new DeviceOperatingState("foo", 2);
	t.truthy(obj);
	t.is(obj.name, "foo");
	t.is(obj.bitmaskBitNumber, 2);
	t.is(obj.bitmaskBitOffset, 1);
	t.is(obj.code, 2);
});

test("enumsValue", (t) => {
	t.is(DeviceOperatingStates.Unknown.name, DeviceOperatingStateNames.Unknown);
	t.is(DeviceOperatingStates.Normal.name, DeviceOperatingStateNames.Normal);
	t.is(
		DeviceOperatingStates.Starting.name,
		DeviceOperatingStateNames.Starting
	);
	t.is(DeviceOperatingStates.Standby.name, DeviceOperatingStateNames.Standby);
	t.is(
		DeviceOperatingStates.Shutdown.name,
		DeviceOperatingStateNames.Shutdown
	);
	t.is(DeviceOperatingStates.Fault.name, DeviceOperatingStateNames.Fault);
	t.is(
		DeviceOperatingStates.Disabled.name,
		DeviceOperatingStateNames.Disabled
	);
	t.is(
		DeviceOperatingStates.Recovery.name,
		DeviceOperatingStateNames.Recovery
	);
	t.is(
		DeviceOperatingStates.Override.name,
		DeviceOperatingStateNames.Override
	);
});

test("forCode", (t) => {
	const e = DeviceOperatingState.forCode(2);
	t.is(e, DeviceOperatingStates.Starting);
});

test("setForBitmask", (t) => {
	const set = DeviceOperatingState.setForBitmask(
		65,
		DeviceOperatingState.enumValues()
	);
	t.deepEqual(
		set,
		new Set([DeviceOperatingStates.Normal, DeviceOperatingStates.Recovery])
	);
});

test("bitmaskEnum:bitmaskForSet", (t) => {
	const vals = [DeviceOperatingStates.Normal, DeviceOperatingStates.Recovery];
	t.is(DeviceOperatingState.bitmaskValue(vals), 65, "1 + 64");
});
