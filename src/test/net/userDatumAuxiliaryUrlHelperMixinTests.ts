import test from "ava";

import { default as DatumFilter } from "../../main/domain/datumFilter.js";
import DatumAuxiliaryTypes from "../../main/domain/datumAuxiliaryType.js";
import UrlHelper from "../../main/net/urlHelper.js";
import UserDatumAuxiliaryUrlHelperMixin from "../../main/net/userDatumAuxiliaryUrlHelperMixin.js";

class UserDatumAuxiliaryUrlHelper extends UserDatumAuxiliaryUrlHelperMixin(
	UrlHelper
) {}

test("create", (t) => {
	const helper = new UserDatumAuxiliaryUrlHelper();
	t.truthy(helper);
});

test("list:noFilter", (t) => {
	const helper = new UserDatumAuxiliaryUrlHelper();
	const result = helper.listUserDatumAuxiliaryUrl(undefined as any);
	t.is(result, "https://data.solarnetwork.net/datum/auxiliary");
});

test("list:typical", (t) => {
	const helper = new UserDatumAuxiliaryUrlHelper();
	const filter = new DatumFilter();
	filter.nodeId = 123;
	filter.sourceId = "Foo";
	filter.startDate = new Date("2017-01-01T12:12:12.123Z");
	filter.endDate = new Date(filter.startDate.getTime() + 24 * 60 * 60 * 1000);

	const result = helper.listUserDatumAuxiliaryUrl(filter);
	t.is(
		result,
		"https://data.solarnetwork.net/datum/auxiliary" +
			"?nodeId=123&sourceId=Foo&startDate=2017-01-01T12%3A12&endDate=2017-01-02T12%3A12"
	);
});

test("idUrl:typical", (t) => {
	const helper = new UserDatumAuxiliaryUrlHelper();
	const result = helper.userDatumAuxiliaryIdUrl(
		DatumAuxiliaryTypes.Reset,
		123,
		new Date("2017-01-01T12:12:12.123Z"),
		"Foo"
	);
	t.is(
		result,
		"https://data.solarnetwork.net/datum/auxiliary/Reset/123/2017-01-01%2012%3A12%3A12.123Z/Foo"
	);
});

test("idUrl:nonAuxType", (t) => {
	const helper = new UserDatumAuxiliaryUrlHelper();
	const result = helper.userDatumAuxiliaryIdUrl(
		"Foo" as any,
		123,
		new Date("2017-01-01T12:12:12.123Z"),
		"Foo"
	);
	t.is(
		result,
		"https://data.solarnetwork.net/datum/auxiliary/Foo/123/2017-01-01%2012%3A12%3A12.123Z/Foo"
	);
});

test("idQueryUrl:typical", (t) => {
	const helper = new UserDatumAuxiliaryUrlHelper();
	const result = helper.userDatumAuxiliaryIdQueryUrl(
		DatumAuxiliaryTypes.Reset,
		123,
		new Date("2017-01-01T12:12:12.123Z"),
		"/foo/bar"
	);
	t.is(
		result,
		"https://data.solarnetwork.net/datum/auxiliary" +
			"?type=Reset&nodeId=123&date=2017-01-01%2012%3A12%3A12.123Z&sourceId=%2Ffoo%2Fbar"
	);
});

test("idUrl:queryForced", (t) => {
	const helper = new UserDatumAuxiliaryUrlHelper();
	const result = helper.userDatumAuxiliaryIdUrl(
		DatumAuxiliaryTypes.Reset,
		123,
		new Date("2017-01-01T12:12:12.123Z"),
		"/foo/bar"
	);
	t.is(
		result,
		"https://data.solarnetwork.net/datum/auxiliary" +
			"?type=Reset&nodeId=123&date=2017-01-01%2012%3A12%3A12.123Z&sourceId=%2Ffoo%2Fbar"
	);
});

test("store:typical", (t) => {
	const helper = new UserDatumAuxiliaryUrlHelper();
	const result = helper.storeUserDatumAuxiliaryUrl(
		DatumAuxiliaryTypes.Reset,
		123,
		new Date("2017-01-01T12:12:12.123Z"),
		"Foo"
	);
	t.is(
		result,
		"https://data.solarnetwork.net/datum/auxiliary/Reset/123/2017-01-01%2012%3A12%3A12.123Z/Foo"
	);
});

test("view:typical", (t) => {
	const helper = new UserDatumAuxiliaryUrlHelper();
	const result = helper.viewUserDatumAuxiliaryUrl(
		DatumAuxiliaryTypes.Reset,
		123,
		new Date("2017-01-01T12:12:12.123Z"),
		"Foo"
	);
	t.is(
		result,
		"https://data.solarnetwork.net/datum/auxiliary/Reset/123/2017-01-01%2012%3A12%3A12.123Z/Foo"
	);
});

test("delete:typical", (t) => {
	const helper = new UserDatumAuxiliaryUrlHelper();
	const result = helper.deleteUserDatumAuxiliaryUrl(
		DatumAuxiliaryTypes.Reset,
		123,
		new Date("2017-01-01T12:12:12.123Z"),
		"Foo"
	);
	t.is(
		result,
		"https://data.solarnetwork.net/datum/auxiliary/Reset/123/2017-01-01%2012%3A12%3A12.123Z/Foo"
	);
});
