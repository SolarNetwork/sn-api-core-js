import test from 'ava';

import {default as DatumAuxiliaryTypes, DatumAuxiliaryType } from 'domain/datumAuxiliaryType';

test('domain:datumAuxiliaryType:create', t => {
	const obj = new DatumAuxiliaryType('foo', 1);
    t.truthy(obj);
    t.is(obj.name, 'foo');
});

test('domain:datumAuxiliaryType:aggregations', t => {
	t.is(DatumAuxiliaryTypes.Reset.name, 'Reset');
});
