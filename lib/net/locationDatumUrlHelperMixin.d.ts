import { default as DatumFilter } from "../domain/datumFilter.js";
import Pagination from "../domain/pagination.js";
import SortDescriptor from "../domain/sortDescriptor.js";
import { UrlHelperConstructor } from "./urlHelper.js";
/**
 * Create a LocationDatumUrlHelperMixin class.
 *
 * @param superclass - the UrlHelper class to mix onto
 * @return the mixin class
 * @ignore
 */
declare const LocationDatumUrlHelperMixin: <T extends UrlHelperConstructor>(superclass: T) => {
    new (...args: any[]): {
        /**
         * Generate a URL for the "reportable interval" for a location, optionally limited to a specific source ID.
         *
         * If no source IDs are provided, then the reportable interval query will return an interval for
         * all available sources.
         *
         * @param locationId - a specific location ID to use; if not provided the `locationId` parameter of this instance will be used
         * @param sourceId - a specific source ID to limit query to;
         *                 if not provided the `sourceId` parameter of this instance will be used;
         * @returns the URL
         */
        reportableIntervalUrl(locationId?: number, sourceId?: string): string;
        /**
         * Generate a URL for finding the available source IDs for a location or metadata filter.
         *
         * @param ocationId - a specific location ID to use; if not provided the `locationId`
         *     parameter of this instance will be used
         * @param startDate - a start date to limit the search to
         * @param endDate - an end date to limit the search to
         * @returns the URL
         */
        availableSourcesUrl(locationId?: number, startDate?: Date, endDate?: Date): string;
        /**
         * Generate a URL for querying for location datum, in either raw or aggregate form.
         *
         * If the `datumFilter` has an `aggregate` value set, then aggregate results will be
         * returned by SolarNet.
         *
         * @param datumFilter - the search criteria
         * @param sorts - optional sort settings to use
         * @param pagination - optional pagination settings to use
         * @returns the URL
         */
        listDatumUrl(datumFilter?: DatumFilter, sorts?: SortDescriptor[], pagination?: Pagination): string;
        /**
         * Generate a URL for querying for the most recent datum.
         *
         * @param datumFilter the search criteria
         * @param sorts - optional sort settings to use
         * @param pagination - optional pagination settings to use
         * @returns the URL
         */
        mostRecentDatumUrl(datumFilter?: DatumFilter, sorts?: SortDescriptor[], pagination?: Pagination): string;
        readonly "__#13@#environment": import("./environment.js").EnvironmentConfig & import("./environment.js").HostConfig;
        readonly "__#13@#parameters": import("../util/configuration.js").default;
        readonly environment: import("./environment.js").EnvironmentConfig & import("./environment.js").HostConfig;
        readonly parameters: import("../util/configuration.js").default;
        env(key: string): any;
        env(key: string, newValue: any): import("./environment.js").EnvironmentConfig & import("./environment.js").HostConfig;
        parameter(key: string): any;
        parameter(key: string, newValue: any): import("../util/configuration.js").default;
        param<T_1>(key: string): T_1 | undefined;
        hostUrl(): string;
        hostWebSocketUrl(): string;
        baseUrl(): string;
        resolveTemplatePath(template: string): string;
        resolveTemplateUrl(template: string): string;
        datumFilter(): DatumFilter;
    };
} & T;
export default LocationDatumUrlHelperMixin;
//# sourceMappingURL=locationDatumUrlHelperMixin.d.ts.map