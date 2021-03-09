// https://github.com/SolarNetwork/sn-api-core-js Version 0.23.1-dev.0. Copyright 2021 SolarNetwork Foundation.
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-array'), require('d3-collection'), require('d3-time'), require('d3-time-format'), require('crypto-js/enc-base64'), require('crypto-js/enc-hex'), require('crypto-js/hmac-sha256'), require('crypto-js/sha256'), require('uri-js')) :
	typeof define === 'function' && define.amd ? define(['exports', 'd3-array', 'd3-collection', 'd3-time', 'd3-time-format', 'crypto-js/enc-base64', 'crypto-js/enc-hex', 'crypto-js/hmac-sha256', 'crypto-js/sha256', 'uri-js'], factory) :
	(global = global || self, factory(global.sn = {}, global.d3, global.d3, global.d3, global.d3, global.CryptoJS.Base64, global.CryptoJS.Hex, global.CryptoJS.HmacSHA256, global.CryptoJS.SHA256, global.URI));
}(this, (function (exports, d3Array, d3Collection, d3Time, d3TimeFormat, Base64, Hex, HmacSHA256, SHA256, uriJs) { 'use strict';

	Base64 = Base64 && Object.prototype.hasOwnProperty.call(Base64, 'default') ? Base64['default'] : Base64;
	Hex = Hex && Object.prototype.hasOwnProperty.call(Hex, 'default') ? Hex['default'] : Hex;
	HmacSHA256 = HmacSHA256 && Object.prototype.hasOwnProperty.call(HmacSHA256, 'default') ? HmacSHA256['default'] : HmacSHA256;
	SHA256 = SHA256 && Object.prototype.hasOwnProperty.call(SHA256, 'default') ? SHA256['default'] : SHA256;

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
	 * @param {object[]} data the raw data returned from SolarNetwork; this array is modified in-place
	 * @param {module:domain~Aggregation} aggregate the expected aggregate level of the data
	 * @returns {void}
	 * @alias module:data~timeNormalizeDataArray
	 */
	function timeNormalizeDataArray(data, aggregate) {
	  var aggMillseconds = aggregate.level * 1000;

	  if (!Array.isArray(data) || data.length < 2) {
	    return data;
	  }

	  var i = 0;

	  while (i < data.length - 1) {
	    var d = data[i];
	    var currTime = d.date.getTime();
	    var expectedNextTime = currTime + aggMillseconds;
	    var nextTime = data[i + 1].date.getTime();

	    if (nextTime > expectedNextTime) {
	      var fill = [i + 1, 0];

	      for (var fillTime = currTime + aggMillseconds; fillTime < nextTime; fillTime += aggMillseconds) {
	        var f = Object.create(Object.getPrototypeOf(d), Object.getOwnPropertyDescriptors(d));

	        for (var p in f) {
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
	var array = Object.freeze({
	  timeNormalizeDataArray: timeNormalizeDataArray
	});

	function _typeof(obj) {
	  "@babel/helpers - typeof";

	  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
	    _typeof = function (obj) {
	      return typeof obj;
	    };
	  } else {
	    _typeof = function (obj) {
	      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	    };
	  }

	  return _typeof(obj);
	}

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}

	function _defineProperties(target, props) {
	  for (var i = 0; i < props.length; i++) {
	    var descriptor = props[i];
	    descriptor.enumerable = descriptor.enumerable || false;
	    descriptor.configurable = true;
	    if ("value" in descriptor) descriptor.writable = true;
	    Object.defineProperty(target, descriptor.key, descriptor);
	  }
	}

	function _createClass(Constructor, protoProps, staticProps) {
	  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	  if (staticProps) _defineProperties(Constructor, staticProps);
	  return Constructor;
	}

	function _inherits(subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function");
	  }

	  subClass.prototype = Object.create(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) _setPrototypeOf(subClass, superClass);
	}

	function _getPrototypeOf(o) {
	  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
	    return o.__proto__ || Object.getPrototypeOf(o);
	  };
	  return _getPrototypeOf(o);
	}

	function _setPrototypeOf(o, p) {
	  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
	    o.__proto__ = p;
	    return o;
	  };

	  return _setPrototypeOf(o, p);
	}

	function _isNativeReflectConstruct() {
	  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
	  if (Reflect.construct.sham) return false;
	  if (typeof Proxy === "function") return true;

	  try {
	    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
	    return true;
	  } catch (e) {
	    return false;
	  }
	}

	function _assertThisInitialized(self) {
	  if (self === void 0) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return self;
	}

	function _possibleConstructorReturn(self, call) {
	  if (call && (typeof call === "object" || typeof call === "function")) {
	    return call;
	  }

	  return _assertThisInitialized(self);
	}

	function _createSuper(Derived) {
	  var hasNativeReflectConstruct = _isNativeReflectConstruct();

	  return function _createSuperInternal() {
	    var Super = _getPrototypeOf(Derived),
	        result;

	    if (hasNativeReflectConstruct) {
	      var NewTarget = _getPrototypeOf(this).constructor;

	      result = Reflect.construct(Super, arguments, NewTarget);
	    } else {
	      result = Super.apply(this, arguments);
	    }

	    return _possibleConstructorReturn(this, result);
	  };
	}

	function _superPropBase(object, property) {
	  while (!Object.prototype.hasOwnProperty.call(object, property)) {
	    object = _getPrototypeOf(object);
	    if (object === null) break;
	  }

	  return object;
	}

	function _get(target, property, receiver) {
	  if (typeof Reflect !== "undefined" && Reflect.get) {
	    _get = Reflect.get;
	  } else {
	    _get = function _get(target, property, receiver) {
	      var base = _superPropBase(target, property);

	      if (!base) return;
	      var desc = Object.getOwnPropertyDescriptor(base, property);

	      if (desc.get) {
	        return desc.get.call(receiver);
	      }

	      return desc.value;
	    };
	  }

	  return _get(target, property, receiver || target);
	}

	function _slicedToArray(arr, i) {
	  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
	}

	function _arrayWithHoles(arr) {
	  if (Array.isArray(arr)) return arr;
	}

	function _iterableToArrayLimit(arr, i) {
	  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
	  var _arr = [];
	  var _n = true;
	  var _d = false;
	  var _e = undefined;

	  try {
	    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
	      _arr.push(_s.value);

	      if (i && _arr.length === i) break;
	    }
	  } catch (err) {
	    _d = true;
	    _e = err;
	  } finally {
	    try {
	      if (!_n && _i["return"] != null) _i["return"]();
	    } finally {
	      if (_d) throw _e;
	    }
	  }

	  return _arr;
	}

	function _unsupportedIterableToArray(o, minLen) {
	  if (!o) return;
	  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
	  var n = Object.prototype.toString.call(o).slice(8, -1);
	  if (n === "Object" && o.constructor) n = o.constructor.name;
	  if (n === "Map" || n === "Set") return Array.from(o);
	  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
	}

	function _arrayLikeToArray(arr, len) {
	  if (len == null || len > arr.length) len = arr.length;

	  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

	  return arr2;
	}

	function _nonIterableRest() {
	  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	}

	function _createForOfIteratorHelper(o, allowArrayLike) {
	  var it;

	  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
	    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
	      if (it) o = it;
	      var i = 0;

	      var F = function () {};

	      return {
	        s: F,
	        n: function () {
	          if (i >= o.length) return {
	            done: true
	          };
	          return {
	            done: false,
	            value: o[i++]
	          };
	        },
	        e: function (e) {
	          throw e;
	        },
	        f: F
	      };
	    }

	    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	  }

	  var normalCompletion = true,
	      didErr = false,
	      err;
	  return {
	    s: function () {
	      it = o[Symbol.iterator]();
	    },
	    n: function () {
	      var step = it.next();
	      normalCompletion = step.done;
	      return step;
	    },
	    e: function (e) {
	      didErr = true;
	      err = e;
	    },
	    f: function () {
	      try {
	        if (!normalCompletion && it.return != null) it.return();
	      } finally {
	        if (didErr) throw err;
	      }
	    }
	  };
	}

	/**
	 * An enumerated object base class.
	 *
	 * This class is essentially abstract, and must be extended by another
	 * class that overrides the {@link module:util~Enum.enumValues} method.
	 *
	 * @abstract
	 * @alias module:util~Enum
	 */
	var Enum = /*#__PURE__*/function () {
	  /**
	   * Constructor.
	   *
	   * @param {string} name the name
	   */
	  function Enum(name) {
	    _classCallCheck(this, Enum);

	    this._name = name;

	    if (this.constructor === Enum) {
	      Object.freeze(this);
	    }
	  }
	  /**
	   * Get the enum name.
	   *
	   * @returns {string} the  name
	   */


	  _createClass(Enum, [{
	    key: "name",
	    get: function get() {
	      return this._name;
	    }
	    /**
	     * Test if a string is equal to this enum's name.
	     *
	     * As long as enum values are consistently obtained from the {@link module:util~Enum.enumValues}
	     * array then enum instances can be compared with `===`. If unsure, this method can be used
	     * to compare string values instead.
	     *
	     * If `value` is passed as an actual Enum instance, then if that enum is the same class
	     * as this enum it's `name` is compared to this instance's `name`.
	     *
	     * @param {string|Enum} value the value to test
	     * @returns {boolean} `true` if `value` is the same as this instance's `name` value
	     */

	  }, {
	    key: "equals",
	    value: function equals(value) {
	      if (this.constructor === value.constructor) {
	        return value.name === this.name;
	      }

	      return value === this.name;
	    }
	    /**
	     * Get all enum values.
	     *
	     * This method must be overridden by subclasses to return something meaningful.
	     * This implementation returns an empty array.
	     *
	     * @abstract
	     * @returns {module:util~Enum[]} get all enum values
	     */

	  }], [{
	    key: "enumValues",
	    value: function enumValues() {
	      return [];
	    }
	    /**
	     * This method takes an array of enums and turns them into a mapped object, using the enum
	     * `name` as object property names.
	     *
	     * @param {module:util~Enum[]} enums the enum list to turn into a value object
	     * @returns {object} an object with enum `name` properties with associated enum values
	     */

	  }, {
	    key: "enumsValue",
	    value: function enumsValue(enums) {
	      return Object.freeze(enums.reduce(function (obj, e) {
	        obj[e.name] = e;
	        return obj;
	      }, {}));
	    }
	    /**
	     * Get an enum instance from its name.
	     *
	     * This method searches the {@link module:util~Enum#enumVvalues} array for a matching value.
	     *
	     * @param {string} name the enum name to get an instnace for
	     * @returns {module:util~Enum} the instance, or `undefined` if no instance exists for the given `name`
	     */

	  }, {
	    key: "valueOf",
	    value: function valueOf(name) {
	      var enums = this.enumValues();

	      if (!Array.isArray(enums)) {
	        return undefined;
	      }

	      for (var i = 0, len = enums.length; i < len; i += 1) {
	        if (name === enums[i].name) {
	          return enums[i];
	        }
	      }
	    }
	  }, {
	    key: "namesFor",
	    value: function namesFor(set) {
	      var result = [];

	      if (set) {
	        var _iterator = _createForOfIteratorHelper(set),
	            _step;

	        try {
	          for (_iterator.s(); !(_step = _iterator.n()).done;) {
	            var e = _step.value;
	            result.push(e.name);
	          }
	        } catch (err) {
	          _iterator.e(err);
	        } finally {
	          _iterator.f();
	        }
	      }

	      return result;
	    }
	  }]);

	  return Enum;
	}();

	/**
	 * An immutable enum-like object with an associated comparable value.
	 *
	 * This class is essentially abstract, and must be extended by another
	 * class that overrides the inerited {@link module:util~Enum.enumValues} method.
	 *
	 * @abstract
	 * @extends module:util~Enum
	 * @alias module:util~ComparableEnum
	 */

	var ComparableEnum = /*#__PURE__*/function (_Enum) {
	  _inherits(ComparableEnum, _Enum);

	  var _super = _createSuper(ComparableEnum);

	  /**
	   * Constructor.
	   *
	   * @param {string} name the name
	   * @param {number} value the comparable value
	   */
	  function ComparableEnum(name, value) {
	    var _this;

	    _classCallCheck(this, ComparableEnum);

	    _this = _super.call(this, name);
	    _this._value = value;

	    if (_this.constructor === ComparableEnum) {
	      Object.freeze(_assertThisInitialized(_this));
	    }

	    return _this;
	  }
	  /**
	   * Get the comparable value.
	   *
	   * @returns {number} the value
	   */


	  _createClass(ComparableEnum, [{
	    key: "value",
	    get: function get() {
	      return this._value;
	    }
	    /**
	     * Compare two ComparableEnum objects based on their `value` values.
	     *
	     * @param {ComparableEnum} other the object to compare to
	     * @returns {number} `-1` if `this.value` is less than `other.value`,
	     *                   `1` if `this.value` is greater than `other.value`,
	     *                   `0` otherwise (when the values are equal)
	     */

	  }, {
	    key: "compareTo",
	    value: function compareTo(other) {
	      return this.value < other.value ? -1 : this.value > other.value ? 1 : 0;
	    }
	    /**
	     * Compute a complete set of enum values based on a minimum enum and/or set of enums.
	     *
	     * If `cache` is provided, then results computed via `minAggregation`
	     * will be cached there, and subsequent calls will returned the cached result when appropriate.
	     *
	     * @param {ComparableEnum} [minEnum] a minimum enum value
	     * @param {Map<string, Set<ComparableEnum>>} [cache] a cache of computed values
	     * @returns {Set<ComparableEnum>|null} the computed set, or `null` if no values match
	     */

	  }], [{
	    key: "minimumEnumSet",
	    value: function minimumEnumSet(minEnum, cache) {
	      if (!minEnum) {
	        return null;
	      }

	      var result = cache ? cache.get(minEnum.name) : undefined;

	      if (result) {
	        return result;
	      }

	      result = new Set();

	      var _iterator = _createForOfIteratorHelper(minEnum.constructor.enumValues()),
	          _step;

	      try {
	        for (_iterator.s(); !(_step = _iterator.n()).done;) {
	          var agg = _step.value;

	          if (agg.compareTo(minEnum) > -1) {
	            result.add(agg);
	          }
	        }
	      } catch (err) {
	        _iterator.e(err);
	      } finally {
	        _iterator.f();
	      }

	      if (cache) {
	        cache.set(minEnum.name, result);
	      }

	      return result.size > 0 ? result : null;
	    }
	  }]);

	  return ComparableEnum;
	}(Enum);

	/**
	 * A named aggregation.
	 *
	 * @extends module:util~ComparableEnum
	 * @alias module:domain~Aggregation
	 */

	var Aggregation = /*#__PURE__*/function (_ComparableEnum) {
	  _inherits(Aggregation, _ComparableEnum);

	  var _super = _createSuper(Aggregation);

	  /**
	   * Constructor.
	   *
	   * @param {string} name the unique name for this precision
	   * @param {number} level a relative aggregation level value
	   */
	  function Aggregation(name, level) {
	    var _this;

	    _classCallCheck(this, Aggregation);

	    _this = _super.call(this, name, level);

	    if (_this.constructor === Aggregation) {
	      Object.freeze(_assertThisInitialized(_this));
	    }

	    return _this;
	  }
	  /**
	   * Get the aggregate level value.
	   *
	   * This is an alias for {@link module:util~ComparableEnum#value}.
	   */


	  _createClass(Aggregation, [{
	    key: "level",
	    get: function get() {
	      return this.value;
	    }
	    /**
	     * Get the {@link module:domain~Aggregations} values.
	     *
	     * @override
	     * @inheritdoc
	     */

	  }], [{
	    key: "enumValues",
	    value: function enumValues() {
	      return AggregationValues;
	    }
	  }]);

	  return Aggregation;
	}(ComparableEnum);

	var AggregationValues = Object.freeze([new Aggregation("Minute", 60), new Aggregation("FiveMinute", 60 * 5), new Aggregation("TenMinute", 60 * 10), new Aggregation("FifteenMinute", 60 * 15), new Aggregation("ThirtyMinute", 60 * 30), new Aggregation("Hour", 3600), new Aggregation("HourOfDay", 3600), new Aggregation("SeasonalHourOfDay", 3600), new Aggregation("Day", 86400), new Aggregation("DayOfWeek", 86400), new Aggregation("SeasonalDayOfWeek", 86400), new Aggregation("Week", 604800), new Aggregation("WeekOfYear", 604800), new Aggregation("Month", 2419200), new Aggregation("Year", 31536000), new Aggregation("RunningTotal", Number.MAX_SAFE_INTEGER)]);
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

	var Aggregations = Aggregation.enumsValue(AggregationValues);

	/**
	 * Format a date into a SolarNet UTC timestamp format.
	 * @function
	 * @param {Date} date the date to format
	 * @returns {string} the formatted date value - `yyyy-MM-dd HH:mm:ss.SSS'Z'`
	 * @alias module:format~timestampFormat
	 */

	var timestampFormat = d3TimeFormat.utcFormat("%Y-%m-%d %H:%M:%S.%LZ");
	/**
	 * Format a date into a SolarNet UTC date/time format.
	 * @function
	 * @param {Date} date the date to format
	 * @returns {string} the formatted date value - `yyyy-MM-dd HH:mm`
	 * @alias module:format~dateTimeFormat
	 */

	var dateTimeFormat = d3TimeFormat.utcFormat("%Y-%m-%d %H:%M");
	/**
	 * Format a date into a SolarNet URL UTC date/time format.
	 * @function
	 * @param {Date} date the date to format
	 * @returns {string} the formatted date value - `yyyy-MM-dd'T'HH:mm`
	 * @alias module:format~dateTimeUrlFormat
	 */

	var dateTimeUrlFormat = d3TimeFormat.utcFormat("%Y-%m-%dT%H:%M");
	/**
	 * Format a date into a SolarNet UTC date format.
	 * @function
	 * @param {Date} date the date to format
	 * @returns {string} the formatted date value - `yyyy-MM-dd`
	 * @alias module:format~dateFormat
	 */

	var dateFormat = d3TimeFormat.utcFormat("%Y-%m-%d");
	/**
	 * Parse a SolarNet UTC timestamp value.
	 * @function
	 * @param {string} str the string to parse - `yyyy-MM-dd HH:mm:ss.SSS'Z'
	 * @returns {Date} the parsed date, or `null`
	 * @alias module:format~timestampParse
	 */

	var timestampParse = d3TimeFormat.utcParse("%Y-%m-%d %H:%M:%S.%LZ");
	/**
	 * Parse a SolarNet UTC date/time.
	 * @function
	 * @param {string} str the string to parse - `yyyy-MM-dd HH:mm
	 * @returns {Date} the parsed date, or `null`
	 * @alias module:format~dateTimeParse
	 */

	var dateTimeParse = d3TimeFormat.utcParse("%Y-%m-%d %H:%M");
	/**
	 * Parse a UTC date string, from a variety of supported formats.
	 *
	 * @param {String} str the string to parse into a date
	 * @returns {Date} the parsed `Date`, or `null` if the date can't be parsed
	 * @alias module:format~dateParser
	 */

	function dateParser(str) {
	  var date = d3TimeFormat.isoParse(str) || timestampParse(str) || dateTimeParse(str);
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

	function iso8601Date(date, includeTime) {
	  return "" + date.getUTCFullYear() + (date.getUTCMonth() < 9 ? "0" : "") + (date.getUTCMonth() + 1) + (date.getUTCDate() < 10 ? "0" : "") + date.getUTCDate() + (includeTime ? "T" + (date.getUTCHours() < 10 ? "0" : "") + date.getUTCHours() + (date.getUTCMinutes() < 10 ? "0" : "") + date.getUTCMinutes() + (date.getUTCSeconds() < 10 ? "0" : "") + date.getUTCSeconds() + "Z" : "");
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

	function seasonForDate(date) {
	  var m = date.getUTCMonth ? date.getUTCMonth() : Number(date);

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
	 * @alias module:util~rollingQueryDateRange
	 */

	function rollingQueryDateRange(aggregate, aggregateTimeCount, endDate) {
	  endDate = endDate || new Date();

	  function exclusiveEndDate(interval, date) {
	    var result = interval.ceil(date);

	    if (result.getTime() === date.getTime()) {
	      // already on exact aggregate, so round up to next
	      result = interval.offset(result, 1);
	    }

	    return result;
	  }

	  function timeCountValue(propName) {
	    var result;

	    if (isNaN(Number(aggregateTimeCount))) {
	      if (aggregateTimeCount[propName] !== undefined) {
	        result = Number(aggregateTimeCount[propName]);
	      } else {
	        result = 1;
	      }
	    } else {
	      result = aggregateTimeCount;
	    }

	    if (typeof result !== "number") {
	      result = 1;
	    }

	    return result;
	  }

	  var end, start, timeUnit, timeCount;

	  if (aggregate.compareTo(Aggregations.Hour) < 0) {
	    timeCount = timeCountValue("numHours");
	    timeUnit = Aggregations.Hour;
	    end = exclusiveEndDate(d3Time.utcMinute, endDate);
	    var precision = Math.min(30, aggregate.level / 60);
	    end.setUTCMinutes(end.getUTCMinutes() + precision - end.getUTCMinutes() % precision, 0, 0);
	    start = d3Time.utcHour.offset(end, -timeCount);
	  } else if (Aggregations.Month.equals(aggregate)) {
	    timeCount = timeCountValue("numYears");
	    timeUnit = Aggregations.Year;
	    end = exclusiveEndDate(d3Time.utcMonth, endDate);
	    start = d3Time.utcYear.offset(d3Time.utcMonth.floor(endDate), -timeCount);
	  } else if (Aggregations.Day.equals(aggregate)) {
	    timeCount = timeCountValue("numMonths");
	    timeUnit = Aggregations.Month;
	    end = exclusiveEndDate(d3Time.utcDay, endDate);
	    start = d3Time.utcMonth.offset(d3Time.utcDay.floor(endDate), -timeCount);
	  } else {
	    // assume Hour
	    timeCount = timeCountValue("numDays");
	    timeUnit = Aggregations.Day;
	    end = exclusiveEndDate(d3Time.utcHour, endDate);
	    start = d3Time.utcDay.offset(d3Time.utcHour.floor(end), -timeCount);
	  }

	  return {
	    start: start,
	    end: end,
	    timeUnit: timeUnit,
	    timeCount: timeCount,
	    aggregate: aggregate
	  };
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
	 * @param {Object} d the datum object to extract a date from
	 * @returns {Date} the extracted date, or `null` if no date could be extracted
	 * @alias module:util~datumDate
	 */

	function datumDate(d) {
	  if (!d) {
	    return null;
	  }

	  if (d.date) {
	    return d.date;
	  } else if (d.localDate) {
	    return dateTimeParse(d.localDate + (d.localTime ? " " + d.localTime : " 00:00"));
	  } else if (d.created) {
	    return timestampParse(d.created) || d3TimeFormat.isoParse(d.created);
	  }
	}
	var date = Object.freeze({
	  datumDate: datumDate,
	  rollingQueryDateRange: rollingQueryDateRange
	});

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
	 * @param {object[]} layerData - An array of objects with `key` and `values` properties, as returned from `d3.nest().entries()`
	 * @param {string} layerData.key - The layer's key value.
	 * @param {object[]} layerData.values - The layer's value array.
	 * @param {object} [fillTemplate] - An object to use as a template for any filled-in data objects.
	 *                                  The `date` property will be populated automatically, and a `sourceId`
	 *                                  property will be populated by the layer's `key`.
	 * @param {module:data~NestedDataOperatorFunction} [fillFn] - An optional function to populate filled-in data objects with.
	 *                                                            This function is invoked **after** populating any `fillTemplate` values.
	 * @returns {void}
	 * @alias module:data~normalizeNestedStackDataByDate
	 */

	function normalizeNestedStackDataByDate(layerData, fillTemplate, fillFn) {
	  var i = 0,
	      j,
	      k,
	      jMax = layerData.length - 1,
	      dummy,
	      prop,
	      copyIndex; // fill in "holes" for each stack, if more than one stack. we assume data already sorted by date

	  if (jMax > 0) {
	    while (i < d3Array.max(layerData.map(function (e) {
	      return e.values.length;
	    }))) {
	      dummy = undefined;

	      for (j = 0; j <= jMax; j++) {
	        if (layerData[j].values.length <= i) {
	          continue;
	        }

	        if (j < jMax) {
	          k = j + 1;
	        } else {
	          k = 0;
	        }

	        if (layerData[k].values.length <= i || layerData[j].values[i].date.getTime() < layerData[k].values[i].date.getTime()) {
	          dummy = {
	            date: layerData[j].values[i].date,
	            sourceId: layerData[k].key
	          };

	          if (fillTemplate) {
	            for (prop in fillTemplate) {
	              if (fillTemplate.hasOwnProperty(prop)) {
	                dummy[prop] = fillTemplate[prop];
	              }
	            }
	          }

	          if (fillFn) {
	            copyIndex = layerData[k].values.length > i ? i : i > 0 ? i - 1 : null;
	            fillFn(dummy, layerData[k].key, copyIndex !== null ? layerData[k].values[copyIndex] : undefined);
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
	 * @param {object[]} layerData - An array of objects with `key` and `values` properties, as returned from `d3.nest().entries()`
	 * @param {string} layerData.key - The layer's key value.
	 * @param {object[]} layerData.values - The layer's value array.
	 * @param {string} resultKey - The `key` property to assign to the returned layer.
	 * @param {string[]} copyProperties - An array of string property names to copy as-is from the **first** layer's data values.
	 * @param {string[]} sumProperties - An array of string property names to add together from **all** layer data.
	 * @param {object} staticProperties - Static properties to copy as-is to **all** output data values.
	 * @return {object[]} An array of objects with `key` and `value` properties, the same structure as the provided `layerData` argument
	 * @alias module:data~aggregateNestedDataLayers
	 */

	function aggregateNestedDataLayers(layerData, resultKey, copyProperties, sumProperties, staticProperties) {
	  // combine all layers into a single source
	  var layerCount = layerData.length,
	      dataLength,
	      i,
	      j,
	      k,
	      copyPropLength = copyProperties ? copyProperties.length : 0,
	      sumPropLength = sumProperties ? sumProperties.length : 0,
	      d,
	      val,
	      clone,
	      array;
	  dataLength = layerData[0].values.length;

	  if (dataLength > 0) {
	    array = [];

	    for (i = 0; i < dataLength; i += 1) {
	      d = layerData[0].values[i];
	      clone = {};

	      if (staticProperties !== undefined) {
	        for (val in staticProperties) {
	          if (staticProperties.hasOwnProperty(val)) {
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

	    layerData = [{
	      key: resultKey,
	      values: array
	    }];
	  }

	  return layerData;
	}
	/**
	 * Transform raw SolarNetwork timeseries data by combining datum from multiple sources into a single
	 * data per time key.
	 *
	 * This method produces a single array of objects with metric properties derived by grouping
	 * that property within a single time slot across one or more source IDs. Conceptually this is
	 * similar to {@link module:data~aggregateNestedDataLayers} except groups of source IDs can be
	 * produced in the final result.
	 *
	 * The data will be passed through {@link module:data~normalizeNestedStackDataByDate} so that every
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
	 * @param {object[]} data the raw data returned from SolarNetwork
	 * @param {string} metricName the datum property name to extract
	 * @param {Map} [sourceIdMap] an optional mapping of input source IDs to output source IDs; this can be used
	 *                            to control the grouping of data, by mapping multiple input source IDs to the same
	 *                            output source ID
	 * @param {function} [aggFn] an optional aggregate function to apply to the metric values;
	 *                           defaults to `d3.sum`; **note** that the function will be passed an array of input
	 *                           data objects, not metric values
	 * @returns {object[]} array of datum objects, each with a date and one metric value per source ID
	 * @alias module:data~groupedBySourceMetricDataArray
	 */

	function groupedBySourceMetricDataArray(data, metricName, sourceIdMap, aggFn) {
	  var metricExtractorFn = function metricExtractor(d) {
	    return d[metricName];
	  };

	  var rollupFn = typeof aggFn === "function" ? aggFn : d3Array.sum;
	  var layerData = d3Collection.nest() // group first by source
	  .key(function (d) {
	    return sourceIdMap && sourceIdMap.has(d.sourceId) ? sourceIdMap.get(d.sourceId) : d.sourceId;
	  }).sortKeys(d3Array.ascending) // group second by date
	  .key(function (d) {
	    return d.localDate + " " + d.localTime;
	  }) // sum desired property in date group
	  .rollup(function (values) {
	    var r = {
	      date: datumDate(values[0])
	    };
	    var metricKey = values[0].sourceId;

	    if (sourceIdMap && sourceIdMap.has(metricKey)) {
	      metricKey = sourceIdMap.get(metricKey);
	    }

	    r[metricKey] = rollupFn(values, metricExtractorFn);
	    return r;
	  }) // un-nest to single group by source
	  .entries(data).map(function (layer) {
	    return {
	      key: layer.key,
	      values: layer.values.map(function (d) {
	        return d.value;
	      })
	    };
	  }); // ensure all layers have the same time keys

	  normalizeNestedStackDataByDate(layerData, null, function (d, key) {
	    // make sure filled-in data has the metric property defined
	    d[key] = null;
	  }); // reduce to single array with multiple metric properties

	  return layerData.reduce(function (combined, layer) {
	    if (!combined) {
	      return layer.values;
	    }

	    combined.forEach(function (d, i) {
	      var v = layer.values[i][layer.key];
	      d[layer.key] = v;
	    });
	    return combined;
	  }, null);
	}
	var nest = Object.freeze({
	  aggregateNestedDataLayers: aggregateNestedDataLayers,
	  groupedBySourceMetricDataArray: groupedBySourceMetricDataArray,
	  normalizeNestedStackDataByDate: normalizeNestedStackDataByDate
	});

	/**
	 * An auth token status.
	 *
	 * @extends module:util~Enum
	 * @alias module:domain~AuthTokenStatus
	 */

	var AuthTokenStatus = /*#__PURE__*/function (_Enum) {
	  _inherits(AuthTokenStatus, _Enum);

	  var _super = _createSuper(AuthTokenStatus);

	  /**
	   * Constructor.
	   *
	   * @param {string} name the name
	   */
	  function AuthTokenStatus(name) {
	    var _this;

	    _classCallCheck(this, AuthTokenStatus);

	    _this = _super.call(this, name);

	    if (_this.constructor === AuthTokenStatus) {
	      Object.freeze(_assertThisInitialized(_this));
	    }

	    return _this;
	  }
	  /**
	   * Get the {@link module:domain~AuthTokenStatuses} values.
	   *
	   * @inheritdoc
	   */


	  _createClass(AuthTokenStatus, null, [{
	    key: "enumValues",
	    value: function enumValues() {
	      return AuthTokenStatusValues;
	    }
	  }]);

	  return AuthTokenStatus;
	}(Enum);
	var AuthTokenStatusValues = Object.freeze([new AuthTokenStatus("Active"), new AuthTokenStatus("Disabled")]);
	/**
	 * The enumeration of supported AuthTokenStatus values.
	 *
	 * @readonly
	 * @enum {module:domain~AuthTokenStatus}
	 * @property {module:domain~AuthTokenStatus} Active the token is active and usable
	 * @property {module:domain~AuthTokenStatus} Disabled the token is disabled and not usable
	 * @alias module:domain~AuthTokenStatuses
	 */

	var AuthTokenStatuses = AuthTokenStatus.enumsValue(AuthTokenStatusValues);

	/**
	 * A named auth token type.
	 *
	 * @extends module:util~Enum
	 * @alias module:domain~AuthTokenType
	 */

	var AuthTokenType = /*#__PURE__*/function (_Enum) {
	  _inherits(AuthTokenType, _Enum);

	  var _super = _createSuper(AuthTokenType);

	  /**
	   * Constructor.
	   *
	   * @param {string} name the name
	   */
	  function AuthTokenType(name) {
	    var _this;

	    _classCallCheck(this, AuthTokenType);

	    _this = _super.call(this, name);

	    if (_this.constructor === AuthTokenType) {
	      Object.freeze(_assertThisInitialized(_this));
	    }

	    return _this;
	  }
	  /**
	   * Get the {@link AuthTokenTypes} values.
	   *
	   * @inheritdoc
	   */


	  _createClass(AuthTokenType, null, [{
	    key: "enumValues",
	    value: function enumValues() {
	      return AuthTokenTypeValues;
	    }
	  }]);

	  return AuthTokenType;
	}(Enum);
	var AuthTokenTypeValues = Object.freeze([new AuthTokenType("ReadNodeData"), new AuthTokenType("User")]);
	/**
	 * The enumeration of supported AuthTokenType values.
	 *
	 * @readonly
	 * @enum {module:domain~AuthTokenType}
	 * @property {module:domain~AuthTokenType} ReadNodeData a read-only token for reading SolarNode data
	 * @property {module:domain~AuthTokenType} User full access as the user that owns the token
	 * @alias module:domain~AuthTokenTypes
	 */

	var AuthTokenTypes = AuthTokenType.enumsValue(AuthTokenTypeValues);

	/**
	 * A named query combining action type.
	 *
	 * @extends module:util~Enum
	 * @alias module:domain~CombiningType
	 */

	var CombiningType = /*#__PURE__*/function (_Enum) {
	  _inherits(CombiningType, _Enum);

	  var _super = _createSuper(CombiningType);

	  /**
	   * Constructor.
	   *
	   * @param {string} name the unique name for this type
	   */
	  function CombiningType(name) {
	    var _this;

	    _classCallCheck(this, CombiningType);

	    _this = _super.call(this, name);

	    if (_this.constructor === CombiningType) {
	      Object.freeze(_assertThisInitialized(_this));
	    }

	    return _this;
	  }
	  /**
	   * Get the {@link module:domain~CombiningTypes} values.
	   *
	   * @override
	   * @inheritdoc
	   */


	  _createClass(CombiningType, null, [{
	    key: "enumValues",
	    value: function enumValues() {
	      return CombiningTypeValues;
	    }
	  }]);

	  return CombiningType;
	}(Enum);
	var CombiningTypeValues = Object.freeze([new CombiningType("Average"), new CombiningType("Sum"), new CombiningType("Difference")]);
	/**
	 * The enumeration of supported CombiningType values.
	 *
	 * @readonly
	 * @enum {module:domain~CombiningType}
	 * @property {module:domain~CombiningType} Average average
	 * @property {module:domain~CombiningType} Difference difference; note the order of mapped IDs is significant
	 * @property {module:domain~CombiningType} Sum sum
	 * @alias module:domain~CombiningTypes
	 */

	var CombiningTypes = CombiningType.enumsValue(CombiningTypeValues);

	/**
	 * A datum auxiliary type.
	 *
	 * @extends module:util~Enum
	 * @alias module:domain~DatumAuxiliaryType
	 */

	var DatumAuxiliaryType = /*#__PURE__*/function (_Enum) {
	  _inherits(DatumAuxiliaryType, _Enum);

	  var _super = _createSuper(DatumAuxiliaryType);

	  /**
	   * Constructor.
	   *
	   * @param {string} name the unique name for this type
	   */
	  function DatumAuxiliaryType(name) {
	    var _this;

	    _classCallCheck(this, DatumAuxiliaryType);

	    _this = _super.call(this, name);

	    if (_this.constructor === DatumAuxiliaryType) {
	      Object.freeze(_assertThisInitialized(_this));
	    }

	    return _this;
	  }
	  /**
	   * Get the {@link module:domain~DatumAuxiliaryTypes} values.
	   *
	   * @override
	   * @inheritdoc
	   */


	  _createClass(DatumAuxiliaryType, null, [{
	    key: "enumValues",
	    value: function enumValues() {
	      return DatumAuxiliaryTypeValues;
	    }
	  }]);

	  return DatumAuxiliaryType;
	}(Enum);
	var DatumAuxiliaryTypeValues = Object.freeze([new DatumAuxiliaryType("Reset")]);
	/**
	 * The enumeration of supported DatumAuxiliaryType values.
	 *
	 * @readonly
	 * @enum {module:domain~DatumAuxiliaryType}
	 * @property {module:domain~DatumAuxiliaryType} Reset reset
	 * @alias module:domain~DatumAuxiliaryTypes
	 */

	var DatumAuxiliaryTypes = DatumAuxiliaryType.enumsValue(DatumAuxiliaryTypeValues);

	/**
	 * A pagination criteria object.
	 * @alias module:domain~Pagination
	 */
	var Pagination = /*#__PURE__*/function () {
	  /**
	   * Construct a pagination object.
	   *
	   * @param {number} max the maximum number of results to return
	   * @param {number} [offset] the 0-based starting offset
	   */
	  function Pagination(max, offset) {
	    _classCallCheck(this, Pagination);

	    this._max = max > 0 ? +max : 0;
	    this._offset = offset > 0 ? +offset : 0;
	  }
	  /**
	   * Get the maximum number of results to return.
	   *
	   * @returns {number} the maximum number of results
	   */


	  _createClass(Pagination, [{
	    key: "max",
	    get: function get() {
	      return this._max;
	    }
	    /**
	     * Get the results starting offset.
	     *
	     * The first available result starts at offset <code>0</code>. Note this is
	     * a raw offset value, not a "page" offset.
	     *
	     * @returns {number} the starting result offset
	     */

	  }, {
	    key: "offset",
	    get: function get() {
	      return this._offset;
	    }
	    /**
	     * Copy constructor with a new <code>offset</code> value.
	     *
	     * @param {number} offset the new offset to use
	     * @return {Pagination} a new instance
	     */

	  }, {
	    key: "withOffset",
	    value: function withOffset(offset) {
	      return new Pagination(this.max, offset);
	    }
	    /**
	     * Get this object as a standard URI encoded (query parameters) string value.
	     *
	     * @return {string} the URI encoded string
	     */

	  }, {
	    key: "toUriEncoding",
	    value: function toUriEncoding() {
	      var result = "";

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
	  }]);

	  return Pagination;
	}();

	/**
	 * A description of a sort applied to a property of a collection.
	 * @alias module:domain~SortDescriptor
	 */
	var SortDescriptor = /*#__PURE__*/function () {
	  /**
	   * Constructor.
	   *
	   * @param {string} key the property to sort on
	   * @param {boolean} [descending] `true` to sort in descending order, `false` for ascending
	   */
	  function SortDescriptor(key, descending) {
	    _classCallCheck(this, SortDescriptor);

	    this._key = key;
	    this._descending = !!descending;
	  }
	  /**
	   * Get the sort property name.
	   *
	   * @returns {string} the sort key
	   */


	  _createClass(SortDescriptor, [{
	    key: "key",
	    get: function get() {
	      return this._key;
	    }
	    /**
	     * Get the sorting direction.
	     *
	     * @returns {boolean} `true` if descending order, `false` for ascending
	     */

	  }, {
	    key: "descending",
	    get: function get() {
	      return this._descending;
	    }
	    /**
	     * Get this object as a standard URI encoded (query parameters) string value.
	     *
	     * If `index` is provided and non-negative, then the query parameters will
	     * be encoded as an array property named `sorts`. Otherwise just
	     * bare `key` and `descending` properties will be used. The
	     * `descending` property is only added if it is `true`.
	     *
	     * @param {number} [index] an optional array property index
	     * @param {string} [propertyName=sorts] an optional array property name, only used if `index` is also provided
	     * @return {string} the URI encoded string
	     */

	  }, {
	    key: "toUriEncoding",
	    value: function toUriEncoding(index, propertyName) {
	      var result,
	          propName = propertyName || "sorts";

	      if (index !== undefined && index >= 0) {
	        result = encodeURIComponent(propName + "[" + index + "].key") + "=";
	      } else {
	        result = "key=";
	      }

	      result += encodeURIComponent(this.key);

	      if (this.descending) {
	        if (index !== undefined && index >= 0) {
	          result += "&" + encodeURIComponent(propName + "[" + index + "].descending") + "=true";
	        } else {
	          result += "&descending=true";
	        }
	      }

	      return result;
	    }
	  }]);

	  return SortDescriptor;
	}();

	/**
	 * A basic map-like object.
	 *
	 * <p>This object includes some utility functions that make it well suited to using
	 * as an API query object. For example, the {@link module:util~PropMap#toUriEncoding}
	 * method provides a way to serialize this object into URL query parameters.</p>
	 *
	 * @alias module:util~PropMap
	 */

	var PropMap = /*#__PURE__*/function () {
	  /**
	   * Constructor.
	   * @param {PropMap|object} props the initial properties; if a `PropMap` instance is provided, the properties
	   *                               of that object will be copied into this one; otherwise the object will be
	   *                               used directly to hold property values
	   */
	  function PropMap(props) {
	    _classCallCheck(this, PropMap);

	    /**
	     * The object that all properties are stored on.
	     * @member {object}
	     */
	    this.props = props instanceof PropMap ? props.properties() : _typeof(props) === "object" ? props : {};
	  }
	  /**
	   * Get, set, or remove a property value.
	   *
	   * @param {string} key the key to get or set the value for
	   * @param {*} [newValue] if defined, the new value to set for the given `key`;
	   *                       if `null` then the `key` property will be removed
	   * @returns {*} if called as a getter, the associated value for the given `key`,
	   *              otherwise this object
	   */


	  _createClass(PropMap, [{
	    key: "prop",
	    value: function prop(key, newValue) {
	      if (arguments.length === 1) {
	        return this.props[key];
	      }

	      if (newValue === null) {
	        delete this.props[key];
	      } else {
	        this.props[key] = newValue;
	      }

	      return this;
	    }
	    /**
	     * Get, set, or remove multiple properties.
	     *
	     * @param {object} [newProps] the new values to set; if any value is `null` that property
	     *                            will be deleted
	     * @returns {object} if called as a getter, all properties of this object copied into a
	     *                   simple object; otherwise this object
	     */

	  }, {
	    key: "properties",
	    value: function properties(newProps) {
	      if (newProps) {
	        for (var _i = 0, _Object$keys = Object.keys(newProps); _i < _Object$keys.length; _i++) {
	          var k = _Object$keys[_i];
	          this.prop(k, newProps[k]);
	        }

	        return this;
	      }

	      return Object.assign({}, this.props);
	    }
	    /**
	     * Get this object as a standard URI encoded (query parameters) string value.
	     *
	     * All enumerable properties of the <code>props</code> property will be added to the
	     * result. If any property value is an array, the values of the array will be joined
	     * by a comma. Any {@link module:util~Enum} values will have their `name` property used.
	     * Any value that has a `toUriEncoding()` function property will have that function
	     * invoked, passing the associated property name as the first argument, and the returned
	     * value will be used.
	     *
	     * @param {string} [propertyName] an optional object property prefix to add to all properties
	     * @param {function} [callbackFn] An optional function that will be called for each property.
	     *                   The function will be passed property name and value arguments, and must
	     *                   return either `null` to skip the property, a 2 or 3-element array with the
	     *                   property name and value to use, and an optional boolean to force array
	     *                   values to use mutliple parameter keys. Any other return value causes the
	     *                   property to be used as- is.
	     * @return {string} the URI encoded string
	     */

	  }, {
	    key: "toUriEncoding",
	    value: function toUriEncoding(propertyName, callbackFn) {
	      var _this = this;

	      var result = "";

	      var _loop = function _loop() {
	        var k = _Object$keys2[_i2];

	        if (result.length > 0) {
	          result += "&";
	        }

	        var v = _this.props[k];
	        var forceMultiKey = false;

	        if (callbackFn) {
	          var kv = callbackFn(k, v);

	          if (kv === null) {
	            return "continue";
	          } else if (Array.isArray(kv) && kv.length > 1) {
	            k = kv[0];
	            v = kv[1];

	            if (kv.length > 2) {
	              forceMultiKey = !!kv[2];
	            }
	          }
	        }

	        if (typeof v.toUriEncoding === "function") {
	          result += v.toUriEncoding(propertyName ? encodeURIComponent(propertyName) + "." + k : k);
	          return "continue";
	        }

	        if (propertyName) {
	          result += encodeURIComponent(propertyName) + ".";
	        }

	        result += encodeURIComponent(k) + "=";

	        if (Array.isArray(v)) {
	          v.forEach(function (e, i) {
	            if (i > 0) {
	              result += forceMultiKey ? "&" + encodeURIComponent(k) + "=" : ",";
	            }

	            if (e instanceof Enum) {
	              e = e.name;
	            }

	            result += encodeURIComponent(e);
	          });
	        } else {
	          if (v instanceof Enum) {
	            v = v.name;
	          }

	          result += encodeURIComponent(v);
	        }
	      };

	      for (var _i2 = 0, _Object$keys2 = Object.keys(this.props); _i2 < _Object$keys2.length; _i2++) {
	        var _ret = _loop();

	        if (_ret === "continue") continue;
	      }

	      return result;
	    }
	    /**
	     * Get this object as a standard URI encoded (query parameters) string value with
	     * sorting and pagination parameters.
	     *
	     * <p>This calls {@link module:util~PropMap#toUriEncoding} first, then encodes
	     * the `sorts` and `pagination` parameters, if provided.
	     *
	     * @param {module:domain~SortDescriptor[]} [sorts] optional sort settings to use
	     * @param {module:domain~Pagination} [pagination] optional pagination settings to use
	     * @param {string} [propertyName] an optional object property prefix to add to all properties
	     * @param {function} [callbackFn] An optional function that will be called for each property.
	     *                   The function will be passed property name and value arguments, and must
	     *                   return either `null` to skip the property, a 2-element array with the property
	     *                   name and value to use, or anything else to use the property as- is.
	     * @return {string} the URI encoded string
	     */

	  }, {
	    key: "toUriEncodingWithSorting",
	    value: function toUriEncodingWithSorting(sorts, pagination, propertyName, callbackFn) {
	      var params = this.toUriEncoding(propertyName, callbackFn);

	      if (Array.isArray(sorts)) {
	        sorts.forEach(function (sort, i) {
	          if (sort instanceof SortDescriptor) {
	            if (params.length > 0) {
	              params += "&";
	            }

	            params += sort.toUriEncoding(i);
	          }
	        });
	      }

	      if (pagination instanceof Pagination) {
	        var paginationParams = pagination.toUriEncoding();

	        if (paginationParams) {
	          if (params.length > 0) {
	            params += "&";
	          }

	          params += paginationParams;
	        }
	      }

	      return params;
	    }
	  }]);

	  return PropMap;
	}();

	var CountryKey = "country";
	var ElevationKey = "elevation";
	var LatitudeKey = "latitude";
	var IdKey = "id";
	var LocalityKey = "locality";
	var LongitudeKey = "longitude";
	var NameKey = "name";
	var PostalCodeKey = "postalCode";
	var RegionKey = "region";
	var StateOrProvinceKey = "stateOrProvince";
	var StreetKey = "street";
	var TimeZoneIdKey = "timeZoneId";
	/**
	 * A geographic location.
	 *
	 * @extends module:util~PropMap
	 * @alias module:domain~Location
	 */

	var Location = /*#__PURE__*/function (_PropMap) {
	  _inherits(Location, _PropMap);

	  var _super = _createSuper(Location);

	  /**
	   * Constructor.
	   *
	   * @param {module:domain~Location|object} loc the location to copy properties from
	   */
	  function Location(loc) {
	    _classCallCheck(this, Location);

	    return _super.call(this, loc);
	  }
	  /**
	   * A SolarNetwork assigned unique identifier.
	   * @type {number}
	   */


	  _createClass(Location, [{
	    key: "id",
	    get: function get() {
	      return this.prop(IdKey);
	    },
	    set: function set(val) {
	      this.prop(IdKey, val);
	    }
	    /**
	     * A generalized name, can be used for "virtual" locations.
	     * @type {string}
	     */

	  }, {
	    key: "name",
	    get: function get() {
	      return this.prop(NameKey);
	    },
	    set: function set(val) {
	      this.prop(NameKey, val);
	    }
	    /**
	     * An ISO 3166-1 alpha-2 character country code.
	     * @type {string}
	     */

	  }, {
	    key: "country",
	    get: function get() {
	      return this.prop(CountryKey);
	    },
	    set: function set(val) {
	      this.prop(CountryKey, val);
	    }
	    /**
	     * A country-specific regional identifier.
	     * @type {string}
	     */

	  }, {
	    key: "region",
	    get: function get() {
	      return this.prop(RegionKey);
	    },
	    set: function set(val) {
	      this.prop(RegionKey, val);
	    }
	    /**
	     * A country-specific state or province identifier.
	     * @type {string}
	     */

	  }, {
	    key: "stateOrProvince",
	    get: function get() {
	      return this.prop(StateOrProvinceKey);
	    },
	    set: function set(val) {
	      this.prop(StateOrProvinceKey, val);
	    }
	    /**
	     * Get the locality (city, town).
	     * @type {string}
	     */

	  }, {
	    key: "locality",
	    get: function get() {
	      return this.prop(LocalityKey);
	    },
	    set: function set(val) {
	      this.prop(LocalityKey, val);
	    }
	    /**
	     * A country-specific postal code.
	     * @type {string}
	     */

	  }, {
	    key: "postalCode",
	    get: function get() {
	      return this.prop(PostalCodeKey);
	    },
	    set: function set(val) {
	      this.prop(PostalCodeKey, val);
	    }
	    /**
	     * The street address.
	     * @type {string}
	     */

	  }, {
	    key: "street",
	    get: function get() {
	      return this.prop(StreetKey);
	    },
	    set: function set(val) {
	      this.prop(StreetKey, val);
	    }
	    /**
	     * The decimal world latitude.
	     * @type {number}
	     */

	  }, {
	    key: "latitude",
	    get: function get() {
	      return this.prop(LatitudeKey);
	    },
	    set: function set(val) {
	      this.prop(LatitudeKey, val);
	    }
	    /**
	     * The decimal world longitude.
	     * @type {number}
	     */

	  }, {
	    key: "longitude",
	    get: function get() {
	      return this.prop(LongitudeKey);
	    },
	    set: function set(val) {
	      this.prop(LongitudeKey, val);
	    }
	    /**
	     * The elevation above sea level, in meters.
	     * @type {number}
	     */

	  }, {
	    key: "elevation",
	    get: function get() {
	      return this.prop(ElevationKey);
	    },
	    set: function set(val) {
	      this.prop(ElevationKey, val);
	    }
	    /**
	     * A time zone ID, for example `Pacific/Auckland`.
	     * @type {string}
	     */

	  }, {
	    key: "timeZoneId",
	    get: function get() {
	      return this.prop(TimeZoneIdKey);
	    },
	    set: function set(val) {
	      this.prop(TimeZoneIdKey, val);
	    }
	  }]);

	  return Location;
	}(PropMap);

	var AggregationKey = "aggregation";
	var CombiningTypeKey = "combiningType";
	var DataPathKey = "dataPath";
	var EndDateKey = "endDate";
	var LocationIdsKey = "locationIds";
	var LocationKey = "location";
	var MetadataFilterKey = "metadataFilter";
	var MostRecentKey = "mostRecent";
	var NodeIdMapsKey = "nodeIdMaps";
	var NodeIdsKey = "nodeIds";
	var PartialAggregationKey = "partialAggregation";
	var QueryKey = "query";
	var SourceIdMapsKey = "sourceIdMaps";
	var SourceIdsKey = "sourceIds";
	var StartDateKey = "startDate";
	var TagsKey = "tags";
	var UserIdsKey = "userIds";
	var WithoutTotalResultsCountKey = "withoutTotalResultsCount";
	/**
	 * Combine an ID map into a query parameter.
	 * @param {Map<*, Set<*>>} map ID mapping
	 * @returns {String[]} the query parameter value, or `null` if no mapping available
	 * @private
	 */

	function idMapQueryParameterValue(map) {
	  if (!(map instanceof Map && map.size > 0)) {
	    return null;
	  }

	  var result = [];

	  var _iterator = _createForOfIteratorHelper(map),
	      _step;

	  try {
	    for (_iterator.s(); !(_step = _iterator.n()).done;) {
	      var e = _step.value;

	      if (!(e[1] instanceof Set)) {
	        continue;
	      }

	      result.push("".concat(e[0], ":").concat(Array.from(e[1]).join(",")));
	    }
	  } catch (err) {
	    _iterator.e(err);
	  } finally {
	    _iterator.f();
	  }

	  return result;
	}
	/**
	 * A filter criteria object for datum.
	 *
	 * <p>This filter is used to query both node datum and location datum. Not all properties are
	 * applicable to both types. Be sure to consult the SolarNet API documentation on the
	 * supported properties for each type.</p>
	 *
	 * @extends module:util~PropMap
	 * @alias module:domain~DatumFilter
	 */


	var DatumFilter = /*#__PURE__*/function (_PropMap) {
	  _inherits(DatumFilter, _PropMap);

	  var _super = _createSuper(DatumFilter);

	  /**
	   * Constructor.
	   * @param {object} [props] initial property values
	   */
	  function DatumFilter(props) {
	    _classCallCheck(this, DatumFilter);

	    return _super.call(this, props);
	  }
	  /**
	   * A node ID.
	   *
	   * This manages the first available node ID from the `nodeIds` property.
	   *
	   * @type {number}
	   */


	  _createClass(DatumFilter, [{
	    key: "nodeId",
	    get: function get() {
	      var nodeIds = this.nodeIds;
	      return Array.isArray(nodeIds) && nodeIds.length > 0 ? nodeIds[0] : null;
	    },
	    set: function set(nodeId) {
	      if (nodeId) {
	        this.nodeIds = [nodeId];
	      } else {
	        this.nodeIds = null;
	      }
	    }
	    /**
	     * An array of node IDs.
	     * @type {number[]}
	     */

	  }, {
	    key: "nodeIds",
	    get: function get() {
	      return this.prop(NodeIdsKey);
	    },
	    set: function set(nodeIds) {
	      this.prop(NodeIdsKey, Array.isArray(nodeIds) ? nodeIds : null);
	    }
	    /**
	     * A location ID.
	     *
	     * This manages the first available location ID from the `locationIds` property.
	     *
	     * @type {number}
	     */

	  }, {
	    key: "locationId",
	    get: function get() {
	      var locationIds = this.locationIds;
	      return Array.isArray(locationIds) && locationIds.length > 0 ? locationIds[0] : null;
	    },
	    set: function set(locationId) {
	      if (locationId) {
	        this.locationIds = [locationId];
	      } else {
	        this.locationIds = null;
	      }
	    }
	    /**
	     * An array of location IDs.
	     * @type {number[]}
	     */

	  }, {
	    key: "locationIds",
	    get: function get() {
	      return this.prop(LocationIdsKey);
	    },
	    set: function set(locationIds) {
	      this.prop(LocationIdsKey, Array.isArray(locationIds) ? locationIds : null);
	    }
	    /**
	     * A source ID.
	     *
	     * This manages the first available source ID from the `sourceIds` property.
	     *
	     * @type {string}
	     */

	  }, {
	    key: "sourceId",
	    get: function get() {
	      var sourceIds = this.sourceIds;
	      return Array.isArray(sourceIds) && sourceIds.length > 0 ? sourceIds[0] : null;
	    },
	    set: function set(sourceId) {
	      if (sourceId) {
	        this.sourceIds = [sourceId];
	      } else {
	        this.sourceIds = null;
	      }
	    }
	    /**
	     * An array of source IDs.
	     * @type {string[]}
	     */

	  }, {
	    key: "sourceIds",
	    get: function get() {
	      return this.prop(SourceIdsKey);
	    },
	    set: function set(sourceIds) {
	      this.prop(SourceIdsKey, Array.isArray(sourceIds) ? sourceIds : null);
	    }
	    /**
	     * A user ID.
	     *
	     * This manages the first available location ID from the `userIds` property.
	     *
	     * @type {number}
	     */

	  }, {
	    key: "userId",
	    get: function get() {
	      var userIds = this.userIds;
	      return Array.isArray(userIds) && userIds.length > 0 ? userIds[0] : null;
	    },
	    set: function set(userId) {
	      if (userId) {
	        this.userIds = [userId];
	      } else {
	        this.userIds = null;
	      }
	    }
	    /**
	     * An array of user IDs.
	     * @type {number[]}
	     */

	  }, {
	    key: "userIds",
	    get: function get() {
	      return this.prop(UserIdsKey);
	    },
	    set: function set(userIds) {
	      this.prop(UserIdsKey, Array.isArray(userIds) ? userIds : null);
	    }
	    /**
	     * The "most recent" flag.
	     * @type {boolean}
	     */

	  }, {
	    key: "mostRecent",
	    get: function get() {
	      return !!this.prop(MostRecentKey);
	    },
	    set: function set(value) {
	      this.prop(MostRecentKey, !!value);
	    }
	    /**
	     * A minimumin date.
	     * @type {Date}
	     */

	  }, {
	    key: "startDate",
	    get: function get() {
	      return this.prop(StartDateKey);
	    },
	    set: function set(date) {
	      this.prop(StartDateKey, date);
	    }
	    /**
	     * A maximum date.
	     * @type {Date}
	     */

	  }, {
	    key: "endDate",
	    get: function get() {
	      return this.prop(EndDateKey);
	    },
	    set: function set(date) {
	      this.prop(EndDateKey, date);
	    }
	    /**
	     * A data path, in dot-delimited notation like `i.watts`.
	     * @type {string}
	     */

	  }, {
	    key: "dataPath",
	    get: function get() {
	      return this.prop(DataPathKey);
	    },
	    set: function set(path) {
	      this.prop(DataPathKey, path);
	    }
	    /**
	     * An aggregation.
	     *
	     * Including this in a filter will cause SolarNet to return aggregated results, rather
	     * than raw results.
	     *
	     * @type {module:domain~Aggregation}
	     */

	  }, {
	    key: "aggregation",
	    get: function get() {
	      return this.prop(AggregationKey);
	    },
	    set: function set(agg) {
	      this.prop(AggregationKey, agg instanceof Aggregation ? agg : null);
	    }
	    /**
	     * A partial aggregation.
	     *
	     * Including this in a filter along with `aggregation`  will cause SolarNet to return aggregated results that
	     * include partial results of this granularity. For example if `aggregation == 'Month'` and
	     * `partialAggregation == 'Day'` and a date range of 15 Jan - 15 Mar was requested, 3 month results would
	     * be returned for the date ranges 15 Jan - 31 Jan, 1 Feb - 28 Feb, and 1 Mar - 14 Mar.
	     *
	     * @type {module:domain~Aggregation}
	     */

	  }, {
	    key: "partialAggregation",
	    get: function get() {
	      return this.prop(PartialAggregationKey);
	    },
	    set: function set(agg) {
	      this.prop(PartialAggregationKey, agg instanceof Aggregation ? agg : null);
	    }
	    /**
	     * An array of tags.
	     * @type {string[]}
	     */

	  }, {
	    key: "tags",
	    get: function get() {
	      return this.prop(TagsKey);
	    },
	    set: function set(val) {
	      this.prop(TagsKey, Array.isArray(val) ? val : null);
	    }
	    /**
	     * A location, used as an example-based search criteria.
	     * @type {module:domain~Location}
	     */

	  }, {
	    key: "location",
	    get: function get() {
	      return this.prop(LocationKey);
	    },
	    set: function set(val) {
	      this.prop(LocationKey, val instanceof Location ? val : null);
	    }
	    /**
	     * A general full-text style query string.
	     * @type {string}
	     */

	  }, {
	    key: "query",
	    get: function get() {
	      return this.prop(QueryKey);
	    },
	    set: function set(val) {
	      this.prop(QueryKey, val);
	    }
	    /**
	     * A metadata filter (LDAP style search criteria).
	     * @type {string}
	     */

	  }, {
	    key: "metadataFilter",
	    get: function get() {
	      return this.prop(MetadataFilterKey);
	    },
	    set: function set(val) {
	      this.prop(MetadataFilterKey, val);
	    }
	    /**
	     * Get the _without total results_ flag.
	     * @type {boolean}
	     */

	  }, {
	    key: "withoutTotalResultsCount",
	    get: function get() {
	      return this.prop(WithoutTotalResultsCountKey);
	    },
	    set: function set(val) {
	      this.prop(WithoutTotalResultsCountKey, !!val);
	    }
	    /**
	     * Get the combining type.
	     *
	     * Use this to combine nodes and/or sources into virtual groups. Requires some combination
	     * of {@link #nodeIdMaps} or {@link #sourceIdMaps} also be specified.
	     *
	     * @type {module:domain~CombiningType}
	     */

	  }, {
	    key: "combiningType",
	    get: function get() {
	      return this.prop(CombiningTypeKey);
	    },
	    set: function set(t) {
	      this.prop(CombiningTypeKey, t instanceof CombiningType ? t : null);
	    }
	    /**
	     * A mapping of virtual node IDs to sets of real node IDs to combine.
	     *
	     * @type {Map<Number, Set<Number>>}
	     */

	  }, {
	    key: "nodeIdMaps",
	    get: function get() {
	      return this.prop(NodeIdMapsKey);
	    },
	    set: function set(map) {
	      this.prop(NodeIdMapsKey, map instanceof Map ? map : null);
	    }
	    /**
	     * A mapping of virtual source IDs to sets of real source IDs to combine.
	     *
	     * @type {Map<String, Set<String>>}
	     */

	  }, {
	    key: "sourceIdMaps",
	    get: function get() {
	      return this.prop(SourceIdMapsKey);
	    },
	    set: function set(map) {
	      this.prop(SourceIdMapsKey, map instanceof Map ? map : null);
	    }
	    /**
	     * Get this object as a standard URI encoded (query parameters) string value.
	     *
	     * @override
	     * @inheritdoc
	     */

	  }, {
	    key: "toUriEncoding",
	    value: function toUriEncoding(propertyName, callbackFn) {
	      return _get(_getPrototypeOf(DatumFilter.prototype), "toUriEncoding", this).call(this, propertyName, callbackFn || datumFilterUriEncodingPropertyMapper);
	    }
	  }]);

	  return DatumFilter;
	}(PropMap);
	/**
	 * Map DatumFilter properties for URI encoding.
	 *
	 * @param {string} key the property key
	 * @param {*} value the property value
	 * @returns {*} 2 or 3-element array for mapped key+value+forced-multi-key, `null` to skip, or `key` to keep as-is
	 * @private
	 */


	function datumFilterUriEncodingPropertyMapper(key, value) {
	  if (key === NodeIdsKey || key === LocationIdsKey || key === SourceIdsKey || key === UserIdsKey) {
	    // check for singleton array value, and re-map to singular property by chopping of "s"
	    if (Array.isArray(value) && value.length === 1) {
	      return [key.substring(0, key.length - 1), value[0]];
	    }
	  } else if (key === StartDateKey || key === EndDateKey) {
	    return [key, dateTimeUrlFormat(value)];
	  } else if (key === MostRecentKey && !value) {
	    return null;
	  } else if (key === NodeIdMapsKey || key === SourceIdMapsKey) {
	    var p = idMapQueryParameterValue(value);
	    return p ? [key, p, true] : null;
	  }

	  return key;
	}

	/**
	 * An enumeration of datum reading types.
	 *
	 * @extends module:util~Enum
	 * @alias module:domain~DatumReadingType
	 */

	var DatumReadingType = /*#__PURE__*/function (_Enum) {
	  _inherits(DatumReadingType, _Enum);

	  var _super = _createSuper(DatumReadingType);

	  /**
	   * Constructor.
	   *
	   * @param {string} name the unique name for this type
	   * @param {string} key the key value associated with this type
	   */
	  function DatumReadingType(name, key) {
	    var _this;

	    _classCallCheck(this, DatumReadingType);

	    _this = _super.call(this, name);
	    _this._key = key;

	    if (_this.constructor === DatumReadingType) {
	      Object.freeze(_assertThisInitialized(_this));
	    }

	    return _this;
	  }
	  /**
	   * Get the key value.
	   *
	   * @returns {string} the key value
	   */


	  _createClass(DatumReadingType, [{
	    key: "key",
	    get: function get() {
	      return this._key;
	    }
	    /**
	     * Get the {@link module:domain~DatumReadingType} values.
	     *
	     * @override
	     * @inheritdoc
	     */

	  }], [{
	    key: "enumValues",
	    value: function enumValues() {
	      return DatumReadingTypeValues;
	    }
	  }]);

	  return DatumReadingType;
	}(Enum);
	var DatumReadingTypeValues = Object.freeze([new DatumReadingType("CalculatedAt", "at"), new DatumReadingType("CalculatedAtDifference", "atd"), new DatumReadingType("NearestDifference", "diff"), new DatumReadingType("Difference", "delta"), new DatumReadingType("DifferenceWithin", "change")]);
	/**
	 * The enumeration of supported `DatumReadingType` values.
	 *
	 * @readonly
	 * @enum {module:domain~DatumReadingType}
	 * @property {module:domain~DatumReadingType} CalculatedAt Derive a single reading value based
	 * from one datum the nearest before a specific time and one the nearest after.
	 * @property {module:domain~DatumReadingType} CalculatedAtDifference Calculate the difference
	 * between two reading values on two dates, using the `CalcualtedAt` style of deriving the start
	 * and end readings.
	 * @property {module:domain~DatumReadingType} Difference Find the difference between two datum
	 * that are nearest in time on or before two dates, without any limits on how near to those dates
	 * the datum are.
	 * @property {module:domain~DatumReadingType} DifferenceWithin Find the difference between two
	 * datum that are nearest in time and within two dates.
	 * @property {module:domain~DatumReadingType} NearestDifference Find the difference between two
	 * datum that are nearest in time on or before two dates, constrained by a maximum time tolerance.
	 * @alias module:domain~DatumReadingTypes
	 */

	var DatumReadingTypes = DatumReadingType.enumsValue(DatumReadingTypeValues);

	/**
	 * An immutable enum-like object with an associated bitmask support.
	 *
	 * This class is essentially abstract, and must be extended by another
	 * class that overrides the inerited {@link module:util~Enum.enumValues} method.
	 *
	 * @abstract
	 * @extends module:util~Enum
	 * @alias module:util~BitmaskEnum
	 */

	var BitmaskEnum = /*#__PURE__*/function (_Enum) {
	  _inherits(BitmaskEnum, _Enum);

	  var _super = _createSuper(BitmaskEnum);

	  /**
	   * Constructor.
	   *
	   * @param {string} name the name
	   * @param {number} bitNumber the bit offset, starting from `1` for the least significant bit
	   */
	  function BitmaskEnum(name, bitNumber) {
	    var _this;

	    _classCallCheck(this, BitmaskEnum);

	    _this = _super.call(this, name);
	    _this._bitNumber = bitNumber;

	    if (_this.constructor === BitmaskEnum) {
	      Object.freeze(_assertThisInitialized(_this));
	    }

	    return _this;
	  }
	  /**
	   * Get the bit offset value, starting from `1` for the least significant bit.
	   *
	   * @returns {number} the value
	   */


	  _createClass(BitmaskEnum, [{
	    key: "bitmaskBitNumber",
	    get: function get() {
	      return this._bitNumber;
	    }
	    /**
	     * Get the bit offset value, starting from `0` for the least significant bit.
	     *
	     * @returns {number} the value
	     */

	  }, {
	    key: "bitmaskBitOffset",
	    get: function get() {
	      return this._bitNumber - 1;
	    }
	    /**
	     * Get a `BitmaskEnum` objects for a bit number.
	     *
	     * @param {number} bitNumber
	     *        a bit number value of the `BitmaskEnum` object to find
	     * @param {Iterable<BitmaskEnum>} values
	     *        the complete set of possible `BitmaskEnum` objects
	     * @return {BitmaskEnum} the matching `BitmaskEnum`, or `null`
	     */

	  }], [{
	    key: "enumForBitNumber",
	    value: function enumForBitNumber(bitNumber, values) {
	      var _iterator = _createForOfIteratorHelper(values),
	          _step;

	      try {
	        for (_iterator.s(); !(_step = _iterator.n()).done;) {
	          var c = _step.value;
	          var n = c.bitmaskBitNumber;

	          if (n == bitNumber) {
	            return c;
	          }
	        }
	      } catch (err) {
	        _iterator.e(err);
	      } finally {
	        _iterator.f();
	      }

	      return null;
	    }
	    /**
	     * Get a bitmask value for a set of {@code Bitmaskable} objects.
	     *
	     * @param {Iterable<BitmaskEnum>} maskables
	     *        the set of `BitmaskEnum` objects
	     * @return {number} a bitmask value of all {@link module:util~BitmaskEnum#bitmaskBitOffset()}
	     *         values of the given `maskables`
	     */

	  }, {
	    key: "bitmaskValue",
	    value: function bitmaskValue(maskables) {
	      var mask = 0;

	      if (maskables != null) {
	        var _iterator2 = _createForOfIteratorHelper(maskables),
	            _step2;

	        try {
	          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
	            var c = _step2.value;

	            if (c.bitmaskBitOffset >= 0) {
	              mask |= 1 << c.bitmaskBitOffset;
	            }
	          }
	        } catch (err) {
	          _iterator2.e(err);
	        } finally {
	          _iterator2.f();
	        }
	      }

	      return mask;
	    }
	    /**
	     * Convert a bitmask value into a set of {@code Bitmaskable} objects.
	     *
	     * @param {number} mask
	     *        a bitmask value of a set of {@code Bitmaskable} objects
	     * @param {BitmaskEnum} clazz
	     *        the class of an enumeration of `BitmaskEnum` objects
	     * @return {Set<BitmaskEnum>} a set of `BitmaskEnum` objects
	     */

	  }, {
	    key: "setForBitmaskEnum",
	    value: function setForBitmaskEnum(mask, clazz) {
	      return BitmaskEnum.setForBitmask(mask, clazz.enumValues());
	    }
	    /**
	     * Convert a bitmask value into a set of `BitmaskEnum` objects.
	     *
	     * @param {number} mask
	     *        a bitmask value of a set of `BitmaskEnum` objects
	     * @param {Iterable<BitmaskEnum>} values
	     *        the complete set of possible `BitmaskEnum` objects
	     * @return {Set<BitmaskEnum>} a set of `BitmaskEnum` objects
	     */

	  }, {
	    key: "setForBitmask",
	    value: function setForBitmask(mask, values) {
	      if (mask < 1) {
	        return new Set();
	      }

	      var set = new Set();

	      var _iterator3 = _createForOfIteratorHelper(values),
	          _step3;

	      try {
	        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
	          var c = _step3.value;
	          var b = c.bitmaskBitOffset;

	          if (b >= 0 && (mask >> b & 1) == 1) {
	            set.add(c);
	          }
	        }
	      } catch (err) {
	        _iterator3.e(err);
	      } finally {
	        _iterator3.f();
	      }

	      return set;
	    }
	  }]);

	  return BitmaskEnum;
	}(Enum);

	/**
	 * An enumeration of standardized device operating states.
	 *
	 * @extends module:util~Enum
	 * @alias module:domain~DeviceOperatingState
	 */

	var DeviceOperatingState = /*#__PURE__*/function (_BitmaskEnum) {
	  _inherits(DeviceOperatingState, _BitmaskEnum);

	  var _super = _createSuper(DeviceOperatingState);

	  /**
	   * Constructor.
	   *
	   * @param {string} name the name
	   * @param {number} bitNumber the bit offset, starting from `1` for the least significant bit
	   */
	  function DeviceOperatingState(name, bitNumber) {
	    var _this;

	    _classCallCheck(this, DeviceOperatingState);

	    _this = _super.call(this, name, bitNumber);

	    if (_this.constructor === DeviceOperatingState) {
	      Object.freeze(_assertThisInitialized(_this));
	    }

	    return _this;
	  }
	  /**
	   * Get the state code value.
	   *
	   * @returns {number} the code
	   */


	  _createClass(DeviceOperatingState, [{
	    key: "code",
	    get: function get() {
	      return this.bitmaskBitNumber;
	    }
	    /**
	     * Get an enum for a code value.
	     *
	     * @param {number} code the code to look for
	     * @returns {DeviceOperatingState} the state, or `null` if not found
	     */

	  }], [{
	    key: "forCode",
	    value: function forCode(code) {
	      return BitmaskEnum.enumForBitNumber(code, DeviceOperatingStateValues);
	    }
	    /**
	     * Get the {@link module:domain~DeviceOperatingStates} values.
	     *
	     * @inheritdoc
	     */

	  }, {
	    key: "enumValues",
	    value: function enumValues() {
	      return DeviceOperatingStateValues;
	    }
	  }]);

	  return DeviceOperatingState;
	}(BitmaskEnum);

	var DeviceOperatingStateValues = Object.freeze([new DeviceOperatingState("Unknown", 0), new DeviceOperatingState("Normal", 1), new DeviceOperatingState("Starting", 2), new DeviceOperatingState("Standby", 3), new DeviceOperatingState("Shutdown", 4), new DeviceOperatingState("Fault", 5), new DeviceOperatingState("Disabled", 6), new DeviceOperatingState("Recovery", 7), new DeviceOperatingState("Override", 8)]);
	/**
	 * The enumeration of supported DeviceOperatingState values.
	 *
	 * @readonly
	 * @enum {module:domain~DeviceOperatingState}
	 * @property {module:domain~DeviceOperatingState} Unknown an unknown state
	 * @property {module:domain~DeviceOperatingState} Normal normal operating state
	 * @property {module:domain~DeviceOperatingState} Starting a startup/initializing state
	 * @property {module:domain~DeviceOperatingState} Standby a standby/low power mode
	 * @property {module:domain~DeviceOperatingState} Shutdown a shutdown/off state
	 * @property {module:domain~DeviceOperatingState} Fault a faulty or error condition
	 * @property {module:domain~DeviceOperatingState} Disabled a disabled state
	 * @property {module:domain~DeviceOperatingState} Recovery a recovery state
	 * @property {module:domain~DeviceOperatingState} Override a manual or overridden state
	 * @alias module:domain~DeviceOperatingStates
	 */

	var DeviceOperatingStates = DeviceOperatingState.enumsValue(DeviceOperatingStateValues);

	/**
	 * General metadata with a basic structure.
	 *
	 * This metadata can be associated with a variety of objects within SolarNetwork, such
	 * as users, nodes, and datum.
	 *
	 * @alias module:domain~GeneralMetadata
	 */
	var GeneralMetadata = /*#__PURE__*/function () {
	  /**
	   * Constructor.
	   *
	   * @param {Map<string, *>} [info] the general metadata map
	   * @param {Map<string, Map<string, *>>} [propertyInfo] the property metadata map
	   * @param {Set<string>} [tags] the tags
	   */
	  function GeneralMetadata(info, propertyInfo, tags) {
	    _classCallCheck(this, GeneralMetadata);

	    this.info = info || null;
	    this.propertyInfo = propertyInfo || null;
	    this.tags = tags instanceof Set ? tags : Array.isArray(tags) ? new Set(tags) : null;
	  }
	  /**
	   * Get this object as a standard JSON encoded string value.
	   *
	   * @return {string} the JSON encoded string
	   */


	  _createClass(GeneralMetadata, [{
	    key: "toJsonEncoding",
	    value: function toJsonEncoding() {
	      var result = {};
	      var info = this.info;

	      if (info) {
	        result["m"] = stringMapToObject(info);
	      }

	      var propertyInfo = this.propertyInfo;

	      if (propertyInfo) {
	        result["pm"] = stringMapToObject(propertyInfo);
	      }

	      var tags = this.tags;

	      if (tags) {
	        result["t"] = Array.from(tags);
	      }

	      return JSON.stringify(result);
	    }
	    /**
	     * Parse a JSON string into a {@link module:domain~GeneralMetadata} instance.
	     *
	     * The JSON must be encoded the same way {@link module:domain~GeneralMetadata#toJsonEncoding} does.
	     *
	     * @param {string} json the JSON to parse
	     * @returns {module:domain~GeneralMetadata} the metadata instance
	     */

	  }], [{
	    key: "fromJsonEncoding",
	    value: function fromJsonEncoding(json) {
	      var m, pm, t;

	      if (json) {
	        var obj = JSON.parse(json);
	        m = obj["m"] ? objectToStringMap(obj["m"]) : null;
	        pm = obj["pm"] ? objectToStringMap(obj["pm"]) : null;
	        t = Array.isArray(obj["t"]) ? new Set(obj["t"]) : null;
	      }

	      return new GeneralMetadata(m, pm, t);
	    }
	  }]);

	  return GeneralMetadata;
	}();
	/**
	 * Convert a `Map` into a simple object.
	 *
	 * The keys are assumed to be strings. Values that are themselves `Map` instances
	 * will be converted to simple objects as well.
	 *
	 * @param {Map<string, *>} strMap a Map with string keys; nested Map objects are also handled
	 * @returns {object} a simple object
	 * @see {@link objectToStringMap} for the reverse conversion
	 * @alias module:domain~stringMapToObject
	 */


	function stringMapToObject(strMap) {
	  var obj = Object.create(null);

	  if (strMap) {
	    var _iterator = _createForOfIteratorHelper(strMap),
	        _step;

	    try {
	      for (_iterator.s(); !(_step = _iterator.n()).done;) {
	        var _step$value = _slicedToArray(_step.value, 2),
	            k = _step$value[0],
	            v = _step$value[1];

	        obj[k] = v instanceof Map ? stringMapToObject(v) : v;
	      }
	    } catch (err) {
	      _iterator.e(err);
	    } finally {
	      _iterator.f();
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
	 * @param {object} obj a simple object
	 * @returns {Map<string, *>} a Map with string keys; nested Map objects are also handled
	 * @see {@link module:domain~stringMapToObject} for the reverse conversion
	 * @alias module:domain~objectToStringMap
	 */


	function objectToStringMap(obj) {
	  var strMap = new Map();

	  if (obj) {
	    for (var _i = 0, _Object$keys = Object.keys(obj); _i < _Object$keys.length; _i++) {
	      var k = _Object$keys[_i];
	      var v = obj[k];
	      strMap.set(k, _typeof(v) === "object" ? objectToStringMap(v) : v);
	    }
	  }

	  return strMap;
	}

	/**
	 * A named instruction state.
	 *
	 * @extends module:util~Enum
	 * @alias module:domain~InstructionState
	 */

	var InstructionState = /*#__PURE__*/function (_Enum) {
	  _inherits(InstructionState, _Enum);

	  var _super = _createSuper(InstructionState);

	  /**
	   * Constructor.
	   *
	   * @param {string} name the name
	   */
	  function InstructionState(name) {
	    var _this;

	    _classCallCheck(this, InstructionState);

	    _this = _super.call(this, name);

	    if (_this.constructor === InstructionState) {
	      Object.freeze(_assertThisInitialized(_this));
	    }

	    return _this;
	  }
	  /**
	   * Get the {@link module:domain~InstructionStates} values.
	   *
	   * @inheritdoc
	   */


	  _createClass(InstructionState, null, [{
	    key: "enumValues",
	    value: function enumValues() {
	      return InstructionStateValues;
	    }
	  }]);

	  return InstructionState;
	}(Enum);

	var InstructionStateValues = Object.freeze([new InstructionState("Unknown"), new InstructionState("Queued"), new InstructionState("Received"), new InstructionState("Executing"), new InstructionState("Declined"), new InstructionState("Completed")]);
	/**
	 * The enumeration of supported InstructionState values.
	 *
	 * @readonly
	 * @enum {module:domain~InstructionState}
	 * @property {module:domain~InstructionState} Unknown an unknown state
	 * @property {module:domain~InstructionState} Queued the instruction has been received by SolarNet but not yet delivered to its destination
	 * @property {module:domain~InstructionState} Received the instruction has been delivered to its destination but not yet acted upon
	 * @property {module:domain~InstructionState} Executed the instruction is currently being acted upon
	 * @property {module:domain~InstructionState} Declined the destination has declined to execute the instruction, or the execution failed
	 * @property {module:domain~InstructionState} Completed the destination has executed successfully
	 * @alias module:domain~InstructionStates
	 */

	var InstructionStates = InstructionState.enumsValue(InstructionStateValues);

	/**
	 * A location precision object for use with defining named geographic precision.
	 *
	 * @extends module:util~ComparableEnum
	 * @alias module:domain~LocationPrecision
	 */

	var LocationPrecision = /*#__PURE__*/function (_ComparableEnum) {
	  _inherits(LocationPrecision, _ComparableEnum);

	  var _super = _createSuper(LocationPrecision);

	  /**
	   * Constructor.
	   *
	   * @param {string} name the unique name for this precision
	   * @param {number} precision a relative precision value for this precision
	   */
	  function LocationPrecision(name, precision) {
	    var _this;

	    _classCallCheck(this, LocationPrecision);

	    _this = _super.call(this, name, precision);

	    if (_this.constructor === LocationPrecision) {
	      Object.freeze(_assertThisInitialized(_this));
	    }

	    return _this;
	  }
	  /**
	   * Get the relative precision value.
	   *
	   * This is an alias for {@link #name}.
	   *
	   * @returns {number} the precision
	   */


	  _createClass(LocationPrecision, [{
	    key: "precision",
	    get: function get() {
	      return this.value;
	    }
	    /**
	     * Get the {@link module:domain~LocationPrecisions} values.
	     *
	     * @override
	     * @inheritdoc
	     */

	  }], [{
	    key: "enumValues",
	    value: function enumValues() {
	      return LocationPrecisionValues;
	    }
	  }]);

	  return LocationPrecision;
	}(ComparableEnum);

	var LocationPrecisionValues = Object.freeze([new LocationPrecision("LatLong", 1), new LocationPrecision("Block", 5), new LocationPrecision("Street", 10), new LocationPrecision("PostalCode", 20), new LocationPrecision("Locality", 30), new LocationPrecision("StateOrProvince", 40), new LocationPrecision("Region", 50), new LocationPrecision("TimeZone", 60), new LocationPrecision("Country", 70)]);
	/**
	 * The enumeration of supported LocationPrecision values.
	 *
	 * @readonly
	 * @enum {module:domain~LocationPrecision}
	 * @property {module:domain~LocationPrecision} LatLong GPS coordinates
	 * @property {module:domain~LocationPrecision} Block a city block
	 * @property {module:domain~LocationPrecision} Street a street
	 * @property {module:domain~LocationPrecision} PostalCode a postal code (or "zip code")
	 * @property {module:domain~LocationPrecision} Locality a town or city
	 * @property {module:domain~LocationPrecision} StateOrProvince a state or province
	 * @property {module:domain~LocationPrecision} Region a large region
	 * @property {module:domain~LocationPrecision} TimeZone a time zone
	 * @property {module:domain~LocationPrecision} Country a country
	 * @alias module:domain~LocationPrecisions
	 */

	var LocationPrecisions = LocationPrecision.enumsValue(LocationPrecisionValues);

	/**
	 * Get a Set from a Set or array or object, returning `null` if the set would be empty.
	 *
	 * @param {Object[]|Set<*>} obj the array, Set, or singleton object to get as a Set
	 * @returns {Set<*>} the Set, or `null`
	 * @private
	 */

	function setOrNull(obj) {
	  var result = null;

	  if (obj instanceof Set) {
	    result = obj.size > 0 ? obj : null;
	  } else if (Array.isArray(obj)) {
	    result = obj.length > 0 ? new Set(obj) : null;
	  } else if (obj) {
	    result = new Set([obj]);
	  }

	  return result;
	}
	/**
	 * Merge two sets.
	 *
	 * @param {Object[]|Set<*>} [set1] the first set
	 * @param {Object[]|Set<*>} [set2] the second set
	 * @returns {Set<*>} the merged Set, or `null` if neither arguments are sets or
	 *                   neither argument have any values
	 * @private
	 */


	function mergedSets(set1, set2) {
	  var s1 = setOrNull(set1);
	  var s2 = setOrNull(set2);

	  if (s1 === null && s2 === null) {
	    return null;
	  } else if (s2 === null) {
	    return s1;
	  } else if (s1 === null) {
	    return s2;
	  } else {
	    var _iterator = _createForOfIteratorHelper(s2.values()),
	        _step;

	    try {
	      for (_iterator.s(); !(_step = _iterator.n()).done;) {
	        var v = _step.value;
	        s1.add(v);
	      }
	    } catch (err) {
	      _iterator.e(err);
	    } finally {
	      _iterator.f();
	    }

	    return s1;
	  }
	}
	/**
	 * An immutable set of security restrictions that can be attached to other objects, like auth tokens.
	 *
	 * Use the {@link module:domain~SecurityPolicyBuilder} to create instances of this class with a fluent API.
	 * @alias module:domain~SecurityPolicy
	 */


	var SecurityPolicy = /*#__PURE__*/function () {
	  /**
	   * Constructor.
	   *
	   * @param {number[]|Set<number>} [nodeIds] the node IDs to restrict to, or `null` for no restriction
	   * @param {string[]|Set<string>} [sourceIds] the source ID to restrict to, or `null` for no restriction
	   * @param {module:domain~Aggregation[]|Set<module:domain~Aggregation>} [aggregations] the aggregation names to restrict to, or `null` for no restriction
	   * @param {module:domain~Aggregation} [minAggregation] if specified, a minimum aggregation level that is allowed
	   * @param {Set<module:domain~LocationPrecision>} [locationPrecisions] the location precision names to restrict to, or `null` for no restriction
	   * @param {module:domain~LocationPrecision} [minLocationPrecision] if specified, a minimum location precision that is allowed
	   * @param {Set<string>} [nodeMetadataPaths] the `SolarNodeMetadata` paths to restrict to, or `null` for no restriction
	   * @param {Set<string>} [userMetadataPaths] the `UserNodeMetadata` paths to restrict to, or `null` for no restriction
	   */
	  function SecurityPolicy(nodeIds, sourceIds, aggregations, minAggregation, locationPrecisions, minLocationPrecision, nodeMetadataPaths, userMetadataPaths) {
	    _classCallCheck(this, SecurityPolicy);

	    this._nodeIds = setOrNull(nodeIds);
	    this._sourceIds = setOrNull(sourceIds);
	    this._aggregations = setOrNull(aggregations);
	    this._minAggregation = minAggregation instanceof Aggregation ? minAggregation : null;
	    this._locationPrecisions = setOrNull(locationPrecisions);
	    this._minLocationPrecision = minLocationPrecision instanceof LocationPrecision ? minLocationPrecision : null;
	    this._nodeMetadataPaths = setOrNull(nodeMetadataPaths);
	    this._userMetadataPaths = setOrNull(userMetadataPaths);

	    if (this.constructor === SecurityPolicy) {
	      Object.freeze(this);
	    }
	  }
	  /**
	   * Get the node IDs.
	   *
	   * @returns {Set<number>} the node IDs, or `null`
	   */


	  _createClass(SecurityPolicy, [{
	    key: "nodeIds",
	    get: function get() {
	      return this._nodeIds;
	    }
	    /**
	     * Get the source IDs.
	     *
	     * @returns {Set<string>} the source IDs, or `null`
	     */

	  }, {
	    key: "sourceIds",
	    get: function get() {
	      return this._sourceIds;
	    }
	    /**
	     * Get the aggregations.
	     *
	     * @returns {Set<module:domain~Aggregation>} the aggregations, or `null`
	     */

	  }, {
	    key: "aggregations",
	    get: function get() {
	      return this._aggregations;
	    }
	    /**
	     * Get the location precisions.
	     *
	     * @returns {Set<module:domain~LocationPrecision>} the precisions, or `null`
	     */

	  }, {
	    key: "locationPrecisions",
	    get: function get() {
	      return this._locationPrecisions;
	    }
	    /**
	     * Get the minimum aggregation.
	     *
	     * @returns {module:domain~Aggregation} the minimum aggregation, or `null`
	     */

	  }, {
	    key: "minAggregation",
	    get: function get() {
	      return this._minAggregation;
	    }
	    /**
	     * Get the minimum location precision.
	     *
	     * @returns {module:domain~LocationPrecision} the minimum precision, or `null`
	     */

	  }, {
	    key: "minLocationPrecision",
	    get: function get() {
	      return this._minLocationPrecision;
	    }
	    /**
	     * Get the node metadata paths.
	     *
	     * @returns {Set<string>} the node metadata paths, or `null`
	     */

	  }, {
	    key: "nodeMetadataPaths",
	    get: function get() {
	      return this._nodeMetadataPaths;
	    }
	    /**
	     * Get the user metadata paths.
	     *
	     * @returns {Set<string>} the user metadata paths, or `null`
	     */

	  }, {
	    key: "userMetadataPaths",
	    get: function get() {
	      return this._userMetadataPaths;
	    }
	    /**
	     * Get this object as a standard JSON encoded string value.
	     *
	     * @return {string} the JSON encoded string
	     */

	  }, {
	    key: "toJsonEncoding",
	    value: function toJsonEncoding() {
	      var result = {};
	      var val = this.nodeIds;

	      if (val) {
	        result.nodeIds = Array.from(val);
	      }

	      val = this.sourceIds;

	      if (val) {
	        result.sourceIds = Array.from(val);
	      }

	      val = this.aggregations;

	      if (val) {
	        result.aggregations = Array.from(val).map(function (e) {
	          return e.name;
	        });
	      }

	      val = this.locationPrecisions;

	      if (val) {
	        result.locationPrecisions = Array.from(val).map(function (e) {
	          return e.name;
	        });
	      }

	      val = this.minAggregation;

	      if (val) {
	        if (result.length > 0) {
	          result += "&";
	        }

	        result.minAggregation = val.name;
	      }

	      val = this.minLocationPrecision;

	      if (val) {
	        result.minLocationPrecision = val.name;
	      }

	      val = this.nodeMetadataPaths;

	      if (val) {
	        result.nodeMetadataPaths = Array.from(val);
	      }

	      val = this.userMetadataPaths;

	      if (val) {
	        result.userMetadataPaths = Array.from(val);
	      }

	      return JSON.stringify(result);
	    }
	  }]);

	  return SecurityPolicy;
	}();

	var MIN_AGGREGATION_CACHE = new Map(); // Map<string, Set<Aggregation>>

	var MIN_LOCATION_PRECISION_CACHE = new Map(); // Map<string, Set<LocationPrecision>>

	/**
	 * A mutable builder object for {@link module:domain~SecurityPolicy} instances.
	 * @alias module:domain~SecurityPolicyBuilder
	 */

	var SecurityPolicyBuilder = /*#__PURE__*/function () {
	  function SecurityPolicyBuilder() {
	    _classCallCheck(this, SecurityPolicyBuilder);
	  }

	  _createClass(SecurityPolicyBuilder, [{
	    key: "withPolicy",
	    value:
	    /**
	     * Apply all properties from another SecurityPolicy.
	     *
	     * @param {module:domain~SecurityPolicy} policy the SecurityPolicy to apply
	     * @returns {module:domain~SecurityPolicyBuilder} this object
	     */
	    function withPolicy(policy) {
	      if (policy) {
	        this.withAggregations(policy.aggregations).withMinAggregation(policy.minAggregation).withLocationPrecisions(policy.locationPrecisions).withMinLocationPrecision(policy.minLocationPrecision).withNodeIds(policy.nodeIds).withSourceIds(policy.sourceIds).withNodeMetadataPaths(policy.nodeMetadataPaths).withUserMetadataPaths(policy.userMetadataPaths);
	      }

	      return this;
	    }
	    /**
	     * Merge all properties from another SecurityPolicy.
	     *
	     * @param {module:domain~SecurityPolicy} policy the SecurityPolicy to merge
	     * @returns {module:domain~SecurityPolicyBuilder} this object
	     */

	  }, {
	    key: "addPolicy",
	    value: function addPolicy(policy) {
	      if (policy) {
	        this.addAggregations(policy.aggregations).addLocationPrecisions(policy.locationPrecisions).addNodeIds(policy.nodeIds).addSourceIds(policy.sourceIds).addNodeMetadataPaths(policy.nodeMetadataPaths).addUserMetadataPaths(policy.userMetadataPaths);

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
	     * @param {number[]|Set<number>} nodeIds the node IDs to use
	     * @returns {module:domain~SecurityPolicyBuilder} this object
	     */

	  }, {
	    key: "withNodeIds",
	    value: function withNodeIds(nodeIds) {
	      this.nodeIds = setOrNull(nodeIds);
	      return this;
	    }
	    /**
	     * Add a set of node IDs.
	     *
	     * @param {number[]|Set<number>} nodeIds the node IDs to add
	     * @returns {module:domain~SecurityPolicyBuilder} this object
	     */

	  }, {
	    key: "addNodeIds",
	    value: function addNodeIds(nodeIds) {
	      return this.withNodeIds(mergedSets(this.nodeIds, nodeIds));
	    }
	    /**
	     * Set the node metadata paths.
	     *
	     * @param {string[]|Set<string>} nodeMetadataPaths the path expressions to use
	     * @returns {module:domain~SecurityPolicyBuilder} this object
	     */

	  }, {
	    key: "withNodeMetadataPaths",
	    value: function withNodeMetadataPaths(nodeMetadataPaths) {
	      this.nodeMetadataPaths = setOrNull(nodeMetadataPaths);
	      return this;
	    }
	    /**
	     * Add a set of node metadata paths.
	     *
	     * @param {string[]|Set<string>} nodeMetadataPaths the path expressions to add
	     * @returns {module:domain~SecurityPolicyBuilder} this object
	     */

	  }, {
	    key: "addNodeMetadataPaths",
	    value: function addNodeMetadataPaths(nodeMetadataPaths) {
	      return this.withNodeMetadataPaths(mergedSets(this.nodeMetadataPaths, nodeMetadataPaths));
	    }
	    /**
	     * Set the user metadata paths.
	     *
	     * @param {string[]|Set<string>} userMetadataPaths the path expressions to use
	     * @returns {module:domain~SecurityPolicyBuilder} this object
	     */

	  }, {
	    key: "withUserMetadataPaths",
	    value: function withUserMetadataPaths(userMetadataPaths) {
	      this.userMetadataPaths = setOrNull(userMetadataPaths);
	      return this;
	    }
	    /**
	     * Add a set of user metadata paths.
	     *
	     * @param {string[]|Set<string>} userMetadataPaths the path expressions to add
	     * @returns {module:domain~SecurityPolicyBuilder} this object
	     */

	  }, {
	    key: "addUserMetadataPaths",
	    value: function addUserMetadataPaths(userMetadataPaths) {
	      return this.withUserMetadataPaths(mergedSets(this.userMetadataPaths, userMetadataPaths));
	    }
	    /**
	     * Set the source IDs.
	     *
	     * @param {string[]|Set<string>} sourceIds the source IDs to use
	     * @returns {module:domain~SecurityPolicyBuilder} this object
	     */

	  }, {
	    key: "withSourceIds",
	    value: function withSourceIds(sourceIds) {
	      this.sourceIds = setOrNull(sourceIds);
	      return this;
	    }
	    /**
	     * Add source IDs.
	     *
	     * @param {string[]|Set<string>} sourceIds the source IDs to add
	     * @returns {module:domain~SecurityPolicyBuilder} this object
	     */

	  }, {
	    key: "addSourceIds",
	    value: function addSourceIds(sourceIds) {
	      return this.withSourceIds(mergedSets(this.sourceIds, sourceIds));
	    }
	    /**
	     * Set the aggregations.
	     *
	     * @param {module:domain~Aggregation[]|Set<module:domain~Aggregation>} aggregations the aggregations to use
	     * @returns {module:domain~SecurityPolicyBuilder} this object
	     */

	  }, {
	    key: "withAggregations",
	    value: function withAggregations(aggregations) {
	      this.aggregations = setOrNull(aggregations);
	      return this;
	    }
	    /**
	     * Set the aggregations.
	     *
	     * @param {module:domain~Aggregation[]|Set<module:domain~Aggregation>} aggregations the aggregations to add
	     * @returns {module:domain~SecurityPolicyBuilder} this object
	     */

	  }, {
	    key: "addAggregations",
	    value: function addAggregations(aggregations) {
	      return this.withAggregations(mergedSets(this.aggregations, aggregations));
	    }
	    /**
	     * Set the location precisions.
	     *
	     * @param {module:domain~LocationPrecision[]|Set<module:domain~LocationPrecision>} locationPrecisions the precisions to use
	     * @returns {module:domain~SecurityPolicyBuilder} this object
	     */

	  }, {
	    key: "withLocationPrecisions",
	    value: function withLocationPrecisions(locationPrecisions) {
	      this.locationPrecisions = setOrNull(locationPrecisions);
	      return this;
	    }
	    /**
	     * Add location precisions.
	     *
	     * @param {module:domain~LocationPrecision[]|Set<module:domain~LocationPrecision>} locationPrecisions the precisions to add
	     * @returns {module:domain~SecurityPolicyBuilder} this object
	     */

	  }, {
	    key: "addLocationPrecisions",
	    value: function addLocationPrecisions(locationPrecisions) {
	      return this.withLocationPrecisions(mergedSets(this.locationPrecisions, locationPrecisions));
	    }
	    /**
	     * Set a minimum aggregation level.
	     *
	     * @param {module:domain~Aggregation} minAggregation the minimum aggregation level to set
	     * @returns {module:domain~SecurityPolicyBuilder} this object
	     */

	  }, {
	    key: "withMinAggregation",
	    value: function withMinAggregation(minAggregation) {
	      this.minAggregation = minAggregation;
	      return this;
	    }
	    /**
	     * Build the effective aggregation level set from the policy settings.
	     *
	     * This computes a set of aggregation levels based on the configured `minAggregation`
	     * and `aggregations` values.
	     *
	     * @returns {Set<module:domain~Aggregation>} the aggregation set
	     * @private
	     */

	  }, {
	    key: "buildAggregations",
	    value: function buildAggregations() {
	      var minAggregation = this.minAggregation;
	      var aggregations = this.aggregations;

	      if (!minAggregation && aggregations && aggregations.size > 0) {
	        return aggregations;
	      } else if (!minAggregation) {
	        return null;
	      }

	      return Aggregation.minimumEnumSet(minAggregation, MIN_AGGREGATION_CACHE);
	    }
	    /**
	     * Treat the configured `locationPrecisions` set as a single
	     * minimum value or a list of exact values.
	     *
	     * By default if `locationPrecisions` is configured with a single
	     * value it will be treated as a <em>minimum</em> value, and any
	     * {@link module:domain~LocationPrecision} with a {@link module:domain~LocationPrecision#precision} equal
	     * to or higher than that value's level will be included in the generated
	     * {@link module:domain~SecurityPolicy#locationPrecisions} set. Set this to
	     * `null` to disable that behavior and treat
	     * `locationPrecisions` as the exact values to include in the
	     * generated {@link module:domain~SecurityPolicy#locationPrecisions} set.
	     *
	     * @param {module:domain~LocationPrecision|null} minLocationPrecision
	     *        `null` to treat configured location precision values
	     *        as-is, or else the minimum threshold
	     * @returns {module:domain~SecurityPolicyBuilder} this object
	     */

	  }, {
	    key: "withMinLocationPrecision",
	    value: function withMinLocationPrecision(minLocationPrecision) {
	      this.minLocationPrecision = minLocationPrecision;
	      return this;
	    }
	    /**
	     * Build the effective aggregation level set from the policy settings.
	     *
	     * This computes a set of location precision levels based on the configured `minLocationPrecision`
	     * and `locationPrecisions` values.
	     *
	     * @returns {Set<module:domain~LocationPrecision>} the precision set
	     * @private
	     */

	  }, {
	    key: "buildLocationPrecisions",
	    value: function buildLocationPrecisions() {
	      var minLocationPrecision = this.minLocationPrecision;
	      var locationPrecisions = this.locationPrecisions;

	      if (!minLocationPrecision && locationPrecisions && locationPrecisions.size > 0) {
	        return locationPrecisions;
	      } else if (!minLocationPrecision) {
	        return null;
	      }

	      return LocationPrecision.minimumEnumSet(minLocationPrecision, MIN_LOCATION_PRECISION_CACHE);
	    }
	    /**
	     * Create a new {@link SecurityPolicy} out of the properties configured on this builder.
	     *
	     * @returns {module:domain~SecurityPolicy} the new policy instance
	     */

	  }, {
	    key: "build",
	    value: function build() {
	      return new SecurityPolicy(this.nodeIds, this.sourceIds, this.buildAggregations(), this.minAggregation, this.buildLocationPrecisions(), this.minLocationPrecision, this.nodeMetadataPaths, this.userMetadataPaths);
	    }
	  }]);

	  return SecurityPolicyBuilder;
	}();

	/**
	 * A named sky condition/observation.
	 *
	 * @extends module:util~BitmaskEnum
	 * @alias module:domain~SkyCondition
	 */

	var SkyCondition = /*#__PURE__*/function (_BitmaskEnum) {
	  _inherits(SkyCondition, _BitmaskEnum);

	  var _super = _createSuper(SkyCondition);

	  /**
	   * Constructor.
	   *
	   * @param {string} name the name
	   * @param {number} bitNumber the bit offset, starting from `1` for the least significant bit
	   */
	  function SkyCondition(name, bitNumber) {
	    var _this;

	    _classCallCheck(this, SkyCondition);

	    _this = _super.call(this, name, bitNumber);

	    if (_this.constructor === SkyCondition) {
	      Object.freeze(_assertThisInitialized(_this));
	    }

	    return _this;
	  }
	  /**
	   * Get the state code value.
	   *
	   * @returns {number} the code
	   */


	  _createClass(SkyCondition, [{
	    key: "code",
	    get: function get() {
	      return this.bitmaskBitNumber;
	    }
	    /**
	     * Get an enum for a code value.
	     *
	     * @param {number} code the code to look for
	     * @returns {DeviceOperatingState} the state, or `null` if not found
	     */

	  }], [{
	    key: "forCode",
	    value: function forCode(code) {
	      return BitmaskEnum.enumForBitNumber(code, SkyConditionValues);
	    }
	    /**
	     * Get the {@link module:domain~SkyConditions} values.
	     *
	     * @inheritdoc
	     */

	  }, {
	    key: "enumValues",
	    value: function enumValues() {
	      return SkyConditionValues;
	    }
	  }]);

	  return SkyCondition;
	}(BitmaskEnum);

	var SkyConditionValues = Object.freeze([new SkyCondition("Clear", 1), new SkyCondition("ScatteredClouds", 2), new SkyCondition("Cloudy", 3), new SkyCondition("Fog", 4), new SkyCondition("Drizzle", 5), new SkyCondition("ScatteredShowers", 6), new SkyCondition("Showers", 7), new SkyCondition("Rain", 8), new SkyCondition("Hail", 9), new SkyCondition("ScatteredSnow", 10), new SkyCondition("Snow", 11), new SkyCondition("Storm", 12), new SkyCondition("SevereStorm", 13), new SkyCondition("Thunder", 14), new SkyCondition("Windy", 15), new SkyCondition("Hazy", 16), new SkyCondition("Tornado", 17), new SkyCondition("Hurricane", 18), new SkyCondition("Dusty", 19)]);
	/**
	 * The enumeration of supported SkyCondition values.
	 *
	 * @readonly
	 * @enum {module:domain~SkyCondition}
	 * @property {module:domain~SkyCondition} Clear clear sky
	 * @property {module:domain~SkyCondition} ScatteredClouds scattered/few clouds
	 * @property {module:domain~SkyCondition} Fog fog
	 * @property {module:domain~SkyCondition} Drizzle drizzle, light rain
	 * @property {module:domain~SkyCondition} ScatteredShowers scattered/few showers
	 * @property {module:domain~SkyCondition} Showers showers, light rain
	 * @property {module:domain~SkyCondition} Rain rain
	 * @property {module:domain~SkyCondition} Hail hail
	 * @property {module:domain~SkyCondition} ScatteredSnow scattered/light snow
	 * @property {module:domain~SkyCondition} Snow snow
	 * @property {module:domain~SkyCondition} Storm storm
	 * @property {module:domain~SkyCondition} SevereStorm severe storm
	 * @property {module:domain~SkyCondition} Thunder thunder, lightning
	 * @property {module:domain~SkyCondition} Windy windy
	 * @property {module:domain~SkyCondition} Hazy hazy
	 * @property {module:domain~SkyCondition} Tornado tornado
	 * @property {module:domain~SkyCondition} Hurricane hurrican
	 * @property {module:domain~SkyCondition} Dusty dusty
	 * @alias module:domain~SkyConditions
	 */

	var SkyConditions = SkyCondition.enumsValue(SkyConditionValues);

	/**
	 * Get an appropriate multiplier value for scaling a given value to a more display-friendly form.
	 *
	 * This will return values suitable for passing to {@link module:format~displayUnitsForScale}.
	 *
	 * @param {number} value the value to get a display scale factor for, for example the maximum value
	 *                       in a range of values
	 * @return {number} the display scale factor
	 * @alias module:format~displayScaleForValue
	 */
	function displayScaleForValue(value) {
	  var result = 1,
	      num = Math.abs(Number(value));

	  if (isNaN(num) === false) {
	    if (num >= 1000000000) {
	      result = 1000000000;
	    } else if (num >= 1000000) {
	      result = 1000000;
	    } else if (num >= 1000) {
	      result = 1000;
	    }
	  }

	  return result;
	}
	/**
	 * Get an appropriate display unit for a given base unit and scale factor.
	 *
	 * Use this method to render scaled data value units. Typically you would first call
	 * {@link module:module:format~displayScaleForValue}, passing in the largest expected value
	 * in a set of data, and then pass the result to this method to generate a display unit
	 * for the base unit for that data.
	 *
	 * For example, given a base unit of `W` (watts) and a maximum data value of `10000`:
	 *
	 * ```
	 * const fmt = import { * } from 'format/scale';
	 * const displayScale = fmt.displayScaleForValue(10000);
	 * const displayUnit = fmt.displayUnitForScale('W', displayScale);
	 * ```
	 *
	 * The `displayUnit` result in that example would be `kW`.
	 *
	 * @param {string} baseUnit the base unit, for example `W` or `Wh`
	 * @param {number} scale the unit scale, which must be a recognized SI scale, such
	 *                       as `1000` for `k`
	 * @return {string} the display unit value
	 * @alias module:format~displayUnitsForScale
	 */

	function displayUnitsForScale(baseUnit, scale) {
	  return (scale === 1000000000 ? "G" : scale === 1000000 ? "M" : scale === 1000 ? "k" : "") + baseUnit;
	}

	/**
	 * Create a AuthTokenUrlHelperMixin class.
	 *
	 * @exports net
	 * @param {module:net~UrlHelper} superclass the UrlHelper class to mix onto
	 * @return {module:net~AuthTokenUrlHelperMixin} the mixin class
	 */

	var AuthTokenUrlHelperMixin = function AuthTokenUrlHelperMixin(superclass) {
	  return (
	    /*#__PURE__*/

	    /**
	     * A mixin class that adds authentication token support to {@link module:net~UrlHelper}.
	     *
	     * @mixin
	     * @alias module:net~AuthTokenUrlHelperMixin
	     */
	    function (_superclass) {
	      _inherits(_class, _superclass);

	      var _super = _createSuper(_class);

	      function _class() {
	        _classCallCheck(this, _class);

	        return _super.apply(this, arguments);
	      }

	      _createClass(_class, [{
	        key: "refreshTokenV2Url",
	        value:
	        /**
	         * Generate a URL to refresh the signing key of an authentication token.
	         *
	         * **Note** this method only works against the `/sec` version of the API endpoint.
	         *
	         * @param {date} date the signing date to use, or `null` for the current date
	         * @returns {string} the URL
	         */
	        function refreshTokenV2Url(date) {
	          return this.baseUrl() + "/auth-tokens/refresh/v2?date=" + encodeURIComponent(dateFormat(date || new Date()));
	        }
	      }]);

	      return _class;
	    }(superclass)
	  );
	};

	/**
	 * A case-insensitive string key multi-value map object.
	 *
	 * This map supports `null` values but ignores attempts to add keys with `undefined` values.
	 *
	 * @alias module:util~MultiMap
	 */
	var MultiMap = /*#__PURE__*/function () {
	  /**
	   * Constructor.
	   *
	   * @param {*} [values] an object who's enumerable properties will be added to this map
	   */
	  function MultiMap(values) {
	    _classCallCheck(this, MultiMap);

	    this.mappings = {}; // map of lower-case header names to {name:X, val:[]} values

	    this.mappingNames = []; // to keep insertion order

	    if (values) {
	      this.putAll(values);
	    }
	  }
	  /**
	   * Add a value.
	   *
	   * This method will append values to existing keys.
	   *
	   * @param {string} key the key to use
	   * @param {*} value the value to add; if `undefined` nothing will be added
	   * @returns {module:util~MutliMap} this object
	   */


	  _createClass(MultiMap, [{
	    key: "add",
	    value: function add(key, value) {
	      return addValue(this, key, value);
	    }
	    /**
	     * Set a value.
	     *
	     * This method will replace any existing values with just `value`.
	     *
	     * @param {string} key the key to use
	     * @param {*} value the value to set; if `undefined` nothing will be added
	     * @returns {module:util~MutliMap} this object
	     */

	  }, {
	    key: "put",
	    value: function put(key, value) {
	      return addValue(this, key, value, true);
	    }
	    /**
	     * Set multiple values.
	     *
	     * This method will replace any existing values with those provided on `values`.
	     *
	     * @param {*} values an object who's enumerable properties will be added to this map
	     * @returns {module:util~MutliMap} this object
	     */

	  }, {
	    key: "putAll",
	    value: function putAll(values) {
	      for (var key in values) {
	        if (values.hasOwnProperty(key)) {
	          addValue(this, key, values[key], true);
	        }
	      }

	      return this;
	    }
	    /**
	     * Get the values associated with a key.
	     *
	     * @param {string} key the key of the values to get
	     * @returns {object[]} the array of values associated with the key, or `undefined` if not available
	     */

	  }, {
	    key: "value",
	    value: function value(key) {
	      var keyLc = key.toLowerCase();
	      var mapping = this.mappings[keyLc];
	      return mapping ? mapping.val : undefined;
	    }
	    /**
	     * Get the first avaialble value assocaited with a key.
	     *
	     * @param {string} key the key of the value to get
	     * @returns {*} the first available value associated with the key, or `undefined` if not available
	     */

	  }, {
	    key: "firstValue",
	    value: function firstValue(key) {
	      var values = this.value(key);
	      return values && values.length > 0 ? values[0] : undefined;
	    }
	    /**
	     * Remove all properties from this map.
	     *
	     * @returns {module:util~MutliMap} this object
	     */

	  }, {
	    key: "clear",
	    value: function clear() {
	      this.mappingNames.length = 0;
	      this.mappings = {};
	      return this;
	    }
	    /**
	     * Remove all values associated with a key.
	     *
	     * @param {string} key the key of the values to remove
	     * @returns {object[]} the removed values, or `undefined` if no values were present for the given key
	     */

	  }, {
	    key: "remove",
	    value: function remove(key) {
	      var keyLc = key.toLowerCase();
	      var index = this.mappingNames.indexOf(keyLc);
	      var result = this.mappings[keyLc];

	      if (result) {
	        delete this.mappings[keyLc];
	        this.mappingNames.splice(index, 1);
	      }

	      return result ? result.val : undefined;
	    }
	    /**
	     * Get the number of entries in this map.
	     *
	     * @returns {number} the number of entries in the map
	     */

	  }, {
	    key: "size",
	    value: function size() {
	      return this.mappingNames.length;
	    }
	    /**
	     * Test if the map is empty.
	     *
	     * @returns {boolean} `true` if there are no entries in this map
	     */

	  }, {
	    key: "isEmpty",
	    value: function isEmpty() {
	      return this.size() < 1;
	    }
	    /**
	     * Test if there are any values associated with a key.
	     *
	     * @param {string} key the key to test
	     * @returns {boolean} `true` if there is at least one value associated with the key
	     */

	  }, {
	    key: "containsKey",
	    value: function containsKey(key) {
	      return this.value(key) !== undefined;
	    }
	    /**
	     * Get an array of all keys in this map.
	     *
	     * @returns {string[]} array of keys in this map, or an empty array if the map is empty
	     */

	  }, {
	    key: "keySet",
	    value: function keySet() {
	      var result = [];
	      var len = this.size();

	      for (var i = 0; i < len; i += 1) {
	        result.push(this.mappings[this.mappingNames[i]].key);
	      }

	      return result;
	    }
	  }]);

	  return MultiMap;
	}();
	/**
	 * Add/replace values on a map.
	 *
	 * @param {module:util~MutliMap} map the map to mutate
	 * @param {string} key the key to change
	 * @param {*} value the value to add; if `undefined` then nothing will be added
	 * @param {boolean} replace if `true` then replace all existing values;
	 *                          if `false` append to any existing values
	 * @returns {module:util~MutliMap} the passed in `map`
	 * @private
	 */


	function addValue(map, key, value, replace) {
	  if (value === undefined) {
	    return map;
	  }

	  var keyLc = key.toLowerCase();
	  var mapping = map.mappings[keyLc];

	  if (!mapping) {
	    mapping = {
	      key: key,
	      val: []
	    };
	    map.mappings[keyLc] = mapping;
	    map.mappingNames.push(keyLc);
	  }

	  if (replace) {
	    mapping.val.length = 0;
	  }

	  if (Array.isArray(value)) {
	    var len = value.length;

	    for (var i = 0; i < len; i += 1) {
	      mapping.val.push(value[i]);
	    }
	  } else {
	    mapping.val.push(value);
	  }

	  return map;
	}

	function createGetter(me, prop) {
	  return function () {
	    return me.map[prop];
	  };
	}

	function createSetter(me, prop) {
	  return function (value) {
	    me.map[prop] = value;
	  };
	}

	function createProperty(me, prop) {
	  Object.defineProperty(me, prop, {
	    enumerable: true,
	    configurable: true,
	    get: createGetter(me, prop),
	    set: createSetter(me, prop)
	  });
	}
	/**
	 * A configuration utility object.
	 *
	 * Properties can be get/set by using the {@link module:util~Configuration#value} function.
	 * @alias module:util~Configuration
	 */


	var Configuration = /*#__PURE__*/function () {
	  /**
	   * Constructor.
	   *
	   * For any properties passed on `initialMap`, {@link module:util~Configuration#value} will
	   * be called so those properties are defined on this instance.
	   *
	   * @param {object} initialMap the optional initial properties to store
	   */
	  function Configuration(initialMap) {
	    _classCallCheck(this, Configuration);

	    this.map = {};

	    if (initialMap !== undefined) {
	      this.values(initialMap);
	    }
	  }
	  /**
	   * Test if a key is truthy.
	   *
	   * @param {string} key the key to test
	   * @returns {boolean} `true` if the key is enabled
	   */


	  _createClass(Configuration, [{
	    key: "enabled",
	    value: function enabled(key) {
	      if (key === undefined) {
	        return false;
	      }

	      return !!this.map[key];
	    }
	    /**
	     * Set or toggle the enabled status of a given key.
	     *
	     * <p>If the `enabled` parameter is not passed, then the enabled
	     * status will be toggled to its opposite value.</p>
	     *
	     * @param {string} key they key to set
	     * @param {boolean} enabled the optional enabled value to set
	     * @returns {module:util~Configuration} this object to allow method chaining
	     */

	  }, {
	    key: "toggle",
	    value: function toggle(key, enabled) {
	      var val = enabled;

	      if (key === undefined) {
	        return this;
	      }

	      if (val === undefined) {
	        // in 1-argument mode, toggle current value
	        val = this.map[key] === undefined;
	      }

	      return this.value(key, val === true ? true : null);
	    }
	    /**
	     * Get or set a configuration value.
	     *
	     * @param {string} key The key to get or set the value for
	     * @param {object} [newValue] If defined, the new value to set for the given `key`.
	     *                            If `null` then the value will be removed.
	     * @returns {object} If called as a getter, the associated value for the given `key`,
	     *                   otherwise this object.
	     */

	  }, {
	    key: "value",
	    value: function value(key, newValue) {
	      if (arguments.length === 1) {
	        return this.map[key];
	      }

	      if (newValue === null) {
	        delete this.map[key];

	        if (this.hasOwnProperty(key)) {
	          delete this[key];
	        }
	      } else {
	        this.map[key] = newValue;

	        if (!this.hasOwnProperty(key)) {
	          createProperty(this, key);
	        }
	      }

	      return this;
	    }
	    /**
	     * Get or set multiple properties.
	     *
	     * @param {object} [newMap] a map of values to set
	     * @returns {object} if called as a getter, all properties of this object copied into a simple object;
	     *                   otherwise this object
	     */

	  }, {
	    key: "values",
	    value: function values(newMap) {
	      if (newMap) {
	        for (var prop in newMap) {
	          if (newMap.hasOwnProperty(prop)) {
	            this.value(prop, newMap[prop]);
	          }
	        }

	        return this;
	      }

	      return Object.assign({}, this.map);
	    }
	  }]);

	  return Configuration;
	}();

	/**
	 * Normailze a protocol value.
	 *
	 * This method is used to normalize protocol values which might come from a `Location`
	 * object and thus contain a trailing colon.
	 *
	 * @param {String} [val] the protocol value to normalize
	 * @returns {String} the normalized protocol value
	 * @alias module:net~normalizedProtocol
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
	 * Passing a browser `Location` object, like `window.location`, is supported. The
	 * `protocol`, `hostname`, and `port` values will be used.
	 *
	 * @param {Object} [config] the initial configuration
	 * @returns {Object} a new object with normalized configuration values
	 * @alias module:net~normalizedConfig
	 */


	function normalizedConfig(config) {
	  var result = Object.assign({
	    host: "data.solarnetwork.net"
	  }, config);
	  result.protocol = normalizedProtocol(result.protocol || "https");
	  result.port = result.port || (result.protocol === "https" ? 443 : 80);
	  result.host = result.port && result.hostname ? result.hostname : result.host;
	  return result;
	}
	/**
	 * An environment configuration utility object.
	 *
	 * This extends {@link module:util~Configuration} to add support for standard properties
	 * needed to access the SolarNetwork API, such as host and protocol values.
	 *
	 * @extends module:util~Configuration
	 * @alias module:net~Environment
	 */


	var Environment = /*#__PURE__*/function (_Configuration) {
	  _inherits(Environment, _Configuration);

	  var _super = _createSuper(Environment);

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
	   * @param {Object} [config] an optional set of properties to start with
	   */
	  function Environment(config) {
	    _classCallCheck(this, Environment);

	    return _super.call(this, normalizedConfig(config));
	  }
	  /**
	   * Check if TLS is in use via the `https` protocol.
	   *
	   * @returns {boolean} `true` if the `protocol` is set to `https`
	   */


	  _createClass(Environment, [{
	    key: "useTls",
	    value: function useTls() {
	      return this.value("protocol") === "https";
	    }
	  }]);

	  return Environment;
	}(Configuration);

	var HttpMethod = Object.freeze(
	/**
	 * Enumeration of HTTP methods (verbs).
	 * @enum {string}
	 * @alias module:net~HttpMethod
	 * @constant
	 */
	{
	  GET: "GET",
	  HEAD: "HEAD",
	  POST: "POST",
	  PUT: "PUT",
	  PATCH: "PATCH",
	  DELETE: "DELETE",
	  OPTIONS: "OPTIONS",
	  TRACE: "TRACE"
	});
	var HttpContentType = Object.freeze(
	/**
	 * Enumeration of common HTTP `Content-Type` values.
	 * @enum {string}
	 * @alias module:net~HttpContentType
	 * @constant
	 */
	{
	  APPLICATION_JSON: "application/json",
	  APPLICATION_JSON_UTF8: "application/json; charset=UTF-8",
	  FORM_URLENCODED: "application/x-www-form-urlencoded",
	  FORM_URLENCODED_UTF8: "application/x-www-form-urlencoded; charset=UTF-8"
	});
	/**
	 * Support for HTTP headers.
	 *
	 * @extends module:util~MultiMap
	 * @alias module:net~HttpHeaders
	 */

	var HttpHeaders = /*#__PURE__*/function (_MultiMap) {
	  _inherits(HttpHeaders, _MultiMap);

	  var _super = _createSuper(HttpHeaders);

	  function HttpHeaders() {
	    _classCallCheck(this, HttpHeaders);

	    return _super.call(this);
	  }

	  return HttpHeaders;
	}(MultiMap);

	Object.defineProperties(HttpHeaders, {
	  /**
	   * The `Accept` header.
	   *
	   * @memberof module:net~HttpHeaders
	   * @readonly
	   * @type {string}
	   */
	  ACCEPT: {
	    value: "Accept"
	  },

	  /**
	   * The `Authorization` header.
	   *
	   * @memberof module:net~HttpHeaders
	   * @readonly
	   * @type {string}
	   */
	  AUTHORIZATION: {
	    value: "Authorization"
	  },

	  /**
	   * The `Content-MD5` header.
	   *
	   * @memberof module:net~HttpHeaders
	   * @readonly
	   * @type {string}
	   */
	  CONTENT_MD5: {
	    value: "Content-MD5"
	  },

	  /**
	   * The `Content-Type` header.
	   *
	   * @memberof module:net~HttpHeaders
	   * @readonly
	   * @type {string}
	   */
	  CONTENT_TYPE: {
	    value: "Content-Type"
	  },

	  /**
	   * The `Date` header.
	   *
	   * @memberof module:net~HttpHeaders
	   * @readonly
	   * @type {string}
	   */
	  DATE: {
	    value: "Date"
	  },

	  /**
	   * The `Digest` header.
	   *
	   * @memberof module:net~HttpHeaders
	   * @readonly
	   * @type {string}
	   */
	  DIGEST: {
	    value: "Digest"
	  },

	  /**
	   * The `Host` header.
	   *
	   * @memberof module:net~HttpHeaders
	   * @readonly
	   * @type {string}
	   */
	  HOST: {
	    value: "Host"
	  },

	  /**
	   * The `X-SN-Date` header.
	   *
	   * @memberof module:net~HttpHeaders
	   * @readonly
	   * @type {string}
	   */
	  X_SN_DATE: {
	    value: "X-SN-Date"
	  }
	});

	/**
	 * Parse the query portion of a URL string, and return a parameter object for the
	 * parsed key/value pairs.
	 *
	 * <p>Multiple parameters of the same name will be stored as an array on the returned object.</p>
	 *
	 * @param {string} search the query portion of the URL, which may optionally include
	 *                        the leading `?` character
	 * @param {Set<String>} [multiValueKeys] if provided, a set of keys for which to always treat
	 *                                       as a multi-value array, even if there is only one value
	 * @return {object} the parsed query parameters, as a parameter object
	 * @alias module:net~urlQueryParse
	 */
	function urlQueryParse(search, multiValueKeys) {
	  var params = {};
	  var pairs;
	  var pair;
	  var i, len, k, v;

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
	        } else if (multiValueKeys && multiValueKeys.has(k)) {
	          params[k] = [v];
	        } else {
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
	 * <p>If an object property has an array value, multiple URL parameters will be encoded for that property.</p>
	 *
	 * <p>The optional `encoderFn` argument is a function that accepts a string value
	 * and should return a URI-safe string for that value.</p>
	 *
	 * @param {object} parameters an object to encode as URL parameters
	 * @param {function} encoderFn an optional function to encode each URI component with;
	 *                             if not provided the built-in `encodeURIComponent()` function
	 *                             will be used
	 * @return {string} the encoded query parameters
	 * @alias module:net~urlQueryEncode
	 */


	function urlQueryEncode(parameters, encoderFn) {
	  var result = "",
	      prop,
	      val,
	      i,
	      len;
	  var encoder = encoderFn || encodeURIComponent;

	  function handleValue(k, v) {
	    if (result.length) {
	      result += "&";
	    }

	    result += encoder(k) + "=" + encoder(v);
	  }

	  if (parameters) {
	    for (prop in parameters) {
	      if (parameters.hasOwnProperty(prop)) {
	        val = parameters[prop];

	        if (Array.isArray(val)) {
	          for (i = 0, len = val.length; i < len; i++) {
	            handleValue(prop, val[i]);
	          }
	        } else {
	          handleValue(prop, val);
	        }
	      }
	    }
	  }

	  return result;
	}
	var urlQuery = {
	  urlQueryParse: urlQueryParse,
	  urlQueryEncode: urlQueryEncode
	};

	/**
	 * The number of milliseconds a signing key is valid for.
	 * @type {number}
	 * @private
	 */

	var SIGNING_KEY_VALIDITY = 7 * 24 * 60 * 60 * 1000;
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
	 *  1. Use the {@link module:net~AuthorizationV2Builder#method method()} method to configure the HTTP verb (you can use the {@link module:net~HttpMethod HttpMethod} constants).
	 *  2. Use the {@link module:net~AuthorizationV2Builder#contentType contentType()} method to configure the same value that will be used for the HTTP `Content-Type` header (you can use the {@link module:net~HttpContentType HttpContentType} constants).
	 *  3. **If** the content type is `application/x-www-form-urlencoded` then you should use the {@link module:net~AuthorizationV2Builder#queryParams queryParams()} method to configure the request parameters.
	 *  4. **If** the content type is **not** `application/x-www-form-urlencoded` then you should use the {@link module:net~AuthorizationV2Builder#computeContentDigest computeContentDigest()} method to configure a HTTP `Digest` header.
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
	 * @alias module:net~AuthorizationV2Builder
	 */

	var AuthorizationV2Builder = /*#__PURE__*/function () {
	  /**
	   * Constructor.
	   *
	   * The {@link module:net~AuthorizationV2Builder#reset reset()} method is invoked to set up
	   * default values for this instance.
	   *
	   * @param {string} token the auth token to use
	   * @param {module:net~Environment} [environment] the environment to use; if not provided a
	   *        default environment will be created
	   */
	  function AuthorizationV2Builder(token, environment) {
	    _classCallCheck(this, AuthorizationV2Builder);

	    /**
	     * The SolarNet auth token value.
	     * @member {string}
	     */
	    this.tokenId = token;
	    /**
	     * The SolarNet environment.
	     * @member {module:net~Environment}
	     */

	    this.environment = environment || new Environment();
	    /**
	     * The signed HTTP headers.
	     *
	     * @member {module:net~HttpHeaders}
	     */

	    this.httpHeaders = new HttpHeaders();
	    /**
	     * The HTTP query parameters.
	     *
	     * @member {module:util~MultiMap}
	     */

	    this.parameters = new MultiMap();
	    /**
	     * Force a port number to be added to host values, even if port would be implied.
	     *
	     * This can be useful when working with a server behind a proxy, where the
	     * proxy is configured to always forward the port even if the port is implied
	     * (i.e. HTTPS is used on the standard port 443).
	     *
	     * @member {boolean}
	     */

	    this.forceHostPort = false;
	    this.reset();
	  }
	  /**
	   * Reset to defalut property values.
	   *
	   * Any previously saved signing key via {@link module:net~AuthorizationV2Builder#saveSigningKey saveSigningKey()}
	   * or {@link module:net~AuthorizationV2Builder#key key()} is preserved. The following items are reset:
	   *
	   *  * {@link module:net~AuthorizationV2Builder#method method()} is set to `GET`
	   *  * {@link module:net~AuthorizationV2Builder#host host()} is set to `this.environment.host`
	   *  * {@link module:net~AuthorizationV2Builder#path path()} is set to `/`
	   *  * {@link module:net~AuthorizationV2Builder#date date()} is set to the current date
	   *  * {@link module:net~AuthorizationV2Builder#contentSHA256 contentSHA256()} is cleared
	   *  * {@link module:net~AuthorizationV2Builder#headers headers()} is cleared
	   *  * {@link module:net~AuthorizationV2Builder#queryParams queryParams()} is cleared
	   *  * {@link module:net~AuthorizationV2Builder#signedHttpHeaders signedHttpHeaders()} is set to a new empty array
	   *
	   * @returns {module:net~AuthorizationV2Builder} this object
	   */


	  _createClass(AuthorizationV2Builder, [{
	    key: "reset",
	    value: function reset() {
	      this.contentDigest = null;
	      var host = this.environment.host;
	      this.httpHeaders.clear();
	      this.parameters.clear();
	      return this.signedHttpHeaders([]).method(HttpMethod.GET).host(host).path("/").date(new Date());
	    }
	    /**
	     * Compute and cache the signing key.
	     *
	     * Signing keys are derived from the token secret and valid for 7 days, so
	     * this method can be used to compute a signing key so that {@link module:net~AuthorizationV2Builder#build build()}
	     * can be called later. The signing date will be set to whatever date is
	     * currently configured via {@link module:net~AuthorizationV2Builder#date date()}, which defaults to the
	     * current time for newly created builder instances.
	     *
	     * If you have an externally computed signing key, such as one returned from a token refresh API call,
	     * use the {@link module:net~AuthorizationV2Builder#key key()} method to save it rather than this method.
	     * If you want to compute the signing key, without caching it on this builder, use the
	     * {@link module:net~AuthorizationV2Builder#computeSigningKey computeSigningKey()} method rather than
	     * this method.
	     *
	     * @param {string} tokenSecret the secret to sign the digest with
	     * @returns {module:net~AuthorizationV2Builder} this object
	     */

	  }, {
	    key: "saveSigningKey",
	    value: function saveSigningKey(tokenSecret) {
	      this.key(this.computeSigningKey(tokenSecret), this.requestDate);
	      return this;
	    }
	    /**
	     * Get or set the signing key.
	     *
	     * Use this method to save an existing signing key, for example one received via a refresh
	     * request. The `date` parameter is used to track the expirataion date of the key, as
	     * reported by the {@link module:net~AuthorizationV2Builder#signingKeyValid signingKeyValid}
	     * property.
	     *
	     * If you have an actual token secret value, use the
	     * {@link module:net~AuthorizationV2Builder#saveSigningKey saveSigningKey()} method to save it
	     * rather than this method.
	     *
	     * @param {CryptoJS#WordArray} key the signing key to save
	     * @param {Date} [date] an optional date the signing key was generated with; if not provided
	     *                      the configured {@link module:net~AuthorizationV2Builder#date date()}
	     *                      value will be used
	     * @returns {CryptoJS#WordArray|module:net~AuthorizationV2Builder} when used as a getter, the
	     *          current saved signing key value, otherwise this object
	     * @see module:net~AuthorizationV2Builder#signingKeyExpirationDate
	     */

	  }, {
	    key: "key",
	    value: function key(_key, date) {
	      if (_key === undefined) {
	        return this.signingKey;
	      }

	      this.signingKey = _key;
	      var expire = new Date((date ? date.getTime() : this.requestDate.getTime()) + SIGNING_KEY_VALIDITY);
	      expire.setUTCHours(0);
	      expire.setUTCMinutes(0);
	      expire.setUTCSeconds(0);
	      expire.setUTCMilliseconds(0);
	      this.signingKeyExpiration = expire;
	      return this;
	    }
	    /**
	     * Get the saved signing key expiration date.
	     *
	     * This will return the expiration date the signing key saved via
	     * {@link module:net~AuthorizationV2Builder#key key()} or
	     * {@link module:net~AuthorizationV2Builder#saveSigningKey saveSigningKey()}.
	     *
	     * @readonly
	     * @type {Date}
	     */

	  }, {
	    key: "signingKeyExpirationDate",
	    get: function get() {
	      return this.signingKeyExpiration;
	    }
	    /**
	     * Test if a signing key is present and not expired.
	     * @readonly
	     * @type {boolean}
	     */

	  }, {
	    key: "signingKeyValid",
	    get: function get() {
	      return this.signingKey && this.signingKeyExpiration instanceof Date && Date.now() < this.signingKeyExpiration.getTime() ? true : false;
	    }
	    /**
	     * Set the HTTP method (verb) to use.
	     *
	     * @param {string} val the method to use; see the {@link HttpMethod} enum for possible values
	     * @returns {module:net~AuthorizationV2Builder} this object
	     */

	  }, {
	    key: "method",
	    value: function method(val) {
	      this.httpMethod = val;
	      return this;
	    }
	    /**
	     * Set the HTTP host.
	     *
	     * This is a shortcut for calling `HttpHeaders#put(HttpHeaders.HOST, val)`.
	     *
	     * @param {string} val the HTTP host value to use
	     * @returns {module:net~AuthorizationV2Builder} this object
	     */

	  }, {
	    key: "host",
	    value: function host(val) {
	      if (this.forceHostPort && val.indexOf(":") < 0 && this.environment.port != 80) {
	        val += ":" + this.environment.port;
	      }

	      this.httpHeaders.put(HttpHeaders.HOST, val);
	      return this;
	    }
	    /**
	     * Set the HTTP request path to use.
	     *
	     * @param {string} val the request path to use
	     * @returns {module:net~AuthorizationV2Builder} this object
	     */

	  }, {
	    key: "path",
	    value: function path(val) {
	      this.requestPath = val;
	      return this;
	    }
	    /**
	     * Set the host, path, and query parameters via a URL string.
	     *
	     * @param {string} url the URL value to use
	     * @param {boolean} [ignoreHost] if `true` then do not set the {@link module:net~AuthorizationV2Builder#host host()}
	     *                               from the given URL; this can be useful when you do not want to override the configured
	     *                               environment host
	     * @returns {module:net~AuthorizationV2Builder} this object
	     */

	  }, {
	    key: "url",
	    value: function url(_url, ignoreHost) {
	      var uri = uriJs.parse(_url);
	      var host = uri.host;

	      if (uri.port && ((uri.scheme === "https" || uri.scheme === "wss") && uri.port !== 443 || (uri.scheme === "http" || uri.scheme === "ws") && uri.port !== 80)) {
	        host += ":" + uri.port;
	      }

	      if (uri.query) {
	        this.queryParams(urlQueryParse(uri.query));
	      }

	      if (!ignoreHost) {
	        this.host(host);
	      }

	      return this.path(uri.path);
	    }
	    /**
	     * Set the HTTP content type.
	     *
	     * This is a shortcut for calling {@link module:net~HttpHeaders#put HttpHeaders.put()} with the
	     * key {@link module:net~HttpHeaders.CONTENT_TYPE HttpHeaders.CONTENT_TYPE}.
	     *
	     * @param {string} val the HTTP content type value to use
	     * @returns {module:net~AuthorizationV2Builder} this object
	     */

	  }, {
	    key: "contentType",
	    value: function contentType(val) {
	      this.httpHeaders.put(HttpHeaders.CONTENT_TYPE, val);
	      return this;
	    }
	    /**
	     * Set the authorization request date.
	     *
	     * @param {Date} val the date to use; typically the current time, e.g. `new Date()`
	     * @returns {module:net~AuthorizationV2Builder} this object
	     */

	  }, {
	    key: "date",
	    value: function date(val) {
	      this.requestDate = val ? val : new Date();
	      return this;
	    }
	    /**
	     * The authorization request date as a HTTP header string value.
	     *
	     * @readonly
	     * @type {string}
	     */

	  }, {
	    key: "requestDateHeaderValue",
	    get: function get() {
	      return this.requestDate.toUTCString();
	    }
	    /**
	     * Control using the `X-SN-Date` HTTP header versus the `Date` header.
	     *
	     * Set to `true` to use the `X-SN-Date` header, `false` to use
	     * the `Date` header. This will return `true` if `X-SN-Date` has been
	     * added to the `signedHeaderNames` property or has been added to the `httpHeaders`
	     * property.
	     *
	     * @type {boolean}
	     */

	  }, {
	    key: "useSnDate",
	    get: function get() {
	      var signedHeaders = this.signedHeaderNames;
	      var existingIndex = Array.isArray(signedHeaders) ? signedHeaders.findIndex(caseInsensitiveEqualsFn(HttpHeaders.X_SN_DATE)) : -1;
	      return existingIndex >= 0 || this.httpHeaders.containsKey(HttpHeaders.X_SN_DATE);
	    },
	    set: function set(enabled) {
	      var signedHeaders = this.signedHeaderNames;
	      var existingIndex = Array.isArray(signedHeaders) ? signedHeaders.findIndex(caseInsensitiveEqualsFn(HttpHeaders.X_SN_DATE)) : -1;

	      if (enabled && existingIndex < 0) {
	        signedHeaders = signedHeaders ? signedHeaders.concat(HttpHeaders.X_SN_DATE) : [HttpHeaders.X_SN_DATE];
	        this.signedHeaderNames = signedHeaders;
	      } else if (!enabled && existingIndex >= 0) {
	        signedHeaders.splice(existingIndex, 1);
	        this.signedHeaderNames = signedHeaders;
	      } // also clear from httpHeaders


	      this.httpHeaders.remove(HttpHeaders.X_SN_DATE);
	    }
	    /**
	     * Set the `useSnDate` property.
	     *
	     * @param {boolean} enabled `true` to use the `X-SN-Date` header, `false` to use `Date`
	     * @returns {module:net~AuthorizationV2Builder} this object
	     */

	  }, {
	    key: "snDate",
	    value: function snDate(enabled) {
	      this.useSnDate = enabled;
	      return this;
	    }
	    /**
	     * Set a HTTP header value.
	     *
	     * This is a shortcut for calling `HttpHeaders#put(headerName, val)`.
	     *
	     * @param {string} headerName the header name to set
	     * @param {string} headerValue the header value to set
	     * @returns {module:net~AuthorizationV2Builder} this object
	     */

	  }, {
	    key: "header",
	    value: function header(headerName, headerValue) {
	      this.httpHeaders.put(headerName, headerValue);
	      return this;
	    }
	    /**
	     * Set the HTTP headers to use with the request.
	     *
	     * The headers object must include all headers necessary by the
	     * authentication scheme, and any additional headers also configured via
	     * {@link module:net~AuthorizationV2Builder#signedHttpHeaders}.
	     *
	     * @param {HttpHeaders} headers the HTTP headers to use
	     * @returns {module:net~AuthorizationV2Builder} this object
	     */

	  }, {
	    key: "headers",
	    value: function headers(_headers) {
	      this.httpHeaders = _headers;
	      return this;
	    }
	    /**
	     * Set the HTTP `GET` query parameters, or `POST` form-encoded
	     * parameters.
	     *
	     * @param {MultiMap|Object} params the parameters to use, as either a {@link MultiMap} or simple `Object`
	     * @returns {module:net~AuthorizationV2Builder} this object
	     */

	  }, {
	    key: "queryParams",
	    value: function queryParams(params) {
	      if (params instanceof MultiMap) {
	        this.parameters = params;
	      } else {
	        this.parameters.putAll(params);
	      }

	      return this;
	    }
	    /**
	     * Set additional HTTP header names to sign with the authentication.
	     *
	     * @param {sring[]} signedHeaderNames additional HTTP header names to include in the signature
	     * @returns {module:net~AuthorizationV2Builder} this object
	     */

	  }, {
	    key: "signedHttpHeaders",
	    value: function signedHttpHeaders(signedHeaderNames) {
	      this.signedHeaderNames = signedHeaderNames;
	      return this;
	    }
	    /**
	     * Set the HTTP request body content SHA-256 digest value.
	     *
	     * @param {string|module:crypto-js/enc-hex~WordArray} digest the digest value to use; if a string it is assumed to be Hex encoded
	     * @returns {module:net~AuthorizationV2Builder} this object
	     */

	  }, {
	    key: "contentSHA256",
	    value: function contentSHA256(digest) {
	      var contentDigest;

	      if (typeof digest === "string") {
	        contentDigest = Hex.parse(digest);
	      } else {
	        contentDigest = digest;
	      }

	      this.contentDigest = contentDigest;
	      return this;
	    }
	    /**
	     * Compute the SHA-256 digest of the request body content and configure the result on this builder.
	     *
	     * This method will compute the digest and then save the result via the
	     * {@link module:net~AuthorizationV2Builder#contentSHA256 contentSHA256()}
	     * method. In addition, it will set the `Digest` HTTP header value via
	     * {@link module:net~AuthorizationV2Builder#header header()}.
	     * This means you _must_ also pass the `Digest` HTTP header with the request. After calling this
	     * method, you can retrieve the `Digest` HTTP header value via the `httpHeaders`property.
	     *
	     * @param {string} content the request body content to compute a SHA-256 digest value from
	     * @returns {module:net~AuthorizationV2Builder} this object
	     */

	  }, {
	    key: "computeContentDigest",
	    value: function computeContentDigest(content) {
	      var digest = SHA256(content);
	      this.contentSHA256(digest);
	      this.header("Digest", "sha-256=" + Base64.stringify(digest));
	      return this;
	    }
	    /**
	     * Compute the canonical query parameters.
	     *
	     * @returns {string} the canonical query parameters string value
	     */

	  }, {
	    key: "canonicalQueryParameters",
	    value: function canonicalQueryParameters() {
	      var keys = this.parameters.keySet();

	      if (keys.length < 1) {
	        return "";
	      }

	      keys.sort();
	      var len = keys.length;
	      var first = true,
	          result = "";

	      for (var i = 0; i < len; i += 1) {
	        var key = keys[i];
	        var vals = this.parameters.value(key);
	        var valsLen = vals.length;

	        for (var j = 0; j < valsLen; j += 1) {
	          if (first) {
	            first = false;
	          } else {
	            result += "&";
	          }

	          result += _encodeURIComponent(key) + "=" + _encodeURIComponent(vals[j]);
	        }
	      }

	      return result;
	    }
	    /**
	     * Compute the canonical HTTP headers string value.
	     *
	     * @param {string[]} sortedLowercaseHeaderNames the sorted, lower-cased HTTP header names to include
	     * @returns {string} the canonical headers string value
	     */

	  }, {
	    key: "canonicalHeaders",
	    value: function canonicalHeaders(sortedLowercaseHeaderNames) {
	      var result = "",
	          headerName,
	          headerValue;
	      var len = sortedLowercaseHeaderNames.length;

	      for (var i = 0; i < len; i += 1) {
	        headerName = sortedLowercaseHeaderNames[i];

	        if ("date" === headerName || "x-sn-date" === headerName) {
	          headerValue = this.requestDate.toUTCString();
	        } else {
	          headerValue = this.httpHeaders.firstValue(headerName);
	        }

	        result += headerName + ":" + (headerValue ? headerValue.trim() : "") + "\n";
	      }

	      return result;
	    }
	    /**
	     * Compute the canonical signed header names value from an array of HTTP header names.
	     *
	     * @param {string[]} sortedLowercaseHeaderNames the sorted, lower-cased HTTP header names to include
	     * @returns {string} the canonical signed header names string value
	     * @private
	     */

	  }, {
	    key: "canonicalSignedHeaderNames",
	    value: function canonicalSignedHeaderNames(sortedLowercaseHeaderNames) {
	      return sortedLowercaseHeaderNames.join(";");
	    }
	    /**
	     * Get the canonical request content SHA256 digest, hex encoded.
	     *
	     * @returns {string} the hex-encoded SHA256 digest of the request content
	     */

	  }, {
	    key: "canonicalContentSHA256",
	    value: function canonicalContentSHA256() {
	      return this.contentDigest ? Hex.stringify(this.contentDigest) : AuthorizationV2Builder.EMPTY_STRING_SHA256_HEX;
	    }
	    /**
	     * Compute the canonical HTTP header names to include in the signature.
	     *
	     * @returns {string[]} the sorted, lower-cased HTTP header names to include
	     */

	  }, {
	    key: "canonicalHeaderNames",
	    value: function canonicalHeaderNames() {
	      var httpHeaders = this.httpHeaders;
	      var signedHeaderNames = this.signedHeaderNames; // use a MultiMap to take advantage of case-insensitive keys

	      var map = new MultiMap();
	      map.put(HttpHeaders.HOST, true);

	      if (this.useSnDate) {
	        map.put(HttpHeaders.X_SN_DATE, true);
	      } else {
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
	        signedHeaderNames.forEach(function (e) {
	          return map.put(e, true);
	        });
	      }

	      return lowercaseSortedArray(map.keySet());
	    }
	    /**
	     * Compute the canonical request data that will be included in the data to sign with the request.
	     *
	     * @returns {string} the canonical request data
	     */

	  }, {
	    key: "buildCanonicalRequestData",
	    value: function buildCanonicalRequestData() {
	      return this.computeCanonicalRequestData(this.canonicalHeaderNames());
	    }
	    /**
	     * Compute the canonical request data that will be included in the data to sign with the request,
	     * using a specific set of HTTP header names to sign.
	     *
	     * @param {string[]} sortedLowercaseHeaderNames the sorted, lower-cased HTTP header names to sign with the request
	     * @returns {string} the canonical request data
	     * @private
	     */

	  }, {
	    key: "computeCanonicalRequestData",
	    value: function computeCanonicalRequestData(sortedLowercaseHeaderNames) {
	      // 1: HTTP verb
	      var result = this.httpMethod + "\n"; // 2: Canonical URI

	      result += this.requestPath + "\n"; // 3: Canonical query string

	      result += this.canonicalQueryParameters() + "\n"; // 4: Canonical headers

	      result += this.canonicalHeaders(sortedLowercaseHeaderNames); // already includes newline
	      // 5: Signed header names

	      result += this.canonicalSignedHeaderNames(sortedLowercaseHeaderNames) + "\n"; // 6: Content SHA256, hex encoded

	      result += this.canonicalContentSHA256();
	      return result;
	    }
	    /**
	     * Compute the signing key, from a secret key and based on the
	     * configured {@link module:net~AuthorizationV2Builder#date date()}.
	     *
	     * This method does not save the signing key for future use in this builder instance
	     * (see {@link module:net~AuthorizationV2Builder#saveSigningKey saveSigningKey()} for that).
	     * Use this method if you want to compute a signing key that you can later pass to
	     * {@link module:net~AuthorizationV2Builder#buildWithKey buildWithKey()} on some other builder instance.
	     * Signing keys are valid for a maximum of 7 days, granular to whole days only.
	     * To make a signing key expire in fewer than 7 days, configure  a
	     * {@link module:net~AuthorizationV2Builder#date date()} value in the past before
	     * calling this method.
	     *
	     * @param {string} secretKey the secret key string
	     * @returns {CryptoJS#WordArray} the computed key
	     */

	  }, {
	    key: "computeSigningKey",
	    value: function computeSigningKey(secretKey) {
	      var datestring = iso8601Date(this.requestDate);
	      var key = HmacSHA256("snws2_request", HmacSHA256(datestring, "SNWS2" + secretKey));
	      return key;
	    }
	    /**
	     * Compute the data to be signed by the signing key.
	     *
	     * @param {string} canonicalRequestData the request data, returned from {@link module:net~AuthorizationV2Builder#buildCanonicalRequestData}
	     * @returns {string} the data to sign
	     * @private
	     */

	  }, {
	    key: "computeSignatureData",
	    value: function computeSignatureData(canonicalRequestData) {
	      /*- signature data is like:
	                 SNWS2-HMAC-SHA256\n
	                20170301T120000Z\n
	                Hex(SHA256(canonicalRequestData))
	            */
	      return "SNWS2-HMAC-SHA256\n" + iso8601Date(this.requestDate, true) + "\n" + Hex.stringify(SHA256(canonicalRequestData));
	    }
	    /**
	     * Compute a HTTP `Authorization` header value from the configured properties
	     * on the builder, using the provided signing key.
	     *
	     * This method does not save the signing key for future use in this builder instance
	     * (see {@link module:net~AuthorizationV2Builder#key key()} for that).
	     *
	     * @param {CryptoJS#WordArray} signingKey the key to sign the computed signature data with
	     * @returns {string} the SNWS2 HTTP Authorization header value
	     */

	  }, {
	    key: "buildWithKey",
	    value: function buildWithKey(signingKey) {
	      var sortedHeaderNames = this.canonicalHeaderNames();
	      var canonicalReq = this.computeCanonicalRequestData(sortedHeaderNames);
	      var signatureData = this.computeSignatureData(canonicalReq);
	      var signature = Hex.stringify(HmacSHA256(signatureData, signingKey));
	      var result = "SNWS2 Credential=" + this.tokenId + ",SignedHeaders=" + sortedHeaderNames.join(";") + ",Signature=" + signature;
	      return result;
	    }
	    /**
	     * Compute a HTTP `Authorization` header value from the configured
	     * properties on the builder, computing a new signing key based on the
	     * configured {@link module:net~AuthorizationV2Builder#date}.
	     *
	     * @param {string} tokenSecret the secret to sign the authorization with
	     * @return {string} the SNWS2 HTTP Authorization header value
	     */

	  }, {
	    key: "build",
	    value: function build(tokenSecret) {
	      var signingKey = this.computeSigningKey(tokenSecret);
	      return this.buildWithKey(signingKey);
	    }
	    /**
	     * Compute a HTTP `Authorization` header value from the configured
	     * properties on the builder, using a signing key configured from a previous
	     * call to {@link module:net~AuthorizationV2Builder#saveSigningKey saveSigningKey()}
	     * or {@link module:net~AuthorizationV2Builder#key key()}.
	     *
	     * @return {string} the SNWS2 HTTP Authorization header value.
	     */

	  }, {
	    key: "buildWithSavedKey",
	    value: function buildWithSavedKey() {
	      return this.buildWithKey(this.signingKey);
	    }
	  }]);

	  return AuthorizationV2Builder;
	}();
	/**
	 * @function stringMatchFn
	 * @param {string} e the element to test
	 * @returns {boolean} `true` if the element matches
	 * @private
	 */

	/**
	 * Create a case-insensitive string matching function.
	 *
	 * @param {string} value the string to perform the case-insensitive comparison against
	 * @returns {stringMatchFn} a matching function that performs a case-insensitive comparison
	 * @private
	 */


	function caseInsensitiveEqualsFn(value) {
	  var valueLc = value.toLowerCase();
	  return function (e) {
	    return valueLc === e.toString().toLowerCase();
	  };
	}
	/**
	 * Create a new array of lower-cased and sorted strings from another array.
	 *
	 * @param {string[]} items the items to lower-case and sort
	 * @returns {string[]} a new array of the lower-cased and sorted items
	 * @private
	 */


	function lowercaseSortedArray(items) {
	  var sortedItems = [];
	  var len = items.length;

	  for (var i = 0; i < len; i += 1) {
	    sortedItems.push(items[i].toLowerCase());
	  }

	  sortedItems.sort();
	  return sortedItems;
	}

	function _hexEscapeChar(c) {
	  return "%" + c.charCodeAt(0).toString(16).toUpperCase();
	}

	function _encodeURIComponent(str) {
	  return encodeURIComponent(str).replace(/[!'()*]/g, _hexEscapeChar);
	}

	Object.defineProperties(AuthorizationV2Builder, {
	  /**
	   * The hex-encoded value for an empty SHA256 digest value.
	   *
	   * @memberof AuthorizationV2Builder
	   * @readonly
	   * @type {string}
	   */
	  EMPTY_STRING_SHA256_HEX: {
	    value: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
	  },

	  /**
	   * The SolarNetwork V2 authorization scheme.
	   *
	   * @memberof AuthorizationV2Builder
	   * @readonly
	   * @type {string}
	   */
	  SNWS2_AUTH_SCHEME: {
	    value: "SNWS2"
	  }
	});

	/**
	 * A utility class for helping to compose SolarNet URLs for the REST API.
	 *
	 * This class is essentially abstract and meant to have mixin helper objects extend it.
	 * @alias module:net~UrlHelper
	 */

	var UrlHelper = /*#__PURE__*/function () {
	  /**
	   * Constructor.
	   *
	   * @param {module:net~Environment|object} [environment] the optional initial environment to use;
	   *        if a non-`Environment` object is passed then the properties of that object will
	   *        be used to construct a new `Environment` instance
	   */
	  function UrlHelper(environment) {
	    _classCallCheck(this, UrlHelper);

	    var env = environment instanceof Environment ? environment : new Environment(environment);
	    /**
	     * The environment associated with this helper.
	     * @member {module:net~Environment}
	     */

	    this.environment = env;
	    this._parameters = new Configuration();
	  }
	  /**
	   * Get a parameters object that can be used to hold URL variables.
	   *
	   * @readonly
	   * @type {module:util~Configuration}
	   */


	  _createClass(UrlHelper, [{
	    key: "parameters",
	    get: function get() {
	      return this._parameters;
	    }
	    /**
	     * Get or set an environment parameter.
	     *
	     * This is a shortcut for calling {@link module:net~Configuration#value} on the
	     * `environment` object.
	     *
	     * @param {string} key the environment parameter name to get
	     * @param {object} [val] the optional value to set
	     * @returns {object} when called as a getter, the environment parameter value;
	     *                   when called as a setter, the environment parameters object
	     */

	  }, {
	    key: "env",
	    value: function env() {
	      var _this$environment;

	      return (_this$environment = this.environment).value.apply(_this$environment, arguments);
	    }
	    /**
	     * Get or set a parameter.
	     *
	     * This is a shortcut for calling {@link module:net~Configuration#value} on the
	     * `parameters` object.
	     *
	     * @param {string} key the parameter name to get
	     * @param {Object} [val] the optional value to set
	     * @returns {Object} when called as a getter, the parameter value;
	     *                   when called as a setter, the parameters object
	     */

	  }, {
	    key: "parameter",
	    value: function parameter() {
	      var _this$_parameters;

	      return (_this$_parameters = this._parameters).value.apply(_this$_parameters, arguments);
	    }
	    /**
	     * Get a URL for just the SolarNet host, without any path.
	     *
	     * This method constructs an absolute URL based on the following properties configured
	     * on this instance's {@link module:net~Environment}:
	     *
	     *  1. If {@link module:net~Environment#useTls environment.useTls()} returns `true` then
	     *     use HTTPS as the protocol, otherwise HTTP.
	     *  2. Use `host` for the host name or IP address, unless `proxyHost` is available.
	     *  3. Use `port` for the port, unless `proxyPort` is available. If neither are available, use `443` for
	     *     HTTPS or `80` for HTTP.
	     *
	     * @returns {string} the URL to the SolarNet host
	     */

	  }, {
	    key: "hostUrl",
	    value: function hostUrl() {
	      var tls = this.environment.useTls();
	      var host = this.environment.value("proxyHost") || this.environment.value("host");
	      var port = +(this.environment.value("proxyPort") || this.environment.value("port"));
	      var url = "http" + (tls ? "s" : "") + "://" + host;

	      if (tls && port > 0 && port !== 443 || !tls && port > 0 && port !== 80) {
	        url += ":" + port;
	      }

	      return url;
	    }
	    /**
	     * Get a URL for just the SolarNet host using the WebSocket protocol, without any path.
	     *
	     * This method constructs an absolute URL based on the following properties configured
	     * on this instance's {@link module:net~Environment}:
	     *
	     *  1. If {@link module:net~Environment#useTls environment.useTls()} returns `true` then
	     *     use WSS as the protocol, otherwise WS.
	     *  2. Use `host` for the host name or IP address, unless `proxyHost` is available.
	     *  3. Use `port` for the port, unless `proxyPort` is available. If neither are available, use `443` for
	     *     WSS or `80` for WS.
	     *
	     * @returns {string} the URL to the SolarNet host WebSocket
	     */

	  }, {
	    key: "hostWebSocketUrl",
	    value: function hostWebSocketUrl() {
	      var tls = this.environment.useTls();
	      var host = this.environment.value("proxyHost") || this.environment.value("host");
	      var port = +(this.environment.value("proxyPort") || this.environment.value("port"));
	      var url = "ws" + (tls ? "s" : "") + "://" + host;

	      if (tls && port > 0 && port !== 443 || !tls && port > 0 && port !== 80) {
	        url += ":" + port;
	      }

	      return url;
	    }
	    /**
	     * Get the base URL to the REST API.
	     *
	     * This implementation is a stub, meant for subclasses to override. This implementation
	     * simply returns {@link module:net~UrlHelper#hostUrl}.
	     *
	     * @abstract
	     * @returns {string} the base URL to the REST API
	     */

	  }, {
	    key: "baseUrl",
	    value: function baseUrl() {
	      return this.hostUrl();
	    }
	    /**
	     * Replace occurances of URL template variables with values from the `parameters`
	     * property and append to the host URL.
	     *
	     * This method provides a way to resolve an absolute URL based on the configured
	     * environment and parameters on this object.
	     *
	     * @param {string} template a URL path template
	     * @returns {string} an absolute URL
	     * @see module:net~UrlHelper#resolveTemplateUrl
	     */

	  }, {
	    key: "resolveTemplatePath",
	    value: function resolveTemplatePath(template) {
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
	     * @param {string} template a URL template
	     * @returns {string} the URL with template variables resolved
	     */

	  }, {
	    key: "resolveTemplateUrl",
	    value: function resolveTemplateUrl(template) {
	      return UrlHelper.resolveTemplateUrl(template, this._parameters);
	    }
	    /**
	     * Replace occurances of URL template variables with values from a parameter object.
	     *
	     * URL template variables are specified as `{<em>name</em>}`. The variable
	     * will be replaced by the value associated with property `name` in the
	     * provided parameter object. The value will be URI encoded.
	     *
	     * @param {string} template a URL template
	     * @param {object} params an object whose properties should serve as template variables
	     * @returns {string} the URL
	     */

	  }], [{
	    key: "resolveTemplateUrl",
	    value: function resolveTemplateUrl(template, params) {
	      return template.replace(/\{([^}]+)\}/g, function (match, variableName) {
	        var variableValue = params[variableName];
	        return variableValue !== undefined ? encodeURIComponent(variableValue) : "";
	      });
	    }
	  }]);

	  return UrlHelper;
	}();

	var LocationIdsKey$1 = "locationIds";
	var SourceIdsKey$1 = "sourceIds";
	/**
	 * Create a LocationUrlHelperMixin class.
	 *
	 * @exports net
	 * @param {module:net~UrlHelper} superclass the UrlHelper class to mix onto
	 * @return {module:net~LocationUrlHelperMixin} the mixin class
	 */

	var LocationUrlHelperMixin = function LocationUrlHelperMixin(superclass) {
	  return (
	    /*#__PURE__*/

	    /**
	     * A mixin class that adds support for SolarLocation properties to a {@link module:net~UrlHelper}.
	     *
	     * @mixin
	     * @alias module:net~LocationUrlHelperMixin
	     */
	    function (_superclass) {
	      _inherits(_class, _superclass);

	      var _super = _createSuper(_class);

	      function _class() {
	        _classCallCheck(this, _class);

	        return _super.apply(this, arguments);
	      }

	      _createClass(_class, [{
	        key: "locationId",
	        get:
	        /**
	         * The first available location ID from the `locationIds` property.
	         * Setting this replaces any existing location IDs with an array of just that value.
	         * @type {number}
	         */
	        function get() {
	          var locationIds = this.locationIds;
	          return Array.isArray(locationIds) && locationIds.length > 0 ? locationIds[0] : null;
	        },
	        set: function set(locationId) {
	          this.parameter(LocationIdsKey$1, locationId ? [locationId] : null);
	        }
	        /**
	         * An array of location IDs, set on the `locationIds` parameter
	         * @type {number[]}
	         */

	      }, {
	        key: "locationIds",
	        get: function get() {
	          return this.parameter(LocationIdsKey$1);
	        },
	        set: function set(locationIds) {
	          this.parameter(LocationIdsKey$1, locationIds);
	        }
	        /**
	         * The first available source ID from the `sourceIds` property.
	         * Setting this replaces any existing location IDs with an array of just that value.
	         * @type {string}
	         */

	      }, {
	        key: "sourceId",
	        get: function get() {
	          var sourceIds = this.sourceIds;
	          return Array.isArray(sourceIds) && sourceIds.length > 0 ? sourceIds[0] : null;
	        },
	        set: function set(sourceId) {
	          this.parameter(SourceIdsKey$1, sourceId ? [sourceId] : sourceId);
	        }
	        /**
	         * An array of source IDs, set on the `sourceIds` parameter
	         * @type {string[]}
	         */

	      }, {
	        key: "sourceIds",
	        get: function get() {
	          return this.parameter(SourceIdsKey$1);
	        },
	        set: function set(sourceIds) {
	          this.parameter(SourceIdsKey$1, sourceIds);
	        }
	        /**
	         * Generate a URL to find locations based on a search criteria.
	         *
	         * @param {module:domain~Location} filter the search criteria
	         * @param {module:domain~SortDescriptor[]} [sorts] optional sort settings to use
	         * @param {module:domain~Pagination} [pagination] optional pagination settings to use
	         * @returns {string} the generated URL
	         */

	      }, {
	        key: "findLocationsUrl",
	        value: function findLocationsUrl(filter, sorts, pagination) {
	          return this.baseUrl() + "/location?" + filter.toUriEncodingWithSorting(sorts, pagination);
	        }
	      }]);

	      return _class;
	    }(superclass)
	  );
	};

	/**
	 * The SolarQuery default path.
	 * @type {string}
	 * @alias module:net~SolarQueryDefaultPath
	 */
	var SolarQueryDefaultPath = "/solarquery";
	/**
	 * The {@link module:net~UrlHelper#parameters} key for the SolarQuery path.
	 * @type {string}
	 * @alias module:net~SolarQueryPathKey
	 */

	var SolarQueryPathKey = "solarQueryPath";
	/**
	 * The SolarQuery REST API path.
	 * @type {string}
	 * @alias module:net~SolarQueryApiPathV1
	 */

	var SolarQueryApiPathV1 = "/api/v1";
	/**
	 * The {@link module:net~UrlHelper#parameters} key that holds a `boolean` flag to
	 * use the public path scheme (`/pub`) when constructing URLs.
	 * @type {string}
	 * @alias module:net~SolarQueryPublicPathKey
	 */

	var SolarQueryPublicPathKey = "publicQuery";
	/**
	 * Create a QueryUrlHelperMixin class.
	 *
	 * @exports net
	 * @param {module:net~UrlHelper} superclass the UrlHelper class to mix onto
	 * @return {module:net~QueryUrlHelperMixin} the mixin class
	 */

	var QueryUrlHelperMixin = function QueryUrlHelperMixin(superclass) {
	  return (
	    /*#__PURE__*/

	    /**
	     * A mixin class that adds SolarQuery specific support to {@link module:net~UrlHelper}.
	     *
	     * @mixin
	     * @alias module:net~QueryUrlHelperMixin
	     */
	    function (_superclass) {
	      _inherits(_class, _superclass);

	      var _super = _createSuper(_class);

	      function _class() {
	        _classCallCheck(this, _class);

	        return _super.apply(this, arguments);
	      }

	      _createClass(_class, [{
	        key: "publicQuery",
	        get:
	        /**
	         * Flag to set the `publicQuery` environment parameter.
	         * @type {boolean}
	         */
	        function get() {
	          return !!this.env(SolarQueryPublicPathKey);
	        },
	        set: function set(value) {
	          this.env(SolarQueryPublicPathKey, !!value);
	        }
	        /**
	         * Get the base URL to the SolarQuery v1 REST API.
	         *
	         * The returned URL uses the configured environment to resolve
	         * the `hostUrl`, the `solarQueryPath` context path,
	         * and the `publicQuery` boolean flag. If the context path is not
	         * available, it will default to `/solarquery`.
	         *
	         * @returns {string} the base URL to SolarQuery
	         */

	      }, {
	        key: "baseUrl",
	        value: function baseUrl() {
	          var path = this.env(SolarQueryPathKey) || SolarQueryDefaultPath;
	          var isPubPath = this.publicQuery;
	          return this.hostUrl() + path + SolarQueryApiPathV1 + (isPubPath ? "/pub" : "/sec");
	        }
	      }]);

	      return _class;
	    }(superclass)
	  );
	};

	/**
	 * Create a LocationDatumMetadataUrlHelperMixin class.
	 *
	 * @exports net
	 * @param {module:net~UrlHelper} superclass the UrlHelper class to mix onto
	 * @return {module:net~LocationDatumMetadataUrlHelperMixin} the mixin class
	 */

	var LocationDatumMetadataUrlHelperMixin = function LocationDatumMetadataUrlHelperMixin(superclass) {
	  return (
	    /*#__PURE__*/

	    /**
	     * A mixin class that adds SolarNode datum metadata support to {@link module:net~UrlHelper}.
	     *
	     * <p>Location datum metadata is metadata associated with a specific location and source, i.e.
	     * a `locationId` and a `sourceId`.
	     *
	     * @mixin
	     * @alias module:net~LocationDatumMetadataUrlHelperMixin
	     */
	    function (_superclass) {
	      _inherits(_class, _superclass);

	      var _super = _createSuper(_class);

	      function _class() {
	        _classCallCheck(this, _class);

	        return _super.apply(this, arguments);
	      }

	      _createClass(_class, [{
	        key: "baseLocationDatumMetadataUrl",
	        value:
	        /**
	         * Get a base URL for location datum metadata operations using a specific location ID.
	         *
	         * @param {number} [locationId] a specific location ID to use; if not provided the `locationId` property of this class will be used
	         * @returns {string} the base URL
	         * @private
	         */
	        function baseLocationDatumMetadataUrl(locationId) {
	          return this.baseUrl() + "/location/meta/" + (locationId || this.locationId);
	        }
	      }, {
	        key: "locationDatumMetadataUrlWithSource",
	        value: function locationDatumMetadataUrlWithSource(locationId, sourceId) {
	          var result = this.baseLocationDatumMetadataUrl(locationId);
	          var source = sourceId || this.sourceId;

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
	         * @param {number} [locationId] a specific location ID to use; if not provided the `locationId` property of this class will be used
	         * @param {string} [sourceId] a specific source ID to use;
	         *                            if not provided the `sourceId` property of this class will be used;
	         *                            if `null` then ignore any `sourceId` property of this class
	         * @returns {string} the URL
	         */

	      }, {
	        key: "viewLocationDatumMetadataUrl",
	        value: function viewLocationDatumMetadataUrl(locationId, sourceId) {
	          return this.locationDatumMetadataUrlWithSource(locationId, sourceId);
	        }
	        /**
	         * Generate a URL for adding (merging) datum metadata via a `POST` request.
	         *
	         * @param {number} [locationId] a specific location ID to use; if not provided the `locationId` property of this class will be used
	         * @param {string} [sourceId] a specific source ID to use; if not provided the `sourceId` property of this class will be used
	         * @returns {string} the URL
	         */

	      }, {
	        key: "addLocationDatumMetadataUrl",
	        value: function addLocationDatumMetadataUrl(locationId, sourceId) {
	          return this.locationDatumMetadataUrlWithSource(locationId, sourceId);
	        }
	        /**
	         * Generate a URL for setting datum metadata via a `PUT` request.
	         *
	         * @param {number} [locationId] a specific location ID to use; if not provided the `locationId` property of this class will be used
	         * @param {string} [sourceId] a specific source ID to use; if not provided the `sourceId` property of this class will be used
	         * @returns {string} the URL
	         */

	      }, {
	        key: "replaceLocationDatumMetadataUrl",
	        value: function replaceLocationDatumMetadataUrl(locationId, sourceId) {
	          return this.locationDatumMetadataUrlWithSource(locationId, sourceId);
	        }
	        /**
	         * Generate a URL for deleting datum metadata via a `DELETE` request.
	         *
	         * @param {number} [locationId] a specific location ID to use; if not provided the `locationId` property of this class will be used
	         * @param {string} [sourceId] a specific source ID to use; if not provided the `sourceId` property of this class will be used
	         * @returns {string} the URL
	         */

	      }, {
	        key: "deleteLocationDatumMetadataUrl",
	        value: function deleteLocationDatumMetadataUrl(locationId, sourceId) {
	          return this.locationDatumMetadataUrlWithSource(locationId, sourceId);
	        }
	        /**
	         * Generate a URL for searching for location metadata.
	         *
	         * @param {module:domain~DatumFilter} [filter] a search filter; the `locationIds`, `sourceIds`, `tags`,
	         *                                    `query`, and `location` properties are supported
	         * @param {module:domain~SortDescriptor[]} [sorts] optional sort settings to use
	         * @param {module:domain~Pagination} [pagination] optional pagination settings to use
	         * @returns {string} the URL
	         */

	      }, {
	        key: "findLocationDatumMetadataUrl",
	        value: function findLocationDatumMetadataUrl(filter, sorts, pagination) {
	          var result = this.baseUrl() + "/location/meta";
	          var params = filter.toUriEncodingWithSorting(sorts, pagination);

	          if (params.length > 0) {
	            result += "?" + params;
	          }

	          return result;
	        }
	      }]);

	      return _class;
	    }(superclass)
	  );
	};
	/**
	 * A concrete {@link module:net~UrlHelper} with the {@link module:net~LocationDatumMetadataUrlHelperMixin},
	 * {@link module:net~QueryUrlHelperMixin}, and {@link module:net~LocationUrlHelperMixin} mixins.
	 *
	 * @mixes module:net~LocationDatumMetadataUrlHelperMixin
	 * @mixes module:net~QueryUrlHelperMixin
	 * @mixes module:net~LocationUrlHelperMixin
	 * @extends module:net~UrlHelper
	 * @alias module:net~LocationDatumMetadataUrlHelper
	 */


	var LocationDatumMetadataUrlHelper = /*#__PURE__*/function (_LocationDatumMetadat) {
	  _inherits(LocationDatumMetadataUrlHelper, _LocationDatumMetadat);

	  var _super2 = _createSuper(LocationDatumMetadataUrlHelper);

	  function LocationDatumMetadataUrlHelper() {
	    _classCallCheck(this, LocationDatumMetadataUrlHelper);

	    return _super2.apply(this, arguments);
	  }

	  return LocationDatumMetadataUrlHelper;
	}(LocationDatumMetadataUrlHelperMixin(QueryUrlHelperMixin(LocationUrlHelperMixin(UrlHelper))));

	/**
	 * Create a LocationDatumUrlHelperMixin class.
	 *
	 * @exports net
	 * @param {module:net~UrlHelper} superclass the UrlHelper class to mix onto
	 * @return {module:net~LocationDatumUrlHelperMixin} the mixin class
	 */

	var LocationDatumUrlHelperMixin = function LocationDatumUrlHelperMixin(superclass) {
	  return (
	    /*#__PURE__*/

	    /**
	     * A mixin class that adds SolarLocation datum query support to {@link module:net~UrlHelper}.
	     *
	     * <p>This mixin is commonly mixed with the {@link module:net~QueryUrlHelperMixin} to pick
	     * up support for the SolarQuery base URL.</p>
	     *
	     * <p>This mixin is commonly mixed with the {@link module:net~LocationUrlHelperMixin} to
	     * pick up support for `locationId` and `sourceId` properties.</p>
	     *
	     * @mixin
	     * @alias module:net~LocationDatumUrlHelperMixin
	     */
	    function (_superclass) {
	      _inherits(_class, _superclass);

	      var _super = _createSuper(_class);

	      function _class() {
	        _classCallCheck(this, _class);

	        return _super.apply(this, arguments);
	      }

	      _createClass(_class, [{
	        key: "reportableIntervalUrl",
	        value:
	        /**
	         * Generate a URL for the "reportable interval" for a location, optionally limited to a specific source ID.
	         *
	         * If no source IDs are provided, then the reportable interval query will return an interval for
	         * all available sources.
	         *
	         * @param {number} [locationId] a specific location ID to use; if not provided the `locationId` property of this class will be used
	         * @param {string} [sourceId] a specific source ID to limit query to;
	         *                 if not provided the `sourceId` property of this class will be used;
	         *                 if `null` the `sourceId` property of this class will be ignored
	         * @returns {string} the URL
	         */
	        function reportableIntervalUrl(locationId, sourceId) {
	          var url = this.baseUrl() + "/location/datum/interval?locationId=" + (locationId || this.locationId);
	          var source = sourceId || this.sourceId;

	          if (sourceId !== null && source) {
	            url += "&sourceId=" + encodeURIComponent(source);
	          }

	          return url;
	        }
	        /**
	         * Generate a URL for finding the available source IDs for a location or metadata filter.
	         *
	         * @param {number} [locationId] a specific location ID to use; if not provided the `locationId`
	         *                              property of this class will be used
	         * @param {Date} [startDate] a start date to limit the search to
	         * @param {Date} [endDate] an end date to limit the search to
	         * @returns {string} the URL
	         */

	      }, {
	        key: "availableSourcesUrl",
	        value: function availableSourcesUrl(locationId, startDate, endDate) {
	          var result = this.baseUrl() + "/location/datum/sources?locationId=" + (locationId || this.locationId);

	          if (startDate instanceof Date) {
	            result += "&start=" + encodeURIComponent(dateTimeUrlFormat(startDate));
	          }

	          if (endDate instanceof Date) {
	            result += "&end=" + encodeURIComponent(dateTimeUrlFormat(endDate));
	          }

	          return result;
	        }
	        /**
	         * Generate a URL for querying for location datum, in either raw or aggregate form.
	         *
	         * If the `datumFilter` has an `aggregate` value set, then aggregate results will be
	         * returned by SolarNet.
	         *
	         * @param {module:domain~DatumFilter} datumFilter the search criteria
	         * @param {module:domain~SortDescriptor[]} [sorts] optional sort settings to use
	         * @param {module:domain~Pagination} [pagination] optional pagination settings to use
	         * @returns {string} the URL
	         */

	      }, {
	        key: "listDatumUrl",
	        value: function listDatumUrl(datumFilter, sorts, pagination) {
	          var result = this.baseUrl() + "/location/datum/list";
	          var params = datumFilter ? datumFilter.toUriEncodingWithSorting(sorts, pagination) : "";

	          if (params.length > 0) {
	            result += "?" + params;
	          }

	          return result;
	        }
	        /**
	         * Generate a URL for querying for the most recent datum.
	         *
	         * @param {module:domain~DatumFilter} datumFilter the search criteria
	         * @param {module:domain~SortDescriptor[]} [sorts] optional sort settings to use
	         * @param {module:domain~Pagination} [pagination] optional pagination settings to use
	         * @returns {string} the URL
	         */

	      }, {
	        key: "mostRecentDatumUrl",
	        value: function mostRecentDatumUrl(datumFilter, sorts, pagination) {
	          var result = this.baseUrl() + "/location/datum/mostRecent";
	          var params = datumFilter ? datumFilter.toUriEncodingWithSorting(sorts, pagination) : "";

	          if (params.length > 0) {
	            result += "?" + params;
	          }

	          return result;
	        }
	      }]);

	      return _class;
	    }(superclass)
	  );
	};
	/**
	 * A concrete {@link module:net~UrlHelper} with the {@link module:net~LocationDatumUrlHelperMixin},
	 * {@link module:net~QueryUrlHelperMixin}, and {@link module:net~LocationUrlHelperMixin} mixins.
	 *
	 * @mixes module:net~LocationDatumUrlHelperMixin
	 * @mixes module:net~QueryUrlHelperMixin
	 * @mixes module:net~LocationUrlHelperMixin
	 * @extends module:net~UrlHelper
	 * @alias module:net~LocationDatumUrlHelper
	 */


	var LocationDatumUrlHelper = /*#__PURE__*/function (_LocationDatumUrlHelp) {
	  _inherits(LocationDatumUrlHelper, _LocationDatumUrlHelp);

	  var _super2 = _createSuper(LocationDatumUrlHelper);

	  function LocationDatumUrlHelper() {
	    _classCallCheck(this, LocationDatumUrlHelper);

	    return _super2.apply(this, arguments);
	  }

	  return LocationDatumUrlHelper;
	}(LocationDatumUrlHelperMixin(QueryUrlHelperMixin(LocationUrlHelperMixin(UrlHelper))));

	var NodeIdsKey$1 = "nodeIds";
	var SourceIdsKey$2 = "sourceIds";
	/**
	 * Create a NodeUrlHelperMixin class.
	 *
	 * @exports net
	 * @param {module:net~UrlHelper} superclass the UrlHelper class to mix onto
	 * @return {module:net~NodeUrlHelperMixin} the mixin class
	 */

	var NodeUrlHelperMixin = function NodeUrlHelperMixin(superclass) {
	  return (
	    /*#__PURE__*/

	    /**
	     * A mixin class that adds support for SolarNode properties to a {@link module:net~UrlHelper}.
	     *
	     * @mixin
	     * @alias module:net~NodeUrlHelperMixin
	     */
	    function (_superclass) {
	      _inherits(_class, _superclass);

	      var _super = _createSuper(_class);

	      function _class() {
	        _classCallCheck(this, _class);

	        return _super.apply(this, arguments);
	      }

	      _createClass(_class, [{
	        key: "nodeId",
	        get:
	        /**
	         * The first available node ID from the `nodeIds` property.
	         * Setting this replaces any existing node IDs with an array of just that value.
	         * @type {number}
	         */
	        function get() {
	          var nodeIds = this.nodeIds;
	          return Array.isArray(nodeIds) && nodeIds.length > 0 ? nodeIds[0] : null;
	        },
	        set: function set(nodeId) {
	          this.parameter(NodeIdsKey$1, nodeId ? [nodeId] : null);
	        }
	        /**
	         * An array of node IDs, set on the `nodeIds` parameter
	         * @type {number[]}
	         */

	      }, {
	        key: "nodeIds",
	        get: function get() {
	          return this.parameter(NodeIdsKey$1);
	        },
	        set: function set(nodeIds) {
	          this.parameter(NodeIdsKey$1, nodeIds);
	        }
	        /**
	         * The first available source ID from the `sourceIds` property.
	         * Setting this replaces any existing node IDs with an array of just that value.
	         * @type {string}
	         */

	      }, {
	        key: "sourceId",
	        get: function get() {
	          var sourceIds = this.sourceIds;
	          return Array.isArray(sourceIds) && sourceIds.length > 0 ? sourceIds[0] : null;
	        },
	        set: function set(sourceId) {
	          this.parameter(SourceIdsKey$2, sourceId ? [sourceId] : sourceId);
	        }
	        /**
	         * An array of source IDs, set on the `sourceIds` parameter
	         * @type {string[]}
	         */

	      }, {
	        key: "sourceIds",
	        get: function get() {
	          return this.parameter(SourceIdsKey$2);
	        },
	        set: function set(sourceIds) {
	          this.parameter(SourceIdsKey$2, sourceIds);
	        }
	        /**
	         * Generate a URL to get a list of all active node IDs available to the requesting user.
	         *
	         * **Note** this method only works against the `/sec` version of the API endpoint.
	         *
	         * @return {string} the URL to access the node IDs the requesting user has access to
	         */

	      }, {
	        key: "listAllNodeIdsUrl",
	        value: function listAllNodeIdsUrl() {
	          return this.baseUrl() + "/nodes";
	        }
	      }]);

	      return _class;
	    }(superclass)
	  );
	};

	/**
	 * Create a NodeDatumUrlHelperMixin class.
	 *
	 * @exports net
	 * @param {module:net~UrlHelper} superclass the UrlHelper class to mix onto
	 * @return {module:net~NodeDatumMetadataUrlHelperMixin} the mixin class
	 */

	var NodeDatumMetadataUrlHelperMixin = function NodeDatumMetadataUrlHelperMixin(superclass) {
	  return (
	    /*#__PURE__*/

	    /**
	     * A mixin class that adds SolarNode datum metadata support to {@link module:net~UrlHelper}.
	     *
	     * <p>Datum metadata is metadata associated with a specific node and source, i.e.
	     * a <code>nodeId</code> and a <code>sourceId</code>.
	     *
	     * @mixin
	     * @alias module:net~NodeDatumMetadataUrlHelperMixin
	     */
	    function (_superclass) {
	      _inherits(_class, _superclass);

	      var _super = _createSuper(_class);

	      function _class() {
	        _classCallCheck(this, _class);

	        return _super.apply(this, arguments);
	      }

	      _createClass(_class, [{
	        key: "baseNodeDatumMetadataUrl",
	        value:
	        /**
	         * Get a base URL for datum metadata operations using a specific node ID.
	         *
	         * @param {number} [nodeId] a specific node ID to use; if not provided the <code>nodeId</code> property of this class will be used
	         * @returns {string} the base URL
	         * @private
	         */
	        function baseNodeDatumMetadataUrl(nodeId) {
	          return this.baseUrl() + "/datum/meta/" + (nodeId || this.nodeId);
	        }
	      }, {
	        key: "nodeDatumMetadataUrlWithSource",
	        value: function nodeDatumMetadataUrlWithSource(nodeId, sourceId) {
	          var result = this.baseNodeDatumMetadataUrl(nodeId);
	          var source = sourceId || this.sourceId;

	          if (sourceId !== null && source) {
	            result += "?sourceId=" + encodeURIComponent(source);
	          }

	          return result;
	        }
	        /**
	         * Generate a URL for viewing datum metadata.
	         *
	         * If no <code>sourceId</code> is provided, then the API will return all available datum metadata for all sources.
	         *
	         * @param {number} [nodeId] a specific node ID to use; if not provided the <code>nodeId</code> property of this class will be used
	         * @param {string} [sourceId] a specific source ID to use;
	         *                            if not provided the <code>sourceId</code> property of this class will be used;
	         *                            if <code>null</code> then ignore any <code>sourceId</code> property of this class
	         * @returns {string} the URL
	         */

	      }, {
	        key: "viewNodeDatumMetadataUrl",
	        value: function viewNodeDatumMetadataUrl(nodeId, sourceId) {
	          return this.nodeDatumMetadataUrlWithSource(nodeId, sourceId);
	        }
	        /**
	         * Generate a URL for adding (merging) datum metadata via a <code>POST</code> request.
	         *
	         * @param {number} [nodeId] a specific node ID to use; if not provided the <code>nodeId</code> property of this class will be used
	         * @param {string} [sourceId] a specific source ID to use; if not provided the <code>sourceId</code> property of this class will be used
	         * @returns {string} the URL
	         */

	      }, {
	        key: "addNodeDatumMetadataUrl",
	        value: function addNodeDatumMetadataUrl(nodeId, sourceId) {
	          return this.nodeDatumMetadataUrlWithSource(nodeId, sourceId);
	        }
	        /**
	         * Generate a URL for setting datum metadata via a <code>PUT</code> request.
	         *
	         * @param {number} [nodeId] a specific node ID to use; if not provided the <code>nodeId</code> property of this class will be used
	         * @param {string} [sourceId] a specific source ID to use; if not provided the <code>sourceId</code> property of this class will be used
	         * @returns {string} the URL
	         */

	      }, {
	        key: "replaceNodeDatumMetadataUrl",
	        value: function replaceNodeDatumMetadataUrl(nodeId, sourceId) {
	          return this.nodeDatumMetadataUrlWithSource(nodeId, sourceId);
	        }
	        /**
	         * Generate a URL for deleting datum metadata via a <code>DELETE</code> request.
	         *
	         * @param {number} [nodeId] a specific node ID to use; if not provided the <code>nodeId</code> property of this class will be used
	         * @param {string} [sourceId] a specific source ID to use; if not provided the <code>sourceId</code> property of this class will be used
	         * @returns {string} the URL
	         */

	      }, {
	        key: "deleteNodeDatumMetadataUrl",
	        value: function deleteNodeDatumMetadataUrl(nodeId, sourceId) {
	          return this.nodeDatumMetadataUrlWithSource(nodeId, sourceId);
	        }
	        /**
	         * Generate a URL for searching for datum metadata.
	         *
	         * @param {number} [nodeId] a specific node ID to use; if not provided the <code>nodeId</code> property of this class will be used
	         * @param {string} [sourceId] a specific source ID to use;
	         *                            if not provided the <code>sourceId</code> property of this class will be used;
	         *                            if <code>null</code> then ignore any <code>sourceId</code> property of this class
	         * @param {SortDescriptor[]} [sorts] optional sort settings to use
	         * @param {module:domain~Pagination} [pagination] optional pagination settings to use
	         * @returns {string} the URL
	         */

	      }, {
	        key: "findNodeDatumMetadataUrl",
	        value: function findNodeDatumMetadataUrl(nodeId, sourceId, sorts, pagination) {
	          var result = this.baseNodeDatumMetadataUrl(nodeId);
	          var params = "";
	          var source = sourceId || this.sourceId;

	          if (sourceId !== null && source) {
	            params += "sourceId=" + encodeURIComponent(source);
	          }

	          if (Array.isArray(sorts)) {
	            sorts.forEach(function (sort, i) {
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
	      }, {
	        key: "userMetadataUrl",
	        value: function userMetadataUrl(userId) {
	          var result = this.baseUrl() + "/users/meta";
	          var userParam = userId || this.userId;

	          if (Array.isArray(userParam)) {
	            if (userParam.length > 0) {
	              userParam = userParam[0];
	            } else {
	              userParam = null;
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
	         * Note this URL is similar to {@link module:net~UserMetadataUrlHelperMixin#viewUserMetadataUrl}
	         * but is for the read-only SolarQuery API, rather than the read-write SolarUser API.
	         *
	         * @param {number|null} [userId] a specific user ID;
	         *                               if not provided the `userId` property of this class will be used
	         * @returns {string} the URL
	         */

	      }, {
	        key: "viewUserMetadataUrl",
	        value: function viewUserMetadataUrl(userId) {
	          return this.userMetadataUrl(userId);
	        }
	      }]);

	      return _class;
	    }(superclass)
	  );
	};
	/**
	 * A concrete {@link module:net~UrlHelper} with the {@link module:net~NodeDatumMetadataUrlHelperMixin},
	 * {@link module:net~QueryUrlHelperMixin}, and {@link module:net~NodeUrlHelperMixin} mixins.
	 *
	 * @mixes module:net~NodeDatumMetadataUrlHelperMixin
	 * @mixes module:net~QueryUrlHelperMixin
	 * @mixes module:net~NodeUrlHelperMixin
	 * @extends module:net~UrlHelper
	 * @alias module:net~NodeDatumMetadataUrlHelper
	 */


	var NodeDatumMetadataUrlHelper = /*#__PURE__*/function (_NodeDatumMetadataUrl) {
	  _inherits(NodeDatumMetadataUrlHelper, _NodeDatumMetadataUrl);

	  var _super2 = _createSuper(NodeDatumMetadataUrlHelper);

	  function NodeDatumMetadataUrlHelper() {
	    _classCallCheck(this, NodeDatumMetadataUrlHelper);

	    return _super2.apply(this, arguments);
	  }

	  return NodeDatumMetadataUrlHelper;
	}(NodeDatumMetadataUrlHelperMixin(QueryUrlHelperMixin(NodeUrlHelperMixin(UrlHelper))));

	/**
	 * Create a NodeDatumUrlHelperMixin class.
	 *
	 * @exports net
	 * @param {module:net~UrlHelper} superclass the UrlHelper class to mix onto
	 * @return {module:net~NodeDatumUrlHelperMixin} the mixin class
	 */

	var NodeDatumUrlHelperMixin = function NodeDatumUrlHelperMixin(superclass) {
	  return (
	    /*#__PURE__*/

	    /**
	     * A mixin class that adds SolarNode datum query support to {@link module:net~UrlHelper}.
	     *
	     * @mixin
	     * @alias module:net~NodeDatumUrlHelperMixin
	     */
	    function (_superclass) {
	      _inherits(_class, _superclass);

	      var _super = _createSuper(_class);

	      function _class() {
	        _classCallCheck(this, _class);

	        return _super.apply(this, arguments);
	      }

	      _createClass(_class, [{
	        key: "reportableIntervalUrl",
	        value:
	        /**
	         * Generate a URL for the "reportable interval" for a node, optionally limited to a specific set of source IDs.
	         *
	         * If no source IDs are provided, then the reportable interval query will return an interval for
	         * all available sources.
	         *
	         * @param {number} [nodeId] a specific node ID to use; if not provided the `nodeId` property of this class will be used
	         * @param {string[]} [sourceIds] an array of source IDs to limit query to; if not provided the `sourceIds` property of this class will be used
	         * @returns {string} the URL
	         */
	        function reportableIntervalUrl(nodeId, sourceIds) {
	          var url = this.baseUrl() + "/range/interval?nodeId=" + (nodeId || this.nodeId);
	          var sources = sourceIds || this.sourceIds;

	          if (Array.isArray(sources) && sources.length > 0) {
	            url += "&sourceIds=" + sources.map(function (e) {
	              return encodeURIComponent(e);
	            }).join(",");
	          }

	          return url;
	        }
	        /**
	         * Generate a URL for finding the available source IDs for a node or metadata filter.
	         *
	         * @param {module:domain~DatumFilter} datumFilter the search criteria, which can define `nodeId`, `startDate`, `endDate`,
	         *                                                and `metadataFilter` properties to limit the results to; if `nodeId` not
	         *                                                provided the `nodeIds` property of this class will be used
	         * @param {boolean} withNodeIds if `true` then force the response to include node IDs along with source IDs, instead of
	         *                              just source IDs
	         * @returns {string} the URL
	         */

	      }, {
	        key: "availableSourcesUrl",
	        value: function availableSourcesUrl(datumFilter, withNodeIds) {
	          var filter = datumFilter ? new DatumFilter(datumFilter) : this.datumFilter();

	          if (withNodeIds !== undefined) {
	            filter.prop("withNodeIds", !!withNodeIds);
	          }

	          var result = this.baseUrl() + "/range/sources";
	          var params = filter.toUriEncoding();

	          if (params.length > 0) {
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
	         * @param {module:domain~DatumFilter} datumFilter the search criteria
	         * @param {module:domain~SortDescriptor[]} [sorts] optional sort settings to use
	         * @param {module:domain~Pagination} [pagination] optional pagination settings to use
	         * @returns {string} the URL
	         */

	      }, {
	        key: "listDatumUrl",
	        value: function listDatumUrl(datumFilter, sorts, pagination) {
	          var result = this.baseUrl() + "/datum/list";
	          var filter = datumFilter || this.datumFilter();
	          var params = filter.toUriEncodingWithSorting(sorts, pagination);

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
	         * {@link module:domain~DatumFilter#startDate} or
	         * {@link module:domain~DatumFilter#endDate} value should be provided.
	         *
	         * @param {module:domain~DatumFilter} datumFilter the search criteria
	         * @param {module:domain~DatumReadingType} readingType the type of reading to find
	         * @param {string} [tolerance] optional query tolerance to use
	         * @param {module:domain~SortDescriptor[]} [sorts] optional sort settings to use
	         * @param {module:domain~Pagination} [pagination] optional pagination settings to use
	         * @returns {string} the URL
	         * @see https://github.com/SolarNetwork/solarnetwork/wiki/SolarQuery-API#datum-reading
	         */

	      }, {
	        key: "datumReadingUrl",
	        value: function datumReadingUrl(datumFilter, readingType, tolerance, sorts, pagination) {
	          var result = this.baseUrl() + "/datum/reading";
	          var filter = new DatumFilter(datumFilter) || this.datumFilter();
	          filter.prop("readingType", readingType.name);

	          if (tolerance) {
	            filter.prop("tolerance", tolerance);
	          }

	          var params = filter.toUriEncodingWithSorting(sorts, pagination);

	          if (params.length > 0) {
	            result += "?" + params;
	          }

	          return result;
	        }
	        /**
	         * Get a new {@link module:domain~DatumFilter} configured with properties of this instance.
	         *
	         * This will configure the following properties:
	         *
	         *  * `nodeIds`
	         *  * `sourceIds`
	         *
	         * @returns {module:domain~DatumFilter} the filter
	         */

	      }, {
	        key: "datumFilter",
	        value: function datumFilter() {
	          var filter = new DatumFilter();
	          var v;
	          v = this.nodeIds;

	          if (v) {
	            filter.nodeIds = v;
	          }

	          v = this.sourceIds;

	          if (v) {
	            filter.sourceIds = v;
	          }

	          return filter;
	        }
	        /**
	         * Generate a URL for querying for the most recent datum.
	         *
	         * @param {module:domain~DatumFilter} datumFilter the search criteria
	         * @param {module:domain~SortDescriptor[]} [sorts] optional sort settings to use
	         * @param {module:domain~Pagination} [pagination] optional pagination settings to use
	         * @returns {string} the URL
	         */

	      }, {
	        key: "mostRecentDatumUrl",
	        value: function mostRecentDatumUrl(datumFilter, sorts, pagination) {
	          var result = this.baseUrl() + "/datum/mostRecent";
	          var filter = datumFilter || this.datumFilter();
	          var params = filter.toUriEncodingWithSorting(sorts, pagination);

	          if (params.length > 0) {
	            result += "?" + params;
	          }

	          return result;
	        }
	      }]);

	      return _class;
	    }(superclass)
	  );
	};
	/**
	 * A concrete {@link module:net~UrlHelper} with the {@link module:net~NodeDatumUrlHelperMixin},
	 * {@link module:net~QueryUrlHelperMixin}, and {@link module:net~NodeUrlHelperMixin} mixins.
	 *
	 * @mixes module:net~NodeDatumUrlHelperMixin
	 * @mixes module:net~QueryUrlHelperMixin
	 * @mixes module:net~NodeUrlHelperMixin
	 * @extends module:net~UrlHelper
	 * @alias module:net~NodeDatumUrlHelper
	 */


	var NodeDatumUrlHelper = /*#__PURE__*/function (_NodeDatumUrlHelperMi) {
	  _inherits(NodeDatumUrlHelper, _NodeDatumUrlHelperMi);

	  var _super2 = _createSuper(NodeDatumUrlHelper);

	  function NodeDatumUrlHelper() {
	    _classCallCheck(this, NodeDatumUrlHelper);

	    return _super2.apply(this, arguments);
	  }

	  return NodeDatumUrlHelper;
	}(NodeDatumUrlHelperMixin(QueryUrlHelperMixin(NodeUrlHelperMixin(UrlHelper))));

	/**
	 * The SolarUser default path.
	 * @type {string}
	 * @alias module:net~SolarUserDefaultPath
	 */
	var SolarUserDefaultPath = "/solaruser";
	/**
	 * The {@link module:net~UrlHelper} parameters key for the SolarUser path.
	 * @type {string}
	 * @alias module:net~SolarUserPathKey
	 */

	var SolarUserPathKey = "solarUserPath";
	/**
	 * The SolarUser REST API path.
	 * @type {string}
	 * @alias module:net~SolarUserApiPathV1
	 */

	var SolarUserApiPathV1 = "/api/v1/sec";
	var UserIdsKey$1 = "userIds";
	/**
	 * Create a UserUrlHelperMixin class.
	 *
	 * @exports net
	 * @param {module:net~UrlHelper} superclass the UrlHelper class to mix onto
	 * @return {module:net~UserUrlHelperMixin} the mixin class
	 */

	var UserUrlHelperMixin = function UserUrlHelperMixin(superclass) {
	  return (
	    /*#__PURE__*/

	    /**
	     * A mixin class that adds SolarUser specific support to {@link module:net~UrlHelper}.
	     *
	     * @mixin
	     * @alias module:net~UserUrlHelperMixin
	     */
	    function (_superclass) {
	      _inherits(_class, _superclass);

	      var _super = _createSuper(_class);

	      function _class() {
	        _classCallCheck(this, _class);

	        return _super.apply(this, arguments);
	      }

	      _createClass(_class, [{
	        key: "userId",
	        get:
	        /**
	         * Get the default user ID.
	         *
	         * This gets the first available user ID from the `userIds` property.
	         *
	         * @returns {number} the default user ID, or `null`
	         */
	        function get() {
	          var userIds = this.parameter(UserIdsKey$1);
	          return Array.isArray(userIds) && userIds.length > 0 ? userIds[0] : null;
	        }
	        /**
	         * Set the user ID.
	         *
	         * This will set the `userIds` property to a new array of just the given value.
	         *
	         * @param {number} userId the user ID to set
	         */
	        ,
	        set: function set(userId) {
	          this.parameter(UserIdsKey$1, [userId]);
	        }
	      }, {
	        key: "userIds",
	        get: function get() {
	          return this.parameter(UserIdsKey$1);
	        },
	        set: function set(userIds) {
	          this.parameter(UserIdsKey$1, userIds);
	        }
	        /**
	         * Get the base URL to the SolarUser v1 REST API.
	         *
	         * The returned URL uses the configured environment to resolve
	         * the `hostUrl` and a `solarUserPath` context path.
	         * If the context path is not available, it will default to
	         * `/solaruser`.
	         *
	         * @returns {string} the base URL to SolarUser
	         */

	      }, {
	        key: "baseUrl",
	        value: function baseUrl() {
	          var path = this.env(SolarUserPathKey) || SolarUserDefaultPath;
	          return _get(_getPrototypeOf(_class.prototype), "baseUrl", this).call(this) + path + SolarUserApiPathV1;
	        }
	        /**
	         * Generate a URL to get information about the requesting authenticated user.
	         *
	         * @return {string} the URL to view information about the authenticated user
	         */

	      }, {
	        key: "whoamiUrl",
	        value: function whoamiUrl() {
	          return this.baseUrl() + "/whoami";
	        }
	        /**
	         * Generate a URL to get a list of all active nodes for the user account.
	         *
	         * @return {string} the URL to access the user's active nodes
	         */

	      }, {
	        key: "viewNodesUrl",
	        value: function viewNodesUrl() {
	          return this.baseUrl() + "/nodes";
	        }
	        /**
	         * Generate a URL to get a list of all pending nodes for the user account.
	         *
	         * @return {string} the URL to access the user's pending nodes
	         */

	      }, {
	        key: "viewPendingNodesUrl",
	        value: function viewPendingNodesUrl() {
	          return this.baseUrl() + "/nodes/pending";
	        }
	        /**
	         * Generate a URL to get a list of all archived nodes for the user account.
	         *
	         * @return {string} the URL to access the user's archived nodes
	         */

	      }, {
	        key: "viewArchivedNodesUrl",
	        value: function viewArchivedNodesUrl() {
	          return this.baseUrl() + "/nodes/archived";
	        }
	        /**
	         * Generate a URL to update the archived status of a set of nodes via a `POST` request.
	         *
	         * @param {number|number[]|null} nodeId a specific node ID, or array of node IDs, to update; if not provided the
	         *                                      `nodeIds` property of this class will be used
	         * @param {boolean} archived `true` to mark the nodes as archived; `false` to un-mark
	         *                           and return to normal status
	         * @return {string} the URL to update the nodes archived status
	         */

	      }, {
	        key: "updateNodeArchivedStatusUrl",
	        value: function updateNodeArchivedStatusUrl(nodeId, archived) {
	          var nodeIds = Array.isArray(nodeId) ? nodeId : nodeId ? [nodeId] : this.nodeIds;
	          var result = this.baseUrl() + "/nodes/archived?nodeIds=" + nodeIds.join(",") + "&archived=" + (archived ? "true" : "false");
	          return result;
	        }
	        /**
	         * Generate a URL to get a Node Image Maker (NIM) session key.
	         *
	         * @return {string} the URL to obtain a NIM session key
	         */

	      }, {
	        key: "nimAuthorizeUrl",
	        value: function nimAuthorizeUrl() {
	          return this.baseUrl() + "/user/nim/authorize";
	        }
	      }]);

	      return _class;
	    }(superclass)
	  );
	};

	/**
	 * Create a NodeInstructionUrlHelperMixin class.
	 *
	 * @exports net
	 * @param {module:net~UrlHelper} superclass the UrlHelper class to mix onto
	 * @return {module:net~NodeInstructionUrlHelperMixin} the mixin class
	 */

	var NodeInstructionUrlHelperMixin = function NodeInstructionUrlHelperMixin(superclass) {
	  return (
	    /*#__PURE__*/

	    /**
	     * A mixin class that adds SolarNode instruction support to {@link module:net~UrlHelper}.
	     *
	     * @mixin
	     * @alias module:net~NodeInstructionUrlHelperMixin
	     */
	    function (_superclass) {
	      _inherits(_class, _superclass);

	      var _super = _createSuper(_class);

	      function _class() {
	        _classCallCheck(this, _class);

	        return _super.apply(this, arguments);
	      }

	      _createClass(_class, [{
	        key: "viewInstructionUrl",
	        value:
	        /**
	         * Generate a URL to get all details for a specific instruction.
	         *
	         * @param {number} instructionId the instruction ID to get
	         * @returns {string} the URL
	         */
	        function viewInstructionUrl(instructionId) {
	          return this.baseUrl() + "/instr/view?id=" + encodeURIComponent(instructionId);
	        }
	        /**
	         * Generate a URL for viewing active instructions.
	         *
	         * @param {number} [nodeId] a specific node ID to use; if not provided the <code>nodeId</code> property of this class will be used
	         * @returns {string} the URL
	         */

	      }, {
	        key: "viewActiveInstructionsUrl",
	        value: function viewActiveInstructionsUrl(nodeId) {
	          return this.baseUrl() + "/instr/viewActive?nodeId=" + (nodeId || this.nodeId);
	        }
	        /**
	         * Generate a URL for viewing pending instructions.
	         *
	         * @param {number} [nodeId] a specific node ID to use; if not provided the <code>nodeId</code> property of this class will be used
	         * @returns {string} the URL
	         */

	      }, {
	        key: "viewPendingInstructionsUrl",
	        value: function viewPendingInstructionsUrl(nodeId) {
	          return this.baseUrl() + "/instr/viewPending?nodeId=" + (nodeId || this.nodeId);
	        }
	        /**
	         * Generate a URL for changing the state of an instruction.
	         *
	         * @param {number} instructionId the instruction ID to update
	         * @param {InstructionState} state the instruction state to set
	         * @returns {string} the URL
	         * @see the {@link InstructionStates} enum for possible state values
	         */

	      }, {
	        key: "updateInstructionStateUrl",
	        value: function updateInstructionStateUrl(instructionId, state) {
	          return this.baseUrl() + "/instr/updateState?id=" + encodeURIComponent(instructionId) + "&state=" + encodeURIComponent(state.name);
	        }
	        /**
	         * Generate URL encoded query string for posting instruction parameters.
	         *
	         * @param {Object[]} [parameters] an array of parameter objects in the form `{name:n1, value:v1}`
	         * @returns {string} the URL encoded query string, or an empty string if `parameters` is empty
	         */

	      }, {
	        key: "urlEncodeInstructionParameters",
	        value: function urlEncodeInstructionParameters(parameters) {
	          var url = "",
	              i,
	              len;

	          if (Array.isArray(parameters)) {
	            for (i = 0, len = parameters.length; i < len; i += 1) {
	              if (url.length > 0) {
	                url += "&";
	              }

	              url += encodeURIComponent("parameters[" + i + "].name") + "=" + encodeURIComponent(parameters[i].name) + "&" + encodeURIComponent("parameters[" + i + "].value") + "=" + encodeURIComponent(parameters[i].value);
	            }
	          }

	          return url;
	        }
	        /**
	         * Generate a URL for posting an instruction request.
	         *
	         * @param {string} topic the instruction topic
	         * @param {Object[]} [parameters] an array of parameter objects in the form `{name:n1, value:v1}`
	         * @param {number} [nodeId] a specific node ID to use; if not provided the `nodeId` property of this class will be used
	         * @returns {string} the URL
	         */

	      }, {
	        key: "queueInstructionUrl",
	        value: function queueInstructionUrl(topic, parameters, nodeId) {
	          var url = this.baseUrl() + "/instr/add/" + encodeURIComponent(topic) + "?nodeId=" + (nodeId || this.nodeId);

	          if (Array.isArray(parameters) && parameters.length > 0) {
	            url += "&" + this.urlEncodeInstructionParameters(parameters);
	          }

	          return url;
	        }
	        /**
	         * Generate a URL for posting instruction requests for multiple nodes.
	         *
	         * @param {string} topic the instruction topic
	         * @param {Object[]} [parameters] an array of parameter objects in the form `{name:n1, value:v1}`
	         * @param {number[]} [nodeIds] a list of node IDs to use; if not provided the `nodeIds` property of this class will be used
	         * @returns {string} the URL
	         */

	      }, {
	        key: "queueInstructionsUrl",
	        value: function queueInstructionsUrl(topic, parameters, nodeIds) {
	          var url = this.baseUrl() + "/instr/add/" + encodeURIComponent(topic) + "?nodeIds=" + (Array.isArray(nodeIds) && nodeIds.length > 0 ? nodeIds.join(",") : Array.isArray(this.nodeIds) ? this.nodeIds.join(",") : "");

	          if (Array.isArray(parameters) && parameters.length > 0) {
	            url += "&" + this.urlEncodeInstructionParameters(parameters);
	          }

	          return url;
	        }
	        /**
	         * Create an instruction parameter suitable to passing to {@link NodeInstructionUrlHelperMixin#queueInstructionUrl}.
	         *
	         * @param {string} name the parameter name
	         * @param {*} value the parameter value
	         * @returns {object} with `name` and `value` properties
	         */

	      }], [{
	        key: "instructionParameter",
	        value: function instructionParameter(name, value) {
	          return {
	            name: name,
	            value: value
	          };
	        }
	      }]);

	      return _class;
	    }(superclass)
	  );
	};
	/**
	 * A concrete {@link UrlHelper} with the {@link module:net~NodeInstructionUrlHelperMixin},
	 * {@link module:net~UserUrlHelperMixin}, and {@link module:net~NodeUrlHelperMixin} mixins.
	 *
	 * @mixes module:net~NodeInstructionUrlHelperMixin
	 * @mixes module:net~UserUrlHelperMixin
	 * @mixes module:net~NodeUrlHelperMixin
	 * @extends module:net~UrlHelper
	 * @alias module:net~NodeInstructionUrlHelper
	 */


	var NodeInstructionUrlHelper = /*#__PURE__*/function (_NodeInstructionUrlHe) {
	  _inherits(NodeInstructionUrlHelper, _NodeInstructionUrlHe);

	  var _super2 = _createSuper(NodeInstructionUrlHelper);

	  function NodeInstructionUrlHelper() {
	    _classCallCheck(this, NodeInstructionUrlHelper);

	    return _super2.apply(this, arguments);
	  }

	  return NodeInstructionUrlHelper;
	}(NodeInstructionUrlHelperMixin(UserUrlHelperMixin(NodeUrlHelperMixin(UrlHelper))));
	/**
	 * The static {@link NodeInstructionUrlHelperMixin#instructionParameter} method so it can be imported directly.
	 *
	 * @alias module:net~instructionParameter
	 */


	var instructionParameter = NodeInstructionUrlHelper.instructionParameter;

	/**
	 * Create a NodeMetadataUrlHelperMixin class.
	 *
	 * @exports net
	 * @param {module:net~UrlHelper} superclass the UrlHelper class to mix onto
	 * @return {module:net~NodeMetadataUrlHelperMixin} the mixin class
	 */

	var NodeMetadataUrlHelperMixin = function NodeMetadataUrlHelperMixin(superclass) {
	  return (
	    /*#__PURE__*/

	    /**
	     * A mixin class that adds SolarNode metadata support to {@link module:net~UrlHelper}.
	     *
	     * @mixin
	     * @alias module:net~NodeMetadataUrlHelperMixin
	     */
	    function (_superclass) {
	      _inherits(_class, _superclass);

	      var _super = _createSuper(_class);

	      function _class() {
	        _classCallCheck(this, _class);

	        return _super.apply(this, arguments);
	      }

	      _createClass(_class, [{
	        key: "viewNodeMetadataUrl",
	        value:
	        /**
	         * Generate a URL for viewing the configured node's metadata.
	         *
	         * @param {number} [nodeId] a specific node ID to use; if not provided the `nodeId` property of this class will be used
	         * @returns {string} the URL
	         */
	        function viewNodeMetadataUrl(nodeId) {
	          return this.baseUrl() + "/nodes/meta/" + (nodeId || this.nodeId);
	        }
	        /**
	         * Generate a URL for adding metadata to a node via a `POST` request.
	         *
	         * @param {number} [nodeId] a specific node ID to use; if not provided the `nodeId` property of this class will be used
	         * @returns {string} the URL
	         */

	      }, {
	        key: "addNodeMetadataUrl",
	        value: function addNodeMetadataUrl(nodeId) {
	          return this.viewNodeMetadataUrl(nodeId);
	        }
	        /**
	         * Generate a URL for setting the metadata of a node via a `PUT` request.
	         *
	         * @param {number} [nodeId] a specific node ID to use; if not provided the `nodeId` property of this class will be used
	         * @returns {string} the URL
	         */

	      }, {
	        key: "replaceNodeMetadataUrl",
	        value: function replaceNodeMetadataUrl(nodeId) {
	          return this.viewNodeMetadataUrl(nodeId);
	        }
	        /**
	         * Generate a URL for deleting the metadata of a node via a `DELETE` request.
	         *
	         * @param {number} [nodeId] a specific node ID to use; if not provided the `nodeId` property of this class will be used
	         * @returns {string} the URL
	         */

	      }, {
	        key: "deleteNodeMetadataUrl",
	        value: function deleteNodeMetadataUrl(nodeId) {
	          return this.viewNodeMetadataUrl(nodeId);
	        }
	        /**
	         * Generate a URL for searching for node metadata.
	         *
	         * @param {number|number[]} [nodeId] a specific node ID, or array of node IDs, to use; if not provided the
	         *                                   `nodeIds` property of this class will be used, unless `null`
	         *                                   is passed in which case no node IDs will be added to the URL so that all available
	         *                                   node metadata objects will be returned
	         * @param {module:domain~SortDescriptor[]} [sorts] optional sort settings to use
	         * @param {module:domain~Pagination} [pagination] optional pagination settings to use
	         * @returns {string} the URL
	         */

	      }, {
	        key: "findNodeMetadataUrl",
	        value: function findNodeMetadataUrl(nodeId, sorts, pagination) {
	          var nodeIds = Array.isArray(nodeId) ? nodeId : nodeId ? [nodeId] : nodeId !== null ? this.nodeIds : undefined;
	          var result = this.baseUrl() + "/nodes/meta";
	          var params = "";

	          if (Array.isArray(nodeIds)) {
	            params += "nodeIds=" + nodeIds.join(",");
	          }

	          if (Array.isArray(sorts)) {
	            sorts.forEach(function (sort, i) {
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
	      }]);

	      return _class;
	    }(superclass)
	  );
	};
	/**
	 * A concrete {@link module:net~UrlHelper} with the {@link module:net~NodeMetadataUrlHelperMixin},
	 * {@link module:net~UserUrlHelperMixin}, and {@link module:net~NodeUrlHelperMixin} mixins.
	 *
	 * @mixes module:net~NodeMetadataUrlHelperMixin
	 * @mixes module:net~UserUrlHelperMixin
	 * @mixes module:net~NodeUrlHelperMixin
	 * @extends module:net~UrlHelper
	 * @alias module:net~NodeMetadataUrlHelper
	 */


	var NodeMetadataUrlHelper = /*#__PURE__*/function (_NodeMetadataUrlHelpe) {
	  _inherits(NodeMetadataUrlHelper, _NodeMetadataUrlHelpe);

	  var _super2 = _createSuper(NodeMetadataUrlHelper);

	  function NodeMetadataUrlHelper() {
	    _classCallCheck(this, NodeMetadataUrlHelper);

	    return _super2.apply(this, arguments);
	  }

	  return NodeMetadataUrlHelper;
	}(NodeMetadataUrlHelperMixin(UserUrlHelperMixin(NodeUrlHelperMixin(UrlHelper))));

	/**
	 * Create a UserAuthTokenUrlHelperMixin class.
	 *
	 * @exports net
	 * @param {module:net~UrlHelper} superclass the UrlHelper class to mix onto
	 * @return {module:net~UserAuthTokenUrlHelperMixin} the mixin class
	 */

	var UserAuthTokenUrlHelperMixin = function UserAuthTokenUrlHelperMixin(superclass) {
	  return (
	    /*#__PURE__*/

	    /**
	     * A mixin class that adds security token support to a SolarUser {@link module:net~UrlHelper}.
	     *
	     * @mixin
	     * @alias module:net~UserAuthTokenUrlHelperMixin
	     */
	    function (_superclass) {
	      _inherits(_class, _superclass);

	      var _super = _createSuper(_class);

	      function _class() {
	        _classCallCheck(this, _class);

	        return _super.apply(this, arguments);
	      }

	      _createClass(_class, [{
	        key: "listAllAuthTokensUrl",
	        value:
	        /**
	         * Generate a URL for listing all available auth tokens.
	         *
	         * @returns {string} the URL
	         */
	        function listAllAuthTokensUrl() {
	          return this.baseUrl() + "/user/auth-tokens";
	        }
	        /**
	         * Generate a URL for creating a new auth token, via a `POST` request.
	         *
	         * The request body accepts a {@link module:domain~SecurityPolicy} JSON document.
	         *
	         * @param {AuthTokenType} type the auth token type to generate
	         * @returns {string} the URL
	         */

	      }, {
	        key: "generateAuthTokenUrl",
	        value: function generateAuthTokenUrl(type) {
	          return this.baseUrl() + "/user/auth-tokens/generate/" + type.name;
	        }
	        /**
	         * Generate a URL for accessing an auth token.
	         *
	         * @param {string} tokenId the token ID
	         * @returns {string} the URL
	         * @private
	         */

	      }, {
	        key: "authTokenUrl",
	        value: function authTokenUrl(tokenId) {
	          return this.baseUrl() + "/user/auth-tokens/" + encodeURIComponent(tokenId);
	        }
	        /**
	         * Generate a URL for deleting an auth token, via a `DELETE` request.
	         *
	         * @param {string} tokenId the token ID to delete
	         * @returns {string} the URL
	         */

	      }, {
	        key: "deleteAuthTokenUrl",
	        value: function deleteAuthTokenUrl(tokenId) {
	          return this.authTokenUrl(tokenId);
	        }
	        /**
	         * Generate a URL for updating (merging) a security policy on an auth token,
	         * via a `PATCH` request.
	         *
	         * The request body accepts a {@link module:net~SecurityPolicy} JSON document.
	         *
	         * @param {string} tokenId the ID of the token to update
	         * @returns {string} the URL
	         */

	      }, {
	        key: "updateAuthTokenSecurityPolicyUrl",
	        value: function updateAuthTokenSecurityPolicyUrl(tokenId) {
	          return this.authTokenUrl(tokenId);
	        }
	        /**
	         * Generate a URL for replacing a security policy on an auth token,
	         * via a `PUT` request.
	         *
	         * The request body accepts a {@link module:domain~SecurityPolicy} JSON document.
	         *
	         * @param {string} tokenId the ID of the token to update
	         * @returns {string} the URL
	         */

	      }, {
	        key: "replaceAuthTokenSecurityPolicyUrl",
	        value: function replaceAuthTokenSecurityPolicyUrl(tokenId) {
	          return this.authTokenUrl(tokenId);
	        }
	        /**
	         * Generate a URL for updating the status of an auth token,
	         * via a `POST` request.
	         *
	         * @param {string} tokenId the ID of the token to update
	         * @param {AuthTokenStatus} status the status to change to
	         * @returns {string} the URL
	         */

	      }, {
	        key: "updateAuthTokenStatusUrl",
	        value: function updateAuthTokenStatusUrl(tokenId, status) {
	          return this.authTokenUrl(tokenId) + "?status=" + encodeURIComponent(status.name);
	        }
	      }]);

	      return _class;
	    }(superclass)
	  );
	};
	/**
	 * A concrete {@link module:net~UrlHelper} with the {@link module:net~UserAuthTokenUrlHelperMixin} and
	 * {@link module:net~UserUrlHelperMixin} mixins.
	 *
	 * @mixes module:net~UserAuthTokenUrlHelperMixin
	 * @mixes module:net~UserUrlHelperMixin
	 * @extends module:net~UrlHelper
	 * @alias module:net~UserAuthTokenUrlHelper
	 */


	var UserAuthTokenUrlHelper = /*#__PURE__*/function (_UserAuthTokenUrlHelp) {
	  _inherits(UserAuthTokenUrlHelper, _UserAuthTokenUrlHelp);

	  var _super2 = _createSuper(UserAuthTokenUrlHelper);

	  function UserAuthTokenUrlHelper() {
	    _classCallCheck(this, UserAuthTokenUrlHelper);

	    return _super2.apply(this, arguments);
	  }

	  return UserAuthTokenUrlHelper;
	}(UserAuthTokenUrlHelperMixin(UserUrlHelperMixin(UrlHelper)));

	/**
	 * Create a UserDatumAuxiliaryUrlHelperMixin class.
	 *
	 * @exports net
	 * @param {module:net~UrlHelper} superclass the UrlHelper class to mix onto
	 * @return {module:net~UserDatumAuxiliaryUrlHelperMixin} the mixin class
	 */

	var UserDatumAuxiliaryUrlHelperMixin = function UserDatumAuxiliaryUrlHelperMixin(superclass) {
	  return (
	    /*#__PURE__*/

	    /**
	     * A mixin class that adds user datum auxiliary support to {@link module:net~UrlHelper}.
	     *
	     * @mixin
	     * @alias module:net~UserDatumAuxiliaryUrlHelperMixin
	     */
	    function (_superclass) {
	      _inherits(_class, _superclass);

	      var _super = _createSuper(_class);

	      function _class() {
	        _classCallCheck(this, _class);

	        return _super.apply(this, arguments);
	      }

	      _createClass(_class, [{
	        key: "userDatumAuxiliaryBaseUrl",
	        value: function userDatumAuxiliaryBaseUrl() {
	          return this.baseUrl() + "/datum/auxiliary";
	        }
	        /**
	         * Generate a URL for viewing the configured user's metadata via a `GET` request.
	         *
	         * @param {module:domain~DatumFilter} filter the search criteria
	         * @returns {string} the URL
	         */

	      }, {
	        key: "listUserDatumAuxiliaryUrl",
	        value: function listUserDatumAuxiliaryUrl(filter) {
	          var result = this.userDatumAuxiliaryBaseUrl();

	          if (filter) {
	            var params = filter.toUriEncoding();

	            if (params.length > 0) {
	              result += "?" + params;
	            }
	          }

	          return result;
	        }
	        /**
	         * Generate a URL for accessing a specific `DatumAuxiliaryType` by its primary key.
	         *
	         * If `sourceId` contains any `/` characters, then {@link module:net~UserDatumAuxiliaryUrlHelperMixin#userDatumAuxiliaryIdQueryUrl}
	         * will be invoked instead.
	         *
	         * @param {module:domain~DatumAuxiliaryType} type the datum auxiliary type
	         * @param {number} nodeId the node ID
	         * @param {Date} date a date
	         * @param {string} sourceId the source ID
	         * @returns {string} the URL
	         */

	      }, {
	        key: "userDatumAuxiliaryIdUrl",
	        value: function userDatumAuxiliaryIdUrl(type, nodeId, date, sourceId) {
	          if (sourceId && sourceId.indexOf("/") >= 0) {
	            // force use of query parameters if source ID has slash characters
	            return this.userDatumAuxiliaryIdQueryUrl(type, nodeId, date, sourceId);
	          }

	          var result = this.userDatumAuxiliaryBaseUrl();
	          result += "/" + encodeURIComponent(type.name ? type.name : type) + "/" + encodeURIComponent(nodeId) + "/" + encodeURIComponent(timestampFormat(date)) + "/" + encodeURIComponent(sourceId);
	          return result;
	        }
	        /**
	         * Generate a URL for accessing a specific `DatumAuxiliaryType` by its primary key,
	         * using query parameters for id components.
	         *
	         * @param {module:domain~DatumAuxiliaryType} type the datum auxiliary type
	         * @param {number} nodeId the node ID
	         * @param {Date} date a date
	         * @param {string} sourceId the source ID
	         * @returns {string} the URL
	         */

	      }, {
	        key: "userDatumAuxiliaryIdQueryUrl",
	        value: function userDatumAuxiliaryIdQueryUrl(type, nodeId, date, sourceId) {
	          var result = this.userDatumAuxiliaryBaseUrl();
	          var props = new PropMap({
	            type: type,
	            nodeId: nodeId,
	            date: timestampFormat(date),
	            sourceId: sourceId
	          });
	          var query = props.toUriEncoding();

	          if (query.length > 0) {
	            result += "?" + query;
	          }

	          return result;
	        }
	        /**
	         * Generate a URL for storing a `DatumAuxiliaryType` via a `POST` request.
	         *
	         * The {@link module:net~UserDatumAuxiliaryUrlHelperMixin#userDatumAuxiliaryIdUrl} method is used
	         * to generate the URL.
	         *
	         * @param {module:domain~DatumAuxiliaryType} type the datum auxiliary type
	         * @param {number} nodeId the node ID
	         * @param {Date} date a date
	         * @param {string} sourceId the source ID
	         * @returns {string} the URL
	         */

	      }, {
	        key: "storeUserDatumAuxiliaryUrl",
	        value: function storeUserDatumAuxiliaryUrl(type, nodeId, date, sourceId) {
	          return this.userDatumAuxiliaryIdUrl(type, nodeId, date, sourceId);
	        }
	        /**
	         * Generate a URL for viewing a `DatumAuxiliaryType` via a `GET` request.
	         *
	         * The {@link module:net~UserDatumAuxiliaryUrlHelperMixin#userDatumAuxiliaryIdUrl} method is used
	         * to generate the URL.
	         *
	         * @param {module:domain~DatumAuxiliaryType} type the datum auxiliary type
	         * @param {number} nodeId the node ID
	         * @param {Date} date a date
	         * @param {string} sourceId the source ID
	         * @returns {string} the URL
	         */

	      }, {
	        key: "viewUserDatumAuxiliaryUrl",
	        value: function viewUserDatumAuxiliaryUrl(type, nodeId, date, sourceId) {
	          return this.userDatumAuxiliaryIdUrl(type, nodeId, date, sourceId);
	        }
	        /**
	         * Generate a URL for deleting a `DatumAuxiliaryType` via a `DELETE` request.
	         *
	         * The {@link module:net~UserDatumAuxiliaryUrlHelperMixin#userDatumAuxiliaryIdUrl} method is used
	         * to generate the URL.
	         *
	         * @param {module:domain~DatumAuxiliaryType} type the datum auxiliary type
	         * @param {number} nodeId the node ID
	         * @param {Date} date a date
	         * @param {string} sourceId the source ID
	         * @returns {string} the URL
	         */

	      }, {
	        key: "deleteUserDatumAuxiliaryUrl",
	        value: function deleteUserDatumAuxiliaryUrl(type, nodeId, date, sourceId) {
	          return this.userDatumAuxiliaryIdUrl(type, nodeId, date, sourceId);
	        }
	      }]);

	      return _class;
	    }(superclass)
	  );
	};
	/**
	 * A concrete {@link module:net~UrlHelper} with the {@link module:net~UserDatumAuxiliaryUrlHelperMixin}
	 * and {@link module:net~UserUrlHelperMixin} mixins.
	 *
	 * @mixes module:net~UserDatumAuxiliaryUrlHelperMixin
	 * @mixes module:net~UserUrlHelperMixin
	 * @extends module:net~UrlHelper
	 * @alias module:net~UserDatumAuxiliaryUrlHelper
	 */


	var UserDatumAuxiliaryUrlHelper = /*#__PURE__*/function (_UserDatumAuxiliaryUr) {
	  _inherits(UserDatumAuxiliaryUrlHelper, _UserDatumAuxiliaryUr);

	  var _super2 = _createSuper(UserDatumAuxiliaryUrlHelper);

	  function UserDatumAuxiliaryUrlHelper() {
	    _classCallCheck(this, UserDatumAuxiliaryUrlHelper);

	    return _super2.apply(this, arguments);
	  }

	  return UserDatumAuxiliaryUrlHelper;
	}(UserDatumAuxiliaryUrlHelperMixin(UserUrlHelperMixin(UrlHelper)));

	/**
	 * Create a UserMetadataUrlHelperMixin class.
	 *
	 * @exports net
	 * @param {module:net~UrlHelper} superclass the UrlHelper class to mix onto
	 * @return {module:net~UserMetadataUrlHelperMixin} the mixin class
	 */

	var UserMetadataUrlHelperMixin = function UserMetadataUrlHelperMixin(superclass) {
	  return (
	    /*#__PURE__*/

	    /**
	     * A mixin class that adds user metadata support to {@link module:net~UrlHelper}.
	     *
	     * @mixin
	     * @alias module:net~UserMetadataUrlHelperMixin
	     */
	    function (_superclass) {
	      _inherits(_class, _superclass);

	      var _super = _createSuper(_class);

	      function _class() {
	        _classCallCheck(this, _class);

	        return _super.apply(this, arguments);
	      }

	      _createClass(_class, [{
	        key: "findUserMetadataUrl",
	        value:
	        /**
	         * Generate a URL for viewing the configured user's metadata via a <code>GET</code> request.
	         *
	         * @param {module:domain~UserMetadataFilter} filter the search criteria
	         * @returns {string} the URL
	         */
	        function findUserMetadataUrl(filter) {
	          var result = this.baseUrl() + "/users/meta";

	          if (filter) {
	            var params = filter.toUriEncoding();

	            if (params.length > 0) {
	              result += "?" + params;
	            }
	          }

	          return result;
	        }
	      }, {
	        key: "userMetadataUrl",
	        value: function userMetadataUrl(userId) {
	          var result = this.baseUrl() + "/users/meta";
	          var userParam = userId || this.userId;

	          if (Array.isArray(userParam)) {
	            if (userParam.length > 0) {
	              userParam = userParam[0];
	            } else {
	              userParam = null;
	            }
	          }

	          if (userParam && userId !== null) {
	            result += "/" + userParam;
	          }

	          return result;
	        }
	        /**
	         * Generate a URL for viewing a specific user's metadata via a <code>GET</code> request.
	         *
	         * @param {number|null} [userId] a specific user ID;
	         *                               if not provided the <code>userId</code> property of this class will be used;
	         *                               if <code>null</code> then view metadata of the requesting user
	         * @returns {string} the URL
	         */

	      }, {
	        key: "viewUserMetadataUrl",
	        value: function viewUserMetadataUrl(userId) {
	          return this.userMetadataUrl(userId);
	        }
	        /**
	         * Generate a URL for adding user metadata via a <code>POST</code> request.
	         *
	         * @param {number|null} [userId] a specific user ID;
	         *                               if not provided the <code>userId</code> property of this class will be used;
	         *                               if <code>null</code> then add metadata to the requesting user
	         * @returns {string} the URL
	         */

	      }, {
	        key: "addUserMetadataUrl",
	        value: function addUserMetadataUrl(userId) {
	          return this.userMetadataUrl(userId);
	        }
	        /**
	         * Generate a URL for replacing user metadata via a <code>PUT</code> request.
	         *
	         * @param {number|null} [userId] a specific user ID;
	         *                               if not provided the <code>userId</code> property of this class will be used;
	         *                               if <code>null</code> then add metadata to the requesting user
	         * @returns {string} the URL
	         */

	      }, {
	        key: "replaceUserMetadataUrl",
	        value: function replaceUserMetadataUrl(userId) {
	          return this.userMetadataUrl(userId);
	        }
	        /**
	         * Generate a URL for deleting user metadata via a <code>DELETE</code> request.
	         *
	         * @param {number|null} [userId] a specific user ID;
	         *                               if not provided the <code>userId</code> property of this class will be used;
	         *                               if <code>null</code> then add metadata to the requesting user
	         * @returns {string} the URL
	         */

	      }, {
	        key: "deleteUserMetadataUrl",
	        value: function deleteUserMetadataUrl(userId) {
	          return this.userMetadataUrl(userId);
	        }
	      }]);

	      return _class;
	    }(superclass)
	  );
	};
	/**
	 * A concrete {@link module:net~UrlHelper} with the {@link module:net~UserMetadataUrlHelperMixin}
	 * and {@link module:net~UserUrlHelperMixin} mixins.
	 *
	 * @mixes module:net~UserMetadataUrlHelperMixin
	 * @mixes module:net~UserUrlHelperMixin
	 * @extends module:net~UrlHelper
	 * @alias module:net~UserMetadataUrlHelper
	 */


	var UserMetadataUrlHelper = /*#__PURE__*/function (_UserMetadataUrlHelpe) {
	  _inherits(UserMetadataUrlHelper, _UserMetadataUrlHelpe);

	  var _super2 = _createSuper(UserMetadataUrlHelper);

	  function UserMetadataUrlHelper() {
	    _classCallCheck(this, UserMetadataUrlHelper);

	    return _super2.apply(this, arguments);
	  }

	  return UserMetadataUrlHelper;
	}(UserMetadataUrlHelperMixin(UserUrlHelperMixin(UrlHelper)));

	/* eslint no-console: 0 */
	var logLevel = 2;

	function consoleLog(level) {
	  if (level > logLevel) {
	    return;
	  }

	  if (!console) {
	    return;
	  }

	  var logFn;

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

	  if (!logFn) {
	    return; // no console available
	  }

	  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	    args[_key - 1] = arguments[_key];
	  }

	  logFn.apply(void 0, args); // TODO formatting like sn.format.fmt.apply(this, arguments)?
	}

	var logLevels = Object.freeze({
	  DEBUG: 4,
	  INFO: 3,
	  WARN: 2,
	  ERROR: 1,
	  OFF: 0
	});
	/**
	 * An application logger.
	 *
	 * Logging levels range from 0-4 and is controlled at the application level.
	 * Level `0` is off, `1` is error, `2` is warn, `3` is info,  and `4` is debug.
	 * The default level starts as `2`.
	 */

	var Logger = /*#__PURE__*/function () {
	  function Logger() {
	    _classCallCheck(this, Logger);
	  }

	  _createClass(Logger, null, [{
	    key: "debug",
	    value: function debug() {
	      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	        args[_key2] = arguments[_key2];
	      }

	      consoleLog.apply(void 0, [4].concat(args));
	    }
	  }, {
	    key: "info",
	    value: function info() {
	      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
	        args[_key3] = arguments[_key3];
	      }

	      consoleLog.apply(void 0, [3].concat(args));
	    }
	  }, {
	    key: "warn",
	    value: function warn() {
	      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
	        args[_key4] = arguments[_key4];
	      }

	      consoleLog.apply(void 0, [2].concat(args));
	    }
	  }, {
	    key: "error",
	    value: function error() {
	      for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
	        args[_key5] = arguments[_key5];
	      }

	      consoleLog.apply(void 0, [1].concat(args));
	    }
	  }]);

	  return Logger;
	}();

	Object.defineProperties(Logger, {
	  /**
	   * The global logging level. Set to `0` to disable all logging.
	   *
	   * @memberof module:util~Logger
	   * @type {number}
	   */
	  level: {
	    get: function get() {
	      return logLevel;
	    },
	    set: function set(v) {
	      logLevel = typeof v === "number" ? v : 0;
	    }
	  }
	});

	Object.defineProperty(exports, 'dateParse', {
		enumerable: true,
		get: function () {
			return d3TimeFormat.isoParse;
		}
	});
	Object.defineProperty(exports, 'dateTimeUrlParse', {
		enumerable: true,
		get: function () {
			return d3TimeFormat.isoParse;
		}
	});
	exports.Aggregation = Aggregation;
	exports.Aggregations = Aggregations;
	exports.AuthTokenStatus = AuthTokenStatus;
	exports.AuthTokenStatuses = AuthTokenStatuses;
	exports.AuthTokenType = AuthTokenType;
	exports.AuthTokenTypes = AuthTokenTypes;
	exports.AuthTokenUrlHelperMixin = AuthTokenUrlHelperMixin;
	exports.AuthorizationV2Builder = AuthorizationV2Builder;
	exports.BitmaskEnum = BitmaskEnum;
	exports.CombiningType = CombiningType;
	exports.CombiningTypes = CombiningTypes;
	exports.ComparableEnum = ComparableEnum;
	exports.Configuration = Configuration;
	exports.DatumAuxiliaryType = DatumAuxiliaryType;
	exports.DatumAuxiliaryTypes = DatumAuxiliaryTypes;
	exports.DatumFilter = DatumFilter;
	exports.DatumReadingType = DatumReadingType;
	exports.DatumReadingTypes = DatumReadingTypes;
	exports.DeviceOperatingState = DeviceOperatingState;
	exports.DeviceOperatingStates = DeviceOperatingStates;
	exports.Enum = Enum;
	exports.Environment = Environment;
	exports.GeneralMetadata = GeneralMetadata;
	exports.HttpContentType = HttpContentType;
	exports.HttpHeaders = HttpHeaders;
	exports.HttpMethod = HttpMethod;
	exports.InstructionState = InstructionState;
	exports.InstructionStates = InstructionStates;
	exports.Location = Location;
	exports.LocationDatumMetadataUrlHelper = LocationDatumMetadataUrlHelper;
	exports.LocationDatumMetadataUrlHelperMixin = LocationDatumMetadataUrlHelperMixin;
	exports.LocationDatumUrlHelper = LocationDatumUrlHelper;
	exports.LocationDatumUrlHelperMixin = LocationDatumUrlHelperMixin;
	exports.LocationPrecision = LocationPrecision;
	exports.LocationPrecisions = LocationPrecisions;
	exports.LocationUrlHelperMixin = LocationUrlHelperMixin;
	exports.Logger = Logger;
	exports.MultiMap = MultiMap;
	exports.NodeDatumMetadataUrlHelper = NodeDatumMetadataUrlHelper;
	exports.NodeDatumMetadataUrlHelperMixin = NodeDatumMetadataUrlHelperMixin;
	exports.NodeDatumUrlHelper = NodeDatumUrlHelper;
	exports.NodeDatumUrlHelperMixin = NodeDatumUrlHelperMixin;
	exports.NodeInstructionUrlHelper = NodeInstructionUrlHelper;
	exports.NodeInstructionUrlHelperMixin = NodeInstructionUrlHelperMixin;
	exports.NodeMetadataUrlHelper = NodeMetadataUrlHelper;
	exports.NodeMetadataUrlHelperMixin = NodeMetadataUrlHelperMixin;
	exports.NodeUrlHelperMixin = NodeUrlHelperMixin;
	exports.Pagination = Pagination;
	exports.PropMap = PropMap;
	exports.QueryUrlHelperMixin = QueryUrlHelperMixin;
	exports.SecurityPolicy = SecurityPolicy;
	exports.SecurityPolicyBuilder = SecurityPolicyBuilder;
	exports.SkyCondition = SkyCondition;
	exports.SkyConditions = SkyConditions;
	exports.SolarQueryApiPathV1 = SolarQueryApiPathV1;
	exports.SolarQueryDefaultPath = SolarQueryDefaultPath;
	exports.SolarQueryPathKey = SolarQueryPathKey;
	exports.SolarQueryPublicPathKey = SolarQueryPublicPathKey;
	exports.SolarUserApiPathV1 = SolarUserApiPathV1;
	exports.SolarUserDefaultPath = SolarUserDefaultPath;
	exports.SolarUserPathKey = SolarUserPathKey;
	exports.SortDescriptor = SortDescriptor;
	exports.UrlHelper = UrlHelper;
	exports.UserAuthTokenUrlHelper = UserAuthTokenUrlHelper;
	exports.UserAuthTokenUrlHelperMixin = UserAuthTokenUrlHelperMixin;
	exports.UserDatumAuxiliaryUrlHelper = UserDatumAuxiliaryUrlHelper;
	exports.UserDatumAuxiliaryUrlHelperMixin = UserDatumAuxiliaryUrlHelperMixin;
	exports.UserMetadataUrlHelper = UserMetadataUrlHelper;
	exports.UserMetadataUrlHelperMixin = UserMetadataUrlHelperMixin;
	exports.UserUrlHelperMixin = UserUrlHelperMixin;
	exports.arrayData = array;
	exports.dateFormat = dateFormat;
	exports.dateParser = dateParser;
	exports.dateTimeFormat = dateTimeFormat;
	exports.dateTimeParse = dateTimeParse;
	exports.dateTimeUrlFormat = dateTimeUrlFormat;
	exports.dateUtils = date;
	exports.displayScaleForValue = displayScaleForValue;
	exports.displayUnitsForScale = displayUnitsForScale;
	exports.instructionParameter = instructionParameter;
	exports.iso8601Date = iso8601Date;
	exports.logLevels = logLevels;
	exports.nestData = nest;
	exports.objectToStringMap = objectToStringMap;
	exports.seasonForDate = seasonForDate;
	exports.stringMapToObject = stringMapToObject;
	exports.timestampFormat = timestampFormat;
	exports.timestampParse = timestampParse;
	exports.urlQuery = urlQuery;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=solarnetwork-api-core.js.map
