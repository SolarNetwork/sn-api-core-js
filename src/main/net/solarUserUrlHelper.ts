import UrlHelper from "./urlHelper.js";
import AuthUrlHelperMixin from "./authUrlHelperMixin.js";
import AuthTokenUrlHelperMixin from "./authTokenUrlHelperMixin.js";
import UserDatumAuxiliaryUrlHelperMixin from "./userDatumAuxiliaryUrlHelperMixin.js";
import UserMetadataUrlHelperMixin from "./userMetadataUrlHelperMixin.js";
import { UserNodesUrlHelperMixin } from "./index.js";

/**
 * The SolarUser default path.
 */
export const SolarUserDefaultPath = "/solaruser";

/**
 * The {@link Net.UrlHelper} parameters key for the SolarUser path.
 */
export const SolarUserPathKey = "solarUserPath";

/**
 * The SolarUser REST API path.
 */
export const SolarUserApiPathV1 = "/api/v1/sec";

/**
 * Extension of `UrlHelper` for SolarUser APIs.
 */
export class SolarUserUrlHelper extends UrlHelper {
	/**
	 * Get the base URL to the SolarUser v1 REST API.
	 *
	 * The returned URL uses the configured environment to resolve the
	 * `hostUrl` and a `solarUserPath` context path. If the context path
	 * is not available, it will default to `/solaruser`.
	 *
	 * @returns the base URL to SolarUser
	 * @override
	 */
	baseUrl(): string {
		const path = this.env(SolarUserPathKey) || SolarUserDefaultPath;
		return super.baseUrl() + path + SolarUserApiPathV1;
	}
}

/**
 * The SolarUser API URL helper.
 */
export default class SolarUserApi extends AuthUrlHelperMixin(
	AuthTokenUrlHelperMixin(
		UserDatumAuxiliaryUrlHelperMixin(
			UserMetadataUrlHelperMixin(
				UserNodesUrlHelperMixin(SolarUserUrlHelper)
			)
		)
	)
) {}
