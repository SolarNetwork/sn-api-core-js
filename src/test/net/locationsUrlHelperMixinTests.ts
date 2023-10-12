import test from "ava";

import Pagination from "../../main/domain/pagination.js";
import Location from "../../main/domain/location.js";
import SortDescriptor from "../../main/domain/sortDescriptor.js";
import UrlHelper from "../../main/net/urlHelper.js";
import LocationsUrlHelperMixin from "../../main/net/locationsUrlHelperMixin.js";

class LocationUrlHelper extends LocationsUrlHelperMixin(UrlHelper) {}

test("create", (t) => {
	const helper = new LocationUrlHelper();
	t.truthy(helper);
});

test("findLocationsUrl", (t) => {
	const helper = new LocationUrlHelper();
	const filter = new Location();
	filter.country = "NZ";
	filter.timeZoneId = "Pacific/Auckland";
	t.is(
		helper.findLocationsUrl(
			filter,
			[new SortDescriptor("name")],
			new Pagination(1, 2)
		),
		"https://data.solarnetwork.net/location?" +
			"country=NZ&timeZoneId=Pacific%2FAuckland" +
			"&sorts%5B0%5D.key=name&max=1&offset=2"
	);
});
