import { isoParse, utcFormat, utcParse } from 'd3-time-format';
import Hex from 'crypto-js/enc-hex';
import HmacSHA256 from 'crypto-js/hmac-sha256';
import SHA256 from 'crypto-js/sha256';
import { parse } from 'uri-js';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};





var slicedToArray = function () {
  function sliceIterator(arr, i) {
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
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

/**
 * An enumerated object base class.
 * 
 * This class is essentially abstract, and must be extended by another
 * class that overrides the {@link Enum.enumValues} method.
 * 
 * @abstract
 */
var Enum = function () {

    /**
     * Constructor.
     * 
     * @param {string} name the name
     */
    function Enum(name) {
        classCallCheck(this, Enum);

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


    createClass(Enum, [{
        key: "name",
        get: function get$$1() {
            return this._name;
        }

        /**
         * Get all enum values.
         * 
         * This method must be overridden by subclasses to return something meaningful.
         * This implementation returns an empty array.
         * 
         * @abstract
         * @returns {Enum[]} get all enum values
         */

    }], [{
        key: "enumValues",
        value: function enumValues() {
            return [];
        }

        /**
         * This method takes an array of enums and turns them into a mapped object, using the enum
         * <code>name</code> as object property names.
         * 
         * @param {Enum[]} enums the enum list to turn into a value object
         * @returns {Object} an object with enum <code>name</code> properties with associated enum values 
         */

    }, {
        key: "enumsValue",
        value: function enumsValue(enums) {
            return Object.freeze(enums.reduce(function (obj, e) {
                obj[e.name] = e;
                return obj;
            }, {}));
        }
    }]);
    return Enum;
}();

/**
 * An immutable enum-like object with an associated comparable value.
 *
 * This class is essentially abstract, and must be extended by another
 * class that overrides the inerited {@link Enum.enumValues} method.
 * 
 * @abstract
 * @extends Enum
 */

var ComparableEnum = function (_Enum) {
    inherits(ComparableEnum, _Enum);

    /**
     * Constructor.
     * 
     * @param {string} name the name
     * @param {number} value the comparable value
     */
    function ComparableEnum(name, value) {
        classCallCheck(this, ComparableEnum);

        var _this = possibleConstructorReturn(this, (ComparableEnum.__proto__ || Object.getPrototypeOf(ComparableEnum)).call(this, name));

        _this._value = value;
        if (_this.constructor === ComparableEnum) {
            Object.freeze(_this);
        }
        return _this;
    }

    /**
     * Get the comparable value.
     * 
     * @returns {number} the value
     */


    createClass(ComparableEnum, [{
        key: 'compareTo',


        /**
         * Compare two ComparableEnum objects based on their <code>value</code> values.
         * 
         * @param {ComparableEnum} other the object to compare to
         * @returns {number} <code>-1</code> if <code>this.value</code> is less than <code>other.value</code>, 
         *                   <code>1</code> if <code>this.value</code> is greater than <code>other.value</code>,
         *                   <code>0</code> otherwise (when the values are equal) 
         */
        value: function compareTo(other) {
            return this.value < other.value ? -1 : this.value > other.value ? 1 : 0;
        }

        /**
         * Compute a complete set of enum values based on a minimum enum and/or set of enums.
         * 
         * If <code>cache</code> is provided, then results computed via <code>minAggregation</code> 
         * will be cached there, and subsequent calls will returned the cached result when appropriate.
         * 
         * @param {ComparableEnum} [minEnum] a minimum enum value
         * @param {Map<string, Set<ComparableEnum>>} [cache] a cache of computed values
         * @returns {Set<ComparableEnum>|null} the computed set, or <code>null</code> if no values match
         */

    }, {
        key: 'value',
        get: function get$$1() {
            return this._value;
        }
    }], [{
        key: 'minimumEnumSet',
        value: function minimumEnumSet(minEnum, cache) {
            if (!minEnum) {
                return null;
            }
            var result = cache ? cache.get(minEnum.name) : undefined;
            if (result) {
                return result;
            }
            result = new Set();
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = minEnum.constructor.enumValues()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var agg = _step.value;

                    if (agg.compareTo(minEnum) > -1) {
                        result.add(agg);
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
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
 * @extends ComparableEnum
 */
var Aggregation = function (_ComparableEnum) {
  inherits(Aggregation, _ComparableEnum);

  /**
      * Constructor.
      * 
      * @param {string} name the unique name for this precision 
      * @param {number} level a relative aggregation level value 
      */
  function Aggregation(name, level) {
    classCallCheck(this, Aggregation);

    var _this = possibleConstructorReturn(this, (Aggregation.__proto__ || Object.getPrototypeOf(Aggregation)).call(this, name, level));

    if (_this.constructor === Aggregation) {
      Object.freeze(_this);
    }
    return _this;
  }

  /**
   * Get the aggregate level value.
  * 
  * This is an alias for {@link ComparableEnum#value}.
   */


  createClass(Aggregation, [{
    key: 'level',
    get: function get$$1() {
      return this.value;
    }

    /**
     * Get the {@link Aggregations} values.
     * 
     * @override
     * @inheritdoc
     */

  }], [{
    key: 'enumValues',
    value: function enumValues() {
      return AggregationValues;
    }
  }]);
  return Aggregation;
}(ComparableEnum);

var AggregationValues = Object.freeze([new Aggregation('Minute', 60), new Aggregation('FiveMinute', 60 * 5), new Aggregation('TenMinute', 60 * 10), new Aggregation('FifteenMinute', 60 * 15), new Aggregation('ThirtyMinute', 60 * 30), new Aggregation('Hour', 3600), new Aggregation('HourOfDay', 3600), new Aggregation('SeasonalHourOfDay', 3600), new Aggregation('Day', 86400), new Aggregation('DayOfWeek', 86400), new Aggregation('SeasonalDayOfWeek', 86400), new Aggregation('Week', 604800), new Aggregation('WeekOfYear', 604800), new Aggregation('Month', 2419200), new Aggregation('RunningTotal', Number.MAX_SAFE_INTEGER)]);

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
var Aggregations = Aggregation.enumsValue(AggregationValues);

/**
 * An auth token status.
 * 
 * @extends Enum
 */
var AuthTokenStatus = function (_Enum) {
  inherits(AuthTokenStatus, _Enum);

  /**
   * Constructor.
   * 
   * @param {string} name the name
   */
  function AuthTokenStatus(name) {
    classCallCheck(this, AuthTokenStatus);

    var _this = possibleConstructorReturn(this, (AuthTokenStatus.__proto__ || Object.getPrototypeOf(AuthTokenStatus)).call(this, name));

    if (_this.constructor === AuthTokenStatus) {
      Object.freeze(_this);
    }
    return _this;
  }

  /**
  * Get the {@link AuthTokenStatuses} values.
  * 
  * @inheritdoc
  */


  createClass(AuthTokenStatus, null, [{
    key: 'enumValues',
    value: function enumValues() {
      return AuthTokenStatusValues;
    }
  }]);
  return AuthTokenStatus;
}(Enum);

var AuthTokenStatusValues = Object.freeze([new AuthTokenStatus('Active'), new AuthTokenStatus('Disabled')]);

/**
 * The enumeration of supported AuthTokenStatus values.
 * 
 * @readonly
 * @enum {AuthTokenStatus}
 * @property {AuthTokenStatus} Active the token is active and usable
 * @property {AuthTokenStatus} Disabled the token is disabled and not usable
 */
var AuthTokenStatuses = AuthTokenStatus.enumsValue(AuthTokenStatusValues);

/**
 * A named auth token type.
 * 
 * @extends Enum
 */
var AuthTokenType = function (_Enum) {
  inherits(AuthTokenType, _Enum);

  /**
   * Constructor.
   * 
   * @param {string} name the name
   */
  function AuthTokenType(name) {
    classCallCheck(this, AuthTokenType);

    var _this = possibleConstructorReturn(this, (AuthTokenType.__proto__ || Object.getPrototypeOf(AuthTokenType)).call(this, name));

    if (_this.constructor === AuthTokenType) {
      Object.freeze(_this);
    }
    return _this;
  }

  /**
  * Get the {@link AuthTokenTypes} values.
  * 
  * @inheritdoc
  */


  createClass(AuthTokenType, null, [{
    key: 'enumValues',
    value: function enumValues() {
      return AuthTokenTypeValues;
    }
  }]);
  return AuthTokenType;
}(Enum);

var AuthTokenTypeValues = Object.freeze([new AuthTokenType('ReadNodeData'), new AuthTokenType('User')]);

/**
 * The enumeration of supported AuthTokenType values.
 * 
 * @readonly
 * @enum {AuthTokenType}
 * @property {AuthTokenType} ReadNodeData a read-only token for reading SolarNode data
 * @property {AuthTokenType} User full access as the user that owns the token
 */
var AuthTokenTypes = AuthTokenType.enumsValue(AuthTokenTypeValues);

/**
 * General metadata with a basic structure.
 * 
 * This metadata can be associated with a variety of objects within SolarNetwork, such
 * as users, nodes, and datum.
 */
var GeneralMetadata = function () {

    /**
     * Constructor.
     * 
     * @param {Map<string, *>} [info] the general metadata map
     * @param {Map<string, Map<string, *>>} [propertyInfo] the property metadata map
     * @param {Set<string>} [tags] the tags
     */
    function GeneralMetadata(info, propertyInfo, tags) {
        classCallCheck(this, GeneralMetadata);

        this.info = info || null;
        this.propertyInfo = propertyInfo || null;
        this.tags = tags instanceof Set ? tags : Array.isArray(tags) ? new Set(tags) : null;
    }

    /**
     * Get this object as a standard JSON encoded string value.
     * 
     * @return {string} the JSON encoded string
     */


    createClass(GeneralMetadata, [{
        key: 'toJsonEncoding',
        value: function toJsonEncoding() {
            var result = {};
            var info = this.info;
            if (info) {
                result['m'] = stringMapToObject(info);
            }
            var propertyInfo = this.propertyInfo;
            if (propertyInfo) {
                result['pm'] = stringMapToObject(propertyInfo);
            }
            var tags = this.tags;
            if (tags) {
                result['t'] = Array.from(tags);
            }

            return JSON.stringify(result);
        }

        /**
         * Parse a JSON string into a {@link GeneralMetadata} instance.
         * 
         * The JSON must be encoded the same way {@link GeneralMetadata#toJsonEncoding} does.
         * 
         * @param {string} json the JSON to parse
         * @returns {GeneralMetadata} the metadata instance 
         */

    }], [{
        key: 'fromJsonEncoding',
        value: function fromJsonEncoding(json) {
            var m = void 0,
                pm = void 0,
                t = void 0;
            if (json) {
                var obj = JSON.parse(json);
                m = obj['m'] ? objectToStringMap(obj['m']) : null;
                pm = obj['pm'] ? objectToStringMap(obj['pm']) : null;
                t = Array.isArray(obj['t']) ? new Set(obj['t']) : null;
            }
            return new GeneralMetadata(m, pm, t);
        }
    }]);
    return GeneralMetadata;
}();

/**
 * Convert a <code>Map</code> into a simple object.
 * 
 * The keys are assumed to be strings. Values that are themselves <code>Map</code> instances
 * will be converted to simple objects as well.
 * 
 * @param {Map<string, *>} strMap a Map with string keys; nested Map objects are also handled
 * @returns {Object} a simple object
 * @see {@link objectToStringMap} for the reverse conversion
 */


function stringMapToObject(strMap) {
    var obj = Object.create(null);
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = strMap[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _ref = _step.value;

            var _ref2 = slicedToArray(_ref, 2);

            var k = _ref2[0];
            var v = _ref2[1];

            obj[k] = v instanceof Map ? stringMapToObject(v) : v;
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return obj;
}

/**
 * Convert a simple object into a <code>Map</code> instance.
 * 
 * Property values that are themselves objects will be converted into <code>Map</code>
 * instances as well.
 * 
 * @param {Object} obj a simple object
 * @returns {Map<string, *>} a Map with string keys; nested Map objects are also handled
 * @see {@link stringMapToObject} for the reverse conversion
 */
function objectToStringMap(obj) {
    var strMap = new Map();
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = Object.keys(obj)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var k = _step2.value;

            var v = obj[k];
            strMap.set(k, (typeof v === 'undefined' ? 'undefined' : _typeof(v)) === 'object' ? objectToStringMap(v) : v);
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    return strMap;
}

/**
 * A named instruction state.
 */
var InstructionState = function (_Enum) {
  inherits(InstructionState, _Enum);

  /**
   * Constructor.
   * 
   * @param {string} name the name
   */
  function InstructionState(name) {
    classCallCheck(this, InstructionState);

    var _this = possibleConstructorReturn(this, (InstructionState.__proto__ || Object.getPrototypeOf(InstructionState)).call(this, name));

    if (_this.constructor === InstructionState) {
      Object.freeze(_this);
    }
    return _this;
  }

  /**
  * Get the {@link InstructionStates} values.
  * 
  * @inheritdoc
  */


  createClass(InstructionState, null, [{
    key: 'enumValues',
    value: function enumValues() {
      return InstructionStateValues;
    }
  }]);
  return InstructionState;
}(Enum);

var InstructionStateValues = Object.freeze([new InstructionState('Unknown'), new InstructionState('Queued'), new InstructionState('Received'), new InstructionState('Executing'), new InstructionState('Declined'), new InstructionState('Completed')]);

/**
 * The enumeration of supported InstructionState values.
 * 
 * @readonly
 * @enum {InstructionState}
 * @property {InstructionState} Unknown an unknown state
 * @property {InstructionState} Queued the instruction has been received by SolarNet but not yet delivered to its destination
 * @property {InstructionState} Received the instruction has been delivered to its destination but not yet acted upon
 * @property {InstructionState} Executed the instruction is currently being acted upon
 * @property {InstructionState} Declined the destination has declined to execute the instruction, or the execution failed
 * @property {InstructionState} Completed the destination has executed successfully
 */
var InstructionStates = InstructionState.enumsValue(InstructionStateValues);

/**
 * A location precision object for use with defining named geographic precision.
 * 
 * @extends ComparableEnum
 */
var LocationPrecision = function (_ComparableEnum) {
  inherits(LocationPrecision, _ComparableEnum);

  /**
   * Constructor.
   * 
   * @param {string} name the unique name for this precision 
   * @param {number} precision a relative precision value for this precision 
   */
  function LocationPrecision(name, precision) {
    classCallCheck(this, LocationPrecision);

    var _this = possibleConstructorReturn(this, (LocationPrecision.__proto__ || Object.getPrototypeOf(LocationPrecision)).call(this, name, precision));

    if (_this.constructor === LocationPrecision) {
      Object.freeze(_this);
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


  createClass(LocationPrecision, [{
    key: 'precision',
    get: function get$$1() {
      return this.value;
    }

    /**
     * Get the {@link LocationPrecisions} values.
     * 
        * @override
     * @inheritdoc
     */

  }], [{
    key: 'enumValues',
    value: function enumValues() {
      return LocationPrecisionValues;
    }
  }]);
  return LocationPrecision;
}(ComparableEnum);

var LocationPrecisionValues = Object.freeze([new LocationPrecision('LatLong', 1), new LocationPrecision('Block', 5), new LocationPrecision('Street', 10), new LocationPrecision('PostalCode', 20), new LocationPrecision('Locality', 30), new LocationPrecision('StateOrProvince', 40), new LocationPrecision('Region', 50), new LocationPrecision('TimeZone', 60), new LocationPrecision('Country', 70)]);

/**
 * The enumeration of supported LocationPrecision values.
 * 
 * @readonly
 * @enum {LocationPrecision}
 * @property {LocationPrecision} LatLong GPS coordinates
 * @property {LocationPrecision} Block a city block
 * @property {LocationPrecision} Street a street
 * @property {LocationPrecision} PostalCode a postal code (or "zip code")
 * @property {LocationPrecision} Locality a town or city
 * @property {LocationPrecision} StateOrProvince a state or province
 * @property {LocationPrecision} Region a large region
 * @property {LocationPrecision} TimeZone a time zone
 * @property {LocationPrecision} Country a country
 */
var LocationPrecisions = LocationPrecision.enumsValue(LocationPrecisionValues);

/**
 * A pagination criteria object.
 */
var Pagination = function () {

    /**
     * Construct a pagination object.
     * 
     * @param {number} max the maximum number of results to return 
     * @param {number} [offset] the 0-based starting offset 
     */
    function Pagination(max, offset) {
        classCallCheck(this, Pagination);

        this._max = max > 0 ? +max : 0;
        this._offset = offset > 0 ? +offset : 0;
    }

    /**
     * Get the maximum number of results to return.
     * 
     * @returns {number} the maximum number of results
     */


    createClass(Pagination, [{
        key: 'withOffset',


        /**
         * Copy constructor with a new <code>offset</code> value.
         * 
         * @param {number} offset the new offset to use
         * @return {Pagination} a new instance
         */
        value: function withOffset(offset) {
            return new Pagination(this.max, offset);
        }

        /**
         * Get this object as a standard URI encoded (query parameters) string value.
         * 
         * @return {string} the URI encoded string
         */

    }, {
        key: 'toUriEncoding',
        value: function toUriEncoding() {
            var result = '';
            if (this.max > 0) {
                result += 'max=' + this.max;
            }
            if (this.offset > 0) {
                if (result.length > 0) {
                    result += '&';
                }
                result += 'offset=' + this.offset;
            }
            return result;
        }
    }, {
        key: 'max',
        get: function get$$1() {
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
        key: 'offset',
        get: function get$$1() {
            return this._offset;
        }
    }]);
    return Pagination;
}();

/**
 * Get a Set from a Set or array or object, returning <code>null</code> if the set would be empty.
 * 
 * @param {Object[]|Set<*>} obj the array, Set, or singleton object to get as a Set
 * @returns {Set<*>} the Set, or <code>null</code>
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
 * @returns {Set<*>} the merged Set, or <code>null</code> if neither arguments are sets or 
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
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = s2.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var v = _step.value;

				s1.add(v);
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator.return) {
					_iterator.return();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}

		return s1;
	}
}

/**
 * An immutable set of security restrictions that can be attached to other objects, like auth tokens.
 * 
 * Use the {@link SecurityPolicyBuilder} to create instances of this class with a fluent API.
 */

var SecurityPolicy = function () {

	/**
  * Constructor.
  * 
  * @param {number[]|Set<number>} [nodeIds] the node IDs to restrict to, or <code>null</code> for no restriction
  * @param {string[]|Set<string>} [sourceIds] the source ID to restrict to, or <code>null</code> for no restriction
  * @param {Aggregation[]|Set<Aggregation>} [aggregations] the aggregation names to restrict to, or <code>null</code> for no restriction
  * @param {Aggregation} [minAggregation] if specified, a minimum aggregation level that is allowed
  * @param {Set<LocationPrecision>} [locationPrecisions] the location precision names to restrict to, or <code>null</code> for no restriction
  * @param {LocationPrecision} [minLocationPrecision] if specified, a minimum location precision that is allowed
  * @param {Set<string>} [nodeMetadataPaths] the <code>SolarNodeMetadata</code> paths to restrict to, or <code>null</code> for no restriction
  * @param {Set<string>} [userMetadataPaths] the <code>UserNodeMetadata</code> paths to restrict to, or <code>null</code> for no restriction
  */
	function SecurityPolicy(nodeIds, sourceIds, aggregations, minAggregation, locationPrecisions, minLocationPrecision, nodeMetadataPaths, userMetadataPaths) {
		classCallCheck(this, SecurityPolicy);

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
  * @returns {Set<number>} the node IDs, or <code>null</code>
  */


	createClass(SecurityPolicy, [{
		key: 'toJsonEncoding',


		/**
   * Get this object as a standard JSON encoded string value.
   * 
   * @return {string} the JSON encoded string
   */
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
					result += '&';
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
	}, {
		key: 'nodeIds',
		get: function get$$1() {
			return this._nodeIds;
		}

		/**
   * Get the source IDs.
   * 
   * @returns {Set<string>} the source IDs, or <code>null</code>
   */

	}, {
		key: 'sourceIds',
		get: function get$$1() {
			return this._sourceIds;
		}

		/**
   * Get the aggregations.
   * 
   * @returns {Set<Aggregation>} the aggregations, or <code>null</code>
   */

	}, {
		key: 'aggregations',
		get: function get$$1() {
			return this._aggregations;
		}

		/**
   * Get the location precisions.
   * 
   * @returns {Set<LocationPrecision>} the precisions, or <code>null</code>
   */

	}, {
		key: 'locationPrecisions',
		get: function get$$1() {
			return this._locationPrecisions;
		}

		/**
   * Get the minimum aggregation.
   * 
   * @returns {Aggregation} the minimum aggregation, or <code>null</code>
   */

	}, {
		key: 'minAggregation',
		get: function get$$1() {
			return this._minAggregation;
		}

		/**
   * Get the minimum location precision.
   * 
   * @returns {LocationPrecision} the minimum precision, or <code>null</code>
   */

	}, {
		key: 'minLocationPrecision',
		get: function get$$1() {
			return this._minLocationPrecision;
		}

		/**
   * Get the node metadata paths.
   * 
   * @returns {Set<string>} the node metadata paths, or <code>null</code>
   */

	}, {
		key: 'nodeMetadataPaths',
		get: function get$$1() {
			return this._nodeMetadataPaths;
		}

		/**
   * Get the user metadata paths.
   * 
   * @returns {Set<string>} the user metadata paths, or <code>null</code>
   */

	}, {
		key: 'userMetadataPaths',
		get: function get$$1() {
			return this._userMetadataPaths;
		}
	}]);
	return SecurityPolicy;
}();

var MIN_AGGREGATION_CACHE = new Map(); // Map<string, Set<Aggregation>>
var MIN_LOCATION_PRECISION_CACHE = new Map(); // Map<string, Set<LocationPrecision>>

/**
 * A mutable builder object for {@link SecurityPolicy} instances.
 */
var SecurityPolicyBuilder = function () {
	function SecurityPolicyBuilder() {
		classCallCheck(this, SecurityPolicyBuilder);
	}

	createClass(SecurityPolicyBuilder, [{
		key: 'withPolicy',


		/**
   * Apply all properties from another SecurityPolicy.
   * 
   * @param {SecurityPolicy} policy the SecurityPolicy to apply
   * @returns {SecurityPolicyBuilder} this object
   */
		value: function withPolicy(policy) {
			if (policy) {
				this.withAggregations(policy.aggregations).withMinAggregation(policy.minAggregation).withLocationPrecisions(policy.locationPrecisions).withMinLocationPrecision(policy.minLocationPrecision).withNodeIds(policy.nodeIds).withSourceIds(policy.sourceIds).withNodeMetadataPaths(policy.nodeMetadataPaths).withUserMetadataPaths(policy.userMetadataPaths);
			}
			return this;
		}

		/**
   * Merge all properties from another SecurityPolicy.
   * 
   * @param {SecurityPolicy} policy the SecurityPolicy to merge
   * @returns {SecurityPolicyBuilder} this object
   */

	}, {
		key: 'addPolicy',
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
   * @returns {SecurityPolicyBuilder} this object
   */

	}, {
		key: 'withNodeIds',
		value: function withNodeIds(nodeIds) {
			this.nodeIds = setOrNull(nodeIds);
			return this;
		}

		/**
   * Add a set of node IDs.
   * 
   * @param {number[]|Set<number>} nodeIds the node IDs to add
   * @returns {SecurityPolicyBuilder} this object
   */

	}, {
		key: 'addNodeIds',
		value: function addNodeIds(nodeIds) {
			return this.withNodeIds(mergedSets(this.nodeIds, nodeIds));
		}

		/**
   * Set the node metadata paths.
   * 
   * @param {string[]|Set<string>} nodeMetadataPaths the path expressions to use
   * @returns {SecurityPolicyBuilder} this object
   */

	}, {
		key: 'withNodeMetadataPaths',
		value: function withNodeMetadataPaths(nodeMetadataPaths) {
			this.nodeMetadataPaths = setOrNull(nodeMetadataPaths);
			return this;
		}

		/**
   * Add a set of node metadata paths.
   * 
   * @param {string[]|Set<string>} nodeMetadataPaths the path expressions to add
   * @returns {SecurityPolicyBuilder} this object
   */

	}, {
		key: 'addNodeMetadataPaths',
		value: function addNodeMetadataPaths(nodeMetadataPaths) {
			return this.withNodeMetadataPaths(mergedSets(this.nodeMetadataPaths, nodeMetadataPaths));
		}

		/**
   * Set the user metadata paths.
   * 
   * @param {string[]|Set<string>} userMetadataPaths the path expressions to use
   * @returns {SecurityPolicyBuilder} this object
   */

	}, {
		key: 'withUserMetadataPaths',
		value: function withUserMetadataPaths(userMetadataPaths) {
			this.userMetadataPaths = setOrNull(userMetadataPaths);
			return this;
		}

		/**
   * Add a set of user metadata paths.
   * 
   * @param {string[]|Set<string>} userMetadataPaths the path expressions to add
   * @returns {SecurityPolicyBuilder} this object
   */

	}, {
		key: 'addUserMetadataPaths',
		value: function addUserMetadataPaths(userMetadataPaths) {
			return this.withUserMetadataPaths(mergedSets(this.userMetadataPaths, userMetadataPaths));
		}

		/**
   * Set the source IDs.
   * 
   * @param {string[]|Set<string>} sourceIds the source IDs to use
   * @returns {SecurityPolicyBuilder} this object
   */

	}, {
		key: 'withSourceIds',
		value: function withSourceIds(sourceIds) {
			this.sourceIds = setOrNull(sourceIds);
			return this;
		}

		/**
   * Add source IDs.
   * 
   * @param {string[]|Set<string>} sourceIds the source IDs to add
   * @returns {SecurityPolicyBuilder} this object
   */

	}, {
		key: 'addSourceIds',
		value: function addSourceIds(sourceIds) {
			return this.withSourceIds(mergedSets(this.sourceIds, sourceIds));
		}

		/**
   * Set the aggregations.
   * 
   * @param {Aggregation[]|Set<Aggregation>} aggregations the aggregations to use
   * @returns {SecurityPolicyBuilder} this object
   */

	}, {
		key: 'withAggregations',
		value: function withAggregations(aggregations) {
			this.aggregations = setOrNull(aggregations);
			return this;
		}

		/**
   * Set the aggregations.
   * 
   * @param {Aggregation[]|Set<Aggregation>} aggregations the aggregations to add
   * @returns {SecurityPolicyBuilder} this object
   */

	}, {
		key: 'addAggregations',
		value: function addAggregations(aggregations) {
			return this.withAggregations(mergedSets(this.aggregations, aggregations));
		}

		/**
   * Set the location precisions.
   * 
   * @param {LocationPrecision[]|Set<LocationPrecision>} locationPrecisions the precisions to use
   * @returns {SecurityPolicyBuilder} this object
   */

	}, {
		key: 'withLocationPrecisions',
		value: function withLocationPrecisions(locationPrecisions) {
			this.locationPrecisions = setOrNull(locationPrecisions);
			return this;
		}

		/**
   * Add location precisions.
   * 
   * @param {LocationPrecision[]|Set<LocationPrecision>} locationPrecisions the precisions to add
   * @returns {SecurityPolicyBuilder} this object
   */

	}, {
		key: 'addLocationPrecisions',
		value: function addLocationPrecisions(locationPrecisions) {
			return this.withLocationPrecisions(mergedSets(this.locationPrecisions, locationPrecisions));
		}

		/**
   * Set a minimum aggregation level.
   * 
   * @param {Aggregation} minAggregation the minimum aggregation level to set
   * @returns {SecurityPolicyBuilder} this object
   */

	}, {
		key: 'withMinAggregation',
		value: function withMinAggregation(minAggregation) {
			this.minAggregation = minAggregation;
			return this;
		}

		/**
   * Build the effective aggregation level set from the policy settings.
   * 
   * This computes a set of aggregation levels based on the configured <code>minAggregation</code>
   * and <code>aggregations</code> values.
   * 
   * @returns {Set<Aggregation>} the aggregation set
   * @private
   */

	}, {
		key: 'buildAggregations',
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
   * Treat the configured <code>locationPrecisions</code> set as a single
   * minimum value or a list of exact values.
   * 
   * By default if <code>locationPrecisions</code> is configured with a single
   * value it will be treated as a <em>minimum</em> value, and any
   * {@link LocationPrecision} with a {@link LocationPrecision#precision} equal 
   * to or higher than that value's level will be included in the generated
   * {@link SecurityPolicy#locationPrecisions} set. Set this to
   * <code>null</code> to disable that behavior and treat
   * <code>locationPrecisions</code> as the exact values to include in the
   * generated {@link SecurityPolicy#locationPrecisions} set.
   * 
   * @param {LocationPrecision|null} minLocationPrecision
   *        <code>null</code> to treat configured location precision values
   *        as-is, or else the minimum threshold
   * @returns {SecurityPolicyBuilder} this object
   */

	}, {
		key: 'withMinLocationPrecision',
		value: function withMinLocationPrecision(minLocationPrecision) {
			this.minLocationPrecision = minLocationPrecision;
			return this;
		}

		/**
   * Build the effective aggregation level set from the policy settings.
   * 
   * This computes a set of location precision levels based on the configured <code>minLocationPrecision</code>
   * and <code>locationPrecisions</code> values.
   * 
   * @returns {Set<LocationPrecision>} the precision set
   * @private
   */

	}, {
		key: 'buildLocationPrecisions',
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
   * @returns {SecurityPolicy} the new policy instance
   */

	}, {
		key: 'build',
		value: function build() {
			return new SecurityPolicy(this.nodeIds, this.sourceIds, this.buildAggregations(), this.minAggregation, this.buildLocationPrecisions(), this.minLocationPrecision, this.nodeMetadataPaths, this.userMetadataPaths);
		}
	}]);
	return SecurityPolicyBuilder;
}();

/**
 * A description of a sort applied to a property of a collection.
 */
var SortDescriptor = function () {

    /**
     * Constructor.
     * 
     * @param {string} key the property to sort on
     * @param {boolean} [descending] <code>true</code> to sort in descending order, <code>false</code> for ascending
     */
    function SortDescriptor(key, descending) {
        classCallCheck(this, SortDescriptor);

        this._key = key;
        this._descending = !!descending;
    }

    /**
     * Get the sort property name.
     * 
     * @returns {string} the sort key
     */


    createClass(SortDescriptor, [{
        key: 'toUriEncoding',


        /**
         * Get this object as a standard URI encoded (query parameters) string value.
         * 
         * If <code>index</code> is provided and non-negative, then the query parameters will
         * be encoded as an array property named <code>sortDescriptors</code>. Otherwise just
         * bare <code>key</code> and <code>descending</code> properties will be used. The 
         * <code>descending</code> property is only added if it is <code>true</code>.
         * 
         * @param {number} [index] an optional array property index
         * @param {string} [propertyName=sortDescriptors] an optional array property name, only used if <code>index</code> is also provided
         * @return {string} the URI encoded string
         */
        value: function toUriEncoding(index, propertyName) {
            var result = void 0,
                propName = propertyName || 'sortDescriptors';
            if (index !== undefined && index >= 0) {
                result = encodeURIComponent(propName + '[' + index + '].key') + '=';
            } else {
                result = 'key=';
            }
            result += encodeURIComponent(this.key);
            if (this.descending) {
                if (index !== undefined && index >= 0) {
                    result += '&' + encodeURIComponent(propName + '[' + index + '].descending') + '=true';
                } else {
                    result += '&descending=true';
                }
            }
            return result;
        }
    }, {
        key: 'key',
        get: function get$$1() {
            return this._key;
        }

        /**
         * Get the sorting direction.
         * 
         * @returns {boolean} <code>true</code> if descending order, <code>false</code> for ascending
         */

    }, {
        key: 'descending',
        get: function get$$1() {
            return this._descending;
        }
    }]);
    return SortDescriptor;
}();



var domain = Object.freeze({
	Aggregations: Aggregations,
	Aggregation: Aggregation,
	AuthTokenStatuses: AuthTokenStatuses,
	AuthTokenStatus: AuthTokenStatus,
	AuthTokenTypes: AuthTokenTypes,
	AuthTokenType: AuthTokenType,
	GeneralMetadata: GeneralMetadata,
	stringMapToObject: stringMapToObject,
	objectToStringMap: objectToStringMap,
	InstructionStates: InstructionStates,
	InstructionState: InstructionState,
	LocationPrecisions: LocationPrecisions,
	LocationPrecision: LocationPrecision,
	Pagination: Pagination,
	SecurityPolicy: SecurityPolicy,
	SecurityPolicyBuilder: SecurityPolicyBuilder,
	SortDescriptor: SortDescriptor
});

var timestampFormat = utcFormat("%Y-%m-%d %H:%M:%S.%LZ");

var dateTimeFormat = utcFormat("%Y-%m-%d %H:%M");

var dateTimeUrlFormat = utcFormat("%Y-%m-%dT%H:%M");

var dateFormat = utcFormat("%Y-%m-%d");

var timestampParse = utcParse("%Y-%m-%d %H:%M:%S.%LZ");

var dateTimeParse = utcParse("%Y-%m-%d %H:%M");

/**
 * Parse a UTC date string, from a variety of supported formats.
 *
 * @param {String} str the string to parse into a date
 * @returns {Date} the parsed <code>Date</code>, or <code>null</code> if the date can't be parsed
 */
function dateParser(str) {
	var date = isoParse(str) || timestampParse(str) || dateTimeParse(str);
	return date;
}

/**
 * Format a date into an ISO 8601 timestamp or date string, in the UTC time zone.
 * 
 * @param {Date} date the date to format 
 * @param {boolean} [includeTime=false] <code>true</code> to format as a timestamp, <code>false</code> as just a date
 * @returns {string} the formatted date string
 */
function iso8601Date(date, includeTime) {
	return '' + date.getUTCFullYear() + (date.getUTCMonth() < 9 ? '0' : '') + (date.getUTCMonth() + 1) + (date.getUTCDate() < 10 ? '0' : '') + date.getUTCDate() + (includeTime ? 'T' + (date.getUTCHours() < 10 ? '0' : '') + date.getUTCHours() + (date.getUTCMinutes() < 10 ? '0' : '') + date.getUTCMinutes() + (date.getUTCSeconds() < 10 ? '0' : '') + date.getUTCSeconds() + 'Z' : '');
}



var format = Object.freeze({
	timestampFormat: timestampFormat,
	dateTimeFormat: dateTimeFormat,
	dateTimeUrlFormat: dateTimeUrlFormat,
	dateFormat: dateFormat,
	timestampParse: timestampParse,
	dateTimeParse: dateTimeParse,
	dateParser: dateParser,
	iso8601Date: iso8601Date,
	dateTimeUrlParse: isoParse,
	dateParse: isoParse
});

/**
 * A case-insensitive string key multi-value map object.
 */
var MultiMap = function () {

	/**
  * Constructor.
  * 
  * @param {*} [values] an object who's enumerable properties will be added to this map
  */
	function MultiMap(values) {
		classCallCheck(this, MultiMap);

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
  * @param {*} value the value to add
  * @returns {MultiMap} this object
  */


	createClass(MultiMap, [{
		key: "add",
		value: function add(key, value) {
			return addValue(this, key, value);
		}

		/**
   * Set a value.
   * 
   * This method will replace any existing values with just <code>value</code>.
   * 
   * @param {string} key the key to use
   * @param {*} value the value to set
   * @returns {MultiMap} this object
   */

	}, {
		key: "put",
		value: function put(key, value) {
			return addValue(this, key, value, true);
		}

		/**
   * Set multiple values.
   * 
   * This method will replace any existing values with those provided on <code>values</code>.
   * 
   * @param {*} values an object who's enumerable properties will be added to this map
   * @returns {MultiMap} this object
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
   * @returns {Object[]} the array of values associated with the key, or <code>undefined</code> if not available
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
   * @returns {*} the first available value associated with the key, or <code>undefined</code> if not available
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
   * @returns {MultiMap} this object
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
   * @returns {Object[]} the removed values, or <code>undefined</code> if no values were present for the given key
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
   * @returns {boolean} <code>true</code> if there are no entries in this map
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
   * @returns {boolean} <code>true</code> if there is at least one value associated with the key
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
 * @param {MultiMap} map the map to mutate 
 * @param {string} key the key to change 
 * @param {*} value the value to add
 * @param {boolean} replace if <code>true</code> then replace all existing values;
 *                          if <code>false</code> append to any existing values
 * @returns {MultiMap} the passed in <code>map</code>
 * @private
 */


function addValue(map, key, value, replace) {
	var keyLc = key.toLowerCase();
	var mapping = map.mappings[keyLc];
	if (!mapping) {
		mapping = { key: key, val: [] };
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
 * Properties can be get/set by using the {@link Configuration#value} function.
 */

var Configuration = function () {

	/**
  * Constructor.
  *
  * For any properties passed on <code>initialMap</code>, {@link Configutration#value} will
  * be called so those properties are defined on this instance.
  *
  * @param {Object} initialMap the optional initial properties to store
  */
	function Configuration(initialMap) {
		classCallCheck(this, Configuration);

		this.map = {};
		if (initialMap !== undefined) {
			this.values(initialMap);
		}
	}

	/**
  * Test if a key is truthy.
  *
  * @param {String} key the key to test
  * @returns {Boolean} <code>true</code> if the key is enabled
  */


	createClass(Configuration, [{
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
   * <p>If the <em>enabled</em> parameter is not passed, then the enabled
   * status will be toggled to its opposite value.</p>
   *
   * @param {String} key they key to set
   * @param {Boolean} enabled the optional enabled value to set
   * @returns {Configuration} this object to allow method chaining
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
   * @param {String} key The key to get or set the value for
   * @param {Object} [newValue] If defined, the new value to set for the given <code>key</code>.
   *                            If <code>null</code> then the value will be removed.
   * @returns {Object} If called as a getter, the associated value for the given <code>key</code>,
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
   * @param {Object} [newMap] a map of values to set
   * @returns {Object} if called as a getter, all properties of this object copied into a simple object;
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
 * An environment configuration utility object.
 *
 * This extends <code>Configuration</code> to add support for standard properties
 * needed to access the SolarNetwork API, such as host and protocol values.
 *
 * @extends Configuration
 */

var Environment = function (_Configuration) {
	inherits(Environment, _Configuration);

	/**
  * Constructor.
  *
  * This will define the following default properties, if not supplied on the
  * <code>config</code> argument:
  *
  * <dl>
  * <dt>host</dt><dd><code>data.solarnetwork.net</code></dd>
  * <dt>protocol</dt><dd><code>https</code></dd>
  * <dt>port</dt><dd><code>443</code></dd>
  * </dl>
  *
  * @param {Object} [config] an optional set of properties to start with
  */
	function Environment(config) {
		classCallCheck(this, Environment);
		return possibleConstructorReturn(this, (Environment.__proto__ || Object.getPrototypeOf(Environment)).call(this, Object.assign({
			protocol: 'https',
			host: 'data.solarnetwork.net',
			port: config && config.port ? config.port : config && config.protocol ? config.protocol === 'https' ? 443 : 80 : 443
		}, config)));
	}

	/**
 * Check if TLS is in use via the <code>https</code> protocol.
 *
  * @returns {boolean} <code>true</code> if the <code>protocol</code> is set to <code>https</code>
  */


	createClass(Environment, [{
		key: 'useTls',
		value: function useTls() {
			return this.value('protocol') === 'https';
		}
	}]);
	return Environment;
}(Configuration);

var HttpMethod = Object.freeze({
	GET: 'GET',
	HEAD: 'HEAD',
	POST: 'POST',
	PUT: 'PUT',
	PATCH: 'PATCH',
	DELETE: 'DELETE',
	OPTIONS: 'OPTIONS',
	TRACE: 'TRACE'
});

/**
 * Support for HTTP headers.
 * 
 * @extends MultiMap
 */

var HttpHeaders = function (_MultiMap) {
	inherits(HttpHeaders, _MultiMap);

	function HttpHeaders() {
		classCallCheck(this, HttpHeaders);
		return possibleConstructorReturn(this, (HttpHeaders.__proto__ || Object.getPrototypeOf(HttpHeaders)).call(this));
	}

	return HttpHeaders;
}(MultiMap);

Object.defineProperties(HttpHeaders, {
	/**
  * The <code>Content-MD5</code> header.
  * 
  * @memberof HttpHeaders
  * @readonly
  * @type {string}
  */
	'CONTENT_MD5': { value: 'Content-MD5' },

	/**
  * The <code>Content-Type</code> header.
  * 
  * @memberof HttpHeaders
  * @readonly
  * @type {string}
  */
	'CONTENT_TYPE': { value: 'Content-Type' },

	/**
  * The <code>Date</code> header.
  * 
  * @memberof HttpHeaders
  * @readonly
  * @type {string}
  */
	'DATE': { value: 'Date' },

	/**
  * The <code>Digest</code> header.
  * 
  * @memberof HttpHeaders
  * @readonly
  * @type {string}
  */
	'DIGEST': { value: 'Digest' },

	/**
  * The <code>Host</code> header.
  * 
  * @memberof HttpHeaders
  * @readonly
  * @type {string}
  */
	'HOST': { value: 'Host' },

	/**
  * The <code>X-SN-Date</code> header.
  * 
  * @memberof HttpHeaders
  * @readonly
  * @type {string}
  */
	'X_SN_DATE': { value: 'X-SN-Date' }
});

/**
 * Parse the query portion of a URL string, and return a parameter object for the
 * parsed key/value pairs.
 *
 * <p>Multiple parameters of the same name will be stored as an array on the returned object.</p>
 *
 * @param {String} search the query portion of the URL, which may optionally include
 *                        the leading '?' character
 * @return {Object} the parsed query parameters, as a parameter object
 */
function urlQueryParse(search) {
    var params = {};
    var pairs;
    var pair;
    var i, len, k, v;
    if (search !== undefined && search.length > 0) {
        // remove any leading ? character
        if (search.match(/^\?/)) {
            search = search.substring(1);
        }
        pairs = search.split('&');
        for (i = 0, len = pairs.length; i < len; i++) {
            pair = pairs[i].split('=', 2);
            if (pair.length === 2) {
                k = decodeURIComponent(pair[0]);
                v = decodeURIComponent(pair[1]);
                if (params[k]) {
                    if (!Array.isArray(params[k])) {
                        params[k] = [params[k]]; // turn into array;
                    }
                    params[k].push(v);
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
 * <p>The optional <code>encoderFn</code> argument is a function that accepts a string value
 * and should return a URI-safe string for that value.</p>
 *
 * @param {Object} parameters an object to encode as URL parameters
 * @param {Function} encoderFn an optional function to encode each URI component with;
 *                             if not provided the built-in encodeURIComponent() function
 *                             will be used
 * @return {String} the encoded query parameters
 */
function urlQueryEncode(parameters, encoderFn) {
    var result = '',
        prop,
        val,
        i,
        len;
    var encoder = encoderFn || encodeURIComponent;
    function handleValue(k, v) {
        if (result.length) {
            result += '&';
        }
        result += encoder(k) + '=' + encoder(v);
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
 */

var AuthorizationV2Builder = function () {

    /**
     * Constructor.
     * 
     * @param {string} token the auth token to use
     * @param {Environment} [environment] the environment to use; if not provided a default environment will be created 
     */
    function AuthorizationV2Builder(token, environment) {
        classCallCheck(this, AuthorizationV2Builder);

        this.tokenId = token;
        this.environment = environment || new Environment();
        this.reset();
    }

    /**
     * Reset to defalut property values.
     *
     * @returns {AuthorizationV2Builder} this object
     */


    createClass(AuthorizationV2Builder, [{
        key: 'reset',
        value: function reset() {
            this.contentDigest = null;
            this.httpHeaders = new HttpHeaders();
            this.parameters = new MultiMap();
            this.signedHeaderNames = [];
            var host = this.environment.host;
            if (this.environment.protocol === 'https' || this.environment.port != 80) {
                host += ':' + this.environment.port;
            }
            return this.method(HttpMethod.GET).host(host).path('/').date(new Date());
        }

        /**
         * Compute and cache the signing key.
         *
         * Signing keys are derived from the token secret and valid for 7 days, so
         * this method can be used to compute a signing key so that {@link AuthorizationV2Builder#build}
         * can be called later. The signing date will be set to whatever date is
         * currently configured via {@link AuthorizationV2Builder#date}, which defaults to the
         * current time for newly created builder instances.
         *
         * @param {string} tokenSecret the secret to sign the digest with
         * @returns {AuthorizationV2Builder} this object
         */

    }, {
        key: 'saveSigningKey',
        value: function saveSigningKey(tokenSecret) {
            this.signingKey = this.computeSigningKey(tokenSecret);
            return this;
        }

        /**
         * Set the HTTP method (verb) to use.
         *
         * @param {string} val the method to use; see the {@link HttpMethod} enum for possible values
         * @returns {AuthorizationV2Builder} this object
         */

    }, {
        key: 'method',
        value: function method(val) {
            this.httpMethod = val;
            return this;
        }

        /**
         * Set the HTTP host.
         *
         * This is a shortcut for calling <code>HttpHeaders#put(HttpHeaders.HOST, val)</code>.
         *
         * @param {string} val the HTTP host value to use
         * @returns {AuthorizationV2Builder} this object
         */

    }, {
        key: 'host',
        value: function host(val) {
            this.httpHeaders.put(HttpHeaders.HOST, val);
            return this;
        }

        /**
         * Set the HTTP request path to use.
         *
         * @param {string} val the request path to use
         * @returns {AuthorizationV2Builder} this object
         */

    }, {
        key: 'path',
        value: function path(val) {
            this.requestPath = val;
            return this;
        }

        /**
         * Set the host, path, and query parameters via a URL string.
         *
         * @param {string} url the URL value to use
         * @returns {AuthorizationV2Builder} this object
         */

    }, {
        key: 'url',
        value: function url(_url) {
            var uri = parse(_url);
            var host = uri.host;
            if (uri.port && (uri.scheme === 'https' && uri.port !== 443 || uri.scheme === 'http' && uri.port !== 80)) {
                host += ':' + uri.port;
            }
            if (uri.query) {
                this.queryParams(urlQueryParse(uri.query));
            }
            return this.host(host).path(uri.path);
        }

        /**
         * Set the HTTP content type.
         *
         * This is a shortcut for calling {@link HttpHeaders#put} with the key {@link HttpHeaders#CONTENT_TYPE}.
         *
         * @param {string} val the HTTP content type value to use
         * @returns {AuthorizationV2Builder} this object
         */

    }, {
        key: 'contentType',
        value: function contentType(val) {
            this.httpHeaders.put(HttpHeaders.CONTENT_TYPE, val);
            return this;
        }

        /**
         * Set the authorization request date.
         *
         * @param {Date} val the date to use; typically the current time, e.g. <code>new Date()</code>
         * @returns {AuthorizationV2Builder} this object
         */

    }, {
        key: 'date',
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
        key: 'snDate',


        /**
         * Set the <code>useSnDate</code> property.
         *
         * @param {boolean} enabled <code>true</code> to use the <code>X-SN-Date</code> header, <code>false</code> to use <code>Date</code>
         * @returns {AuthorizationV2Builder} this object
         */
        value: function snDate(enabled) {
            this.useSnDate = enabled;
            return this;
        }

        /**
         * Set a HTTP header value.
         *
         * This is a shortcut for calling <code>HttpHeaders#put(headerName, val)</code>.
         *
         * @param {string} headerName the header name to set
         * @param {string} headerValue the header value to set
         * @returns {AuthorizationV2Builder} this object
         */

    }, {
        key: 'header',
        value: function header(headerName, headerValue) {
            this.httpHeaders.put(headerName, headerValue);
            return this;
        }

        /**
         * Set the HTTP headers to use with the request.
         *
         * The headers object must include all headers necessary by the
         * authentication scheme, and any additional headers also configured via
         * {@link AuthorizationV2Builder#signedHttpHeaders}.
         *
         * @param {HttpHeaders} headers the HTTP headers to use
         * @returns {AuthorizationV2Builder} this object
         */

    }, {
        key: 'headers',
        value: function headers(_headers) {
            this.httpHeaders = _headers;
            return this;
        }

        /**
         * Set the HTTP <code>GET</code> query parameters, or <code>POST</code> form-encoded
         * parameters.
         *
         * @param {MultiMap|Object} params the parameters to use, as either a {@link MultiMap} or simple <code>Object</code>
         * @returns {AuthorizationV2Builder} this object
         */

    }, {
        key: 'queryParams',
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
         * @returns {AuthorizationV2Builder} this object
         */

    }, {
        key: 'signedHttpHeaders',
        value: function signedHttpHeaders(signedHeaderNames) {
            this.signedHeaderNames = signedHeaderNames;
            return this;
        }

        /**
         * Set the HTTP request body content SHA-256 digest value.
         *
         * @param {string|WordArray} digest the digest value to use; if a string it is assumed to be Hex encoded
         * @returns {AuthorizationV2Builder} this object
         */

    }, {
        key: 'contentSHA256',
        value: function contentSHA256(digest) {
            var contentDigest;
            if (typeof digest === 'string') {
                contentDigest = Hex.parse(digest);
            } else {
                contentDigest = digest;
            }
            this.contentDigest = contentDigest;
            return this;
        }

        /**
         * Compute the canonical query parameters.
         * 
         * @returns {string} the canonical query parameters string value
         */

    }, {
        key: 'canonicalQueryParameters',
        value: function canonicalQueryParameters() {
            var keys = this.parameters.keySet();
            if (keys.length < 1) {
                return '';
            }
            keys.sort();
            var len = keys.length;
            var first = true,
                result = '';
            for (var i = 0; i < len; i += 1) {
                var key = keys[i];
                var vals = this.parameters.value(key);
                var valsLen = vals.length;
                for (var j = 0; j < valsLen; j += 1) {
                    if (first) {
                        first = false;
                    } else {
                        result += '&';
                    }
                    result += _encodeURIComponent(key) + '=' + _encodeURIComponent(vals[j]);
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
        key: 'canonicalHeaders',
        value: function canonicalHeaders(sortedLowercaseHeaderNames) {
            var result = '',
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
                result += headerName + ':' + (headerValue ? headerValue.trim() : '') + '\n';
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
        key: 'canonicalSignedHeaderNames',
        value: function canonicalSignedHeaderNames(sortedLowercaseHeaderNames) {
            return sortedLowercaseHeaderNames.join(';');
        }

        /**
         * Get the canonical request content SHA256 digest, hex encoded.
         * 
         * @returns {string} the hex-encoded SHA256 digest of the request content
         */

    }, {
        key: 'canonicalContentSHA256',
        value: function canonicalContentSHA256() {
            return this.contentDigest ? Hex.stringify(this.contentDigest) : AuthorizationV2Builder.EMPTY_STRING_SHA256_HEX;
        }

        /**
         * Compute the canonical HTTP header names to include in the signature.
         * 
         * @returns {string[]} the sorted, lower-cased HTTP header names to include
         */

    }, {
        key: 'canonicalHeaderNames',
        value: function canonicalHeaderNames() {
            var httpHeaders = this.httpHeaders;
            var signedHeaderNames = this.signedHeaderNames;

            // use a MultiMap to take advantage of case-insensitive keys
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
        key: 'buildCanonicalRequestData',
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
        key: 'computeCanonicalRequestData',
        value: function computeCanonicalRequestData(sortedLowercaseHeaderNames) {
            // 1: HTTP verb
            var result = this.httpMethod + '\n';

            // 2: Canonical URI
            result += this.requestPath + '\n';

            // 3: Canonical query string
            result += this.canonicalQueryParameters() + '\n';

            // 4: Canonical headers
            result += this.canonicalHeaders(sortedLowercaseHeaderNames); // already includes newline

            // 5: Signed header names
            result += this.canonicalSignedHeaderNames(sortedLowercaseHeaderNames) + '\n';

            // 6: Content SHA256, hex encoded
            result += this.canonicalContentSHA256();

            return result;
        }

        /**
         * Compute the signing key, from a secret key.
         * 
         * @param {string} secretKey the secret key string 
         * @returns {CryptoJS#Hash} the computed key
         * @private
         */

    }, {
        key: 'computeSigningKey',
        value: function computeSigningKey(secretKey) {
            var datestring = iso8601Date(this.requestDate);
            var key = HmacSHA256('snws2_request', HmacSHA256(datestring, 'SNWS2' + secretKey));
            return key;
        }

        /**
         * Compute the data to be signed by the signing key.
         * 
         * @param {string} canonicalRequestData the request data, returned from {@link AuthorizationV2Builder#buildCanonicalRequestData}
         * @returns {string} the data to sign
         * @private
         */

    }, {
        key: 'computeSignatureData',
        value: function computeSignatureData(canonicalRequestData) {
            /*- signature data is like:
                 SNWS2-HMAC-SHA256\n
                20170301T120000Z\n
                Hex(SHA256(canonicalRequestData))
            */
            return "SNWS2-HMAC-SHA256\n" + iso8601Date(this.requestDate, true) + "\n" + Hex.stringify(SHA256(canonicalRequestData));
        }

        /**
         * Compute a HTTP <code>Authorization</code> header value from the configured properties
         * on the builder, using the provided signing key.
         * 
         * @param {CryptoJS#Hash} signingKey the key to sign the computed signature data with
         * @returns {string} the SNWS2 HTTP Authorization header value
         * @private
         */

    }, {
        key: 'buildWithKey',
        value: function buildWithKey(signingKey) {
            var sortedHeaderNames = this.canonicalHeaderNames();
            var canonicalReq = this.computeCanonicalRequestData(sortedHeaderNames);
            var signatureData = this.computeSignatureData(canonicalReq);
            var signature = Hex.stringify(HmacSHA256(signatureData, signingKey));
            var result = 'SNWS2 Credential=' + this.tokenId + ',SignedHeaders=' + sortedHeaderNames.join(';') + ',Signature=' + signature;
            return result;
        }

        /**
         * Compute a HTTP <code>Authorization</code> header value from the configured
         * properties on the builder, computing a new signing key based on the
         * configured {@link AuthorizationV2Builder#date}.
         *
         * @param {string} tokenSecret the secret to sign the authorization with
         * @return {string} the SNWS2 HTTP Authorization header value
         */

    }, {
        key: 'build',
        value: function build(tokenSecret) {
            var signingKey = this.computeSigningKey(tokenSecret);
            return this.buildWithKey(signingKey);
        }

        /**
         * Compute a HTTP <code>Authorization</code> header value from the configured
         * properties on the builder, using a signing key configured from a previous
         * call to {@link AuthorizationV2Builder#saveSigningKey}.
         *
         * @return {string} the SNWS2 HTTP Authorization header value.
         */

    }, {
        key: 'buildWithSavedKey',
        value: function buildWithSavedKey() {
            return this.buildWithKey(this.signingKey);
        }
    }, {
        key: 'requestDateHeaderValue',
        get: function get$$1() {
            return this.requestDate.toUTCString();
        }

        /**
         * Control using the <code>X-SN-Date</code> HTTP header versus the <code>Date</code> header.
         *
         * <p>Set to <code>true</code> to use the <code>X-SN-Date</code> header, <code>false</code> to use 
         * the <code>Date</code> header. This will return <code>true</code> if <code>X-SN-Date</code> has been
         * added to the <code>signedHeaderNames</code> property or has been added to the <code>httpHeaders</code>
         * property.</p>
         *
         * @type {boolean}
         */

    }, {
        key: 'useSnDate',
        get: function get$$1() {
            var signedHeaders = this.signedHeaderNames;
            var existingIndex = Array.isArray(signedHeaders) ? signedHeaders.findIndex(caseInsensitiveEqualsFn(HttpHeaders.X_SN_DATE)) : -1;
            return existingIndex >= 0 || this.httpHeaders.containsKey(HttpHeaders.X_SN_DATE);
        },
        set: function set$$1(enabled) {
            var signedHeaders = this.signedHeaderNames;
            var existingIndex = Array.isArray(signedHeaders) ? signedHeaders.findIndex(caseInsensitiveEqualsFn(HttpHeaders.X_SN_DATE)) : -1;
            if (enabled && existingIndex < 0) {
                signedHeaders = signedHeaders ? signedHeaders.concat(HttpHeaders.X_SN_DATE) : [HttpHeaders.X_SN_DATE];
                this.signedHeaderNames = signedHeaders;
            } else if (!enabled && existingIndex >= 0) {
                signedHeaders.splice(existingIndex, 1);
                this.signedHeaderNames = signedHeaders;
            }

            // also clear from httpHeaders
            this.httpHeaders.remove(HttpHeaders.X_SN_DATE);
        }
    }]);
    return AuthorizationV2Builder;
}();

/**
 * @function stringMatchFn
 * @param {string} e the element to test
 * @returns {boolean} <code>true</code> if the element matches
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
    return '%' + c.charCodeAt(0).toString(16);
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
    EMPTY_STRING_SHA256_HEX: { value: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },

    /**
     * The SolarNetwork V2 authorization scheme.
     * 
     * @memberof AuthorizationV2Builder
     * @readonly
     * @type {string}
     */
    SNWS2_AUTH_SCHEME: { value: 'SNWS2' }
});

/**
 * A utility class for helping to compose SolarNet URLs for the REST API.
 *
 * This class is essentially abstract and meant to have mixin helper objects extend it.
 */

var UrlHelper = function () {

    /**
     * Constructor.
     *
     * @param {Environment|Object} [environment] the optional initial environment to use;
     *        if a non-<code>Environment</code> object is passed then the properties of that object will
     *        be used to construct a new <code>Environment</code> instance
     */
    function UrlHelper(environment) {
        classCallCheck(this, UrlHelper);

        var env = environment instanceof Environment ? environment : new Environment(environment);
        this.environment = env;
        this._parameters = new Configuration();
    }

    /**
     * Get a parameters object that can be used to hold URL variables.
     * 
     * @readonly
     * @type {Configuration}
     */


    createClass(UrlHelper, [{
        key: 'env',


        /**
         * Get or set an environment parameter.
         * 
         * This is a shortcut for calling {@link Configuration#value} on the
         * <code>environment</code> object.
         * 
         * @param {string} key the environment parameter name to get
         * @param {Object} [val] the optional value to set
         * @returns {Object} when called as a getter, the environment parameter value;
         *                   when called as a setter, the environment parameters object
         */
        value: function env() {
            var _environment;

            return (_environment = this.environment).value.apply(_environment, arguments);
        }

        /**
         * Get or set a parameter.
         * 
         * This is a shortcut for calling {@link Configuration#value} on the
         * <code>parameters</code> object.
         * 
         * @param {string} key the parameter name to get
         * @param {Object} [val] the optional value to set
         * @returns {Object} when called as a getter, the parameter value;
         *                   when called as a setter, the parameters object
         */

    }, {
        key: 'parameter',
        value: function parameter() {
            var _parameters;

            return (_parameters = this._parameters).value.apply(_parameters, arguments);
        }

        /**
         * Get a URL for just the SolarNet host, without any path.
         *
         * @returns {string} the URL to the SolarNet host
         */

    }, {
        key: 'hostUrl',
        value: function hostUrl() {
            var tls = this.environment.useTls();
            var port = +this.environment.value('port');
            var url = 'http' + (tls ? 's' : '') + '://' + this.environment.value('host');
            if (tls && port > 0 && port !== 443 || !tls && port > 0 && port !== 80) {
                url += ':' + port;
            }
            return url;
        }

        /**
         * Get the base URL to the REST API.
         * 
         * This implementation is a stub, meant for subclasses to override. This implementation
            * simply returns {@link UrlHelper#hostUrl}.
         * 
            * @abstract
         * @returns {string} the base URL to the REST API
         */

    }, {
        key: 'baseUrl',
        value: function baseUrl() {
            return this.hostUrl();
        }

        /**
         * Replace occurances of URL template variables with values from the <code>parameters</code>
         * property and append to the host URL.
         * 
         * This method provides a way to resolve an absolute URL based on the configured
         * environment and parameters on this object.
         * 
         * @param {string} template a URL path template
         * @returns {string} an absolute URL
         * @see UrlHelper#resolveTemplateUrl
         */

    }, {
        key: 'resolveTemplatePath',
        value: function resolveTemplatePath(template) {
            return this.hostUrl() + this.resolveTemplateUrl(template);
        }

        /**
        * Replace occurances of URL template variables with values from the <code>parameters</code>
        * property.
        * 
        * URL template variables are specified as <code>{<em>name</em>}</code>. The variable
        * will be replaced by the value associated with property <code>name</code> in the
        * <code>parameters</code> object. The value will be URI encoded.
        * 
        * @param {string} template a URL template
        * @returns {string} the URL with template variables resolved
        */

    }, {
        key: 'resolveTemplateUrl',
        value: function resolveTemplateUrl(template) {
            return UrlHelper.resolveTemplateUrl(template, this._parameters);
        }

        /**
         * Replace occurances of URL template variables with values from a parameter object.
         * 
         * URL template variables are specified as <code>{<em>name</em>}</code>. The variable
         * will be replaced by the value associated with property <code>name</code> in the
         * provided parameter object. The value will be URI encoded.
         * 
         * @param {string} template a URL template
         * @param {Object} params an object whose properties should serve as template variables
         * @returns {string} the URL
         */

    }, {
        key: 'parameters',
        get: function get$$1() {
            return this._parameters;
        }
    }], [{
        key: 'resolveTemplateUrl',
        value: function resolveTemplateUrl(template, params) {
            return template.replace(/\{([^}]+)\}/g, function (match, variableName) {
                var variableValue = params[variableName];
                return variableValue !== undefined ? encodeURIComponent(variableValue) : '';
            });
        }
    }]);
    return UrlHelper;
}();

var NodeIdsKey = 'nodeIds';

var SourceIdsKey = 'sourceIds';

/**
 * A mixin class that adds support for SolarNode properties to a {@link UrlHelper}.
 * 
 * @param {UrlHelper} superclass the UrlHelper class to mix onto
 * @mixin
 * @property {number} nodeId the first available node ID from the <code>nodeIds</code> property;
 *                           setting this replaces any existing node IDs with an array of just that value
 * @property {number[]} nodeIds an array of node IDs, set on the <code>nodeIds</code> parameter
 * @property {string} sourceId the first available source ID from the <code>sourceIds</code> property;
 *                             setting this replaces any existing node IDs with an array of just that value 
 * @property {string[]} sourceIds an array of source IDs, set on the <code>sourceIds</code> parameter
 * @returns {*} the mixin
 */
var NodeUrlHelperMixin = function NodeUrlHelperMixin(superclass) {
    return function (_superclass) {
        inherits(_class, _superclass);

        function _class() {
            classCallCheck(this, _class);
            return possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
        }

        createClass(_class, [{
            key: 'nodeId',
            get: function get$$1() {
                var nodeIds = this.parameter(NodeIdsKey);
                return Array.isArray(nodeIds) && nodeIds.length > 0 ? nodeIds[0] : null;
            },
            set: function set$$1(nodeId) {
                this.parameter(NodeIdsKey, [nodeId]);
            }
        }, {
            key: 'nodeIds',
            get: function get$$1() {
                return this.parameter(NodeIdsKey);
            },
            set: function set$$1(nodeIds) {
                this.parameter(NodeIdsKey, nodeIds);
            }
        }, {
            key: 'sourceId',
            get: function get$$1() {
                var sourceIds = this.parameter(SourceIdsKey);
                return Array.isArray(sourceIds) && sourceIds.length > 0 ? sourceIds[0] : null;
            },
            set: function set$$1(sourceId) {
                this.parameter(SourceIdsKey, [sourceId]);
            }
        }, {
            key: 'sourceIds',
            get: function get$$1() {
                return this.parameter(SourceIdsKey);
            },
            set: function set$$1(sourceIds) {
                this.parameter(SourceIdsKey, sourceIds);
            }
        }]);
        return _class;
    }(superclass);
};

/** The SolarQuery default path. */
var SolarQueryDefaultPath = '/solarquery';

/** The {@link UrlHelper} parameters key for the SolarQuery path. */
var SolarQueryPathKey = 'solarQueryPath';

/** The SolarUser REST API path. */
var SolarQueryApiPathV1 = '/api/v1';

/** 
 * The {@link UrlHelper} parameters key that holds a <code>boolean</code> flag to
 * use the public path scheme (<code>/pub</code>) when constructing URLs.
 */
var SolarQueryPublicPathKey = 'publicQuery';

/**
 * A mixin class that adds SolarQuery specific support to {@link UrlHelper}.
 * 
 * @param {UrlHelper} superclass the UrlHelper class to mix onto
 * @mixin
 * @returns {*} the mixin
 */
var QueryUrlHelperMixin = function QueryUrlHelperMixin(superclass) {
  return function (_superclass) {
    inherits(_class, _superclass);

    function _class() {
      classCallCheck(this, _class);
      return possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
    }

    createClass(_class, [{
      key: 'baseUrl',


      /**
       * Get the base URL to the SolarQuery v1 REST API.
       * 
       * The returned URL uses the configured environment to resolve
       * the <code>hostUrl</code>, the <code>solarQueryPath</code> context path,
          * and the <code>publicQuery</code> boolean flag. If the context path is not 
          * available, it will default to <code>/solarquery</code>.
       * 
       * @returns {string} the base URL to SolarQuery
       * @memberof QueryUrlHelperMixin#
       */
      value: function baseUrl() {
        var path = this.env(SolarQueryPathKey) || SolarQueryDefaultPath;
        var isPubPath = !!this.env(SolarQueryPublicPathKey);
        return this.hostUrl() + path + SolarQueryApiPathV1 + (isPubPath ? '/pub' : '/sec');
      }
    }]);
    return _class;
  }(superclass);
};

/**
 * A mixin class that adds SolarNode datum metadata support to {@link UrlHelper}.
 * 
 * <p>Datum metadata is metadata associated with a specific node and source, i.e. 
 * a <code>nodeId</code> and a <code>sourceId</code>.
 * 
 * @param {UrlHelper} superclass the UrlHelper class to mix onto
 * @mixin
 * @returns {*} the mixin
 */
var DatumMetadataUrlHelperMixin = function DatumMetadataUrlHelperMixin(superclass) {
    return function (_superclass) {
        inherits(_class, _superclass);

        function _class() {
            classCallCheck(this, _class);
            return possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
        }

        createClass(_class, [{
            key: 'baseDatumMetadataUrl',


            /**
             * Get a base URL for datum metadata operations using a specific node ID.
             * 
             * @param {number} [nodeId] a specific node ID to use; if not provided the <code>nodeId</code> property of this class will be used
             * @returns {string} the base URL
             * @private
             * @memberof DatumMetadataUrlHelperMixin#
             */
            value: function baseDatumMetadataUrl(nodeId) {
                return this.baseUrl() + '/datum/meta/' + (nodeId || this.nodeId);
            }
        }, {
            key: 'datumMetadataUrlWithSource',
            value: function datumMetadataUrlWithSource(nodeId, sourceId) {
                var result = this.baseDatumMetadataUrl(nodeId);
                var source = sourceId || this.sourceId;
                if (sourceId !== null && source) {
                    result += '?sourceId=' + encodeURIComponent(source);
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
                * @memberof DatumMetadataUrlHelperMixin#
             */

        }, {
            key: 'viewDatumMetadataUrl',
            value: function viewDatumMetadataUrl(nodeId, sourceId) {
                return this.datumMetadataUrlWithSource(nodeId, sourceId);
            }

            /**
             * Generate a URL for adding (merging) datum metadata via a <code>POST</code> request.
                * 
             * @param {number} [nodeId] a specific node ID to use; if not provided the <code>nodeId</code> property of this class will be used
             * @param {string} [sourceId] a specific source ID to use; if not provided the <code>sourceId</code> property of this class will be used
                * @returns {string} the URL
                * @memberof DatumMetadataUrlHelperMixin#
             */

        }, {
            key: 'addDatumMetadataUrl',
            value: function addDatumMetadataUrl(nodeId, sourceId) {
                return this.datumMetadataUrlWithSource(nodeId, sourceId);
            }

            /**
             * Generate a URL for setting datum metadata via a <code>PUT</code> request.
                * 
             * @param {number} [nodeId] a specific node ID to use; if not provided the <code>nodeId</code> property of this class will be used
             * @param {string} [sourceId] a specific source ID to use; if not provided the <code>sourceId</code> property of this class will be used
                * @returns {string} the URL
                * @memberof DatumMetadataUrlHelperMixin#
             */

        }, {
            key: 'replaceDatumMetadataUrl',
            value: function replaceDatumMetadataUrl(nodeId, sourceId) {
                return this.datumMetadataUrlWithSource(nodeId, sourceId);
            }

            /**
             * Generate a URL for deleting datum metadata via a <code>DELETE</code> request.
                * 
             * @param {number} [nodeId] a specific node ID to use; if not provided the <code>nodeId</code> property of this class will be used
             * @param {string} [sourceId] a specific source ID to use; if not provided the <code>sourceId</code> property of this class will be used
                * @returns {string} the URL
                * @memberof DatumMetadataUrlHelperMixin#
             */

        }, {
            key: 'deleteDatumMetadataUrl',
            value: function deleteDatumMetadataUrl(nodeId, sourceId) {
                return this.datumMetadataUrlWithSource(nodeId, sourceId);
            }

            /**
             * Generate a URL for searching for datum metadata.
             * 
             * @param {number} [nodeId] a specific node ID to use; if not provided the <code>nodeId</code> property of this class will be used
             * @param {string} [sourceId] a specific source ID to use; 
                *                            if not provided the <code>sourceId</code> property of this class will be used;
                *                            if <code>null</code> then ignore any <code>sourceId</code> property of this class
             * @param {SortDescriptor[]} [sorts] optional sort settings to use
             * @param {Pagination} [pagination] optional pagination settings to use
             * @returns {string} the URL
             * @memberof DatumMetadataUrlHelperMixin#
             */

        }, {
            key: 'findDatumMetadataUrl',
            value: function findDatumMetadataUrl(nodeId, sourceId, sorts, pagination) {
                var result = this.baseDatumMetadataUrl(nodeId);
                var params = '';
                var source = sourceId || this.sourceId;
                if (sourceId !== null && source) {
                    params += 'sourceId=' + encodeURIComponent(source);
                }
                if (Array.isArray(sorts)) {
                    sorts.forEach(function (sort, i) {
                        if (sort instanceof SortDescriptor) {
                            if (params.length > 0) {
                                params += '&';
                            }
                            params += sort.toUriEncoding(i);
                        }
                    });
                }
                if (pagination instanceof Pagination) {
                    if (params.length > 0) {
                        params += '&';
                    }
                    params += pagination.toUriEncoding();
                }
                if (params.length > 0) {
                    result += '?' + params;
                }
                return result;
            }
        }]);
        return _class;
    }(superclass);
};

/**
 * A concrete {@link UrlHelper} with the {@link DatumMetadataUrlHelperMixin},  {@link QueryUrlHelperMixin}, and
 * {@link NodeUrlHelperMixin} mixins.
 * 
 * @mixes DatumMetadataUrlHelperMixin
 * @mixes QueryUrlHelperMixin
 * @mixes NodeUrlHelperMixin
 * @extends UrlHelper
 */
var DatumMetadataUrlHelper = function (_DatumMetadataUrlHelp) {
    inherits(DatumMetadataUrlHelper, _DatumMetadataUrlHelp);

    function DatumMetadataUrlHelper() {
        classCallCheck(this, DatumMetadataUrlHelper);
        return possibleConstructorReturn(this, (DatumMetadataUrlHelper.__proto__ || Object.getPrototypeOf(DatumMetadataUrlHelper)).apply(this, arguments));
    }

    return DatumMetadataUrlHelper;
}(DatumMetadataUrlHelperMixin(QueryUrlHelperMixin(NodeUrlHelperMixin(UrlHelper))));

/**
 * A mixin class that adds SolarNode datum query support to {@link UrlHelper}.
 *
 * @param {UrlHelper} superclass the UrlHelper class to mix onto
 * @mixin
 * @returns {*} the mixin
 */
var NodeDatumUrlHelperMixin = function NodeDatumUrlHelperMixin(superclass) {
	return function (_superclass) {
		inherits(_class, _superclass);

		function _class() {
			classCallCheck(this, _class);
			return possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
		}

		createClass(_class, [{
			key: 'reportableIntervalUrl',


			/**
    * Generate a URL for the "reportable interval" for a node, optionally limited to a specific set of source IDs.
    *
       * If no source IDs are provided, then the reportable interval query will return an interval for
       * all available sources.
       *
    * @param {number} [nodeId] a specific node ID to use; if not provided the <code>nodeId</code> property of this class will be used
    * @param {string[]} [sourceIds] an array of source IDs to limit query to; if not provided the <code>sourceIds</code> property of this class will be used
    * @returns {string} the URL
    * @memberof NodeDatumUrlHelperMixin#
    */
			value: function reportableIntervalUrl(nodeId, sourceIds) {
				var url = this.baseUrl() + '/range/interval?nodeId=' + (nodeId || this.nodeId);
				var sources = sourceIds || this.sourceIds;
				if (Array.isArray(sources) && sources.length > 0) {
					url += '&sourceIds=' + sources.map(function (e) {
						return encodeURIComponent(e);
					}).join(',');
				}
				return url;
			}

			/**
    * Generate a URL for finding the available source IDs for a node or metadata filter.
    * 
    * @param {number|number[]} [nodeId] a specific node ID, or array of node IDs, to use; if not provided the 
    *                                   <code>nodeIds</code> property of this class will be used, unless <code>null</code>
    *                                   is passed in which case no node IDs will be added to the URL
    * @param {string} [metadataFilter] the LDAP-style metadata filter
    * @returns {string} the URL
    * @memberof NodeDatumUrlHelperMixin#
    */

		}, {
			key: 'availableSourcesUrl',
			value: function availableSourcesUrl(nodeId, metadataFilter) {
				var nodeIds = Array.isArray(nodeId) ? nodeId : nodeId ? [nodeId] : nodeId !== null ? this.nodeIds : undefined;
				var result = this.baseUrl() + '/range/sources';
				var params = '';
				if (Array.isArray(nodeIds)) {
					params += 'nodeIds=' + nodeIds.join(',');
				}
				if (metadataFilter) {
					if (params.length > 0) {
						params += '&';
					}
					params += 'metadataFilter=' + encodeURIComponent(metadataFilter);
				}
				if (params.length > 0) {
					result += '?' + params;
				}
				return result;
			}
		}]);
		return _class;
	}(superclass);
};

/**
 * A concrete {@link UrlHelper} with the {@link NodeDatumUrlHelperMixin}, {@link QueryUrlHelperMixin},
 * and {@link NodeUrlHelperMixin} mixins.
 * 
 * @mixes NodeDatumUrlHelperMixin
 * @mixes QueryUrlHelperMixin
 * @mixes NodeUrlHelperMixin
 * @extends UrlHelper
 */
var NodeDatumUrlHelper = function (_NodeDatumUrlHelperMi) {
	inherits(NodeDatumUrlHelper, _NodeDatumUrlHelperMi);

	function NodeDatumUrlHelper() {
		classCallCheck(this, NodeDatumUrlHelper);
		return possibleConstructorReturn(this, (NodeDatumUrlHelper.__proto__ || Object.getPrototypeOf(NodeDatumUrlHelper)).apply(this, arguments));
	}

	return NodeDatumUrlHelper;
}(NodeDatumUrlHelperMixin(QueryUrlHelperMixin(NodeUrlHelperMixin(UrlHelper))));

/** The SolarUser default path. */
var SolarUserDefaultPath = '/solaruser';

/** The {@link UrlHelper} parameters key for the SolarUser path. */
var SolarUserPathKey = 'solarUserPath';

/** The SolarUser REST API path. */
var SolarUserApiPathV1 = '/api/v1/sec';

/** The {@link UrlHelper} parameters key that holds the <code>userId</code>. */
var UserIdsKey = 'userIds';

/**
 * A mixin class that adds SolarUser specific support to <code>UrlHelper</code>.
 * 
 * @param {UrlHelper} superclass the UrlHelper class to mix onto 
 * @mixin
 * @property {number} userId the first available user ID from the <code>userIds</code> property;
 *                           setting this replaces any existing user IDs with an array of just that value
 * @property {number[]} userIds an array of user IDs, set on the <code>userIds</code> parameter
 * @returns {*} the mixin
 */
var UserUrlHelperMixin = function UserUrlHelperMixin(superclass) {
	return function (_superclass) {
		inherits(_class, _superclass);

		function _class() {
			classCallCheck(this, _class);
			return possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
		}

		createClass(_class, [{
			key: 'baseUrl',


			/**
    * Get the base URL to the SolarUser v1 REST API.
    * 
    * The returned URL uses the configured environment to resolve
    * the <code>hostUrl</code> and a <code>solarUserPath</code> context path.
    * If the context path is not available, it will default to 
    * <code>/solaruser</code>.
    * 
    * @returns {string} the base URL to SolarUser
    * @memberof UserUrlHelperMixin#
    */
			value: function baseUrl() {
				var path = this.env(SolarUserPathKey) || SolarUserDefaultPath;
				return get(_class.prototype.__proto__ || Object.getPrototypeOf(_class.prototype), 'baseUrl', this).call(this) + path + SolarUserApiPathV1;
			}

			/**
    * Generate a URL to get a list of all active nodes for the user account.
    *
    * @return {string} the URL to access the user's active nodes
    * @memberof UserUrlHelperMixin#
    */

		}, {
			key: 'viewNodesUrl',
			value: function viewNodesUrl() {
				return this.baseUrl() + '/nodes';
			}

			/**
    * Generate a URL to get a list of all pending nodes for the user account.
    *
    * @return {string} the URL to access the user's pending nodes
    * @memberof UserUrlHelperMixin#
    */

		}, {
			key: 'viewPendingNodesUrl',
			value: function viewPendingNodesUrl() {
				return this.baseUrl() + '/nodes/pending';
			}

			/**
    * Generate a URL to get a list of all archived nodes for the user account.
    *
    * @return {string} the URL to access the user's archived nodes
    * @memberof UserUrlHelperMixin#
    */

		}, {
			key: 'viewArchivedNodesUrl',
			value: function viewArchivedNodesUrl() {
				return this.baseUrl() + '/nodes/archived';
			}

			/**
    * Generate a URL to update the archived status of a set of nodes via a <code>POST</code> request.
    *
    * @param {number|number[]|null} nodeId a specific node ID, or array of node IDs, to update; if not provided the 
    *                                      <code>nodeIds</code> property of this class will be used
    * @param {boolean} archived <code>true</code> to mark the nodes as archived; <code>false</code> to un-mark
    *                           and return to normal status
    * @return {string} the URL to update the nodes archived status
    * @memberof UserUrlHelperMixin#
    */

		}, {
			key: 'updateNodeArchivedStatusUrl',
			value: function updateNodeArchivedStatusUrl(nodeId, archived) {
				var nodeIds = Array.isArray(nodeId) ? nodeId : nodeId ? [nodeId] : this.nodeIds;
				var result = this.baseUrl() + '/nodes/archived?nodeIds=' + nodeIds.join(',') + '&archived=' + (archived ? 'true' : 'false');
				return result;
			}
		}, {
			key: 'userId',


			/**
    * Get the default user ID.
    * 
    * This gets the first available user ID from the <code>userIds</code> property.
    * 
    * @returns {number} the default user ID, or <code>null</code>
   * @memberof UserUrlHelperMixin#
    */
			get: function get$$1() {
				var userIds = this.parameter(UserIdsKey);
				return Array.isArray(userIds) && userIds.length > 0 ? userIds[0] : null;
			}

			/**
    * Set the user ID.
    * 
    * This will set the <code>userIds</code> property to a new array of just the given value.
    * 
    * @param {number} userId the user ID to set
   * @memberof UserUrlHelperMixin#
    */
			,
			set: function set$$1(userId) {
				this.parameter(UserIdsKey, [userId]);
			}
		}, {
			key: 'userIds',
			get: function get$$1() {
				return this.parameter(UserIdsKey);
			},
			set: function set$$1(userIds) {
				this.parameter(UserIdsKey, userIds);
			}
		}]);
		return _class;
	}(superclass);
};

/**
 * A mixin class that adds SolarNode instruction support to {@link UrlHelper}.
 * 
 * @param {UrlHelper} superclass the UrlHelper class to mix onto
 * @mixin
 * @returns {*} the mixin
 */
var NodeInstructionUrlHelperMixin = function NodeInstructionUrlHelperMixin(superclass) {
	return function (_superclass) {
		inherits(_class, _superclass);

		function _class() {
			classCallCheck(this, _class);
			return possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
		}

		createClass(_class, [{
			key: 'viewInstructionUrl',


			/**
    * Generate a URL to get all details for a specific instruction.
    * 
    * @param {number} instructionId the instruction ID to get
    * @returns {string} the URL
    * @memberof NodeInstructionUrlHelperMixin#
    */
			value: function viewInstructionUrl(instructionId) {
				return this.baseUrl() + '/instr/view?id=' + encodeURIComponent(instructionId);
			}

			/**
    * Generate a URL for viewing active instructions.
    * 
    * @param {number} [nodeId] a specific node ID to use; if not provided the <code>nodeId</code> property of this class will be used
    * @returns {string} the URL
    * @memberof NodeInstructionUrlHelperMixin#
    */

		}, {
			key: 'viewActiveInstructionsUrl',
			value: function viewActiveInstructionsUrl(nodeId) {
				return this.baseUrl() + '/instr/viewActive?nodeId=' + (nodeId || this.nodeId);
			}

			/**
    * Generate a URL for viewing pending instructions.
    * 
    * @param {number} [nodeId] a specific node ID to use; if not provided the <code>nodeId</code> property of this class will be used
    * @returns {string} the URL
    * @memberof NodeInstructionUrlHelperMixin#
    */

		}, {
			key: 'viewPendingInstructionsUrl',
			value: function viewPendingInstructionsUrl(nodeId) {
				return this.baseUrl() + '/instr/viewPending?nodeId=' + (nodeId || this.nodeId);
			}

			/**
    * Generate a URL for changing the state of an instruction.
    * 
    * @param {number} instructionId the instruction ID to update
    * @param {InstructionState} state the instruction state to set
    * @returns {string} the URL
    * @see the {@link InstructionStates} enum for possible state values
    * @memberof NodeInstructionUrlHelperMixin#
    */

		}, {
			key: 'updateInstructionStateUrl',
			value: function updateInstructionStateUrl(instructionId, state) {
				return this.baseUrl() + '/instr/updateState?id=' + encodeURIComponent(instructionId) + '&state=' + encodeURIComponent(state.name);
			}

			/**
    * Generate a URL for posting an instruction request.
    *
    * @param {string} topic the instruction topic.
    * @param {Object[]} [parameters] an array of parameter objects in the form <code>{name:n1, value:v1}</code>.
    * @param {number} [nodeId] a specific node ID to use; if not provided the <code>nodeId</code> property of this class will be used
    * @returns {string} the URL
    * @memberof NodeInstructionUrlHelperMixin#
    */

		}, {
			key: 'queueInstructionUrl',
			value: function queueInstructionUrl(topic, parameters, nodeId) {
				var url = this.baseUrl() + '/instr/add?nodeId=' + (nodeId || this.nodeId) + '&topic=' + encodeURIComponent(topic);
				var i, len;
				if (Array.isArray(parameters)) {
					for (i = 0, len = parameters.length; i < len; i++) {
						url += '&' + encodeURIComponent('parameters[' + i + '].name') + '=' + encodeURIComponent(parameters[i].name) + '&' + encodeURIComponent('parameters[' + i + '].value') + '=' + encodeURIComponent(parameters[i].value);
					}
				}
				return url;
			}

			/**
    * Create an instruction parameter suitable to passing to {@link NodeInstructionUrlHelperMixin#queueInstructionUrl}.
    * 
    * @param {string} name the parameter name 
    * @param {*} value the parameter value
    * @returns {object} with <code>name</code> and <code>value</code> properties
    * @memberof NodeInstructionUrlHelperMixin
    */

		}], [{
			key: 'instructionParameter',
			value: function instructionParameter(name, value) {
				return { name: name, value: value };
			}
		}]);
		return _class;
	}(superclass);
};

/**
 * A concrete {@link UrlHelper} with the {@link NodeInstructionUrlHelperMixin},  {@link UserUrlHelperMixin}, and
 * {@link NodeUrlHelperMixin} mixins.
 * 
 * @mixes NodeInstructionUrlHelperMixin
 * @mixes UserUrlHelperMixin
 * @mixes NodeUrlHelperMixin
 * @extends UrlHelper
 */
var NodeInstructionUrlHelper = function (_NodeInstructionUrlHe) {
	inherits(NodeInstructionUrlHelper, _NodeInstructionUrlHe);

	function NodeInstructionUrlHelper() {
		classCallCheck(this, NodeInstructionUrlHelper);
		return possibleConstructorReturn(this, (NodeInstructionUrlHelper.__proto__ || Object.getPrototypeOf(NodeInstructionUrlHelper)).apply(this, arguments));
	}

	return NodeInstructionUrlHelper;
}(NodeInstructionUrlHelperMixin(UserUrlHelperMixin(NodeUrlHelperMixin(UrlHelper))));

/**
 * The static {@link NodeInstructionUrlHelperMixin#instructionParameter} method so it can be imported directly.
 */
var instructionParameter = NodeInstructionUrlHelper.instructionParameter;

/**
 * A mixin class that adds SolarNode metadata support to {@link UrlHelper}.
 * 
 * @param {UrlHelper} superclass the UrlHelper class to mix onto
 * @mixin
 * @returns {*} the mixin
 */
var NodeMetadataUrlHelperMixin = function NodeMetadataUrlHelperMixin(superclass) {
	return function (_superclass) {
		inherits(_class, _superclass);

		function _class() {
			classCallCheck(this, _class);
			return possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
		}

		createClass(_class, [{
			key: 'viewNodeMetadataUrl',


			/**
    * Generate a URL for viewing the configured node's metadata.
    *
    * @param {number} [nodeId] a specific node ID to use; if not provided the <code>nodeId</code> property of this class will be used
    * @returns {string} the URL
    * @memberof NodeMetadataUrlHelperMixin#
    */
			value: function viewNodeMetadataUrl(nodeId) {
				return this.baseUrl() + '/nodes/meta/' + (nodeId || this.nodeId);
			}

			/**
    * Generate a URL for adding metadata to a node via a <code>POST</code> request.
    *
    * @param {number} [nodeId] a specific node ID to use; if not provided the <code>nodeId</code> property of this class will be used
    * @returns {string} the URL
    * @memberof NodeMetadataUrlHelperMixin#
    */

		}, {
			key: 'addNodeMetadataUrl',
			value: function addNodeMetadataUrl(nodeId) {
				return this.viewNodeMetadataUrl(nodeId);
			}

			/**
    * Generate a URL for setting the metadata of a node via a <code>PUT</code> request.
    *
    * @param {number} [nodeId] a specific node ID to use; if not provided the <code>nodeId</code> property of this class will be used
    * @returns {string} the URL
    * @memberof NodeMetadataUrlHelperMixin#
    */

		}, {
			key: 'replaceNodeMetadataUrl',
			value: function replaceNodeMetadataUrl(nodeId) {
				return this.viewNodeMetadataUrl(nodeId);
			}

			/**
    * Generate a URL for deleting the metadata of a node via a <code>DELETE</code> request.
    *
    * @param {number} [nodeId] a specific node ID to use; if not provided the <code>nodeId</code> property of this class will be used
    * @returns {string} the URL
    * @memberof NodeMetadataUrlHelperMixin#
    */

		}, {
			key: 'deleteNodeMetadataUrl',
			value: function deleteNodeMetadataUrl(nodeId) {
				return this.viewNodeMetadataUrl(nodeId);
			}

			/**
    * Generate a URL for searching for node metadata.
    * 
    * @param {number|number[]} [nodeId] a specific node ID, or array of node IDs, to use; if not provided the 
    *                                   <code>nodeIds</code> property of this class will be used, unless <code>null</code>
    *                                   is passed in which case no node IDs will be added to the URL so that all available
    *                                   node metadata objects will be returned
    * @param {SortDescriptor[]} [sorts] optional sort settings to use
    * @param {Pagination} [pagination] optional pagination settings to use
    * @returns {string} the URL
    * @memberof NodeMetadataUrlHelperMixin#
    */

		}, {
			key: 'findNodeMetadataUrl',
			value: function findNodeMetadataUrl(nodeId, sorts, pagination) {
				var nodeIds = Array.isArray(nodeId) ? nodeId : nodeId ? [nodeId] : nodeId !== null ? this.nodeIds : undefined;
				var result = this.baseUrl() + '/nodes/meta';
				var params = '';
				if (Array.isArray(nodeIds)) {
					params += 'nodeIds=' + nodeIds.join(',');
				}
				if (Array.isArray(sorts)) {
					sorts.forEach(function (sort, i) {
						if (sort instanceof SortDescriptor) {
							if (params.length > 0) {
								params += '&';
							}
							params += sort.toUriEncoding(i);
						}
					});
				}
				if (pagination instanceof Pagination) {
					if (params.length > 0) {
						params += '&';
					}
					params += pagination.toUriEncoding();
				}
				if (params.length > 0) {
					result += '?' + params;
				}
				return result;
			}
		}]);
		return _class;
	}(superclass);
};

/**
 * A concrete {@link UrlHelper} with the {@link NodeMetadataUrlHelperMixin},  {@link UserUrlHelperMixin}, and
 * {@link NodeUrlHelperMixin} mixins.
 * 
 * @mixes NodeMetadataUrlHelperMixin
 * @mixes UserUrlHelperMixin
 * @mixes NodeUrlHelperMixin
 * @extends UrlHelper
 */
var NodeMetadataUrlHelper = function (_NodeMetadataUrlHelpe) {
	inherits(NodeMetadataUrlHelper, _NodeMetadataUrlHelpe);

	function NodeMetadataUrlHelper() {
		classCallCheck(this, NodeMetadataUrlHelper);
		return possibleConstructorReturn(this, (NodeMetadataUrlHelper.__proto__ || Object.getPrototypeOf(NodeMetadataUrlHelper)).apply(this, arguments));
	}

	return NodeMetadataUrlHelper;
}(NodeMetadataUrlHelperMixin(UserUrlHelperMixin(NodeUrlHelperMixin(UrlHelper))));

/**
 * A mixin class that adds security token support to a SolarUser <code>UrlHelper</code>.
 * 
 * @param {UrlHelper} superclass the UrlHelper class to mix onto 
 * @mixin
 * @returns {*} the mixin
 */
var UserAuthTokenUrlHelperMixin = function UserAuthTokenUrlHelperMixin(superclass) {
    return function (_superclass) {
        inherits(_class, _superclass);

        function _class() {
            classCallCheck(this, _class);
            return possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
        }

        createClass(_class, [{
            key: 'listAllAuthTokensUrl',


            /**
             * Generate a URL for listing all available auth tokens.
             * 
            * @returns {string} the URL
             * @memberof UserAuthTokenUrlHelperMixin#
             */
            value: function listAllAuthTokensUrl() {
                return this.baseUrl() + '/user/auth-tokens';
            }

            /**
             * Generate a URL for creating a new auth token, via a <code>POST</code> request.
             * 
             * The request body accepts a {@link SecurityPolicy} JSON document.
             * 
             * @param {AuthTokenType} type the auth token type to generate
            * @returns {string} the URL
             * @memberof UserAuthTokenUrlHelperMixin#
             */

        }, {
            key: 'generateAuthTokenUrl',
            value: function generateAuthTokenUrl(type) {
                return this.baseUrl() + '/user/auth-tokens/generate/' + type.name;
            }

            /**
             * Generate a URL for accessing an auth token.
             * 
             * @param {string} tokenId the token ID
             * @memberof UserAuthTokenUrlHelperMixin#
            * @returns {string} the URL
             * @private
             */

        }, {
            key: 'authTokenUrl',
            value: function authTokenUrl(tokenId) {
                return this.baseUrl() + '/user/auth-tokens/' + encodeURIComponent(tokenId);
            }

            /**
             * Generate a URL for deleting an auth token, via a <code>DELETE</code> request.
             * 
             * @param {string} tokenId the token ID to delete
            * @returns {string} the URL
             * @memberof UserAuthTokenUrlHelperMixin#
             */

        }, {
            key: 'deleteAuthTokenUrl',
            value: function deleteAuthTokenUrl(tokenId) {
                return this.authTokenUrl(tokenId);
            }

            /**
             * Generate a URL for updating (merging) a security policy on an auth token,
             * via a <code>PATCH</code> request.
             * 
             * The request body accepts a {@link SecurityPolicy} JSON document.
             * 
             * @param {string} tokenId the ID of the token to update
            * @returns {string} the URL
             * @memberof UserAuthTokenUrlHelperMixin#
             */

        }, {
            key: 'updateAuthTokenSecurityPolicyUrl',
            value: function updateAuthTokenSecurityPolicyUrl(tokenId) {
                return this.authTokenUrl(tokenId);
            }

            /**
             * Generate a URL for replacing a security policy on an auth token,
             * via a <code>PUT</code> request.
             * 
             * The request body accepts a {@link SecurityPolicy} JSON document.
             * 
             * @param {string} tokenId the ID of the token to update
            * @returns {string} the URL
             * @memberof UserAuthTokenUrlHelperMixin#
             */

        }, {
            key: 'replaceAuthTokenSecurityPolicyUrl',
            value: function replaceAuthTokenSecurityPolicyUrl(tokenId) {
                return this.authTokenUrl(tokenId);
            }

            /**
             * Generate a URL for updating the status of an auth token,
             * via a <code>POST</code> request.
             * 
             * @param {string} tokenId the ID of the token to update
             * @param {AuthTokenStatus} status the status to change to
            * @returns {string} the URL
             * @memberof UserAuthTokenUrlHelperMixin#
             */

        }, {
            key: 'updateAuthTokenStatusUrl',
            value: function updateAuthTokenStatusUrl(tokenId, status) {
                return this.authTokenUrl(tokenId) + '?status=' + encodeURIComponent(status.name);
            }
        }]);
        return _class;
    }(superclass);
};

/**
 * A concrete {@link UrlHelper} with the {@link UserAuthTokenUrlHelperMixin} and  {@link UserUrlHelperMixin} mixins.
 * 
 * @mixes UserAuthTokenUrlHelperMixin
 * @mixes UserUrlHelperMixin
 * @extends UrlHelper
 */
var UserAuthTokenUrlHelper = function (_UserAuthTokenUrlHelp) {
    inherits(UserAuthTokenUrlHelper, _UserAuthTokenUrlHelp);

    function UserAuthTokenUrlHelper() {
        classCallCheck(this, UserAuthTokenUrlHelper);
        return possibleConstructorReturn(this, (UserAuthTokenUrlHelper.__proto__ || Object.getPrototypeOf(UserAuthTokenUrlHelper)).apply(this, arguments));
    }

    return UserAuthTokenUrlHelper;
}(UserAuthTokenUrlHelperMixin(UserUrlHelperMixin(UrlHelper)));



var net = Object.freeze({
	AuthorizationV2Builder: AuthorizationV2Builder,
	DatumMetadataUrlHelperMixin: DatumMetadataUrlHelperMixin,
	DatumMetadataUrlHelper: DatumMetadataUrlHelper,
	Environment: Environment,
	HttpHeaders: HttpHeaders,
	HttpMethod: HttpMethod,
	NodeDatumUrlHelperMixin: NodeDatumUrlHelperMixin,
	NodeDatumUrlHelper: NodeDatumUrlHelper,
	NodeInstructionUrlHelperMixin: NodeInstructionUrlHelperMixin,
	NodeInstructionUrlHelper: NodeInstructionUrlHelper,
	instructionParameter: instructionParameter,
	NodeMetadataUrlHelperMixin: NodeMetadataUrlHelperMixin,
	NodeMetadataUrlHelper: NodeMetadataUrlHelper,
	NodeUrlHelperMixin: NodeUrlHelperMixin,
	QueryUrlHelperMixin: QueryUrlHelperMixin,
	SolarQueryDefaultPath: SolarQueryDefaultPath,
	SolarQueryPathKey: SolarQueryPathKey,
	SolarQueryApiPathV1: SolarQueryApiPathV1,
	SolarQueryPublicPathKey: SolarQueryPublicPathKey,
	UserAuthTokenUrlHelperMixin: UserAuthTokenUrlHelperMixin,
	UserAuthTokenUrlHelper: UserAuthTokenUrlHelper,
	UserUrlHelperMixin: UserUrlHelperMixin,
	SolarUserDefaultPath: SolarUserDefaultPath,
	SolarUserPathKey: SolarUserPathKey,
	SolarUserApiPathV1: SolarUserApiPathV1,
	UrlHelper: UrlHelper,
	urlQuery: urlQuery
});



var util = Object.freeze({
	ComparableEnum: ComparableEnum,
	Configuration: Configuration,
	Enum: Enum,
	MultiMap: MultiMap
});

export { domain, format, net, util };
//# sourceMappingURL=solarnetwork-api-core.mjs.map
