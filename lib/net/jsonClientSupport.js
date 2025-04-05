import HttpHeaders from "./httpHeaders.js";
import SolarQueryApi from "./solarQueryUrlHelper.js";
import { default as log } from "../util/logger.js";
/**
 * An abstract class for JSON client support.
 *
 * @typeParam API the URL helper type
 * @typeParam T the result data type
 */
export default class JsonClientSupport {
    /**
     * The URL helper instance to use.
     */
    api;
    /**
     * An authorization builder to use to make authenticated HTTP requests.
     */
    authBuilder;
    /**
     * Constructor.
     *
     * If `api` is a {@link Net.SolarQueryApi} and no `authBuilder` is provided, the {@link Net.SolarQueryApi#publicQuery}
     * property will be automatically set to `true`.
     *
     * @param api the URL helper to use
     * @param authBuilder the auth builder to authenticate requests with; if not provided
     *                    then only public data can be queried
     */
    constructor(api, authBuilder) {
        this.api = api;
        this.authBuilder = authBuilder;
        if (api instanceof SolarQueryApi && !authBuilder) {
            api.publicQuery = true;
        }
    }
    /**
     * Create a URL fetch requestor.
     *
     * The returned function can be passed to `d3.queue` or invoked directly.
     *
     * @param url the URL to request.
     * @param signUrl the URL to sign (might be different to `url` if a proxy is used)
     * @returns a function that accepts a callback argument
     */
    requestor(url, signUrl) {
        const auth = this.authBuilder;
        return (cb) => {
            const headers = {
                Accept: "application/json",
            };
            if (auth && auth.signingKeyValid) {
                headers[HttpHeaders.AUTHORIZATION] = auth
                    .reset()
                    .snDate(true)
                    .url(signUrl || url, true)
                    .buildWithSavedKey();
                headers[HttpHeaders.X_SN_DATE] = auth.requestDateHeaderValue;
            }
            const errorHandler = (error) => {
                log.error("Error requesting data for %s: %s", url, error);
                cb(new Error(`Error requesting data for ${url}: ${error}`));
            };
            fetch(url, {
                headers: headers,
            }).then((res) => {
                if (!res.ok) {
                    errorHandler(res.statusText);
                    return;
                }
                res.json().then((json) => {
                    const r = json;
                    if (!r.success) {
                        let msg = "non-success result returned";
                        if (r.message) {
                            msg += " (" + r.message + ")";
                        }
                        errorHandler(msg);
                        return;
                    }
                    cb(undefined, r.data);
                }, errorHandler);
            }, errorHandler);
        };
    }
}
//# sourceMappingURL=jsonClientSupport.js.map