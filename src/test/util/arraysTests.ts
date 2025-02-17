import test from "ava";

import {
	intersection,
	lowercaseSortedArray,
	pushValues,
} from "../../main/util/arrays.js";

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

test("intersection:undefined:both", (t) => {
	t.deepEqual(intersection(undefined, undefined), new Set());
});

test("intersection:undefined:left", (t) => {
	t.deepEqual(intersection(undefined, new Set([1, 2, 3])), new Set());
});

test("intersection:undefined:right", (t) => {
	t.deepEqual(intersection(new Set([1, 2, 3]), undefined), new Set());
});

test("intersection:differentSizes:biggerRight", (t) => {
	t.deepEqual(
		intersection(new Set([1, 2, 3]), new Set([2, 3, 4, 5])),
		new Set([2, 3])
	);
});

test("intersection:differentSizes:biggerLeft", (t) => {
	t.deepEqual(
		intersection(new Set([1, 2, 3, 4, 5]), new Set([3, 4, 6])),
		new Set([3, 4])
	);
});

test("intersection:equalSizes:overlap", (t) => {
	t.deepEqual(
		intersection(new Set([1, 2, 3]), new Set([3, 4, 6])),
		new Set([3])
	);
});

test("intersection:equalSizes:disjoint", (t) => {
	t.deepEqual(intersection(new Set([1, 2, 3]), new Set([8, 9])), new Set());
});

test("intersection:equalSizes:equal", (t) => {
	t.deepEqual(
		intersection(new Set([1, 2, 3]), new Set([1, 2, 3])),
		new Set([1, 2, 3])
	);
});

test("intersection:arrays:both", (t) => {
	t.deepEqual(
		intersection([0, 2, 3, 6, 7], [0, 3, 5, 7]),
		new Set([0, 3, 7])
	);
});

test("intersection:arrays:left", (t) => {
	t.deepEqual(
		intersection([0, 2, 3, 6, 7], new Set([0, 3, 5, 7])),
		new Set([0, 3, 7])
	);
});

test("intersection:arrays:right", (t) => {
	t.deepEqual(
		intersection(new Set([0, 2, 3, 6, 7]), [0, 3, 5, 7]),
		new Set([0, 3, 7])
	);
});

test("intersection:strings", (t) => {
	t.deepEqual(
		intersection(new Set(["a", "b", "e"]), new Set(["d", "e", "b"])),
		new Set(["b", "e"])
	);
});

test("intersection:strings:arrays", (t) => {
	t.deepEqual(
		intersection(["a", "b", "e"], ["d", "e", "b"]),
		new Set(["b", "e"])
	);
});
