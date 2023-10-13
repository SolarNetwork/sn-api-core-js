import test from "ava";

import {
	default as Location,
	LocationKeys,
} from "../../main/domain/location.js";

test("create", (t) => {
	const loc = new Location();
	t.truthy(loc);
	t.deepEqual(loc.properties(), {});
});

test("create:object", (t) => {
	const data = {
		[LocationKeys.Country]: "NZ",
		[LocationKeys.Elevation]: 1,
		[LocationKeys.Latitude]: 2,
		[LocationKeys.ID]: 3,
		[LocationKeys.Locality]: "Wellington",
		[LocationKeys.Longitude]: 4,
		[LocationKeys.Name]: "Foo",
		[LocationKeys.PostalCode]: "6011",
		[LocationKeys.Region]: "Region",
		[LocationKeys.StateOrProvince]: "State",
		[LocationKeys.Street]: "123 Main Street",
		[LocationKeys.TimeZoneId]: "Pacific/Auckland",
	};
	const loc = new Location(data);
	t.truthy(loc);
	t.is(loc.country, "NZ");
	t.is(loc.elevation, 1);
	t.is(loc.latitude, 2);
	t.is(loc.id, 3);
	t.is(loc.locality, "Wellington");
	t.is(loc.longitude, 4);
	t.is(loc.name, "Foo");
	t.is(loc.postalCode, "6011");
	t.is(loc.region, "Region");
	t.is(loc.stateOrProvince, "State");
	t.is(loc.street, "123 Main Street");
	t.is(loc.timeZoneId, "Pacific/Auckland");
	t.deepEqual(loc.properties(), data);
});

test("id", (t) => {
	const loc = new Location();
	loc.id = 123;
	t.is(loc.id, 123);
	t.deepEqual(loc.props, new Map(Object.entries({ id: 123 })));

	loc.id = null;
	t.is(loc.id, undefined);

	loc[LocationKeys.ID] = 1;
	t.deepEqual(loc.id, 1);
});

test("toUriEncoding", (t) => {
	const loc = new Location();
	loc.id = 123;
	loc.country = "NZ";
	loc.region = "Wellington";
	loc.locality = "Wellington";
	loc.postalCode = "6011";
	loc.timeZoneId = "Pacific/Auckland";
	t.is(
		loc.toUriEncoding(),
		"id=123&country=NZ&region=Wellington&locality=Wellington&postalCode=6011&timeZoneId=Pacific%2FAuckland"
	);
});

test("toUriEncoding:other", (t) => {
	const loc = new Location();
	loc.elevation = 123;
	loc.latitude = 234;
	loc.longitude = 345;
	loc.name = "Foo";
	loc.stateOrProvince = "Wellington";
	loc.street = "123 Main Street";
	t.is(
		loc.toUriEncoding(),
		"elevation=123&latitude=234&longitude=345&name=Foo&stateOrProvince=Wellington&street=123%20Main%20Street"
	);
});
