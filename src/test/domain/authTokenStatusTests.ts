import test from "ava";

import {
	default as AuthTokenStatuses,
	AuthTokenStatus,
	AuthTokenStatusNames,
} from "../../main/domain/authTokenStatus.js";

test("create", (t) => {
	const obj = new AuthTokenStatus("foo");
	t.truthy(obj);
	t.is(obj.name, "foo");
});

test("enumValues", (t) => {
	const values: readonly AuthTokenStatus[] = AuthTokenStatus.enumValues();
	t.deepEqual(values, [AuthTokenStatuses.Active, AuthTokenStatuses.Disabled]);
});

test("user:authTokenStatus:enumsValue", (t) => {
	t.is(AuthTokenStatuses.Active.name, AuthTokenStatusNames.Active);
	t.is(AuthTokenStatuses.Disabled.name, AuthTokenStatusNames.Disabled);
});
