import test from "ava";

import {
	default as LocationPrecisions,
	LocationPrecision,
	LocationPrecisionNames,
} from "../../main/domain/locationPrecision.js";

test("create", (t) => {
	const obj = new LocationPrecision("foo", 1);
	t.truthy(obj);
	t.is(obj.name, "foo");
	t.is(obj.precision, 1);
});

test("enumValues", (t) => {
	const values: readonly LocationPrecision[] = LocationPrecision.enumValues();
	t.deepEqual(values, [
		LocationPrecisions.LatLong,
		LocationPrecisions.Block,
		LocationPrecisions.Street,
		LocationPrecisions.PostalCode,
		LocationPrecisions.Locality,
		LocationPrecisions.StateOrProvince,
		LocationPrecisions.Region,
		LocationPrecisions.TimeZone,
		LocationPrecisions.Country,
	]);
});

test("enumsValue", (t) => {
	t.is(LocationPrecisions.Block.name, LocationPrecisionNames.Block);
	t.is(LocationPrecisions.Country.name, LocationPrecisionNames.Country);
	t.is(LocationPrecisions.LatLong.name, LocationPrecisionNames.LatLong);
	t.is(LocationPrecisions.Locality.name, LocationPrecisionNames.Locality);
	t.is(LocationPrecisions.PostalCode.name, LocationPrecisionNames.PostalCode);
	t.is(LocationPrecisions.Region.name, LocationPrecisionNames.Region);
	t.is(
		LocationPrecisions.StateOrProvince.name,
		LocationPrecisionNames.StateOrProvince
	);
	t.is(LocationPrecisions.Street.name, LocationPrecisionNames.Street);
	t.is(LocationPrecisions.TimeZone.name, LocationPrecisionNames.TimeZone);
});

test("compare:lt", (t) => {
	const left = new LocationPrecision("foo", 1);
	const right = new LocationPrecision("bar", 2);
	t.is(left.compareTo(right), -1);
});

test("compare:gt", (t) => {
	const left = new LocationPrecision("foo", 2);
	const right = new LocationPrecision("bar", 1);
	t.is(left.compareTo(right), 1);
});

test("compare:eq", (t) => {
	const left = new LocationPrecision("foo", 1);
	const right = new LocationPrecision("bar", 1);
	t.is(left.compareTo(right), 0);
});

test("minimumEnumSet", (t) => {
	const cache = new Map();
	let result = LocationPrecision.minimumEnumSet(
		LocationPrecisions.TimeZone,
		cache
	);
	t.deepEqual(
		result,
		new Set([LocationPrecisions.TimeZone, LocationPrecisions.Country])
	);

	result = LocationPrecision.minimumEnumSet(LocationPrecisions.Region);
	t.deepEqual(
		result,
		new Set([
			LocationPrecisions.Region,
			LocationPrecisions.TimeZone,
			LocationPrecisions.Country,
		])
	);

	result = LocationPrecision.minimumEnumSet(
		new LocationPrecision("foo", Number.MAX_SAFE_INTEGER)
	);
	t.is(result, undefined);
});
