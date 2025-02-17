import { UrlHelperConstructor } from "./urlHelper.js";
import { default as DatumFilter } from "../domain/datumFilter.js";
import { DatumReadingType } from "../domain/datumReadingType.js";
import Pagination from "../domain/pagination.js";
import SortDescriptor from "../domain/sortDescriptor.js";
/**
 * Create a NodeDatumUrlHelperMixin class.
 *
 * @param superclass - the UrlHelper class to mix onto
 * @returns the mixin class
 * @ignore
 */
declare const DatumUrlHelperMixin: <T extends UrlHelperConstructor>(superclass: T) => {
    new (...args: any[]): {
        /**
         * Generate a URL for the "reportable interval" for a node, optionally limited to a specific set of source IDs.
         *
         * If no source IDs are provided, then the reportable interval query will return an interval for
         * all available sources.
         *
         * @param nodeId - a specific node ID to use; if not provided the `nodeId` parameter will be used
         * @param sourceIds - an array of source IDs to limit query to; if not provided the `sourceIds` parameter will be used
         * @returns the URL
         */
        reportableIntervalUrl(nodeId?: number, sourceIds?: string[]): string;
        /**
         * Generate a URL for finding the available source IDs for a node or metadata filter.
         *
         * @param datumFilter the search criteria, which can define `nodeId`, `startDate`, `endDate`,
         *     and `metadataFilter` properties to limit the results to; if `nodeId` not
         *     provided the `nodeIds` parameter of this instance will be used
         * @param withNodeIds if `true` then force the response to include node IDs along with source IDs,
         *     instead of  just source IDs
         * @returns the URL
         */
        availableSourcesUrl(datumFilter?: DatumFilter, withNodeIds?: boolean): string;
        /**
         * Generate a URL for querying for datum, in either raw or aggregate form.
         *
         * If the `datumFilter` has an `aggregate` value set, then aggregate results will be
         * returned by SolarNet.
         *
         * @param datumFilter - the search criteria; if not provided then {@link Net.UrlHelper#datumFilter this.datumFilter()} will be used
         * @param sorts - optional sort settings to use
         * @param pagination - optional pagination settings to use
         * @returns the URL
         */
        listDatumUrl(datumFilter?: DatumFilter, sorts?: SortDescriptor[], pagination?: Pagination): string;
        /**
         * Generate a URL for querying for datum _reading_ values.
         *
         * The `datumFilter` must provide the required date(s) to use for the
         * reading type. If the reading type only requires one date, then the
         * {@link Domain.DatumFilter#startDate} or
         * {@link Domain.DatumFilter#endDate} value should be provided.
         *
         * @param readingType the type of reading to find
         * @param datumFilter - the search criteria; if not provided then {@link Net.UrlHelper#datumFilter this.datumFilter()} will be used
         * @param tolerance - optional query tolerance to use
         * @param sorts - optional sort settings to use
         * @param pagination - optional pagination settings to use
         * @returns the URL
         * @see https://github.com/SolarNetwork/solarnetwork/wiki/SolarQuery-API#datum-reading
         */
        datumReadingUrl(readingType: DatumReadingType, datumFilter?: DatumFilter, tolerance?: string, sorts?: SortDescriptor[], pagination?: Pagination): string;
        /**
         * Generate a URL for querying for stream datum, in either raw or aggregate form.
         *
         * If the `datumFilter` has an `aggregate` value set, then aggregate results will be
         * returned by SolarNet.
         *
         * @param datumFilter - the search criteria; if not provided then {@link Net.UrlHelper#datumFilter this.datumFilter()} will be used
         * @param sorts - optional sort settings to use
         * @param pagination - optional pagination settings to use
         * @returns the URL
         * @see https://github.com/SolarNetwork/solarnetwork/wiki/SolarQuery-Stream-API#datum-stream-datum-list
         */
        streamDatumUrl(datumFilter?: DatumFilter, sorts?: SortDescriptor[], pagination?: Pagination): string;
        /**
         * Generate a URL for querying for stream _reading_ values.
         *
         * The `datumFilter` must provide the required date(s) to use for the
         * reading type. If the reading type only requires one date, then the
         * {@link Domain.DatumFilter#startDate} or
         * {@link Domain.DatumFilter#endDate} value should be provided.
         *
         * @param readingType the type of reading to find
         * @param datumFilter - the search criteria; if not provided then {@link Net.UrlHelper#datumFilter this.datumFilter()} will be used
         * @param tolerance - optional query tolerance to use
         * @param sorts - optional sort settings to use
         * @param pagination - optional pagination settings to use
         * @returns the URL
         * @see https://github.com/SolarNetwork/solarnetwork/wiki/SolarQuery-Stream-API#datum-stream-reading-list
         */
        streamReadingUrl(readingType: DatumReadingType, datumFilter?: DatumFilter, tolerance?: string, sorts?: SortDescriptor[], pagination?: Pagination): string;
        /**
         * Generate a URL for querying for the most recent datum.
         *
         * @param datumFilter - the search criteria; if not provided then {@link Net.UrlHelper#datumFilter this.datumFilter()} will be used
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
export default DatumUrlHelperMixin;
//# sourceMappingURL=datumUrlHelperMixin.d.ts.map