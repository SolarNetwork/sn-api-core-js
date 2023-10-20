import {
	utcMinute,
	utcHour,
	utcDay,
	utcMonth,
	utcYear,
	CountableTimeInterval,
} from "d3-time";
import {
	timeFormat as format,
	utcFormat,
	utcParse,
	isoParse,
} from "d3-time-format";
import { default as Aggregations, Aggregation } from "../domain/aggregation.js";

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

function exclusiveEndDate(interval: CountableTimeInterval, date: Date): Date {
	let result = interval.ceil(date);
	if (result.getTime() === date.getTime()) {
		// already on exact aggregate, so round up to next
		result = interval.offset(result, 1);
	}
	return result;
}

function timeCountValue(
	aggregateTimeCount: DateRangeConfiguration | number,
	propName: keyof DateRangeConfiguration
) {
	let result: number | undefined;
	if (typeof aggregateTimeCount === "number") {
		result = aggregateTimeCount;
	} else if (aggregateTimeCount) {
		if (aggregateTimeCount[propName] !== undefined) {
			result = Number(aggregateTimeCount[propName]);
		} else {
			result = 1;
		}
	}
	if (result === undefined || isNaN(result)) {
		result = 1;
	}
	return result;
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
export function rollingQueryDateRange(
	aggregate: Aggregation,
	aggregateTimeCount: DateRangeConfiguration | number,
	endDate?: Date
): DateRange {
	let end, start, timeUnit, timeCount;
	endDate = endDate || new Date();
	if (aggregate.compareTo(Aggregations.Hour) < 0) {
		timeCount = timeCountValue(aggregateTimeCount, "numHours");
		timeUnit = Aggregations.Hour;
		end = exclusiveEndDate(utcMinute, endDate);
		const precision = Math.min(30, aggregate.level / 60);
		end.setUTCMinutes(
			end.getUTCMinutes() + precision - (end.getUTCMinutes() % precision),
			0,
			0
		);
		start = utcHour.offset(end, -timeCount);
	} else if (Aggregations.Month.equals(aggregate)) {
		timeCount = timeCountValue(aggregateTimeCount, "numYears");
		timeUnit = Aggregations.Year;
		end = exclusiveEndDate(utcMonth, endDate);
		start = utcYear.offset(utcMonth.floor(endDate), -timeCount);
	} else if (Aggregations.Day.equals(aggregate)) {
		timeCount = timeCountValue(aggregateTimeCount, "numMonths");
		timeUnit = Aggregations.Month;
		end = exclusiveEndDate(utcDay, endDate);
		start = utcMonth.offset(utcDay.floor(endDate), -timeCount);
	} else {
		// assume Hour
		timeCount = timeCountValue(aggregateTimeCount, "numDays");
		timeUnit = Aggregations.Day;
		end = exclusiveEndDate(utcHour, endDate);
		start = utcDay.offset(end, -timeCount);
	}
	return {
		start: start,
		end: end,
		timeUnit: timeUnit,
		timeCount: timeCount,
		aggregate: aggregate,
	};
}

/**
 * Format a date into a SolarNet UTC timestamp format: `yyyy-MM-dd HH:mm:ss.SSS'Z'`.
 */
export const timestampFormat = utcFormat("%Y-%m-%d %H:%M:%S.%LZ");

/**
 * Format a date into a SolarNet UTC date/time format: `yyyy-MM-dd HH:mm`.
 */
export const dateTimeFormat = utcFormat("%Y-%m-%d %H:%M");

/**
 * Format a date into a SolarNet URL UTC date/time format: `yyyy-MM-dd'T'HH:mm`.
 */
export const dateTimeUrlFormat = utcFormat("%Y-%m-%dT%H:%M");

/**
 * Format a date into a SolarNet URL UTC date/time format: `yyyy-MM-dd'T'HH:mm`
 * or ``yyyy-MM-dd` if both the hours and minutes of the date are zero.
 * @param date the date to format
 * @returns the formatted date
 */
export const dateUrlFormat = (date: Date) => {
	if (date.getUTCHours() === 0 && date.getUTCMinutes() === 0) {
		return dateFormat(date);
	}
	return dateTimeUrlFormat(date);
};

/**
 * Format a date into a SolarNet URL local date/time format: `yyyy-MM-dd'T'HH:mm`.
 */
export const localDateTimeUrlFormat = format("%Y-%m-%dT%H:%M");

/**
 * Format a date into a SolarNet URL local date/time format: `yyyy-MM-dd'T'HH:mm`
 * or ``yyyy-MM-dd` if both the hours and minutes of the date are zero.
 * @param date the date to format
 * @returns the formatted date
 */
export const localDateUrlFormat = (date: Date) => {
	if (date.getHours() === 0 && date.getMinutes() === 0) {
		return localDateFormat(date);
	}
	return localDateTimeUrlFormat(date);
};

/**
 * Format a date into a SolarNet UTC date format: `yyyy-MM-dd`.
 */
export const dateFormat = utcFormat("%Y-%m-%d");

/**
 * Format a local date into a SolarNet date format: `yyyy-MM-dd`.
 */
export const localDateFormat = format("%Y-%m-%d");

/**
 * Parse a SolarNet UTC timestamp value:  `yyyy-MM-dd HH:mm:ss.SSS'Z'.
 */
export const timestampParse = utcParse("%Y-%m-%d %H:%M:%S.%LZ");

/**
 * Parse a SolarNet UTC date/time: `yyyy-MM-dd HH:mm.
 */
export const dateTimeParse = utcParse("%Y-%m-%d %H:%M");

/**
 * Parse a SolarNet URL UTC date/time: `yyyy-MM-dd'T'HH:mm`.
 */
export const dateTimeUrlParse = utcParse("%Y-%m-%dT%H:%M");

/**
 * Parse a SolarNet UTC date value: `yyyy-MM-dd`.
 */
export const dateParse = utcParse("%Y-%m-%d");

export {
	/**
	 * Parse a SolarNet URL local date/time value:  `yyyy-MM-dd'T'HH:mm`.
	 */
	isoParse as localDateTimeUrlParse,
	/**
	 * Parse a SolarNet local date value: `yyyy-MM-dd`.
	 */
	isoParse as localDateParse,
} from "d3-time-format";

/**
 * Parse a UTC date string, from a variety of supported formats.
 *
 * @param str - the string to parse into a date
 * @returns the parsed `Date`, or `null` if the date can't be parsed
 */
export function dateParser(str: string): Date | null {
	return (
		timestampParse(str) ||
		dateTimeParse(str) ||
		dateTimeUrlParse(str) ||
		dateParse(str) ||
		isoParse(str)
	);
}

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
export function iso8601Date(date: Date, includeTime?: boolean): string {
	return (
		"" +
		date.getUTCFullYear() +
		(date.getUTCMonth() < 9 ? "0" : "") +
		(date.getUTCMonth() + 1) +
		(date.getUTCDate() < 10 ? "0" : "") +
		date.getUTCDate() +
		(includeTime
			? "T" +
			  (date.getUTCHours() < 10 ? "0" : "") +
			  date.getUTCHours() +
			  (date.getUTCMinutes() < 10 ? "0" : "") +
			  date.getUTCMinutes() +
			  (date.getUTCSeconds() < 10 ? "0" : "") +
			  date.getUTCSeconds() +
			  "Z"
			: "")
	);
}

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
 * @param local - if `true` then use local date components, otherwise UTC
 * @returns a season constant number, from 0 - 3
 */
export function seasonForDate(date: Date | number, local?:boolean): 0 | 1 | 2 | 3 {
	const m = date instanceof Date ? (local ? date.getMonth() : date.getUTCMonth()) : Number(date);
	if (m < 2 || m === 11) {
		return 3;
	} else if (m < 5) {
		return 0;
	} else if (m < 8) {
		return 1;
	} else {
		return 2;
	}
}
