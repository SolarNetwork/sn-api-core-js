import ComparableEnum from 'comparableEnum';

/**
 * A named aggregation.
 * 
 * @extends ComparableEnum
 */
export class Aggregation extends ComparableEnum {

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
	 * This is an alias for {@link ComparableEnum#value}.
     */
    get level() {
        return this.value;
	}
	
	/**
	 * Get the {@link Aggregations} values.
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
	new Aggregation('RunningTotal', Number.MAX_SAFE_INTEGER),
]);

/**
 * The enumeration of supported Aggregation values.
 * 
 * @readonly
 * @enum {Aggregation}
 * @property {Aggregation} Minute minute
 * @property {Aggregation} FiveMinute 5 minutes
 * @property {Aggregation} TenMinute 10 minutes
 * @property {Aggregation} FifeteenMinute 15 minutes
 * @property {Aggregation} ThirtyMinute 30 minutes
 * @property {Aggregation} Hour an hour
 * @property {Aggregation} HourOfDay an hour of a day, e.g. 1-24
 * @property {Aggregation} SeasonalHourOfDay an hour of a day, further grouped into 4 seasons
 * @property {Aggregation} Day a day
 * @property {Aggregation} DayOfWeek a day of the week, e.g. Monday - Sunday
 * @property {Aggregation} SeasonalDayOfWeek a day of the week, further grouped into 4 seasons
 * @property {Aggregation} Week a week
 * @property {Aggregation} WeekOfYear the week within a year, e.g. 1 - 52
 * @property {Aggregation} Month a month
 * @property {Aggregation} RunningTotal a complete running total over a time span
 */
const Aggregations = Aggregation.enumsValue(AggregationValues);

export default Aggregations;
