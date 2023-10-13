import test from "ava";

import {
	default as AuthTokenTypes,
	AuthTokenType,
	AuthTokenTypeNames,
} from "../../main/domain/authTokenType.js";

test("create", (t) => {
	const obj = new AuthTokenType("foo");
	t.truthy(obj);
	t.is(obj.name, "foo");
});

test("enumValues", (t) => {
	const values: readonly AuthTokenType[] = AuthTokenType.enumValues();
	t.deepEqual(values, [AuthTokenTypes.ReadNodeData, AuthTokenTypes.User]);
});

test("enumsValue", (t) => {
	t.is(AuthTokenTypes.ReadNodeData.name, AuthTokenTypeNames.ReadNodeData);
	t.is(AuthTokenTypes.User.name, AuthTokenTypeNames.User);
});
