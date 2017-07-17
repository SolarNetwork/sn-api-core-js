import { utcFormat, utcParse, isoParse } from 'd3-time-format';

export const timestampFormat = utcFormat("%Y-%m-%d %H:%M:%S.%LZ");

export const dateTimeFormat = utcFormat("%Y-%m-%d %H:%M");

export const dateTimeUrlFormat = utcFormat("%Y-%m-%dT%H:%M");

export const dateFormat = utcFormat("%Y-%m-%d");

export const timestampParse = utcParse("%Y-%m-%d %H:%M:%S.%LZ");

export const dateTimeParse = utcParse("%Y-%m-%d %H:%M");

export { isoParse as dateTimeUrlParse, isoParse as dateParse } from 'd3-time-format';

/**
 * Parse a UTC date string, from a variety of supported formats.
 *
 * @param {String} str the string to parse into a date
 * @returns {Date} the parsed <code>Date</code>, or <code>null</code> if the date can't be parsed
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
 * @param {boolean} [includeTime=false] <code>true</code> to format as a timestamp, <code>false</code> as just a date
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
