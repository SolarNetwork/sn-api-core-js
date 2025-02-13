import ComparableEnum from "../util/comparableEnum.js";
/**
 * An enumeration of supported aggregation names.
 */
declare enum AggregationNames {
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
    RunningTotal = "RunningTotal"
}
/**
 * A named aggregation.
 */
declare class Aggregation extends ComparableEnum {
    /**
     * Constructor.
     *
     * @param name - the unique name for this precision
     * @param level - a relative aggregation level value
     */
    constructor(name: string, level: number);
    /**
     * Get the aggregate level value.
     *
     * This is an alias for {@link Util.ComparableEnum#value}.
     */
    get level(): number;
    /**
     * @override
     * @inheritdoc
     */
    static enumValues(): readonly Aggregation[];
}
/**
 * A mapping of aggregation names to associated enum instances.
 */
type AggregationEnumsType = {
    [key in AggregationNames]: Aggregation;
};
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
declare const Aggregations: AggregationEnumsType;
export default Aggregations;
export { Aggregation, type AggregationEnumsType, AggregationNames };
//# sourceMappingURL=aggregation.d.ts.map