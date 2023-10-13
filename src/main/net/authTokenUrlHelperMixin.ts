import { UrlHelperConstructor } from "./urlHelper.js";
import { dateFormat } from "../util/dates.js";

/**
 * Create a AuthTokenUrlHelperMixin class.
 *
 * @param superclass - the UrlHelper class to mix onto
 * @returns the mixin class
 * @ignore
 */
const AuthTokenUrlHelperMixin = <T extends UrlHelperConstructor>(
	superclass: T
) =>
	/**
	 * A mixin class that adds authentication token support to {@link Net.UrlHelper}.
	 *
	 * @mixin
	 */
	class AuthTokenUrlHelperMixin extends superclass {
		/**
		 * Generate a URL to refresh the signing key of an authentication token.
		 *
		 * **Note** this method only works against the `/sec` version of the API endpoint.
		 *
		 * @param date - the signing date to use, or `null` for the current date
		 * @returns the URL
		 */
		refreshTokenV2Url(date?: Date): string {
			return (
				this.baseUrl() +
				"/auth-tokens/refresh/v2?date=" +
				encodeURIComponent(dateFormat(date || new Date()))
			);
		}
	};

export default AuthTokenUrlHelperMixin;
