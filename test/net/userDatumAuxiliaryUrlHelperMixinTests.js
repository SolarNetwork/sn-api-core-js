import test from "ava";

import { UserDatumAuxiliaryUrlHelper } from "../../src/net/userDatumAuxiliaryUrlHelperMixin.js";
import DatumFilter from "../../src/domain/datumFilter.js";
import DatumAuxiliaryTypes from "../../src/domain/datumAuxiliaryType.js";

test("net:userDatumAuxiliaryUrlHelperMixin:create", (t) => {
	const helper = new UserDatumAuxiliaryUrlHelper();
	t.truthy(helper);
});

test("net:userDatumAuxiliaryUrlHelperMixin:list:noFilter", (t) => {
	const helper = new UserDatumAuxiliaryUrlHelper();
	const result = helper.listUserDatumAuxiliaryUrl();
	t.is(result, "https://data.solarnetwork.net/solaruser/api/v1/sec/datum/auxiliary");
});

test("net:userDatumAuxiliaryUrlHelperMixin:list:typical", (t) => {
	const helper = new UserDatumAuxiliaryUrlHelper();
	const filter = new DatumFilter();
	filter.nodeId = 123;
	filter.sourceId = "Foo";
	filter.startDate = new Date("2017-01-01T12:12:12.123Z");
	filter.endDate = new Date(filter.startDate.getTime() + 24 * 60 * 60 * 1000);

	const result = helper.listUserDatumAuxiliaryUrl(filter);
	t.is(
		result,
		"https://data.solarnetwork.net/solaruser/api/v1/sec/datum/auxiliary" +
			"?nodeId=123&sourceId=Foo&startDate=2017-01-01T12%3A12&endDate=2017-01-02T12%3A12",
	);
});

test("net:userDatumAuxiliaryUrlHelperMixin:idUrl:typical", (t) => {
	const helper = new UserDatumAuxiliaryUrlHelper();
	const result = helper.userDatumAuxiliaryIdUrl(
		DatumAuxiliaryTypes.Reset,
		123,
		new Date("2017-01-01T12:12:12.123Z"),
		"Foo",
	);
	t.is(
		result,
		"https://data.solarnetwork.net/solaruser/api/v1/sec/datum/auxiliary/Reset/123/2017-01-01%2012%3A12%3A12.123Z/Foo",
	);
});

test("net:userDatumAuxiliaryUrlHelperMixin:idUQueryrl:typical", (t) => {
	const helper = new UserDatumAuxiliaryUrlHelper();
	const result = helper.userDatumAuxiliaryIdQueryUrl(
		DatumAuxiliaryTypes.Reset,
		123,
		new Date("2017-01-01T12:12:12.123Z"),
		"/foo/bar",
	);
	t.is(
		result,
		"https://data.solarnetwork.net/solaruser/api/v1/sec/datum/auxiliary" +
			"?type=Reset&nodeId=123&date=2017-01-01%2012%3A12%3A12.123Z&sourceId=%2Ffoo%2Fbar",
	);
});

test("net:userDatumAuxiliaryUrlHelperMixin:idUrl:queryForced", (t) => {
	const helper = new UserDatumAuxiliaryUrlHelper();
	const result = helper.userDatumAuxiliaryIdUrl(
		DatumAuxiliaryTypes.Reset,
		123,
		new Date("2017-01-01T12:12:12.123Z"),
		"/foo/bar",
	);
	t.is(
		result,
		"https://data.solarnetwork.net/solaruser/api/v1/sec/datum/auxiliary" +
			"?type=Reset&nodeId=123&date=2017-01-01%2012%3A12%3A12.123Z&sourceId=%2Ffoo%2Fbar",
	);
});

test("net:userDatumAuxiliaryUrlHelperMixin:store:typical", (t) => {
	const helper = new UserDatumAuxiliaryUrlHelper();
	const result = helper.storeUserDatumAuxiliaryUrl(
		DatumAuxiliaryTypes.Reset,
		123,
		new Date("2017-01-01T12:12:12.123Z"),
		"Foo",
	);
	t.is(
		result,
		"https://data.solarnetwork.net/solaruser/api/v1/sec/datum/auxiliary/Reset/123/2017-01-01%2012%3A12%3A12.123Z/Foo",
	);
});

test("net:userDatumAuxiliaryUrlHelperMixin:view:typical", (t) => {
	const helper = new UserDatumAuxiliaryUrlHelper();
	const result = helper.viewUserDatumAuxiliaryUrl(
		DatumAuxiliaryTypes.Reset,
		123,
		new Date("2017-01-01T12:12:12.123Z"),
		"Foo",
	);
	t.is(
		result,
		"https://data.solarnetwork.net/solaruser/api/v1/sec/datum/auxiliary/Reset/123/2017-01-01%2012%3A12%3A12.123Z/Foo",
	);
});

test("net:userDatumAuxiliaryUrlHelperMixin:delete:typical", (t) => {
	const helper = new UserDatumAuxiliaryUrlHelper();
	const result = helper.deleteUserDatumAuxiliaryUrl(
		DatumAuxiliaryTypes.Reset,
		123,
		new Date("2017-01-01T12:12:12.123Z"),
		"Foo",
	);
	t.is(
		result,
		"https://data.solarnetwork.net/solaruser/api/v1/sec/datum/auxiliary/Reset/123/2017-01-01%2012%3A12%3A12.123Z/Foo",
	);
});
