import test from "ava";

import Location from "domain/location";

test("domain:location:create", t => {
	const loc = new Location();
	t.truthy(loc);
	t.deepEqual(loc.properties(), {});
});

/*
const CountryKey = 'country';
const ElevationKey = 'elevation';
const LatitudeKey = 'latitude';
const IdKey = 'id';
const LocalityKey = 'locality';
const LongitudeKey = 'longitude';
const NameKey = 'name';
const PostalCodeKey = 'postalCode';
const RegionKey = 'region';
const StateOrProvinceKey = 'stateOrProvince';
const StreetKey = 'street';
const TimeZoneIdKey = 'timeZoneId';
*/

test("domain:location:create:object", t => {
	const data = {
		country: "NZ",
		elevation: 1,
		latitude: 2,
		id: 3,
		locality: "Wellington",
		longitude: 4,
		name: "Foo",
		postalCode: "6011",
		region: "Region",
		stateOrProvince: "State",
		street: "123 Main Street",
		timeZoneId: "Pacific/Auckland"
	};
	const loc = new Location(data);
	t.truthy(loc);
	t.is(loc.country, "NZ");
	t.is(loc.elevation, 1);
	t.is(loc.latitude, 2);
	t.is(loc.id, 3);
	t.is(loc.locality, "Wellington");
	t.is(loc.name, "Foo");
	t.is(loc.postalCode, "6011");
	t.is(loc.region, "Region");
	t.is(loc.stateOrProvince, "State");
	t.is(loc.street, "123 Main Street");
	t.is(loc.timeZoneId, "Pacific/Auckland");
	t.deepEqual(loc.properties(), data);
});

test("domain:location:create:location", t => {
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
