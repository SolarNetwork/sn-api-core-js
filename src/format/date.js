import { timeFormat as format, utcFormat, utcParse, isoParse } from "d3-time-format";

/**
 * Format a date into a SolarNet UTC timestamp format.
 * @function
 * @param {Date} date the date to format
 * @returns {string} the formatted date value - `yyyy-MM-dd HH:mm:ss.SSS'Z'`
 * @alias module:format~timestampFormat
 */
export const timestampFormat = utcFormat("%Y-%m-%d %H:%M:%S.%LZ");

/**
 * Format a date into a SolarNet UTC date/time format.
 * @function
 * @param {Date} date the date to format
 * @returns {string} the formatted date value - `yyyy-MM-dd HH:mm`
 * @alias module:format~dateTimeFormat
 */
export const dateTimeFormat = utcFormat("%Y-%m-%d %H:%M");

/**
 * Format a date into a SolarNet URL UTC date/time format.
 * @function
 * @param {Date} date the date to format
 * @returns {string} the formatted date value - `yyyy-MM-dd'T'HH:mm`
 * @alias module:format~dateTimeUrlFormat
 */
export const dateTimeUrlFormat = utcFormat("%Y-%m-%dT%H:%M");

/**
 * Format a date into a SolarNet URL local date/time format.
 * @function
 * @param {Date} date the date to format
 * @returns {string} the formatted date value - `yyyy-MM-dd'T'HH:mm`
 * @alias module:format~localDateTimeUrlFormat
 */
export const localDateTimeUrlFormat = format("%Y-%m-%dT%H:%M");

/**
 * Format a date into a SolarNet UTC date format.
 * @function
 * @param {Date} date the date to format
 * @returns {string} the formatted date value - `yyyy-MM-dd`
 * @alias module:format~dateFormat
 */
export const dateFormat = utcFormat("%Y-%m-%d");

/**
 * Parse a SolarNet UTC timestamp value.
 * @function
 * @param {string} str the string to parse - `yyyy-MM-dd HH:mm:ss.SSS'Z'
 * @returns {Date} the parsed date, or `null`
 * @alias module:format~timestampParse
 */
export const timestampParse = utcParse("%Y-%m-%d %H:%M:%S.%LZ");

/**
 * Parse a SolarNet UTC date/time.
 * @function
 * @param {string} str the string to parse - `yyyy-MM-dd HH:mm
 * @returns {Date} the parsed date, or `null`
 * @alias module:format~dateTimeParse
 */
export const dateTimeParse = utcParse("%Y-%m-%d %H:%M");

export {
	/**
	 * Parse a SolarNet URL UTC date/time value.
	 * @function
	 * @param {string} str the string to parse - `yyyy-MM-dd'T'HH:mm`
	 * @returns {Date} the parsed date, or `null`
	 * @alias module:format~dateTimeUrlParse
	 */
	isoParse as dateTimeUrlParse,
	/**
	 * Parse a SolarNet UTC date value.
	 * @function
	 * @param {string} str the string to parse - `yyyy-MM-dd`
	 * @returns {Date} the parsed date, or `null`
	 * @alias module:format~dateParse
	 */
	isoParse as dateParse,
} from "d3-time-format";

/**
 * Parse a UTC date string, from a variety of supported formats.
 *
 * @param {String} str the string to parse into a date
 * @returns {Date} the parsed `Date`, or `null` if the date can't be parsed
 * @alias module:format~dateParser
 */
export function dateParser(str) {
	var date = isoParse(str) || timestampParse(str) || dateTimeParse(str);
	return date;
}

/**
 * Format a date into an ISO 8601 timestamp or date string, in the UTC time zone.
 *
 * @param {Date} date the date to format
 * @param {boolean} [includeTime=false] `true` to format as a timestamp, `false` as just a date
 * @returns {string} the formatted date string
 * @alias module:format~iso8601Date
 */
export function iso8601Date(date, includeTime) {
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
 * @param {Date|number} date either a date to get the season for, or a number representing the UTC month of a date
 * @returns {number} a season constant number, from 0 - 3
 * @alias module:format~seasonForDate
 */
export function seasonForDate(date) {
	const m = date.getUTCMonth ? date.getUTCMonth() : Number(date);
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
