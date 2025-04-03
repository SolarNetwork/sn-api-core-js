import { default as DatumFilter } from "../domain/datumFilter.js";
import Pagination from "../domain/pagination.js";
import SortDescriptor from "../domain/sortDescriptor.js";
import { UrlHelperConstructor } from "./urlHelper.js";
/**
 * Create a LocationDatumMetadataUrlHelperMixin class.
 *
 * @param superclass - the UrlHelper class to mix onto
 * @return the mixin class
 * @ignore
 */
declare const LocationDatumMetadataUrlHelperMixin: <T extends UrlHelperConstructor>(superclass: T) => {
    new (...args: any[]): {
        /**
         * Get a base URL for location datum metadata operations using a specific location ID.
         *
         * @param locationId a specific location ID to use; if not provided the `locationId` parameter of this instance will be used
         * @returns the base URL
         */
        "__#18@#baseLocationDatumMetadataUrl"(locationId?: number): string;
        "__#18@#locationDatumMetadataUrlWithSource"(locationId?: number, sourceId?: string): string;
        /**
         * Generate a URL for viewing datum metadata.
         *
         * If no `sourceId` is provided, then the API will return all available datum metadata for all sources.
         *
         * @param locationId - a specific location ID to use; if not provided the `locationId` parameter of this instance will be used
         * @param sourceId - a specific source ID to use;
         *                            if not provided the `sourceId` parameter of this instance will be used;
         *                            if `null` then ignore any `sourceId` property of this class
         * @returns the URL
         */
        viewLocationDatumMetadataUrl(locationId?: number, sourceId?: string): string;
        /**
         * Generate a URL for adding (merging) datum metadata via a `POST` request.
         *
         * @param locationId - a specific location ID to use; if not provided the `locationId` parameter of this instance will be used
         * @param sourceId - a specific source ID to use; if not provided the `sourceId` parameter of this instance will be used
         * @returns the URL
         */
        addLocationDatumMetadataUrl(locationId?: number, sourceId?: string): string;
        /**
         * Generate a URL for setting datum metadata via a `PUT` request.
         *
         * @param locationId - a specific location ID to use; if not provided the `locationId` parameter of this instance will be used
         * @param sourceId - a specific source ID to use; if not provided the `sourceId` parameter of this instance will be used
         * @returns the URL
         */
        replaceLocationDatumMetadataUrl(locationId?: number, sourceId?: string): string;
        /**
         * Generate a URL for deleting datum metadata via a `DELETE` request.
         *
         * @param locationId - a specific location ID to use; if not provided the `locationId` parameter of this instance will be used
         * @param sourceId - a specific source ID to use; if not provided the `sourceId` parameter of this instance will be used
         * @returns the URL
         */
        deleteLocationDatumMetadataUrl(locationId?: number, sourceId?: string): string;
        /**
         * Generate a URL for searching for location metadata.
         *
         * @param filter - a search filter; the `locationIds`, `sourceIds`, `tags`,
         *     `query`, and `location` properties are supported
         * @param sorts - optional sort settings to use
         * @param pagination - optional pagination settings to use
         * @returns the URL
         */
        findLocationDatumMetadataUrl(filter: DatumFilter, sorts?: SortDescriptor[], pagination?: Pagination): string;
        readonly "__#13@#environment": import("./environment.js").EnvironmentConfig & import("./environment.js").HostConfig;
        readonly "__#13@#parameters": import("../util/configuration.js").default;
        readonly environment: import("./environment.js").EnvironmentConfig & import("./environment.js").HostConfig;
        readonly parameters: import("../util/configuration.js").default;
        env(key: string): any;
        env(key: string, val: any): import("./environment.js").EnvironmentConfig & import("./environment.js").HostConfig;
        parameter(key: string): any;
        parameter(key: string, val: any): import("../util/configuration.js").default;
        param<T_1>(key: string): T_1 | undefined;
        hostUrl(): string;
        hostRequestUrl(): string;
        toRequestUrl(url: string): string;
        hostWebSocketUrl(): string;
        baseUrl(): string;
        resolveTemplatePath(template: string): string;
        resolveTemplateUrl(template: string): string;
        datumFilter(): DatumFilter;
    };
} & T;
export default LocationDatumMetadataUrlHelperMixin;
//# sourceMappingURL=locationDatumMetadataUrlHelperMixin.d.ts.map