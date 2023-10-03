import test from "ava";

import {
	default as DeviceOperatingStates,
	DeviceOperatingState,
} from "../../src/domain/deviceOperatingState.js";

test("domain:deviceOperatingState:create", (t) => {
	const obj = new DeviceOperatingState("foo", 2);
	t.truthy(obj);
	t.is(obj.name, "foo");
	t.is(obj.bitmaskBitNumber, 2);
	t.is(obj.bitmaskBitOffset, 1);
	t.is(obj.code, 2);
});

test("domain:deviceOperatingState:enumsValue", (t) => {
	t.is(DeviceOperatingStates.Unknown.name, "Unknown");
	t.is(DeviceOperatingStates.Normal.name, "Normal");
	t.is(DeviceOperatingStates.Starting.name, "Starting");
	t.is(DeviceOperatingStates.Standby.name, "Standby");
	t.is(DeviceOperatingStates.Shutdown.name, "Shutdown");
	t.is(DeviceOperatingStates.Fault.name, "Fault");
	t.is(DeviceOperatingStates.Disabled.name, "Disabled");
	t.is(DeviceOperatingStates.Recovery.name, "Recovery");
	t.is(DeviceOperatingStates.Override.name, "Override");
});

test("domain:deviceOperatingState:forCode", (t) => {
	const e = DeviceOperatingState.forCode(2);
	t.is(e, DeviceOperatingStates.Starting);
});

test("domain:deviceOperatingState:setForBitmask", (t) => {
	const set = DeviceOperatingState.setForBitmask(65, DeviceOperatingState.enumValues());
	t.deepEqual(set, new Set([DeviceOperatingStates.Normal, DeviceOperatingStates.Recovery]));
});

test("bitmaskEnum:bitmaskForSet", (t) => {
	const vals = [DeviceOperatingStates.Normal, DeviceOperatingStates.Recovery];
	t.is(DeviceOperatingState.bitmaskValue(vals), 65, "1 + 64");
});
