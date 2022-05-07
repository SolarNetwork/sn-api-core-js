import BitmaskEnum from "../util/bitmaskEnum";

/**
 * A named sky condition/observation.
 *
 * @extends module:util~BitmaskEnum
 * @alias module:domain~SkyCondition
 */
class SkyCondition extends BitmaskEnum {
	/**
	 * Constructor.
	 *
	 * @param {string} name the name
	 * @param {number} bitNumber the bit offset, starting from `1` for the least significant bit
	 */
	constructor(name, bitNumber) {
		super(name, bitNumber);
		if (this.constructor === SkyCondition) {
			Object.freeze(this);
		}
	}

	/**
	 * Get the state code value.
	 *
	 * @returns {number} the code
	 */
	get code() {
		return this.bitmaskBitNumber;
	}

	/**
	 * Get an enum for a code value.
	 *
	 * @param {number} code the code to look for
	 * @returns {DeviceOperatingState} the state, or `null` if not found
	 */
	static forCode(code) {
		return BitmaskEnum.enumForBitNumber(code, SkyConditionValues);
	}

	/**
	 * Get the {@link module:domain~SkyConditions} values.
	 *
	 * @inheritdoc
	 */
	static enumValues() {
		return SkyConditionValues;
	}
}

const SkyConditionValues = Object.freeze([
	new SkyCondition("Clear", 1),
	new SkyCondition("ScatteredClouds", 2),
	new SkyCondition("Cloudy", 3),
	new SkyCondition("Fog", 4),
	new SkyCondition("Drizzle", 5),
	new SkyCondition("ScatteredShowers", 6),
	new SkyCondition("Showers", 7),
	new SkyCondition("Rain", 8),
	new SkyCondition("Hail", 9),
	new SkyCondition("ScatteredSnow", 10),
	new SkyCondition("Snow", 11),
	new SkyCondition("Storm", 12),
	new SkyCondition("SevereStorm", 13),
	new SkyCondition("Thunder", 14),
	new SkyCondition("Windy", 15),
	new SkyCondition("Hazy", 16),
	new SkyCondition("Tornado", 17),
	new SkyCondition("Hurricane", 18),
	new SkyCondition("Dusty", 19),
]);

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
const SkyConditions = SkyCondition.enumsValue(SkyConditionValues);

export default SkyConditions;
export { SkyCondition };
