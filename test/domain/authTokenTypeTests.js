import test from 'ava';

import {default as AuthTokenTypes, AuthTokenType } from 'domain/authTokenType';

test('user:authTokenType:create', t => {
	const obj = new AuthTokenType('foo');
    t.truthy(obj);
    t.is(obj.name, 'foo');
});

test('user:authTokenType:enumsValue', t => {
	t.is(AuthTokenTypes.ReadNodeData.name, 'ReadNodeData');
	t.is(AuthTokenTypes.User.name, 'User');
});
