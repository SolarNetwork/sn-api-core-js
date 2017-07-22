import test from 'ava';

import Pagination from 'domain/pagination';
import Location from 'domain/location';
import SortDescriptor from 'domain/sortDescriptor';
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

test('core:net:locationUrlHelperMixin:sourceId', t => {
	const helper = new LocationUrlHelper();
	helper.sourceId = 'abc';
	t.is(helper.sourceId, 'abc');
});

test('core:net:locationUrlHelperMixin:sourceIds', t => {
    const helper = new LocationUrlHelper();
	helper.sourceIds = ['abc', '234'];
	t.is(helper.sourceId, 'abc');
	t.deepEqual(helper.sourceIds, ['abc', '234']);
});

test('core:net:locationUrlHelperMixin:sourceIds:resetSourceId', t => {
	const helper = new LocationUrlHelper();
	helper.sourceIds = ['abc', '234'];
	t.deepEqual(helper.sourceIds, ['abc', '234']);
	helper.sourceId = 'def';
	t.deepEqual(helper.sourceIds, ['def'], 'sourceIds array reset to just sourceId');
});

test('core:net:locationUrlHelperMixin:listDatumUrl', t => {
    const helper = new LocationUrlHelper();
    const filter = new Location();
    filter.country = 'NZ';
    filter.timeZoneId = 'Pacific/Auckland';
	t.is(helper.findLocationsUrl(filter, [new SortDescriptor('name')], new Pagination(1, 2)),
		'https://data.solarnetwork.net/location?'
        +'country=NZ&timeZoneId=Pacific%2FAuckland'
        +'&sorts%5B0%5D.key=name&max=1&offset=2');
});