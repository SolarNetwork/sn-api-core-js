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
 * @param {object[]} data the raw data returned from SolarNetwork; this array is modified in-place
 * @param {module:domain~Aggregation} aggregate the expected aggregate level of the data
 * @returns {void}
 * @alias module:data~timeNormalizeDataArray
 */
export function timeNormalizeDataArray(data, aggregate) {
	const aggMillseconds = aggregate.level * 1000;
	if (!Array.isArray(data) || data.length < 2) {
		return data;
	}
	var i = 0;
	while (i < data.length - 1) {
		const d = data[i];
		const currTime = d.date.getTime();
		const expectedNextTime = currTime + aggMillseconds;
		let nextTime = data[i + 1].date.getTime();
		if (nextTime > expectedNextTime) {
			let fill = [i + 1, 0];
			for (
				let fillTime = currTime + aggMillseconds;
				fillTime < nextTime;
				fillTime += aggMillseconds
			) {
				let f = Object.create(
					Object.getPrototypeOf(d),
					Object.getOwnPropertyDescriptors(d)
				);
				for (let p in f) {
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

export default Object.freeze({
	timeNormalizeDataArray: timeNormalizeDataArray
});
