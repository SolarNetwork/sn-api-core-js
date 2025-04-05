import { Loader } from "./loader.js";
/**
 * The data callback function.
 *
 * @typeParam T the result data type
 */
export type MultiLoaderDataCallbackFn<T> = (
/** An error if a failure occurred. */
error?: Error, 
/** The result data. */
data?: T[][]) => void;
/**
 * Load data from multiple {@link Loader} objects, invoking a callback function
 * after all data has been loaded. Call {@link MultiLoader#load} to start loading the data.
 *
 * The {@link Tool.DatumLoader} class conforms to the {@link Loader} interface, so can be used to
 * load arrays of {@link Domain.Datum} objects based on search criteria.
 *
 * @example
 * const filter1 = new DatumFilter();
 * filter1.nodeId = 123;
 * // configure other filter settings here...
 *
 * const filter2 = new DatumFilter();
 * filter2.nodeId = 234;
 * // configure other filter settings here
 *
 * const api = new SolarQueryApi();
 *
 * const results = await new MultiLoader([
 *   new DatumLoader(api, filter1),
 *   new DatumLoader(api, filter2),
 * ]).fetch();
 * // results is a 2-element array of Datum arrays
 *
 * @typeParam the result data type
 */
export default class MultiLoader<T> {
    #private;
    /**
     * Constructor.
     *
     * @param loaders - array of loader objects
     */
    constructor(loaders: Loader<T[]>[]);
    /**
     * Get the concurrency limit to use for parallel requests.
     *
     * @returns the current concurrency value; defaults to `Infinity`
     */
    concurrency(): number;
    /**
     * Set the concurrency limit to use for parallel loading.
     *
     * By default loaders are executed in parallel. Change to a positive number to control the concurrency
     * of the loader execution, for example set to `1` for serial execution.
     *
     * @param value the concurrency level to use, or `Infinity` for no limit
     * @returns this object
     */
    concurrency(value: number): this;
    /**
     * Asynchronously load the data.
     *
     * This method calls {@link MultiLoader#load} to perform the actual work.
     *
     * @returns {Promise<T[][]>} the result promise
     */
    fetch(): Promise<T[][]>;
    /**
     * Initiate loading the data.
     *
     * This will call {@link Loader#load} on each supplied loader, in parallel.
     *
     * @param callback a callback function to use
     * @returns this object
     */
    load(callback: MultiLoaderDataCallbackFn<T>): this;
}
//# sourceMappingURL=multiLoader.d.ts.map