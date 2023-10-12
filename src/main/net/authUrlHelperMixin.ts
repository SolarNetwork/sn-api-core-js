import { UrlHelperConstructor } from "./urlHelper.js";

/**
 * Create a AuthUrlHelperMixin class.
 *
 * @param superclass - the UrlHelper class to mix onto
 * @returns the mixin class
 * @ignore
 */
const AuthUrlHelperMixin = <T extends UrlHelperConstructor>(superclass: T) =>
	/**
	 * A mixin class that adds authentication token support to {@link Net.UrlHelper}.
	 *
	 * @mixin
	 */
	class AuthUrlHelperMixin extends superclass {
		/**
		 * Generate a URL to get information about the requesting authenticated user.
		 *
		 * @return the URL to view information about the authenticated user
		 */
		whoamiUrl(): string {
			return this.baseUrl() + "/whoami";
		}
	};

export default AuthUrlHelperMixin;
