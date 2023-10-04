import test from "ava";

import { default as AuthTokenStatuses, AuthTokenStatus } from "../../src/domain/authTokenStatus.js";

test("user:authTokenStatus:create", (t) => {
	const obj = new AuthTokenStatus("foo");
	t.truthy(obj);
	t.is(obj.name, "foo");
});

test("user:authTokenStatus:enumsValue", (t) => {
	t.is(AuthTokenStatuses.Active.name, "Active");
	t.is(AuthTokenStatuses.Disabled.name, "Disabled");
});
