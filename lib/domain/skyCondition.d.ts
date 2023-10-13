import BitmaskEnum from "../util/bitmaskEnum.js";
/**
 * An enumeration of supported sky condition names.
 */
declare enum SkyConditionNames {
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
    Dusty = "Dusty"
}
/**
 * A named sky condition/observation.
 */
declare class SkyCondition extends BitmaskEnum {
    /**
     * Constructor.
     *
     * @param name - the name
     * @param bitNumber - the bit offset, starting from `1` for the least significant bit
     */
    constructor(name: string, bitNumber: number);
    /**
     * Get the sky condition code value.
     *
     * @returns the code
     */
    get code(): number;
    /**
     * Get an enum for a code value.
     *
     * @param code - the code to look for
     * @returns {SkyCondition} the enum, or `undefined` if not found
     */
    static forCode(code: number): SkyCondition | undefined;
    /**
     * @inheritdoc
     */
    static enumValues(): readonly SkyCondition[];
}
/**
 * A mapping of sky condition names to associated enum instances.
 */
type SkyConditionEnumsType = {
    [key in SkyConditionNames]: SkyCondition;
};
/**
 * The enumeration of supported `SkyCondition` values.
 * @see {@link Domain.SkyConditionNames} for the available values
 */
declare const SkyConditions: SkyConditionEnumsType;
export default SkyConditions;
export { SkyCondition, type SkyConditionEnumsType, SkyConditionNames };
//# sourceMappingURL=skyCondition.d.ts.map