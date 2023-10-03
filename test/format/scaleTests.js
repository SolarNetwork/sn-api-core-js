"use strict";

import test from "ava";

import { displayScaleForValue, displayUnitsForScale } from "../../src/format/scale.js";

const kThresholdKilo = 1000;
const kThresholdMega = 1000000;
const kThresholdGiga = 1000000000;

test("core:format:displayScaleForValue:1", (t) => {
	for (let i = 0; i < kThresholdKilo; i += 100) {
		t.is(displayScaleForValue(i), 1);
		t.is(displayScaleForValue(-i), 1);
	}
});

test("core:format:displayScaleForValue:kilo", (t) => {
	for (let i = kThresholdKilo; i < kThresholdMega; i += 1000) {
		t.is(displayScaleForValue(i), 1000);
		t.is(displayScaleForValue(-i), 1000);
	}
});

test("core:format:displayScaleForValue:mega", (t) => {
	for (let i = kThresholdMega; i < kThresholdGiga; i += 1000000) {
		t.is(displayScaleForValue(i), 1000000);
		t.is(displayScaleForValue(-i), 1000000);
	}
});

test("core:format:displayScaleForValue:giga", (t) => {
	for (let i = kThresholdGiga; i < kThresholdGiga * 2; i += 1000000000) {
		t.is(displayScaleForValue(i), 1000000000);
		t.is(displayScaleForValue(-i), 1000000000);
	}

	// also test Very Large Number
	t.is(displayScaleForValue(Number.MAX_SAFE_INTEGER), 1000000000);
});

test("core:format:displayScaleForValue:max", (t) => {
	t.is(displayScaleForValue(Number.MAX_SAFE_INTEGER), 1000000000);
	t.is(displayScaleForValue(Number.MIN_SAFE_INTEGER), 1000000000);
});

test("core:format:displayUnitsForScale:identity", (t) => {
	t.is(displayUnitsForScale("W", 1), "W");
});

test("core:format:displayUnitsForScale:kilo", (t) => {
	t.is(displayUnitsForScale("W", 1000), "kW");
});

test("core:format:displayUnitsForScale:mega", (t) => {
	t.is(displayUnitsForScale("W", 1000000), "MW");
});

test("core:format:displayUnitsForScale:giga", (t) => {
	t.is(displayUnitsForScale("W", 1000000000), "GW");
});

test("core:format:displayUnitsForScale:unknown", (t) => {
	t.is(displayUnitsForScale("W", 123), "W");
});
