import test from "ava";

import {
	default as SshCloseCodes,
	SshCloseCode,
	SshCloseCodeNames,
} from "../../main/domain/sshCloseCode.js";

test("create", (t) => {
	const obj = new SshCloseCode("foo", 1);
	t.truthy(obj);
	t.is(obj.name, "foo");
	t.is(obj.value, 1);
});

test("compare:lt", (t) => {
	const left = new SshCloseCode("foo", 1);
	const right = new SshCloseCode("bar", 2);
	t.is(left.compareTo(right), -1);
});

test("compare:gt", (t) => {
	const left = new SshCloseCode("foo", 2);
	const right = new SshCloseCode("bar", 1);
	t.is(left.compareTo(right), 1);
});

test("compare:eq", (t) => {
	const left = new SshCloseCode("foo", 1);
	const right = new SshCloseCode("bar", 1);
	t.is(left.compareTo(right), 0);
});

test("aggregations", (t) => {
	t.is(
		SshCloseCodes.AuthenticationFailure.name,
		SshCloseCodeNames.AuthenticationFailure
	);
	t.is(SshCloseCodes.AuthenticationFailure.value, 4000);
});

test("enumValues", (t) => {
	const values: readonly SshCloseCode[] = SshCloseCode.enumValues();
	t.deepEqual(values, [SshCloseCodes.AuthenticationFailure]);
});
