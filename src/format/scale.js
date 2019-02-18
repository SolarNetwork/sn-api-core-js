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
export function displayScaleForValue(value) {
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
export function displayUnitsForScale(baseUnit, scale) {
	return (
		(scale === 1000000000 ? "G" : scale === 1000000 ? "M" : scale === 1000 ? "k" : "") +
		baseUnit
	);
}
