import test from "ava";

import {
	default as LocationPrecisions,
	LocationPrecision,
} from "../../src/domain/locationPrecision.js";

test("domain:locationPrecision:create", (t) => {
	const obj = new LocationPrecision("foo", 1);
	t.truthy(obj);
	t.is(obj.name, "foo");
	t.is(obj.precision, 1);
});

test("domain:locationPrecision:compare:lt", (t) => {
	const left = new LocationPrecision("foo", 1);
	const right = new LocationPrecision("bar", 2);
	t.is(left.compareTo(right), -1);
});

test("domain:locationPrecision:compare:gt", (t) => {
	const left = new LocationPrecision("foo", 2);
	const right = new LocationPrecision("bar", 1);
	t.is(left.compareTo(right), 1);
});

test("domain:locationPrecision:compare:eq", (t) => {
	const left = new LocationPrecision("foo", 1);
	const right = new LocationPrecision("bar", 1);
	t.is(left.compareTo(right), 0);
});

test("domain:locationPrecisions", (t) => {
	t.is(LocationPrecisions.Block.name, "Block");
	t.is(LocationPrecisions.Country.name, "Country");
	t.is(LocationPrecisions.LatLong.name, "LatLong");
	t.is(LocationPrecisions.Locality.name, "Locality");
	t.is(LocationPrecisions.PostalCode.name, "PostalCode");
	t.is(LocationPrecisions.Region.name, "Region");
	t.is(LocationPrecisions.StateOrProvince.name, "StateOrProvince");
	t.is(LocationPrecisions.Street.name, "Street");
	t.is(LocationPrecisions.TimeZone.name, "TimeZone");
});

test("domain:locationPrecision:minimumEnumSet", (t) => {
	const cache = new Map();
	let result = LocationPrecision.minimumEnumSet(LocationPrecisions.TimeZone, cache);
	t.deepEqual(result, new Set([LocationPrecisions.TimeZone, LocationPrecisions.Country]));

	result = LocationPrecision.minimumEnumSet(LocationPrecisions.Region);
	t.deepEqual(
		result,
		new Set([
			LocationPrecisions.Region,
			LocationPrecisions.TimeZone,
			LocationPrecisions.Country,
		]),
	);

	result = LocationPrecision.minimumEnumSet(
		new LocationPrecision("foo", Number.MAX_SAFE_INTEGER),
	);
	t.is(result, null);
});
