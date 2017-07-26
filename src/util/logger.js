/* eslint no-console: 0 */

let logLevel = 2;

function consoleLog(level, ...args) {
    if ( level > logLevel ) {
        return;
    }
    if ( !console ) {
        return;
    }

    let logFn;
    switch ( level ) {
        case 1:
            logFn = console.error;
            break;
        case 2:
            logFn = console.warn;
            break;
        case 3:
            logFn = console.info;
            break;
    }
    if ( !logFn ) {
        logFn = console.log;
    }
    if ( !logFn ) {
        return; // no console available
    }
    logFn(...args); // TODO formatting like sn.format.fmt.apply(this, arguments)?
}

const logLevels = Object.freeze({
    DEBUG: 4,
    INFO: 3,
    WARN: 2,
    ERROR: 1,
    OFF: 0,
});

/**
 * An application logger.
 * 
 * Logging levels range from 0-4 and is controlled at the application level.
 * Level `0` is off, `1` is error, `2` is warn, `3` is info,  and `4` is debug.
 * The default level starts as `2`.
 */
class Logger {

    static debug(...args) {
        consoleLog(4, ...args);
    }

    static info(...args) {
        consoleLog(3, ...args);
    }

    static warn(...args) {
        consoleLog(2, ...args);
    }

    static error(...args) {
        consoleLog(1, ...args);
    }

}

Object.defineProperties(Logger, {
	/**
	 * The global logging level. Set to `0` to disable all logging.
	 * 
	 * @memberof module:util~Logger
	 * @type {number}
	 */
    level: { 
        get:function() { return logLevel; }, 
        set:function(v) { logLevel = typeof v === 'number' ? v : 0}
    },
});

export default Logger;
export { logLevels };
