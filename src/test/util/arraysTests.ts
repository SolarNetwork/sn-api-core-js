import test from "ava";

import { lowercaseSortedArray, pushValues } from "../../main/util/arrays.js";

test("pushValues:undefined", (t) => {
	// GIVEN
	const array: number[] = [1, 2, 3];

	// WHEN
	pushValues(array);

	// THEN
	t.deepEqual(array, [1, 2, 3]);
});

test("pushValues:nonArrayResult", (t) => {
	// GIVEN
	const array: number[] = {} as any;

	// WHEN
	pushValues(array);

	// THEN
	t.deepEqual(array, {});
});

test("pushValues:array:initial", (t) => {
	// GIVEN
	const array: number[] = [];

	// WHEN
	pushValues(array, [1, 2, 3]);

	// THEN
	t.deepEqual(array, [1, 2, 3]);
});

test("pushValues:array:add", (t) => {
	// GIVEN
	const array: number[] = [1, 2, 3];

	// WHEN
	pushValues(array, [4, 5, 6]);

	// THEN
	t.deepEqual(array, [1, 2, 3, 4, 5, 6]);
});

test("pushValues:set:add", (t) => {
	// GIVEN
	const array = [1, 2, 3];

	// WHEN
	pushValues(array, new Set([4, 5, 6]));

	// THEN
	t.deepEqual(array, [1, 2, 3, 4, 5, 6]);
});

test("lowercaseSortedArray:empty", (t) => {
	// GIVEN
	const input = [] as string[];

	// WHEN
	const result = lowercaseSortedArray(input);

	t.not(result, input, "copy of input made");
	t.deepEqual(result, []);
});

test("lowercaseSortedArray:alreadySorted", (t) => {
	// GIVEN
	const input = ["a", "b", "c"];

	// WHEN
	const result = lowercaseSortedArray(input);

	t.not(result, input, "copy of input made");
	t.deepEqual(result, input);
});

test("lowercaseSortedArray", (t) => {
	// GIVEN
	const input = ["One", "two", "THREE"];

	// WHEN
	const result = lowercaseSortedArray(input);

	t.not(result, input, "copy of input made");
	t.deepEqual(result, ["one", "three", "two"]);
});
