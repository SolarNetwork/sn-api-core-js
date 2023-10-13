"use strict";

import test from "ava";

import Pagination from "../../main/domain/pagination.js";

test("construct", (t) => {
	const p = new Pagination();
	t.is(p.max, 0);
	t.is(p.offset, 0);
});

test("construct:max", (t) => {
	const p = new Pagination(1);
	t.is(p.max, 1);
	t.is(p.offset, 0);
});

test("construct:maxAndOffset", (t) => {
	const p = new Pagination(1, 2);
	t.is(p.max, 1);
	t.is(p.offset, 2);
});

test("copy", (t) => {
	const p = new Pagination(50);
	const p2 = p.withOffset(100);
	t.is(p2.max, 50);
	t.is(p2.offset, 100);
});

test("toUriEncoded:empty", (t) => {
	const p = new Pagination();
	t.is(p.toUriEncoding(), "");
});

test("toUriEncoded:max", (t) => {
	const p = new Pagination(1);
	t.is(p.toUriEncoding(), "max=1");
});

test("toUriEncoded:offset", (t) => {
	const p = new Pagination(0, 100);
	t.is(p.toUriEncoding(), "offset=100");
});

test("toUriEncoded:maxAndOffset", (t) => {
	const p = new Pagination(50, 100);
	t.is(p.toUriEncoding(), "max=50&offset=100");
});
