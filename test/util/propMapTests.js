import test from 'ava';

import PropMap from 'util/propMap';
import Aggregations from 'domain/aggregation';
import Location from 'domain/location';

test('core:util:propMap:create', t => {
	const m = new PropMap();
    t.truthy(m);
    t.deepEqual(m.props, {});
});

test('core:util:propMap:create:data', t => {
    const d = {foo:1};
	const m = new PropMap(d);
    t.truthy(m);
    t.is(m.props, d);
});

test('core:util:propMap:toUriEncoding:empty', t => {
	const m = new PropMap();
    t.is(m.toUriEncoding(), '');
    t.is(m.toUriEncoding('foo'), '');
});

test('core:util:propMap:toUriEncoding:single', t => {
	const m = new PropMap({foo:'bar'});
    t.is(m.toUriEncoding(), 'foo=bar');
    t.is(m.toUriEncoding('foo'), 'foo.foo=bar');
});

test('core:util:propMap:toUriEncoding:multi', t => {
	const m = new PropMap({foo:'bar', a:1});
    t.is(m.toUriEncoding(), 'foo=bar&a=1');
    t.is(m.toUriEncoding('foo'), 'foo.foo=bar&foo.a=1');
});

test('core:util:propMap:toUriEncoding:array:empty', t => {
	const m = new PropMap({foo:[]});
    t.is(m.toUriEncoding(), 'foo=');
    t.is(m.toUriEncoding('foo'), 'foo.foo=');
});

test('core:util:propMap:toUriEncoding:array:single', t => {
	const m = new PropMap({foo:[1]});
    t.is(m.toUriEncoding(), 'foo=1');
    t.is(m.toUriEncoding('foo'), 'foo.foo=1');
});

test('core:util:propMap:toUriEncoding:array:multi', t => {
	const m = new PropMap({foo:[1,2,3]});
    t.is(m.toUriEncoding(), 'foo=1,2,3');
    t.is(m.toUriEncoding('foo'), 'foo.foo=1,2,3');
});

test('core:util:propMap:toUriEncoding:escaped', t => {
	const m = new PropMap({'$foo!':'=bar',bim:['&?y','e','!@#']});
    t.is(m.toUriEncoding(), '%24foo!=%3Dbar&bim=%26%3Fy,e,!%40%23');
    t.is(m.toUriEncoding('$f'), '%24f.%24foo!=%3Dbar&%24f.bim=%26%3Fy,e,!%40%23');
});

test('core:util:propMap:toUriEncoding:array:callbackFn:single', t => {
	const m = new PropMap({foos:[1],bars:[2],bams:[3,4]});
    t.is(m.toUriEncoding(null, (k, v) => {
            if ( k === 'foos' ) {
                return ['foo', v];
            } else if ( k === 'bars' ) {
                return null;
            }
            return k;
        }), 'foo=1&&bams=3,4');
});

test('core:util:propMap:toUriEncoding:enums', t => {
    const m = new PropMap({foo:Aggregations.Hour, bar:[Aggregations.Week, Aggregations.Month]});
    t.is(m.toUriEncoding(), 'foo=Hour&bar=Week,Month');
});

test('core:util:propMap:toUriEncoding:location', t => {
    const m = new PropMap({foo:'bar',location:new Location({country:'NZ',timeZoneId:'Pacific/Auckland'})});
    t.is(m.toUriEncoding(), 'foo=bar&location.country=NZ&location.timeZoneId=Pacific%2FAuckland');
});
