"use strict";

import test from "ava";

import {
	displayScaleForValue,
	displayUnitsForScale,
} from "../../main/util/numbers.js";

const kThresholdKilo = 1000;
const kThresholdMega = 1000000;
const kThresholdGiga = 1000000000;

test("displayScaleForValue:1", (t) => {
	for (let i = 0; i < kThresholdKilo; i += 100) {
		t.is(displayScaleForValue(i), 1);
		t.is(displayScaleForValue(-i), 1);
	}
});

test("displayScaleForValue:kilo", (t) => {
	for (let i = kThresholdKilo; i < kThresholdMega; i += 1000) {
		t.is(displayScaleForValue(i), 1000);
		t.is(displayScaleForValue(-i), 1000);
	}
});

test("displayScaleForValue:mega", (t) => {
	for (let i = kThresholdMega; i < kThresholdGiga; i += 1000000) {
		t.is(displayScaleForValue(i), 1000000);
		t.is(displayScaleForValue(-i), 1000000);
	}
});

test("displayScaleForValue:giga", (t) => {
	for (let i = kThresholdGiga; i < kThresholdGiga * 2; i += 1000000000) {
		t.is(displayScaleForValue(i), 1000000000);
		t.is(displayScaleForValue(-i), 1000000000);
	}

	// also test Very Large Number
	t.is(displayScaleForValue(Number.MAX_SAFE_INTEGER), 1000000000);
});

test("displayScaleForValue:max", (t) => {
	t.is(displayScaleForValue(Number.MAX_SAFE_INTEGER), 1000000000);
	t.is(displayScaleForValue(Number.MIN_SAFE_INTEGER), 1000000000);
});

test("displayUnitsForScale:identity", (t) => {
	t.is(displayUnitsForScale("W", 1), "W");
});

test("displayUnitsForScale:kilo", (t) => {
	t.is(displayUnitsForScale("W", 1000), "kW");
});

test("displayUnitsForScale:mega", (t) => {
	t.is(displayUnitsForScale("W", 1000000), "MW");
});

test("displayUnitsForScale:giga", (t) => {
	t.is(displayUnitsForScale("W", 1000000000), "GW");
});

test("displayUnitsForScale:unknown", (t) => {
	t.is(displayUnitsForScale("W", 123), "W");
});
