import {
    utcMinute,
    utcHour,
    utcDay,
    utcMonth,
    utcYear
} from 'd3-time';
import Aggregations from '../domain/aggregation';

/**
 * An object that defines levels of date range configuration.
 *  
 * @typedef {Object} module:util~DateRangeConfiguration
 * @property {number} [numHours] the number of hours to use
 * @property {number} [numDays] the number of days to use
 * @property {number} [numMonths] the number of months to use
 * @property {number} [numYears] the number of years to use
 */

/**
 * An object that defines a date range.
 *  
 * @typedef {Object} module:util~DateRange
 * @property {Date} start the starting date
 * @property {Date} end the ending date
 * @property {module:domain~Aggregation} timeUnit the time unit used by the date range
 * @property {number} timeCount the number of time units in the date range
 * @property {module:domain~Aggregation} aggregate the aggregate to query with
 */

/**
 * Get a query range appropriate for a given aggregate level.
 * 
 * Returns an object with `start` and `end` Date properties, using the given `endDate`
 * parameter as the basis for calculating the start as an offset backwards in time
 * based on the given `aggregate` level.
 * 
 * When `aggregateTimeCount` will be treated as a "next higher" aggregate level from
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
 * @param {module:domain~Aggregation} aggregate the aggregate level to get a query range for
 * @param {number|module:util~DateRangeConfiguration} aggregateTimeCount the number of aggregate time units to use
 * @param {Date} [endDate] the ending date; if not provided the current date will be used
 * @returns {module:util~DateRange} the calculated date range
 */
function rollingQueryDateRange(aggregate, aggregateTimeCount, endDate) {
    endDate = endDate || new Date();
	
	function exclusiveEndDate(interval, date) {
		var result = interval.ceil(date);
		if ( result.getTime() === date.getTime() ) {
			// already on exact aggregate, so round up to next
			result = interval.offset(result, 1);
		}
		return result;
	}
	
	function timeCountValue(propName) {
		var result;
		if ( isNaN(Number(aggregateTimeCount)) ) {
			if ( aggregateTimeCount[propName] !== undefined ) {
				result = Number(aggregateTimeCount[propName]);
			} else {
				result = 1;
			}
		} else {
			result = aggregateTimeCount;
		}
		if ( typeof result !== 'number' ) {
			result = 1;
		}
		return result;
	}

    var end,
        start,
        timeUnit,
        timeCount;

	if ( aggregate.compareTo(Aggregations.Hour) < 0 ) {
		timeCount = timeCountValue('numHours');
		timeUnit = Aggregations.Hour;
		end = exclusiveEndDate(utcMinute, endDate);
		let precision = Math.min(30, aggregate.level / 60);
		end.setUTCMinutes((end.getUTCMinutes() + precision - (end.getUTCMinutes() % precision)), 0, 0);
		start = utcHour.offset(end, -timeCount);
	} else if ( Aggregations.Month.equals(aggregate) ) {
		timeCount = timeCountValue('numYears');
		timeUnit = Aggregations.Year;
		end = exclusiveEndDate(utcMonth, endDate);
		start = utcYear.offset(utcMonth.floor(endDate), -timeCount);
	} else if ( Aggregations.Day.equals(aggregate) ) {
		timeCount = timeCountValue('numMonths');
		timeUnit = Aggregations.Month;
		end = exclusiveEndDate(utcDay, endDate);
		start = utcMonth.offset(utcDay.floor(endDate), -timeCount);
	} else {
		// assume Hour
		timeCount = timeCountValue('numDays');
		timeUnit = Aggregations.Day;
		end = exclusiveEndDate(utcHour, endDate);
		start = utcDay.offset(utcHour.floor(end), -timeCount);
	}
	return {
		start : start, 
		end : end, 
		timeUnit : timeUnit, 
        timeCount : timeCount,
        aggregate : aggregate
	};
}

export { rollingQueryDateRange };

export default {
    rollingQueryDateRange : rollingQueryDateRange,
}