import UrlHelper from "./urlHelper.js";
/**
 * The SolarQuery default path.
 */
export declare const SolarQueryDefaultPath = "/solarquery";
/**
 * The {@link Net.UrlHelper#parameters} key for the SolarQuery path.
 */
export declare const SolarQueryPathKey = "solarQueryPath";
/**
 * The SolarQuery REST API path.
 */
export declare const SolarQueryApiPathV1 = "/api/v1";
/**
 * The {@link Net.UrlHelper#parameters} key that holds a `boolean` flag to
 * use the public path scheme (`/pub`) when constructing URLs.
 */
export declare const SolarQueryPublicPathKey = "publicQuery";
/**
 * Extension of `UrlHelper` for SolarQuery APIs.
 *
 * The base URL uses the configured environment to resolve
 * the `hostUrl`, the `solarQueryPath` context path,
 * and the `publicQuery` boolean flag. If the context path is not
 * available, it will default to `/solarquery`.
 */
export declare class SolarQueryUrlHelper extends UrlHelper {
    /**
     * The `publicQuery` environment parameter.
     */
    get publicQuery(): boolean;
    set publicQuery(value: boolean);
    baseUrl(): string;
}
declare const SolarQueryApi_base: {
    new (...args: any[]): {
        "__#16@#baseDatumMetadataUrl"(nodeId?: number | undefined): string;
        "__#16@#datumMetadataUrlWithSource"(nodeId?: number | undefined, sourceId?: string | undefined): string;
        viewNodeDatumMetadataUrl(nodeId?: number | undefined, sourceId?: string | undefined): string;
        addNodeDatumMetadataUrl(nodeId?: number | undefined, sourceId?: string | undefined): string;
        replaceNodeDatumMetadataUrl(nodeId?: number | undefined, sourceId?: string | undefined): string;
        deleteNodeDatumMetadataUrl(nodeId?: number | undefined, sourceId?: string | undefined): string;
        findNodeDatumMetadataUrl(nodeId?: number | undefined, sourceId?: string | undefined, sorts?: import("../domain/sortDescriptor.js").default[] | undefined, pagination?: import("../domain/pagination.js").default | undefined): string;
        "__#16@#userMetadataUrl"(userId?: number | undefined): string;
        viewUserMetadataUrl(userId?: number | undefined): string;
        readonly "__#13@#environment": import("./environment.js").EnvironmentConfig & import("./environment.js").HostConfig;
        readonly "__#13@#parameters": import("../util/configuration.js").default;
        readonly environment: import("./environment.js").EnvironmentConfig & import("./environment.js").HostConfig;
        readonly parameters: import("../util/configuration.js").default;
        env(key: string): any;
        env(key: string, newValue: any): import("./environment.js").EnvironmentConfig & import("./environment.js").HostConfig;
        parameter(key: string): any;
        parameter(key: string, newValue: any): import("../util/configuration.js").default;
        param<T>(key: string): T | undefined;
        hostUrl(): string;
        hostRequestUrl(): string;
        toRequestUrl(url: string): string;
        hostWebSocketUrl(): string;
        baseUrl(): string;
        resolveTemplatePath(template: string): string;
        resolveTemplateUrl(template: string): string;
        datumFilter(): import("../domain/datumFilter.js").default;
    };
} & {
    new (...args: any[]): {
        reportableIntervalUrl(nodeId?: number | undefined, sourceIds?: string[] | undefined): string;
        availableSourcesUrl(datumFilter?: import("../domain/datumFilter.js").default | undefined, withNodeIds?: boolean | undefined): string;
        listDatumUrl(datumFilter?: import("../domain/datumFilter.js").default | undefined, sorts?: import("../domain/sortDescriptor.js").default[] | undefined, pagination?: import("../domain/pagination.js").default | undefined): string;
        datumReadingUrl(readingType: import("../domain/datumReadingType.js").DatumReadingType, datumFilter?: import("../domain/datumFilter.js").default | undefined, tolerance?: string | undefined, sorts?: import("../domain/sortDescriptor.js").default[] | undefined, pagination?: import("../domain/pagination.js").default | undefined): string;
        streamDatumUrl(datumFilter?: import("../domain/datumFilter.js").default | undefined, sorts?: import("../domain/sortDescriptor.js").default[] | undefined, pagination?: import("../domain/pagination.js").default | undefined): string;
        streamReadingUrl(readingType: import("../domain/datumReadingType.js").DatumReadingType, datumFilter?: import("../domain/datumFilter.js").default | undefined, tolerance?: string | undefined, sorts?: import("../domain/sortDescriptor.js").default[] | undefined, pagination?: import("../domain/pagination.js").default | undefined): string;
        mostRecentDatumUrl(datumFilter?: import("../domain/datumFilter.js").default | undefined, sorts?: import("../domain/sortDescriptor.js").default[] | undefined, pagination?: import("../domain/pagination.js").default | undefined): string;
        readonly "__#13@#environment": import("./environment.js").EnvironmentConfig & import("./environment.js").HostConfig;
        readonly "__#13@#parameters": import("../util/configuration.js").default;
        readonly environment: import("./environment.js").EnvironmentConfig & import("./environment.js").HostConfig;
        readonly parameters: import("../util/configuration.js").default;
        env(key: string): any;
        env(key: string, newValue: any): import("./environment.js").EnvironmentConfig & import("./environment.js").HostConfig;
        parameter(key: string): any;
        parameter(key: string, newValue: any): import("../util/configuration.js").default;
        param<T>(key: string): T | undefined;
        hostUrl(): string;
        hostRequestUrl(): string;
        toRequestUrl(url: string): string;
        hostWebSocketUrl(): string;
        baseUrl(): string;
        resolveTemplatePath(template: string): string;
        resolveTemplateUrl(template: string): string;
        datumFilter(): import("../domain/datumFilter.js").default;
    };
} & {
    new (...args: any[]): {
        listAllNodeIdsUrl(): string;
        findSourcesUrl(datumFilter?: import("../domain/datumFilter.js").default | undefined): string;
        readonly "__#13@#environment": import("./environment.js").EnvironmentConfig & import("./environment.js").HostConfig;
        readonly "__#13@#parameters": import("../util/configuration.js").default;
        readonly environment: import("./environment.js").EnvironmentConfig & import("./environment.js").HostConfig;
        readonly parameters: import("../util/configuration.js").default;
        env(key: string): any;
        env(key: string, newValue: any): import("./environment.js").EnvironmentConfig & import("./environment.js").HostConfig;
        parameter(key: string): any;
        parameter(key: string, newValue: any): import("../util/configuration.js").default;
        param<T>(key: string): T | undefined;
        hostUrl(): string;
        hostRequestUrl(): string;
        toRequestUrl(url: string): string;
        hostWebSocketUrl(): string;
        baseUrl(): string;
        resolveTemplatePath(template: string): string;
        resolveTemplateUrl(template: string): string;
        datumFilter(): import("../domain/datumFilter.js").default;
    };
} & typeof SolarQueryUrlHelper;
/**
 * The SolarQuery API URL helper.
 */
