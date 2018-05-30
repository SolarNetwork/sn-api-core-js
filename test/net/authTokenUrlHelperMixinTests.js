import test from 'ava';

import { dateFormat } from 'format/date'
import AuthTokenUrlHelperMixin from 'net/authTokenUrlHelperMixin';
import NodeUrlHelperMixin from 'net/authTokenUrlHelperMixin';
import QueryUrlHelperMixin from 'net/queryUrlHelperMixin';
import UrlHelper from 'net/urlHelper';

class TestUrlHelper extends AuthTokenUrlHelperMixin(QueryUrlHelperMixin(NodeUrlHelperMixin(UrlHelper))) {

}

test('net:authTokenUrlHelperMixin:create', t => {
	const helper = new TestUrlHelper();
	t.truthy(helper);
});

test('net:authTokenUrlHelperMixin:refreshV2Url', t => {
    const helper = new TestUrlHelper();
    helper.publicQuery = false;
    const date = new Date('1970-01-01');
    t.is(helper.refreshTokenV2Url(date), 'https://data.solarnetwork.net/solarquery/api/v1/sec/auth-tokens/refresh/v2?date=1970-01-01');
});

test('net:authTokenUrlHelperMixin:refreshV2Url:today', t => {
    const helper = new TestUrlHelper();
    helper.publicQuery = false;
    const expectedDateParam = dateFormat(new Date());
    t.is(helper.refreshTokenV2Url(), `https://data.solarnetwork.net/solarquery/api/v1/sec/auth-tokens/refresh/v2?date=${expectedDateParam}`);
});
