// https://github.com/SolarNetwork/sn-api-core-js Version 3.3.1-dev.0. Copyright 2025 SolarNetwork Foundation.
import { utcHour, utcYear, utcMonth, utcDay, utcMinute } from 'd3-time';
import { utcFormat, timeFormat, utcParse, isoParse } from 'd3-time-format';
import { max, ascending, sum } from 'd3-array';
import { nest } from 'd3-collection';
import Base64 from 'crypto-js/enc-base64.js';
import Hex from 'crypto-js/enc-hex.js';
import HmacSHA256 from 'crypto-js/hmac-sha256.js';
import SHA256 from 'crypto-js/sha256.js';
import { parse } from 'uri-js';
import { queue } from 'd3-queue';

/**
 * An enumerated object base class.
 *
 * @typeParam T the enum type
 * @public
 */
class Enum {
    #name;
    /**
     * Constructor.
     *
     * @param name - the name
     */
    constructor(name) {
        this.#name = name;
    }
    /**
     * Get the enum name.
     *
     * @returns the name
     */
    get name() {
        return this.#name;
    }
    /**
     * Test if a string is equal to this enum's name.
     *
     * As long as enum values are consistently obtained from the {@link Util.Enum.enumValues}
     * array then enum instances can be compared with `===`. If unsure, this method can be used
     * to compare string values instead.
     *
     * If `value` is passed as an actual Enum instance, then if that enum is the same class
     * as this enum it's `name` is compared to this instance's `name`.
     *
     * @param value - the value to test
     * @returns `true` if `value` is the same as this instance's `name` value
     */
    equals(value) {
        if (value && this.constructor === value.constructor) {
            return value.#name === this.#name;
        }
        return value === this.#name;
    }
    /**
     * Get all enum values.
     *
     * This method must be overridden by subclasses to return something meaningful.
     * This implementation returns an empty array.
     *
     * @abstract
     * @returns all enum values
     */
    static enumValues() {
        return [];
    }
    /**
     * This method takes an array of enums and turns them into a mapped object, using the enum
     * `name` as object property names.
     *
     * @param enums - the enum list to turn into a value object
     * @returns an object with enum `name` properties with associated enum values
     */
    static enumsValue(enums) {
        return Object.freeze(enums.reduce((obj, e) => {
            obj[e.name] = e;
            return obj;
        }, {}));
    }
    /**
     * Get an enum instance from its name.
     *
     * This method searches the {@link Util.Enum.enumValues} array for a matching value.
     *
     * @param name - the enum name to get an instnace for
     * @returns the instance, or `undefined` if no instance exists for the given `name`
     */
    static valueOf(name) {
        const enums = this.enumValues();
        if (!Array.isArray(enums)) {
            return undefined;
        }
        for (let i = 0, len = enums.length; i < len; i += 1) {
            if (name === enums[i].name) {
                return enums[i];
            }
        }
        return undefined;
    }
    /**
     * Get the names of a set of `Enum` instances.
     *
     * @param set - the set of `Enum` instances to get the names of
     * @returns array of `Enum` name values
     */
    static namesFor(set) {
        const result = [];
        if (set) {
            for (const e of set) {
                result.push(e.name);
            }
        }
        return result;
    }
}

/**
 * An immutable enum-like object with an associated comparable value.
 *
 * This class must be extended by another class that overrides the inerited
 * {@link Util.Enum.enumValues} method.
 *
 * @abstract
 */
class ComparableEnum extends Enum {
    #value;
    /**
     * Constructor.
     *
     * @param name - the name
     * @param value - the comparable value
     */
    constructor(name, value) {
        super(name);
        this.#value = value;
    }
    /**
     * Get the comparable value.
     *
     * @returns the value
     */
    get value() {
        return this.#value;
    }
    /**
     * Compare two ComparableEnum objects based on their `value` values.
     *
     * @param o - the object to compare to
     * @returns negative value, zero, or positive value if this instance is less than, equal to, or greater than `o`
     */
    compareTo(o) {
        if (this === o) {
            return 0;
        }
        else if (!o) {
            return 1;
        }
        return this.#value < o.#value ? -1 : this.#value > o.#value ? 1 : 0;
    }
    /**
     * Compute a complete set of enum values based on a minimum enum and/or set of enums.
     *
     * If `cache` is provided, then results computed via `minAggregation`
     * will be cached there, and subsequent calls will returned the cached result when appropriate.
     *
     * @param minEnum - a minimum enum value
     * @param cache - a cache of computed values
     * @returns the computed set, or `undefined` if no values match
     */
    static minimumEnumSet(minEnum, cache) {
        if (!minEnum) {
            return undefined;
        }
        let result = cache ? cache.get(minEnum.name) : undefined;
        if (result) {
            return result;
        }
        result = new Set();
        for (const agg of minEnum.constructor.enumValues()) {
            if (agg.compareTo(minEnum) > -1) {
                result.add(agg);
            }
        }
        if (cache) {
            cache.set(minEnum.name, result);
        }
        return result.size > 0 ? result : undefined;
    }
}

/**
 * An enumeration of supported aggregation names.
 */
var AggregationNames;
(function (AggregationNames) {
    /** No aggregation. */
    AggregationNames["None"] = "None";
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

/**
 * An enumeration of supported auth token status names.
 */
var AuthTokenStatusNames;
(function (AuthTokenStatusNames) {
    /** Active. */
    AuthTokenStatusNames["Active"] = "Active";
    /** Disabled. */
    AuthTokenStatusNames["Disabled"] = "Disabled";
})(AuthTokenStatusNames || (AuthTokenStatusNames = {}));
/**
 * An auth token status.
 */
class AuthTokenStatus extends Enum {
    /**
     * Constructor.
     *
     * @param name - the name
     */
    constructor(name) {
        super(name);
        if (this.constructor === AuthTokenStatus) {
            Object.freeze(this);
        }
    }
    /**
     * @inheritdoc
     */
    static enumValues() {
        return AuthTokenStatusValues;
    }
}
/**
 * The status enum values array.
 */
const AuthTokenStatusValues = Object.freeze([
    new AuthTokenStatus(AuthTokenStatusNames.Active),
    new AuthTokenStatus(AuthTokenStatusNames.Disabled),
]);
/**
 * The supported AuthTokenStatus values as an object mapping.
 * @see {@link Domain.AuthTokenStatusNames} for the available values
 */
const AuthTokenStatuses = AuthTokenStatus.enumsValue(AuthTokenStatusValues);

/**
 * An enumeration of supported auth token type names.
 */
var AuthTokenTypeNames;
(function (AuthTokenTypeNames) {
    /** ReadNodeData. */
    AuthTokenTypeNames["ReadNodeData"] = "ReadNodeData";
    /** User. */
    AuthTokenTypeNames["User"] = "User";
})(AuthTokenTypeNames || (AuthTokenTypeNames = {}));
/**
 * A named auth token type.
 */
class AuthTokenType extends Enum {
    /**
     * Constructor.
     *
     * @param name - the name
     */
    constructor(name) {
        super(name);
        if (this.constructor === AuthTokenType) {
            Object.freeze(this);
        }
    }
    /**
     * @override
     * @inheritdoc
     */
    static enumValues() {
        return AuthTokenTypeValues;
    }
}
/**
 * The auth token type enum values array.
 */
const AuthTokenTypeValues = Object.freeze([
    new AuthTokenType(AuthTokenTypeNames.ReadNodeData),
    new AuthTokenType(AuthTokenTypeNames.User),
]);
/**
 * The enumeration of supported AuthTokenType values.
 * @see {@link Domain.AuthTokenTypeNames} for the available values
 */
const AuthTokenTypes = AuthTokenType.enumsValue(AuthTokenTypeValues);

/**
 * An enumeration of supported combining type names.
 */
var CombiningTypeNames;
(function (CombiningTypeNames) {
    /** Average. */
    CombiningTypeNames["Average"] = "Average";
    /** Sum. */
    CombiningTypeNames["Sum"] = "Sum";
    /** Difference; note the order of mapped IDs is significant. */
    CombiningTypeNames["Difference"] = "Difference";
})(CombiningTypeNames || (CombiningTypeNames = {}));
/**
 * A named query combining action type.
 */
class CombiningType extends Enum {
    /**
     * Constructor.
     *
     * @param name - the unique name for this type
     */
    constructor(name) {
        super(name);
        if (this.constructor === CombiningType) {
            Object.freeze(this);
        }
    }
    /**
     * @override
     * @inheritdoc
     */
    static enumValues() {
        return CombiningTypeValues;
    }
}
/**
 * The combining type enum values array.
 */
const CombiningTypeValues = Object.freeze([
    new CombiningType(CombiningTypeNames.Average),
    new CombiningType(CombiningTypeNames.Sum),
    new CombiningType(CombiningTypeNames.Difference),
]);
/**
 * The enumeration of supported CombiningType values.
 * @see {@link Domain.CombiningTypeNames} for the available values
 */
const CombiningTypes = CombiningType.enumsValue(CombiningTypeValues);

function exclusiveEndDate(interval, date) {
    let result = interval.ceil(date);
    if (result.getTime() === date.getTime()) {
        // already on exact aggregate, so round up to next
        result = interval.offset(result, 1);
    }
    return result;
}
function timeCountValue(aggregateTimeCount, propName) {
    let result;
    if (typeof aggregateTimeCount === "number") {
        result = aggregateTimeCount;
    }
    else if (aggregateTimeCount) {
        if (aggregateTimeCount[propName] !== undefined) {
            result = Number(aggregateTimeCount[propName]);
        }
        else {
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
function rollingQueryDateRange(aggregate, aggregateTimeCount, endDate) {
    let end, start, timeUnit, timeCount;
    endDate = endDate || new Date();
    if (aggregate.compareTo(Aggregations.Hour) < 0) {
        timeCount = timeCountValue(aggregateTimeCount, "numHours");
        timeUnit = Aggregations.Hour;
        end = exclusiveEndDate(utcMinute, endDate);
        const precision = Math.min(30, aggregate.level / 60);
        end.setUTCMinutes(end.getUTCMinutes() + precision - (end.getUTCMinutes() % precision), 0, 0);
        start = utcHour.offset(end, -timeCount);
    }
    else if (Aggregations.Month.equals(aggregate)) {
        timeCount = timeCountValue(aggregateTimeCount, "numYears");
        timeUnit = Aggregations.Year;
        end = exclusiveEndDate(utcMonth, endDate);
        start = utcYear.offset(utcMonth.floor(endDate), -timeCount);
    }
    else if (Aggregations.Day.equals(aggregate)) {
        timeCount = timeCountValue(aggregateTimeCount, "numMonths");
        timeUnit = Aggregations.Month;
        end = exclusiveEndDate(utcDay, endDate);
        start = utcMonth.offset(utcDay.floor(endDate), -timeCount);
    }
    else {
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
const timestampFormat = utcFormat("%Y-%m-%d %H:%M:%S.%LZ");
/**
 * Format a date into a SolarNet UTC date/time format: `yyyy-MM-dd HH:mm`.
 */
const dateTimeFormat = utcFormat("%Y-%m-%d %H:%M");
/**
 * Format a date into a SolarNet URL UTC date/time format: `yyyy-MM-dd'T'HH:mm`.
 */
const dateTimeUrlFormat = utcFormat("%Y-%m-%dT%H:%M");
/**
 * Format a date into a SolarNet URL UTC date/time format: `yyyy-MM-dd'T'HH:mm`
 * or ``yyyy-MM-dd` if both the hours and minutes of the date are zero.
 * @param date the date to format
 * @returns the formatted date
 */
const dateUrlFormat = (date) => {
    if (date.getUTCHours() === 0 && date.getUTCMinutes() === 0) {
        return dateFormat(date);
    }
    return dateTimeUrlFormat(date);
};
/**
 * Format a date into a SolarNet URL local date/time format: `yyyy-MM-dd'T'HH:mm`.
 */
const localDateTimeUrlFormat = timeFormat("%Y-%m-%dT%H:%M");
/**
 * Format a date into a SolarNet URL local date/time format: `yyyy-MM-dd'T'HH:mm`
 * or ``yyyy-MM-dd` if both the hours and minutes of the date are zero.
 * @param date the date to format
 * @returns the formatted date
 */
const localDateUrlFormat = (date) => {
    if (date.getHours() === 0 && date.getMinutes() === 0) {
        return localDateFormat(date);
    }
    return localDateTimeUrlFormat(date);
};
/**
 * Format a date into a SolarNet UTC date format: `yyyy-MM-dd`.
 */
const dateFormat = utcFormat("%Y-%m-%d");
/**
 * Format a local date into a SolarNet date format: `yyyy-MM-dd`.
 */
const localDateFormat = timeFormat("%Y-%m-%d");
/**
 * Parse a SolarNet UTC timestamp value:  `yyyy-MM-dd HH:mm:ss.SSS'Z'.
 */
const timestampParse = utcParse("%Y-%m-%d %H:%M:%S.%LZ");
/**
 * Parse a SolarNet UTC date/time: `yyyy-MM-dd HH:mm.
 */
const dateTimeParse = utcParse("%Y-%m-%d %H:%M");
/**
 * Parse a SolarNet URL UTC date/time: `yyyy-MM-dd'T'HH:mm`.
 */
const dateTimeUrlParse = utcParse("%Y-%m-%dT%H:%M");
/**
 * Parse a SolarNet UTC date value: `yyyy-MM-dd`.
 */
const dateParse = utcParse("%Y-%m-%d");
/**
 * Parse a UTC date string, from a variety of supported formats.
 *
 * @param str - the string to parse into a date
 * @returns the parsed `Date`, or `null` if the date can't be parsed
 */
function dateParser(str) {
    return (timestampParse(str) ||
        dateTimeParse(str) ||
        dateTimeUrlParse(str) ||
        dateParse(str) ||
        isoParse(str));
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
function iso8601Date(date, includeTime) {
    return ("" +
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
            : ""));
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
function seasonForDate(date, local) {
    const m = date instanceof Date
        ? local
            ? date.getMonth()
            : date.getUTCMonth()
        : Number(date);
    if (m < 2 || m === 11) {
        return 3;
    }
    else if (m < 5) {
        return 0;
    }
    else if (m < 8) {
        return 1;
    }
    else {
        return 2;
    }
}

var dates = /*#__PURE__*/Object.freeze({
    __proto__: null,
    dateFormat: dateFormat,
    dateParse: dateParse,
    dateParser: dateParser,
    dateTimeFormat: dateTimeFormat,
    dateTimeParse: dateTimeParse,
    dateTimeUrlFormat: dateTimeUrlFormat,
    dateTimeUrlParse: dateTimeUrlParse,
    dateUrlFormat: dateUrlFormat,
    iso8601Date: iso8601Date,
    localDateFormat: localDateFormat,
    localDateParse: isoParse,
    localDateTimeUrlFormat: localDateTimeUrlFormat,
    localDateTimeUrlParse: isoParse,
    localDateUrlFormat: localDateUrlFormat,
    rollingQueryDateRange: rollingQueryDateRange,
    seasonForDate: seasonForDate,
    timestampFormat: timestampFormat,
    timestampParse: timestampParse
});

/**
 * A basic Datum class.
 */
class Datum {
    /** The datum creation/capture date. */
    created;
    /** The node's local date for the created time. */
    localDate;
    /** The node's local time for the created time. */
    localTime;
    /** The datum creation/capture date. */
    date;
    /** The node ID. */
    nodeId;
    /** The source ID. */
    sourceId;
    /** Optional tags. */
    tags;
    constructor(info) {
        Object.assign(this, info);
        this.date = dateParser(info.created) || new Date();
        this.created = info.created || timestampFormat(this.date);
        this.localDate = info.localDate;
        this.localTime = info.localTime;
        this.nodeId = info.nodeId;
        this.sourceId = info.sourceId;
        this.tags = info.tags;
    }
}

/**
 * An enumeration of supported datum auxiliary type names.
 */
var DatumAuxiliaryTypeNames;
(function (DatumAuxiliaryTypeNames) {
    /** Reset. */
    DatumAuxiliaryTypeNames["Reset"] = "Reset";
})(DatumAuxiliaryTypeNames || (DatumAuxiliaryTypeNames = {}));
/**
 * A datum auxiliary type.
 */
class DatumAuxiliaryType extends Enum {
    /**
     * Constructor.
     *
     * @param name - the unique name for this type
     */
    constructor(name) {
        super(name);
        if (this.constructor === DatumAuxiliaryType) {
            Object.freeze(this);
        }
    }
    /**
     * @override
     * @inheritdoc
     */
    static enumValues() {
        return DatumAuxiliaryTypeValues;
    }
}
/**
 * The datum auxiliary type enum values array.
 */
const DatumAuxiliaryTypeValues = Object.freeze([
    new DatumAuxiliaryType(DatumAuxiliaryTypeNames.Reset),
]);
/**
 * The enumeration of supported DatumAuxiliaryType values.
 * @see {@link Domain.DatumAuxiliaryTypeNames} for the available values
 */
const DatumAuxiliaryTypes = DatumAuxiliaryType.enumsValue(DatumAuxiliaryTypeValues);

/**
 * A pagination criteria object.
 */
class Pagination {
    #max;
    #offset;
    /**
     * Construct a pagination object.
     *
     * @param max - the maximum number of results to return
     * @param offset - the 0-based starting offset
     */
    constructor(max, offset) {
        this.#max = max !== undefined && max > 0 ? +max : 0;
        this.#offset = offset !== undefined && offset > 0 ? +offset : 0;
    }
    /**
     * Get the maximum number of results to return.
     *
     * @returns the maximum number of results
     */
    get max() {
        return this.#max;
    }
    /**
     * Get the results starting offset.
     *
     * The first available result starts at offset <code>0</code>. Note this is
     * a raw offset value, not a "page" offset.
     *
     * @returns the starting result offset
     */
    get offset() {
        return this.#offset;
    }
    /**
     * Copy constructor with a new `offset` value.
     *
     * @param offset the new offset to use
     * @returns a new instance
     */
    withOffset(offset) {
        return new Pagination(this.#max, offset);
    }
    /**
     * Get this object as a standard URI encoded (query parameters) string value.
     *
     * @returns the URI encoded string
     */
    toUriEncoding() {
        let result = "";
        if (this.max > 0) {
            result += "max=" + this.max;
        }
        if (this.offset > 0) {
            if (result.length > 0) {
                result += "&";
            }
            result += "offset=" + this.offset;
        }
        return result;
    }
}

/**
 * A description of a sort applied to a property of a collection.
 */
class SortDescriptor {
    #key;
    #descending;
    /**
     * Constructor.
     *
     * @param key - the property to sort on
     * @param descending - `true` to sort in descending order, `false` for ascending
     */
    constructor(key, descending) {
        this.#key = key;
        this.#descending = !!descending;
    }
    /**
     * Get the sort property name.
     *
     * @returns the sort key
     */
    get key() {
        return this.#key;
    }
    /**
     * Get the sorting direction.
     *
     * @returns `true` if descending order, `false` for ascending
     */
    get descending() {
        return this.#descending;
    }
    /**
     * Get this object as a standard URI encoded (query parameters) string value.
     *
     * If `index` is provided and non-negative, then the query parameters will
     * be encoded as an array property named `propertyName`. Otherwise just
     * bare `key` and `descending` properties will be used. The
     * `descending` property is only added if it is `true`.
     *
     * @param index - an optional array property index
     * @param propertyName - an optional array property name, only used if `index` is also provided;
     *                       defaults to `sorts`
     * @return the URI encoded string
     */
    toUriEncoding(index, propertyName) {
        const propName = propertyName || "sorts";
        let result;
        if (index !== undefined && index >= 0) {
            result = encodeURIComponent(propName + "[" + index + "].key") + "=";
        }
        else {
            result = "key=";
        }
        result += encodeURIComponent(this.key);
        if (this.descending) {
            if (index !== undefined && index >= 0) {
                result +=
                    "&" +
                        encodeURIComponent(propName + "[" + index + "].descending") +
                        "=true";
            }
            else {
                result += "&descending=true";
            }
        }
        return result;
    }
}

/**
 * A basic map-like object.
 *
 * This object includes some utility functions that make it well suited to using
 * as an API query object. For example, the {@link Util.PropMap.toUriEncoding}
 * method provides a way to serialize this object into URL query parameters.
 */
class PropMap {
    /**
     * The object that all properties are stored on.
     */
    props;
    /**
     * Constructor.
     * @param props the initial properties; if a `PropMap` instance is provided, the properties
     *     of that object will be copied into this one; otherwise the object will be
     *     used directly to hold property values
     */
    constructor(props) {
        this.props =
            props instanceof PropMap
                ? new Map(props.props)
                : props instanceof Map
                    ? new Map(props)
                    : typeof props === "object"
                        ? new Map(Object.entries(props))
                        : new Map();
    }
    /**
     * Get an iterator over the property entries.
     * @returns iterator over `[k, v]` values
     */
    [Symbol.iterator]() {
        return this.props[Symbol.iterator]();
    }
    /**
     * Get the number of properties configured.
     */
    get size() {
        return this.props.size;
    }
    prop(key, newValue) {
        if (newValue === undefined) {
            return this.props.get(key);
        }
        if (newValue === null) {
            this.props.delete(key);
        }
        else {
            this.props.set(key, newValue);
        }
        return this;
    }
    properties(newProps) {
        if (newProps) {
            for (const [k, v] of newProps instanceof Map
                ? newProps
                : Object.entries(newProps)) {
                this.prop(k, v);
            }
            return this;
        }
        return Object.fromEntries(this.props.entries());
    }
    /**
     * Get this object as a standard URI encoded (query parameters) string value.
     *
     * All enumerable properties of the <code>props</code> property will be added to the
     * result. If any property value is an array, the values of the array will be joined
     * by a comma. Any {@link Util.Enum} values will have their `name` property used.
     *
     * @param propertyName - an optional object property prefix to add to all properties
     * @param callbackFn - An optional function that will be called for each property.
     *                   The function will be passed property name and value arguments, and must
     *                   return either `undefined` to skip the property, a 2 or 3-element array with the
     *                   property name and value to use, and an optional boolean to force array
     *                   values to use mutliple parameter keys. Any other return value causes the
     *                   property to be used as-is.
     * @return the URI encoded string
     */
    toUriEncoding(propertyName, callbackFn) {
        let result = "";
        for (let [k, v] of this.props) {
            let forceMultiKey = false;
            if (callbackFn) {
                const kv = callbackFn(k, v);
                if (kv === undefined || kv === null) {
                    continue;
                }
                else if (Array.isArray(kv) && kv.length > 1) {
                    k = kv[0];
                    v = kv[1];
                    if (kv.length > 2) {
                        forceMultiKey = !!kv[2];
                    }
                }
            }
            if (result.length > 0) {
                result += "&";
            }
            if (v instanceof PropMap) {
                result += v.toUriEncoding(propertyName
                    ? encodeURIComponent(propertyName) + "." + k
                    : k, callbackFn);
                continue;
            }
            if (propertyName) {
                result += encodeURIComponent(propertyName) + ".";
            }
            result += encodeURIComponent(k) + "=";
            if (Array.isArray(v)) {
                v.forEach(function (e, i) {
                    if (i > 0) {
                        result += forceMultiKey
                            ? "&" + encodeURIComponent(k) + "="
                            : ",";
                    }
                    if (e instanceof Enum) {
                        e = e.name;
                    }
                    result += encodeURIComponent(e);
                });
            }
            else {
                if (v instanceof Enum) {
                    v = v.name;
                }
                result += encodeURIComponent(v);
            }
        }
        return result;
    }
    /**
     * Get this object as a standard URI encoded (query parameters) string value with
     * sorting and pagination parameters.
     *
     * This calls {@link Util.PropMap.toUriEncoding} first, then encodes
     * the `sorts` and `pagination` parameters, if provided.
     *
     * @param sorts - optional sort settings to use
     * @param pagination - optional pagination settings to use
     * @param propertyName - an optional object property prefix to add to all properties
     * @param callbackFn - An optional function that will be called for each property.
     *                   The function will be passed property name and value arguments, and must
     *                   return either `undefined` to skip the property, a 2-element array with the property
     *                   name and value to use, or anything else to use the property as-is.
     * @return the URI encoded string
     */
    toUriEncodingWithSorting(sorts, pagination, propertyName, callbackFn) {
        let params = this.toUriEncoding(propertyName, callbackFn);
        if (Array.isArray(sorts)) {
            sorts.forEach((sort, i) => {
                if (sort instanceof SortDescriptor) {
                    if (params.length > 0) {
                        params += "&";
                    }
                    params += sort.toUriEncoding(i);
                }
            });
        }
        if (pagination instanceof Pagination) {
            const paginationParams = pagination.toUriEncoding();
            if (paginationParams) {
                if (params.length > 0) {
                    params += "&";
                }
                params += paginationParams;
            }
        }
        return params;
    }
}

/** An enumeration of location property keys. */
var LocationKeys;
(function (LocationKeys) {
    LocationKeys["Country"] = "country";
    LocationKeys["Elevation"] = "elevation";
    LocationKeys["Latitude"] = "latitude";
    LocationKeys["ID"] = "id";
    LocationKeys["Locality"] = "locality";
    LocationKeys["Longitude"] = "longitude";
    LocationKeys["Name"] = "name";
    LocationKeys["PostalCode"] = "postalCode";
    LocationKeys["Region"] = "region";
    LocationKeys["StateOrProvince"] = "stateOrProvince";
    LocationKeys["Street"] = "street";
    LocationKeys["TimeZoneId"] = "timeZoneId";
})(LocationKeys || (LocationKeys = {}));
/** Sorted list of all location key values. */
const LocationPropertyNames = Object.values(LocationKeys).sort();
/** A set of location key values. */
const LocationPropertyNamesSet = new Set(LocationPropertyNames);
/**
 * A geographic location.
 */
class Location extends PropMap {
    /**
     * Constructor.
     *
     * @param loc - the location to copy properties from
     */
    constructor(loc) {
        super(loc);
    }
    /**
     * A SolarNetwork assigned unique identifier.
     */
    get id() {
        return this.prop(LocationKeys.ID);
    }
    set id(val) {
        this.prop(LocationKeys.ID, val);
    }
    /**
     * A generalized name, can be used for "virtual" locations.
     */
    get name() {
        return this.prop(LocationKeys.Name);
    }
    set name(val) {
        this.prop(LocationKeys.Name, val);
    }
    /**
     * An ISO 3166-1 alpha-2 character country code.
     */
    get country() {
        return this.prop(LocationKeys.Country);
    }
    set country(val) {
        this.prop(LocationKeys.Country, val);
    }
    /**
     * A country-specific regional identifier.
     */
    get region() {
        return this.prop(LocationKeys.Region);
    }
    set region(val) {
        this.prop(LocationKeys.Region, val);
    }
    /**
     * A country-specific state or province identifier.
     */
    get stateOrProvince() {
        return this.prop(LocationKeys.StateOrProvince);
    }
    set stateOrProvince(val) {
        this.prop(LocationKeys.StateOrProvince, val);
    }
    /**
     * Get the locality (city, town).
     */
    get locality() {
        return this.prop(LocationKeys.Locality);
    }
    set locality(val) {
        this.prop(LocationKeys.Locality, val);
    }
    /**
     * A country-specific postal code.
     */
    get postalCode() {
        return this.prop(LocationKeys.PostalCode);
    }
    set postalCode(val) {
        this.prop(LocationKeys.PostalCode, val);
    }
    /**
     * The street address.
     */
    get street() {
        return this.prop(LocationKeys.Street);
    }
    set street(val) {
        this.prop(LocationKeys.Street, val);
    }
    /**
     * The decimal world latitude.
     */
    get latitude() {
        return this.prop(LocationKeys.Latitude);
    }
    set latitude(val) {
        this.prop(LocationKeys.Latitude, val);
    }
    /**
     * The decimal world longitude.
     */
    get longitude() {
        return this.prop(LocationKeys.Longitude);
    }
    set longitude(val) {
        this.prop(LocationKeys.Longitude, val);
    }
    /**
     * The elevation above sea level, in meters.
     */
    get elevation() {
        return this.prop(LocationKeys.Elevation);
    }
    set elevation(val) {
        this.prop(LocationKeys.Elevation, val);
    }
    /**
     * A time zone ID, for example `Pacific/Auckland`.
     */
    get timeZoneId() {
        return this.prop(LocationKeys.TimeZoneId);
    }
    set timeZoneId(val) {
        this.prop(LocationKeys.TimeZoneId, val);
    }
}

/**
 * An immutable enum-like object with an associated key value.
 *
 * This class must be extended by another class that overrides the
 * inerited {@link Util.Enum.enumValues} method.
 */
class KeyedEnum extends Enum {
    /** The key value. */
    #key;
    /**
     * Constructor.
     *
     * @param name - the unique name for this type
     * @param key - the key value associated with this type
     */
    constructor(name, key) {
        super(name);
        this.#key = key;
    }
    /**
     * Get the key value.
     *
     * @returns the key value
     */
    get key() {
        return this.#key;
    }
    /**
     * Get an enum instance from its key or name.
     *
     * This method searches the {@link Util.Enum.enumValues} array for a matching key or name value.
     *
     * @param value - the enum key or name to get the enum instance for
     * @returns the matching enum value, or `undefined` if no values match
     */
    static valueOf(value) {
        const enums = this.enumValues();
        if (!Array.isArray(enums)) {
            return undefined;
        }
        for (let i = 0, len = enums.length; i < len; i += 1) {
            if (value === enums[i].key) {
                return enums[i];
            }
            else if (value === enums[i].name) {
                return enums[i];
            }
        }
        return undefined;
    }
}

/**
 * An enumeration of supported datum rollup type names.
 */
var DatumRollupTypeNames;
(function (DatumRollupTypeNames) {
    /**
     * No rollup.
     */
    DatumRollupTypeNames["None"] = "None";
    /**
     * Rollup everything into a single result.
     */
    DatumRollupTypeNames["All"] = "All";
    /**
     * Rollup the time component of the results.
     */
    DatumRollupTypeNames["Time"] = "Time";
    /**
     * Rollup the node component of the results.
     */
    DatumRollupTypeNames["Node"] = "Node";
    /**
     * Rollup the source component of the results.
     */
    DatumRollupTypeNames["Source"] = "Source";
})(DatumRollupTypeNames || (DatumRollupTypeNames = {}));
/**
 * An enumeration of datum reading types.
 */
class DatumRollupType extends KeyedEnum {
    /**
     * Constructor.
     *
     * @param name - the unique name for this type
     * @param key - the key value associated with this type
     */
    constructor(name, key) {
        super(name, key);
        if (this.constructor === DatumRollupType) {
            Object.freeze(this);
        }
    }
    /**
     * @override
     * @inheritdoc
     */
    static enumValues() {
        return DatumRollupTypeValues;
    }
}
/**
 * The datum reading type enum values array.
 */
const DatumRollupTypeValues = Object.freeze([
    new DatumRollupType(DatumRollupTypeNames.None, "0"),
    new DatumRollupType(DatumRollupTypeNames.All, "a"),
    new DatumRollupType(DatumRollupTypeNames.Time, "t"),
    new DatumRollupType(DatumRollupTypeNames.Node, "n"),
    new DatumRollupType(DatumRollupTypeNames.Source, "s"),
]);
/**
 * The enumeration of supported `DatumRollupType` values.
 * @see {@link Domain.DatumRollupTypeNames} for the available values
 */
const DatumRollupTypes = DatumRollupType.enumsValue(DatumRollupTypeValues);

/** An enumeration of datum filter keys. */
var DatumFilterKeys;
(function (DatumFilterKeys) {
    DatumFilterKeys["AccumulatingPropertyName"] = "accumulatingPropertyName";
    DatumFilterKeys["AccumulatingPropertyNames"] = "accumulatingPropertyNames";
    DatumFilterKeys["Aggregation"] = "aggregation";
    DatumFilterKeys["CombiningType"] = "combiningType";
    DatumFilterKeys["DataPath"] = "dataPath";
    DatumFilterKeys["EndDate"] = "endDate";
    DatumFilterKeys["InstantaneousPropertyName"] = "instantaneousPropertyName";
    DatumFilterKeys["InstantaneousPropertyNames"] = "instantaneousPropertyNames";
    DatumFilterKeys["LocalEndDate"] = "localEndDate";
    DatumFilterKeys["LocalStartDate"] = "localStartDate";
    DatumFilterKeys["LocationId"] = "locationId";
    DatumFilterKeys["LocationIds"] = "locationIds";
    DatumFilterKeys["Location"] = "location";
    DatumFilterKeys["MetadataFilter"] = "metadataFilter";
    DatumFilterKeys["MostRecent"] = "mostRecent";
    DatumFilterKeys["NodeIdMaps"] = "nodeIdMaps";
    DatumFilterKeys["NodeId"] = "nodeId";
    DatumFilterKeys["NodeIds"] = "nodeIds";
    DatumFilterKeys["PartialAggregation"] = "partialAggregation";
    DatumFilterKeys["PropertyName"] = "propertyName";
    DatumFilterKeys["PropertyNames"] = "propertyNames";
    DatumFilterKeys["Query"] = "query";
    DatumFilterKeys["RollupType"] = "rollupType";
    DatumFilterKeys["RollupTypes"] = "rollupTypes";
    DatumFilterKeys["SourceIdMaps"] = "sourceIdMaps";
    DatumFilterKeys["SourceId"] = "sourceId";
    DatumFilterKeys["SourceIds"] = "sourceIds";
    DatumFilterKeys["StartDate"] = "startDate";
    DatumFilterKeys["StatusPropertyName"] = "statusPropertyName";
    DatumFilterKeys["StatusPropertyNames"] = "statusPropertyNames";
    DatumFilterKeys["StreamIds"] = "streamIds";
    DatumFilterKeys["Tags"] = "tags";
    DatumFilterKeys["UserId"] = "userId";
    DatumFilterKeys["UserIds"] = "userIds";
    DatumFilterKeys["WithoutTotalResultsCount"] = "withoutTotalResultsCount";
})(DatumFilterKeys || (DatumFilterKeys = {}));
/** Sorted list of all datum filter key values. */
const DatumFilterPropertyNames = Object.values(DatumFilterKeys).sort();
/** A set of datum filter key values. */
const DatumFilterPropertyNamesSet = new Set(DatumFilterPropertyNames);
/**
 * Combine an ID map into a query parameter.
 * @param map - ID mapping
 * @returns the query parameter value, or `undefined` if no mapping available
 * @private
 */
function idMapQueryParameterValue(map) {
    if (!(map instanceof Map && map.size > 0)) {
        return undefined;
    }
    const result = [];
    for (const e of map) {
        if (!(e[1] instanceof Set)) {
            continue;
        }
        result.push(`${e[0]}:${Array.from(e[1]).join(",")}`);
    }
    return result;
}
/**
 * A filter criteria object for datum.
 *
 * This filter is used to query both node datum and location datum. Not all properties are
 * applicable to both types. Be sure to consult the SolarNet API documentation on the
 * supported properties for each type.
 */
class DatumFilter extends PropMap {
    /**
     * Constructor.
     * @param props - initial property values
     */
    constructor(props) {
        super(props);
        this.#cleanupSingularProperties();
    }
    #cleanupSingularProperties() {
        if (this.size < 1) {
            return;
        }
    }
    /**
     * A node ID.
     *
     * This manages the first available node ID from the `nodeIds` property.
     * Set to `null` to remove.
     */
    get nodeId() {
        const nodeIds = this.nodeIds;
        return Array.isArray(nodeIds) && nodeIds.length > 0
            ? nodeIds[0]
            : undefined;
    }
    set nodeId(nodeId) {
        if (typeof nodeId === "number") {
            this.nodeIds = [nodeId];
        }
        else {
            this.nodeIds = null;
        }
    }
    /**
     * An array of node IDs. Set to `null` to remove.
     */
    get nodeIds() {
        return this.prop(DatumFilterKeys.NodeIds);
    }
    set nodeIds(nodeIds) {
        this.prop(DatumFilterKeys.NodeIds, Array.isArray(nodeIds) ? nodeIds : null);
    }
    /**
     * A location ID.
     *
     * This manages the first available location ID from the `locationIds` property.
     * Set to `null` to remove.
     */
    get locationId() {
        const locationIds = this.locationIds;
        return Array.isArray(locationIds) && locationIds.length > 0
            ? locationIds[0]
            : undefined;
    }
    set locationId(locationId) {
        if (typeof locationId === "number") {
            this.locationIds = [locationId];
        }
        else {
            this.locationIds = null;
        }
    }
    /**
     * An array of location IDs. Set to `null` to remove.
     */
    get locationIds() {
        return this.prop(DatumFilterKeys.LocationIds);
    }
    set locationIds(locationIds) {
        this.prop(DatumFilterKeys.LocationIds, Array.isArray(locationIds) ? locationIds : null);
    }
    /**
     * A source ID.
     *
     * This manages the first available source ID from the `sourceIds` property.
     * Set to `null` to remove.
     */
    get sourceId() {
        const sourceIds = this.sourceIds;
        return Array.isArray(sourceIds) && sourceIds.length > 0
            ? sourceIds[0]
            : undefined;
    }
    set sourceId(sourceId) {
        if (sourceId) {
            this.sourceIds = [sourceId];
        }
        else {
            this.sourceIds = null;
        }
    }
    /**
     * An array of source IDs. Set to `null` to remove.
     */
    get sourceIds() {
        return this.prop(DatumFilterKeys.SourceIds);
    }
    set sourceIds(sourceIds) {
        this.prop(DatumFilterKeys.SourceIds, Array.isArray(sourceIds) ? sourceIds : null);
    }
    /**
     * A stream ID.
     *
     * This manages the first available stream ID from the `streamIds` property.
     * Set to `null` to remove.
     */
    get streamId() {
        const streamIds = this.streamIds;
        return Array.isArray(streamIds) && streamIds.length > 0
            ? streamIds[0]
            : undefined;
    }
    set streamId(streamId) {
        if (streamId) {
            this.streamIds = [streamId];
        }
        else {
            this.streamIds = null;
        }
    }
    /**
     * An array of stream IDs. Set to `null` to remove.
     */
    get streamIds() {
        return this.prop(DatumFilterKeys.StreamIds);
    }
    set streamIds(streamIds) {
        this.prop(DatumFilterKeys.StreamIds, Array.isArray(streamIds) ? streamIds : null);
    }
    /**
     * A user ID.
     *
     * This manages the first available location ID from the `userIds` property.
     * Set to `null` to remove.
     */
    get userId() {
        const userIds = this.userIds;
        return Array.isArray(userIds) && userIds.length > 0
            ? userIds[0]
            : undefined;
    }
    set userId(userId) {
        if (userId) {
            this.userIds = [userId];
        }
        else {
            this.userIds = null;
        }
    }
    /**
     * An array of user IDs. Set to `null` to remove.
     */
    get userIds() {
        return this.prop(DatumFilterKeys.UserIds);
    }
    set userIds(userIds) {
        this.prop(DatumFilterKeys.UserIds, Array.isArray(userIds) ? userIds : null);
    }
    /**
     * The "most recent" flag. Set to `null` to remove.
     */
    get mostRecent() {
        return !!this.prop(DatumFilterKeys.MostRecent);
    }
    set mostRecent(value) {
        this.prop(DatumFilterKeys.MostRecent, !!value);
    }
    /**
     * A minimumin date. Set to `null` to remove.
     */
    get startDate() {
        return this.prop(DatumFilterKeys.StartDate);
    }
    set startDate(date) {
        this.prop(DatumFilterKeys.StartDate, date && !isNaN(date.getTime()) ? date : null);
    }
    /**
     * A maximum date. Set to `null` to remove.
     */
    get endDate() {
        return this.prop(DatumFilterKeys.EndDate);
    }
    set endDate(date) {
        this.prop(DatumFilterKeys.EndDate, date && !isNaN(date.getTime()) ? date : null);
    }
    /**
     * Alocal minimumin date. Set to `null` to remove.
     */
    get localStartDate() {
        return this.prop(DatumFilterKeys.LocalStartDate);
    }
    set localStartDate(date) {
        this.prop(DatumFilterKeys.LocalStartDate, date && !isNaN(date.getTime()) ? date : null);
    }
    /**
     * A local maximum date. Set to `null` to remove.
     */
    get localEndDate() {
        return this.prop(DatumFilterKeys.LocalEndDate);
    }
    set localEndDate(date) {
        this.prop(DatumFilterKeys.LocalEndDate, date && !isNaN(date.getTime()) ? date : null);
    }
    /**
     * A data path, in dot-delimited notation like `i.watts`.
     * Set to `null` to remove.
     */
    get dataPath() {
        return this.prop(DatumFilterKeys.DataPath);
    }
    set dataPath(path) {
        this.prop(DatumFilterKeys.DataPath, path);
    }
    /**
     * An aggregation.
     *
     * Including this in a filter will cause SolarNet to return aggregated results, rather
     * than raw results. Set to `null` to remove.
     */
    get aggregation() {
        return this.prop(DatumFilterKeys.Aggregation);
    }
    set aggregation(agg) {
        this.prop(DatumFilterKeys.Aggregation, agg instanceof Aggregation ? agg : null);
    }
    /**
     * A partial aggregation.
     *
     * Including this in a filter along with `aggregation`  will cause SolarNet to return aggregated results that
     * include partial results of this granularity. For example if `aggregation == 'Month'` and
     * `partialAggregation == 'Day'` and a date range of 15 Jan - 15 Mar was requested, 3 month results would
     * be returned for the date ranges 15 Jan - 31 Jan, 1 Feb - 28 Feb, and 1 Mar - 14 Mar.
     *
     * Set to `null` to remove.
     */
    get partialAggregation() {
        return this.prop(DatumFilterKeys.PartialAggregation);
    }
    set partialAggregation(agg) {
        this.prop(DatumFilterKeys.PartialAggregation, agg instanceof Aggregation ? agg : null);
    }
    /**
     * An array of tags. Set to `null` to remove.
     */
    get tags() {
        return this.prop(DatumFilterKeys.Tags);
    }
    set tags(val) {
        this.prop(DatumFilterKeys.Tags, Array.isArray(val) ? val : null);
    }
    /**
     * A location, used as an example-based search criteria. Set to `null` to remove.
     */
    get location() {
        return this.prop(DatumFilterKeys.Location);
    }
    set location(val) {
        this.prop(DatumFilterKeys.Location, val instanceof Location ? val : null);
    }
    /**
     * A general full-text style query string. Set to `null` to remove.
     */
    get query() {
        return this.prop(DatumFilterKeys.Query);
    }
    set query(val) {
        this.prop(DatumFilterKeys.Query, val);
    }
    /**
     * A metadata filter (LDAP style search criteria). Set to `null` to remove.
     */
    get metadataFilter() {
        return this.prop(DatumFilterKeys.MetadataFilter);
    }
    set metadataFilter(val) {
        this.prop(DatumFilterKeys.MetadataFilter, val);
    }
    /**
     * Get the _without total results_ flag. Set to `null` to remove.
     */
    get withoutTotalResultsCount() {
        return this.prop(DatumFilterKeys.WithoutTotalResultsCount);
    }
    set withoutTotalResultsCount(val) {
        this.prop(DatumFilterKeys.WithoutTotalResultsCount, val !== null ? !!val : null);
    }
    /**
     * Get the combining type.
     *
     * Use this to combine nodes and/or sources into virtual groups. Requires some combination
     * of {@link Domain.DatumFilter#nodeIdMaps} or {@link Domain.DatumFilter#sourceIdMaps} also be specified.
     * Set to `null` to remove.
     */
    get combiningType() {
        return this.prop(DatumFilterKeys.CombiningType);
    }
    set combiningType(type) {
        this.prop(DatumFilterKeys.CombiningType, type instanceof CombiningType ? type : null);
    }
    /**
     * A mapping of virtual node IDs to sets of real node IDs to combine. Set to `null` to remove.
     */
    get nodeIdMaps() {
        return this.prop(DatumFilterKeys.NodeIdMaps);
    }
    set nodeIdMaps(map) {
        this.prop(DatumFilterKeys.NodeIdMaps, map instanceof Map ? map : null);
    }
    /**
     * A mapping of virtual source IDs to sets of real source IDs to combine. Set to `null` to remove.
     */
    get sourceIdMaps() {
        return this.prop(DatumFilterKeys.SourceIdMaps);
    }
    set sourceIdMaps(map) {
        this.prop(DatumFilterKeys.SourceIdMaps, map instanceof Map ? map : null);
    }
    /**
     * Get the rollup type.
     *
     * Use this with reading queries on aggregate values to rollup the results.
     * Set to `null` to remove.
     */
    get rollupType() {
        const rollups = this.rollupTypes;
        return Array.isArray(rollups) && rollups.length > 0
            ? rollups[0]
            : undefined;
    }
    set rollupType(rollup) {
        if (rollup instanceof DatumRollupType) {
            this.rollupTypes = [rollup];
        }
        else {
            this.rollupTypes = null;
        }
    }
    /**
     * An array of rollup types. Set to `null` to remove.
     */
    get rollupTypes() {
        return this.prop(DatumFilterKeys.RollupTypes);
    }
    set rollupTypes(rollups) {
        this.prop(DatumFilterKeys.RollupTypes, Array.isArray(rollups) ? rollups : null);
    }
    /**
     * A property name.
     *
     * This manages the first available value from the `propertyNames` property.
     * Set to `null` to remove.
     */
    get propertyName() {
        const names = this.propertyNames;
        return Array.isArray(names) && names.length > 0 ? names[0] : undefined;
    }
    set propertyName(name) {
        if (name) {
            this.propertyNames = [name];
        }
        else {
            this.propertyNames = null;
        }
    }
    /**
     * An array of property names. Set to `null` to remove.
     */
    get propertyNames() {
        return this.prop(DatumFilterKeys.PropertyNames);
    }
    set propertyNames(names) {
        this.prop(DatumFilterKeys.PropertyNames, Array.isArray(names) ? names : null);
    }
    /**
     * An instantaneous property name.
     *
     * This manages the first available value from the `instantaneousPropertyNames` property.
     * Set to `null` to remove.
     */
    get instantaneousPropertyName() {
        const names = this.instantaneousPropertyNames;
        return Array.isArray(names) && names.length > 0 ? names[0] : undefined;
    }
    set instantaneousPropertyName(name) {
        if (name) {
            this.instantaneousPropertyNames = [name];
        }
        else {
            this.instantaneousPropertyNames = null;
        }
    }
    /**
     * An array of instantaneous property names. Set to `null` to remove.
     */
    get instantaneousPropertyNames() {
        return this.prop(DatumFilterKeys.InstantaneousPropertyNames);
    }
    set instantaneousPropertyNames(names) {
        this.prop(DatumFilterKeys.InstantaneousPropertyNames, Array.isArray(names) ? names : null);
    }
    /**
     * An accumulating property name.
     *
     * This manages the first available value from the `accumulatingPropertyNames` property.
     * Set to `null` to remove.
     */
    get accumulatingPropertyName() {
        const names = this.accumulatingPropertyNames;
        return Array.isArray(names) && names.length > 0 ? names[0] : undefined;
    }
    set accumulatingPropertyName(name) {
        if (name) {
            this.accumulatingPropertyNames = [name];
        }
        else {
            this.accumulatingPropertyNames = null;
        }
    }
    /**
     * An array of accumulating property names. Set to `null` to remove.
     */
    get accumulatingPropertyNames() {
        return this.prop(DatumFilterKeys.AccumulatingPropertyNames);
    }
    set accumulatingPropertyNames(names) {
        this.prop(DatumFilterKeys.AccumulatingPropertyNames, Array.isArray(names) ? names : null);
    }
    /**
     * A property name.
     *
     * This manages the first available value from the `statusPropertyNames` property.
     * Set to `null` to remove.
     */
    get statusPropertyName() {
        const names = this.statusPropertyNames;
        return Array.isArray(names) && names.length > 0 ? names[0] : undefined;
    }
    set statusPropertyName(name) {
        if (name) {
            this.statusPropertyNames = [name];
        }
        else {
            this.statusPropertyNames = null;
        }
    }
    /**
     * An array of property names. Set to `null` to remove.
     */
    get statusPropertyNames() {
        return this.prop(DatumFilterKeys.StatusPropertyNames);
    }
    set statusPropertyNames(names) {
        this.prop(DatumFilterKeys.StatusPropertyNames, Array.isArray(names) ? names : null);
    }
    /**
     * @override
     * @inheritdoc
     */
    toUriEncoding(propertyName, callbackFn) {
        return super.toUriEncoding(propertyName, callbackFn || datumFilterUriEncodingPropertyMapper);
    }
}
/**
 * Map DatumFilter properties for URI encoding.
 *
 * @param key - the property key
 * @param value - the property value
 * @returns 2 or 3-element array for mapped key+value+forced-multi-key, `null` to skip, or `key` to keep as-is
 * @private
 */
function datumFilterUriEncodingPropertyMapper(key, value) {
    if (key === DatumFilterKeys.NodeIds ||
        key === DatumFilterKeys.LocationIds ||
        key === DatumFilterKeys.RollupTypes ||
        key === DatumFilterKeys.SourceIds ||
        key === DatumFilterKeys.UserIds ||
        key === DatumFilterKeys.PropertyNames ||
        key === DatumFilterKeys.InstantaneousPropertyNames ||
        key === DatumFilterKeys.AccumulatingPropertyNames ||
        key === DatumFilterKeys.StatusPropertyNames) {
        // check for singleton array value, and re-map to singular property by chopping of "s"
        if (Array.isArray(value) && value.length === 1) {
            return [key.substring(0, key.length - 1), value[0]];
        }
    }
    else if (key === DatumFilterKeys.StartDate ||
        key === DatumFilterKeys.EndDate) {
        return [key, dateUrlFormat(value)];
    }
    else if (key === DatumFilterKeys.LocalStartDate ||
        key === DatumFilterKeys.LocalEndDate) {
        return [key, localDateUrlFormat(value)];
    }
    else if (key === DatumFilterKeys.MostRecent && !value) {
        return null;
    }
    else if (key === DatumFilterKeys.NodeIdMaps ||
        key === DatumFilterKeys.SourceIdMaps) {
        const p = idMapQueryParameterValue(value);
        return p ? [key, p, true] : null;
    }
    return key;
}

/**
 * An enumeration of supported datum stream type names.
 */
var DatumStreamTypeNames;
(function (DatumStreamTypeNames) {
    /** Node. */
    DatumStreamTypeNames["Node"] = "Node";
    /** Location. */
    DatumStreamTypeNames["Location"] = "Location";
})(DatumStreamTypeNames || (DatumStreamTypeNames = {}));
/**
 * An enumeration of datum stream types.
 */
class DatumStreamType extends KeyedEnum {
    /**
     * Constructor.
     *
     * @param name - the unique name for this type
     * @param key - the key value associated with this type
     */
    constructor(name, key) {
        super(name, key);
    }
    /**
     * @override
     * @inheritdoc
     */
    static enumValues() {
        return DatumStreamTypeValues;
    }
}
/**
 * The datum stream type enum values array.
 */
const DatumStreamTypeValues = Object.freeze([
    new DatumStreamType(DatumStreamTypeNames.Node, "n"),
    new DatumStreamType(DatumStreamTypeNames.Location, "l"),
]);
/**
 * The enumeration of supported `DatumStreamType` values.
 * @see {@link Domain.DatumStreamTypeNames} for the available values
 */
const DatumStreamTypes = DatumStreamType.enumsValue(DatumStreamTypeValues);

/**
 * A general datum identifier class.
 *
 * A datum identifier must be _fully specified_ to be valid. A fully specified identifier
 * must meet either of these requirements (in addition to having `kind` and `timestamp` values):
 *
 *  * a `streamId` value
 *  * both `objectId` and `sourceId` values
 *
 * The `objectId` plus `sourceId` values together represent an _alias_ for the `streamId`.
 *
 * The absence of an `aggregation` implies "no aggregation", or the `None` aggregation value.
 *
 * Create instances of this class like:
 *
 * ```
 * import { Aggregations, DatumIdentifier } from "solarnetwork-api-core";
 *
 * const ts = new Date();
 * const streamId = "7714f762-2361-4ec2-98ab-7e96807b32a6";
 * const sourceId = "meter/1";
 * const nodeId = 123;
 * const agg = Aggregations.None;
 *
 * // create a node stream style identifier
 * let ident = DatumIdentifier.nodeId(ts, streamId);
 *
 * // create a node and source style identifier
 * let ident = DatumIdentifier.nodeId(ts, sourceId, nodeId);
 *
 * // create a full stream and node and source style identifier
 * let ident = DatumIdentifier.nodeId(ts, sourceId, nodeId, agg, streamId);
 * ```
 */
class DatumIdentifier {
    /** The datum stream kind (node, location). */
    kind;
    /** The datum creation/capture date. */
    timestamp;
    /** The datum stream ID. */
    streamId;
    /** The object ID (node, location). */
    objectId;
    /** The source ID. */
    sourceId;
    /** The aggregation. */
    aggregation;
    /**
     * Constructor.
     *
     * @param kind the datum kind, or kind key or name value
     * @param timestamp the datum timestamp, either as a `Date` instance or a form suitable for constructing as `new Date(ts)`
     * @param streamOrSourceId the datum stream ID, if `objectId` is not a `number`; otherwise the source ID
     * @param objectIdOrAgg the datum object ID or an aggregation
     * @param aggregation the aggregation
     * @param streamId if `streamOrSourceId` and `objectIdOrAgg` are treated as source and object IDs, respectively,
     *                 then the stream ID can be provided explicitly so all ID values are included
     */
    constructor(kind, timestamp, streamOrSourceId, objectIdOrAgg, aggregation, streamId) {
        const k = kind instanceof DatumStreamType
            ? kind
            : DatumStreamType.valueOf(kind);
        this.kind = k !== undefined ? k : DatumStreamTypes.Node;
        // if a string date provided but the string is not a valid date set timestamp to undefined
        const ts = timestamp instanceof Date ? timestamp : new Date(timestamp);
        this.timestamp = !isNaN(ts.getTime()) ? ts : undefined;
        if (typeof objectIdOrAgg === "number") {
            this.sourceId = streamOrSourceId;
            this.objectId = objectIdOrAgg;
            this.aggregation =
                aggregation instanceof Aggregation ? aggregation : undefined;
            this.streamId = streamId;
        }
        else {
            this.streamId = streamOrSourceId;
            this.aggregation =
                objectIdOrAgg instanceof Aggregation
                    ? objectIdOrAgg
                    : aggregation !== undefined
                        ? aggregation
                        : undefined;
        }
        if (this.constructor === DatumIdentifier) {
            Object.freeze(this);
        }
    }
    /**
     * Test if this identifier is fully specified.
     *
     * A datum identifier is considered fully specified if all of the following are true:
     *
     *  * the `kind` and `timestamp` properties are defined
     *  * the `streamId` property is defined, **or** both the `objectId` and `sourceId` properties are defined
     *
     * In essence, there are two _styles_ of datum identifier:
     *
     *  1. using a stream ID
     *  2. using an object and source ID pair
     *
     * An object and source ID pair are _alises_ for a corresponding stream ID, but are often more
     * convenient for people to use.
     *
     * @return `true` if this identifier if fully specified
     */
    isFullySpecified() {
        return (this.kind !== undefined &&
            this.timestamp !== undefined &&
            (this.streamId !== undefined ||
                (this.objectId !== undefined && this.sourceId !== undefined)));
    }
    /**
     * Get this object in standard JSON form.
     *
     * An example result looks like this:
     *
     * ```
     * {
     *   "kind": "n",
     *   "timestamp": "2025-02-01 12:00:00.000Z"
     *   "streamId": "7714f762-2361-4ec2-98ab-7e96807b32a6",
     *   "objectId": 123,
     *   "sourceId": "/power/1",
     *   "aggregation": "None"
     * }
     * ```
     *
     * @return an object, ready for JSON encoding
     */
    toJsonObject() {
        const result = {
            kind: this.kind.key,
            timestamp: timestampFormat(this.timestamp),
        };
        if (this.streamId !== undefined) {
            result.streamId = this.streamId;
        }
        if (this.objectId !== undefined) {
            result.objectId = this.objectId;
        }
        if (this.sourceId !== undefined) {
            result.sourceId = this.sourceId;
        }
        if (this.aggregation != null) {
            result.aggregation = this.aggregation.name;
        }
        return result;
    }
    /**
     * Get this object as a standard JSON encoded string value.
     *
     * This method calls {@link Domain.DatumIdentifier#toJsonEncoding} and then
     * turns that into a JSON string.
     *
     * @return the JSON encoded string
     * @see {@link Domain.DatumIdentifier#toJsonObject}
     */
    toJsonEncoding() {
        return JSON.stringify(this.toJsonObject());
    }
    /**
     * Parse a JSON string into a {@link Domain.DatumIdentifier} instance.
     *
     * The JSON must be encoded the same way {@link Domain.DatumIdentifier#toJsonEncoding} does.
     *
     * @param json the JSON to parse
     * @returns the datum identifier instance, or `undefined` if `json` is `undefined`
     */
    static fromJsonEncoding(json) {
        return this.fromJsonObject(JSON.parse(json));
    }
    /**
     * Create an identifier instance from an object parsed from a JSON string.
     *
     * The object must have been parsed from JSON that was encoded the same way
     * {@link Domain.DatumIdentifier#toJsonEncoding} does.
     *
     * @param obj the object parsed from JSON
     * @returns the datum identifier instance, or `undefined` if `obj` is `undefined`
     */
    static fromJsonObject(obj) {
        if (!obj) {
            return undefined;
        }
        const ts = obj.timestamp;
        const agg = Aggregation.valueOf(obj.aggregation) || undefined;
        return new DatumIdentifier(obj.kind, ts, obj.sourceId, obj.objectId, agg, obj.streamId);
    }
    /**
     * Create a node datum identifier instance.
     *
     * @param timestamp the datum timestamp, either as a `Date` instance or a form suitable for constructing as `new Date(ts)`
     * @param streamOrSourceId the datum stream ID, if `objectId` is not a `number`; otherwise the source ID
     * @param nodeIdOrAgg the datum object ID or an aggregation
     * @param aggregation the aggregation
     * @param streamId if `streamOrSourceId` and `objectIdOrAgg` are treated as source and object IDs, respectively, then the stream ID can be provided explicitly so all ID values are included
     * @returns the new identifier instance
     */
    static nodeId(timestamp, streamOrSourceId, nodeIdOrAgg, aggregation, streamId) {
        return new DatumIdentifier(DatumStreamTypes.Node, timestamp, streamOrSourceId, nodeIdOrAgg, aggregation, streamId);
    }
    /**
     * Create a location datum identifier instance.
     *
     * @param timestamp the datum timestamp, either as a `Date` instance or a form suitable for constructing as `new Date(ts)`
     * @param streamOrSourceId the datum stream ID, if `objectId` is not a `number`; otherwise the source ID
     * @param locationIdOrAgg the datum location ID or an aggregation
     * @param aggregation the aggregation
     * @param streamId if `streamOrSourceId` and `objectIdOrAgg` are treated as source and object IDs, respectively, then the stream ID can be provided explicitly so all ID values are included
     * @returns the new identifier instance
     */
    static locationId(timestamp, streamOrSourceId, locationIdOrAgg, aggregation, streamId) {
        return new DatumIdentifier(DatumStreamTypes.Location, timestamp, streamOrSourceId, locationIdOrAgg, aggregation, streamId);
    }
}

/**
 * An enumeration of supported datum reading type names.
 */
var DatumReadingTypeNames;
(function (DatumReadingTypeNames) {
    /**
     * Derive a single reading value based from one datum the nearest before a
     * specific time and one the nearest after.
     */
    DatumReadingTypeNames["CalculatedAt"] = "CalculatedAt";
    /**
     * Calculate the difference between two reading values on two dates, using the
     * `CalcualtedAt` style of deriving the start and end readings.
     */
    DatumReadingTypeNames["CalculatedAtDifference"] = "CalculatedAtDifference";
    /**
     * Find the difference between two datum that are nearest in time on or before
     * two dates, without any limits on how near to those dates the datum are.
     */
    DatumReadingTypeNames["NearestDifference"] = "NearestDifference";
    /**
     * Find the difference between two datum that are nearest in time and within
     * two dates.
     */
    DatumReadingTypeNames["Difference"] = "Difference";
    /**
     * Find the difference between two datum that are nearest in time on or before
     * two dates, constrained by a maximum time tolerance.
     */
    DatumReadingTypeNames["DifferenceWithin"] = "DifferenceWithin";
})(DatumReadingTypeNames || (DatumReadingTypeNames = {}));
/**
 * An enumeration of datum reading types.
 */
class DatumReadingType extends KeyedEnum {
    /**
     * Constructor.
     *
     * @param name - the unique name for this type
     * @param key - the key value associated with this type
     */
    constructor(name, key) {
        super(name, key);
        if (this.constructor === DatumReadingType) {
            Object.freeze(this);
        }
    }
    /**
     * @override
     * @inheritdoc
     */
    static enumValues() {
        return DatumReadingTypeValues;
    }
}
/**
 * The datum reading type enum values array.
 */
const DatumReadingTypeValues = Object.freeze([
    new DatumReadingType(DatumReadingTypeNames.CalculatedAt, "at"),
    new DatumReadingType(DatumReadingTypeNames.CalculatedAtDifference, "atd"),
    new DatumReadingType(DatumReadingTypeNames.NearestDifference, "diff"),
    new DatumReadingType(DatumReadingTypeNames.Difference, "delta"),
    new DatumReadingType(DatumReadingTypeNames.DifferenceWithin, "change"),
]);
/**
 * The enumeration of supported `DatumReadingType` values.
 * @see {@link Domain.DatumReadingTypeNames} for the available values
 */
const DatumReadingTypes = DatumReadingType.enumsValue(DatumReadingTypeValues);

/**
 * An enumeration of supported datum sample type names.
 */
var DatumSamplesTypeNames;
(function (DatumSamplesTypeNames) {
    /** Instantaneous number property values. */
    DatumSamplesTypeNames["Instantaneous"] = "Instantaneous";
    /** Accumulating meter-style number property values. */
    DatumSamplesTypeNames["Accumulating"] = "Accumulating";
    /** String status property values. */
    DatumSamplesTypeNames["Status"] = "Status";
    /** Arbitrary string names. */
    DatumSamplesTypeNames["Tag"] = "Tag";
})(DatumSamplesTypeNames || (DatumSamplesTypeNames = {}));
/**
 * An enumeration of datum samples types.
 */
class DatumSamplesType extends KeyedEnum {
    /**
     * Constructor.
     *
     * @param name - the unique name for this type
     * @param key - the key value associated with this type
     */
    constructor(name, key) {
        super(name, key);
        if (this.constructor === DatumSamplesType) {
            Object.freeze(this);
        }
    }
    /**
     * @override
     * @inheritdoc
     */
    static enumValues() {
        return DatumSamplesTypeValues;
    }
}
/**
 * The datum sample type enum values array.
 */
const DatumSamplesTypeValues = Object.freeze([
    new DatumSamplesType(DatumSamplesTypeNames.Instantaneous, "i"),
    new DatumSamplesType(DatumSamplesTypeNames.Accumulating, "a"),
    new DatumSamplesType(DatumSamplesTypeNames.Status, "s"),
    new DatumSamplesType(DatumSamplesTypeNames.Tag, "t"),
]);
/**
 * The enumeration of supported `DatumSamplesType` values.
 * @see {@link Domain.DatumSamplesTypeNames} for the available values
 */
const DatumSamplesTypes = DatumSamplesType.enumsValue(DatumSamplesTypeValues);

/**
 * Metadata about a datum stream.
 */
class DatumStreamMetadata {
    #streamId;
    #zone;
    #kind;
    #objectId;
    #sourceId;
    #iNames;
    #aNames;
    #sNames;
    /**
     * Constructor.
     * @param streamId -  the stream ID
     * @param zone - the time zone ID
     * @param kind - the stream type
     * @param objectId - the node or location ID
     * @param sourceId - the source ID
     * @param iNames - the instantaneous property name array
     * @param aNames - the accumulating property name array
     * @param sNames - the status property name array
     */
    constructor(streamId, zone, kind, objectId, sourceId, iNames, aNames, sNames) {
        this.#streamId = streamId;
        this.#zone = zone;
        this.#kind =
            kind instanceof DatumStreamType ? kind : DatumStreamTypes.Node;
        this.#objectId = objectId;
        this.#sourceId = sourceId;
        this.#iNames = Array.isArray(iNames) ? iNames : undefined;
        this.#aNames = Array.isArray(aNames) ? aNames : undefined;
        this.#sNames = Array.isArray(sNames) ? sNames : undefined;
        if (this.constructor === DatumStreamMetadata) {
            Object.freeze(this);
        }
    }
    /**
     * Create a new node datum stream metadata instance.
     * @param streamId -  the stream ID
     * @param zone - the time zone ID
     * @param nodeId - the node ID
     * @param sourceId - the source ID
     * @param iNames - the instantaneous property name array
     * @param aNames - the accumulating property name array
     * @param sNames - the status property name array
     * @returns the new metadata instance
     */
    static nodeMetadata(streamId, zone, nodeId, sourceId, iNames, aNames, sNames) {
        return new DatumStreamMetadata(streamId, zone, DatumStreamTypes.Node, nodeId, sourceId, iNames, aNames, sNames);
    }
    /**
     * Create a new location datum stream metadata instance.
     * @param streamId -  the stream ID
     * @param zone - the time zone ID
     * @param locationId - the location ID
     * @param sourceId - the source ID
     * @param iNames - the instantaneous property name array
     * @param aNames - the accumulating property name array
     * @param sNames - the status property name array
     * @returns the new metadata instance
     */
    static locationMetadata(streamId, zone, locationId, sourceId, iNames, aNames, sNames) {
        return new DatumStreamMetadata(streamId, zone, DatumStreamTypes.Location, locationId, sourceId, iNames, aNames, sNames);
    }
    /**
     * The stream ID, for example `7714f762-2361-4ec2-98ab-7e96807b32a6`.
     */
    get streamId() {
        return this.#streamId;
    }
    /**
     * The stream time zone ID, for example `Pacific/Auckland`.
     */
    get timeZoneId() {
        return this.#zone;
    }
    /**
     * The stream type.
     */
    get kind() {
        return this.#kind;
    }
    /**
     * The stream objece (node or location) ID.
     */
    get objectId() {
        return this.#objectId;
    }
    /**
     * The stream object ID (if the `kind` is `Node`), otherwise `undefined`.
     */
    get nodeId() {
        return DatumStreamTypes.Node.equals(this.#kind)
            ? this.#objectId
            : undefined;
    }
    /**
     * The stream object ID (if the `kind` is `Location`), otherewise `undefined`.
     */
    get locationId() {
        return DatumStreamTypes.Location.equals(this.#kind)
            ? this.#objectId
            : undefined;
    }
    /**
     * The stream source ID.
     */
    get sourceId() {
        return this.#sourceId;
    }
    /**
     * The instantaneous property names array length.
     */
    get instantaneousLength() {
        return Array.isArray(this.#iNames) ? this.#iNames.length : 0;
    }
    /**
     * The instantaneous property names array.
     */
    get instantaneousNames() {
        return this.#iNames;
    }
    /**
     * The accumulating property names array length.
     */
    get accumulatingLength() {
        return Array.isArray(this.#aNames) ? this.#aNames.length : 0;
    }
    /**
     * The accumulating property names array.
     */
    get accumulatingNames() {
        return this.#aNames;
    }
    /**
     * The status property names array length.
     */
    get statusLength() {
        return Array.isArray(this.#sNames) ? this.#sNames.length : 0;
    }
    /**
     * The status property names array.
     */
    get statusNames() {
        return this.#sNames;
    }
    /**
     * The total number of instantaneous, accumulating, and status property names.
     */
    get propertyNamesLength() {
        return (this.instantaneousLength +
            this.accumulatingLength +
            this.statusLength);
    }
    /**
     * Get all stream property names, in order of instantaneous, accumulating, and status.
     */
    get propertyNames() {
        const len = this.propertyNamesLength;
        if (len < 1) {
            return undefined;
        }
        let names = [];
        if (this.instantaneousLength > 0) {
            names = names.concat(this.#iNames);
        }
        if (this.accumulatingLength > 0) {
            names = names.concat(this.#aNames);
        }
        if (this.statusLength > 0) {
            names = names.concat(this.#sNames);
        }
        return names;
    }
    /**
     * Get the property names for a given samples type.
     * @param samplesType - the type of property names to return; `Tag` is not supported
     * @returns the property names for the given type, or `undefined` if none available
     */
    propertyNamesForType(samplesType) {
        if (DatumSamplesTypes.Instantaneous.equals(samplesType)) {
            return this.#iNames;
        }
        else if (DatumSamplesTypes.Accumulating.equals(samplesType)) {
            return this.#aNames;
        }
        else if (DatumSamplesTypes.Status.equals(samplesType)) {
            return this.#sNames;
        }
        return undefined;
    }
    /**
     * Get this object in standard JSON form.
     *
     * An example result looks like this:
     *
     * ```
     * {
     *   "streamId": "7714f762-2361-4ec2-98ab-7e96807b32a6",
     *   "zone": "Pacific/Auckland",
     *   "kind": "n",
     *   "objectId": 123,
     *   "sourceId": "/power/1",
     *   "i": ["watts", "current",  "voltage", "frequency"],
     *   "a": ["wattHours"]
     * }
     * ```
     *
     * @return an object, ready for JSON encoding
     */
    toJsonObject() {
        const result = {
            streamId: this.#streamId,
            zone: this.#zone,
            kind: this.#kind.key,
            objectId: this.#objectId,
            sourceId: this.#sourceId,
        };
        if (this.instantaneousLength > 0) {
            result.i = this.#iNames;
        }
        if (this.accumulatingLength > 0) {
            result.a = this.#aNames;
        }
        if (this.statusLength > 0) {
            result.s = this.#sNames;
        }
        return result;
    }
    /**
     * Get this object as a standard JSON encoded string value.
     *
     * An example result looks like this:
     *
     * ```
     * {
     *       "streamId": "7714f762-2361-4ec2-98ab-7e96807b32a6",
     *       "zone": "Pacific/Auckland",
     *       "kind": "n",
     *       "objectId": 123,
     *       "sourceId": "/power/1",
     *       "i": ["watts", "current",  "voltage", "frequency"],
     *       "a": ["wattHours"]
     * }
     * ```
     *
     * @return the JSON encoded string
     */
    toJsonEncoding() {
        return JSON.stringify(this.toJsonObject());
    }
    /**
     * Parse a JSON string into a {@link Domain.DatumStreamMetadata} instance.
     *
     * The JSON must be encoded the same way {@link Domain.DatumStreamMetadata#toJsonEncoding} does.
     *
     * @param json - the JSON to parse
     * @returns the stream metadata instance
     */
    static fromJsonEncoding(json) {
        return this.fromJsonObject(JSON.parse(json));
    }
    /**
     * Create a metadata instance from an object parsed from a JSON string.
     *
     * The object must have been parsed from JSON that was encoded the same way
     * {@link Domain.DatumStreamMetadata#toJsonEncoding} does.
     *
     * @param obj the object parsed from JSON
     * @returns the stream metadata instance
     */
    static fromJsonObject(obj) {
        if (!obj) {
            return undefined;
        }
        const kind = DatumStreamType.valueOf(obj.kind) ||
            DatumStreamTypes.Node;
        const i = Array.isArray(obj.i) ? obj.i : undefined;
        const a = Array.isArray(obj.a) ? obj.a : undefined;
        const s = Array.isArray(obj.s) ? obj.s : undefined;
        return new DatumStreamMetadata(obj.streamId, obj.zone, kind, obj.objectId, obj.sourceId, i, a, s);
    }
}

/**
 * An immutable enum-like object with an associated bitmask support.
 *
 * This class must be extended by another class that overrides the inerited
 * {@link Util.Enum.enumValues} method.
 */
class BitmaskEnum extends Enum {
    #bitNumber;
    /**
     * Constructor.
     *
     * @param name - the name
     * @param bitNumber - the bit offset, starting from `1` for the least significant bit
     */
    constructor(name, bitNumber) {
        super(name);
        this.#bitNumber = bitNumber;
    }
    /**
     * Get the bit offset value, starting from `1` for the least significant bit.
     *
     * @returns the 1-based value
     */
    get bitmaskBitNumber() {
        return this.#bitNumber;
    }
    /**
     * Get the bit offset value, starting from `0` for the least significant bit.
     *
     * @returns the 0-based value
     */
    get bitmaskBitOffset() {
        return this.#bitNumber - 1;
    }
    /**
     * Get a `BitmaskEnum` objects for a bit number.
     *
     * @param bitNumber - a bit number value of the `BitmaskEnum` object to find
     * @param values - the complete set of possible `BitmaskEnum` objects
     * @returns the matching `BitmaskEnum`, or `undefined`
     */
    static enumForBitNumber(bitNumber, values) {
        for (const c of values) {
            const n = c.bitmaskBitNumber;
            if (n == bitNumber) {
                return c;
            }
        }
        return undefined;
    }
    /**
     * Get a bitmask value for a set of `BitmaskEnum` objects.
     *
     * @param maskables - the set of `BitmaskEnum` objects
     * @returns a bitmask value of all {@link Util.BitmaskEnum#bitmaskBitOffset}
     *         values of the given `maskables`
     */
    static bitmaskValue(maskables) {
        let mask = 0;
        if (maskables != null) {
            for (const c of maskables) {
                if (c.bitmaskBitOffset >= 0) {
                    mask |= 1 << c.bitmaskBitOffset;
                }
            }
        }
        return mask;
    }
    /**
     * Convert a bitmask value into a set of `BitmaskEnum` objects.
     *
     * @param mask - a bitmask value of a set of `BitmaskEnum` objects
     * @param clazz -  the class of an enumeration of `BitmaskEnum` objects
     * @returns a set of `BitmaskEnum` objects
     */
    static setForBitmaskEnum(mask, clazz) {
        return BitmaskEnum.setForBitmask(mask, clazz.enumValues());
    }
    /**
     * Convert a bitmask value into a set of `BitmaskEnum` objects.
     *
     * @param mask - a bitmask value of a set of `BitmaskEnum` objects
     * @param values -  the complete set of possible `BitmaskEnum` objects
     * @returns a set of `BitmaskEnum` objects
     */
    static setForBitmask(mask, values) {
        if (!values || mask < 1) {
            return new Set();
        }
        const set = new Set();
        for (const c of values) {
            const b = c.bitmaskBitOffset;
            if (b >= 0 && ((mask >> b) & 1) == 1) {
                set.add(c);
            }
        }
        return set;
    }
}

/**
 * An enumeration of supported device operating state names.
 */
var DeviceOperatingStateNames;
(function (DeviceOperatingStateNames) {
    /** Unknown. */
    DeviceOperatingStateNames["Unknown"] = "Unknown";
    /** Normal operating state. */
    DeviceOperatingStateNames["Normal"] = "Normal";
    /** Starting. */
    DeviceOperatingStateNames["Starting"] = "Starting";
    /** Standby. */
    DeviceOperatingStateNames["Standby"] = "Standby";
    /** Shutdown. */
    DeviceOperatingStateNames["Shutdown"] = "Shutdown";
    /** Fault. */
    DeviceOperatingStateNames["Fault"] = "Fault";
    /** Disabled. */
    DeviceOperatingStateNames["Disabled"] = "Disabled";
    /** Recovery. */
    DeviceOperatingStateNames["Recovery"] = "Recovery";
    /** Override. */
    DeviceOperatingStateNames["Override"] = "Override";
})(DeviceOperatingStateNames || (DeviceOperatingStateNames = {}));
/**
 * An enumeration of standardized device operating states.
 */
class DeviceOperatingState extends BitmaskEnum {
    /**
     * Constructor.
     *
     * @param name - the name
     * @param bitNumber - the bit offset, starting from `1` for the least significant bit
     */
    constructor(name, bitNumber) {
        super(name, bitNumber);
        if (this.constructor === DeviceOperatingState) {
            Object.freeze(this);
        }
    }
    /**
     * Get the state code value.
     *
     * @returns the code
     */
    get code() {
        return this.bitmaskBitNumber;
    }
    /**
     * Get an enum for a code value.
     *
     * @param code - the code to look for
     * @returns the state, or `undefined` if not found
     */
    static forCode(code) {
        return BitmaskEnum.enumForBitNumber(code, DeviceOperatingStateValues);
    }
    /**
     * @inheritdoc
     */
    static enumValues() {
        return DeviceOperatingStateValues;
    }
}
/**
 * The device operating state enum values array.
 */
const DeviceOperatingStateValues = Object.freeze([
    new DeviceOperatingState(DeviceOperatingStateNames.Unknown, 0),
    new DeviceOperatingState(DeviceOperatingStateNames.Normal, 1),
    new DeviceOperatingState(DeviceOperatingStateNames.Starting, 2),
    new DeviceOperatingState(DeviceOperatingStateNames.Standby, 3),
    new DeviceOperatingState(DeviceOperatingStateNames.Shutdown, 4),
    new DeviceOperatingState(DeviceOperatingStateNames.Fault, 5),
    new DeviceOperatingState(DeviceOperatingStateNames.Disabled, 6),
    new DeviceOperatingState(DeviceOperatingStateNames.Recovery, 7),
    new DeviceOperatingState(DeviceOperatingStateNames.Override, 8),
]);
/**
 * The enumeration of supported DeviceOperatingState values.
 * @see {@link Domain.DeviceOperatingStateNames} for the available values
 */
const DeviceOperatingStates = DeviceOperatingState.enumsValue(DeviceOperatingStateValues);

/**
 * Convert a `Map` into a simple object.
 *
 * The keys are assumed to be strings. Values that are themselves `Map` instances
 * will be converted to simple objects as well.
 *
 * @param strMap - a Map with string keys; nested Map objects are also handled
 * @returns a simple object
 * @see {@link Util.Objects.objectToStringMap} for the reverse conversion
 */
function stringMapToObject(strMap) {
    const obj = Object.create(null);
    if (strMap) {
        for (const [k, v] of strMap) {
            obj[k] = v instanceof Map ? stringMapToObject(v) : v;
        }
    }
    return obj;
}
/**
 * Convert a simple object into a `Map` instance.
 *
 * Property values that are themselves objects will be converted into `Map`
 * instances as well.
 *
 * @param obj - a simple object
 * @returns a Map with string keys; nested Map objects are also handled
 * @see {@link Util.Objects.stringMapToObject} for the reverse conversion
 */
function objectToStringMap(obj) {
    const strMap = new Map();
    if (obj) {
        for (const k of Object.keys(obj)) {
            const v = obj[k];
            strMap.set(k, typeof v === "object" ? objectToStringMap(v) : v);
        }
    }
    return strMap;
}
/**
 * Get a non-empty Set from a Set or array or object, returning `undefined` if the set would be empty.
 *
 * @param obj - the array, Set, or singleton object to get as a Set
 * @returns the Set, or `undefined`
 */
function nonEmptySet(obj) {
    let result = undefined;
    if (obj instanceof Set) {
        result = obj.size > 0 ? obj : undefined;
    }
    else if (Array.isArray(obj)) {
        result = obj.length > 0 ? new Set(obj) : undefined;
    }
    else if (obj) {
        result = new Set([obj]);
    }
    return result;
}
/**
 * Merge two sets, returning `undefined` if the merged set would be empty.
 *
 * @param set1 - the first set
 * @param set2 - the second set
 * @returns the merged Set, or `undefined` if neither arguments are sets or
 *                   neither argument have any values
 * @private
 */
function nonEmptyMergedSets(set1, set2) {
    const s1 = nonEmptySet(set1);
    const s2 = nonEmptySet(set2);
    if (s1 === undefined && s2 === undefined) {
        return undefined;
    }
    else if (s2 === undefined) {
        return s1;
    }
    else if (s1 === undefined) {
        return s2;
    }
    const result = new Set(s1);
    for (const v of s2.values()) {
        result.add(v);
    }
    return result;
}

var objects = /*#__PURE__*/Object.freeze({
    __proto__: null,
    nonEmptyMergedSets: nonEmptyMergedSets,
    nonEmptySet: nonEmptySet,
    objectToStringMap: objectToStringMap,
    stringMapToObject: stringMapToObject
});

/**
 * General metadata with a basic structure.
 *
 * This metadata can be associated with a variety of objects within SolarNetwork, such
 * as users, nodes, and datum.
 */
class GeneralMetadata {
    /** The general metadata map. */
    info;
    /** The property metadata map. */
    propertyInfo;
    /** The tags. */
    tags;
    /**
     * Constructor.
     *
     * @param info - the general metadata map
     * @param propertyInfo - the property metadata map
     * @param tags - the tags
     */
    constructor(info, propertyInfo, tags) {
        this.info = info;
        this.propertyInfo = propertyInfo;
        this.tags =
            tags instanceof Set
                ? tags
                : Array.isArray(tags)
                    ? new Set(tags)
                    : undefined;
    }
    /**
     * Get this object as a standard JSON encoded string value.
     *
     * @return the JSON encoded string
     */
    toJsonEncoding() {
        const result = {};
        const info = this.info;
        if (info) {
            result["m"] = stringMapToObject(info);
        }
        const propertyInfo = this.propertyInfo;
        if (propertyInfo) {
            result["pm"] = stringMapToObject(propertyInfo);
        }
        const tags = this.tags;
        if (tags) {
            result["t"] = Array.from(tags);
        }
        return JSON.stringify(result);
    }
    /**
     * Parse a JSON string into a `GeneralMetadata` instance.
     *
     * The JSON must be encoded the same way {@link Domain.GeneralMetadata#toJsonEncoding} does.
     *
     * @param json - the JSON to parse
     * @returns the metadata instance
     */
    static fromJsonEncoding(json) {
        let m;
        let pm;
        let t;
        if (json) {
            const obj = JSON.parse(json);
            m = obj["m"] ? objectToStringMap(obj["m"]) : undefined;
            pm = obj["pm"] ? objectToStringMap(obj["pm"]) : undefined;
            t = Array.isArray(obj["t"]) ? new Set(obj["t"]) : undefined;
        }
        return new GeneralMetadata(m, pm, t);
    }
}

/**
 * An enumeration of supported instruction state names.
 */
var InstructionStateNames;
(function (InstructionStateNames) {
    /** An unknown state. */
    InstructionStateNames["Unknown"] = "Unknown";
    /** The instruction has been received by SolarNet but not yet delivered to its destination. */
    InstructionStateNames["Queued"] = "Queued";
    /**
     * The instruction is in the process of being queued, potentially
     * jumping to the received state if an immediate acknowledgement is
     * possible.
     */
    InstructionStateNames["Queuing"] = "Queuing";
    /** The instruction has been delivered to its destination but not yet acted upon. */
    InstructionStateNames["Received"] = "Received";
    /** The instruction is currently being acted upon. */
    InstructionStateNames["Executing"] = "Executing";
    /** The destination has declined to execute the instruction, or the execution failed. */
    InstructionStateNames["Declined"] = "Declined";
    /** The destination has executed successfully. */
    InstructionStateNames["Completed"] = "Completed";
})(InstructionStateNames || (InstructionStateNames = {}));
/**
 * A named instruction state.
 */
class InstructionState extends Enum {
    /**
     * Constructor.
     *
     * @param name - the name
     */
    constructor(name) {
        super(name);
        if (this.constructor === InstructionState) {
            Object.freeze(this);
        }
    }
    /**
     * @override
     * @inheritdoc
     */
    static enumValues() {
        return InstructionStateValues;
    }
}
/**
 * The instruction state enum values array.
 */
const InstructionStateValues = Object.freeze([
    new InstructionState(InstructionStateNames.Unknown),
    new InstructionState(InstructionStateNames.Queued),
    new InstructionState(InstructionStateNames.Queuing),
    new InstructionState(InstructionStateNames.Received),
    new InstructionState(InstructionStateNames.Executing),
    new InstructionState(InstructionStateNames.Declined),
    new InstructionState(InstructionStateNames.Completed),
]);
/**
 * The enumeration of supported `InstructionState` values.
 * @see {@link Domain.InstructionStateNames} for the available values
 */
const InstructionStates = InstructionState.enumsValue(InstructionStateValues);

/**
 * An instruction object.
 */
class Instruction {
    /** A unique identifier. */
    id;
    /** The ID of the node the instruction targets. */
    nodeId;
    /** The instruction topic. */
    topic;
    /** The instruction creation date. */
    created;
    /** The instruction action date. */
    date;
    /** The instruction action date. */
    instructionDate;
    /** The instruction state. */
    state;
    /** The instruction state. */
    instructionState;
    /** The last instruction status change date. */
    statusDate;
    /** The last instruction status date. */
    updateDate;
    /** Parameters for the instruction. */
    parameters;
    /** Result parameters returned with the instruction status update. */
    resultParameters;
    /**
     * Construct from an instruction info object.
     * @param info the info to construct with
     */
    constructor(info) {
        this.id = info.id;
        this.date = dateParser(info.instructionDate) || new Date();
        this.created = info.created || timestampFormat(this.date);
        this.nodeId = info.nodeId;
        this.topic = info.topic;
        this.instructionDate = info.instructionDate || this.created;
        this.state = info.state;
        this.instructionState =
            InstructionState.valueOf(info.state) || InstructionStates.Unknown;
        this.updateDate = dateParser(info.statusDate) || this.date;
        this.statusDate = info.statusDate || timestampFormat(this.date);
        this.parameters = info.parameters;
        this.resultParameters = info.resultParameters;
    }
    /**
     * Create an instruction parameter instance.
     *
     * @param name the parameter name
     * @param value the parameter value
     * @returns the parameter object
     */
    static parameter(name, value) {
        return { name: name, value: String(value) };
    }
}
/**
 * Common instruction topic names.
 */
var CommonInstructionTopicName;
(function (CommonInstructionTopicName) {
    /** Cancel a deferred instruction. */
    CommonInstructionTopicName["CancelInstruction"] = "CancelInstruction";
    /** Execute a datum expression. */
    CommonInstructionTopicName["DatumExpression"] = "DatumExpression";
    /** Disable an Operational Mode. */
    CommonInstructionTopicName["DisableOperationalModes"] = "DisableOperationalModes";
    /** Enable an Operational Mode. */
    CommonInstructionTopicName["EnableOperationalModes"] = "EnableOperationalModes";
    /** Set a logger level. */
    CommonInstructionTopicName["LoggingSetLevel"] = "LoggingSetLevel";
    /** Renew a node's certificate. */
    CommonInstructionTopicName["RenewCertificate"] = "RenewCertificate";
    /** Set a control value. */
    CommonInstructionTopicName["SetControlParameter"] = "SetControlParameter";
    /** Set the operating state of a device. */
    CommonInstructionTopicName["SetOperatingState"] = "SetOperatingState";
    /**Request a device to reduce its power consumption. */
    CommonInstructionTopicName["ShedLoad"] = "ShedLoad";
    /** Send a "signal" message to a control or device component. */
    CommonInstructionTopicName["Signal"] = "Signal";
    /** Start a SolarSSH remote management session. */
    CommonInstructionTopicName["StartRemoteSsh"] = "StartRemoteSsh";
    /** Stop a SolarSSH remote management session. */
    CommonInstructionTopicName["StopRemoteSsh"] = "StopRemoteSsh";
    /** Get configuration for a service. */
    CommonInstructionTopicName["SystemConfiguration"] = "SystemConfiguration";
    /** Reboot the device SolarNode is running on. */
    CommonInstructionTopicName["SystemReboot"] = "SystemReboot";
    /** Restart the SolarNode service. */
    CommonInstructionTopicName["SystemRestart"] = "SystemRestart";
    /** Update the Setup-based SolarNode platform. */
    CommonInstructionTopicName["UpdatePlatform"] = "UpdatePlatform";
})(CommonInstructionTopicName || (CommonInstructionTopicName = {}));

/**
 * An enumeration of supported location precision names.
 */
var LocationPrecisionNames;
(function (LocationPrecisionNames) {
    /** GPS coordinates. */
    LocationPrecisionNames["LatLong"] = "LatLong";
    /** A city block. */
    LocationPrecisionNames["Block"] = "Block";
    /** A a street. */
    LocationPrecisionNames["Street"] = "Street";
    /** A postal code (or "zip code"). */
    LocationPrecisionNames["PostalCode"] = "PostalCode";
    /** A town or city. */
    LocationPrecisionNames["Locality"] = "Locality";
    /** A state or province. */
    LocationPrecisionNames["StateOrProvince"] = "StateOrProvince";
    /** A large region. */
    LocationPrecisionNames["Region"] = "Region";
    /** A time zone. */
    LocationPrecisionNames["TimeZone"] = "TimeZone";
    /** A country. */
    LocationPrecisionNames["Country"] = "Country";
})(LocationPrecisionNames || (LocationPrecisionNames = {}));
/**
 * A location precision object for use with defining named geographic precision.
 */
class LocationPrecision extends ComparableEnum {
    /**
     * Constructor.
     *
     * @param name - the unique name for this precision
     * @param precision - a relative precision value for this precision
     */
    constructor(name, precision) {
        super(name, precision);
        if (this.constructor === LocationPrecision) {
            Object.freeze(this);
        }
    }
    /**
     * Get the relative precision value.
     *
     * This is an alias for {@link Util.ComparableEnum.value}.
     *
     * @returns the precision
     */
    get precision() {
        return this.value;
    }
    /**
     * @override
     * @inheritdoc
     */
    static enumValues() {
        return LocationPrecisionValues;
    }
}
/**
 * The location precision enum values array.
 */
const LocationPrecisionValues = Object.freeze([
    new LocationPrecision(LocationPrecisionNames.LatLong, 1),
    new LocationPrecision(LocationPrecisionNames.Block, 5),
    new LocationPrecision(LocationPrecisionNames.Street, 10),
    new LocationPrecision(LocationPrecisionNames.PostalCode, 20),
    new LocationPrecision(LocationPrecisionNames.Locality, 30),
    new LocationPrecision(LocationPrecisionNames.StateOrProvince, 40),
    new LocationPrecision(LocationPrecisionNames.Region, 50),
    new LocationPrecision(LocationPrecisionNames.TimeZone, 60),
    new LocationPrecision(LocationPrecisionNames.Country, 70),
]);
/**
 * The enumeration of supported `LocationPrecision` values.
 * @see {@link Domain.LocationPrecisionNames} for the available values
 */
const LocationPrecisions = LocationPrecision.enumsValue(LocationPrecisionValues);

/**
 * Push values onto an array.
 *
 * @param <T> the value type
 * @param result the array to push value onto
 * @param values the values to add
 */
function pushValues(result, values) {
    if (!(values && Array.isArray(result))) {
        return;
    }
    for (const e of values) {
        result.push(e);
    }
}
/**
 * Create a new array of lower-cased and sorted strings from another array.
 *
 * @param items - the items to lower-case and sort
 * @returns a new array of the lower-cased and sorted items
 */
function lowercaseSortedArray(items) {
    const sortedItems = [];
    const len = items.length;
    for (let i = 0; i < len; i += 1) {
        sortedItems.push(items[i].toLowerCase());
    }
    sortedItems.sort();
    return sortedItems;
}
/**
 * Create a set that contains only values that occur in two different sets.
 *
 * @param <T> the value type
 * @param s1 the first set of values
 * @param s2  the second set of values
 * @returns a new set with only values that occur in both `s1` and `s2`
 */
function intersection(s1, s2) {
    const result = new Set();
    const a = s1 instanceof Set ? s1 : new Set(s1);
    const b = s2 instanceof Set ? s2 : new Set(s2);
    let l;
    let r;
    if (a.size > b.size) {
        l = b;
        r = a;
    }
    else {
        l = a;
        r = b;
    }
    l.forEach((v) => {
        if (r.has(v)) {
            result.add(v);
        }
    });
    return result;
}

var arrays = /*#__PURE__*/Object.freeze({
    __proto__: null,
    intersection: intersection,
    lowercaseSortedArray: lowercaseSortedArray,
    pushValues: pushValues
});

/**
 * A registry of datum stream metadata instances for object (node or location) and source ID combinations.
 *
 * This registry acts like a map of (stream ID) -> metadata as well as (object ID, source ID) -> metadata.
 */
class DatumStreamMetadataRegistry {
    /** The metadata. */
    #metaList;
    /** A map of stream ID to associated metadata. */
    #metaMap;
    /**
     * Constructor.
     * @param metas - optional list of metadata to start with
     */
    constructor(metas) {
        this.#metaList = Array.isArray(metas) ? metas : [];
        this.#metaMap = new Map();
        for (const e of this.#metaList) {
            if (e instanceof DatumStreamMetadata) {
                this.#metaMap.set(e.streamId, e);
            }
        }
    }
    /**
     * Add metadata to the registry.
     * @param meta - the metadata to add to the registry
     * @returns this object
     */
    addMetadata(meta) {
        if (meta instanceof DatumStreamMetadata && meta.streamId) {
            this.#metaList.push(meta);
            this.#metaMap.set(meta.streamId, meta);
        }
        return this;
    }
    /**
     * Get a set of all available stream IDs.
     * @returns all available metadata stream ID values
     */
    metadataStreamIds() {
        return new Set(this.#metaMap.keys());
    }
    /**
     * Get the metadata at a specific index, based on insertion order.
     * @param index - the index of the metadata to get
     * @returns the metadata at the given index, or `undefined`
     */
    metadataAt(index) {
        return index >= 0 && index < this.#metaList.length
            ? this.#metaList[index]
            : undefined;
    }
    /**
     * Get the index of the metadata with a specific stream ID.
     * @param streamId - the stream ID to get the index of
     * @returns the found index, or `-1` if not found
     */
    indexOfMetadataStreamId(streamId) {
        let i = 0;
        for (const meta of this.#metaList) {
            if (meta.streamId === streamId) {
                return i;
            }
            i += 1;
        }
        return -1;
    }
    /**
     * Get a list of all available stream IDs in insertion order.
     * @returns  all available metadata stream ID values in the same order as added to this registry
     */
    metadataStreamIdsList() {
        return this.#metaList.map((e) => e.streamId);
    }
    /**
     * Get the metadta for a given stream ID.
     * @param streamId - the stream ID of the metadata to get
     * @returns the associated metadata, or `undefined` if none available
     */
    metadataForStreamId(streamId) {
        return this.#metaMap.get(streamId);
    }
    /**
     * Get the first available metadata for a given object and source ID combination.
     * @param objectId - the object ID of the metadata to get
     * @param sourceId - the source ID of the metadata to get
     * @param kind - optional kind to get; if not provided the first metadata to match the given `objectId`
     *     and `sourceId` will be returned
     * @returns the associated metadata, or `undefined` if none available
     */
    metadataForObjectSource(objectId, sourceId, kind) {
        for (const meta of this.#metaMap.values()) {
            if (meta.objectId === objectId &&
                meta.sourceId == sourceId &&
                (kind ? meta.kind === kind : true)) {
                return meta;
            }
        }
        return undefined;
    }
    /**
     * Get this object as a standard JSON encoded string value.
     *
     * The returned JSON is an array of the {@link Domain.DatumStreamMetadata#toJsonEncoding toJsonEncoding()} result
     * of all metadata in the registry. An example result looks like this:
     *
     * ```
     * [
     *     {
     *       "streamId": "7714f762-2361-4ec2-98ab-7e96807b32a6",
     *       "zone": "Pacific/Auckland",
     *       "kind": "n",
     *       "objectId": 123,
     *       "sourceId": "/power/1",
     *       "i": ["watts", "current",  "voltage", "frequency"],
     *       "a": ["wattHours"]
     *     },
     *     {
     *       "streamId": "5514f762-2361-4ec2-98ab-7e96807b3255",
     *       "zone": "America/New_York",
     *       "kind": "n",
     *       "objectId": 456,
     *       "sourceId": "/irradiance/2",
     *       "i": ["irradiance", "temperature"],
     *       "a": ["irradianceHours"]
     *     }
     * ]
     * ```
     *
     * @return the JSON encoded string
     */
    toJsonEncoding() {
        let json = "[";
        for (const meta of this.#metaList) {
            if (json.length > 1) {
                json += ",";
            }
            json += meta.toJsonEncoding();
        }
        json += "]";
        return json;
    }
    /**
     * Parse a JSON string into a {@link Util.DatumStreamMetadataRegistry DatumStreamMetadataRegistry} instance.
     *
     * The JSON must be encoded the same way {@link Util.DatumStreamMetadataRegistry#toJsonEncoding toJsonEncoding()} does.
     *
     * @param json - the JSON to parse
     * @returns the stream metadata registry instance, or `undefined` if `json` is not parsable as one
     */
    static fromJsonEncoding(json) {
        if (json) {
            return this.fromJsonObject(JSON.parse(json));
        }
        return undefined;
    }
    /**
     * Create a registry instance from an array parsed from a JSON string of datum stream metadata objects.
     *
     * The array must be structured in the same way {@link Util.DatumStreamMetadataRegistry#toJsonEncoding toJsonEncoding()} does.
     *
     * @param data - the array data to parse
     * @returns the stream metadata registry instance, or `undefined` if `data` is not a valid array
     */
    static fromJsonObject(data) {
        if (!Array.isArray(data)) {
            return undefined;
        }
        const reg = new DatumStreamMetadataRegistry();
        for (const e of data) {
            const meta = DatumStreamMetadata.fromJsonObject(e);
            if (meta) {
                reg.addMetadata(meta);
            }
        }
        return reg;
    }
}

function populateProperties$1(obj, names, values, type, withoutStatistics) {
    if (!Array.isArray(names) || !Array.isArray(values)) {
        return;
    }
    let val, name, valLen;
    for (let i = 0, iMax = Math.min(names.length, values.length); i < iMax; i += 1) {
        val = values[i];
        if (DatumSamplesTypes.Instantaneous === type) {
            if (Array.isArray(val)) {
                name = names[i];
                valLen = val.length;
                if (valLen > 0 &&
                    val[0] !== null &&
                    !Object.prototype.hasOwnProperty.call(obj, name)) {
                    obj[name] = val[0];
                    if (!withoutStatistics) {
                        if (valLen > 1 && val[1] !== null) {
                            obj[name + "_count"] = val[1];
                        }
                        if (valLen > 2 && val[2] !== null) {
                            obj[name + "_min"] = val[2];
                        }
                        if (valLen > 3 && val[3] !== null) {
                            obj[name + "_max"] = val[3];
                        }
                    }
                }
            }
        }
        else if (DatumSamplesTypes.Accumulating === type) {
            if (Array.isArray(val)) {
                name = names[i];
                valLen = val.length;
                if (valLen > 0 &&
                    val[0] !== null &&
                    !Object.prototype.hasOwnProperty.call(obj, name)) {
                    obj[name] = val[0];
                    if (!withoutStatistics) {
                        if (valLen > 1 && val[1] !== null) {
                            obj[name + "_start"] = val[1];
                        }
                        if (valLen > 2 && val[2] !== null) {
                            obj[name + "_end"] = val[2];
                        }
                    }
                }
            }
        }
        else {
            if (val !== undefined && val !== null) {
                name = names[i];
                if (!Object.prototype.hasOwnProperty.call(obj, name)) {
                    obj[name] = val;
                }
            }
        }
    }
}
/**
 * A stream aggregate datum entity.
 *
 * A stream aggregate datum is a datum representing some aggregate calculation, without any metadata describing the datum property names.
 * The instantantaneous and accumulating property values are stored as 2D array fields `iProps` and `aProps` that hold the property values
 * as well as associated aggregate statistics. The datum status properties are stroed in the 1D array field `sProps`. A
 * {@link Domain.DatumStreamMetadata DatumStreamMetadata} object is required to associate names with these arrays.
 *
 * The instantaneous properties are 4-element arrays containing:
 *
 *  1. property average value
 *  2. property count
 *  3. minimum value
 *  4. maximum value
 *
 * The accumulatingn statistics are 3-element arrays containing:
 *
 *  1. difference between ending and starting property values
 *  2. starting property value
 *  3. ending property value
 */
class StreamAggregateDatum {
    /** The stream ID. */
    streamId;
    /** The start and end dates. */
    ts;
    /** The instantaneous property values and associated statistics. */
    iProps;
    /** The accumulating property values and associated statistics. */
    aProps;
    /** The status property values. */
    sProps;
    /** The tag values. */
    tags;
    /** Attached metadata. */
    meta;
    /**
     * Constructor.
     * @param streamId - the datum stream ID
     * @param ts - an array with 2 elements for the datum start and end timestamps, either as a `Date` instance
     * or a form suitable for constructing as `new Date(ts)`
     * @param iProps - the instantaneous property values and associated statistics
     * @param aProps - the accumulating property values and associated statistics
     * @param sProps - the status property values
     * @param tags - the tag values
     * @param meta - optional metadata to attach, or a metadata registry to resolve metadata based on the given `streamId`
     */
    constructor(streamId, ts, iProps, aProps, sProps, tags, meta) {
        this.streamId = streamId;
        this.ts = Array.isArray(ts)
            ? ts.map((e) => (e instanceof Date ? e : new Date(e)))
            : [];
        this.iProps = iProps;
        this.aProps = aProps;
        this.sProps = sProps;
        this.tags = tags
            ? tags instanceof Set
                ? tags
                : new Set(tags)
            : undefined;
        this.meta =
            meta instanceof DatumStreamMetadataRegistry
                ? meta.metadataForStreamId(streamId)
                : meta instanceof DatumStreamMetadata
                    ? meta
                    : undefined;
        if (this.constructor === StreamAggregateDatum) {
            Object.freeze(this);
        }
    }
    /**
     * @inheritdoc
     */
    get date() {
        return this.ts.length ? this.ts[0] : new Date(undefined);
    }
    /**
     * @inheritdoc
     */
    get metadata() {
        return this.meta;
    }
    /**
     * @inheritdoc
     */
    propertyValuesForType(samplesType) {
        if (DatumSamplesTypes.Instantaneous.equals(samplesType)) {
            return this.iProps ? this.iProps.map((e) => e[0]) : undefined;
        }
        else if (DatumSamplesTypes.Accumulating.equals(samplesType)) {
            return this.aProps ? this.aProps.map((e) => e[0]) : undefined;
        }
        else if (DatumSamplesTypes.Status.equals(samplesType)) {
            return this.sProps;
        }
        else if (DatumSamplesTypes.Tag.equals(samplesType)) {
            return this.tags;
        }
        return undefined;
    }
    /**
     * Get this instance as a simple object.
     *
     * The following basic properties will be set on the returned object:
     *
     *  * `streamId` - the stream ID
     *  * `date` - the timestamp
     *  * `date_end` - the ending timestamp, if available
     *  * `sourceId` - the metadata source ID
     *  * `nodeId` or `locationId` - either the node ID or location ID from the metadata
     *  * `tags` - any tags (as an Array)
     *
     * Beyond that, all instantaneous, accumulating, and status properties will be included.
     * If duplicate property names exist between the different classifications, the first-available
     * value will be used. Any available statistics for each property are included as well, using
     * property names with the following suffixes:
     *
     *  * `_count` - count of datum
     *  * `_min` - minimum value
     *  * `_max` - maximum value
     *  * `_start` - starting value
     *  * `_end` - ending value
     *
     * @param meta - a metadata instance or metadata registry to encode the property names with;
     *     falls back to the `meta` class property if not provided
     * @param withoutStatistics - `true` to omit statistic properties
     * @returns an object populated with all available properties
     */
    toObject(meta, withoutStatistics) {
        const m = meta instanceof DatumStreamMetadataRegistry
            ? meta.metadataForStreamId(this.streamId)
            : meta instanceof DatumStreamMetadata
                ? meta
                : this.meta;
        if (!m) {
            return undefined;
        }
        const obj = {
            streamId: this.streamId,
            sourceId: m.sourceId,
        };
        if (this.ts.length > 0) {
            obj.date = this.ts[0];
            if (this.ts.length > 1) {
                obj.date_end = this.ts[1];
            }
        }
        if (m.nodeId !== undefined) {
            obj.nodeId = m.nodeId;
        }
        else if (m.locationId !== undefined) {
            obj.locationId = m.locationId;
        }
        if (this.tags) {
            obj.tags = Array.from(this.tags);
        }
        populateProperties$1(obj, m.instantaneousNames, this.iProps, DatumSamplesTypes.Instantaneous, withoutStatistics);
        populateProperties$1(obj, m.accumulatingNames, this.aProps, DatumSamplesTypes.Accumulating, withoutStatistics);
        populateProperties$1(obj, m.statusNames, this.sProps, DatumSamplesTypes.Status);
        return obj;
    }
    /**
     * Get this object as a standard JSON encoded string value.
     *
     * This method returns the JSON form of the result of {@link Domain.StreamAggregateDatum#toJsonObject toJsonObject()}.
     *
     * @param registry - a stream metadata registry to encode as a registry-indexed stream datum
     * @return the JSON encoded string
     */
    toJsonEncoding(registry) {
        return JSON.stringify(this.toJsonObject(registry));
    }
    /**
     * Get this object as an array suitable for encoding into a standard stream datum JSON string.
     *
     * This method can encode the datum into an array using one of two ways, depending on whether the `registry` argument is provided.
     * When provided, the first array element will be the stream metadata index based on calling
     * {@link Util.DatumStreamMetadataRegistry#indexOfMetadataStreamId indexOfMetadataStreamId()}.
     * Otherwise the first array element will be the stream ID itself.
     *
     * For example if a registry is used, the resulting array might look like this:
     *
     * ```
     * [0,[1650945600000,1651032000000],[3.6,2,0,7.2],[19.1,2,18.1, 20.1],[1.422802,1138.446687,1139.869489]]
     * ```
     *
     * while without a registry the array might look like this:
     *
     * ```
     * ["7714f762-2361-4ec2-98ab-7e96807b32a6", [1650945600000,1651032000000],[3.6,2,0,7.2],[19.1,2,18.1, 20.1],[1.422802,1138.446687,1139.869489]]
     * ```
     *
     * @param registry a stream metadata registry to encode as a registry-indexed stream datum
     * @return the datum stream array object
     */
    toJsonObject(registry) {
        const result = [
            registry instanceof DatumStreamMetadataRegistry
                ? registry.indexOfMetadataStreamId(this.streamId)
                : this.streamId,
            this.ts.map((e) => e instanceof Date && !isNaN(e.getTime()) ? e.getTime() : null),
        ];
        pushValues(result, this.iProps);
        pushValues(result, this.aProps);
        pushValues(result, this.sProps);
        pushValues(result, this.tags);
        return result;
    }
    /**
     * Parse a JSON string into a {@link Domain.StreamAggregateDatum StreamAggregateDatum} instance.
     *
     * The JSON must be encoded the same way {@link Domain.StreamAggregateDatum#toJsonEncoding toJsonEncoding()} does.
     *
     * @param json - the JSON to parse
     * @param meta - a metadata instance or metadata registry to decode with
     * @returns the stream datum instance
     * @throws SyntaxError if `json` is not valid JSON
     */
    static fromJsonEncoding(json, meta) {
        return this.fromJsonObject(JSON.parse(json), meta);
    }
    /**
     * Create a new {@link Domain.StreamAggregateDatum StreamAggregateDatum}
     * instance from an array parsed from a stream datum JSON string.
     *
     * The array must have been parsed from JSON that was encoded the same way
     * {@link Domain.StreamAggregateDatum#toJsonEncoding toJsonEncoding()} does.
     *
     * @param data - the array parsed from JSON
     * @param meta - a metadata instance or metadata registry to decode with
     * @returns the stream datum instance
     */
    static fromJsonObject(data, meta) {
        let i, len, m, iProps, aProps, sProps, tags;
        if (!(Array.isArray(data) && data.length > 1)) {
            return undefined;
        }
        if (typeof data[0] === "string") {
            // treat as an embedded stream ID stream datum
            m =
                meta instanceof DatumStreamMetadata
                    ? meta
                    : meta instanceof DatumStreamMetadataRegistry
                        ? meta.metadataForStreamId(data[0])
                        : undefined;
        }
        else {
            // treat as a registry-indexed stream datum
            m =
                meta instanceof DatumStreamMetadata
                    ? meta
                    : meta instanceof DatumStreamMetadataRegistry
                        ? meta.metadataAt(data[0])
                        : undefined;
        }
        if (!m) {
            return undefined;
        }
        i = 2;
        len = m.instantaneousLength;
        if (len > 0) {
            iProps = data.slice(i, i + len);
            i += len;
        }
        len = m.accumulatingLength;
        if (len > 0) {
            aProps = data.slice(i, i + len);
            i += len;
        }
        len = m.statusLength;
        if (len > 0) {
            sProps = data.slice(i, i + len);
            i += len;
        }
        if (i < data.length) {
            tags = new Set(data.slice(i));
        }
        // to support StreamDatumMetadataMixin we pass meta as additional argument
        return new this(m.streamId, data[1], iProps, aProps, sProps, tags, meta);
    }
}

function populateProperties(obj, names, values) {
    if (!(Array.isArray(names) && Array.isArray(values))) {
        return;
    }
    let val, name;
    for (let i = 0, len = Math.min(names.length, values.length); i < len; i += 1) {
        val = values[i];
        if (val !== undefined && val !== null) {
            name = names[i];
            if (!Object.prototype.hasOwnProperty.call(obj, name)) {
                obj[name] = val;
            }
        }
    }
}
/**
 * A stream datum entity.
 *
 * A stream datum is a datum without any metadata describing the datum property names.
 * The instantantaneous, accumulating, and status property values are stored as the array
 * fields `iProps`, `aProps`, and `sProps`. A {@link Domain.DatumStreamMetadata DatumStreamMetadata}
 * object is required to associate names with these arrays.
 */
class StreamDatum {
    /** The stream ID. */
    streamId;
    /** The timestamp. */
    ts;
    /** The instantaneous property values. */
    iProps;
    /** The accumulating property values. */
    aProps;
    /** The status property values. */
    sProps;
    /** The tag values. */
    tags;
    /** Attached metadata. */
    meta;
    /**
     * Constructor.
     * @param streamId - the datum stream ID
     * @param ts - the datum timestamp, either as a `Date` instance or a form suitable for constructing as `new Date(ts)`
     * @param iProps - the instantaneous property values
     * @param aProps - the accumulating property values
     * @param sProps - the status property values
     * @param tags - the tag values
     * @param meta - optional metadata to attach, or a metadata registry to resolve metadata based on the given `streamId`
     */
    constructor(streamId, ts, iProps, aProps, sProps, tags, meta) {
        this.streamId = streamId;
        this.ts = ts instanceof Date ? ts : new Date(ts);
        this.iProps = iProps;
        this.aProps = aProps;
        this.sProps = sProps;
        this.tags = tags
            ? tags instanceof Set
                ? tags
                : new Set(tags)
            : undefined;
        this.meta =
            meta instanceof DatumStreamMetadataRegistry
                ? meta.metadataForStreamId(streamId)
                : meta instanceof DatumStreamMetadata
                    ? meta
                    : undefined;
        if (this.constructor === StreamDatum) {
            Object.freeze(this);
        }
    }
    /**
     * @inheritdoc
     */
    get date() {
        return this.ts;
    }
    /**
     * @inheritdoc
     */
    get metadata() {
        return this.meta;
    }
    /**
     * @inheritdoc
     */
    propertyValuesForType(samplesType) {
        if (DatumSamplesTypes.Instantaneous.equals(samplesType)) {
            return this.iProps;
        }
        else if (DatumSamplesTypes.Accumulating.equals(samplesType)) {
            return this.aProps;
        }
        else if (DatumSamplesTypes.Status.equals(samplesType)) {
            return this.sProps;
        }
        else if (DatumSamplesTypes.Tag.equals(samplesType)) {
            return this.tags;
        }
        return undefined;
    }
    /**
     * Get this instance as a simple object.
     *
     * The following basic properties will be set on the returned object:
     *
     *  * `streamId` - the stream ID
     *  * `date` - the timestamp
     *  * `sourceId` - the metadata source ID
     *  * `nodeId` or `locationId` - either the node ID or location ID from the metadata
     *  * `tags` - any tags (as an Array)
     *
     * Beyond that, all instantaneous, accumulating, and status properties will be included.
     * If duplicate property names exist between the different classifications, the first-available
     * value will be used.
     *
     * @param meta - a metadata instance or metadata registry to encode the property names with;
     *     falls back to the `meta` class property if not provided
     * @returns an object populated with all available properties
     */
    toObject(meta) {
        const m = meta instanceof DatumStreamMetadataRegistry
            ? meta.metadataForStreamId(this.streamId)
            : meta instanceof DatumStreamMetadata
                ? meta
                : this.meta;
        if (!m) {
            return undefined;
        }
        const obj = {
            streamId: this.streamId,
            date: this.ts,
            sourceId: m.sourceId,
        };
        if (m.nodeId !== undefined) {
            obj.nodeId = m.nodeId;
        }
        else if (m.locationId !== undefined) {
            obj.locationId = m.locationId;
        }
        if (this.tags) {
            obj.tags = Array.from(this.tags);
        }
        populateProperties(obj, m.instantaneousNames, this.iProps);
        populateProperties(obj, m.accumulatingNames, this.aProps);
        populateProperties(obj, m.statusNames, this.sProps);
        return obj;
    }
    /**
     * Get this object as a standard JSON encoded string value.
     *
     * This method returns the JSON form of the result of {@link Domain.StreamDatum#toJsonObject #toJsonObject()}.
     *
     * @param registry a stream metadata registry to encode as a registry-indexed stream datum
     * @return the JSON encoded string
     */
    toJsonEncoding(registry) {
        return JSON.stringify(this.toJsonObject(registry));
    }
    /**
     * Get this object as an array suitable for encoding into a standard stream datum JSON string.
     *
     * This method can encode the datum into an array using one of two ways, depending on whether the `registry` argument is provided.
     * When provided, the first array element will be the stream metadata index based on calling
     * {@link Util.DatumStreamMetadataRegistry#indexOfMetadataStreamId indexOfMetadataStreamId()}.
     * Otherwise the first array element will be the stream ID itself.
     *
     * For example if a registry is used, the resulting array might look like this:
     *
     * ```
     * [0, 1650667326308, 12326, null, 230.19719, 50.19501, 6472722]
     * ```
     *
     * while without a registry the array might look like this:
     *
     * ```
     * ["7714f762-2361-4ec2-98ab-7e96807b32a6", 1650667326308, 12326, null, 230.19719, 50.19501, 6472722]
     * ```
     *
     * @param registry a stream metadata registry to encode as a registry-indexed stream datum
     * @return the datum stream array object
     */
    toJsonObject(registry) {
        const result = [
            registry instanceof DatumStreamMetadataRegistry
                ? registry.indexOfMetadataStreamId(this.streamId)
                : this.streamId,
            this.ts.getTime(),
        ];
        pushValues(result, this.iProps);
        pushValues(result, this.aProps);
        pushValues(result, this.sProps);
        pushValues(result, this.tags);
        return result;
    }
    /**
     * Parse a JSON string into a {@link Domain.StreamDatum StreamDatum} instance.
     *
     * The JSON must be encoded the same way {@link Domain.StreamDatum#toJsonEncoding toJsonEncoding()} does.
     *
     * @param json - the JSON to parse
     * @param meta - a metadata instance or metadata registry to decode with
     * @returns the stream datum instance
     */
    static fromJsonEncoding(json, meta) {
        return this.fromJsonObject(JSON.parse(json), meta);
    }
    /**
     * Create a new {@link Domain.StreamDatum StreamDatum} instance from an array parsed from a stream datum JSON string.
     *
     * The array must have been parsed from JSON that was encoded the same way {@link Domain.StreamDatum#toJsonEncoding StreamDatum#toJsonEncoding()} does.
     *
     * @param data the array parsed from JSON
     * @param meta a metadata instance or metadata registry to decode with
     * @returns the stream datum instance
     */
    static fromJsonObject(data, meta) {
        let i, len, m, iProps, aProps, sProps, tags;
        if (!(Array.isArray(data) && data.length > 1)) {
            return undefined;
        }
        if (typeof data[0] === "string") {
            // treat as an embedded stream ID stream datum
            m =
                meta instanceof DatumStreamMetadata
                    ? meta
                    : meta instanceof DatumStreamMetadataRegistry
                        ? meta.metadataForStreamId(data[0])
                        : undefined;
        }
        else {
            // treat as a registry-indexed stream datum
            m =
                meta instanceof DatumStreamMetadata
                    ? meta
                    : meta instanceof DatumStreamMetadataRegistry
                        ? meta.metadataAt(data[0])
                        : undefined;
        }
        if (!m) {
            return undefined;
        }
        const ts = new Date(data[1]);
        i = 2;
        len = m.instantaneousLength;
        if (len > 0) {
            iProps = data.slice(i, i + len);
            i += len;
        }
        len = m.accumulatingLength;
        if (len > 0) {
            aProps = data.slice(i, i + len);
            i += len;
        }
        len = m.statusLength;
        if (len > 0) {
            sProps = data.slice(i, i + len);
            i += len;
        }
        if (i < data.length) {
            tags = new Set(data.slice(i));
        }
        // to support StreamDatumMetadataMixin we pass meta as additional argument
        return new this(m.streamId, ts, iProps, aProps, sProps, tags, meta);
    }
}

/**
 * Get a datum instance from a stream data array.
 *
 * @param data - the datum stream data array (or JSON array value) to create a datum instance
 * @param meta - a metadata instance or metadata registry to decode with
 * @returns the datum, or `null` if one cannot be created
 */
function datumForStreamData(data, meta) {
    if (typeof data === "string") {
        data = JSON.parse(data);
    }
    if (!Array.isArray(data) || data.length < 2) {
        return undefined;
    }
    return Array.isArray(data[1])
        ? StreamAggregateDatum.fromJsonObject(data, meta)
        : StreamDatum.fromJsonObject(data, meta);
}
/**
 * Get a date associated with a "datum" style object.
 *
 * This function will return a `Date` instance found via a property on `d` according to these rules:
 *
 *  1. `date` - assumed to be a `Date` object already and returned directly
 *  2. `localDate` - a string in `yyyy-MM-dd` form, optionally with a string
 *     `localTime` property for an associated time in `HH:mm` form, treated as UTC
 *  3. `created` - a string in `yyyy-MM-dd HH:mm:ss.SSS'Z'` or `yyyy-MM-dd'T'HH:mm:ss.SSS'Z'` form
 *
 * These properties are commonly returned in results from the SolarNetwork API, and thus
 * this method is a handy way to get the dates for those objects.
 *
 * **Note** that the `localDate` and `localTime` values are parsed as UTC. When formatted the
 * date for display they should be formatted in UTC as well to preserve the expected value.
 *
 * @param d - the datum object to extract a date from
 * @returns the extracted date, or `null` if no date could be extracted
 */
function datumDate(d) {
    if (!d) {
        return null;
    }
    if (d.date instanceof Date) {
        return d.date;
    }
    else if (d.localDate) {
        return dateTimeParse(d.localDate + (d.localTime ? " " + d.localTime : " 00:00"));
    }
    else if (d.created) {
        return dateParser(d.created);
    }
    return null;
}
/**
 * Normalize a data array of time series data based on an aggregate time step.
 *
 * This method is useful for "filling in" gaps of data in situations where something expects
 * the data include placeholders for the gaps. Charting applications often expect this, for
 * example.
 *
 * Each element in the `data` array is expected to provide a `date` property that is a `Date`
 * object. When gaps are discovered in the array, "filler" objects will be inserted with
 * an approprate `date` value and all other properties copied from the previous element but
 * set to `null`.
 *
 * Here's an example where a new element is added to an array to fill in a missing time slot:
 *
 * ```
 * const queryData = [
 *     {date : new Date('2018-05-05T11:00Z'), Generation : 357, Consumption: 345},
 *     {date : new Date('2018-05-05T12:00Z'), Generation : 1023, Consumption: 678}
 * ]
 *
 * timeNormalizeDataArray(queryData, Aggregations.ThirtyMinute);
 * ```
 *
 * Then `queryData` would look like this:
 *
 * ```
 * [
 *     {date : new Date('2018-05-05T11:00Z'), Generation : 357, Consumption: 345},
 *     {date : new Date('2018-05-05T11:30Z'), Generation : null, Consumption: null},
 *     {date : new Date('2018-05-05T12:00Z'), Generation : 1023, Consumption: 678}
 * ]
 * ```
 *
 * @param data - the raw data returned from SolarNetwork; this array is modified in-place
 * @param aggregate - the expected aggregate level of the data
 */
function timeNormalizeDataArray(data, aggregate) {
    const aggMillseconds = aggregate.level * 1000;
    if (!Array.isArray(data) || data.length < 2) {
        return data;
    }
    let i = 0;
    while (i < data.length - 1) {
        const d = data[i];
        const currTime = d.date.getTime();
        const expectedNextTime = currTime + aggMillseconds;
        const nextTime = data[i + 1].date.getTime();
        if (nextTime > expectedNextTime) {
            const fill = [i + 1, 0];
            for (let fillTime = currTime + aggMillseconds; fillTime < nextTime; fillTime += aggMillseconds) {
                const f = Object.create(Object.getPrototypeOf(d), Object.getOwnPropertyDescriptors(d));
                for (const p in f) {
                    f[p] = null;
                }
                f.date = new Date(fillTime);
                fill.push(f);
            }
            Array.prototype.splice.apply(data, fill);
            i += fill.length;
        }
        i += 1;
    }
}
/**
 * A callback function that operates on a nested data layer datum object.
 *
 * @callback module:data~NestedDataOperatorFunction
 * @param {object} datum the datum object being operated on
 * @param {string} key the layer key the datum object is a member of
 * @param {object} [prevDatum] the previous datum object in the layer, if available
 * @returns {void}
 */
/**
 * Normalize the data arrays resulting from a `d3.nest` operation so that all group
 * value arrays have the same number of elements, based on a Date property named
 * `date`.
 *
 * The data values are assumed to be sorted by `date` already, and are modified in-place.
 * This makes the data suitable to passing to `d3.stack`, which expects all stack data
 * arrays to have the same number of values, for the same keys. When querying for data
 * in SolarNetwork there might be gaps in the results, so this function can be used to
 * "fill in" those gaps with "dummy" values so that there are no more gaps.
 *
 * Filled-in data objects are automatically populated with an appropriate `date` property
 * and a `sourceId` property taken from the `key` of the layer the gap if found in. You
 * can pass a `fillTemplate` object with static properties to also include on all filled-in
 * data objects. You can also pass a `fillFn` function to populate the filled-in objects
 * with dynamic data.
 *
 * For example, given:
 *
 * ```
 * const layerData = [
 *   { key : 'A', values : [{date : new Date('2011-12-02 12:00')}, {date : new Date('2011-12-02 12:10')}] },
 *   { key : 'B', values : [{date : new Date('2011-12-02 12:00')}] }
 * ];
 *
 * normalizeNestedStackDataByDate(layerData);
 * ```
 *
 * The `layerData` would be modified in-place and look like this (notice the filled in second data value in the **B** group):
 *
 * ```
 * [
 *   { key : 'A', values : [{date : new Date('2011-12-02 12:00')}, {date : new Date('2011-12-02 12:10')}] },
 *   { key : 'B', values : [{date : new Date('2011-12-02 12:00')}, {date : new Date('2011-12-02 12:10'), sourceId : 'B'}] }
 * ]
 * ```
 *
 * @param layerData - An array of objects with `key` and `values` properties, as returned from `d3.nest().entries()`
 * @param fillTemplate - An object to use as a template for any filled-in data objects.
 *                       The `date` property will be populated automatically, and a `sourceId`
 *                       property will be populated by the layer's `key`.
 * @param fillFn - An optional function to populate filled-in data objects with.
 *                 This function is invoked **after** populating any `fillTemplate` values.
 */
function normalizeNestedStackDataByDate(layerData, fillTemplate, fillFn) {
    const jMax = layerData.length - 1;
    let i = 0, j, k, dummy, prop, copyIndex;
    // fill in "holes" for each stack, if more than one stack. we assume data already sorted by date
    if (jMax > 0) {
        while (i <
            max(layerData.map(function (e) {
                return e.values.length;
            }))) {
            dummy = undefined;
            for (j = 0; j <= jMax; j++) {
                if (layerData[j].values.length <= i) {
                    continue;
                }
                if (j < jMax) {
                    k = j + 1;
                }
                else {
                    k = 0;
                }
                if (layerData[k].values.length <= i ||
                    layerData[j].values[i].date.getTime() <
                        layerData[k].values[i].date.getTime()) {
                    dummy = {
                        date: layerData[j].values[i].date,
                        sourceId: layerData[k].key,
                    };
                    if (fillTemplate) {
                        for (prop in fillTemplate) {
                            if (Object.prototype.hasOwnProperty.call(fillTemplate, prop)) {
                                dummy[prop] = fillTemplate[prop];
                            }
                        }
                    }
                    if (fillFn) {
                        copyIndex =
                            i > 0 && i <= layerData[k].values.length
                                ? i - 1
                                : null;
                        fillFn(dummy, layerData[k].key, copyIndex !== null
                            ? layerData[k].values[copyIndex]
                            : undefined);
                    }
                    layerData[k].values.splice(i, 0, dummy);
                }
            }
            if (dummy === undefined) {
                i++;
            }
        }
    }
}
/**
 * Combine the layers resulting from a `d3.nest` operation into a single, aggregated
 * layer.
 *
 * This can be used to combine all sources of a single data type, for example
 * to show all "power" sources as a single layer of chart data. The resulting object
 * has the same structure as the input `layerData` parameter, with just a
 * single layer of data.
 *
 * For example:
 *
 * ```
 * const layerData = [
 *   { key : 'A', values : [{watts : 123, foo : 1}, {watts : 234, foo : 2}] },
 *   { key : 'B', values : [{watts : 345, foo : 3}, {watts : 456, foo : 4}] }
 * ];
 *
 * const result = aggregateNestedDataLayers(layerData,
 *     'A and B', ['foo'], ['watts'], {'combined' : true});
 * ```
 *
 * Then `result` would look like this:
 *
 * ```
 * [
 *   { key : 'A and B', values : [{watts : 468, foo : 1, combined : true},
 *                                {watts : 690, foo : 2, combined : true}] }
 * ]
 * ```
 *
 * @param layerData - An array of objects with `key` and `values` properties, as returned from `d3.nest().entries()`
 * @param resultKey - The `key` property to assign to the returned layer.
 * @param copyProperties - An array of string property names to copy as-is from the **first** layer's data values.
 * @param sumProperties - An array of string property names to add together from **all** layer data.
 * @param staticProperties - Static properties to copy as-is to **all** output data values.
 * @return An array of objects with `key` and `value` properties, the same structure as the provided `layerData` argument
 */
function aggregateNestedDataLayers(layerData, resultKey, copyProperties, sumProperties, staticProperties) {
    // combine all layers into a single source
    const dataLength = layerData.length ? layerData[0].values.length : 0, layerCount = layerData.length, copyPropLength = copyProperties ? copyProperties.length : 0, sumPropLength = sumProperties ? sumProperties.length : 0;
    let i, j, k, d, val, clone, array;
    if (dataLength > 0) {
        array = [];
        for (i = 0; i < dataLength; i += 1) {
            d = layerData[0].values[i];
            clone = {};
            if (staticProperties !== undefined) {
                for (val in staticProperties) {
                    if (Object.prototype.hasOwnProperty.call(staticProperties, val)) {
                        clone[val] = staticProperties[val];
                    }
                }
            }
            for (k = 0; k < copyPropLength; k += 1) {
                clone[copyProperties[k]] = d[copyProperties[k]];
            }
            for (k = 0; k < sumPropLength; k += 1) {
                clone[sumProperties[k]] = 0;
            }
            for (j = 0; j < layerCount; j += 1) {
                for (k = 0; k < sumPropLength; k += 1) {
                    val = layerData[j].values[i][sumProperties[k]];
                    if (val !== undefined) {
                        clone[sumProperties[k]] += val;
                    }
                }
            }
            array.push(clone);
        }
        layerData = [{ key: resultKey, values: array }];
    }
    return layerData;
}
/**
 * Transform raw SolarNetwork timeseries data by combining datum from multiple sources into a single
 * data per time key.
 *
 * This method produces a single array of objects with metric properties derived by grouping
 * that property within a single time slot across one or more source IDs. Conceptually this is
 * similar to {@link Util.Datum.aggregateNestedDataLayers} except groups of source IDs can be
 * produced in the final result.
 *
 * The data will be passed through {@link Util.Datum.normalizeNestedStackDataByDate} so that every
 * result object will contain every configured output group, but missing data will result in a
 * `null` value.
 *
 * Here's an example where two sources `A` and `B` are combined into a single group `Generation`
 * and a third source `C` is passed through as another group `Consumption`:
 *
 * ```
 * const queryData = [
 *     {localDate: '2018-05-05', localTime: '11:00', sourceId: 'A', watts : 123},
 *     {localDate: '2018-05-05', localTime: '11:00', sourceId: 'B', watts : 234},
 *     {localDate: '2018-05-05', localTime: '11:00', sourceId: 'C', watts : 345},
 *     {localDate: '2018-05-05', localTime: '12:00', sourceId: 'A', watts : 456},
 *     {localDate: '2018-05-05', localTime: '12:00', sourceId: 'B', watts : 567},
 *     {localDate: '2018-05-05', localTime: '12:00', sourceId: 'C', watts : 678},
 * ];
 * const sourceMap = new Map([
 *     ['A', 'Generation'],
 *     ['B', 'Generation'],
 *     ['C', 'Consumption'],
 * ]);
 *
 * const result = groupedBySourceMetricDataArray(queryData, 'watts', sourceMap);
 * ```
 *
 * Then `result` would look like this:
 *
 * ```
 * [
 *     {date : new Date('2018-05-05T11:00Z'), Generation : 357, Consumption: 345},
 *     {date : new Date('2018-05-05T12:00Z'), Generation : 1023, Consumption: 678}
 * ]
 * ```
 *
 * @param data - the raw data returned from SolarNetwork
 * @param metricName - the datum property name to extract
 * @param sourceIdMap - an optional mapping of input source IDs to output source IDs; this can be used
 *     to control the grouping of data, by mapping multiple input source IDs to the same
 *     output source ID
 * @param aggFn - an optional aggregate function to apply to the metric values;
 *     defaults to `d3.sum`; **note** that the function will be passed an array of input
 *     data objects, not metric values
 * @returns array of datum objects, each with a date and one metric value per source ID
 */
function groupedBySourceMetricDataArray(data, metricName, sourceIdMap, aggFn) {
    const metricExtractorFn = function metricExtractor(d) {
        return d[metricName];
    };
    const rollupFn = typeof aggFn === "function"
        ? aggFn
        : sum;
    const layerData = nest()
        // group first by source
        .key((d) => {
        const sourceId = d.sourceId;
        return sourceIdMap && sourceIdMap.has(sourceId)
            ? sourceIdMap.get(sourceId)
            : sourceId;
    })
        .sortKeys(ascending)
        // group second by date
        .key((d) => {
        return d.localDate + " " + d.localTime;
    })
        // sum desired property in date group
        .rollup((values) => {
        const d = values[0];
        const r = {
            date: datumDate(d),
        };
        let metricKey = d.sourceId;
        if (sourceIdMap && sourceIdMap.has(metricKey)) {
            metricKey = sourceIdMap.get(metricKey);
        }
        r[metricKey] = rollupFn(values, metricExtractorFn);
        return r;
    })
        // un-nest to single group by source
        .entries(data)
        .map(function (layer) {
        return {
            key: layer.key,
            values: layer.values.map(function (d) {
                return d.value;
            }),
        };
    });
    // ensure all layers have the same time keys
    normalizeNestedStackDataByDate(layerData, undefined, (d, key) => {
        // make sure filled-in data has the metric property defined
        d[key] = null;
    });
    // reduce to single array with multiple metric properties
    return layerData.reduce(function (combined, layer) {
        if (!combined) {
            return layer.values;
        }
        combined.forEach(function (d, i) {
            const v = layer.values[i][layer.key];
            d[layer.key] = v;
        });
        return combined;
    }, null);
}
/**
 * Convert a path wildcard pattern into a regular expression.
 *
 * This can be used to convert source ID wildcard patterns into regular expressions.
 *
 * @param pat the wildcard pattern to convert into a regular expression
 * @returns the regular expression, or `undefined` if `pat` is `undefined`
 */
function wildcardPatternToRegExp(pat) {
    if (!pat) {
        return undefined;
    }
    // Escape special regex characters
    let regex = pat.replace(/([!$()+.:<=>[\]^{|}-])/g, "\\$1");
    // Convert '?' to '[^/]'
    regex = regex.replace(/\?/g, "[^/]");
    // Convert single '*' to '[^/]*'
    regex = regex.replace(/(?<!\*)\*(?!\*)/g, "[^/]*");
    // Convert '**' to '.*'
    regex = regex.replace(/\*\*/g, ".*");
    // Convert '/.*/' to allow missing path segment to match
    regex = regex.replace(/\/\.\*\//g, "(/|/.*/)");
    return new RegExp(`^${regex}$`);
}

var datum = /*#__PURE__*/Object.freeze({
    __proto__: null,
    aggregateNestedDataLayers: aggregateNestedDataLayers,
    datumDate: datumDate,
    datumForStreamData: datumForStreamData,
    groupedBySourceMetricDataArray: groupedBySourceMetricDataArray,
    normalizeNestedStackDataByDate: normalizeNestedStackDataByDate,
    timeNormalizeDataArray: timeNormalizeDataArray,
    wildcardPatternToRegExp: wildcardPatternToRegExp
});

/**
 * An immutable set of security restrictions that can be attached to other objects, like auth tokens.
 *
 * Use the {@link Domain.SecurityPolicyBuilder} to create instances of this class with a fluent API.
 */
class SecurityPolicy {
    #nodeIds;
    #sourceIds;
    #aggregations;
    #minAggregation;
    #locationPrecisions;
    #minLocationPrecision;
    #nodeMetadataPaths;
    #userMetadataPaths;
    /**
     * Constructor.
     *
     * @param nodeIds - the node IDs to restrict to, or `undefined` for no restriction
     * @param sourceIds - the source ID to restrict to, or `undefined` for no restriction
     * @param aggregations - the aggregation names to restrict to, or `undefined` for no restriction
     * @param minAggregation - if specified, a minimum aggregation level that is allowed
     * @param locationPrecisions - the location precision names to restrict to, or `undefined` for no restriction
     * @param minLocationPrecision - if specified, a minimum location precision that is allowed
     * @param nodeMetadataPaths - the `SolarNodeMetadata` paths to restrict to, or `undefined` for no restriction
     * @param userMetadataPaths - the `UserNodeMetadata` paths to restrict to, or `undefined` for no restriction
     */
    constructor(nodeIds, sourceIds, aggregations, minAggregation, locationPrecisions, minLocationPrecision, nodeMetadataPaths, userMetadataPaths) {
        this.#nodeIds = nonEmptySet(nodeIds);
        this.#sourceIds = nonEmptySet(sourceIds);
        this.#aggregations = nonEmptySet(aggregations);
        this.#minAggregation =
            minAggregation instanceof Aggregation ? minAggregation : undefined;
        this.#locationPrecisions = nonEmptySet(locationPrecisions);
        this.#minLocationPrecision =
            minLocationPrecision instanceof LocationPrecision
                ? minLocationPrecision
                : undefined;
        this.#nodeMetadataPaths = nonEmptySet(nodeMetadataPaths);
        this.#userMetadataPaths = nonEmptySet(userMetadataPaths);
        if (this.constructor === SecurityPolicy) {
            Object.freeze(this);
        }
    }
    /**
     * Get the node IDs.
     *
     * @returns the node IDs, or `undefined`
     */
    get nodeIds() {
        return this.#nodeIds;
    }
    /**
     * Get the source IDs.
     *
     * @returns the source IDs, or `undefined`
     */
    get sourceIds() {
        return this.#sourceIds;
    }
    /**
     * Get the aggregations.
     *
     * @returns the aggregations, or `undefined`
     */
    get aggregations() {
        return this.#aggregations;
    }
    /**
     * Get the location precisions.
     *
     * @returns the precisions, or `undefined`
     */
    get locationPrecisions() {
        return this.#locationPrecisions;
    }
    /**
     * Get the minimum aggregation.
     *
     * @returns the minimum aggregation, or `undefined`
     */
    get minAggregation() {
        return this.#minAggregation;
    }
    /**
     * Get the minimum location precision.
     *
     * @returns the minimum precision, or `undefined`
     */
    get minLocationPrecision() {
        return this.#minLocationPrecision;
    }
    /**
     * Get the node metadata paths.
     *
     * @returns the node metadata paths, or `undefined`
     */
    get nodeMetadataPaths() {
        return this.#nodeMetadataPaths;
    }
    /**
     * Get the user metadata paths.
     *
     * @returns the user metadata paths, or `undefined`
     */
    get userMetadataPaths() {
        return this.#userMetadataPaths;
    }
    /**
     * Apply this policy's restrictions on a filter.
     *
     * You can use this method to enforce aspects of a security policy on a `SecurityPolicyFilter`.
     * For example:
     *
     * ```
     * const policy = SecurityPolicy.fromJsonObject({
     *   nodeIds:   [1, 2],
     *   sourceIds: ["/s1/**"]
     * });
     *
     * const filter = policy.restrict({
     *   nodeIds:   new Set([2, 3, 4]),
     *   sourceIds: new Set(["/s1/a", "/s1/a/b", "/s2/a", "/s3/a"])
     * });
     *
     * // now filter contains only the node/source IDs allowed by the policy:
     * {
     *   nodeIds:   new Set([2]),
     *   sourceIds: new Set(["/s1/a", "/s1/a/b"])
     * };
     * ```
     *
     * @param filter the filter to enforce this policy's restrictions on
     * @returns a new filter instance
     */
    restrict(filter) {
        const result = {};
        if (filter.nodeIds) {
            result.nodeIds = this.#nodeIds
                ? intersection(this.#nodeIds, filter.nodeIds)
                : filter.nodeIds;
        }
        if (filter.sourceIds) {
            if (this.#sourceIds) {
                const filteredSourceIds = new Set();
                this.#sourceIds.forEach((pat) => {
                    const regex = wildcardPatternToRegExp(pat);
                    for (const sourceId of filter.sourceIds) {
                        if (regex.test(sourceId)) {
                            filteredSourceIds.add(sourceId);
                        }
                    }
                });
                result.sourceIds = filteredSourceIds;
            }
            else {
                result.sourceIds = filter.sourceIds;
            }
        }
        return result;
    }
    /**
     * Get this object in standard JSON form.
     *
     * An example result looks like this:
     *
     * ```
     * {
     *   "nodeIds": [1,2,3],
     *   "sourceIds": ["a", "b", "c"]
     *   "aggregations": ["Hour"]
     * }
     * ```
     *
     * @return an object, ready for JSON encoding
     */
    toJsonObject() {
        const result = {};
        if (this.#nodeIds) {
            result.nodeIds = Array.from(this.#nodeIds);
        }
        if (this.#sourceIds) {
            result.sourceIds = Array.from(this.#sourceIds);
        }
        if (this.#aggregations) {
            result.aggregations = Array.from(this.#aggregations).map((e) => e.name);
        }
        if (this.#locationPrecisions) {
            result.locationPrecisions = Array.from(this.#locationPrecisions).map((e) => e.name);
        }
        if (this.#minAggregation) {
            result.minAggregation = this.#minAggregation.name;
        }
        if (this.#minLocationPrecision) {
            result.minLocationPrecision = this.#minLocationPrecision.name;
        }
        if (this.#nodeMetadataPaths) {
            result.nodeMetadataPaths = Array.from(this.#nodeMetadataPaths);
        }
        if (this.#userMetadataPaths) {
            result.userMetadataPaths = Array.from(this.#userMetadataPaths);
        }
        return result;
    }
    /**
     * Get this object as a standard JSON encoded string value.
     *
     * This method calls {@link Domain.SecurityPolicy#toJsonObject} and then
     * turns that into a JSON string.
     *
     * @return the JSON encoded string
     * @see {@link Domain.SecurityPolicy#toJsonObject}
     */
    toJsonEncoding() {
        return JSON.stringify(this.toJsonObject());
    }
    /**
     * Parse a JSON string into a {@link Domain.SecurityPolicy} instance.
     *
     * The JSON must be encoded the same way {@link Domain.SecurityPolicy#toJsonEncoding} does.
     *
     * @param json the JSON to parse
     * @returns the new instance, or `undefined` if `json` is `undefined`
     */
    static fromJsonEncoding(json) {
        if (json === undefined) {
            return undefined;
        }
        return this.fromJsonObject(JSON.parse(json));
    }
    /**
     * Create a new instance from an object in standard JSON form.
     *
     * The object must be in the same style as {@link Domain.SecurityPolicy#toJsonObject} produces.
     *
     * @param obj the object in standard JSON form
     * @returns the new instance, or `undefined` if `obj` is `undefined`
     */
    static fromJsonObject(obj) {
        if (!obj) {
            return undefined;
        }
        const builder = new SecurityPolicyBuilder();
        if (obj.nodeIds) {
            builder.withNodeIds(obj.nodeIds);
        }
        if (obj.sourceIds) {
            builder.withSourceIds(obj.sourceIds);
        }
        if (obj.aggregations) {
            builder.withAggregations(obj.aggregations);
        }
        if (obj.minAggregation) {
            builder.withMinAggregation(obj.minAggregation);
        }
        if (obj.locationPrecisions) {
            builder.withLocationPrecisions(obj.locationPrecisions);
        }
        if (obj.minLocationPrecision) {
            builder.withMinLocationPrecision(obj.minLocationPrecision);
        }
        if (obj.nodeMetadataPaths) {
            builder.withNodeMetadataPaths(obj.nodeMetadataPaths);
        }
        if (obj.userMetadataPaths) {
            builder.withUserMetadataPaths(obj.userMetadataPaths);
        }
        return builder.build();
    }
}
const MIN_AGGREGATION_CACHE = new Map();
const MIN_LOCATION_PRECISION_CACHE = new Map();
/**
 * A mutable builder object for {@link Domain.SecurityPolicy} instances.
 */
class SecurityPolicyBuilder {
    nodeIds;
    sourceIds;
    aggregations;
    minAggregation;
    locationPrecisions;
    minLocationPrecision;
    nodeMetadataPaths;
    userMetadataPaths;
    /**
     * Apply all properties from another `SecurityPolicy`.
     *
     * @param policy the `SecurityPolicy` to apply
     * @returns this object
     */
    withPolicy(policy) {
        if (policy) {
            this.withAggregations(policy.aggregations)
                .withMinAggregation(policy.minAggregation)
                .withLocationPrecisions(policy.locationPrecisions)
                .withMinLocationPrecision(policy.minLocationPrecision)
                .withNodeIds(policy.nodeIds)
                .withSourceIds(policy.sourceIds)
                .withNodeMetadataPaths(policy.nodeMetadataPaths)
                .withUserMetadataPaths(policy.userMetadataPaths);
        }
        return this;
    }
    /**
     * Merge all properties from another SecurityPolicy.
     *
     * @param policy the `SecurityPolicy` to merge
     * @returns this object
     */
    addPolicy(policy) {
        if (policy) {
            this.addAggregations(policy.aggregations)
                .addLocationPrecisions(policy.locationPrecisions)
                .addNodeIds(policy.nodeIds)
                .addSourceIds(policy.sourceIds)
                .addNodeMetadataPaths(policy.nodeMetadataPaths)
                .addUserMetadataPaths(policy.userMetadataPaths);
            if (policy.minAggregation) {
                this.withMinAggregation(policy.minAggregation);
            }
            if (policy.minLocationPrecision) {
                this.withMinLocationPrecision(policy.minLocationPrecision);
            }
        }
        return this;
    }
    /**
     * Set the node IDs.
     *
     * @param nodeIds - the node IDs to use
     * @returns this object
     */
    withNodeIds(nodeIds) {
        this.nodeIds = nonEmptySet(nodeIds);
        return this;
    }
    /**
     * Add a set of node IDs.
     *
     * @param nodeIds - the node IDs to add
     * @returns this object
     */
    addNodeIds(nodeIds) {
        return this.withNodeIds(nonEmptyMergedSets(this.nodeIds, nodeIds));
    }
    /**
     * Set the node metadata paths.
     *
     * @param nodeMetadataPaths - the path expressions to use
     * @returns this object
     */
    withNodeMetadataPaths(nodeMetadataPaths) {
        this.nodeMetadataPaths = nonEmptySet(nodeMetadataPaths);
        return this;
    }
    /**
     * Add a set of node metadata paths.
     *
     * @param nodeMetadataPaths - the path expressions to add
     * @returns this object
     */
    addNodeMetadataPaths(nodeMetadataPaths) {
        return this.withNodeMetadataPaths(nonEmptyMergedSets(this.nodeMetadataPaths, nodeMetadataPaths));
    }
    /**
     * Set the user metadata paths.
     *
     * @param userMetadataPaths - the path expressions to use
     * @returns this object
     */
    withUserMetadataPaths(userMetadataPaths) {
        this.userMetadataPaths = nonEmptySet(userMetadataPaths);
        return this;
    }
    /**
     * Add a set of user metadata paths.
     *
     * @param userMetadataPaths - the path expressions to add
     * @returns this object
     */
    addUserMetadataPaths(userMetadataPaths) {
        return this.withUserMetadataPaths(nonEmptyMergedSets(this.userMetadataPaths, userMetadataPaths));
    }
    /**
     * Set the source IDs.
     *
     * @param sourceIds - the source IDs to use
     * @returns this object
     */
    withSourceIds(sourceIds) {
        this.sourceIds = nonEmptySet(sourceIds);
        return this;
    }
    /**
     * Add source IDs.
     *
     * @param sourceIds - the source IDs to add
     * @returns this object
     */
    addSourceIds(sourceIds) {
        return this.withSourceIds(nonEmptyMergedSets(this.sourceIds, sourceIds));
    }
    /**
     * Set the aggregations.
     *
     * @param aggregations - the aggregations to use
     * @returns this object
     */
    withAggregations(aggregations) {
        this.aggregations = this.#resolveAggregations(aggregations);
        return this;
    }
    #resolveAggregations(aggregations) {
        let aggs = nonEmptySet(aggregations);
        if (aggs !== undefined) {
            if (!(aggs.values().next().value instanceof Aggregation)) {
                const aggObjs = new Set();
                aggs.forEach((val) => {
                    const agg = Aggregation.valueOf(val.toString());
                    if (agg) {
                        aggObjs.add(agg);
                    }
                });
                aggs = aggObjs;
            }
        }
        return aggs;
    }
    /**
     * Set the aggregations.
     *
     * @param aggregations - the aggregations to add
     * @returns this object
     */
    addAggregations(aggregations) {
        return this.withAggregations(nonEmptyMergedSets(this.aggregations, this.#resolveAggregations(aggregations)));
    }
    /**
     * Set the location precisions.
     *
     * @param locationPrecisions - the precisions to use
     * @returns this object
     */
    withLocationPrecisions(locationPrecisions) {
        this.locationPrecisions =
            this.#resolveLocationPrecisions(locationPrecisions);
        return this;
    }
    #resolveLocationPrecisions(locationPrecisions) {
        let lPrecs = nonEmptySet(locationPrecisions);
        if (lPrecs !== undefined) {
            if (!(lPrecs.values().next().value instanceof LocationPrecision)) {
                const lPrecsObjs = new Set();
                lPrecs.forEach((val) => {
                    const agg = LocationPrecision.valueOf(val.toString());
                    if (agg) {
                        lPrecsObjs.add(agg);
                    }
                });
                lPrecs = lPrecsObjs;
            }
        }
        return lPrecs;
    }
    /**
     * Add location precisions.
     *
     * @param locationPrecisions - the precisions to add
     * @returns this object
     */
    addLocationPrecisions(locationPrecisions) {
        return this.withLocationPrecisions(nonEmptyMergedSets(this.locationPrecisions, this.#resolveLocationPrecisions(locationPrecisions)));
    }
    /**
     * Set a minimum aggregation level.
     *
     * @param minAggregation - the minimum aggregation level to set
     * @returns this object
     */
    withMinAggregation(minAggregation) {
        this.minAggregation =
            minAggregation instanceof Aggregation
                ? minAggregation
                : Aggregation.valueOf(minAggregation);
        return this;
    }
    /**
     * Build the effective aggregation level set from the policy settings.
     *
     * This computes a set of aggregation levels based on the configured `minAggregation`
     * and `aggregations` values.
     *
     * @returns the aggregation set
     * @private
     */
    #buildAggregations() {
        const minAggregation = this.minAggregation;
        const aggregations = this.aggregations;
        if (!minAggregation && aggregations && aggregations.size > 0) {
            return aggregations;
        }
        else if (!minAggregation) {
            return undefined;
        }
        return Aggregation.minimumEnumSet(minAggregation, MIN_AGGREGATION_CACHE);
    }
    /**
     * Treat the configured `locationPrecisions` set as a single
     * minimum value or a list of exact values.
     *
     * By default if `locationPrecisions` is configured with a single
     * value it will be treated as a <em>minimum</em> value, and any
     * {@link Domain.LocationPrecision} with a {@link Domain.LocationPrecision#precision} equal
     * to or higher than that value's level will be included in the generated
     * {@link Domain.SecurityPolicy#locationPrecisions} set. Set this to
     * `undefined` to disable that behavior and treat
     * `locationPrecisions` as the exact values to include in the
     * generated {@link Domain.SecurityPolicy#locationPrecisions} set.
     *
     * @param minLocationPrecision -
     *        `undefined` to treat configured location precision values
     *        as-is, or else the minimum threshold
     * @returns this object
     */
    withMinLocationPrecision(minLocationPrecision) {
        this.minLocationPrecision =
            minLocationPrecision instanceof LocationPrecision
                ? minLocationPrecision
                : LocationPrecision.valueOf(minLocationPrecision);
        return this;
    }
    /**
     * Build the effective aggregation level set from the policy settings.
     *
     * This computes a set of location precision levels based on the configured `minLocationPrecision`
     * and `locationPrecisions` values.
     *
     * @returns the precision set
     * @private
     */
    #buildLocationPrecisions() {
        const minLocationPrecision = this.minLocationPrecision;
        const locationPrecisions = this.locationPrecisions;
        if (!minLocationPrecision &&
            locationPrecisions &&
            locationPrecisions.size > 0) {
            return locationPrecisions;
        }
        else if (!minLocationPrecision) {
            return undefined;
        }
        return LocationPrecision.minimumEnumSet(minLocationPrecision, MIN_LOCATION_PRECISION_CACHE);
    }
    /**
     * Create a new {@link SecurityPolicy} out of the properties configured on this builder.
     *
     * @returns {module:domain~SecurityPolicy} the new policy instance
     */
    build() {
        return new SecurityPolicy(this.nodeIds, this.sourceIds, this.#buildAggregations(), this.minAggregation, this.#buildLocationPrecisions(), this.minLocationPrecision, this.nodeMetadataPaths, this.userMetadataPaths);
    }
}

/**
 * An enumeration of supported sky condition names.
 */
var SkyConditionNames;
(function (SkyConditionNames) {
    /** Clear sky. */
    SkyConditionNames["Clear"] = "Clear";
    /** Scattered/few clouds. */
    SkyConditionNames["ScatteredClouds"] = "ScatteredClouds";
    /** Cloudy. */
    SkyConditionNames["Cloudy"] = "Cloudy";
    /** Fog. */
    SkyConditionNames["Fog"] = "Fog";
    /** Drizzle, light rain. */
    SkyConditionNames["Drizzle"] = "Drizzle";
    /** Scattered/few showers, */
    SkyConditionNames["ScatteredShowers"] = "ScatteredShowers";
    /** Showers, light rain. */
    SkyConditionNames["Showers"] = "Showers";
    /** Rain. */
    SkyConditionNames["Rain"] = "Rain";
    /** Hail. */
    SkyConditionNames["Hail"] = "Hail";
    /** Scattered/light snow. */
    SkyConditionNames["ScatteredSnow"] = "ScatteredSnow";
    /** Snow. */
    SkyConditionNames["Snow"] = "Snow";
    /** Storm. */
    SkyConditionNames["Storm"] = "Storm";
    /** Severe strom. */
    SkyConditionNames["SevereStorm"] = "SevereStorm";
    /** Thunder, lightning. */
    SkyConditionNames["Thunder"] = "Thunder";
    /** Windy. */
    SkyConditionNames["Windy"] = "Windy";
    /** Hazy. */
    SkyConditionNames["Hazy"] = "Hazy";
    /** Tornado. */
    SkyConditionNames["Tornado"] = "Tornado";
    /** Hurricane. */
    SkyConditionNames["Hurricane"] = "Hurricane";
    /** Dusty. */
    SkyConditionNames["Dusty"] = "Dusty";
})(SkyConditionNames || (SkyConditionNames = {}));
/**
 * A named sky condition/observation.
 */
class SkyCondition extends BitmaskEnum {
    /**
     * Constructor.
     *
     * @param name - the name
     * @param bitNumber - the bit offset, starting from `1` for the least significant bit
     */
    constructor(name, bitNumber) {
        super(name, bitNumber);
        if (this.constructor === SkyCondition) {
            Object.freeze(this);
        }
    }
    /**
     * Get the sky condition code value.
     *
     * @returns the code
     */
    get code() {
        return this.bitmaskBitNumber;
    }
    /**
     * Get an enum for a code value.
     *
     * @param code - the code to look for
     * @returns {SkyCondition} the enum, or `undefined` if not found
     */
    static forCode(code) {
        return BitmaskEnum.enumForBitNumber(code, SkyConditionValues);
    }
    /**
     * @inheritdoc
     */
    static enumValues() {
        return SkyConditionValues;
    }
}
/**
 * The sky condition enum values array.
 */
const SkyConditionValues = Object.freeze([
    new SkyCondition(SkyConditionNames.Clear, 1),
    new SkyCondition(SkyConditionNames.ScatteredClouds, 2),
    new SkyCondition(SkyConditionNames.Cloudy, 3),
    new SkyCondition(SkyConditionNames.Fog, 4),
    new SkyCondition(SkyConditionNames.Drizzle, 5),
    new SkyCondition(SkyConditionNames.ScatteredShowers, 6),
    new SkyCondition(SkyConditionNames.Showers, 7),
    new SkyCondition(SkyConditionNames.Rain, 8),
    new SkyCondition(SkyConditionNames.Hail, 9),
    new SkyCondition(SkyConditionNames.ScatteredSnow, 10),
    new SkyCondition(SkyConditionNames.Snow, 11),
    new SkyCondition(SkyConditionNames.Storm, 12),
    new SkyCondition(SkyConditionNames.SevereStorm, 13),
    new SkyCondition(SkyConditionNames.Thunder, 14),
    new SkyCondition(SkyConditionNames.Windy, 15),
    new SkyCondition(SkyConditionNames.Hazy, 16),
    new SkyCondition(SkyConditionNames.Tornado, 17),
    new SkyCondition(SkyConditionNames.Hurricane, 18),
    new SkyCondition(SkyConditionNames.Dusty, 19),
]);
/**
 * The enumeration of supported `SkyCondition` values.
 * @see {@link Domain.SkyConditionNames} for the available values
 */
const SkyConditions = SkyCondition.enumsValue(SkyConditionValues);

/**
 * An enumeration of supported aggregation names.
 */
var SshCloseCodeNames;
(function (SshCloseCodeNames) {
    /** Authentication failure. */
    SshCloseCodeNames["AuthenticationFailure"] = "AuthenticationFailure";
})(SshCloseCodeNames || (SshCloseCodeNames = {}));
/**
 * A named socket close code.
 */
class SshCloseCode extends ComparableEnum {
    /**
     * Constructor.
     *
     * @param name the name
     * @param value a value
     */
    constructor(name, value) {
        super(name, value);
        if (this.constructor === SshCloseCode) {
            Object.freeze(this);
        }
    }
    /**
     * @override
     * @inheritdoc
     */
    static enumValues() {
        return SshCloseCodeValues;
    }
}
/**
 * The aggregation enum values array.
 */
const SshCloseCodeValues = Object.freeze([
    new SshCloseCode(SshCloseCodeNames.AuthenticationFailure, 4000),
]);
/**
 * The enumeration of supported `SshCloseCode` values.
 * @see {@link Domain.SshCloseCodeNames} for the available values
 */
const SshCloseCodes = SshCloseCode.enumsValue(SshCloseCodeValues);

/**
 * Settings for a SSH terminal.
 */
class SshTerminalSettings {
    cols;
    lines;
    width;
    height;
    type;
    environment;
    /**
     * Constructor.
     *
     * @param cols the characters width
     * @param lines the number of lines
     * @param width the pixel width
     * @param height the pixel height
     * @param type the terminal type
     * @param environment environment properties to pass to the shell
     */
    constructor(cols = 80, lines = 24, width = 640, height = 480, type = "xterm", environment) {
        this.cols = cols;
        this.lines = lines;
        this.width = width;
        this.height = height;
        this.type = type;
        this.environment =
            environment instanceof Map
                ? environment
                : objectToStringMap(environment);
    }
    /**
     * Get this object in standard JSON form.
     *
     * An example result looks like this:
     *
     * ```json
     * {
     *   "cols": 80,
     *   "lines": 24,
     *   "width": 640,
     *   "height": 480,
     *   "type": "xterm"
     * }
     * ```
     *
     * @return an object, ready for JSON encoding
     */
    toJsonObject() {
        const result = {
            cols: this.cols,
            lines: this.lines,
            width: this.width,
            height: this.height,
            type: this.type,
        };
        if (this.environment && this.environment.size > 0) {
            result.environment = stringMapToObject(this.environment);
        }
        return result;
    }
    /**
     * Get this object as a standard JSON encoded string value.
     *
     * This method calls {@link Domain.SshCommand#toJsonObject} and then
     * turns that into a JSON string.
     *
     * @return the JSON encoded string
     * @see {@link Domain.SshCommand#toJsonObject}
     */
    toJsonEncoding() {
        return JSON.stringify(this.toJsonObject());
    }
    /**
     * Create a new instance from an object in standard JSON form.
     *
     * The object must be in the same style as {@link Domain.SshTerminalSettings#toJsonObject} produces.
     *
     * @param obj the object in standard JSON form
     * @returns the new instance, or `undefined` if `obj` is `undefined`
     */
    static fromJsonObject(obj) {
        if (!obj) {
            return undefined;
        }
        return new SshTerminalSettings(obj.cols, obj.lines, obj.width, obj.height, obj.type, obj.environment);
    }
    /**
     * Parse a JSON string into a {@link Domain.SshTerminalSettings} instance.
     *
     * The JSON must be encoded the same way {@link Domain.SshTerminalSettings#toJsonEncoding} does.
     *
     * @param json the JSON to parse
     * @returns the new instance, or `undefined` if `json` is `undefined`
     */
    static fromJsonEncoding(json) {
        if (json === undefined) {
            return undefined;
        }
        return this.fromJsonObject(JSON.parse(json));
    }
}

/** The command for attaching to an SSH terminal shell. */
const SolarSshCommandAttachSsh = "attach-ssh";
/**
 * A command with data.
 */
class SshCommand {
    #command;
    #data;
    /**
     * Constructor.
     *
     * @param command the command
     * @param data optional data to associate with the command
     */
    constructor(command, data) {
        this.#command = command;
        this.#data = data;
        if (this.constructor === SshCommand) {
            Object.freeze(this);
        }
    }
    /**
     * Create a new `attach-ssh` command instance
     *
     * @param authorization a pre-computed SNWS2 authorization header, which must match
     *        exactly a `GET` request to the `/solaruser/api/v1/sec/nodes/meta/:nodeId`
     *        path using the provided authorization date and, node ID.
     * @param authorizationDate the date used in the `authorization` value
     * @param username the SSH username to use
     * @param password the SSH password to use
     * @param terminalSettings optional terminal settings to use
     */
    static attachSshCommand(authorization, authorizationDate, username, password, terminalSettings) {
        const data = {};
        data["authorization"] = authorization;
        data["authorization-date"] =
            authorizationDate instanceof Date
                ? authorizationDate.getTime()
                : authorizationDate;
        data["username"] = username;
        data["password"] = password;
        if (terminalSettings instanceof SshTerminalSettings) {
            const termOpts = terminalSettings.toJsonObject();
            for (const prop of Object.keys(termOpts)) {
                if (data[prop] === undefined) {
                    data[prop] = termOpts[prop];
                }
            }
        }
        return new SshCommand(SolarSshCommandAttachSsh, data);
    }
    /**
     * Get the command.
     *
     * @returns the command
     */
    get command() {
        return this.#command;
    }
    /**
     * Get the optional data.
     *
     * @returns the data, or `undefined`
     */
    get data() {
        return this.#data;
    }
    /**
     * Get this object in standard JSON form.
     *
     * An example result looks like this:
     *
     * ```json
     * {
     *   "cmd": "attach-ssh",
     *   "data": {"foo": "bar"}
     * }
     * ```
     *
     * If the `data` value has a `toJsonObject()` function, that will be invoked
     * and used in the result. Otherwise the `data` value will be included as-is.
     *
     * @return an object, ready for JSON encoding
     */
    toJsonObject() {
        const result = {
            cmd: this.#command,
        };
        if (this.#data) {
            if (typeof this.#data.toJsonObject === "function") {
                result.data = this.#data.toJsonObject();
            }
            else {
                result.data = this.#data;
            }
        }
        return result;
    }
    /**
     * Get this object as a standard JSON encoded string value.
     *
     * This method calls {@link Domain.SshCommand#toJsonObject} and then
     * turns that into a JSON string.
     *
     * @return the JSON encoded string
     * @see {@link Domain.SshCommand#toJsonObject}
     */
    toJsonEncoding() {
        return JSON.stringify(this.toJsonObject());
    }
    /**
     * Create a new instance from an object in standard JSON form.
     *
     * The object must be in the same style as {@link Domain.SshCommand#toJsonObject} produces.
     *
     * @param obj the object in standard JSON form
     * @param dataDecodeFn an optional function to decode the `obj.data` property with
     * @returns the new instance, or `undefined` if `obj` is `undefined`
     */
    static fromJsonObject(obj, dataDecodeFn) {
        if (!(obj && obj.cmd)) {
            return undefined;
        }
        const cmd = obj.cmd;
        const data = obj.data;
        return new SshCommand(cmd, dataDecodeFn ? dataDecodeFn(data) : data);
    }
    /**
     * Parse a JSON string into a {@link Domain.SshCommand} instance.
     *
     * The JSON must be encoded the same way {@link Domain.SshCommand#toJsonEncoding} does.
     *
     * @param json the JSON to parse
     * @param dataDecodeFn an optional function to decode the `obj.data` property with
     * @returns the new instance, or `undefined` if `json` is `undefined`
     */
    static fromJsonEncoding(json, dataDecodeFn) {
        if (json === undefined) {
            return undefined;
        }
        return this.fromJsonObject(JSON.parse(json), dataDecodeFn);
    }
}

/**
 * A SolarSSH session object.
 */
class SshSession {
    created;
    sessionId;
    nodeId;
    sshHost;
    sshPort;
    reverseSshPort;
    startInstructionId;
    stopInstructionId;
    /**
     * Constructor.
     *
     * @param created the creation date, or a number of string suitable for passing to the `Date` constructor
     * @param sessionId the unique session ID
     * @param nodeId the node ID
     * @param sshHost the SSH host name
     * @param sshPort the SSH port
     * @param reverseSshPort the reverse SSH port
     * @param startInstructionId the `StartRemoteSsh` instruction ID
     * @param stopInstructionId the `StopRemoteSsh` instruction ID
     */
    constructor(created, sessionId, nodeId, sshHost, sshPort, reverseSshPort, startInstructionId, stopInstructionId) {
        this.created =
            created instanceof Date ? created : new Date(created);
        this.sessionId = sessionId;
        this.nodeId = nodeId;
        this.sshHost = sshHost;
        this.sshPort = sshPort;
        this.reverseSshPort = reverseSshPort;
        this.startInstructionId = startInstructionId;
        this.stopInstructionId = stopInstructionId;
        if (this.constructor === SshSession) {
            Object.freeze(this);
        }
    }
    /**
     * Get this object in standard JSON form.
     *
     * An example result looks like this:
     *
     * ```json
     * {
     *   "sessionId": "123-abc",
     *   "created": 123456789,
     *   "nodeId": 123,
     *   "host": "ssh.solarnetwork.net",
     *   "port": 9082,
     *   "reversePort": 42000
     * }
     * ```
     *
     * If the `data` value has a `toJsonObject()` function, that will be invoked
     * and used in the result. Otherwise the `data` value will be included as-is.
     *
     * @return an object, ready for JSON encoding
     */
    toJsonObject() {
        const result = {};
        if (this.sessionId) {
            result["sessionId"] = this.sessionId;
        }
        if (this.created) {
            result["created"] = this.created.getTime();
        }
        if (this.nodeId) {
            result["nodeId"] = this.nodeId;
        }
        if (this.sshHost) {
            result["host"] = this.sshHost;
        }
        if (this.sshPort) {
            result["port"] = this.sshPort;
        }
        if (this.reverseSshPort) {
            result["reversePort"] = this.reverseSshPort;
        }
        if (this.startInstructionId) {
            result["startInstructionId"] = this.startInstructionId;
        }
        if (this.stopInstructionId) {
            result["stopInstructionId"] = this.stopInstructionId;
        }
        return result;
    }
    /**
     * Get this object as a standard JSON encoded string value.
     *
     * This method calls {@link Domain.SshSession#toJsonObject} and then
     * turns that into a JSON string.
     *
     * @return the JSON encoded string
     * @see {@link Domain.SshSession#toJsonObject}
     */
    toJsonEncoding() {
        return JSON.stringify(this.toJsonObject());
    }
    /**
     * Create a new instance from an object in standard JSON form.
     *
     * The object must be in the same style as {@link Domain.SshSession#toJsonObject} produces.
     *
     * @param obj the object in standard JSON form
     * @returns the new instance, or `undefined` if `obj` is `undefined`
     */
    static fromJsonObject(obj) {
        if (!obj) {
            return undefined;
        }
        return new SshSession(obj.created, obj.sessionId, obj.nodeId, obj.host, obj.port, obj.reversePort, obj.startInstructionId, obj.stopInstructionId);
    }
    /**
     * Parse a JSON string into a {@link Domain.SshSession} instance.
     *
     * The JSON must be encoded the same way {@link Domain.SshSession#toJsonEncoding} does.
     *
     * @param json the JSON to parse
     * @returns the new instance, or `undefined` if `json` is `undefined`
     */
    static fromJsonEncoding(json) {
        if (json === undefined) {
            return undefined;
        }
        return this.fromJsonObject(JSON.parse(json));
    }
}

/** An enumeration of user metadata filter keys. */
var UserMetadataFilterKeys;
(function (UserMetadataFilterKeys) {
    UserMetadataFilterKeys["Tags"] = "tags";
    UserMetadataFilterKeys["UserId"] = "userId";
    UserMetadataFilterKeys["UserIds"] = "userIds";
})(UserMetadataFilterKeys || (UserMetadataFilterKeys = {}));
/**
 * A filter criteria object for user metadata.
 *
 * This filter is used to query user metadata.
 */
class UserMetadataFilter extends PropMap {
    /**
     * Constructor.
     * @param props - initial property values
     */
    constructor(props) {
        super(props);
    }
    /**
     * A user ID.
     *
     * This manages the first available location ID from the `userIds` property.
     */
    get userId() {
        const userIds = this.userIds;
        return Array.isArray(userIds) && userIds.length > 0
            ? userIds[0]
            : undefined;
    }
    set userId(userId) {
        if (userId) {
            this.userIds = [userId];
        }
        else {
            this.userIds = null;
        }
    }
    /**
     * An array of user IDs.
     */
    get userIds() {
        return this.prop(UserMetadataFilterKeys.UserIds);
    }
    set userIds(userIds) {
        this.prop(UserMetadataFilterKeys.UserIds, Array.isArray(userIds) ? userIds : null);
    }
    /**
     * An array of tags.
     */
    get tags() {
        return this.prop(UserMetadataFilterKeys.Tags);
    }
    set tags(val) {
        this.prop(UserMetadataFilterKeys.Tags, Array.isArray(val) ? val : null);
    }
    /**
     * @override
     * @inheritdoc
     */
    toUriEncoding(propertyName, callbackFn) {
        return super.toUriEncoding(propertyName, callbackFn || userMetadataFilterUriEncodingPropertyMapper);
    }
}
/**
 * Map UserMetadataFilter properties for URI encoding.
 *
 * @param key - the property key
 * @param value - the property value
 * @returns 2 or 3-element array for mapped key+value+forced-multi-key, `null` to skip, or `key` to keep as-is
 * @private
 */
function userMetadataFilterUriEncodingPropertyMapper(key, value) {
    if (key === UserMetadataFilterKeys.UserIds) {
        // check for singleton array value, and re-map to singular property by chopping of "s"
        if (Array.isArray(value) && value.length === 1) {
            return [key.substring(0, key.length - 1), value[0]];
        }
    }
    return key;
}

var index$3 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Aggregation: Aggregation,
    get AggregationNames () { return AggregationNames; },
    Aggregations: Aggregations,
    AuthTokenStatus: AuthTokenStatus,
    get AuthTokenStatusNames () { return AuthTokenStatusNames; },
    AuthTokenStatuses: AuthTokenStatuses,
    AuthTokenType: AuthTokenType,
    get AuthTokenTypeNames () { return AuthTokenTypeNames; },
    AuthTokenTypes: AuthTokenTypes,
    CombiningType: CombiningType,
    get CombiningTypeNames () { return CombiningTypeNames; },
    CombiningTypes: CombiningTypes,
    get CommonInstructionTopicName () { return CommonInstructionTopicName; },
    Datum: Datum,
    DatumAuxiliaryType: DatumAuxiliaryType,
    get DatumAuxiliaryTypeNames () { return DatumAuxiliaryTypeNames; },
    DatumAuxiliaryTypes: DatumAuxiliaryTypes,
    DatumFilter: DatumFilter,
    get DatumFilterKeys () { return DatumFilterKeys; },
    DatumFilterPropertyNames: DatumFilterPropertyNames,
    DatumFilterPropertyNamesSet: DatumFilterPropertyNamesSet,
    DatumIdentifier: DatumIdentifier,
    DatumReadingType: DatumReadingType,
    get DatumReadingTypeNames () { return DatumReadingTypeNames; },
    DatumReadingTypes: DatumReadingTypes,
    DatumRollupType: DatumRollupType,
    get DatumRollupTypeNames () { return DatumRollupTypeNames; },
    DatumRollupTypes: DatumRollupTypes,
    DatumSamplesType: DatumSamplesType,
    get DatumSamplesTypeNames () { return DatumSamplesTypeNames; },
    DatumSamplesTypes: DatumSamplesTypes,
    DatumStreamMetadata: DatumStreamMetadata,
    DatumStreamType: DatumStreamType,
    get DatumStreamTypeNames () { return DatumStreamTypeNames; },
    DatumStreamTypes: DatumStreamTypes,
    DeviceOperatingState: DeviceOperatingState,
    get DeviceOperatingStateNames () { return DeviceOperatingStateNames; },
    DeviceOperatingStates: DeviceOperatingStates,
    GeneralMetadata: GeneralMetadata,
    Instruction: Instruction,
    InstructionState: InstructionState,
    get InstructionStateNames () { return InstructionStateNames; },
    InstructionStates: InstructionStates,
    Location: Location,
    get LocationKeys () { return LocationKeys; },
    LocationPrecision: LocationPrecision,
    get LocationPrecisionNames () { return LocationPrecisionNames; },
    LocationPrecisions: LocationPrecisions,
    LocationPropertyNames: LocationPropertyNames,
    LocationPropertyNamesSet: LocationPropertyNamesSet,
    Pagination: Pagination,
    SecurityPolicy: SecurityPolicy,
    SecurityPolicyBuilder: SecurityPolicyBuilder,
    SkyCondition: SkyCondition,
    get SkyConditionNames () { return SkyConditionNames; },
    SkyConditions: SkyConditions,
    SolarSshCommandAttachSsh: SolarSshCommandAttachSsh,
    SortDescriptor: SortDescriptor,
    SshCloseCode: SshCloseCode,
    get SshCloseCodeNames () { return SshCloseCodeNames; },
    SshCloseCodes: SshCloseCodes,
    SshCommand: SshCommand,
    SshSession: SshSession,
    SshTerminalSettings: SshTerminalSettings,
    StreamAggregateDatum: StreamAggregateDatum,
    StreamDatum: StreamDatum,
    UserMetadataFilter: UserMetadataFilter,
    get UserMetadataFilterKeys () { return UserMetadataFilterKeys; }
});

// The Fetch API subset required by DatumLoader
var fetch$1 = fetch;

var fetch$2 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    default: fetch$1
});

/**
 * Create a AuthUrlHelperMixin class.
 *
 * @param superclass - the UrlHelper class to mix onto
 * @returns the mixin class
 * @ignore
 */
const AuthUrlHelperMixin = (superclass) => 
/**
 * A mixin class that adds authentication token support to {@link Net.UrlHelper}.
 *
 * @mixin
 */
class AuthUrlHelperMixin extends superclass {
    /**
     * Generate a URL to get information about the requesting authenticated user.
     *
     * @return the URL to view information about the authenticated user
     */
    whoamiUrl() {
        return this.baseUrl() + "/whoami";
    }
};

/**
 * Create a AuthTokenUrlHelperMixin class.
 *
 * @param superclass - the UrlHelper class to mix onto
 * @returns the mixin class
 * @ignore
 */
const AuthTokenUrlHelperMixin = (superclass) => 
/**
 * A mixin class that adds authentication token support to {@link Net.UrlHelper}.
 *
 * @mixin
 */
class AuthTokenUrlHelperMixin extends superclass {
    /**
     * Generate a URL to refresh the signing key of an authentication token.
     *
     * **Note** this method only works against the `/sec` version of the API endpoint.
     *
     * @param date - the signing date to use, or `null` for the current date
     * @returns the URL
     */
    refreshTokenV2Url(date) {
        return (this.baseUrl() +
            "/auth-tokens/refresh/v2?date=" +
            encodeURIComponent(dateFormat(date || new Date())));
    }
};

/**
 * A case-insensitive, case-preserving string key multi-value map object.
 *
 * This map supports `null` values but ignores attempts to add keys with `undefined` values.
 */
class MultiMap {
    /** Mapping of lower-case header names to {key:X, val:[]} values. */
    #mappings;
    /** List of mappings to maintain insertion order. */
    #mappingNames;
    /**
     * Constructor.
     *
     * @param values - an object who's enumerable properties will be added to this map
     */
    constructor(values) {
        this.#mappings = {};
        this.#mappingNames = [];
        if (values) {
            this.putAll(values);
        }
    }
    /**
     * Add/replace values on a map.
     *
     * @param key - the key to change
     * @param value - the value to add; if `undefined` then nothing will be added
     * @param replace - if `true` then replace all existing values;
     *     if `false` append to any existing values
     * @returns this object
     */
    #addValue(key, value, replace) {
        if (value === undefined) {
            return this;
        }
        const keyLc = key.toLowerCase();
        let mapping = this.#mappings[keyLc];
        if (!mapping) {
            mapping = { key: key, val: [] };
            this.#mappings[keyLc] = mapping;
            this.#mappingNames.push(keyLc);
        }
        if (replace) {
            mapping.val.length = 0;
        }
        if (Array.isArray(value)) {
            const len = value.length;
            for (let i = 0; i < len; i += 1) {
                mapping.val.push(value[i]);
            }
        }
        else {
            mapping.val.push(value);
        }
        return this;
    }
    /**
     * Add a value.
     *
     * This method will append values to existing keys.
     *
     * @param key - the key to use
     * @param value - the value to add; if `undefined` nothing will be added
     */
    add(key, value) {
        return this.#addValue(key, value);
    }
    /**
     * Set a value.
     *
     * This method will replace any existing values with just `value`.
     *
     * @param key - the key to use
     * @param value - the value to set; if `undefined` nothing will be added
     * @returns this object
     */
    put(key, value) {
        return this.#addValue(key, value, true);
    }
    /**
     * Set multiple values.
     *
     * This method will replace any existing values with those provided on `values`.
     *
     * @param values - an object who's enumerable properties will be added to this map
     * @returns this object
     */
    putAll(values) {
        for (const key in values) {
            if (Object.prototype.hasOwnProperty.call(values, key)) {
                this.#addValue(key, values[key], true);
            }
        }
        return this;
    }
    /**
     * Get the values associated with a key.
     *
     * @param key - the key of the values to get
     * @returns the array of values associated with the key, or `undefined` if not available
     */
    value(key) {
        const keyLc = key.toLowerCase();
        const mapping = this.#mappings[keyLc];
        return mapping ? mapping.val : undefined;
    }
    /**
     * Get the first avaialble value assocaited with a key.
     *
     * @param key - the key of the value to get
     * @returns the first available value associated with the key, or `undefined` if not available
     */
    firstValue(key) {
        const values = this.value(key);
        return values && values.length > 0 ? values[0] : undefined;
    }
    /**
     * Remove all properties from this map.
     *
     * @returns this object
     */
    clear() {
        this.#mappingNames.length = 0;
        this.#mappings = {};
        return this;
    }
    /**
     * Remove all values associated with a key.
     *
     * @param key - the key of the values to remove
     * @returns the removed values, or `undefined` if no values were present for the given key
     */
    remove(key) {
        const keyLc = key.toLowerCase();
        const index = this.#mappingNames.indexOf(keyLc);
        const result = this.#mappings[keyLc];
        if (result) {
            delete this.#mappings[keyLc];
            this.#mappingNames.splice(index, 1);
        }
        return result ? result.val : undefined;
    }
    /**
     * Get the number of entries in this map.
     *
     * @returns the number of entries in the map
     */
    size() {
        return this.#mappingNames.length;
    }
    /**
     * Test if the map is empty.
     *
     * @returns `true` if there are no entries in this map
     */
    isEmpty() {
        return this.size() < 1;
    }
    /**
     * Test if there are any values associated with a key.
     *
     * @param key - the key to test
     * @returns `true` if there is at least one value associated with the key
     */
    containsKey(key) {
        return this.value(key) !== undefined;
    }
    /**
     * Get an array of all keys in this map.
     *
     * @returns array of keys in this map, or an empty array if the map is empty
     */
    keySet() {
        const result = [];
        const len = this.size();
        for (let i = 0; i < len; i += 1) {
            result.push(this.#mappings[this.#mappingNames[i]].key);
        }
        return result;
    }
    /**
     * Get the entire mapping as a single-valued `Map` instance.
     *
     * This will return the first avaialble value for every key in the mapping.
     *
     * @returns a new `Map` instance
     */
    mapValue() {
        const result = new Map();
        const len = this.size();
        for (let i = 0; i < len; i += 1) {
            const val = this.#mappings[this.#mappingNames[i]];
            result.set(val.key, val.val[0]);
        }
        return result;
    }
}

/**
 * A configuration utility object.
 *
 * Properties can be get/set by using the {@link Util.Configuration#value} function.
 * Properties added this way become enumerable properties of the `Configuration`
 * instance as well.
 */
class Configuration {
    /** The configuration data. */
    #map;
    /**
     * Constructor.
     *
     * For any properties passed on `initialMap`, {@link Configuration#value} will
     * be called so those properties are defined on this instance.
     *
     * @param initialMap - the optional initial properties to store
     */
    constructor(initialMap) {
        this.#map = new Map();
        if (initialMap !== undefined) {
            this.values(initialMap);
        }
    }
    /**
     * Get direct access to the underlying property map.
     */
    get props() {
        return this.#map;
    }
    #createProperty(prop) {
        const get = () => {
            return this.#map.get(prop);
        };
        const set = (value) => {
            this.#map.set(prop, value);
        };
        Object.defineProperty(this, prop, {
            enumerable: true,
            configurable: true,
            get: get,
            set: set,
        });
    }
    /**
     * Test if a key is truthy.
     *
     * @param key - the key to test
     * @returns `true` if the key is enabled
     */
    enabled(key) {
        if (key === undefined) {
            return false;
        }
        return !!this.#map.get(key);
    }
    /**
     * Set or toggle the enabled status of a given key.
     *
     * If the `enabled` parameter is not passed, then the enabled
     * status will be toggled to its opposite value.
     *
     * @param {string} key - the key to set
     * @param {boolean} enabled - the optional enabled value to set
     * @returns this object to allow method chaining
     */
    toggle(key, enabled) {
        let val = enabled;
        if (key === undefined) {
            return this;
        }
        if (val === undefined) {
            // in 1-argument mode, toggle current value
            val = this.#map.get(key) === undefined;
        }
        return this.value(key, val === true ? true : null);
    }
    value(key, newValue) {
        if (newValue === undefined) {
            return this.#map.get(key);
        }
        if (newValue === null) {
            this.#map.delete(key);
            if (Object.prototype.hasOwnProperty.call(this, key)) {
                delete this[key];
            }
        }
        else {
            this.#map.set(key, newValue);
            if (!Object.prototype.hasOwnProperty.call(this, key)) {
                this.#createProperty(key);
            }
        }
        return this;
    }
    values(newMap) {
        if (newMap) {
            const itr = newMap instanceof PropMap
                ? newMap.props
                : newMap instanceof Map
                    ? newMap
                    : Object.entries(newMap);
            for (const [k, v] of itr) {
                this.value(k, v);
            }
            return this;
        }
        return Object.fromEntries(this.#map.entries());
    }
}

/**
 * Normailze a protocol value.
 *
 * This method is used to normalize protocol values which might come from a `Location`
 * object and thus contain a trailing colon.
 *
 * @param val - the protocol value to normalize
 * @returns the normalized protocol value
 */
function normalizedProtocol(val) {
    if (!val) {
        return "https";
    }
    return val.replace(/:$/, "");
}
/**
 * Normalize the environment configuration.
 *
 * Passing a browser `Location` object, like `window.location`, or a `URL`, is supported. The
 * `protocol`, `hostname`, and `port` values will be used.
 *
 * @param config - the initial configuration
 * @returns a new object with normalized configuration values
 */
function normalizedConfig(config) {
    const result = Object.assign({}, config);
    result.host = config?.hostname || config?.host || "data.solarnetwork.net";
    result.protocol = normalizedProtocol(config?.protocol);
    result.port =
        Number(config?.port) || (result.protocol === "https" ? 443 : 80);
    return result;
}
/**
 * A network environment configuration utility object.
 *
 * This extends {@link Util.Configuration} to add support for standard properties
 * needed to access the SolarNetwork API, such as host and protocol values.
 */
class EnvironmentConfig extends Configuration {
    /**
     * Constructor.
     *
     * This will define the following default properties, if not supplied on the
     * `config` argument:
     *
     * <dl>
     * <dt>host</dt><dd>`data.solarnetwork.net`</dd>
     * <dt>protocol</dt><dd>`https`</dd>
     * <dt>port</dt><dd>`443`</dd>
     * </dl>
     *
     * These properties correspond to those on the `window.location` object when
     * running in a browser. Thus to construct an environment based on the location
     * of the current page you can create an instance like this:
     *
     * ```
     * const env = new Environment(window.location);
     * ```
     *
     * @param config - an optional set of properties to start with
     */
    constructor(config) {
        super(normalizedConfig(config));
    }
    /**
     * Check if TLS is in use via the `https` protocol.
     *
     * @returns {boolean} `true` if the `protocol` is set to `https`
     */
    useTls() {
        return this.value("protocol") === "https";
    }
}

/**
 * Enumeration of HTTP methods (verbs).
 */
var HttpMethod;
(function (HttpMethod) {
    HttpMethod["GET"] = "GET";
    HttpMethod["HEAD"] = "HEAD";
    HttpMethod["POST"] = "POST";
    HttpMethod["PUT"] = "PUT";
    HttpMethod["PATCH"] = "PATCH";
    HttpMethod["DELETE"] = "DELETE";
    HttpMethod["OPTIONS"] = "OPTIONS";
    HttpMethod["TRACE"] = "TRACE";
})(HttpMethod || (HttpMethod = {}));
/**
 * Enumeration of common HTTP `Content-Type` values.
 */
var HttpContentType;
(function (HttpContentType) {
    /** JSON type. */
    HttpContentType["APPLICATION_JSON"] = "application/json";
    /** JSON type with UTF-8 charset type. */
    HttpContentType["APPLICATION_JSON_UTF8"] = "application/json; charset=UTF-8";
    /** Form URL-encoded type. */
    HttpContentType["FORM_URLENCODED"] = "application/x-www-form-urlencoded";
    /** Form URL-encoded with UTF-8 charset type. */
    HttpContentType["FORM_URLENCODED_UTF8"] = "application/x-www-form-urlencoded; charset=UTF-8";
})(HttpContentType || (HttpContentType = {}));
/**
 * HTTP headers multi-map.
 */
class HttpHeaders extends MultiMap {
    /**  The `Accept` header. */
    static ACCEPT = "Accept";
    /** The `Authorization` header. */
    static AUTHORIZATION = "Authorization";
    /** The `Content-MD5` header. */
    static CONTENT_MD5 = "Content-MD5";
    /** The `Content-Type` header. */
    static CONTENT_TYPE = "Content-Type";
    /** The `Date` header.  */
    static DATE = "Date";
    /** The `Digest` header. */
    static DIGEST = "Digest";
    /** The `Host` header.  */
    static HOST = "Host";
    /** The `X-SN-PreSignedAuthorization` header. */
    static X_SN_PRE_SIGNED_AUTHORIZATION = "X-SN-PreSignedAuthorization";
    /**  The `X-SN-Date` header. */
    static X_SN_DATE = "X-SN-Date";
}

/**
 * Parse the query portion of a URL string, and return a parameter object for the
 * parsed key/value pairs.
 *
 * Multiple parameters of the same name will be stored as an array on the returned object.
 *
 * @param search - the query portion of the URL, which may optionally include the leading `?` character
 * @param multiValueKeys - if provided, a set of keys for which to always treat
 *                                       as a multi-value array, even if there is only one value
 * @return the parsed query parameters, as a parameter object
 */
function urlQueryParse(search, multiValueKeys) {
    const params = {};
    let pairs;
    let pair;
    let i, len, k, v;
    if (search !== undefined && search.length > 0) {
        // remove any leading ? character
        if (search.match(/^\?/)) {
            search = search.substring(1);
        }
        pairs = search.split("&");
        for (i = 0, len = pairs.length; i < len; i++) {
            pair = pairs[i].split("=", 2);
            if (pair.length === 2) {
                k = decodeURIComponent(pair[0]);
                v = decodeURIComponent(pair[1]);
                if (params[k]) {
                    if (!Array.isArray(params[k])) {
                        params[k] = [params[k]]; // turn into array;
                    }
                    params[k].push(v);
                }
                else if (multiValueKeys && multiValueKeys.has(k)) {
                    params[k] = [v];
                }
                else {
                    params[k] = v;
                }
            }
        }
    }
    return params;
}
/**
 * Encode the properties of an object as a URL query string.
 *
 * If an object property has an array value, multiple URL parameters will be encoded for that property.
 *
 * The optional `encoderFn` argument is a function that accepts a string value
 * and should return a URI-safe string for that value.
 *
 * @param parameters - an object to encode as URL parameters
 * @param encoderFn - an optional function to encode each URI component with;
 *     if not provided the built-in `encodeURIComponent()` function will be used
 * @return the encoded query parameters
 */
function urlQueryEncode(parameters, encoderFn) {
    let result = "";
    const encoder = encoderFn || encodeURIComponent;
    function handleValue(k, v) {
        if (result.length) {
            result += "&";
        }
        result += encoder(k) + "=" + encoder(v);
    }
    if (parameters) {
        for (const prop in parameters) {
            if (Object.prototype.hasOwnProperty.call(parameters, prop)) {
                const val = parameters[prop];
                if (Array.isArray(val)) {
                    for (let i = 0, len = val.length; i < len; i++) {
                        handleValue(prop, val[i]);
                    }
                }
                else {
                    handleValue(prop, val);
                }
            }
        }
    }
    return result;
}

var urls = /*#__PURE__*/Object.freeze({
    __proto__: null,
    urlQueryEncode: urlQueryEncode,
    urlQueryParse: urlQueryParse
});

/**
 * The number of milliseconds a signing key is valid for.
 * @private
 */
const SIGNING_KEY_VALIDITY = 7 * 24 * 60 * 60 * 1000;
/**
 * A builder object for the SNWS2 HTTP authorization scheme.
 *
 * This builder can be used to calculate a one-off header value, for example:
 *
 * ```
 * let authHeader = new AuthorizationV2Builder("my-token")
 *     .path("/solarquery/api/v1/pub/...")
 *     .build("my-token-secret");
 * ```
 *
 * Or the builder can be re-used for a given token:
 *
 * ```
 * // create a builder for a token
 * let builder = new AuthorizationV2Builder("my-token");
 *
 * // elsewhere, re-use the builder for repeated requests
 * builder.reset()
 *     .path("/solarquery/api/v1/pub/...")
 *     .build("my-token-secret");
 * ```
 *
 * Additionally, a signing key can be generated and re-used for up to 7 days:
 *
 * ```
 * // create a builder for a token
 * let builder = new AuthorizationV2Builder("my-token")
 *   .saveSigningKey("my-token-secret");
 *
 * // elsewhere, re-use the builder for repeated requests
 * builder.reset()
 *     .path("/solarquery/api/v1/pub/...")
 *     .buildWithSavedKey(); // note previously generated key used
 * ```
 *
 * ## Post requests
 *
 * For handling `POST` or `PUT` requests, you must make sure to configure the properties of
 * this class to match your actual HTTP request:
 *
 *  1. Use the {@link Net.AuthorizationV2Builder#method method()} method to configure the HTTP verb (you can use the {@link Net.HttpMethod HttpMethod} constants).
 *  2. Use the {@link Net.AuthorizationV2Builder#contentType contentType()} method to configure the same value that will be used for the HTTP `Content-Type` header (you can use the {@link Net.HttpContentType HttpContentType} constants).
 *  3. **If** the content type is `application/x-www-form-urlencoded` then you should use the {@link Net.AuthorizationV2Builder#queryParams queryParams()} method to configure the request parameters.
 *  4. **If** the content type is **not** `application/x-www-form-urlencoded` then you should use the {@link Net.AuthorizationV2Builder#computeContentDigest computeContentDigest()} method to configure a HTTP `Digest` header.
 *
 * ```
 * // create a builder for a token
 * let builder = new AuthorizationV2Builder("my-token")
 *   .saveSigningKey("my-token-secret");
 *
 * // POST request with form data
 * builder.reset()
 *     .method(HttpHeaders.POST)
 *     .path("/solarquery/api/v1/pub/...")
 *     .contentType(HttpContentType.FORM_URLENCODED_UTF8)
 *     .queryParams({foo:"bar"})
 *     .buildWithSavedKey();
 *
 * // PUT request with JSON data, with XHR style request
 * let reqJson = JSON.stringify({foo:"bar"});
 * builder.reset()
 *     .method(HttpHeaders.PUT)
 *     .path("/solarquery/api/v1/pub/...")
 *     .contentType(HttpContentType.APPLICATION_JSON_UTF8)
 *     .computeContentDigest(reqJson);
 *
 * // when making actual HTTP request, re-use the computed HTTP Digest header:
 * xhr.setRequestHeader(
 *     HttpHeaders.DIGEST,
 *     builder.httpHeaders.firstValue(HttpHeaders.DIGEST)
 * );
 * xhr.setRequestHeader(HttpHeaders.X_SN_DATE, builder.requestDateHeaderValue);
 * xhr.setRequestHeader(HttpHeaders.AUTHORIZATION, builder.buildWithSavedKey());
 * ```
 */
class AuthorizationV2Builder {
    /** The hex-encoded value for an empty SHA256 digest value. */
    static EMPTY_STRING_SHA256_HEX = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
    /** The SolarNetwork V2 authorization scheme. */
    static SNWS2_AUTH_SCHEME = "SNWS2";
    /** The SolarNet auth token value. */
    tokenId;
    /** The SolarNet environment. */
    environment;
    /** The signed HTTP headers. */
    httpHeaders;
    /** The HTTP query parameters. */
    parameters;
    /**
     * Force a port number to be added to host values, even if port would be implied.
     *
     * This can be useful when working with a server behind a proxy, where the
     * proxy is configured to always forward the port even if the port is implied
     * (i.e. HTTPS is used on the standard port 443).
     */
    forceHostPort;
    #httpMethod;
    #requestPath;
    #requestDate;
    #contentDigest;
    #signingKey;
    #signingKeyExpiration;
    #signedHeaderNames;
    /**
     * Constructor.
     *
     * The {@link Net.AuthorizationV2Builder#reset reset()} method is invoked to set up
     * default values for this instance.
     *
     * @param token - the auth token to use
     * @param environment - the environment to use; if not provided a
     *        default environment will be created
     */
    constructor(token, environment) {
        this.tokenId = token;
        this.environment = environment || new EnvironmentConfig();
        this.httpHeaders = new HttpHeaders();
        this.parameters = new MultiMap();
        this.forceHostPort = false;
        this.#requestDate = new Date();
        this.#httpMethod = HttpMethod.GET;
        this.#requestPath = "/";
        this.reset();
    }
    /**
     * Reset to defalut property values.
     *
     * Any previously saved signing key via {@link Net.AuthorizationV2Builder#saveSigningKey saveSigningKey()}
     * or {@link Net.AuthorizationV2Builder#key key()} is preserved. The following items are reset:
     *
     *  * {@link Net.AuthorizationV2Builder#method method()} is set to `GET`
     *  * {@link Net.AuthorizationV2Builder#host host()} is set to `this.environment.host`
     *  * {@link Net.AuthorizationV2Builder#path path()} is set to `/`
     *  * {@link Net.AuthorizationV2Builder#date date()} is set to the current date
     *  * {@link Net.AuthorizationV2Builder#contentSHA256 contentSHA256()} is cleared
     *  * {@link Net.AuthorizationV2Builder#headers headers()} is cleared
     *  * {@link Net.AuthorizationV2Builder#queryParams queryParams()} is cleared
     *  * {@link Net.AuthorizationV2Builder#signedHttpHeaders signedHttpHeaders()} is set to a new empty array
     *
     * @returns this object
     */
    reset() {
        this.#httpMethod = HttpMethod.GET;
        this.#requestDate = new Date();
        this.#requestPath = "/";
        this.#contentDigest = undefined;
        this.#signedHeaderNames = undefined;
        const host = this.environment.host;
        this.httpHeaders.clear();
        this.parameters.clear();
        return this.host(host);
    }
    /**
     * Compute and cache the signing key.
     *
     * Signing keys are derived from the token secret and valid for 7 days, so
     * this method can be used to compute a signing key so that {@link Net.AuthorizationV2Builder#build build()}
     * can be called later. The signing date will be set to whatever date is
     * currently configured via {@link Net.AuthorizationV2Builder#date date()}, which defaults to the
     * current time for newly created builder instances.
     *
     * If you have an externally computed signing key, such as one returned from a token refresh API call,
     * use the {@link Net.AuthorizationV2Builder#key key()} method to save it rather than this method.
     * If you want to compute the signing key, without caching it on this builder, use the
     * {@link Net.AuthorizationV2Builder#computeSigningKey computeSigningKey()} method rather than
     * this method.
     *
     * @param tokenSecret - the secret to sign the digest with
     * @returns this object
     */
    saveSigningKey(tokenSecret) {
        this.key(this.computeSigningKey(tokenSecret), this.#requestDate);
        return this;
    }
    key(key, date) {
        if (key === undefined) {
            return this.#signingKey;
        }
        this.#signingKey = key;
        const expire = new Date((date ? date.getTime() : this.#requestDate.getTime()) +
            SIGNING_KEY_VALIDITY);
        expire.setUTCHours(0);
        expire.setUTCMinutes(0);
        expire.setUTCSeconds(0);
        expire.setUTCMilliseconds(0);
        this.#signingKeyExpiration = expire;
        return this;
    }
    /**
     * Get the saved signing key expiration date.
     *
     * This will return the expiration date the signing key saved via
     * {@link Net.AuthorizationV2Builder#key key()} or
     * {@link Net.AuthorizationV2Builder#saveSigningKey saveSigningKey()}.
     */
    get signingKeyExpirationDate() {
        return this.#signingKeyExpiration;
    }
    /**
     * Test if a signing key is present and not expired.
     */
    get signingKeyValid() {
        return this.#signingKey &&
            this.#signingKeyExpiration instanceof Date &&
            Date.now() < this.#signingKeyExpiration.getTime()
            ? true
            : false;
    }
    method(val) {
        if (val === undefined) {
            return this.#httpMethod;
        }
        this.#httpMethod = val;
        return this;
    }
    /**
     * Set the HTTP host.
     *
     * This is a shortcut for calling `HttpHeaders#put(HttpHeaders.HOST, val)`.
     *
     * @param val - the HTTP host value to use
     * @returns this object
     */
    host(val) {
        if (this.forceHostPort &&
            val.indexOf(":") < 0 &&
            this.environment.port != 80) {
            val += ":" + this.environment.port;
        }
        this.httpHeaders.put(HttpHeaders.HOST, val);
        return this;
    }
    path(val) {
        if (val === undefined) {
            return this.#requestPath;
        }
        this.#requestPath = val;
        return this;
    }
    /**
     * Set the host, path, and query parameters via a URL string.
     *
     * @param url - the URL value to use
     * @param ignoreHost -if `true` then do not set the {@link Net.AuthorizationV2Builder#host host()}
     *     from the given URL; this can be useful when you do not want to override the configured
     *     environment host
     * @returns this object
     */
    url(url, ignoreHost) {
        const uri = parse(url);
        let host = uri.host;
        if (uri.port &&
            (((uri.scheme === "https" || uri.scheme === "wss") &&
                uri.port !== 443) ||
                ((uri.scheme === "http" || uri.scheme === "ws") &&
                    uri.port !== 80))) {
            host += ":" + uri.port;
        }
        if (uri.query) {
            this.queryParams(urlQueryParse(uri.query));
        }
        if (!ignoreHost && host) {
            this.host(host);
        }
        return this.path(uri.scheme === "wss" || uri.scheme === "ws"
            ? uri.resourceName
            : uri.path);
    }
    /**
     * Set the HTTP content type.
     *
     * This is a shortcut for calling {@link Net.HttpHeaders#put HttpHeaders.put()} with the
     * key {@link Net.HttpHeaders.CONTENT_TYPE HttpHeaders.CONTENT_TYPE}.
     *
     * @param val - the HTTP content type value to use
     * @returns this object
     */
    contentType(val) {
        this.httpHeaders.put(HttpHeaders.CONTENT_TYPE, val);
        return this;
    }
    date(val) {
        if (val === undefined) {
            return this.#requestDate;
        }
        this.#requestDate = val instanceof Date ? val : new Date();
        return this;
    }
    /**
     * The authorization request date as a HTTP header string value.
     */
    get requestDateHeaderValue() {
        return this.#requestDate.toUTCString();
    }
    /**
     * Control using the `X-SN-Date` HTTP header versus the `Date` header.
     *
     * Set to `true` to use the `X-SN-Date` header, `false` to use
     * the `Date` header. This will return `true` if `X-SN-Date` has been
     * added to the `signedHeaderNames` property or has been added to the `httpHeaders`
     * property.
     */
    get useSnDate() {
        const signedHeaders = this.#signedHeaderNames;
        const existingIndex = Array.isArray(signedHeaders)
            ? signedHeaders.findIndex(caseInsensitiveEqualsFn(HttpHeaders.X_SN_DATE))
            : -1;
        return (existingIndex >= 0 ||
            this.httpHeaders.containsKey(HttpHeaders.X_SN_DATE));
    }
    set useSnDate(enabled) {
        let signedHeaders = this.#signedHeaderNames;
        const existingIndex = Array.isArray(signedHeaders)
            ? signedHeaders.findIndex(caseInsensitiveEqualsFn(HttpHeaders.X_SN_DATE))
            : -1;
        if (enabled && existingIndex < 0) {
            signedHeaders = signedHeaders
                ? signedHeaders.concat(HttpHeaders.X_SN_DATE)
                : [HttpHeaders.X_SN_DATE];
            this.#signedHeaderNames = signedHeaders;
        }
        else if (!enabled && existingIndex >= 0) {
            signedHeaders.splice(existingIndex, 1);
            this.#signedHeaderNames = signedHeaders;
        }
        // also clear from httpHeaders
        this.httpHeaders.remove(HttpHeaders.X_SN_DATE);
    }
    /**
     * Set the `useSnDate` property.
     *
     * @param enabled - `true` to use the `X-SN-Date` header, `false` to use `Date`
     * @returns this object
     */
    snDate(enabled) {
        this.useSnDate = enabled;
        return this;
    }
    /**
     * Set a HTTP header value.
     *
     * This is a shortcut for calling `HttpHeaders#put(headerName, val)`.
     *
     * @param headerName - the header name to set
     * @param headerValue - the header value to set
     * @returns this object
     */
    header(headerName, headerValue) {
        this.httpHeaders.put(headerName, headerValue);
        return this;
    }
    /**
     * Set the HTTP headers to use with the request.
     *
     * The headers object must include all headers necessary by the
     * authentication scheme, and any additional headers also configured via
     * {@link Net.AuthorizationV2Builder#signedHttpHeaders}.
     *
     * @param headers - the HTTP headers to use
     * @returns this object
     */
    headers(headers) {
        this.httpHeaders = headers;
        return this;
    }
    /**
     * Set the HTTP `GET` query parameters, or `POST` form-encoded
     * parameters.
     *
     * @param params the parameters to use, as either a {@link MultiMap} or simple `Object`
     * @returns this object
     */
    queryParams(params) {
        if (params instanceof MultiMap) {
            this.parameters = params;
        }
        else {
            this.parameters.putAll(params);
        }
        return this;
    }
    signedHttpHeaders(signedHeaderNames) {
        if (!Array.isArray(signedHeaderNames)) {
            return this.#signedHeaderNames?.concat();
        }
        this.#signedHeaderNames = signedHeaderNames;
        return this;
    }
    /**
     * Set the HTTP request body content SHA-256 digest value.
     *
     * @param digest the digest value to use; if a string it is assumed to be Hex encoded
     * @returns this object
     */
    contentSHA256(digest) {
        let contentDigest;
        if (typeof digest === "string") {
            contentDigest = Hex.parse(digest);
        }
        else {
            contentDigest = digest;
        }
        this.#contentDigest = contentDigest;
        return this;
    }
    /**
     * Compute the SHA-256 digest of the request body content and configure the result on this builder.
     *
     * This method will compute the digest and then save the result via the
     * {@link Net.AuthorizationV2Builder#contentSHA256 contentSHA256()}
     * method. In addition, it will set the `Digest` HTTP header value via
     * {@link Net.AuthorizationV2Builder#header header()}.
     * This means you _must_ also pass the `Digest` HTTP header with the request. After calling this
     * method, you can retrieve the `Digest` HTTP header value via the `httpHeaders`property.
     *
     * @param content - the request body content to compute a SHA-256 digest value from
     * @returns this object
     */
    computeContentDigest(content) {
        const digest = SHA256(content);
        this.contentSHA256(digest);
        this.header("Digest", "sha-256=" + Base64.stringify(digest));
        return this;
    }
    /**
     * Compute the canonical query parameters.
     *
     * @returns the canonical query parameters string value
     */
    canonicalQueryParameters() {
        const keys = this.parameters.keySet();
        if (keys.length < 1) {
            return "";
        }
        keys.sort();
        const len = keys.length;
        let first = true, result = "";
        for (let i = 0; i < len; i += 1) {
            const key = keys[i];
            const vals = this.parameters.value(key);
            const valsLen = vals.length;
            for (let j = 0; j < valsLen; j += 1) {
                if (first) {
                    first = false;
                }
                else {
                    result += "&";
                }
                result +=
                    _encodeURIComponent(key) +
                        "=" +
                        _encodeURIComponent(vals[j]);
            }
        }
        return result;
    }
    /**
     * Compute the canonical HTTP headers string value.
     *
     * @param sortedLowercaseHeaderNames - the sorted, lower-cased HTTP header names to include
     * @returns the canonical headers string value
     */
    canonicalHeaders(sortedLowercaseHeaderNames) {
        let result = "", headerName, headerValue;
        const len = sortedLowercaseHeaderNames.length;
        for (let i = 0; i < len; i += 1) {
            headerName = sortedLowercaseHeaderNames[i];
            if ("date" === headerName || "x-sn-date" === headerName) {
                headerValue = this.#requestDate.toUTCString();
            }
            else {
                headerValue = this.httpHeaders.firstValue(headerName);
            }
            result +=
                headerName +
                    ":" +
                    (headerValue ? headerValue.trim() : "") +
                    "\n";
        }
        return result;
    }
    /**
     * Compute the canonical signed header names value from an array of HTTP header names.
     *
     * @param sortedLowercaseHeaderNames - the sorted, lower-cased HTTP header names to include
     * @returns the canonical signed header names string value
     */
    #canonicalSignedHeaderNames(sortedLowercaseHeaderNames) {
        return sortedLowercaseHeaderNames.join(";");
    }
    /**
     * Get the canonical request content SHA256 digest, hex encoded.
     *
     * @returns the hex-encoded SHA256 digest of the request content
     */
    canonicalContentSHA256() {
        return this.#contentDigest
            ? Hex.stringify(this.#contentDigest)
            : AuthorizationV2Builder.EMPTY_STRING_SHA256_HEX;
    }
    /**
     * Compute the canonical HTTP header names to include in the signature.
     *
     * @returns the sorted, lower-cased HTTP header names to include
     */
    canonicalHeaderNames() {
        const httpHeaders = this.httpHeaders;
        const signedHeaderNames = this.#signedHeaderNames;
        // use a MultiMap to take advantage of case-insensitive keys
        const map = new MultiMap();
        map.put(HttpHeaders.HOST, true);
        if (this.useSnDate) {
            map.put(HttpHeaders.X_SN_DATE, true);
        }
        else {
            map.put(HttpHeaders.DATE, true);
        }
        if (httpHeaders.containsKey(HttpHeaders.CONTENT_MD5)) {
            map.put(HttpHeaders.CONTENT_MD5, true);
        }
        if (httpHeaders.containsKey(HttpHeaders.CONTENT_TYPE)) {
            map.put(HttpHeaders.CONTENT_TYPE, true);
        }
        if (httpHeaders.containsKey(HttpHeaders.DIGEST)) {
            map.put(HttpHeaders.DIGEST, true);
        }
        if (signedHeaderNames && signedHeaderNames.length > 0) {
            signedHeaderNames.forEach((e) => map.put(e, true));
        }
        return lowercaseSortedArray(map.keySet());
    }
    /**
     * Compute the canonical request data that will be included in the data to sign with the request.
     *
     * @returns the canonical request data
     */
    buildCanonicalRequestData() {
        return this.#computeCanonicalRequestData(this.canonicalHeaderNames());
    }
    /**
     * Compute the canonical request data that will be included in the data to sign with the request,
     * using a specific set of HTTP header names to sign.
     *
     * @param sortedLowercaseHeaderNames - the sorted, lower-cased HTTP header names to sign with the request
     * @returns the canonical request data
     */
    #computeCanonicalRequestData(sortedLowercaseHeaderNames) {
        // 1: HTTP verb
        let result = this.#httpMethod + "\n";
        // 2: Canonical URI
        result += this.#requestPath + "\n";
        // 3: Canonical query string
        result += this.canonicalQueryParameters() + "\n";
        // 4: Canonical headers
        result += this.canonicalHeaders(sortedLowercaseHeaderNames); // already includes newline
        // 5: Signed header names
        result +=
            this.#canonicalSignedHeaderNames(sortedLowercaseHeaderNames) + "\n";
        // 6: Content SHA256, hex encoded
        result += this.canonicalContentSHA256();
        return result;
    }
    /**
     * Compute the signing key, from a secret key and based on the
     * configured {@link Net.AuthorizationV2Builder#date date()}.
     *
     * This method does not save the signing key for future use in this builder instance
     * (see {@link Net.AuthorizationV2Builder#saveSigningKey saveSigningKey()} for that).
     * Use this method if you want to compute a signing key that you can later pass to
     * {@link Net.AuthorizationV2Builder#buildWithKey buildWithKey()} on some other builder instance.
     * Signing keys are valid for a maximum of 7 days, granular to whole days only.
     * To make a signing key expire in fewer than 7 days, configure  a
     * {@link Net.AuthorizationV2Builder#date date()} value in the past before
     * calling this method.
     *
     * @param secretKey - the secret key string
     * @returns the computed key
     */
    computeSigningKey(secretKey) {
        const datestring = iso8601Date(this.#requestDate);
        const key = HmacSHA256("snws2_request", HmacSHA256(datestring, "SNWS2" + secretKey));
        return key;
    }
    /**
     * Compute the data to be signed by the signing key.
     *
     * The signature data takes this form:
     *
     * ```
     * SNWS2-HMAC-SHA256
     * 20170301T120000Z
     * Hex(SHA256(canonicalRequestData))
     * ```
     *
     * @param canonicalRequestData - the request data, returned from {@link Net.AuthorizationV2Builder#buildCanonicalRequestData}
     * @returns the data to sign
     */
    computeSignatureData(canonicalRequestData) {
        return ("SNWS2-HMAC-SHA256\n" +
            iso8601Date(this.#requestDate, true) +
            "\n" +
            Hex.stringify(SHA256(canonicalRequestData)));
    }
    /**
     * Compute a HTTP `Authorization` header value from the configured properties
     * on the builder, using the provided signing key.
     *
     * This method does not save the signing key for future use in this builder instance
     * (see {@link Net.AuthorizationV2Builder#key key()} for that).
     *
     * @param signingKey - the key to sign the computed signature data with
     * @returns the SNWS2 HTTP Authorization header value
     */
    buildWithKey(signingKey) {
        const sortedHeaderNames = this.canonicalHeaderNames();
        const canonicalReq = this.#computeCanonicalRequestData(sortedHeaderNames);
        const signatureData = this.computeSignatureData(canonicalReq);
        const signature = Hex.stringify(HmacSHA256(signatureData, signingKey));
        const result = "SNWS2 Credential=" +
            this.tokenId +
            ",SignedHeaders=" +
            sortedHeaderNames.join(";") +
            ",Signature=" +
            signature;
        return result;
    }
    /**
     * Compute a HTTP `Authorization` header value from the configured
     * properties on the builder, computing a new signing key based on the
     * configured {@link Net.AuthorizationV2Builder#date}.
     *
     * @param tokenSecret - the secret to sign the authorization with
     * @return the SNWS2 HTTP Authorization header value
     */
    build(tokenSecret) {
        const signingKey = this.computeSigningKey(tokenSecret);
        return this.buildWithKey(signingKey);
    }
    /**
     * Compute a HTTP `Authorization` header value from the configured
     * properties on the builder, using a signing key configured from a previous
     * call to {@link Net.AuthorizationV2Builder#saveSigningKey saveSigningKey()}
     * or {@link Net.AuthorizationV2Builder#key key()}.
     *
     * @return the SNWS2 HTTP Authorization header value.
     * @throws Error if a saved signing key is not configured
     */
    buildWithSavedKey() {
        if (!this.#signingKey) {
            throw new Error("Saved signing key not available.");
        }
        return this.buildWithKey(this.#signingKey);
    }
}
/**
 * Create a case-insensitive string matching function.
 *
 * @param value - the string to perform the case-insensitive comparison against
 * @returns a matching function that performs a case-insensitive comparison
 * @private
 */
function caseInsensitiveEqualsFn(value) {
    const valueLc = value.toLowerCase();
    return (e) => valueLc === e.toString().toLowerCase();
}
function _hexEscapeChar(c) {
    return "%" + c.charCodeAt(0).toString(16).toUpperCase();
}
function _encodeURIComponent(str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, _hexEscapeChar);
}

/**
 * Create a NodeDatumUrlHelperMixin class.
 *
 * @param superclass - the UrlHelper class to mix onto
 * @returns the mixin class
 * @ignore
 */
const DatumUrlHelperMixin = (superclass) => 
/**
 * A mixin class that adds datum query support to {@link Net.UrlHelper}.
 */
class DatumUrlHelperMixin extends superclass {
    /**
     * Generate a URL for the "reportable interval" for a node, optionally limited to a specific set of source IDs.
     *
     * If no source IDs are provided, then the reportable interval query will return an interval for
     * all available sources.
     *
     * @param nodeId - a specific node ID to use; if not provided the `nodeId` parameter will be used
     * @param sourceIds - an array of source IDs to limit query to; if not provided the `sourceIds` parameter will be used
     * @returns the URL
     */
    reportableIntervalUrl(nodeId, sourceIds) {
        let url = this.baseUrl() +
            "/range/interval?nodeId=" +
            (nodeId || this.param(DatumFilterKeys.NodeId));
        const sources = sourceIds || this.param(DatumFilterKeys.SourceIds);
        if (Array.isArray(sources) && sources.length > 0) {
            url +=
                "&sourceIds=" +
                    sources.map((e) => encodeURIComponent(e)).join(",");
        }
        return url;
    }
    /**
     * Generate a URL for finding the available source IDs for a node or metadata filter.
     *
     * @param datumFilter the search criteria, which can define `nodeId`, `startDate`, `endDate`,
     *     and `metadataFilter` properties to limit the results to; if `nodeId` not
     *     provided the `nodeIds` parameter of this instance will be used
     * @param withNodeIds if `true` then force the response to include node IDs along with source IDs,
     *     instead of  just source IDs
     * @returns the URL
     */
    availableSourcesUrl(datumFilter, withNodeIds) {
        const filter = datumFilter
            ? new DatumFilter(datumFilter)
            : this.datumFilter();
        if (withNodeIds !== undefined) {
            filter.prop("withNodeIds", !!withNodeIds);
        }
        let result = this.baseUrl() + "/range/sources";
        const params = filter.toUriEncoding();
        if (params) {
            result += "?" + params;
        }
        return result;
    }
    /**
     * Generate a URL for querying for datum, in either raw or aggregate form.
     *
     * If the `datumFilter` has an `aggregate` value set, then aggregate results will be
     * returned by SolarNet.
     *
     * @param datumFilter - the search criteria; if not provided then {@link Net.UrlHelper#datumFilter this.datumFilter()} will be used
     * @param sorts - optional sort settings to use
     * @param pagination - optional pagination settings to use
     * @returns the URL
     */
    listDatumUrl(datumFilter, sorts, pagination) {
        let result = this.baseUrl() + "/datum/list";
        const filter = datumFilter || this.datumFilter();
        const params = filter.toUriEncodingWithSorting(sorts, pagination);
        if (params.length > 0) {
            result += "?" + params;
        }
        return result;
    }
    /**
     * Generate a URL for querying for datum _reading_ values.
     *
     * The `datumFilter` must provide the required date(s) to use for the
     * reading type. If the reading type only requires one date, then the
     * {@link Domain.DatumFilter#startDate} or
     * {@link Domain.DatumFilter#endDate} value should be provided.
     *
     * @param readingType the type of reading to find
     * @param datumFilter - the search criteria; if not provided then {@link Net.UrlHelper#datumFilter this.datumFilter()} will be used
     * @param tolerance - optional query tolerance to use
     * @param sorts - optional sort settings to use
     * @param pagination - optional pagination settings to use
     * @returns the URL
     * @see https://github.com/SolarNetwork/solarnetwork/wiki/SolarQuery-API#datum-reading
     */
    datumReadingUrl(readingType, datumFilter, tolerance, sorts, pagination) {
        const filter = datumFilter
            ? new DatumFilter(datumFilter)
            : this.datumFilter();
        filter.prop("readingType", readingType.name);
        if (tolerance) {
            filter.prop("tolerance", tolerance);
        }
        const params = filter.toUriEncodingWithSorting(sorts, pagination);
        let result = this.baseUrl() + "/datum/reading";
        if (params.length > 0) {
            result += "?" + params;
        }
        return result;
    }
    /**
     * Generate a URL for querying for stream datum, in either raw or aggregate form.
     *
     * If the `datumFilter` has an `aggregate` value set, then aggregate results will be
     * returned by SolarNet.
     *
     * @param datumFilter - the search criteria; if not provided then {@link Net.UrlHelper#datumFilter this.datumFilter()} will be used
     * @param sorts - optional sort settings to use
     * @param pagination - optional pagination settings to use
     * @returns the URL
     * @see https://github.com/SolarNetwork/solarnetwork/wiki/SolarQuery-Stream-API#datum-stream-datum-list
     */
    streamDatumUrl(datumFilter, sorts, pagination) {
        let result = this.baseUrl() + "/datum/stream/datum";
        const filter = datumFilter || this.datumFilter();
        const params = filter.toUriEncodingWithSorting(sorts, pagination);
        if (params.length > 0) {
            result += "?" + params;
        }
        return result;
    }
    /**
     * Generate a URL for querying for stream _reading_ values.
     *
     * The `datumFilter` must provide the required date(s) to use for the
     * reading type. If the reading type only requires one date, then the
     * {@link Domain.DatumFilter#startDate} or
     * {@link Domain.DatumFilter#endDate} value should be provided.
     *
     * @param readingType the type of reading to find
     * @param datumFilter - the search criteria; if not provided then {@link Net.UrlHelper#datumFilter this.datumFilter()} will be used
     * @param tolerance - optional query tolerance to use
     * @param sorts - optional sort settings to use
     * @param pagination - optional pagination settings to use
     * @returns the URL
     * @see https://github.com/SolarNetwork/solarnetwork/wiki/SolarQuery-Stream-API#datum-stream-reading-list
     */
    streamReadingUrl(readingType, datumFilter, tolerance, sorts, pagination) {
        const filter = datumFilter
            ? new DatumFilter(datumFilter)
            : this.datumFilter();
        filter.prop("readingType", readingType.name);
        if (tolerance) {
            filter.prop("tolerance", tolerance);
        }
        const params = filter.toUriEncodingWithSorting(sorts, pagination);
        let result = this.baseUrl() + "/datum/stream/reading";
        if (params.length > 0) {
            result += "?" + params;
        }
        return result;
    }
    /**
     * Generate a URL for querying for the most recent datum.
     *
     * @param datumFilter - the search criteria; if not provided then {@link Net.UrlHelper#datumFilter this.datumFilter()} will be used
     * @param sorts - optional sort settings to use
     * @param pagination - optional pagination settings to use
     * @returns the URL
     */
    mostRecentDatumUrl(datumFilter, sorts, pagination) {
        const filter = datumFilter || this.datumFilter();
        const params = filter.toUriEncodingWithSorting(sorts, pagination);
        let result = this.baseUrl() + "/datum/mostRecent";
        if (params.length > 0) {
            result += "?" + params;
        }
        return result;
    }
};

/**
 * Create a DatumMetadataUrlHelperMixin class.
 *
 * @param superclass the UrlHelper class to mix onto
 * @returns the mixin class
 * @ignore
 */
const DatumMetadataUrlHelperMixin = (superclass) => 
/**
 * A mixin class that adds SolarNode datum metadata support to {@link Net.UrlHelper}.
 *
 * Datum metadata is metadata associated with a specific node and source, i.e.
 * a `nodeId` and a `sourceId`.
 */
class DatumMetadataUrlHelperMixin extends superclass {
    /**
     * Get a base URL for datum metadata operations using a specific node ID.
     *
     * @param nodeId - a specific node ID to use; if not provided the`nodeId` parameter of this instance will be used
     * @returns the base URL
     */
    #baseDatumMetadataUrl(nodeId) {
        return (this.baseUrl() +
            "/datum/meta/" +
            (nodeId || this.param(DatumFilterKeys.NodeId)));
    }
    #datumMetadataUrlWithSource(nodeId, sourceId) {
        let result = this.#baseDatumMetadataUrl(nodeId);
        const source = sourceId || this.param(DatumFilterKeys.SourceId);
        if (sourceId !== null && source) {
            result += "?sourceId=" + encodeURIComponent(source);
        }
        return result;
    }
    /**
     * Generate a URL for viewing datum metadata.
     *
     * If no `sourceId` is provided, then the API will return all available datum metadata for all sources.
     *
     * @param nodeId - a specific node ID to use; if not provided the `nodeId` parameter of this instance will be used
     * @param sourceId - a specific source ID to use;
     *     if not provided the `sourceId` parameter of this instance will be used;
     *     if `null` then ignore any `sourceId` property of this class
     * @returns the URL
     */
    viewNodeDatumMetadataUrl(nodeId, sourceId) {
        return this.#datumMetadataUrlWithSource(nodeId, sourceId);
    }
    /**
     * Generate a URL for adding (merging) datum metadata via a `POST` request.
     *
     * @param nodeId - a specific node ID to use; if not provided the `nodeId` parameter of this instance will be used
     * @param sourceId - a specific source ID to use; if not provided the `sourceId` parameter of this instance will be used
     * @returns the URL
     */
    addNodeDatumMetadataUrl(nodeId, sourceId) {
        return this.#datumMetadataUrlWithSource(nodeId, sourceId);
    }
    /**
     * Generate a URL for setting datum metadata via a `PUT` request.
     *
     * @param nodeId - a specific node ID to use; if not provided the `nodeId` parameter of this instance will be used
     * @param sourceId - a specific source ID to use; if not provided the `sourceId` parameter of this instance will be used
     * @returns the URL
     */
    replaceNodeDatumMetadataUrl(nodeId, sourceId) {
        return this.#datumMetadataUrlWithSource(nodeId, sourceId);
    }
    /**
     * Generate a URL for deleting datum metadata via a `DELETE` request.
     *
     * @param nodeId - a specific node ID to use; if not provided the `nodeId` parameter of this instance will be used
     * @param sourceId - a specific source ID to use; if not provided the `sourceId` parameter of this instance will be used
     * @returns the URL
     */
    deleteNodeDatumMetadataUrl(nodeId, sourceId) {
        return this.#datumMetadataUrlWithSource(nodeId, sourceId);
    }
    /**
     * Generate a URL for searching for datum metadata.
     *
     * @param nodeId - a specific node ID to use; if not provided the `nodeId` parameter of this instance will be used
     * @param sourceId - a specific source ID to use;
     *                            if not provided the `sourceId` parameter of this instance will be used;
     *                            if `null` then ignore any `sourceId` property of this class
     * @param sorts - optional sort settings to use
     * @param pagination - optional pagination settings to use
     * @returns the URL
     */
    findNodeDatumMetadataUrl(nodeId, sourceId, sorts, pagination) {
        let result = this.#baseDatumMetadataUrl(nodeId);
        let params = "";
        const source = sourceId || this.param(DatumFilterKeys.SourceId);
        if (sourceId !== null && source) {
            params += "sourceId=" + encodeURIComponent(source);
        }
        if (Array.isArray(sorts)) {
            sorts.forEach((sort, i) => {
                if (sort instanceof SortDescriptor) {
                    if (params.length > 0) {
                        params += "&";
                    }
                    params += sort.toUriEncoding(i);
                }
            });
        }
        if (pagination instanceof Pagination) {
            if (params.length > 0) {
                params += "&";
            }
            params += pagination.toUriEncoding();
        }
        if (params.length > 0) {
            result += "?" + params;
        }
        return result;
    }
    #userMetadataUrl(userId) {
        let result = this.baseUrl() + "/users/meta";
        let userParam = userId || this.param(DatumFilterKeys.UserId);
        if (Array.isArray(userParam)) {
            if (userParam.length > 0) {
                userParam = userParam[0];
            }
            else {
                userParam = undefined;
            }
        }
        if (userParam && userId !== null) {
            result += "/" + userParam;
        }
        return result;
    }
    /**
     * Generate a URL for viewing a specific user's metadata via a `GET` request.
     *
     * Note this URL is similar to {@link Net.SolarUserApi#viewUserMetadataUrl}
     * but is for the read-only SolarQuery API, rather than the read-write SolarUser API.
     *
     * @param userId - a specific user ID;
     *     if not provided the `userId` parameter of this instance will be used
     * @returns the URL
     */
    viewUserMetadataUrl(userId) {
        return this.#userMetadataUrl(userId);
    }
};

/**
 * Common instruction parameter names.
 */
var CommonInstructionParameterName;
(function (CommonInstructionParameterName) {
    /** A deferred execution date, as an ISO 8601 timestamp value. */
    CommonInstructionParameterName["ExecutionDate"] = "executionDate";
})(CommonInstructionParameterName || (CommonInstructionParameterName = {}));

/**
 * Create a InstructionUrlHelperMixin class.
 *
 * @param superclass - the UrlHelper class to mix onto
 * @return the mixin class
 * @ignore
 */
const InstructionUrlHelperMixin = (superclass) => {
    /**
     * A mixin class that adds SolarNode instruction support to {@link Net.UrlHelper}.
     */
    return class InstructionUrlHelperMixin extends superclass {
        /**
         * Generate a URL to get all details for a specific instruction.
         *
         * @param instructionId - the instruction ID to get
         * @returns the URL
         */
        viewInstructionUrl(instructionId) {
            return (this.baseUrl() +
                "/instr/view?id=" +
                encodeURIComponent(instructionId));
        }
        /**
         * Generate a URL for viewing active instructions.
         *
         * @param nodeId - a specific node ID to use; if not provided the `nodeId` parameter of this instance will be used
         * @returns the URL
         */
        viewActiveInstructionsUrl(nodeId) {
            return (this.baseUrl() +
                "/instr/viewActive?nodeId=" +
                (nodeId || this.param(DatumFilterKeys.NodeId)));
        }
        /**
         * Generate a URL for viewing pending instructions.
         *
         * @param nodeId - a specific node ID to use; if not provided the `nodeId` parameter of this instance will be used
         * @returns the URL
         */
        viewPendingInstructionsUrl(nodeId) {
            return (this.baseUrl() +
                "/instr/viewPending?nodeId=" +
                (nodeId || this.param(DatumFilterKeys.NodeId)));
        }
        /**
         * Generate a URL for changing the state of an instruction.
         *
         * @param instructionId - the instruction ID to update
         * @param state - the instruction state to set
         * @returns the URL
         * @see the {@link Domain.InstructionStates} enum for possible state values
         */
        updateInstructionStateUrl(instructionId, state) {
            return (this.baseUrl() +
                "/instr/updateState?id=" +
                encodeURIComponent(instructionId) +
                "&state=" +
                encodeURIComponent(state.name));
        }
        /**
         * Generate URL encoded query string for posting instruction parameters.
         *
         * @param parameters - an array of parameter objects
         * @returns the URL encoded query string, or an empty string if `parameters` is empty
         */
        static urlEncodeInstructionParameters(parameters) {
            let url = "", i, len;
            if (Array.isArray(parameters)) {
                for (i = 0, len = parameters.length; i < len; i += 1) {
                    if (url.length > 0) {
                        url += "&";
                    }
                    url +=
                        encodeURIComponent("parameters[" + i + "].name") +
                            "=" +
                            encodeURIComponent(parameters[i].name) +
                            "&" +
                            encodeURIComponent("parameters[" + i + "].value") +
                            "=" +
                            encodeURIComponent(parameters[i].value);
                }
            }
            return url;
        }
        #instructionUrl(exec, topic, parameters, nodeIds, topicAsParam) {
            const nodes = Array.isArray(nodeIds)
                ? nodeIds
                : nodeIds !== undefined
                    ? [nodeIds]
                    : this.param(DatumFilterKeys.NodeIds);
            let url = this.baseUrl() + "/instr/" + (exec ? "exec" : "add");
            if (!topicAsParam) {
                url += "/" + encodeURIComponent(topic);
            }
            else {
                url += "?topic=" + encodeURIComponent(topic);
            }
            if (nodes && nodes.length) {
                if (topicAsParam) {
                    url += "&";
                }
                else {
                    url += "?";
                }
                if (nodes.length > 1) {
                    url += "nodeIds=" + nodes.join(",");
                }
                else {
                    url += "nodeId=" + nodes[0];
                }
            }
            if (Array.isArray(parameters) && parameters.length > 0) {
                if (topicAsParam || (nodes && nodes.length)) {
                    url += "&";
                }
                else {
                    url += "?";
                }
                url +=
                    InstructionUrlHelperMixin.urlEncodeInstructionParameters(parameters);
            }
            return url;
        }
        /**
         * Generate a URL for posting an instruction request.
         *
         * @param topic - the instruction topic
         * @param parameters - an array of parameter objects
         * @param nodeId the specific node ID to use; if not provided the `nodeId` parameter of this class will be used
         * @param topicAsParam `true` to encode topic as request parameter, `false` as the final URL path segment
         * @returns the URL
         */
        queueInstructionUrl(topic, parameters, nodeId, topicAsParam) {
            return this.#instructionUrl(false, topic, parameters, nodeId, topicAsParam);
        }
        /**
         * Generate a URL for posting instruction requests for multiple nodes.
         *
         * @param topic the instruction topic
         * @param parameters an array of parameter objects
         * @param nodeIds a list of node IDs to use; if not provided the `nodeIds` parameter of this class will be used
         * @param topicAsParam `true` to encode topic as request parameter, `false` as the final URL path segment
         * @returns the URL
         */
        queueInstructionsUrl(topic, parameters, nodeIds, topicAsParam) {
            return this.#instructionUrl(false, topic, parameters, nodeIds, topicAsParam);
        }
        /**
         * Generate a URL for posting an instruction execution request.
         *
         * @param topic - the instruction topic
         * @param parameters - an array of parameter objects
         * @param nodeIds - the specific node ID(s) to use; if not provided the `nodeIds` parameter of this class will be used
         * @returns the URL
         */
        execInstructionUrl(topic, parameters, nodeIds) {
            return this.#instructionUrl(true, topic, parameters, nodeIds);
        }
        /**
         * Create a queue instruction request object, suitable for submitting as JSON content.
         *
         * @param topic the topic to include (can be omitted if the topic is included in the request URL)
         * @param parameters the parameter to include
         * @param nodeId - the specific node ID to use; if not provided the `nodeId` parameter of this class will be used
         * @param executionDate - a deferred execution date; this will be encoded as a `executionDate` parameter as an
         *     ISO 8601 timestamp value
         * @returns the request, encoded as a {@link Net.QueueInstructionSimpleRequest} if possible
         */
        queueInstructionRequest(topic, parameters, nodeId, executionDate) {
            const result = {
                nodeId: nodeId || this.param(DatumFilterKeys.NodeId),
            };
            if (topic) {
                result.topic = topic;
            }
            if (executionDate) {
                const executionDateParam = {
                    name: CommonInstructionParameterName.ExecutionDate,
                    value: executionDate.toISOString(),
                };
                if (parameters && parameters.length > 0) {
                    const newParameters = [...parameters];
                    // replace all executionDate parameters (should be only 1)
                    let exists = false;
                    for (let i = 0; i < newParameters.length; i += 1) {
                        const param = newParameters[i];
                        if (param.name ===
                            CommonInstructionParameterName.ExecutionDate) {
                            // replace
                            newParameters[i] = executionDateParam;
                            exists = true;
                        }
                    }
                    // executionDate parameter not replaced, so add now
                    if (!exists) {
                        newParameters.push(executionDateParam);
                    }
                    parameters = newParameters;
                }
                else {
                    parameters = [executionDateParam];
                }
            }
            // check for any duplicate parameter names; if none found use simple request
            if (parameters && parameters.length > 0) {
                if (InstructionUrlHelperMixin.canUseSimpleRequest(parameters)) {
                    const params = {};
                    for (const param of parameters) {
                        if (!param.name) {
                            continue;
                        }
                        params[param.name] = param.value;
                    }
                    if (Object.keys(params).length > 0) {
                        result.params =
                            params;
                    }
                }
                else {
                    result.parameters = parameters;
                }
            }
            return result;
        }
        /**
         * Test if a list of instructions can be encoded as a {@link Net.QueueInstructionSimpleRequest} object.
         * @param parameters the parameters to inspect
         * @returns `true` if a `QueueInstructionSimpleRequest` can be used to encode the instruction parameters
         */
        static canUseSimpleRequest(parameters) {
            const len = Array.isArray(parameters) ? parameters.length : 0;
            if (len < 2) {
                return true;
            }
            const seen = new Set();
            for (let i = 0; i < len; i += 1) {
                const k = parameters[i].name;
                if (!k) {
                    continue;
                }
                if (seen.has(k)) {
                    return false;
                }
                seen.add(k);
            }
            return true;
        }
        /**
         * Create an instruction parameter.
         *
         * @param name the parameter name
         * @param value the parameter value
         * @returns the parameter object
         * @see {@link Domain.Instruction.parameter}
         */
        static instructionParameter(name, value) {
            return Instruction.parameter(name, value);
        }
    };
};

/**
 * The maximum string length allowed for template expansion.
 *
 * This limit is used to mitigate against "Polynomial regular expression used on uncontrolled data"
 * style linter warnings.
 */
const TEMPLATE_MAX_LENGTH = 1024;
/**
 * A utility class for helping to compose SolarNet URLs for the REST API.
 *
 * The various URL methods in extending classes are meant to support both explicit
 * arguments representing URL parameters, or "fall back" to the `parameters`
 * property of this class. The `parameters` property can be useful when a helper
 * instance is to be reused many times with the same general parameters, for example
 * a set of node or source IDs.
 *
 * This class is somewhat abstract and meant to be extended with additional API methods.
 */
class UrlHelper {
    /** The network environment (host, port, and so on). */
    #environment;
    /** Parameters for URL variables.  */
    #parameters;
    /**
     * Constructor.
     *
     * @param environment the optional initial environment to use;
     *        if a non-`Environment` object is passed then the properties of that object will
     *        be used to construct a new `Environment` instance
     */
    constructor(environment) {
        const env = environment instanceof EnvironmentConfig
            ? environment
            : new EnvironmentConfig(environment);
        this.#environment = env;
        this.#parameters = new Configuration();
    }
    /**
     * Get the environment configuration.
     */
    get environment() {
        return this.#environment;
    }
    /**
     * Get a parameters object that can be used to hold URL variables.
     */
    get parameters() {
        return this.#parameters;
    }
    env(key, val) {
        return this.#environment.value(key, val);
    }
    parameter(key, val) {
        return this.#parameters.value(key, val);
    }
    /**
     * Get a parameter, with plural suffix array support.
     *
     * This method will first look for a parameter named exactly `key`, and if found
     * return that. Otherwise it will look for an array parameter named `key` with
     * `s` appended, and if found return the first element from that array. For example:
     *
     * ```
     * const helper = new UrlHelper();
     * helper.parameter('nodeIds', [1, 2, 3]);
     *
     * helper.param('nodeIds'); // [1, 2, 3]
     * helper.param('nodeId');  // 1
     * ```
     *
     * If `key` already ends in `s`, then a desired array result is assumed. If a
     * value is not found for the parameter, then `s` is removed from `key` and
     * that parameter value is returned, as an array if it is not already. For example:
     *
     * ```
     * const helper = new UrlHelper();
     * helper.parameter('nodeId', 1);
     *
     * helper.param('nodeIds'); // [1]
     * helper.param('nodeId');  // 1
     * ```
     *
     * @template T the expected type
     * @param key the parameter name to get
     * @returns the parameter value
     */
    param(key) {
        let val = this.#parameters.value(key);
        if (val !== undefined) {
            return val;
        }
        if (key.endsWith("s")) {
            // look for singular value; return as array
            val = this.#parameters.value(key.substring(0, key.length - 1));
            if (Array.isArray(val)) {
                return val;
            }
            else if (val !== undefined) {
                return [val];
            }
        }
        else {
            val = this.#parameters.value(key + "s");
            if (Array.isArray(val) && val.length) {
                return val[0];
            }
        }
        return undefined;
    }
    /**
     * Get a URL for just the SolarNet host, without any path.
     *
     * This method constructs an absolute URL based on the following properties configured
     * on this instance's {@link Net.Environment}:
     *
     *  1. If {@link Net.EnvironmentConfig#useTls environment.useTls()} returns `true` then
     *     use HTTPS as the protocol, otherwise HTTP.
     *  2. Use `host` for the host name or IP address.
     *  3. Use `port` for the port if available and not the standard `443` for
     *     HTTPS or `80` for HTTP.
     *
     * @returns the URL to the SolarNet host
     */
    hostUrl() {
        const tls = this.#environment.useTls();
        const host = this.#environment.host;
        const port = +(this.#environment.port || 0);
        let url = "http" + (tls ? "s" : "") + "://" + host;
        if ((tls && port > 0 && port !== 443) ||
            (!tls && port > 0 && port !== 80)) {
            url += ":" + port;
        }
        return url;
    }
    /**
     * Get a URL for just the SolarNet host, without any path to be used for actual requests.
     *
     * Calls the {@link Net.UrlHelper.toRequestUrl toRequestUrl()} with
     * {@link Net.UrlHelper.hostUrl hostUrl()} as the argument.
     *
     * @returns the URL to make reqeusts to the SolarNet host
     */
    hostRequestUrl() {
        return this.toRequestUrl(this.hostUrl());
    }
    /**
     * Get the URL to actually request, incorporating the environment's `proxyUrlPrefix` if available.
     *
     * If a {@link Net.HostConfig#proxyUrlPrefix environment.proxyUrlPrefix} value is configured,
     * this will re-write the URL to use that host prefix, otherwise `url` will be returned
     * unchanged.
     *
     * @returns the URL to make reqeusts to the SolarNet host
     */
    toRequestUrl(url) {
        const proxyPrefix = this.#environment.proxyUrlPrefix;
        if (proxyPrefix) {
            url = url.replace(/^[^:]+:\/\/[^/]+/, proxyPrefix);
        }
        return url;
    }
    /**
     * Get a URL for just the SolarNet host using the WebSocket protocol, without any path.
     *
     * This method constructs an absolute URL based on the following properties configured
     * on this instance's {@link Net.Environment}:
     *
     *  1. If {@link Net.EnvironmentConfig#useTls environment.useTls()} returns `true` then
     *     use WSS as the protocol, otherwise WS.
     *  2. Use `host` for the host name or IP address.
     *  3. Use `port` for the port if available and not the standard `443` for
     *     WSS or `80` for WS.
     *
     * @returns the URL to the SolarNet host WebSocket
     */
    hostWebSocketUrl() {
        const tls = this.#environment.useTls();
        const host = this.#environment.host;
        const port = +(this.#environment.port || 0);
        let url = "ws" + (tls ? "s" : "") + "://" + host;
        if ((tls && port > 0 && port !== 443) ||
            (!tls && port > 0 && port !== 80)) {
            url += ":" + port;
        }
        return url;
    }
    /**
     * Get the base URL to the REST API.
     *
     * @returns the base URL to the REST API
     */
    baseUrl() {
        // This implementation is a stub, meant for subclasses to override.
        return this.hostUrl();
    }
    /**
     * Replace occurances of URL template variables with values from the `parameters`
     * property and append to the host URL.
     *
     * This method provides a way to resolve an absolute URL based on the configured
     * environment and parameters on this object.
     *
     * @param template - a URL path template
     * @returns an absolute URL
     * @see {@link Net.UrlHelper#resolveTemplateUrl}
     */
    resolveTemplatePath(template) {
        return this.hostUrl() + this.resolveTemplateUrl(template);
    }
    /**
     * Replace occurances of URL template variables with values from the `parameters`
     * property.
     *
     * URL template variables are specified as `{<em>name</em>}`. The variable
     * will be replaced by the value associated with property `name` in the
     * `parameters` object. The value will be URI encoded.
     *
     * @param template - a URL template
     * @returns the URL with template variables resolved
     */
    resolveTemplateUrl(template) {
        return UrlHelper.resolveTemplateUrl(template, this.#parameters);
    }
    /**
     * Replace occurances of URL template variables with values from a parameter object.
     *
     * URL template variables are specified as `{<em>name</em>}`. The variable
     * will be replaced by the value associated with property `name` in the
     * provided parameter object. The value will be URI encoded.
     *
     * Any occurances of `//` after replacing template variables will be reduced to `/`.
     *
     * @param template - a URL template
     * @param params - an object whose properties should serve as template variables
     * @returns the URL
     * @throws Error if `template` length is too long
     */
    static resolveTemplateUrl(template, params) {
        if (template.length > TEMPLATE_MAX_LENGTH) {
            throw new Error(`The template argument must be no more than ${TEMPLATE_MAX_LENGTH} characters.`);
        }
        return template
            .replace(/\{([^}]+)\}/g, function (match, variableName) {
            const variableValue = params[variableName];
            return variableValue !== undefined
                ? encodeURIComponent(variableValue)
                : "";
        })
            .replaceAll("//", "/");
    }
    /**
     * Get a new `DatumFilter` configured with parameters of this instance.
     *
     * This will look for the following parameters:
     *
     *  * `nodeIds`
     *  * `sourceIds`
     *
     * @returns the filter
     */
    datumFilter() {
        const filter = new DatumFilter();
        // iterate over parameters to maintain insertion order
        for (const [k, v] of this.#parameters.props) {
            if (DatumFilterPropertyNamesSet.has(k)) {
                filter[k] = v;
            }
        }
        return filter;
    }
}

/**
 * Create a LocationDatumMetadataUrlHelperMixin class.
 *
 * @param superclass - the UrlHelper class to mix onto
 * @return the mixin class
 * @ignore
 */
const LocationDatumMetadataUrlHelperMixin = (superclass) => 
/**
 * A mixin class that adds SolarNode datum metadata support to {@link module:net~UrlHelper}.
 *
 * Location datum metadata is metadata associated with a specific location and source, i.e.
 * a `locationId` and a `sourceId`.
 */
class LocationDatumMetadataUrlHelperMixin extends superclass {
    /**
     * Get a base URL for location datum metadata operations using a specific location ID.
     *
     * @param locationId a specific location ID to use; if not provided the `locationId` parameter of this instance will be used
     * @returns the base URL
     */
    #baseLocationDatumMetadataUrl(locationId) {
        return (this.baseUrl() +
            "/location/meta/" +
            (locationId || this.param(DatumFilterKeys.LocationId)));
    }
    #locationDatumMetadataUrlWithSource(locationId, sourceId) {
        let result = this.#baseLocationDatumMetadataUrl(locationId);
        const source = sourceId || this.param(DatumFilterKeys.SourceId);
        if (source) {
            result += "?sourceId=" + encodeURIComponent(source);
        }
        return result;
    }
    /**
     * Generate a URL for viewing datum metadata.
     *
     * If no `sourceId` is provided, then the API will return all available datum metadata for all sources.
     *
     * @param locationId - a specific location ID to use; if not provided the `locationId` parameter of this instance will be used
     * @param sourceId - a specific source ID to use;
     *                            if not provided the `sourceId` parameter of this instance will be used;
     *                            if `null` then ignore any `sourceId` property of this class
     * @returns the URL
     */
    viewLocationDatumMetadataUrl(locationId, sourceId) {
        return this.#locationDatumMetadataUrlWithSource(locationId, sourceId);
    }
    /**
     * Generate a URL for adding (merging) datum metadata via a `POST` request.
     *
     * @param locationId - a specific location ID to use; if not provided the `locationId` parameter of this instance will be used
     * @param sourceId - a specific source ID to use; if not provided the `sourceId` parameter of this instance will be used
     * @returns the URL
     */
    addLocationDatumMetadataUrl(locationId, sourceId) {
        return this.#locationDatumMetadataUrlWithSource(locationId, sourceId);
    }
    /**
     * Generate a URL for setting datum metadata via a `PUT` request.
     *
     * @param locationId - a specific location ID to use; if not provided the `locationId` parameter of this instance will be used
     * @param sourceId - a specific source ID to use; if not provided the `sourceId` parameter of this instance will be used
     * @returns the URL
     */
    replaceLocationDatumMetadataUrl(locationId, sourceId) {
        return this.#locationDatumMetadataUrlWithSource(locationId, sourceId);
    }
    /**
     * Generate a URL for deleting datum metadata via a `DELETE` request.
     *
     * @param locationId - a specific location ID to use; if not provided the `locationId` parameter of this instance will be used
     * @param sourceId - a specific source ID to use; if not provided the `sourceId` parameter of this instance will be used
     * @returns the URL
     */
    deleteLocationDatumMetadataUrl(locationId, sourceId) {
        return this.#locationDatumMetadataUrlWithSource(locationId, sourceId);
    }
    /**
     * Generate a URL for searching for location metadata.
     *
     * @param filter - a search filter; the `locationIds`, `sourceIds`, `tags`,
     *     `query`, and `location` properties are supported
     * @param sorts - optional sort settings to use
     * @param pagination - optional pagination settings to use
     * @returns the URL
     */
    findLocationDatumMetadataUrl(filter, sorts, pagination) {
        let result = this.baseUrl() + "/location/meta";
        const params = filter.toUriEncodingWithSorting(sorts, pagination);
        if (params.length > 0) {
            result += "?" + params;
        }
        return result;
    }
};

/**
 * Create a LocationDatumUrlHelperMixin class.
 *
 * @param superclass - the UrlHelper class to mix onto
 * @return the mixin class
 * @ignore
 */
const LocationDatumUrlHelperMixin = (superclass) => 
/**
 * A mixin class that adds SolarLocation datum query support to {@link Net.UrlHelper}.
 */
class LocationDatumUrlHelperMixin extends superclass {
    /**
     * Generate a URL for the "reportable interval" for a location, optionally limited to a specific source ID.
     *
     * If no source IDs are provided, then the reportable interval query will return an interval for
     * all available sources.
     *
     * @param locationId - a specific location ID to use; if not provided the `locationId` parameter of this instance will be used
     * @param sourceId - a specific source ID to limit query to;
     *                 if not provided the `sourceId` parameter of this instance will be used;
     * @returns the URL
     */
    reportableIntervalUrl(locationId, sourceId) {
        let url = this.baseUrl() +
            "/location/datum/interval?locationId=" +
            (locationId || this.param(DatumFilterKeys.LocationId));
        const source = sourceId || this.param(DatumFilterKeys.SourceId);
        if (source) {
            url += "&sourceId=" + encodeURIComponent(source);
        }
        return url;
    }
    /**
     * Generate a URL for finding the available source IDs for a location or metadata filter.
     *
     * @param locationId - a specific location ID to use; if not provided the `locationId`
     *     parameter of this instance will be used
     * @param startDate - a start date to limit the search to
     * @param endDate - an end date to limit the search to
     * @returns the URL
     */
    availableSourcesUrl(locationId, startDate, endDate) {
        let result = this.baseUrl() +
            "/location/datum/sources?locationId=" +
            (locationId || this.param(DatumFilterKeys.LocationId));
        if (startDate instanceof Date) {
            result +=
                "&start=" +
                    encodeURIComponent(dateTimeUrlFormat(startDate));
        }
        if (endDate instanceof Date) {
            result +=
                "&end=" + encodeURIComponent(dateTimeUrlFormat(endDate));
        }
        return result;
    }
    /**
     * Generate a URL for querying for location datum, in either raw or aggregate form.
     *
     * If the `datumFilter` has an `aggregate` value set, then aggregate results will be
     * returned by SolarNet.
     *
     * @param datumFilter - the search criteria
     * @param sorts - optional sort settings to use
     * @param pagination - optional pagination settings to use
     * @returns the URL
     */
    listDatumUrl(datumFilter, sorts, pagination) {
        let result = this.baseUrl() + "/location/datum/list";
        const params = datumFilter
            ? datumFilter.toUriEncodingWithSorting(sorts, pagination)
            : "";
        if (params.length > 0) {
            result += "?" + params;
        }
        return result;
    }
    /**
     * Generate a URL for querying for the most recent datum.
     *
     * @param datumFilter the search criteria
     * @param sorts - optional sort settings to use
     * @param pagination - optional pagination settings to use
     * @returns the URL
     */
    mostRecentDatumUrl(datumFilter, sorts, pagination) {
        let result = this.baseUrl() + "/location/datum/mostRecent";
        const params = datumFilter
            ? datumFilter.toUriEncodingWithSorting(sorts, pagination)
            : "";
        if (params.length > 0) {
            result += "?" + params;
        }
        return result;
    }
};

/**
 * Create a LocationUrlHelperMixin class.
 *
 * @param superclass the UrlHelper class to mix onto
 * @return the mixin class
 * @ignore
 */
const LocationsUrlHelperMixin = (superclass) => 
/**
 * A mixin class that adds support for SolarLocation properties to a {@link Net.UrlHelper}.
 */
class LocationsUrlHelperMixin extends superclass {
    /**
     * Generate a URL to find locations based on a search criteria.
     *
     * @param filter - the search criteria
     * @param sorts - optional sort settings to use
     * @param pagination optional pagination settings to use
     * @returns the generated URL
     */
    findLocationsUrl(filter, sorts, pagination) {
        return (this.baseUrl() +
            "/location?" +
            filter.toUriEncodingWithSorting(sorts, pagination));
    }
};

/**
 * Create a InstructionUrlHelperMixin class.
 *
 * @param superclass - the UrlHelper class to mix onto
 * @return the mixin class
 * @ignore
 */
const NodeMetadataUrlHelperMixin = (superclass) => 
/**
 * A mixin class that adds SolarNode instruction support to {@link Net.UrlHelper}.
 */
class NodeMetadataUrlHelperMixin extends superclass {
    /**
     * Generate a URL for viewing the configured node's metadata.
     *
     * @param nodeId a specific node ID to use; if not provided the `nodeId` parameter of this class will be used
     * @returns the URL
     * @throws Error if no node ID available
     */
    viewNodeMetadataUrl(nodeId) {
        const node = nodeId || this.param(DatumFilterKeys.NodeId);
        if (!node) {
            throw new Error("No node ID available.");
        }
        return this.baseUrl() + "/nodes/meta/" + encodeURIComponent(node);
    }
    /**
     * Generate a URL for adding metadata to a node via a `POST` request.
     *
     * @param nodeId a specific node ID to use; if not provided the `nodeId` parameter of this class will be used
     * @returns the URL
     * @throws Error if no node ID available
     */
    addNodeMetadataUrl(nodeId) {
        return this.viewNodeMetadataUrl(nodeId);
    }
    /**
     * Generate a URL for setting the metadata of a node via a `PUT` request.
     *
     * @param nodeId a specific node ID to use; if not provided the `nodeId` parameter of this class will be used
     * @returns the URL
     * @throws Error if no node ID available
     */
    replaceNodeMetadataUrl(nodeId) {
        return this.viewNodeMetadataUrl(nodeId);
    }
    /**
     * Generate a URL for deleting the metadata of a node via a `DELETE` request.
     *
     * @param nodeId a specific node ID to use; if not provided the `nodeId` parameter of this class will be used
     * @returns the URL
     * @throws Error if no node ID available
     */
    deleteNodeMetadataUrl(nodeId) {
        return this.viewNodeMetadataUrl(nodeId);
    }
    /**
     * Generate a URL for searching for node metadata.
     *
     * @param nodeId a specific node ID, or array of node IDs, to use; if not provided the `nodeIds`
     * property of this class will be used, unless `null` is passed in which case no node IDs will be
     * added to the URL so that all available node metadata objects will be returned
     * @param sorts optional sort settings to use
     * @param pagination optional pagination settings to use
     * @returns the URL
     * @throws Error if no node ID available
     */
    findNodeMetadataUrl(nodeId, sorts, pagination) {
        const nodeIds = Array.isArray(nodeId)
            ? nodeId
            : nodeId
                ? [nodeId]
                : nodeId !== null
                    ? this.param("nodeIds")
                    : undefined;
        let result = this.baseUrl() + "/nodes/meta";
        let params = "";
        if (Array.isArray(nodeIds)) {
            params += "nodeIds=" + nodeIds.join(",");
        }
        if (Array.isArray(sorts)) {
            sorts.forEach((sort, i) => {
                if (sort instanceof SortDescriptor) {
                    if (params.length > 0) {
                        params += "&";
                    }
                    params += sort.toUriEncoding(i);
                }
            });
        }
        if (pagination instanceof Pagination) {
            if (params.length > 0) {
                params += "&";
            }
            params += pagination.toUriEncoding();
        }
        if (params.length > 0) {
            result += "?" + params;
        }
        return result;
    }
};

/**
 * Create a NodeUrlHelperMixin class.
 *
 * @param superclass the UrlHelper class to mix onto
 * @return the mixin class
 * @ignore
 */
const NodesUrlHelperMixin = (superclass) => 
/**
 * A mixin class that adds support for SolarNode properties to a {@link Net.UrlHelper}.
 */
class NodesUrlHelperMixin extends superclass {
    /**
     * Generate a URL to get a list of all active node IDs available to the requesting user.
     *
     * **Note** this method only works against the `/sec` version of the API endpoint.
     *
     * @return the URL to access the node IDs the requesting user has access to
     */
    listAllNodeIdsUrl() {
        return this.baseUrl() + "/nodes";
    }
    /**
     * Generate a URL for finding the available source IDs.
     *
     * @param datumFilter the search criteria, which can define `nodeId`, `startDate`, `endDate`,
     *     `localStartDate`, `localEndDdate`, `metadataFilter`, `propertyNames`,
     *     `instantaneousPropertyNames`, `accumulatingPropertyNames`, and
     *     `statusPropertyNames`, properties to limit the results to
     * @returns {string} the URL
     */
    findSourcesUrl(datumFilter) {
        const filter = datumFilter
            ? new DatumFilter(datumFilter)
            : this.datumFilter();
        const params = filter.toUriEncoding();
        let result = this.baseUrl() + "/nodes/sources";
        if (params.length > 0) {
            result += "?" + params;
        }
        return result;
    }
};

/**
 * The SolarQuery default path.
 */
const SolarQueryDefaultPath = "/solarquery";
/**
 * The {@link Net.UrlHelper#parameters} key for the SolarQuery path.
 */
const SolarQueryPathKey = "solarQueryPath";
/**
 * The SolarQuery REST API path.
 */
const SolarQueryApiPathV1 = "/api/v1";
/**
 * The {@link Net.UrlHelper#parameters} key that holds a `boolean` flag to
 * use the public path scheme (`/pub`) when constructing URLs.
 */
const SolarQueryPublicPathKey = "publicQuery";
/**
 * Extension of `UrlHelper` for SolarQuery APIs.
 *
 * The base URL uses the configured environment to resolve
 * the `hostUrl`, the `solarQueryPath` context path,
 * and the `publicQuery` boolean flag. If the context path is not
 * available, it will default to `/solarquery`.
 */
class SolarQueryUrlHelper extends UrlHelper {
    /**
     * The `publicQuery` environment parameter.
     */
    get publicQuery() {
        return !!this.env(SolarQueryPublicPathKey);
    }
    set publicQuery(value) {
        this.env(SolarQueryPublicPathKey, !!value);
    }
    baseUrl() {
        const path = this.env(SolarQueryPathKey) || SolarQueryDefaultPath;
        const isPubPath = this.publicQuery;
        return (this.hostUrl() +
            path +
            SolarQueryApiPathV1 +
            (isPubPath ? "/pub" : "/sec"));
    }
}
/**
 * The SolarQuery API URL helper.
 */
class SolarQueryApi extends DatumMetadataUrlHelperMixin(DatumUrlHelperMixin(NodesUrlHelperMixin(NodeMetadataUrlHelperMixin(SolarQueryUrlHelper)))) {
}
/**
 * SolarQuery location API URL helper.
 */
class SolarQueryLocationApi extends LocationDatumMetadataUrlHelperMixin(LocationDatumUrlHelperMixin(LocationsUrlHelperMixin(SolarQueryUrlHelper))) {
}

/* eslint no-console: 0 */
let logLevel = 2;
function consoleLog(level, ...args) {
    if (level > logLevel) {
        return;
    }
    /* c8 ignore next 3 */
    if (!console) {
        return;
    }
    let logFn;
    switch (level) {
        case 1:
            logFn = console.error;
            break;
        case 2:
            logFn = console.warn;
            break;
        case 3:
            logFn = console.info;
            break;
    }
    if (!logFn) {
        logFn = console.log;
    }
    /* c8 ignore next 3 */
    if (typeof logFn !== "function") {
        return;
    }
    logFn(...args);
}
/** Enumeration of logger levels. */
var LogLevel;
(function (LogLevel) {
    /** Verbose level. */
    LogLevel[LogLevel["DEBUG"] = 4] = "DEBUG";
    /** Informational level. */
    LogLevel[LogLevel["INFO"] = 3] = "INFO";
    /** Warning level. */
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    /** Error level. */
    LogLevel[LogLevel["ERROR"] = 1] = "ERROR";
    /** No logging. */
    LogLevel[LogLevel["OFF"] = 0] = "OFF";
})(LogLevel || (LogLevel = {}));
/**
 * An application logger.
 *
 * Logging levels range from 0-4 and is controlled at the application level.
 * Level `0` is off, `1` is error, `2` is warn, `3` is info,  and `4` is debug.
 * The default level is `2`.
 */
class Logger {
    /** The global log level. */
    static get level() {
        return logLevel;
    }
    static set level(val) {
        logLevel = typeof val === "number" ? val : 0;
    }
    /**
     * Log at debug level.
     * @param args - the log arguments
     */
    static debug(...args) {
        consoleLog(4, ...args);
    }
    /**
     * Log at info level.
     * @param args - the log arguments
     */
    static info(...args) {
        consoleLog(3, ...args);
    }
    /**
     * Log at warn level.
     * @param args - the log arguments
     */
    static warn(...args) {
        consoleLog(2, ...args);
    }
    /**
     * Log at error level.
     * @param args - the log arguments
     */
    static error(...args) {
        consoleLog(1, ...args);
    }
}

/**
 * An abstract class for JSON client support.
 *
 * @typeParam API the URL helper type
 * @typeParam T the result data type
 */
class JsonClientSupport {
    /**
     * The URL helper instance to use.
     */
    api;
    /**
     * An authorization builder to use to make authenticated HTTP requests.
     */
    authBuilder;
    /**
     * Constructor.
     *
     * If `api` is a {@link Net.SolarQueryApi} and no `authBuilder` is provided, the {@link Net.SolarQueryApi#publicQuery}
     * property will be automatically set to `true`.
     *
     * @param api the URL helper to use
     * @param authBuilder the auth builder to authenticate requests with; if not provided
     *                    then only public data can be queried
     */
    constructor(api, authBuilder) {
        this.api = api;
        this.authBuilder = authBuilder;
        if (api instanceof SolarQueryApi && !authBuilder) {
            api.publicQuery = true;
        }
    }
    /**
     * Create a URL fetch requestor.
     *
     * The returned function can be passed to `d3.queue` or invoked directly.
     *
     * @param url the URL to request.
     * @param signUrl the URL to sign (might be different to `url` if a proxy is used)
     * @param delay an optional number of milliseconds to sleep before initiating the request
     * @returns a function that accepts a callback argument
     */
    requestor(url, signUrl, delay) {
        const auth = this.authBuilder;
        const fn = (cb) => {
            const headers = {
                Accept: "application/json",
            };
            if (auth && auth.signingKeyValid) {
                headers[HttpHeaders.AUTHORIZATION] = auth
                    .reset()
                    .snDate(true)
                    .url(signUrl || url, true)
                    .buildWithSavedKey();
                headers[HttpHeaders.X_SN_DATE] = auth.requestDateHeaderValue;
            }
            const errorHandler = (error) => {
                Logger.error("Error requesting data for %s: %s", url, error);
                cb(new Error(`Error requesting data for ${url}: ${error}`));
            };
            fetch(url, {
                headers: headers,
            }).then((res) => {
                if (!res.ok) {
                    errorHandler(res.statusText);
                    return;
                }
                res.json().then((json) => {
                    const r = json;
                    if (!r.success) {
                        let msg = "non-success result returned";
                        if (r.message) {
                            msg += " (" + r.message + ")";
                        }
                        errorHandler(msg);
                        return;
                    }
                    cb(undefined, r.data);
                }, errorHandler);
            }, errorHandler);
        };
        if (delay && delay > 0) {
            return (cb) => {
                setTimeout(() => {
                    fn.call(this, cb);
                }, delay);
            };
        }
        return fn;
    }
}

/**
 * Load data from multiple {@link Loader} objects, invoking a callback function
 * after all data has been loaded. Call {@link MultiLoader#load} to start loading the data.
 *
 * The {@link Tool.DatumLoader} class conforms to the {@link Loader} interface, so can be used to
 * load arrays of {@link Domain.Datum} objects based on search criteria.
 *
 * @example
 * const filter1 = new DatumFilter();
 * filter1.nodeId = 123;
 * // configure other filter settings here...
 *
 * const filter2 = new DatumFilter();
 * filter2.nodeId = 234;
 * // configure other filter settings here
 *
 * const api = new SolarQueryApi();
 *
 * const results = await new MultiLoader([
 *   new DatumLoader(api, filter1),
 *   new DatumLoader(api, filter2),
 * ]).fetch();
 * // results is a 2-element array of Datum arrays
 *
 * @typeParam the result data type
 */
class MultiLoader {
    #loaders;
    #finishedCallback;
    #concurrency;
    /**
     * Constructor.
     *
     * @param loaders - array of loader objects
     */
    constructor(loaders) {
        this.#loaders = loaders;
        this.#concurrency = Infinity;
    }
    concurrency(value) {
        if (value === undefined) {
            return this.#concurrency;
        }
        if (!isNaN(value) && Number(value) > 0) {
            this.#concurrency = Number(value);
        }
        return this;
    }
    /**
     * Asynchronously load the data.
     *
     * This method calls {@link MultiLoader#load} to perform the actual work.
     *
     * @returns {Promise<T[][]>} the result promise
     */
    fetch() {
        return new Promise((resolve, reject) => {
            this.load((error, results) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(results);
                }
            });
        });
    }
    /**
     * Initiate loading the data.
     *
     * This will call {@link Loader#load} on each supplied loader, in parallel.
     *
     * @param callback a callback function to use
     * @returns this object
     */
    load(callback) {
        // to support queue use, allow callback to be passed directly to this function
        if (typeof callback === "function") {
            this.#finishedCallback = callback;
        }
        const q = queue(this.#concurrency);
        this.#loaders.forEach((loader) => {
            // queue.defer will invoke the callback with a `null` `this` object, so `e.load.bind` here
            q.defer(loader.load.bind(loader));
        });
        q.awaitAll((error, results) => {
            if (this.#finishedCallback) {
                this.#finishedCallback.call(this, error, results);
            }
        });
        return this;
    }
}

/**
 * The {@link Net.UrlHelper} parameters key for the SolarSsh path.
 */
const SolarSshPathKey = "solarSshPath";
/**
 * The SolarSsh default path.
 */
const SolarSshDefaultPath = "";
/** The SolarSsh WebSocket path for a terminal connection. */
const SolarSshTerminalWebSocketPath = "/ssh";
/**
 * Create a SolarSshUrlHelperMixin class.
 *
 * @param superclass the UrlHelper class to mix onto
 * @return the mixin class
 * @ignore
 */
const SolarSshUrlHelperMixin = (superclass) => 
/**
 * A mixin class that adds support for SolarNode properties to a {@link Net.UrlHelper}.
 */
class SolarSshUrlHelperMixin extends superclass {
    /**
     * Get the URL to the SolarSSH WebSocket termainl connection for a SolarNode.
     *
     * @param sessionId the {@link Domain.SshSession} ID to use
     * @returns the WebSocket terminal URL
     * @throws Error if no session ID available
     */
    terminalWebSocketUrl(sessionId) {
        if (!sessionId) {
            throw new Error("No SSH session ID available.");
        }
        const path = this.env(SolarSshPathKey) || SolarSshDefaultPath;
        return (this.hostWebSocketUrl() +
            path +
            SolarSshTerminalWebSocketPath +
            "?sessionId=" +
            encodeURIComponent(sessionId));
    }
    /**
     * Get the URL to the SolarSSH HTTP proxy to the configured SolarNode.
     *
     * @param sessionId the {@link Domain.SshSession} ID to use
     * @returns the HTTP proxy URL
     * @throws Error if no session ID available
     */
    httpProxyUrl(sessionId) {
        if (!sessionId) {
            throw new Error("No SSH session ID available.");
        }
        const path = this.env(SolarSshPathKey) || SolarSshDefaultPath;
        return (this.hostUrl() +
            path +
            "/nodeproxy/" +
            encodeURIComponent(sessionId) +
            "/");
    }
    /**
     * Generate a URL for creating a new SolarSSH session.
     *
     * @param nodeId the node ID to connect to; if not provided the `nodeId` parameter of this object will be used
     * @returns the URL
     * @throws Error if no node ID available
     */
    createSshSessionUrl(nodeId) {
        const node = nodeId || this.param(DatumFilterKeys.NodeId);
        if (!node) {
            throw new Error("No node ID available.");
        }
        return (this.baseUrl() +
            "/ssh/session/new?nodeId=" +
            encodeURIComponent(node));
    }
    /**
     * Generate a URL for starting a SolarSSH session.
     *
     * @param sessionId the {@link Domain.SshSession} ID to use
     * @returns the URL
     * @throws Error if no session ID available
     */
    startSshSessionUrl(sessionId) {
        if (!sessionId) {
            throw new Error("No SSH session ID available.");
        }
        return (this.baseUrl() +
            "/ssh/session/" +
            encodeURIComponent(sessionId) +
            "/start");
    }
    /**
     * Generate a URL for stopping a SolarSSH session.
     *
     * @param sessionId the {@link Domain.SshSession} ID to use
     * @returns the URL
     * @throws Error if no session ID available
     */
    stopSshSessionUrl(sessionId) {
        if (!sessionId) {
            throw new Error("No SSH session ID available.");
        }
        return (this.baseUrl() +
            "/ssh/session/" +
            encodeURIComponent(sessionId) +
            "/stop");
    }
};

/**
 * Create a UserDatumAuxiliaryUrlHelperMixin class.
 *
 * @param superclass the UrlHelper class to mix onto
 * @return the mixin class
 * @ignore
 */
const UserDatumAuxiliaryUrlHelperMixin = (superclass) => 
/**
 * A mixin class that adds user datum auxiliary support to {@link Net.UrlHelper}.
 */
class UserDatumAuxiliaryUrlHelperMixin extends superclass {
    #userDatumAuxiliaryBaseUrl() {
        return this.baseUrl() + "/datum/auxiliary";
    }
    /**
     * Generate a URL for viewing the configured user's metadata via a `GET` request.
     *
     * @param filter - the search criteria
     * @returns the URL
     */
    listUserDatumAuxiliaryUrl(filter) {
        let result = this.#userDatumAuxiliaryBaseUrl();
        if (filter) {
            const params = filter.toUriEncoding();
            if (params.length > 0) {
                result += "?" + params;
            }
        }
        return result;
    }
    /**
     * Generate a URL for accessing a specific `DatumAuxiliaryType` by its primary key.
     *
     * If `sourceId` contains any `/` characters, then
     * {@link Net.SolarUserApi#userDatumAuxiliaryIdQueryUrl}
     * will be invoked instead.
     *
     * @param type - the datum auxiliary type
     * @param nodeId - the node ID
     * @param date - a date
     * @param sourceId - the source ID
     * @returns the URL
     */
    userDatumAuxiliaryIdUrl(type, nodeId, date, sourceId) {
        if (sourceId && sourceId.indexOf("/") >= 0) {
            // force use of query parameters if source ID has slash characters
            return this.userDatumAuxiliaryIdQueryUrl(type, nodeId, date, sourceId);
        }
        let result = this.#userDatumAuxiliaryBaseUrl();
        result +=
            "/" +
                encodeURIComponent(type.name ? type.name : String(type)) +
                "/" +
                encodeURIComponent(nodeId) +
                "/" +
                encodeURIComponent(timestampFormat(date)) +
                "/" +
                encodeURIComponent(sourceId);
        return result;
    }
    /**
     * Generate a URL for accessing a specific `DatumAuxiliaryType` by its primary key,
     * using query parameters for id components.
     *
     * @param type - the datum auxiliary type
     * @param nodeId - the node ID
     * @param date - a date
     * @param sourceId - the source ID
     * @returns the URL
     */
    userDatumAuxiliaryIdQueryUrl(type, nodeId, date, sourceId) {
        let result = this.#userDatumAuxiliaryBaseUrl();
        const props = new PropMap({
            type: type,
            nodeId: nodeId,
            date: timestampFormat(date),
            sourceId: sourceId,
        });
        const query = props.toUriEncoding();
        if (query.length > 0) {
            result += "?" + query;
        }
        return result;
    }
    /**
     * Generate a URL for storing a `DatumAuxiliaryType` via a `POST` request.
     *
     * The {@link Net.SolarUserApi#userDatumAuxiliaryIdUrl} method is used
     * to generate the URL.
     *
     * @param type - the datum auxiliary type
     * @param nodeId - the node ID
     * @param date - a date
     * @param sourceId - the source ID
     * @returns the URL
     */
    storeUserDatumAuxiliaryUrl(type, nodeId, date, sourceId) {
        return this.userDatumAuxiliaryIdUrl(type, nodeId, date, sourceId);
    }
    /**
     * Generate a URL for viewing a `DatumAuxiliaryType` via a `GET` request.
     *
     * The {@link Net.SolarUserApi#userDatumAuxiliaryIdUrl} method is used
     * to generate the URL.
     *
     * @param type - the datum auxiliary type
     * @param nodeId - the node ID
     * @param date - a date
     * @param sourceId - the source ID
     * @returns the URL
     */
    viewUserDatumAuxiliaryUrl(type, nodeId, date, sourceId) {
        return this.userDatumAuxiliaryIdUrl(type, nodeId, date, sourceId);
    }
    /**
     * Generate a URL for deleting a `DatumAuxiliaryType` via a `DELETE` request.
     *
     * The {@link Net.SolarUserApi#userDatumAuxiliaryIdUrl} method is used
     * to generate the URL.
     *
     * @param type - the datum auxiliary type
     * @param nodeId - the node ID
     * @param date - a date
     * @param sourceId - the source ID
     * @returns the URL
     */
    deleteUserDatumAuxiliaryUrl(type, nodeId, date, sourceId) {
        return this.userDatumAuxiliaryIdUrl(type, nodeId, date, sourceId);
    }
};

/**
 * Create a UserMetadataUrlHelperMixin class.
 *
 * @param superclass - the UrlHelper class to mix onto
 * @return the mixin class
 * @ignore
 */
const UserMetadataUrlHelperMixin = (superclass) => 
/**
 * A mixin class that adds user metadata support to {@link Net.UrlHelper}.
 */
class UserMetadataUrlHelperMixin extends superclass {
    /**
     * Generate a URL for viewing the configured user's metadata via a `GET` request.
     *
     * @param filter - the search criteria
     * @returns the URL
     */
    findUserMetadataUrl(filter) {
        let result = this.baseUrl() + "/users/meta";
        if (filter) {
            const params = filter.toUriEncoding();
            if (params.length > 0) {
                result += "?" + params;
            }
        }
        return result;
    }
    #userMetadataUrl(userId) {
        let result = this.baseUrl() + "/users/meta";
        let userParam = userId || this.param(UserMetadataFilterKeys.UserId);
        if (Array.isArray(userParam)) {
            if (userParam.length > 0) {
                userParam = userParam[0];
            }
            else {
                userParam = undefined;
            }
        }
        if (userParam) {
            result += "/" + userParam;
        }
        return result;
    }
    /**
     * Generate a URL for viewing a specific user's metadata via a `GET` request.
     *
     * @param userId - a specific user ID;
     *     if not provided the `userId` parameter of this class will be used;
     *     if no `userId` parameter is available then view metadata of the requesting user
     * @returns the URL
     */
    viewUserMetadataUrl(userId) {
        return this.#userMetadataUrl(userId);
    }
    /**
     * Generate a URL for adding user metadata via a `POST` request.
     *
     * @param userId - a specific user ID;
     *     if not provided the `userId` parameter of this class will be used;
     *     if no `userId` parameter is available then view metadata of the requesting user
     * @returns the URL
     */
    addUserMetadataUrl(userId) {
        return this.#userMetadataUrl(userId);
    }
    /**
     * Generate a URL for replacing user metadata via a `PUT` request.
     *
     * @param userId - a specific user ID;
     *     if not provided the `userId` parameter of this class will be used;
     *     if no `userId` parameter is available then view metadata of the requesting user
     * @returns the URL
     */
    replaceUserMetadataUrl(userId) {
        return this.#userMetadataUrl(userId);
    }
    /**
     * Generate a URL for deleting user metadata via a `DELETE` request.
     *
     * @param userId - a specific user ID;
     *     if not provided the `userId` parameter of this class will be used;
     *     if no `userId` parameter is available then view metadata of the requesting user
     * @returns the URL
     */
    deleteUserMetadataUrl(userId) {
        return this.#userMetadataUrl(userId);
    }
};

/**
 * Create a UserUrlHelperMixin class.
 *
 * @param superclass - the UrlHelper class to mix onto
 * @return the mixin class
 * @ignore
 */
const UserUrlHelperMixin = (superclass) => 
/**
 * A mixin class that adds SolarUser specific support to {@link Net.UrlHelper}.
 */
class UserUrlHelperMixin extends superclass {
    /**
     * Generate a URL to get a list of all active nodes for the user account.
     *
     * @return the URL to access the user's active nodes
     */
    viewNodesUrl() {
        return this.baseUrl() + "/nodes";
    }
    /**
     * Generate a URL to get a list of all pending nodes for the user account.
     *
     * @return the URL to access the user's pending nodes
     */
    viewPendingNodesUrl() {
        return this.baseUrl() + "/nodes/pending";
    }
    /**
     * Generate a URL to get a list of all archived nodes for the user account.
     *
     * @return the URL to access the user's archived nodes
     */
    viewArchivedNodesUrl() {
        return this.baseUrl() + "/nodes/archived";
    }
    /**
     * Generate a URL to update the archived status of a set of nodes via a `POST` request.
     *
     * @param nodeId - a specific node ID, or array of node IDs, to update; if not provided the
     *     `nodeIds` property of this class will be used
     * @param archived `true` to mark the nodes as archived; `false` to un-mark
     *     and return to normal status
     * @return the URL to update the nodes archived status
     */
    updateNodeArchivedStatusUrl(archived, nodeId) {
        const nodes = Array.isArray(nodeId)
            ? nodeId
            : nodeId
                ? [nodeId]
                : this.param(DatumFilterKeys.NodeIds);
        const result = this.baseUrl() +
            "/nodes/archived?nodeIds=" +
            (nodes ? nodes.join(",") : "") +
            "&archived=" +
            (archived ? "true" : "false");
        return result;
    }
};

/**
 * The SolarUser default path.
 */
const SolarUserDefaultPath = "/solaruser";
/**
 * The {@link Net.UrlHelper} parameters key for the SolarUser path.
 */
const SolarUserPathKey = "solarUserPath";
/**
 * The SolarUser REST API path.
 */
const SolarUserApiPathV1 = "/api/v1/sec";
/**
 * Extension of `UrlHelper` for SolarUser APIs.
 *
 * The base URL uses the configured environment to resolve the
 * `hostUrl` and a `solarUserPath` context path. If the context path
 * is not available, it will default to `/solaruser`.
 */
class SolarUserUrlHelper extends UrlHelper {
    baseUrl() {
        const path = this.env(SolarUserPathKey) || SolarUserDefaultPath;
        return super.baseUrl() + path + SolarUserApiPathV1;
    }
}
/**
 * The SolarUser API URL helper.
 */
class SolarUserApi extends AuthUrlHelperMixin(AuthTokenUrlHelperMixin(NodeMetadataUrlHelperMixin(InstructionUrlHelperMixin(UserDatumAuxiliaryUrlHelperMixin(UserMetadataUrlHelperMixin(UserUrlHelperMixin(SolarUserUrlHelper))))))) {
}

/**
 * The SolarSsh default host.
 */
const SolarSshDefaultHost = "ssh.solarnetwork.net";
/**
 * The SolarSsh default port.
 */
const SolarSshDefaultPort = 8443;
/**
 * The SolarSsh REST API path.
 */
const SolarSshApiPathV1 = "/api/v1";
/** The sub-protocol to use for SolarSSH WebSocket connections. */
const SolarSshTerminalWebSocketSubProtocol = "solarssh";
/** The node instruction for initiating a SolarSSH connection. */
const StartRemoteSshInstructionName = "StartRemoteSsh";
/** The node instruction for closing a SolarSSH connection. */
const StopRemoteSshInstructionName = "StopRemoteSsh";
/** An {@link Net.UrlHelper} parameter key for a {@link Domain.SshSession} instance. */
const SshSessionKey = "sshSession";
/**
 * Extension of `UrlHelper` for SolarSsh APIs.
 *
 * The base URL uses the configured environment to resolve the
 * `hostUrl` and a `solarSshPath` context path. If the context path
 * is not available, it will default to an empty string.
 */
class SolarSshUrlHelper extends UrlHelper {
    #userApi;
    /**
     * Constructor.
     *
     * @param environment the optional initial environment to use;
     *        if a non-`Environment` object is passed then the properties of that object will
     *        be used to construct a new `Environment` instance
     * @param userApi the {@link Net.SolarUserApi} to use for instruction handling
     */
    constructor(environment, userApi) {
        let env;
        if (environment) {
            env =
                environment instanceof EnvironmentConfig
                    ? environment
                    : new EnvironmentConfig(environment);
        }
        else {
            env = new EnvironmentConfig({
                tls: true,
                host: SolarSshDefaultHost,
                port: SolarSshDefaultPort,
            });
        }
        super(env);
        this.#userApi = userApi || new SolarUserApi();
    }
    baseUrl() {
        const path = this.env(SolarSshPathKey) || SolarSshDefaultPath;
        return super.baseUrl() + path + SolarSshApiPathV1;
    }
    /**
     * A SSH session object.
     */
    get sshSession() {
        return this.parameter(SshSessionKey);
    }
    set sshSession(sshSession) {
        this.parameter(SshSessionKey, sshSession);
    }
    /**
     * Shortcut for getting the SSH session ID from the {@link Domain.SshSession#sessionId} property.
     */
    get sshSessionId() {
        const session = this.sshSession;
        return session ? session.sessionId : undefined;
    }
    /**
     * Create an instruction auth builder for pre-signing the create session request.
     *
     * The returned builder will be configured for a `GET` request using the
     * `viewPendingInstructionsUrl()` URL.
     *
     * @param nodeId the node ID to connect to; if not provided the `nodeId` parameter of this object will be used
     * @returns the builder
     * @throws Error if no node ID available
     */
    createSshSessionAuthBuilder(nodeId) {
        const node = nodeId || this.param(DatumFilterKeys.NodeId);
        if (!node) {
            throw new Error("No node ID available.");
        }
        return new AuthorizationV2Builder()
            .snDate(true)
            .method(HttpMethod.GET)
            .url(this.#userApi.viewPendingInstructionsUrl(node));
    }
    /**
     * Create an instruction auth builder for pre-signing the start session request.
     *
     * The returned builder will be configured for a `POST` request using the
     * `queueInstructionUrl()` URL  with the `StartRemoteSsh` instruction.
     *
     * @param sshSession the session to use; if not provided the {@link Net.SolarSshApi#sshSession} property of this object will be used
     * @returns the builder
     * @throws Error if no session or node ID available
     */
    startSshSessionAuthBuilder(sshSession) {
        const session = sshSession || this.sshSession;
        if (!session) {
            throw new Error("No SSH session available.");
        }
        const node = session.nodeId;
        if (!node) {
            throw new Error("No node ID available.");
        }
        return new AuthorizationV2Builder()
            .snDate(true)
            .method(HttpMethod.POST)
            .contentType(HttpContentType.FORM_URLENCODED)
            .url(this.#userApi.queueInstructionUrl(StartRemoteSshInstructionName, [
            Instruction.parameter("host", session.sshHost),
            Instruction.parameter("user", session.sessionId),
            Instruction.parameter("port", session.sshPort),
            Instruction.parameter("rport", session.reverseSshPort),
        ], node, true));
    }
    /**
     * Create an instruction auth builder for pre-signing the stop session request.
     *
     * The returned builder will be configured for a `POST` request using the
     * `queueInstructionUrl()` URL with the `StopRemoteSsh` instruction.
     *
     * @param sshSession the session to use; if not provided the {@link Net.SolarSshApi#sshSession} property of this object will be used
     * @returns the builder
     * @throws Error if no session or node ID available
     */
    stopSshSessionAuthBuilder(sshSession) {
        const session = sshSession || this.sshSession;
        if (!session) {
            throw new Error("No SSH session available.");
        }
        const node = session.nodeId;
        if (!node) {
            throw new Error("No node ID available.");
        }
        return new AuthorizationV2Builder()
            .snDate(true)
            .method(HttpMethod.POST)
            .contentType(HttpContentType.FORM_URLENCODED)
            .url(this.#userApi.queueInstructionUrl(StopRemoteSshInstructionName, [
            Instruction.parameter("host", session.sshHost),
            Instruction.parameter("user", session.sessionId),
            Instruction.parameter("port", session.sshPort),
            Instruction.parameter("rport", session.reverseSshPort),
        ], node, true));
    }
    /**
     * Generate a URL for viewing the `StartRemoteSsh` instruction.
     *
     * @param sshSession the session to use; if not provided the {@link Net.SolarSshApi#sshSession} property of this object will be used
     * @returns the URL
     * @throws Error if no instruction ID available
     */
    viewStartRemoteSshInstructionUrl(sshSession) {
        const session = sshSession || this.sshSession;
        if (!session) {
            throw new Error("No SSH session available.");
        }
        const instrId = session.startInstructionId;
        if (!instrId) {
            throw new Error("No instruction ID available.");
        }
        return this.#userApi.viewInstructionUrl(instrId);
    }
    /**
     * Create an instruction auth builder for signing the request to view the
     * `StartRemoteSsh` instruction.
     *
     * <p>The returned builder will be configured with the same URL returned from
     * {@link Net.SolarSshApi#viewStartRemoteSshInstructionUrl}.
     *
     * @param sshSession the session to use; if not provided the {@link Net.SolarSshApi#sshSession} property of this object will be used
     * @returns the builder
     * @throws Error if no instruction ID available
     */
    viewStartRemoteSshInstructionAuthBuilder(sshSession) {
        return new AuthorizationV2Builder()
            .snDate(true)
            .url(this.viewStartRemoteSshInstructionUrl(sshSession));
    }
    /**
     * Generate a URL for viewing the `StopRemoteSsh` instruction.
     *
     * @param sshSession the session to use; if not provided the {@link Net.SolarSshApi#sshSession} property of this object will be used
     * @returns the URL
     * @throws Error if no instruction ID available
     */
    viewStopRemoteSshInstructionUrl(sshSession) {
        const session = sshSession || this.sshSession;
        if (!session) {
            throw new Error("No SSH session available.");
        }
        const instrId = session.stopInstructionId;
        if (!instrId) {
            throw new Error("No instruction ID available.");
        }
        return this.#userApi.viewInstructionUrl(instrId);
    }
    /**
     * Create an instruction auth builder for signing the request to view the
     * `StopRemoteSsh` instruction.
     *
     * The returned builder will be configured with the same URL returned from
     * {@link Net.SolarSshApi#viewStopRemoteSshInstructionUrl}.
     *
     * @param sshSession the session to use; if not provided the {@link Net.SolarSshApi#sshSession} property of this object will be used
     * @returns the builder
     * @throws Error if no instruction ID available
     */
    viewStopRemoteSshInstructionAuthBuilder(sshSession) {
        return new AuthorizationV2Builder()
            .snDate(true)
            .url(this.viewStopRemoteSshInstructionUrl(sshSession));
    }
    /**
     * Create an instruction auth builder for pre-signing the terminal connect request.
     *
     * The returned builder will be configured for a `GET` request using the
     *`viewNodeMetadataUrl()` URL.
     *
     * @param nodeId the node ID to connect to; if not provided the `nodeId` parameter of this object will be used
     * @returns the builder
     */
    connectTerminalWebSocketAuthBuilder(nodeId) {
        const node = nodeId || this.param(DatumFilterKeys.NodeId);
        if (!node) {
            throw new Error("No node ID available.");
        }
        return new AuthorizationV2Builder()
            .snDate(true)
            .method(HttpMethod.GET)
            .url(this.#userApi.viewNodeMetadataUrl(node));
    }
}
/**
 * The SolarSSH API URL helper.
 */
class SolarSshApi extends AuthUrlHelperMixin(SolarSshUrlHelperMixin(SolarSshUrlHelper)) {
}

/**
 * Create a UserAuthTokenUrlHelperMixin class.
 *
 * @param superclass - the UrlHelper class to mix onto
 * @return the mixin class
 * @ignore
 */
const UserAuthTokenUrlHelperMixin = (superclass) => 
/**
 * A mixin class that adds security token support to a {@link Net.UrlHelper}.
 */
class UserAuthTokenUrlHelperMixin extends superclass {
    /**
     * Generate a URL for listing all available auth tokens.
     *
     * @returns the URL
     */
    listAllAuthTokensUrl() {
        return this.baseUrl() + "/user/auth-tokens";
    }
    /**
     * Generate a URL for creating a new auth token, via a `POST` request.
     *
     * The request body accepts a {@link Domain.SecurityPolicy} JSON document.
     *
     * @param type - the auth token type to generate
     * @returns the URL
     */
    generateAuthTokenUrl(type) {
        return this.baseUrl() + "/user/auth-tokens/generate/" + type.name;
    }
    /**
     * Generate a URL for accessing an auth token.
     *
     * @param tokenId - the token ID
     * @returns the URL
     */
    #authTokenUrl(tokenId) {
        return (this.baseUrl() +
            "/user/auth-tokens/" +
            encodeURIComponent(tokenId));
    }
    /**
     * Generate a URL for deleting an auth token, via a `DELETE` request.
     *
     * @param tokenId - the token ID to delete
     * @returns the URL
     */
    deleteAuthTokenUrl(tokenId) {
        return this.#authTokenUrl(tokenId);
    }
    /**
     * Generate a URL for updating (merging) a security policy on an auth token,
     * via a `PATCH` request.
     *
     * The request body accepts a {@link Domain.SecurityPolicy} JSON document.
     *
     * @param tokenId - the ID of the token to update
     * @returns the URL
     */
    updateAuthTokenSecurityPolicyUrl(tokenId) {
        return this.#authTokenUrl(tokenId);
    }
    /**
     * Generate a URL for replacing a security policy on an auth token,
     * via a `PUT` request.
     *
     * The request body accepts a {@link Domain.SecurityPolicy} JSON document.
     *
     * @param tokenId - the ID of the token to update
     * @returns the URL
     */
    replaceAuthTokenSecurityPolicyUrl(tokenId) {
        return this.#authTokenUrl(tokenId);
    }
    /**
     * Generate a URL for updating the status of an auth token,
     * via a `POST` request.
     *
     * @param tokenId - the ID of the token to update
     * @param status - the status to change to
     * @returns the URL
     */
    updateAuthTokenStatusUrl(tokenId, status) {
        return (this.#authTokenUrl(tokenId) +
            "?status=" +
            encodeURIComponent(status.name));
    }
};

var index$2 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    AuthTokenUrlHelperMixin: AuthTokenUrlHelperMixin,
    AuthUrlHelperMixin: AuthUrlHelperMixin,
    AuthorizationV2Builder: AuthorizationV2Builder,
    DatumMetadataUrlHelperMixin: DatumMetadataUrlHelperMixin,
    DatumUrlHelperMixin: DatumUrlHelperMixin,
    Environment: EnvironmentConfig,
    EnvironmentConfig: EnvironmentConfig,
    FetchApi: fetch$2,
    get HttpContentType () { return HttpContentType; },
    HttpHeaders: HttpHeaders,
    get HttpMethod () { return HttpMethod; },
    InstructionUrlHelperMixin: InstructionUrlHelperMixin,
    JsonClientSupport: JsonClientSupport,
    LocationDatumMetadataUrlHelperMixin: LocationDatumMetadataUrlHelperMixin,
    LocationDatumUrlHelperMixin: LocationDatumUrlHelperMixin,
    LocationsUrlHelperMixin: LocationsUrlHelperMixin,
    MultiLoader: MultiLoader,
    NodeMetadataUrlHelperMixin: NodeMetadataUrlHelperMixin,
    NodesUrlHelperMixin: NodesUrlHelperMixin,
    SolarQueryApi: SolarQueryApi,
    SolarQueryApiPathV1: SolarQueryApiPathV1,
    SolarQueryDefaultPath: SolarQueryDefaultPath,
    SolarQueryLocationApi: SolarQueryLocationApi,
    SolarQueryPathKey: SolarQueryPathKey,
    SolarQueryPublicPathKey: SolarQueryPublicPathKey,
    SolarQueryUrlHelper: SolarQueryUrlHelper,
    SolarSshApi: SolarSshApi,
    SolarSshApiPathV1: SolarSshApiPathV1,
    SolarSshDefaultHost: SolarSshDefaultHost,
    SolarSshDefaultPath: SolarSshDefaultPath,
    SolarSshDefaultPort: SolarSshDefaultPort,
    SolarSshPathKey: SolarSshPathKey,
    SolarSshTerminalWebSocketPath: SolarSshTerminalWebSocketPath,
    SolarSshTerminalWebSocketSubProtocol: SolarSshTerminalWebSocketSubProtocol,
    SolarSshUrlHelper: SolarSshUrlHelper,
    SolarSshUrlHelperMixin: SolarSshUrlHelperMixin,
    SolarUserApi: SolarUserApi,
    SolarUserApiPathV1: SolarUserApiPathV1,
    SolarUserDefaultPath: SolarUserDefaultPath,
    SolarUserPathKey: SolarUserPathKey,
    SolarUserUrlHelper: SolarUserUrlHelper,
    SshSessionKey: SshSessionKey,
    StartRemoteSshInstructionName: StartRemoteSshInstructionName,
    StopRemoteSshInstructionName: StopRemoteSshInstructionName,
    UrlHelper: UrlHelper,
    Urls: urls,
    UserAuthTokenurlHelperMixin: UserAuthTokenUrlHelperMixin,
    UserDatumAuxiliaryUrlHelperMixin: UserDatumAuxiliaryUrlHelperMixin,
    UserMetadataUrlHelperMixin: UserMetadataUrlHelperMixin,
    UserNodesUrlHelperMixin: UserUrlHelperMixin
});

/**
 * Instruction states that indicate a toggle instruction is in-flight.
 * @private
 */
const InstructionActiveStates = new Set([
    InstructionStates.Queuing,
    InstructionStates.Queued,
    InstructionStates.Received,
    InstructionStates.Executing,
]);
/**
 * Instruction states that indicate a toggle instruction is comleted or declined.
 * @private
 */
const InstructionFinishedStates = new Set([
    InstructionStates.Completed,
    InstructionStates.Declined,
]);
/**
 * Extension to Datum class with a specific `val` property.
 */
class ControlDatum extends Datum {
    /** The control value. */
    val;
    constructor(info) {
        super(info);
        this.val = info.val;
    }
}
/**
 * Manage the state of a boolean control switch using SolarNetwork `SetControlParameter` instructions.
 *
 * Use an instance of this class to keep track of, and update the state of, a single switch-like
 * control configured on a SolarNode. Because updating the state of a control is an asynchronous
 * process involving multiple steps, this class simplifies this with a promise-based API that
 * will be resolved when the control value changes.
 *
 * If the {@link ControlToggler#start} method is called, the toggler will make periodic
 * calls to SolarNetwork to get the most recent value for the configured control ID, which it
 * treats as a {@link ControlDatum} `sourceId` value. Thus if some other process changes the
 * control, the toggler will eventually pick up that change and invoke the callback function.
 *
 * @example
 * const auth = new AuthorizationV2Builder('token');
 * auth.saveSigningKey('secret');
 *
 * const toggler = new ControlTogger(new SolarUserApi(), auth, 123, '/power/switch/1');
 * toggler.callback = (error) => {
 *   // invoked when instruction states change, or the control value changes
 *   console.log(`Control ${toggler.controlId} value == ${toggler.value()}; pending == ${toggler.hasPendingStateChange}`);
 * };
 *
 * // enable automatic keeping track of state and the callback hook
 * toggler.start();
 *
 * // ... at some point later, maybe in response to a UI event, update the state;
 * // the callback will be invoked then the value changes
 * toggler.value(1);
 */
class ControlToggler {
    #api;
    #auth;
    #queryApi;
    #queryAuth;
    /**
     * The node ID to manage the control on.
     */
    nodeId;
    /**
     * The control ID to manage.
     */
    controlId;
    /** A timeout identifier. */
    #timer;
    /**
     * The last known instruction status. The `val` property indicates the control value.
     */
    #lastKnownDatum;
    /**
     * The last known instruction object.
     */
    #lastKnownInstruction;
    /**
     * The refresh rate, in milliseconds.
     * Defaults to 20 seconds.
     */
    refreshMs = 20000;
    /**
     * The refresh rate, in milliseconds, when a toggle instruction is queued.
     * Defaults to 5 seconds.
     */
    pendingRefreshMs = 5000;
    /**
     * A callback function, which is called after the state of the control changes.
     * The `this` reference will be set to this object. If an error has occurred,
     * the error will be passed as the first argument.
     */
    callback;
    /**
     * Constructor.
     * @param api the URL helper to use
     * @param auth the auth builder to authenticate requests with; the required credentials
     *                    must be set appropriately
     * @param nodeId the ID of the node with the control to manage
     * @param controlId the ID of the control to manage
     * @param queryApi a URL helper for accessing node datum via SolarQuery; if not provided one
     *                 will be created using the environment from `api`. Useful in a development
     *                 environment when the SolarUser and SolarQuery hosts are different.
     */
    constructor(api, auth, nodeId, controlId, queryApi) {
        this.#api = api;
        this.#auth = auth;
        this.nodeId = nodeId;
        this.controlId = controlId;
        this.#queryApi = queryApi || new SolarQueryApi(api.environment);
        this.#queryAuth = queryApi
            ? new AuthorizationV2Builder(auth.tokenId, queryApi.environment).key(auth.key())
            : auth;
    }
    #notifyDelegate(error) {
        const callback = this.callback;
        if (callback !== undefined) {
            try {
                callback.call(this, error);
            }
            catch (callbackError) {
                Logger.error("Error in callback: %s", callbackError);
            }
        }
    }
    /**
     * Find an active `SetControlParameter` Instruction for the configured `controlId`.
     *
     * @param data array of instructions
     * @returns the active instruction, or `undefined`
     * @private
     */
    #getActiveInstruction(data) {
        if (!Array.isArray(data) || data.length === 0) {
            return undefined;
        }
        const controlId = this.controlId;
        const instruction = data.reduce((prev, curr) => {
            if (curr.topic ===
                CommonInstructionTopicName.SetControlParameter &&
                Array.isArray(curr.parameters) &&
                curr.parameters.length > 0 &&
                curr.parameters[0].name === controlId &&
                (prev === undefined || prev.created < curr.created)) {
                return curr;
            }
            return prev;
        }, undefined);
        if (instruction !== undefined) {
            Logger.debug("Active instruction %d for node %d found in state %s (set control %s to %s)", instruction.id, this.nodeId, instruction.state, controlId, instruction.parameters[0].value);
            return new Instruction(instruction);
        }
        return undefined;
    }
    /**
     * Get the last known instruction value, e.g. the state of the control.
     * @returns the last know value of the control (0 or 1), or `undefined`
     * @private
     */
    #lastKnownInstructionValue() {
        return Array.isArray(this.#lastKnownInstruction?.parameters)
            ? this.#lastKnownInstruction.parameters[0].value
            : undefined;
    }
    /**
     * Calculate the refresh rate to use.
     * @returns the refresh rate to use, in milliseconds
     * @private
     */
    #currentRefreshMs() {
        return this.hasPendingStateChange
            ? this.pendingRefreshMs
            : this.refreshMs;
    }
    /**
     * Test if a state change is pending confirmation.
     *
     * @returns `true` if a state change is pending (not complete)
     */
    get hasPendingStateChange() {
        const state = this.#lastKnownInstruction?.instructionState;
        return state !== undefined && InstructionActiveStates.has(state);
    }
    /**
     * Return the value from either the `controlStatus` or the first parameter value of an `instruction`,
     * whichever is valid and more recent.
     *
     * @param controlDatum a control status object
     * @param instruction  an instruction object
     * @returns the control status value, or `undefined` if not known
     * @private
     */
    #mostRecentValue(controlDatum, instruction) {
        if (!instruction ||
            InstructionStates.Declined.equals(instruction.state)) {
            return controlDatum?.val;
        }
        else if (!controlDatum) {
            return Array.isArray(instruction.parameters) &&
                instruction.parameters.length > 0
                ? instruction.parameters[0].value
                : undefined;
        }
        // return the newer value
        const statusDate = controlDatum.date;
        const instructionDate = instruction.date;
        return statusDate > instructionDate
            ? controlDatum.val
            : Array.isArray(instruction.parameters) &&
                instruction.parameters.length > 0
                ? instruction.parameters[0].value
                : undefined;
    }
    /**
     * Fetch a URL.
     *
     * @template T the expected result type
     * @param method the HTTP method to use
     * @param url the URL to request
     * @returns promise of the results
     * @private
     */
    #fetch(method, url, auth) {
        let fetchUrl = url;
        let reqData = null;
        let contentType = undefined;
        if (method !== HttpMethod.GET) {
            const queryIndex = url.indexOf("?");
            if (queryIndex) {
                reqData = url.substring(queryIndex + 1);
                contentType = HttpContentType.FORM_URLENCODED_UTF8;
                fetchUrl = url.substring(0, queryIndex);
            }
        }
        const headers = {
            Accept: "application/json",
        };
        if (auth.signingKeyValid) {
            auth.reset().snDate(true).method(method).url(url);
            if (contentType) {
                auth.contentType(contentType);
                headers[HttpHeaders.CONTENT_TYPE] = contentType;
            }
            headers[HttpHeaders.AUTHORIZATION] = auth.buildWithSavedKey();
            headers[HttpHeaders.X_SN_DATE] = auth.requestDateHeaderValue;
        }
        return fetch(fetchUrl, {
            method: method,
            headers: headers,
            body: reqData,
        }).then((res) => {
            return res.json().then((json) => {
                const r = json;
                if (!r.success) {
                    let msg = r.message;
                    if (!msg) {
                        msg = `HTTP ${res.status}`;
                    }
                    if (r.code) {
                        msg += " (" + r.code + ")";
                    }
                    throw new Error(msg);
                }
                return r.data;
            }, (error) => {
                const msg = res.ok
                    ? error
                    : `HTTP ${res.status} ${res.statusText}`;
                throw new Error(msg);
            });
        });
    }
    value(desiredValue) {
        if (desiredValue === undefined) {
            return this.#lastKnownDatum?.val;
        }
        if (!this.#auth.signingKeyValid) {
            return Promise.reject(new Error("Valid credentials not configured"));
        }
        const currentValue = this.#lastKnownDatum?.val;
        let pendingState = this.#lastKnownInstruction?.instructionState;
        let pendingValue = this.#lastKnownInstructionValue();
        let cancel;
        let enqueue;
        /* !!!!!
           Note the loose `!= desiredValue` equality checks for type flexibility
           !!!!! */
        if (pendingState === InstructionStates.Queued &&
            pendingValue != desiredValue &&
            this.#lastKnownInstruction) {
            // cancel the pending instruction
            Logger.debug("Canceling node %d pending control %s to %s request %d", this.nodeId, this.controlId, pendingValue, this.#lastKnownInstruction.id);
            const cancelInstructionUrl = this.#api.updateInstructionStateUrl(this.#lastKnownInstruction.id, InstructionStates.Declined);
            cancel = this.#fetch(HttpMethod.POST, cancelInstructionUrl, this.#auth);
            this.#lastKnownInstruction = undefined;
            pendingState = undefined;
            pendingValue = undefined;
        }
        if (currentValue != desiredValue && pendingValue != desiredValue) {
            Logger.debug("Request node %d to change control %s to %d", this.nodeId, this.controlId, desiredValue);
            const queueInstructionUrl = this.#api.queueInstructionUrl(CommonInstructionTopicName.SetControlParameter, [{ name: this.controlId, value: String(desiredValue) }], this.nodeId);
            if (cancel) {
                enqueue = cancel.then(() => {
                    this.#lastKnownInstruction = undefined;
                    return this.#fetch(HttpMethod.POST, queueInstructionUrl, this.#auth);
                });
            }
            else {
                enqueue = this.#fetch(HttpMethod.POST, queueInstructionUrl, this.#auth);
            }
            enqueue
                .then((instr) => {
                this.#lastKnownInstruction = new Instruction(instr);
                this.#notifyDelegate();
                if (this.#timer) {
                    this.stop();
                    this.start(this.#currentRefreshMs());
                }
            })
                .catch((error) => {
                Logger.error("Error updating node %d control toggler %s: %s", this.nodeId, this.controlId, error.status);
                this.#notifyDelegate(error);
            });
        }
        else {
            enqueue = Promise.resolve(this.#lastKnownInstruction);
        }
        return enqueue;
    }
    /**
     * Refresh the control state from SolarNetwork.
     *
     * Once the {@link ControlToggler#start} method is called, this method is invoked periodically
     * automatically. Only call this directly if you need to manually update the state of the control.
     *
     * @returns promise that resolves after getting the updated state
     */
    update() {
        if (!this.#auth.signingKeyValid) {
            return Promise.reject(new Error("Valid credentials not configured"));
        }
        const reqs = [];
        // query for most recently available datum for control to check control value
        const filter = new DatumFilter();
        filter.nodeId = this.nodeId;
        filter.sourceId = this.controlId;
        const mostRecentUrl = this.#queryApi.mostRecentDatumUrl(filter);
        reqs[0] = this.#fetch(HttpMethod.GET, mostRecentUrl, this.#queryAuth);
        // query for pending instructions to see if we have an in-flight SetControlParameter on the go already
        const viewPendingUrl = this.#api.viewPendingInstructionsUrl(this.nodeId);
        reqs[1] = this.#fetch(HttpMethod.GET, viewPendingUrl, this.#auth);
        const lastKnownInstr = this.#lastKnownInstruction;
        if (lastKnownInstr?.instructionState &&
            !InstructionFinishedStates.has(lastKnownInstr.instructionState)) {
            // also refresh this specific instruction, to know when it goes to Completed so we can
            // assume the control value has changed, even if the mostRecent data lags behind
            const viewInstructionUrl = this.#api.viewInstructionUrl(lastKnownInstr.id);
            reqs[2] = this.#fetch(HttpMethod.GET, viewInstructionUrl, this.#auth);
        }
        return Promise.all(reqs)
            .then((results) => {
            const mostRecentList = results[0].results;
            const pendingInstruction = this.#getActiveInstruction(results[1]);
            const execInstruction = results.length > 2 && results[2]
                ? new Instruction(results[2])
                : undefined;
            const mostRecentDatumInfo = Array.isArray(mostRecentList)
                ? mostRecentList.find((e) => e.sourceId === this.controlId)
                : undefined;
            const mostRecentDatum = mostRecentDatumInfo
                ? new ControlDatum(mostRecentDatumInfo)
                : undefined;
            const newValue = this.#mostRecentValue(mostRecentDatum, execInstruction
                ? execInstruction
                : pendingInstruction
                    ? pendingInstruction
                    : this.#lastKnownInstruction);
            const currValue = this.value();
            // note != (loose) comparison for string to number coersion
            if (newValue != currValue || execInstruction) {
                Logger.debug("Current node %d control %s value is %s", this.nodeId, this.controlId, newValue);
                this.#lastKnownDatum = mostRecentDatum;
                if (mostRecentDatum && !pendingInstruction && newValue) {
                    mostRecentDatum.val = newValue; // force this, because instruction value might be newer than status value
                }
                this.#lastKnownInstruction = execInstruction
                    ? execInstruction
                    : pendingInstruction;
                // invoke the client callback so they know the data has been updated
                this.#notifyDelegate();
            }
            // if timer was defined, keep going as if interval set
            if (this.#timer !== undefined) {
                this.#timer = setTimeout(() => {
                    this.update();
                }, this.#currentRefreshMs());
            }
            return this.value();
        })
            .catch((error) => {
            Logger.error("Error querying node %d control toggler %s status: %s", this.nodeId, this.controlId, error.status);
            this.#notifyDelegate(error);
        });
    }
    /**
     * Start automatically updating the status of the configured control.
     *
     * @param when an optional offset in milliseconds to start at (defaults to 20)
     * @returns this object
     */
    start(when) {
        const timer = this.#timer;
        if (!timer) {
            this.#timer = setTimeout(() => {
                this.update();
            }, when || 20);
        }
        return this;
    }
    /**
     * Stop automatically updating the status of the configured control.
     *
     * @returns this object
     */
    stop() {
        const timer = this.#timer;
        if (timer) {
            clearTimeout(timer);
            this.#timer = null;
        }
        return this;
    }
}

const DEFAULT_PAGE_SIZE = 1000;
const DEFAULT_JITTER = 150;
/**
 * An enumeration of loader state values.
 */
var DatumLoaderState;
(function (DatumLoaderState) {
    /** The loader can be configured and is ready to be used. */
    DatumLoaderState[DatumLoaderState["Ready"] = 0] = "Ready";
    /** The loader is loading datum. */
    DatumLoaderState[DatumLoaderState["Loading"] = 1] = "Loading";
    /** The loader has finished loading datum. */
    DatumLoaderState[DatumLoaderState["Done"] = 2] = "Done";
})(DatumLoaderState || (DatumLoaderState = {}));
/**
 * Load data for a set of source IDs, date range, and aggregate level using either the `listDatumUrl()`
 * or `datumReadingUrl()` URLs of `SolarQueryApi` (the `/datum/list` or `/datum/reading`
 * endpoints).
 *
 * This object is designed to be used once per query. After creating the object and optionally configuring
 * any other settings, call {@link Tool.DatumLoader#fetch} to start loading the data. The returned `Promise`
 * will be resolved once all data has been loaded.
 *
 * @example
 * const filter = new DatumFilter();
 * filter.nodeId = 123;
 * // configure other filter settings here...
 *
 * const results = await new DatumLoader(new SolarQueryApi(), filter).fetch();
 * // results is an array of Datum objects
 */
class DatumLoader extends JsonClientSupport {
    /** The filter. */
    filter;
    #pageSize;
    #includeTotalResultsCount;
    #callback;
    #urlParameters;
    /**
     * When `true` then call the callback function for every page of data as it becomes available.
     * Otherwise the callback function will be invoked only after all data has been loaded.
     */
    #incrementalMode;
    /**
     * When `true` then invoke the `/datum/reading` endpoint to load data, otherwise use `/datum/list`.
     */
    #readingsMode;
    /**
     * An optional proxy URL to use instead of the host returned by the configured `SolarQueryApi`.
     * This should be configured as an absolute URL to the proxy target, e.g. `https://query.solarnetwork.net/1m`.
     */
    #proxyUrl;
    /**
     * When > 0 then make one request that includes the total result count and first page of
     * results, followed by parallel requests for the remaining pages.
     */
    #concurrency;
    /**
     * When > 0 then add a random amount of milliseconds up to this amount before initiating
     * parallel requests (thus #concurrency must also be configured).
     */
    #jitter;
    /**
     * A queue to use for parallel mode, when `concurrency` configured > 0.
     */
    #queue;
    #state;
    #results;
    /**
     * Constructor.
     *
     * @param api a URL helper for accessing node datum via SolarQuery
     * @param filter the filter parameters to use
     * @param authBuilder the auth builder to authenticate requests with; if not provided
     *                    then only public data can be queried; when provided a pre-signed
     *                    key must be available
     */
    constructor(api, filter, authBuilder) {
        super(api, authBuilder);
        this.filter = filter;
        this.#pageSize = DEFAULT_PAGE_SIZE;
        this.#includeTotalResultsCount = false;
        this.#callback = null;
        this.#urlParameters = null;
        this.#incrementalMode = false;
        this.#readingsMode = false;
        this.#proxyUrl = null;
        this.#concurrency = 0;
        this.#jitter = DEFAULT_JITTER;
        this.#state = DatumLoaderState.Ready;
    }
    concurrency(value) {
        if (value === undefined) {
            return this.#concurrency;
        }
        if (!isNaN(value) && Number(value) >= 0) {
            this.#concurrency = Number(value);
        }
        return this;
    }
    jitter(value) {
        if (value === undefined) {
            return this.#jitter;
        }
        if (!isNaN(value) && Number(value) >= 0) {
            this.#jitter = Number(value);
        }
        return this;
    }
    callback(value) {
        if (value === undefined) {
            return this.#callback;
        }
        if (value === null || typeof value === "function") {
            this.#callback = value;
        }
        return this;
    }
    parameters(value) {
        if (value === undefined) {
            return this.#urlParameters;
        }
        if (value === null || typeof value === "object") {
            this.#urlParameters = value;
        }
        return this;
    }
    /**
     * Get the loader state.
     *
     * @returns the state
     */
    state() {
        return this.#state;
    }
    incremental(value) {
        if (value === undefined) {
            return this.#incrementalMode;
        }
        this.#incrementalMode = !!value;
        return this;
    }
    paginationSize(value) {
        if (value === undefined) {
            return this.#pageSize;
        }
        else if (isNaN(Number(value))) {
            value = DEFAULT_PAGE_SIZE;
        }
        this.#pageSize = value;
        return this;
    }
    includeTotalResultsCount(value) {
        if (value === undefined) {
            return this.#includeTotalResultsCount;
        }
        this.#includeTotalResultsCount = !!value;
        return this;
    }
    readings(value) {
        if (value === undefined) {
            return this.#readingsMode;
        }
        this.#readingsMode = !!value;
        return this;
    }
    proxyUrl(value) {
        if (value === undefined) {
            return this.#proxyUrl;
        }
        this.#proxyUrl = value;
        return this;
    }
    /**
     * Initiate loading the data.
     *
     * @returns a `Promise` for the final results
     */
    fetch() {
        if (this.#incrementalMode) {
            return Promise.reject(new Error("Incremental mode is not supported via fetch(), use load(callback) instead."));
        }
        return new Promise((resolve, reject) => {
            this.load((error, results) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(results || []);
                }
            });
        });
    }
    /**
     * Initiate loading the data.
     *
     * As an alternative to configuring the callback function via the {@link DatumLoader.callback}
     * method,a callback function can be passed as an argument to this function. That allows this
     * function to be passed to things like `queue.defer`, for example.
     *
     * @param callback a callback function to use; either this argument must be provided
     *                 or the function must have already been configured via {@link DatumLoader.callback}
     * @returns this object
     */
    load(callback) {
        // to support queue use, allow callback to be passed directly to this function
        if (typeof callback === "function") {
            this.#callback = callback;
        }
        if (!this.#callback) {
            throw new Error("No callback provided.");
        }
        this.#state = DatumLoaderState.Loading;
        if (this.#concurrency > 0) {
            this.#queue = queue(this.#concurrency);
        }
        this.#loadData(new Pagination(this.#pageSize, 0));
        return this;
    }
    /**
     * Invoke the configured callback function.
     *
     * @param error an optional  error
     * @param done `true` if there is no more data to load
     * @param page the incremental mode page
     */
    #handleResults(error, done, page) {
        if (done) {
            this.#state = 2; // done
        }
        if (this.#callback) {
            let args;
            if (this.#incrementalMode) {
                args = [error, this.#results, done, page];
            }
            else {
                args = [error, this.#results, undefined, undefined];
            }
            this.#callback(...args);
        }
    }
    /**
     * Load a single page of data, starting at a specific offset.
     *
     * @param page the page to load
     * @param q the queue to use
     */
    #loadData(page, q) {
        const queryFilter = new DatumFilter(this.filter);
        queryFilter.withoutTotalResultsCount =
            (this.#includeTotalResultsCount || this.#queue) && page.offset === 0
                ? false
                : true;
        let url = this.#readingsMode
            ? this.api.datumReadingUrl(DatumReadingTypes.Difference, queryFilter, undefined, undefined, page)
            : this.api.listDatumUrl(queryFilter, undefined, page);
        if (this.#urlParameters) {
            const queryParams = urlQueryEncode(this.#urlParameters);
            if (queryParams) {
                url += "&" + queryParams;
            }
        }
        const reqUrl = this.#proxyUrl
            ? url.replace(/^[^:]+:\/\/[^/]+/, this.#proxyUrl)
            : url;
        // add delay for parallel mode if jitter configured
        const delay = q && this.#jitter > 0
            ? Math.floor(Math.random() * this.#jitter) + 1
            : 0;
        const query = this.requestor(reqUrl, url, delay);
        const handler = (error, data) => {
            if (error) {
                if (!q) {
                    this.#handleResults(error, true);
                    return;
                }
            }
            const dataArray = datumExtractor(data);
            if (dataArray === undefined) {
                Logger.debug("No data available for %s", reqUrl);
                if (!q) {
                    this.#handleResults(undefined, true);
                    return;
                }
            }
            const incMode = this.#incrementalMode;
            const nextOffset = offsetExtractor(data, page);
            const done = !!q || nextOffset < 1;
            const totalResults = data && data.totalResults !== undefined ? data.totalResults : 0;
            if (!q) {
                this.#results =
                    this.#results === undefined
                        ? dataArray
                        : this.#results.concat(dataArray);
            }
            if (incMode || (!q && done)) {
                this.#handleResults(undefined, done, page);
            }
            // load additional pages as needed
            if (!done) {
                if (!q && this.#queue && totalResults > 0) {
                    // parallel mode after first page results; queue all remaining pages
                    for (let pOffset = nextOffset; pOffset < totalResults; pOffset += page.max) {
                        this.#loadData(page.withOffset(pOffset), this.#queue);
                    }
                    this.#queue.awaitAll((error, allResults) => {
                        const queryResults = allResults;
                        if (!error &&
                            queryResults &&
                            queryResults.findIndex((el) => el === undefined) >=
                                0) {
                            // some result is unexpectedly undefined; seen this under Node from
                            // https://github.com/driverdan/node-XMLHttpRequest/issues/162
                            // where the HTTP client lib is not reporting back an actual error value
                            // when something happens like a response timeout
                            error = new Error("One or more requests did not return a result, but no error was reported.");
                        }
                        if (!error && queryResults) {
                            queryResults.forEach((queryResult) => {
                                const dataArray = datumExtractor(queryResult);
                                if (!dataArray) {
                                    return;
                                }
                                this.#results =
                                    this.#results.concat(dataArray);
                            });
                        }
                        this.#handleResults(error !== null ? error : undefined, true);
                    });
                }
                else {
                    // serially move to next page
                    this.#loadData(page.withOffset(nextOffset));
                }
            }
        };
        if (q) {
            q.defer(query);
        }
        else {
            query(handler);
        }
    }
}
/**
 * Extract the datum list from the returned data.
 *
 * @param data the JSON results to extract from
 * @returns the extracted data
 */
function datumExtractor(data) {
    if (Array.isArray(data?.results)) {
        return data.results;
    }
    return undefined;
}
/**
 * Extract the "next" offset to use based on the returned data.
 *
 * If `page` is supplied, then pagination will be based on `page.max` and will continue
 * until less than that many results are returned. If `page` is not supplied, then
 * pagination will be based on `data.returnedResultCount` and will continue until
 * `data.totalResults` has been returned.
 *
 * @param data the JSON results to extract from
 * @param page the incremental mode page
 * @returns the extracted offset, or `0` if no more pages to return
 */
function offsetExtractor(data, page) {
    // don't bother with totalResults; just keep going unless returnedResultCount < page.max
    return data.returnedResultCount < page.max ||
        (data.totalResults !== undefined &&
            (data.totalResults === 0 ||
                (Array.isArray(data.results) &&
                    data.results.length === data.totalResults)))
        ? 0
        : data.startingOffset + page.max;
}

/**
 * Class to find the available datum date range for a set of datum filters.
 *
 * This is useful when generating reports or charts for a set of SolarNode datum streams,
 * so the overall start/end dates can be determined before requesting the actual data.
 * It returns an object starting and ending date related properties, for example:
 *
 * ```json
 * {
 *   "timeZone":        "Pacific/Auckland",
 *   "sDate":           Date(1248668709972),
 *   "startDate":       "2009-07-27 16:25",
 *   "startDateMillis": 1248668709972,
 *   "eDate":           Date(1379824746781),
 *   "endDate":         "2013-09-22 16:39",
 *   "endDateMillis":   1379824746781
 * }
 * ```
 *
 * Additionally a `ranges` property is provided with an array of each filter's raw
 * range result, so you can see each result individually if you need that.
 *
 * @example
 * // the simple case, for just one node
 * const filter = new DatumFilter();
 * filter.nodeId = 123;
 * filter.sourceIds = ['a', 'b'];
 * const range = await new DatumRangeFinder(new SolarQueryApi(), filter).fetch();
 *
 * @example
 * // more complex case, for multiple SolarNode / source ID combinations
 * const filter2 = new SolarQueryApi();
 * filter2.nodeId = 234;
 * filter2.sourceId = 'c';
 * const range2 = await new DatumRangeFinder(api, [filter, filter2]).fetch();
 *
 * @example
 * // with authentication; note the authentication must be valid for all nodes!
 * const auth = new AuthorizationV2Builder('my-token');
 * auth.saveSigningKey('secret');
 * const range3 = await new DatumRangeFinder(api, [filter1, filter2], auth).fetch();
 */
class DatumRangeFinder extends JsonClientSupport {
    #filters;
    /**
     * Constructor.
     *
     * @param api the API helper to use
     * @param filters the filter(s) to find the ranges for; each filter must provide at least
     *                one node ID
     * @param authBuilder the auth builder to authenticate requests with; if not provided
     *                    then only public data can be queried; when provided a pre-signed
     *                    key must be available
     */
    constructor(api, filters, authBuilder) {
        super(api, authBuilder);
        this.#filters = Array.isArray(filters) ? filters : [filters];
    }
    /**
     * Initiate loading the data.
     *
     * @returns a `Promise` for the final results
     */
    fetch() {
        return new Promise((resolve, reject) => {
            this.load((error, results) => {
                if (error) {
                    reject(error);
                }
                else if (!results) {
                    reject(new Error("Range not available."));
                }
                else {
                    resolve(results);
                }
            });
        });
    }
    /**
     * Asynchronously find the available datum range using a callback.
     *
     * @param callback the callback function to invoke with the results
     * @returns this object
     */
    load(callback) {
        const q = queue();
        for (const filter of this.#filters) {
            const url = this.api.reportableIntervalUrl(filter.nodeId, filter.sourceIds);
            q.defer(this.requestor(url));
        }
        q.awaitAll((error, results) => {
            if (error) {
                Logger.error("Error requesting available data range: %s", error);
                callback(error);
                return;
            }
            const result = this.#extractReportableInterval(results);
            callback(undefined, result);
        });
        return this;
    }
    #extractReportableInterval(results) {
        let result, i;
        for (i = 0; i < results.length; i += 1) {
            const repInterval = results[i];
            if (repInterval?.endDate === undefined) {
                Logger.debug("No data available for %s sources %s", this.#filters[i].nodeId, this.#filters[i].sourceIds !== undefined
                    ? this.#filters[i].sourceIds.join(",")
                    : "");
                continue;
            }
            if (result === undefined) {
                result = Object.assign({}, repInterval);
            }
            else {
                // merge start/end dates
                // note we don't copy the time zone... this breaks when the tz are different!
                if (repInterval.endDateMillis > result.endDateMillis) {
                    result.endDateMillis = repInterval.endDateMillis;
                    result.endDate = repInterval.endDate;
                }
                if (repInterval.startDateMillis < result.startDateMillis) {
                    result.startDateMillis = repInterval.startDateMillis;
                    result.startDate = repInterval.startDate;
                }
            }
        }
        if (result) {
            if (result.startDateMillis !== undefined) {
                result.sDate = new Date(result.startDateMillis);
            }
            if (result.endDateMillis !== undefined) {
                result.eDate = new Date(result.endDateMillis);
            }
            result.ranges = results;
        }
        return result;
    }
}

/**
 * Class to find the available datum sources for a set of node datum URL helpers.
 *
 * This helper is useful for finding what source IDs are avaialble for a set of nodes.
 * It returns an object with node ID properties with associated source ID array values,
 * for example:
 *
 * ```
 * { 123: ["a", "b", "c"] }
 * ```
 * @example
 * // the simple case, all available sources for just one SolarNode
 * const filter = new DatumFilter();
 * filter.nodeId = 123;
 * const sources = await new DatumSourceFinder(new SolarQueryApi(), filter).fetch();
 *
 * @example
 * // find all sources matching a wildcard pattern within the past day
 * const filter2 = new DatumFilter();
 * filter2.startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
 * filter2.sourceId = '/power/**';
 * const sources2 = await new DatumSourceFinder(new SolarQueryApi(), filter2).fetch();
 *
 * @example
 * // find all sources across multiple SolarNodes
 * const filter3 = new DatumFilter();
 * filter3.nodeId = 234;
 * const sources3 = await new DatumSourceFinder(new SolarQueryApi(), [urlHelper1, urlHelper3]).fetch();
 */
class DatumSourceFinder extends JsonClientSupport {
    #filters;
    /**
     * Constructor.
     *
     * @param api the API helper to use
     * @param filters the filter(s) to find the sources for
     * @param authBuilder the auth builder to authenticate requests with; if not provided
     *                    then only public data can be queried; when provided a pre-signed
     *                    key must be available
     */
    constructor(api, filters, authBuilder) {
        super(api, authBuilder);
        this.#filters = Array.isArray(filters) ? filters : [filters];
    }
    /**
     * Initiate loading the data.
     *
     * @returns a `Promise` for the final results
     */
    fetch() {
        return new Promise((resolve, reject) => {
            this.load((error, results) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(results);
                }
            });
        });
    }
    /**
     * Asynchronously find the available sources using a callback.
     *
     * @param callback the callback function to invoke with the results
     * @returns this object
     */
    load(callback) {
        const q = queue();
        for (const filter of this.#filters) {
            const url = this.api.availableSourcesUrl(filter, true);
            q.defer(this.requestor(url));
        }
        q.awaitAll((error, results) => {
            if (error || !results) {
                Logger.error("Error requesting available sources: %s", error);
                callback(error);
                return;
            }
            const result = {};
            for (const data of results) {
                if (!data) {
                    continue;
                }
                for (const pair of data) {
                    let nodeIds = result[pair.nodeId];
                    if (!nodeIds) {
                        nodeIds = [];
                        result[pair.nodeId] = nodeIds;
                    }
                    if (nodeIds.indexOf(pair.sourceId) < 0) {
                        nodeIds.push(pair.sourceId);
                    }
                }
            }
            callback(undefined, result);
        });
        return this;
    }
}

var index$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    ControlDatum: ControlDatum,
    ControlToggler: ControlToggler,
    DatumLoader: DatumLoader,
    DatumRangeFinder: DatumRangeFinder,
    DatumSourceFinder: DatumSourceFinder
});

/**
 * Get an appropriate multiplier value for scaling a given value to a more display-friendly form.
 *
 * This will return values suitable for passing to {@link Util.Numbers.displayUnitsForScale}.
 *
 * @param value - the value to get a display scale factor for, for example the maximum value
 *     in a range of values
 * @return the display scale factor
 */
function displayScaleForValue(value) {
    let result = 1;
    const num = Math.abs(Number(value));
    if (isNaN(num) === false) {
        if (num >= 1000000000) {
            result = 1000000000;
        }
        else if (num >= 1000000) {
            result = 1000000;
        }
        else if (num >= 1000) {
            result = 1000;
        }
    }
    return result;
}
/**
 * Get an appropriate display unit for a given base unit and scale factor.
 *
 * Use this method to render scaled data value units. Typically you would first call
 * {@link Util.Numbers.displayScaleForValue}, passing in the largest expected value
 * in a set of data, and then pass the result to this method to generate a display unit
 * for the base unit for that data.
 *
 * For example, given a base unit of `W` (watts) and a maximum data value of `10000`:
 *
 * ```
 * const displayScale = displayScaleForValue(10000);
 * const displayUnit = displayUnitForScale('W', displayScale);
 * ```
 *
 * The `displayUnit` result in that example would be `kW`.
 *
 * @param baseUnit - the base unit, for example `W` or `Wh`
 * @param scale - the unit scale, which must be a recognized SI scale, such as `1000` for `k`
 * @return the display unit value
 */
function displayUnitsForScale(baseUnit, scale) {
    return ((scale === 1000000000
        ? "G"
        : scale === 1000000
            ? "M"
            : scale === 1000
                ? "k"
                : "") + baseUnit);
}

var numbers = /*#__PURE__*/Object.freeze({
    __proto__: null,
    displayScaleForValue: displayScaleForValue,
    displayUnitsForScale: displayUnitsForScale
});

var index = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Arrays: arrays,
    BitmaskEnum: BitmaskEnum,
    ComparableEnum: ComparableEnum,
    Configuration: Configuration,
    Dates: dates,
    Datum: datum,
    DatumStreamMetadataRegistry: DatumStreamMetadataRegistry,
    Enum: Enum,
    KeyedEnum: KeyedEnum,
    get LogLevel () { return LogLevel; },
    Logger: Logger,
    MultiMap: MultiMap,
    Numbers: numbers,
    Objects: objects,
    PropMap: PropMap
});

export { index$3 as Domain, index$2 as Net, index$1 as Tool, index as Util };
//# sourceMappingURL=solarnetwork-api-core.es.js.map