export default class SolarQueryApi extends SolarQueryApi_base {
}
declare const SolarQueryLocationApi_base: {
    new (...args: any[]): {
        "__#18@#baseLocationDatumMetadataUrl"(locationId?: number | undefined): string;
        "__#18@#locationDatumMetadataUrlWithSource"(locationId?: number | undefined, sourceId?: string | undefined): string;
        viewLocationDatumMetadataUrl(locationId?: number | undefined, sourceId?: string | undefined): string;
        addLocationDatumMetadataUrl(locationId?: number | undefined, sourceId?: string | undefined): string;
        replaceLocationDatumMetadataUrl(locationId?: number | undefined, sourceId?: string | undefined): string;
        deleteLocationDatumMetadataUrl(locationId?: number | undefined, sourceId?: string | undefined): string;
        findLocationDatumMetadataUrl(filter: import("../domain/datumFilter.js").default, sorts?: import("../domain/sortDescriptor.js").default[] | undefined, pagination?: import("../domain/pagination.js").default | undefined): string;
        readonly "__#13@#environment": import("./environment.js").EnvironmentConfig & import("./environment.js").HostConfig;
        readonly "__#13@#parameters": import("../util/configuration.js").default;
        readonly environment: import("./environment.js").EnvironmentConfig & import("./environment.js").HostConfig;
        readonly parameters: import("../util/configuration.js").default;
        env(key: string): any;
        env(key: string, newValue: any): import("./environment.js").EnvironmentConfig & import("./environment.js").HostConfig;
        parameter(key: string): any;
        parameter(key: string, newValue: any): import("../util/configuration.js").default;
        param<T>(key: string): T | undefined;
        hostUrl(): string;
        hostRequestUrl(): string;
        toRequestUrl(url: string): string;
        hostWebSocketUrl(): string;
        baseUrl(): string;
        resolveTemplatePath(template: string): string;
        resolveTemplateUrl(template: string): string;
        datumFilter(): import("../domain/datumFilter.js").default;
    };
} & {
    new (...args: any[]): {
        reportableIntervalUrl(locationId?: number | undefined, sourceId?: string | undefined): string;
        availableSourcesUrl(locationId?: number | undefined, startDate?: Date | undefined, endDate?: Date | undefined): string;
        listDatumUrl(datumFilter?: import("../domain/datumFilter.js").default | undefined, sorts?: import("../domain/sortDescriptor.js").default[] | undefined, pagination?: import("../domain/pagination.js").default | undefined): string;
        mostRecentDatumUrl(datumFilter?: import("../domain/datumFilter.js").default | undefined, sorts?: import("../domain/sortDescriptor.js").default[] | undefined, pagination?: import("../domain/pagination.js").default | undefined): string;
        readonly "__#13@#environment": import("./environment.js").EnvironmentConfig & import("./environment.js").HostConfig;
        readonly "__#13@#parameters": import("../util/configuration.js").default;
        readonly environment: import("./environment.js").EnvironmentConfig & import("./environment.js").HostConfig;
        readonly parameters: import("../util/configuration.js").default;
        env(key: string): any;
        env(key: string, newValue: any): import("./environment.js").EnvironmentConfig & import("./environment.js").HostConfig;
        parameter(key: string): any;
        parameter(key: string, newValue: any): import("../util/configuration.js").default;
        param<T>(key: string): T | undefined;
        hostUrl(): string;
        hostRequestUrl(): string;
        toRequestUrl(url: string): string;
        hostWebSocketUrl(): string;
        baseUrl(): string;
        resolveTemplatePath(template: string): string;
        resolveTemplateUrl(template: string): string;
        datumFilter(): import("../domain/datumFilter.js").default;
    };
} & {
    new (...args: any[]): {
        findLocationsUrl(filter: import("../domain/location.js").default, sorts?: import("../domain/sortDescriptor.js").default[] | undefined, pagination?: import("../domain/pagination.js").default | undefined): string;
        readonly "__#13@#environment": import("./environment.js").EnvironmentConfig & import("./environment.js").HostConfig;
        readonly "__#13@#parameters": import("../util/configuration.js").default;
        readonly environment: import("./environment.js").EnvironmentConfig & import("./environment.js").HostConfig;
        readonly parameters: import("../util/configuration.js").default;
        env(key: string): any;
        env(key: string, newValue: any): import("./environment.js").EnvironmentConfig & import("./environment.js").HostConfig;
        parameter(key: string): any;
        parameter(key: string, newValue: any): import("../util/configuration.js").default;
        param<T>(key: string): T | undefined;
        hostUrl(): string;
        hostRequestUrl(): string;
        toRequestUrl(url: string): string;
        hostWebSocketUrl(): string;
        baseUrl(): string;
        resolveTemplatePath(template: string): string;
        resolveTemplateUrl(template: string): string;
        datumFilter(): import("../domain/datumFilter.js").default;
    };
} & typeof SolarQueryUrlHelper;
/**
 * SolarQuery location API URL helper.
 */
export declare class SolarQueryLocationApi extends SolarQueryLocationApi_base {
}
export {};
//# sourceMappingURL=solarQueryUrlHelper.d.ts.map