import test from 'ava';

import UrlHelper from 'net/urlHelper';
import LocationUrlHelperMixin from 'net/locationUrlHelperMixin';

class LocationUrlHelper extends LocationUrlHelperMixin(UrlHelper) {

}

test('core:net:locationUrlHelperMixin:create', t => {
	const helper = new LocationUrlHelper();
	t.truthy(helper);
});

test('core:net:locationUrlHelperMixin:locationId', t => {
	const helper = new LocationUrlHelper();
	helper.locationId = 123;
	t.is(helper.locationId, 123);
});

test('core:net:locationUrlHelperMixin:locationIds', t => {
    const helper = new LocationUrlHelper();
	helper.locationIds = [123, 234];
	t.is(helper.locationId, 123);
	t.deepEqual(helper.locationIds, [123, 234]);
});

test('core:net:locationUrlHelperMixin:locationIds:resetLocationId', t => {
	const helper = new LocationUrlHelper();
	helper.locationIds = [123, 234];
	t.deepEqual(helper.locationIds, [123, 234]);
	helper.locationId = 456;
	t.deepEqual(helper.locationIds, [456], 'locationIds array reset to just locationId');
});

test('core:net:sourceUrlHelperMixin:sourceId', t => {
	const helper = new LocationUrlHelper();
	helper.sourceId = 'abc';
	t.is(helper.sourceId, 'abc');
});

test('core:net:sourceUrlHelperMixin:sourceIds', t => {
    const helper = new LocationUrlHelper();
	helper.sourceIds = ['abc', '234'];
	t.is(helper.sourceId, 'abc');
	t.deepEqual(helper.sourceIds, ['abc', '234']);
});

test('core:net:sourceUrlHelperMixin:sourceIds:resetSourceId', t => {
	const helper = new LocationUrlHelper();
	helper.sourceIds = ['abc', '234'];
	t.deepEqual(helper.sourceIds, ['abc', '234']);
	helper.sourceId = 'def';
	t.deepEqual(helper.sourceIds, ['def'], 'sourceIds array reset to just sourceId');
});
