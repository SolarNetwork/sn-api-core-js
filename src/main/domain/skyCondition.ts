import BitmaskEnum from "../util/bitmaskEnum.js";

/**
 * An enumeration of supported sky condition names.
 */
enum SkyConditionNames {
	/** Clear sky. */
	Clear = "Clear",

	/** Scattered/few clouds. */
	ScatteredClouds = "ScatteredClouds",

	/** Cloudy. */
	Cloudy = "Cloudy",

	/** Fog. */
	Fog = "Fog",

	/** Drizzle, light rain. */
	Drizzle = "Drizzle",

	/** Scattered/few showers, */
	ScatteredShowers = "ScatteredShowers",

	/** Showers, light rain. */
	Showers = "Showers",

	/** Rain. */
	Rain = "Rain",

	/** Hail. */
	Hail = "Hail",

	/** Scattered/light snow. */
	ScatteredSnow = "ScatteredSnow",

	/** Snow. */
	Snow = "Snow",

	/** Storm. */
	Storm = "Storm",

	/** Severe strom. */
	SevereStorm = "SevereStorm",

	/** Thunder, lightning. */
	Thunder = "Thunder",

	/** Windy. */
	Windy = "Windy",

	/** Hazy. */
	Hazy = "Hazy",

	/** Tornado. */
	Tornado = "Tornado",

	/** Hurricane. */
	Hurricane = "Hurricane",

	/** Dusty. */
	Dusty = "Dusty",
}

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
	constructor(name: string, bitNumber: number) {
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
	get code(): number {
		return this.bitmaskBitNumber;
	}

	/**
	 * Get an enum for a code value.
	 *
	 * @param code - the code to look for
	 * @returns {SkyCondition} the enum, or `undefined` if not found
	 */
	static forCode(code: number): SkyCondition | undefined {
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
 * A mapping of sky condition names to associated enum instances.
 */
type SkyConditionEnumsType = {
	[key in SkyConditionNames]: SkyCondition;
};

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
const SkyConditions = SkyCondition.enumsValue(
	SkyConditionValues
) as SkyConditionEnumsType;

export default SkyConditions;
export { SkyCondition, type SkyConditionEnumsType, SkyConditionNames };
