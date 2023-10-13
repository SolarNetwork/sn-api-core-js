/* eslint no-console: 0 */
let logLevel = 2;
function consoleLog(level, ...args) {
    if (level > logLevel) {
        return;
    }
    /* c8 ignore next 3 */
    if (!console) {
        return;
    }
    let logFn;
    switch (level) {
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
    if (!logFn) {
        logFn = console.log;
    }
    /* c8 ignore next 3 */
    if (typeof logFn !== "function") {
        return;
    }
    logFn(...args);
}
/** Enumeration of logger levels. */
var LogLevel;
(function (LogLevel) {
    /** Verbose level. */
    LogLevel[LogLevel["DEBUG"] = 4] = "DEBUG";
    /** Informational level. */
    LogLevel[LogLevel["INFO"] = 3] = "INFO";
    /** Warning level. */
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    /** Error level. */
    LogLevel[LogLevel["ERROR"] = 1] = "ERROR";
    /** No logging. */
    LogLevel[LogLevel["OFF"] = 0] = "OFF";
})(LogLevel || (LogLevel = {}));
/**
 * An application logger.
 *
 * Logging levels range from 0-4 and is controlled at the application level.
 * Level `0` is off, `1` is error, `2` is warn, `3` is info,  and `4` is debug.
 * The default level is `2`.
 */
class Logger {
    /** The global log level. */
    static get level() {
        return logLevel;
    }
    static set level(val) {
        logLevel = typeof val === "number" ? val : 0;
    }
    /**
     * Log at debug level.
     * @param args - the log arguments
     */
    static debug(...args) {
        consoleLog(4, ...args);
    }
    /**
     * Log at info level.
     * @param args - the log arguments
     */
    static info(...args) {
        consoleLog(3, ...args);
    }
    /**
     * Log at warn level.
     * @param args - the log arguments
     */
    static warn(...args) {
        consoleLog(2, ...args);
    }
    /**
     * Log at error level.
     * @param args - the log arguments
     */
    static error(...args) {
        consoleLog(1, ...args);
    }
}
export default Logger;
export { LogLevel };
//# sourceMappingURL=logger.js.map