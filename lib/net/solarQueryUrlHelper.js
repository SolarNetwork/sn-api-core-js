import UrlHelper from "./urlHelper.js";
import DatumMetadataUrlHelperMixin from "./datumMetadataUrlHelperMixin.js";
import DatumUrlHelperMixin from "./datumUrlHelperMixin.js";
import LocationDatumMetadataUrlHelperMixin from "./locationDatumMetadataUrlHelperMixin.js";
import LocationDatumUrlHelperMixin from "./locationDatumUrlHelperMixin.js";
import LocationsUrlHelperMixin from "./locationsUrlHelperMixin.js";
import NodesUrlHelperMixin from "./nodesUrlHelperMixin.js";
/**
 * The SolarQuery default path.
 */
export const SolarQueryDefaultPath = "/solarquery";
/**
 * The {@link Net.UrlHelper#parameters} key for the SolarQuery path.
 */
export const SolarQueryPathKey = "solarQueryPath";
/**
 * The SolarQuery REST API path.
 */
export const SolarQueryApiPathV1 = "/api/v1";
/**
 * The {@link Net.UrlHelper#parameters} key that holds a `boolean` flag to
 * use the public path scheme (`/pub`) when constructing URLs.
 */
export const SolarQueryPublicPathKey = "publicQuery";
/**
 * Extension of `UrlHelper` for SolarQuery APIs.
 *
 * The base URL uses the configured environment to resolve
 * the `hostUrl`, the `solarQueryPath` context path,
 * and the `publicQuery` boolean flag. If the context path is not
 * available, it will default to `/solarquery`.
 */
export class SolarQueryUrlHelper extends UrlHelper {
    /**
     * The `publicQuery` environment parameter.
     */
    get publicQuery() {
        return !!this.env(SolarQueryPublicPathKey);
    }
    set publicQuery(value) {
        this.env(SolarQueryPublicPathKey, !!value);
    }
    baseUrl() {
        const path = this.env(SolarQueryPathKey) || SolarQueryDefaultPath;
        const isPubPath = this.publicQuery;
        return (this.hostUrl() +
            path +
            SolarQueryApiPathV1 +
            (isPubPath ? "/pub" : "/sec"));
    }
}
/**
 * The SolarQuery API URL helper.
 */
export default class SolarQueryApi extends DatumMetadataUrlHelperMixin(DatumUrlHelperMixin(NodesUrlHelperMixin(SolarQueryUrlHelper))) {
}
/**
 * SolarQuery location API URL helper.
 */
export class SolarQueryLocationApi extends LocationDatumMetadataUrlHelperMixin(LocationDatumUrlHelperMixin(LocationsUrlHelperMixin(SolarQueryUrlHelper))) {
}
//# sourceMappingURL=solarQueryUrlHelper.js.map