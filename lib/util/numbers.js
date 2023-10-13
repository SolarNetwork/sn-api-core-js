/**
 * Get an appropriate multiplier value for scaling a given value to a more display-friendly form.
 *
 * This will return values suitable for passing to {@link Util.Numbers.displayUnitsForScale}.
 *
 * @param value - the value to get a display scale factor for, for example the maximum value
 *     in a range of values
 * @return the display scale factor
 */
export function displayScaleForValue(value) {
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
export function displayUnitsForScale(baseUnit, scale) {
    return ((scale === 1000000000
        ? "G"
        : scale === 1000000
            ? "M"
            : scale === 1000
                ? "k"
                : "") + baseUnit);
}
//# sourceMappingURL=numbers.js.map