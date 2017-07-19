/** @module format */

import { utcFormat, utcParse, isoParse } from 'd3-time-format';

/**
 * Format a date into a SolarNet UTC timestamp format.
 * @function
 * @param {Date} date the date to format
 * @returns {string} the formatted date value - `yyyy-MM-dd HH:mm:ss.SSS'Z'`
 */
export const timestampFormat = utcFormat("%Y-%m-%d %H:%M:%S.%LZ");

/**
 * Format a date into a SolarNet UTC date/time format.
 * @function
 * @param {Date} date the date to format
 * @returns {string} the formatted date value - `yyyy-MM-dd HH:mm`
 */
export const dateTimeFormat = utcFormat("%Y-%m-%d %H:%M");

/**
 * Format a date into a SolarNet URL UTC date/time format.
 * @function
 * @param {Date} date the date to format
 * @returns {string} the formatted date value - `yyyy-MM-dd'T'HH:mm`
 */
export const dateTimeUrlFormat = utcFormat("%Y-%m-%dT%H:%M");

/**
 * Format a date into a SolarNet UTC date format.
 * @function
 * @param {Date} date the date to format
 * @returns {string} the formatted date value - `yyyy-MM-dd`
 */
export const dateFormat = utcFormat("%Y-%m-%d");

/**
 * Parse a SolarNet UTC timestamp value.
 * @function
 * @param {string} str the string to parse - `yyyy-MM-dd HH:mm:ss.SSS'Z'
 * @returns {Date} the parsed date, or `null`
 */
export const timestampParse = utcParse("%Y-%m-%d %H:%M:%S.%LZ");

/**
 * Parse a SolarNet UTC date/time.
 * @function
 * @param {string} str the string to parse - `yyyy-MM-dd HH:mm
 * @returns {Date} the parsed date, or `null`
 */
export const dateTimeParse = utcParse("%Y-%m-%d %H:%M");

export { 
	/**
	 * Parse a SolarNet URL UTC date/time value.
	 * @function
	 * @param {string} str the string to parse - `yyyy-MM-dd'T'HH:mm`
	 * @returns {Date} the parsed date, or `null`
	 */
	isoParse as dateTimeUrlParse, 
	
	/**
	 * Parse a SolarNet UTC date value.
	 * @function
	 * @param {string} str the string to parse - `yyyy-MM-dd`
	 * @returns {Date} the parsed date, or `null`
	 */
	isoParse as dateParse } from 'd3-time-format';

/**
 * Parse a UTC date string, from a variety of supported formats.
 *
 * @param {String} str the string to parse into a date
 * @returns {Date} the parsed `Date`, or `null` if the date can't be parsed
 */
export function dateParser(str) {
	var date = isoParse(str)
		|| timestampParse(str)
		|| dateTimeParse(str);
	return date;
}

/**
 * Format a date into an ISO 8601 timestamp or date string, in the UTC time zone.
 * 
 * @param {Date} date the date to format 
 * @param {boolean} [includeTime=false] `true` to format as a timestamp, `false` as just a date
 * @returns {string} the formatted date string
 */
export function iso8601Date(date, includeTime) {
	return ''+date.getUTCFullYear()
			+(date.getUTCMonth() < 9 ? '0' : '') +(date.getUTCMonth()+1)
			+(date.getUTCDate() < 10 ? '0' : '') + date.getUTCDate()
			+(includeTime ?
				'T'
				+(date.getUTCHours() < 10 ? '0' : '') + date.getUTCHours()
				+(date.getUTCMinutes() < 10 ? '0' : '') + date.getUTCMinutes()
				+(date.getUTCSeconds() < 10 ? '0' : '') +date.getUTCSeconds()
				+'Z'
				: '');
}
