import ComparableEnum from "../util/comparableEnum.js";
/**
 * An enumeration of supported aggregation names.
 */
var AggregationNames;
(function (AggregationNames) {
    /** One minute. */
    AggregationNames["Minute"] = "Minute";
    /** Five minute. */
    AggregationNames["FiveMinute"] = "FiveMinute";
    /** Ten minutes. */
    AggregationNames["TenMinute"] = "TenMinute";
    /** Fifteen minutes. */
    AggregationNames["FifteenMinute"] = "FifteenMinute";
    /** Thirty minutes. */
    AggregationNames["ThirtyMinute"] = "ThirtyMinute";
    /** One hour. */
    AggregationNames["Hour"] = "Hour";
    /** An hour of a day, from 1 to 24. */
    AggregationNames["HourOfDay"] = "HourOfDay";
    /** An hour of a day, further grouped into 4 yearly seasons. */
    AggregationNames["SeasonalHourOfDay"] = "SeasonalHourOfDay";
    /** A day. */
    AggregationNames["Day"] = "Day";
    /** A day of the week, from Monday - Sunday. */
    AggregationNames["DayOfWeek"] = "DayOfWeek";
    /** A day of the week, further grouped into 4 yearly seasons. */
    AggregationNames["SeasonalDayOfWeek"] = "SeasonalDayOfWeek";
    /** A week. */
    AggregationNames["Week"] = "Week";
    /** The week within a year, from 1 to 52. */
    AggregationNames["WeekOfYear"] = "WeekOfYear";
    /** A month. */
    AggregationNames["Month"] = "Month";
    /** A year. */
    AggregationNames["Year"] = "Year";
    /** A complete running total over a time span. */
    AggregationNames["RunningTotal"] = "RunningTotal";
})(AggregationNames || (AggregationNames = {}));
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
    constructor(name, level) {
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
    get level() {
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
 * The aggregation enum values array.
 */
const AggregationValues = Object.freeze([
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
 *
 * ```
 * import Aggregations from "solarnetwork-api-core";
 *
 * const hourly = Aggregations.Hour;
 * ```
 *
 * @see {@link Domain.AggregationNames} for the available values
 */
const Aggregations = Aggregation.enumsValue(AggregationValues);
export default Aggregations;
export { Aggregation, AggregationNames };
//# sourceMappingURL=aggregation.js.map