import { ascending, max, sum } from "d3-array";
import { nest } from "d3-collection";

import { datumDate } from "../util/date";

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
export function normalizeNestedStackDataByDate(layerData, fillTemplate, fillFn) {
	var i = 0,
		j,
		k,
		jMax = layerData.length - 1,
		dummy,
		prop,
		copyIndex;
	// fill in "holes" for each stack, if more than one stack. we assume data already sorted by date
	if (jMax > 0) {
		while (
			i <
			max(
				layerData.map(function(e) {
					return e.values.length;
				})
			)
		) {
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
				if (
					layerData[k].values.length <= i ||
					layerData[j].values[i].date.getTime() < layerData[k].values[i].date.getTime()
				) {
					dummy = { date: layerData[j].values[i].date, sourceId: layerData[k].key };
					if (fillTemplate) {
						for (prop in fillTemplate) {
							if (Object.prototype.hasOwnProperty.call(fillTemplate, prop)) {
								dummy[prop] = fillTemplate[prop];
							}
						}
					}
					if (fillFn) {
						copyIndex = layerData[k].values.length > i ? i : i > 0 ? i - 1 : null;
						fillFn(
							dummy,
							layerData[k].key,
							copyIndex !== null ? layerData[k].values[copyIndex] : undefined
						);
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
export function aggregateNestedDataLayers(
	layerData,
	resultKey,
	copyProperties,
	sumProperties,
	staticProperties
) {
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
export function groupedBySourceMetricDataArray(data, metricName, sourceIdMap, aggFn) {
	const metricExtractorFn = function metricExtractor(d) {
		return d[metricName];
	};
	const rollupFn = typeof aggFn === "function" ? aggFn : sum;
	const layerData = nest()
		// group first by source
		.key(d => {
			return sourceIdMap && sourceIdMap.has(d.sourceId)
				? sourceIdMap.get(d.sourceId)
				: d.sourceId;
		})
		.sortKeys(ascending)
		// group second by date
		.key(d => {
			return d.localDate + " " + d.localTime;
		})
		// sum desired property in date group
		.rollup(values => {
			const r = {
				date: datumDate(values[0])
			};
			let metricKey = values[0].sourceId;
			if (sourceIdMap && sourceIdMap.has(metricKey)) {
				metricKey = sourceIdMap.get(metricKey);
			}
			r[metricKey] = rollupFn(values, metricExtractorFn);
			return r;
		})
		// un-nest to single group by source
		.entries(data)
		.map(function(layer) {
			return {
				key: layer.key,
				values: layer.values.map(function(d) {
					return d.value;
				})
			};
		});

	// ensure all layers have the same time keys
	normalizeNestedStackDataByDate(layerData, null, (d, key) => {
		// make sure filled-in data has the metric property defined
		d[key] = null;
	});

	// reduce to single array with multiple metric properties
	return layerData.reduce(function(combined, layer) {
		if (!combined) {
			return layer.values;
		}
		combined.forEach(function(d, i) {
			const v = layer.values[i][layer.key];
			d[layer.key] = v;
		});
		return combined;
	}, null);
}

export default Object.freeze({
	aggregateNestedDataLayers: aggregateNestedDataLayers,
	groupedBySourceMetricDataArray: groupedBySourceMetricDataArray,
	normalizeNestedStackDataByDate: normalizeNestedStackDataByDate
});
