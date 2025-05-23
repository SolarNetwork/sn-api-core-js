import { queue } from "d3-queue";
import JsonClientSupport from "../net/jsonClientSupport.js";
import { default as log } from "../util/logger.js";
/**
 * Class to find the available datum sources for a set of node datum URL helpers.
 *
 * This helper is useful for finding what source IDs are avaialble for a set of nodes.
 * It returns an object with node ID properties with associated source ID array values,
 * for example:
 *
 * ```
 * { 123: ["a", "b", "c"] }
 * ```
 * @example
 * // the simple case, all available sources for just one SolarNode
 * const filter = new DatumFilter();
 * filter.nodeId = 123;
 * const sources = await new DatumSourceFinder(new SolarQueryApi(), filter).fetch();
 *
 * @example
 * // find all sources matching a wildcard pattern within the past day
 * const filter2 = new DatumFilter();
 * filter2.startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
 * filter2.sourceId = '/power/**';
 * const sources2 = await new DatumSourceFinder(new SolarQueryApi(), filter2).fetch();
 *
 * @example
 * // find all sources across multiple SolarNodes
 * const filter3 = new DatumFilter();
 * filter3.nodeId = 234;
 * const sources3 = await new DatumSourceFinder(new SolarQueryApi(), [urlHelper1, urlHelper3]).fetch();
 */
export default class DatumSourceFinder extends JsonClientSupport {
    #filters;
    /**
     * Constructor.
     *
     * @param api the API helper to use
     * @param filters the filter(s) to find the sources for
     * @param authBuilder the auth builder to authenticate requests with; if not provided
     *                    then only public data can be queried; when provided a pre-signed
     *                    key must be available
     */
    constructor(api, filters, authBuilder) {
        super(api, authBuilder);
        this.#filters = Array.isArray(filters) ? filters : [filters];
    }
    /**
     * Initiate loading the data.
     *
     * @returns a `Promise` for the final results
     */
    fetch() {
        return new Promise((resolve, reject) => {
            this.load((error, results) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(results);
                }
            });
        });
    }
    /**
     * Asynchronously find the available sources using a callback.
     *
     * @param callback the callback function to invoke with the results
     * @returns this object
     */
    load(callback) {
        const q = queue();
        for (const filter of this.#filters) {
            const url = this.api.availableSourcesUrl(filter, true);
            q.defer(this.requestor(url));
        }
        q.awaitAll((error, results) => {
            if (error || !results) {
                log.error("Error requesting available sources: %s", error);
                callback(error);
                return;
            }
            const result = {};
            for (const data of results) {
                if (!data) {
                    continue;
                }
                for (const pair of data) {
                    let nodeIds = result[pair.nodeId];
                    if (!nodeIds) {
                        nodeIds = [];
                        result[pair.nodeId] = nodeIds;
                    }
                    if (nodeIds.indexOf(pair.sourceId) < 0) {
                        nodeIds.push(pair.sourceId);
                    }
                }
            }
            callback(undefined, result);
        });
        return this;
    }
}
//# sourceMappingURL=datumSourceFinder.js.map