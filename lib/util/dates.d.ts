import { Aggregation } from "../domain/aggregation.js";
/**
 * A date range configuration.
 */
export interface DateRangeConfiguration {
    /** The number of hours to use. */
    numHours?: number;
    /** The number of days to use. */
    numDays?: number;
    /** The number of months to use. */
    numMonths?: number;
    /** The number of years to use. */
    numYears?: number;
}
/**
 * A date range.
 */
export interface DateRange {
    /** The starting date. */
    start: Date;
    /** The ending date. */
    end: Date;
    /** The time unit used by the date range. */
    timeUnit: Aggregation;
    /** The number of time units in the date range. */
    timeCount: number;
    /** The aggregate to query with. */
    aggregate: Aggregation;
}
/**
 * Get a query range appropriate for a given aggregate level.
 *
 * Returns an object with `start` and `end` Date properties, using the given `endDate`
 * parameter as the basis for calculating the start as an offset backwards in time
 * based on the given `aggregate` level.
 *
 * The `aggregateTimeCount` will be treated as a "next higher" aggregate level from
 * `aggregate`, like this:
 *
 *  * < `Hour`: `numHours`
 *  * `Hour` : `numDays`
 *  * `Day` : `numMonths`
 *  * `Month` : `numYears`
 *
 * For example, you might like to render a chart using `TenMinute` aggregate data for the
 * last 24 hours. You'd call this function like this:
 *
 * ```
 * const range = rollingQueryDateRange(Aggregates.TenMinute, 24);
 *
 * // or, passing a DateRangeConfiguration
 * const range = rollingQueryDateRange(Aggregates.TenMinute, {numHours:24});
 * ```
 *
 * @param aggregate - the aggregate level to get a query range for
 * @param aggregateTimeCount - the number of aggregate time units to use
 * @param endDate - the ending date; if not provided the current date will be used
 * @returns the calculated date range
 */
export declare function rollingQueryDateRange(aggregate: Aggregation, aggregateTimeCount: DateRangeConfiguration | number, endDate?: Date): DateRange;
/**
 * Format a date into a SolarNet UTC timestamp format: `yyyy-MM-dd HH:mm:ss.SSS'Z'`.
 */
export declare const timestampFormat: (date: Date) => string;
/**
 * Format a date into a SolarNet UTC date/time format: `yyyy-MM-dd HH:mm`.
 */
export declare const dateTimeFormat: (date: Date) => string;
/**
 * Format a date into a SolarNet URL UTC date/time format: `yyyy-MM-dd'T'HH:mm`.
 */
export declare const dateTimeUrlFormat: (date: Date) => string;
/**
 * Format a date into a SolarNet URL UTC date/time format: `yyyy-MM-dd'T'HH:mm`
 * or ``yyyy-MM-dd` if both the hours and minutes of the date are zero.
 * @param date the date to format
 * @returns the formatted date
 */
export declare const dateUrlFormat: (date: Date) => string;
/**
 * Format a date into a SolarNet URL local date/time format: `yyyy-MM-dd'T'HH:mm`.
 */
export declare const localDateTimeUrlFormat: (date: Date) => string;
/**
 * Format a date into a SolarNet URL local date/time format: `yyyy-MM-dd'T'HH:mm`
 * or ``yyyy-MM-dd` if both the hours and minutes of the date are zero.
 * @param date the date to format
 * @returns the formatted date
 */
export declare const localDateUrlFormat: (date: Date) => string;
/**
 * Format a date into a SolarNet UTC date format: `yyyy-MM-dd`.
 */
export declare const dateFormat: (date: Date) => string;
/**
 * Format a local date into a SolarNet date format: `yyyy-MM-dd`.
 */
export declare const localDateFormat: (date: Date) => string;
/**
 * Parse a SolarNet UTC timestamp value:  `yyyy-MM-dd HH:mm:ss.SSS'Z'.
 */
export declare const timestampParse: (dateString: string) => Date | null;
/**
 * Parse a SolarNet UTC date/time: `yyyy-MM-dd HH:mm.
 */
export declare const dateTimeParse: (dateString: string) => Date | null;
/**
 * Parse a SolarNet URL UTC date/time: `yyyy-MM-dd'T'HH:mm`.
 */
export declare const dateTimeUrlParse: (dateString: string) => Date | null;
/**
 * Parse a SolarNet UTC date value: `yyyy-MM-dd`.
 */
export declare const dateParse: (dateString: string) => Date | null;
export { 
/**
 * Parse a SolarNet URL local date/time value:  `yyyy-MM-dd'T'HH:mm`.
 */
isoParse as localDateTimeUrlParse, 
/**
 * Parse a SolarNet local date value: `yyyy-MM-dd`.
 */
isoParse as localDateParse, } from "d3-time-format";
/**
 * Parse a UTC date string, from a variety of supported formats.
 *
 * @param str - the string to parse into a date
 * @returns the parsed `Date`, or `null` if the date can't be parsed
 */
export declare function dateParser(str: string): Date | null;
/**
 * Format a date into an ISO 8601 timestamp or date string, in the UTC time zone.
 *
 * The output of this format omits the optional date and time delimiters of `-`
 * and `:`, as well as any fractional seconds. The output format is like
 * `yyyyMMdd'T'hhmmss'Z'`.
 *
 * @param date - the date to format
 * @param includeTime - `true` to format as a timestamp, `false` as just a date
 * @returns the formatted date string
 */
export declare function iso8601Date(date: Date, includeTime?: boolean): string;
/**
 * Get a UTC season constant for a date. Seasons are groups of 3 months, e.g.
 * Spring, Summer, Autumn, Winter.
 *
 * The returned value will be a number between 0 and 3, where:
 *
 *  * (Mar, Apr, May) = `0`
 *  * (Jun, Jul, Aug) = `1`
 *  * (Sep, Oct, Nov) = `2`
 *  * (Dec, Jan, Feb) = `3`
 *
 * @param date - either a date to get the season for, or a number representing the UTC month of a date
 *     (0 is January, 11 is December)
 * @returns a season constant number, from 0 - 3
 */
export declare function seasonForDate(date: Date | number): number;
//# sourceMappingURL=dates.d.ts.map