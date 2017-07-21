import {test,todo} from 'ava';

import Location from 'domain/location';

test('domain:location:create', t => {
    const loc = new Location();
    t.truthy(loc);
    t.deepEqual(loc.properties(), {});
});

todo('mo tests!');
