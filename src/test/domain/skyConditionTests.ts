import test from "ava";

import {
	default as SkyConditions,
	SkyCondition,
	SkyConditionNames,
} from "../../main/domain/skyCondition.js";

test("create", (t) => {
	const obj = new SkyCondition("foo", 2);
	t.truthy(obj);
	t.is(obj.name, "foo");
	t.is(obj.bitmaskBitNumber, 2);
	t.is(obj.bitmaskBitOffset, 1);
	t.is(obj.code, 2);
});

test("enumValues", (t) => {
	const values: readonly SkyCondition[] = SkyCondition.enumValues();
	t.deepEqual(values, [
		SkyConditions.Clear,
		SkyConditions.ScatteredClouds,
		SkyConditions.Cloudy,
		SkyConditions.Fog,
		SkyConditions.Drizzle,
		SkyConditions.ScatteredShowers,
		SkyConditions.Showers,
		SkyConditions.Rain,
		SkyConditions.Hail,
		SkyConditions.ScatteredSnow,
		SkyConditions.Snow,
		SkyConditions.Storm,
		SkyConditions.SevereStorm,
		SkyConditions.Thunder,
		SkyConditions.Windy,
		SkyConditions.Hazy,
		SkyConditions.Tornado,
		SkyConditions.Hurricane,
		SkyConditions.Dusty,
	]);
});

test("enumsValue", (t) => {
	t.is(SkyConditions.Clear.name, SkyConditionNames.Clear);
	t.is(SkyConditions.ScatteredClouds.name, SkyConditionNames.ScatteredClouds);
	t.is(SkyConditions.Cloudy.name, SkyConditionNames.Cloudy);
	t.is(SkyConditions.Fog.name, SkyConditionNames.Fog);
	t.is(SkyConditions.Drizzle.name, SkyConditionNames.Drizzle);
	t.is(SkyConditions.Showers.name, SkyConditionNames.Showers);
	t.is(SkyConditions.Rain.name, SkyConditionNames.Rain);
	t.is(SkyConditions.Hail.name, SkyConditionNames.Hail);
	t.is(SkyConditions.ScatteredSnow.name, SkyConditionNames.ScatteredSnow);
	t.is(SkyConditions.Snow.name, SkyConditionNames.Snow);
	t.is(SkyConditions.Storm.name, SkyConditionNames.Storm);
	t.is(SkyConditions.SevereStorm.name, SkyConditionNames.SevereStorm);
	t.is(SkyConditions.Thunder.name, SkyConditionNames.Thunder);
	t.is(SkyConditions.Windy.name, SkyConditionNames.Windy);
	t.is(SkyConditions.Hazy.name, SkyConditionNames.Hazy);
	t.is(SkyConditions.Tornado.name, SkyConditionNames.Tornado);
	t.is(SkyConditions.Hurricane.name, SkyConditionNames.Hurricane);
	t.is(SkyConditions.Dusty.name, SkyConditionNames.Dusty);
	t.is(
		SkyConditions.ScatteredShowers.name,
		SkyConditionNames.ScatteredShowers
	);
});

test("forCode", (t) => {
	const e = SkyCondition.forCode(2);
	t.is(e, SkyConditions.ScatteredClouds);
});

test("setForBitmask", (t) => {
	const set = SkyCondition.setForBitmask(16385, SkyCondition.enumValues());
	t.deepEqual(set, new Set([SkyConditions.Clear, SkyConditions.Windy]));
});

test("bitmaskForSet", (t) => {
	const vals = [
		SkyConditions.ScatteredShowers,
		SkyConditions.Hail,
		SkyConditions.Windy,
	];
	t.is(SkyCondition.bitmaskValue(vals), 16672, "32 + 256 + 16384");
});
