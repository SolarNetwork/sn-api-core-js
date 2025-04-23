import { Result } from "../domain/result.js";
import AuthorizationV2Builder from "./authV2.js";
import HttpHeaders from "./httpHeaders.js";
import { LoaderDataCallbackFn } from "./loader.js";
import SolarQueryApi from "./solarQueryUrlHelper.js";
import UrlHelper from "./urlHelper.js";
import { default as log } from "../util/logger.js";

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
	constructor(api: API, authBuilder?: AuthorizationV2Builder) {
		this.api = api;
		this.authBuilder = authBuilder;
		if (api instanceof SolarQueryApi && !authBuilder) {
			api.publicQuery = true;
		}
	}

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
	 * @param delay an optional number of milliseconds to sleep before initiating the request
	 * @returns a function that accepts a callback argument
	 */
	protected requestor<V>(
		url: string,
		signUrl?: string,
		delay?: number
	): (cb: LoaderDataCallbackFn<V>) => void {
		const auth = this.authBuilder;
		const fn = (cb: LoaderDataCallbackFn<V>) => {
			const headers: any = {
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

			const errorHandler = (error: any) => {
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
					const r = json as Result<any>;
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
		if (delay && delay > 0) {
			return (cb: LoaderDataCallbackFn<V>) => {
				setTimeout(() => {
					fn.call(this, cb);
				}, delay);
			};
		}
		return fn;
	}
}
