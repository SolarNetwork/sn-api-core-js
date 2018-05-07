import ComparableEnum from '../util/comparableEnum';

/**
 * A named aggregation.
 * 
 * @extends module:util~ComparableEnum
 * @alias module:domain~Aggregation
 */
class Aggregation extends ComparableEnum {

	/**
     * Constructor.
     * 
     * @param {string} name the unique name for this precision 
     * @param {number} level a relative aggregation level value 
     */
    constructor(name, level) {
		super(name, level);
		if ( this.constructor === Aggregation ) {
			Object.freeze(this);
		}
    }

    /**
     * Get the aggregate level value.
	 * 
	 * This is an alias for {@link module:util~ComparableEnum#value}.
     */
    get level() {
        return this.value;
	}
	
	/**
	 * Get the {@link module:domain~Aggregations} values.
	 * 
	 * @override
	 * @inheritdoc
	 */
	static enumValues() {
		return AggregationValues;
	}

}


const AggregationValues = Object.freeze([
	new Aggregation('Minute', 60),
	new Aggregation('FiveMinute', 60 * 5),
	new Aggregation('TenMinute', 60 * 10),
	new Aggregation('FifteenMinute', 60 * 15),
	new Aggregation('ThirtyMinute', 60 * 30),
	new Aggregation('Hour', 3600),
	new Aggregation('HourOfDay', 3600),
	new Aggregation('SeasonalHourOfDay', 3600),
	new Aggregation('Day', 86400),
	new Aggregation('DayOfWeek', 86400),
	new Aggregation('SeasonalDayOfWeek', 86400),
	new Aggregation('Week', 604800),
	new Aggregation('WeekOfYear', 604800),
	new Aggregation('Month', 2419200),
	new Aggregation('Year', 31536000),
	new Aggregation('RunningTotal', Number.MAX_SAFE_INTEGER),
]);

/**
 * The enumeration of supported Aggregation values.
 * 
 * @readonly
 * @enum {module:domain~Aggregation}
 * @property {module:domain~Aggregation} Minute minute
 * @property {module:domain~Aggregation} FiveMinute 5 minutes
 * @property {module:domain~Aggregation} TenMinute 10 minutes
 * @property {module:domain~Aggregation} FifeteenMinute 15 minutes
 * @property {module:domain~Aggregation} ThirtyMinute 30 minutes
 * @property {module:domain~Aggregation} Hour an hour
 * @property {module:domain~Aggregation} HourOfDay an hour of a day, e.g. 1-24
 * @property {module:domain~Aggregation} SeasonalHourOfDay an hour of a day, further grouped into 4 seasons
 * @property {module:domain~Aggregation} Day a day
 * @property {module:domain~Aggregation} DayOfWeek a day of the week, e.g. Monday - Sunday
 * @property {module:domain~Aggregation} SeasonalDayOfWeek a day of the week, further grouped into 4 seasons
 * @property {module:domain~Aggregation} Week a week
 * @property {module:domain~Aggregation} WeekOfYear the week within a year, e.g. 1 - 52
 * @property {module:domain~Aggregation} Month a month
 * @property {module:domain~Aggregation} Year a year
 * @property {module:domain~Aggregation} RunningTotal a complete running total over a time span
 * @alias module:domain~Aggregations
 */
const Aggregations = Aggregation.enumsValue(AggregationValues);

export default Aggregations;
export { Aggregation };