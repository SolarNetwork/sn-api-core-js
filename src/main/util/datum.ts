import { ascending, max, sum } from "d3-array";
import { nest } from "d3-collection";

import { dateTimeParse, dateParser } from "./dates.js";
import { Aggregation } from "../domain/aggregation.js";
import DatumStreamMetadata from "../domain/datumStreamMetadata.js";
import DatumStreamMetadataRegistry from "./datumStreamMetadataRegistry.js";
import StreamAggregateDatum from "../domain/streamAggregateDatum.js";
import StreamDatum from "../domain/streamDatum.js";
import StreamedDatum from "../domain/streamedDatum.js";

/**
 * Get a datum instance from a stream data array.
 *
 * @param data - the datum stream data array (or JSON array value) to create a datum instance
 * @param meta - a metadata instance or metadata registry to decode with
 * @returns the datum, or `null` if one cannot be created
 */
export function datumForStreamData(
	data: any[] | string,
	meta: DatumStreamMetadata | DatumStreamMetadataRegistry
): StreamedDatum | undefined {
	if (typeof data === "string") {
		data = JSON.parse(data);
	}
	if (!Array.isArray(data) || data.length < 2) {
		return undefined;
	}
	return Array.isArray(data[1])
		? StreamAggregateDatum.fromJsonObject(data, meta)
		: StreamDatum.fromJsonObject(data, meta);
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
 * @param d - the datum object to extract a date from
 * @returns the extracted date, or `null` if no date could be extracted
 */
export function datumDate(d?: {
	date?: Date;
	localDate?: string;
	localTime?: string;
	created?: string;
}): Date | null {
	if (!d) {
		return null;
	}
	if (d.date instanceof Date) {
		return d.date;
	} else if (d.localDate) {
		return dateTimeParse(
			d.localDate + (d.localTime ? " " + d.localTime : " 00:00")
		);
	} else if (d.created) {
		return dateParser(d.created);
	}
	return null;
}

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
 * @param data - the raw data returned from SolarNetwork; this array is modified in-place
 * @param aggregate - the expected aggregate level of the data
 */
export function timeNormalizeDataArray(
	data: { date: Date }[],
	aggregate: Aggregation
) {
	const aggMillseconds = aggregate.level * 1000;
	if (!Array.isArray(data) || data.length < 2) {
		return data;
	}
	let i = 0;
	while (i < data.length - 1) {
		const d = data[i];
		const currTime = d.date.getTime();
		const expectedNextTime = currTime + aggMillseconds;
		const nextTime = data[i + 1].date.getTime();
		if (nextTime > expectedNextTime) {
			const fill = [i + 1, 0] as [number, number];
			for (
				let fillTime = currTime + aggMillseconds;
				fillTime < nextTime;
				fillTime += aggMillseconds
			) {
				const f = Object.create(
					Object.getPrototypeOf(d),
					Object.getOwnPropertyDescriptors(d)
				);
				for (const p in f) {
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
 * @param layerData - An array of objects with `key` and `values` properties, as returned from `d3.nest().entries()`
 * @param fillTemplate - An object to use as a template for any filled-in data objects.
 *                       The `date` property will be populated automatically, and a `sourceId`
 *                       property will be populated by the layer's `key`.
 * @param fillFn - An optional function to populate filled-in data objects with.
 *                 This function is invoked **after** populating any `fillTemplate` values.
 */
export function normalizeNestedStackDataByDate(
	layerData: { key: string; values: { date: Date }[] }[],
	fillTemplate?: Record<string, any>,
	fillFn?: (
		datum: Record<string, any>,
		key: string,
		prevDatum?: Record<string, any>
	) => void
): void {
	const jMax = layerData.length - 1;
	let i: number = 0,
		j: number,
		k: number,
		dummy: (Record<string, any> & { date: Date }) | undefined,
		prop: string,
		copyIndex: number | null;

	// fill in "holes" for each stack, if more than one stack. we assume data already sorted by date
	if (jMax > 0) {
		while (
			i <
			max(
				layerData.map(function (e) {
					return e.values.length;
				})
			)!
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
					layerData[j].values[i].date.getTime() <
						layerData[k].values[i].date.getTime()
				) {
					dummy = {
						date: layerData[j].values[i].date,
						sourceId: layerData[k].key,
					};
					if (fillTemplate) {
						for (prop in fillTemplate) {
							if (
								Object.prototype.hasOwnProperty.call(
									fillTemplate,
									prop
								)
							) {
								dummy[prop] = fillTemplate[prop];
							}
						}
					}
					if (fillFn) {
						copyIndex =
							i > 0 && i <= layerData[k].values.length
								? i - 1
								: null;
						fillFn(
							dummy,
							layerData[k].key,
							copyIndex !== null
								? layerData[k].values[copyIndex]
								: undefined
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
 * @param layerData - An array of objects with `key` and `values` properties, as returned from `d3.nest().entries()`
 * @param resultKey - The `key` property to assign to the returned layer.
 * @param copyProperties - An array of string property names to copy as-is from the **first** layer's data values.
 * @param sumProperties - An array of string property names to add together from **all** layer data.
 * @param staticProperties - Static properties to copy as-is to **all** output data values.
 * @return An array of objects with `key` and `value` properties, the same structure as the provided `layerData` argument
 */
export function aggregateNestedDataLayers(
	layerData: { key: string; values: Record<string, any>[] }[],
	resultKey: string,
	copyProperties?: string[],
	sumProperties?: string[],
	staticProperties?: Record<string, any>
): { key: string; values: Record<string, any>[] }[] {
	// combine all layers into a single source
	const dataLength = layerData.length ? layerData[0].values.length : 0,
		layerCount = layerData.length,
		copyPropLength = copyProperties ? copyProperties.length : 0,
		sumPropLength = sumProperties ? sumProperties.length : 0;
	let i: number,
		j: number,
		k: number,
		d: Record<string, any>,
		val: any,
		clone: Record<string, any>,
		array;

	if (dataLength > 0) {
		array = [];
		for (i = 0; i < dataLength; i += 1) {
			d = layerData[0].values[i];
			clone = {};
			if (staticProperties !== undefined) {
				for (val in staticProperties) {
					if (
						Object.prototype.hasOwnProperty.call(
							staticProperties,
							val
						)
					) {
						clone[val] = staticProperties[val];
					}
				}
			}
			for (k = 0; k < copyPropLength; k += 1) {
				clone[copyProperties![k]] = d[copyProperties![k]];
			}
			for (k = 0; k < sumPropLength; k += 1) {
				clone[sumProperties![k]] = 0;
			}
			for (j = 0; j < layerCount; j += 1) {
				for (k = 0; k < sumPropLength; k += 1) {
					val = layerData[j].values[i][sumProperties![k]];
					if (val !== undefined) {
						clone[sumProperties![k]] += val;
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
 * similar to {@link Util.Datum.aggregateNestedDataLayers} except groups of source IDs can be
 * produced in the final result.
 *
 * The data will be passed through {@link Util.Datum.normalizeNestedStackDataByDate} so that every
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
 * @param data - the raw data returned from SolarNetwork
 * @param metricName - the datum property name to extract
 * @param sourceIdMap - an optional mapping of input source IDs to output source IDs; this can be used
 *     to control the grouping of data, by mapping multiple input source IDs to the same
 *     output source ID
 * @param aggFn - an optional aggregate function to apply to the metric values;
 *     defaults to `d3.sum`; **note** that the function will be passed an array of input
 *     data objects, not metric values
 * @returns array of datum objects, each with a date and one metric value per source ID
 */
export function groupedBySourceMetricDataArray(
	data: Record<string, any>,
	metricName: string,
	sourceIdMap?: Map<string, string>,
	aggFn?: (
		iterable: Iterable<number | undefined | null>
	) => number | undefined | null
): ({ date: Date } & Record<string, any>)[] {
	const metricExtractorFn = function metricExtractor(
		d: Record<string, any>
	): any {
		return d[metricName];
	};
	const rollupFn =
		typeof aggFn === "function"
			? aggFn
			: (sum as <T>(
					iterable: Iterable<T>,
					accessor: (
						datum: T,
						index: number,
						array: Iterable<T>
					) => number | undefined | null
				) => number);
	const layerData = nest()
		// group first by source
		.key((d) => {
			const sourceId = (d as any).sourceId;
			return sourceIdMap && sourceIdMap.has(sourceId)
				? sourceIdMap.get(sourceId)
				: sourceId;
		})
		.sortKeys(ascending)
		// group second by date
		.key((d) => {
			return (d as any).localDate + " " + (d as any).localTime;
		})
		// sum desired property in date group
		.rollup((values) => {
			const d = (values as any[])[0];
			const r = {
				date: datumDate(d),
			} as Record<string, any>;
			let metricKey = d.sourceId;
			if (sourceIdMap && sourceIdMap.has(metricKey)) {
				metricKey = sourceIdMap.get(metricKey);
			}
			r[metricKey] = rollupFn(values as any[], metricExtractorFn);
			return r as any;
		})
		// un-nest to single group by source
		.entries(data as any)
		.map(function (layer) {
			return {
				key: layer.key,
				values: layer.values.map(function (d: Record<string, any>) {
					return d.value;
				}),
			};
		});

	// ensure all layers have the same time keys
	normalizeNestedStackDataByDate(layerData, undefined, (d, key) => {
		// make sure filled-in data has the metric property defined
		d[key] = null;
	});

	// reduce to single array with multiple metric properties
	return layerData.reduce(function (combined, layer) {
		if (!combined) {
			return layer.values;
		}
		(combined as any[]).forEach(function (d, i) {
			const v = layer.values[i][layer.key];
			d[layer.key] = v;
		});
		return combined;
	}, null) as any;
}

/**
 * Convert a path wildcard pattern into a regular expression.
 *
 * This can be used to convert source ID wildcard patterns into regular expressions.
 *
 * @param pat the wildcard pattern to convert into a regular expression
 * @returns the regular expression, or `undefined` if `pat` is `undefined`
 */
export function wildcardPatternToRegExp(pat?: string): RegExp | undefined {
	if (!pat) {
		return undefined;
	}

	// Escape special regex characters
	let regex = pat.replace(/([!$()+.:<=>[\]^{|}-])/g, "\\$1");

	// Convert '?' to '[^/]'
	regex = regex.replace(/\?/g, "[^/]");

	// Convert single '*' to '[^/]*'
	regex = regex.replace(/(?<!\*)\*(?!\*)/g, "[^/]*");

	// Convert '**' to '.*'
	regex = regex.replace(/\*\*/g, ".*");

	// Convert '/.*/' to allow missing path segment to match
	regex = regex.replace(/\/\.\*\//g, "(/|/.*/)");

	return new RegExp(`^${regex}$`);
}
