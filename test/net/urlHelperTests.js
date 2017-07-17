import test from 'ava';

import Environment from 'net/environment';
import UrlHelper from 'net/urlHelper';

test('core:net:urlHelper:static:resolveTemplateUrl', t => {
    const result = UrlHelper.resolveTemplateUrl('/some/{mode}/path?foo={foo}', {
        mode: 'crazy',
        foo: 'bar',
    });
    t.is(result, '/some/crazy/path?foo=bar');
});

test('core:net:urlHelper:static:resolveTemplateUrl:uirEncoded', t => {
    const result = UrlHelper.resolveTemplateUrl('/some/{mode}/path?foo={foo}', {
        mode: 'crazy/cool',
        foo: 'bar&grille',
    });
    t.is(result, '/some/crazy%2Fcool/path?foo=bar%26grille');
});

test('core:net:urlHelper:create', t => {
	const helper = new UrlHelper();
	t.truthy(helper);
    t.truthy(helper.parameters);
});

test('core:net:urlHelper:create:environment', t => {
    const env = new Environment();
	const helper = new UrlHelper(env);
	t.is(helper.environment, env);
});

test('core:net:urlHelper:create:environmentObject', t => {
	const helper = new UrlHelper({foo:'bar'});
    const env = helper.environment;
    t.is(env.value('foo'), 'bar');
});

test('core:net:urlHelper:hostUrl', t => {
    const helper = new UrlHelper();
    t.is(helper.hostUrl(), 'https://data.solarnetwork.net');
});

test('core:net:urlHelper:hostUrl:http', t => {
    const env = new Environment({
			protocol: 'http',
		});
	const helper = new UrlHelper(env);
    t.is(helper.hostUrl(), 'http://data.solarnetwork.net');
});

test('core:net:urlHelper:hostUrl:customHost', t => {
    const env = new Environment({
			host: 'foo.example.com:8443',
		});
	const helper = new UrlHelper(env);
    t.is(helper.hostUrl(), 'https://foo.example.com:8443');
});

test('core:net:urlHelper:hostUrl:customPort', t => {
    const env = new Environment({
			port: 8443,
		});
	const helper = new UrlHelper(env);
    t.is(helper.hostUrl(), 'https://data.solarnetwork.net:8443');
});

test('core:net:urlHelper:baseUrl', t => {
    const helper = new UrlHelper();
    t.is(helper.baseUrl(), 'https://data.solarnetwork.net');
});

test('core:net:urlHelper:resolveTemplateUrl', t => {
	const helper = new UrlHelper();
    helper.parameters.values({mode:'crazy', foo:'bar'});
    const result = helper.resolveTemplateUrl('/some/{mode}/path?foo={foo}');
    t.is(result, '/some/crazy/path?foo=bar');
});

test('core:net:urlHelper:resolveTemplatePath', t => {
	const helper = new UrlHelper();
    helper.parameters.values({mode:'crazy', foo:'bar'});
    const result = helper.resolveTemplatePath('/some/{mode}/path?foo={foo}');
    t.is(result, 'https://data.solarnetwork.net/some/crazy/path?foo=bar');
});

test('core:net:urlHelper:env', t => {
	const helper = new UrlHelper();
	t.is(helper.env('host'), 'data.solarnetwork.net');
    t.is(helper.env('fooPath', '/foo'), helper.environment);
    t.is(helper.env('fooPath'), '/foo');
    t.is(helper.environment.value('fooPath'), '/foo');
});

test('core:net:urlHelper:parameter', t => {
	const helper = new UrlHelper();
    t.is(helper.parameter('foo', 'bar'), helper.parameters);
	t.is(helper.parameter('foo'), 'bar');
    t.is(helper.parameters.value('foo'), 'bar');
});
