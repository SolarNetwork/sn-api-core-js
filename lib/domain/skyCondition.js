import BitmaskEnum from "../util/bitmaskEnum.js";
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
export default SkyConditions;
export { SkyCondition, SkyConditionNames };
//# sourceMappingURL=skyCondition.js.map