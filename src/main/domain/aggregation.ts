import ComparableEnum from "../util/comparableEnum.js";

/**
 * An enumeration of supported aggregation names.
 */
enum AggregationNames {
	/** No aggregation. */
	None = "None",

	/** One minute. */
	Minute = "Minute",

	/** Five minute. */
	FiveMinute = "FiveMinute",

	/** Ten minutes. */
	TenMinute = "TenMinute",

	/** Fifteen minutes. */
	FifteenMinute = "FifteenMinute",

	/** Thirty minutes. */
	ThirtyMinute = "ThirtyMinute",

	/** One hour. */
	Hour = "Hour",

	/** An hour of a day, from 1 to 24. */
	HourOfDay = "HourOfDay",

	/** An hour of a day, further grouped into 4 yearly seasons. */
	SeasonalHourOfDay = "SeasonalHourOfDay",

	/** A day. */
	Day = "Day",

	/** A day of the week, from Monday - Sunday. */
	DayOfWeek = "DayOfWeek",

	/** A day of the week, further grouped into 4 yearly seasons. */
	SeasonalDayOfWeek = "SeasonalDayOfWeek",

	/** A week. */
	Week = "Week",

	/** The week within a year, from 1 to 52. */
	WeekOfYear = "WeekOfYear",

	/** A month. */
	Month = "Month",

	/** A year. */
	Year = "Year",

	/** A complete running total over a time span. */
	RunningTotal = "RunningTotal",
}

/**
 * A named aggregation.
 */
class Aggregation extends ComparableEnum {
	/**
	 * Constructor.
	 *
	 * @param name - the unique name for this precision
	 * @param level - a relative aggregation level value
	 */
	constructor(name: string, level: number) {
		super(name, level);
		if (this.constructor === Aggregation) {
			Object.freeze(this);
		}
	}

	/**
	 * Get the aggregate level value.
	 *
	 * This is an alias for {@link Util.ComparableEnum#value}.
	 */
	get level(): number {
		return this.value;
	}

	/**
	 * @override
	 * @inheritdoc
	 */
	static enumValues() {
		return AggregationValues;
	}
}

/**
 * A mapping of aggregation names to associated enum instances.
 */
type AggregationEnumsType = { [key in AggregationNames]: Aggregation };

/**
 * The aggregation enum values array.
 */
const AggregationValues = Object.freeze([
	new Aggregation(AggregationNames.None, 0),
	new Aggregation(AggregationNames.Minute, 60),
	new Aggregation(AggregationNames.FiveMinute, 60 * 5),
	new Aggregation(AggregationNames.TenMinute, 60 * 10),
	new Aggregation(AggregationNames.FifteenMinute, 60 * 15),
	new Aggregation(AggregationNames.ThirtyMinute, 60 * 30),
	new Aggregation(AggregationNames.Hour, 3600),
	new Aggregation(AggregationNames.HourOfDay, 3600),
	new Aggregation(AggregationNames.SeasonalHourOfDay, 3600),
	new Aggregation(AggregationNames.Day, 86400),
	new Aggregation(AggregationNames.DayOfWeek, 86400),
	new Aggregation(AggregationNames.SeasonalDayOfWeek, 86400),
	new Aggregation(AggregationNames.Week, 604800),
	new Aggregation(AggregationNames.WeekOfYear, 604800),
	new Aggregation(AggregationNames.Month, 2419200),
	new Aggregation(AggregationNames.Year, 31536000),
	new Aggregation(AggregationNames.RunningTotal, Number.MAX_SAFE_INTEGER),
]);

/**
 * The supported Aggregation values as an object mapping.
 *
 * Use this object like:
 *a
 * ```
 * import Aggregations from "solarnetwork-api-core";
 *
 * const hourly = Aggregations.Hour;
 * ```
 *
 * @see {@link Domain.AggregationNames} for the available values
 */
const Aggregations = Aggregation.enumsValue(
	AggregationValues
) as AggregationEnumsType;

export default Aggregations;
export { Aggregation, type AggregationEnumsType, AggregationNames };
