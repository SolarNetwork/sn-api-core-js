import AuthorizationV2Builder from "./authV2.js";
import { LoaderDataCallbackFn } from "./loader.js";
import UrlHelper from "./urlHelper.js";
/**
 * An abstract class for JSON client support.
 *
 * @typeParam API the URL helper type
 * @typeParam T the result data type
 */
export default abstract class JsonClientSupport<API extends UrlHelper, T> {
    /**
     * The URL helper instance to use.
     */
    protected readonly api: API;
    /**
     * An authorization builder to use to make authenticated HTTP requests.
     */
    protected readonly authBuilder?: AuthorizationV2Builder;
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
    constructor(api: API, authBuilder?: AuthorizationV2Builder);
    /**
     * Asynchronously load the data.
     *
     * @returns the result promise
     */
    abstract fetch(): Promise<T>;
    /**
     * Create a URL fetch requestor.
     *
     * The returned function can be passed to `d3.queue` or invoked directly.
     *
     * @param url the URL to request.
     * @param signUrl the URL to sign (might be different to `url` if a proxy is used)
     * @returns a function that accepts a callback argument
     */
    protected requestor<V>(url: string, signUrl?: string): (cb: LoaderDataCallbackFn<V>) => void;
}
//# sourceMappingURL=jsonClientSupport.d.ts.map