/** Enumeration of logger levels. */
declare enum LogLevel {
    /** Verbose level. */
    DEBUG = 4,
    /** Informational level. */
    INFO = 3,
    /** Warning level. */
    WARN = 2,
    /** Error level. */
    ERROR = 1,
    /** No logging. */
    OFF = 0
}
/**
 * An application logger.
 *
 * Logging levels range from 0-4 and is controlled at the application level.
 * Level `0` is off, `1` is error, `2` is warn, `3` is info,  and `4` is debug.
 * The default level is `2`.
 */
declare class Logger {
    /** The global log level. */
    static get level(): number;
    static set level(val: number);
    /**
     * Log at debug level.
     * @param args - the log arguments
     */
    static debug(...args: any[]): void;
    /**
     * Log at info level.
     * @param args - the log arguments
     */
    static info(...args: any[]): void;
    /**
     * Log at warn level.
     * @param args - the log arguments
     */
    static warn(...args: any[]): void;
    /**
     * Log at error level.
     * @param args - the log arguments
     */
    static error(...args: any[]): void;
}
export default Logger;
export { LogLevel };
//# sourceMappingURL=logger.d.ts.map