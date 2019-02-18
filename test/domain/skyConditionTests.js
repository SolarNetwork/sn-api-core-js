import test from "ava";

import { default as SkyConditions, SkyCondition } from "domain/skyCondition";

test("domain:skyCondition:create", t => {
	const obj = new SkyCondition("foo", 2);
	t.truthy(obj);
	t.is(obj.name, "foo");
	t.is(obj.bitmaskBitNumber, 2);
	t.is(obj.bitmaskBitOffset, 1);
	t.is(obj.code, 2);
});

test("domain:skyCondition:enumsValue", t => {
	t.is(SkyConditions.Clear.name, "Clear");
	t.is(SkyConditions.ScatteredClouds.name, "ScatteredClouds");
	t.is(SkyConditions.Cloudy.name, "Cloudy");
	t.is(SkyConditions.Fog.name, "Fog");
	t.is(SkyConditions.Drizzle.name, "Drizzle");
	t.is(SkyConditions.Showers.name, "Showers");
	t.is(SkyConditions.Rain.name, "Rain");
	t.is(SkyConditions.Hail.name, "Hail");
	t.is(SkyConditions.ScatteredSnow.name, "ScatteredSnow");
	t.is(SkyConditions.Snow.name, "Snow");
	t.is(SkyConditions.Storm.name, "Storm");
	t.is(SkyConditions.SevereStorm.name, "SevereStorm");
	t.is(SkyConditions.Thunder.name, "Thunder");
	t.is(SkyConditions.Windy.name, "Windy");
	t.is(SkyConditions.Hazy.name, "Hazy");
	t.is(SkyConditions.Tornado.name, "Tornado");
	t.is(SkyConditions.Hurricane.name, "Hurricane");
	t.is(SkyConditions.Dusty.name, "Dusty");
	t.is(SkyConditions.ScatteredShowers.name, "ScatteredShowers");
});

test("domain:deviceOperatingState:forCode", t => {
	const e = SkyCondition.forCode(2);
	t.is(e, SkyConditions.ScatteredClouds);
});

test("domain:skyCondition:setForBitmask", t => {
	const set = SkyCondition.setForBitmask(16385, SkyCondition.enumValues());
	t.deepEqual(set, new Set([SkyConditions.Clear, SkyConditions.Windy]));
});

test("bitmaskEnum:bitmaskForSet", t => {
	const vals = [SkyConditions.ScatteredShowers, SkyConditions.Hail, SkyConditions.Windy];
	t.is(SkyCondition.bitmaskValue(vals), 16672, "32 + 256 + 16384");
});
