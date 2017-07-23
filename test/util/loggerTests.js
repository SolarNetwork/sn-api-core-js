import test from 'ava';

import { default as log, logLevels } from '../../src/util/logger';

test('core:util:logger:level', t => {
    t.is(log.level, logLevels.WARN, 'default level');
    log.level = logLevels.OFF;
    t.is(log.level, logLevels.OFF);
});

test('core:util:logger:level:nonDigit', t => {
    log.level = 'a';
    t.is(log.level, logLevels.OFF);
});

test('core:util:logger:debug', t => {
    log.level = logLevels.DEBUG;
    log.debug('Hi there, debug!');
    t.pass();
});

test('core:util:logger:info', t => {
    log.level = logLevels.INFO;
    log.info('Hi there, info!');
    t.pass();
});

test('core:util:logger:warn', t => {
    log.level = logLevels.WARN;
    log.warn('Hi there, warn!');
    t.pass();
});

test('core:util:logger:error', t => {
    log.level = logLevels.ERROR;
    log.error('Hi there, error!');
    t.pass();
});
