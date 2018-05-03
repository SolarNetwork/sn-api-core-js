import { max } from 'd3-array';

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
	if ( jMax > 0 ) {
		while ( i < max(layerData.map(function(e) { return e.values.length; })) ) {
			dummy = undefined;
			for ( j = 0; j <= jMax; j++ ) {
				if ( layerData[j].values.length <= i ) {
					continue;
				}
				if ( j < jMax ) {
					k = j + 1;
				} else {
					k = 0;
				}
				if ( layerData[k].values.length <= i || layerData[j].values[i].date.getTime() < layerData[k].values[i].date.getTime() ) {
					dummy = {date : layerData[j].values[i].date, sourceId : layerData[k].key};
					if ( fillTemplate ) {
						for ( prop in fillTemplate ) {
							if ( fillTemplate.hasOwnProperty(prop) ) {
								dummy[prop] = fillTemplate[prop];
							}
						}
					}
					if ( fillFn ) {
						copyIndex = (layerData[k].values.length > i ? i : i > 0 ? i - 1 : null);
						fillFn(dummy, layerData[k].key, (copyIndex !== null ? layerData[k].values[copyIndex] : undefined));
					}
					layerData[k].values.splice(i, 0, dummy);
				}
			}
			if ( dummy === undefined ) {
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
export function aggregateNestedDataLayers(layerData, resultKey, copyProperties, sumProperties, staticProperties) {
	// combine all layers into a single source
	var layerCount = layerData.length,
		dataLength,
		i,
		j,
		k,
		copyPropLength = (copyProperties ? copyProperties.length : 0),
		sumPropLength = (sumProperties ? sumProperties.length : 0),
		d,
		val,
		clone,
		array;

	dataLength = layerData[0].values.length;
	if ( dataLength > 0 ) {
		array = [];
		for ( i = 0; i < dataLength; i += 1 ) {
			d = layerData[0].values[i];
			clone = {};
			if ( staticProperties !== undefined ) {
				for ( val in staticProperties ) {
					if ( staticProperties.hasOwnProperty(val) ) {
						clone[val] = staticProperties[val];
					}
				}
			}
			for ( k = 0; k < copyPropLength; k += 1 ) {
				clone[copyProperties[k]] = d[copyProperties[k]];
			}
			for ( k = 0; k < sumPropLength; k += 1 ) {
				clone[sumProperties[k]] = 0;
			}
			for ( j = 0; j < layerCount; j += 1 ) {
				for ( k = 0; k < sumPropLength; k += 1 ) {
					val = layerData[j].values[i][sumProperties[k]];
					if ( val !== undefined ) {
						clone[sumProperties[k]] += val;
					}
				}
			}
			array.push(clone);
		}
		layerData = [{ key : resultKey, values : array }];
	}

	return layerData;
}

export default Object.freeze({
    aggregateNestedDataLayers : aggregateNestedDataLayers,
    normalizeNestedStackDataByDate : normalizeNestedStackDataByDate,
});
