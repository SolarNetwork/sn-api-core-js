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
        "__#16@#baseDatumMetadataUrl"(nodeId?: number): string;
        "__#16@#datumMetadataUrlWithSource"(nodeId?: number, sourceId?: string): string;
        viewNodeDatumMetadataUrl(nodeId?: number, sourceId?: string): string;
        addNodeDatumMetadataUrl(nodeId?: number, sourceId?: string): string;
        replaceNodeDatumMetadataUrl(nodeId?: number, sourceId?: string): string;
        deleteNodeDatumMetadataUrl(nodeId?: number, sourceId?: string): string;
        findNodeDatumMetadataUrl(nodeId?: number, sourceId?: string, sorts?: import("../domain/sortDescriptor.js").default[], pagination?: import("../domain/pagination.js").default): string;
        "__#16@#userMetadataUrl"(userId?: number): string;
        viewUserMetadataUrl(userId?: number): string;
        readonly "__#13@#environment": import("./environment.js").EnvironmentConfig & import("./environment.js").HostConfig;
        readonly "__#13@#parameters": import("../util/configuration.js").default;
        readonly environment: import("./environment.js").EnvironmentConfig & import("./environment.js").HostConfig;
        readonly parameters: import("../util/configuration.js").default;
        env(key: string): any;
        env(key: string, val: any): import("./environment.js").EnvironmentConfig & import("./environment.js").HostConfig;
        parameter(key: string): any;
        parameter(key: string, val: any): import("../util/configuration.js").default;
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
        reportableIntervalUrl(nodeId?: number, sourceIds?: string[]): string;
        availableSourcesUrl(datumFilter?: import("../domain/datumFilter.js").default, withNodeIds?: boolean): string;
        listDatumUrl(datumFilter?: import("../domain/datumFilter.js").default, sorts?: import("../domain/sortDescriptor.js").default[], pagination?: import("../domain/pagination.js").default): string;
        datumReadingUrl(readingType: import("../domain/datumReadingType.js").DatumReadingType, datumFilter?: import("../domain/datumFilter.js").default, tolerance?: string, sorts?: import("../domain/sortDescriptor.js").default[], pagination?: import("../domain/pagination.js").default): string;
        streamDatumUrl(datumFilter?: import("../domain/datumFilter.js").default, sorts?: import("../domain/sortDescriptor.js").default[], pagination?: import("../domain/pagination.js").default): string;
        streamReadingUrl(readingType: import("../domain/datumReadingType.js").DatumReadingType, datumFilter?: import("../domain/datumFilter.js").default, tolerance?: string, sorts?: import("../domain/sortDescriptor.js").default[], pagination?: import("../domain/pagination.js").default): string;
        mostRecentDatumUrl(datumFilter?: import("../domain/datumFilter.js").default, sorts?: import("../domain/sortDescriptor.js").default[], pagination?: import("../domain/pagination.js").default): string;
        readonly "__#13@#environment": import("./environment.js").EnvironmentConfig & import("./environment.js").HostConfig;
        readonly "__#13@#parameters": import("../util/configuration.js").default;
        readonly environment: import("./environment.js").EnvironmentConfig & import("./environment.js").HostConfig;
        readonly parameters: import("../util/configuration.js").default;
        env(key: string): any;
        env(key: string, val: any): import("./environment.js").EnvironmentConfig & import("./environment.js").HostConfig;
        parameter(key: string): any;
        parameter(key: string, val: any): import("../util/configuration.js").default;
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
        findSourcesUrl(datumFilter?: import("../domain/datumFilter.js").default): string;
        readonly "__#13@#environment": import("./environment.js").EnvironmentConfig & import("./environment.js").HostConfig;
        readonly "__#13@#parameters": import("../util/configuration.js").default;
        readonly environment: import("./environment.js").EnvironmentConfig & import("./environment.js").HostConfig;
        readonly parameters: import("../util/configuration.js").default;
        env(key: string): any;
        env(key: string, val: any): import("./environment.js").EnvironmentConfig & import("./environment.js").HostConfig;
        parameter(key: string): any;
        parameter(key: string, val: any): import("../util/configuration.js").default;
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
        "__#18@#baseLocationDatumMetadataUrl"(locationId?: number): string;
        "__#18@#locationDatumMetadataUrlWithSource"(locationId?: number, sourceId?: string): string;
        viewLocationDatumMetadataUrl(locationId?: number, sourceId?: string): string;
        addLocationDatumMetadataUrl(locationId?: number, sourceId?: string): string;
        replaceLocationDatumMetadataUrl(locationId?: number, sourceId?: string): string;
        deleteLocationDatumMetadataUrl(locationId?: number, sourceId?: string): string;
        findLocationDatumMetadataUrl(filter: import("../domain/datumFilter.js").default, sorts?: import("../domain/sortDescriptor.js").default[], pagination?: import("../domain/pagination.js").default): string;
        readonly "__#13@#environment": import("./environment.js").EnvironmentConfig & import("./environment.js").HostConfig;
        readonly "__#13@#parameters": import("../util/configuration.js").default;
        readonly environment: import("./environment.js").EnvironmentConfig & import("./environment.js").HostConfig;
        readonly parameters: import("../util/configuration.js").default;
        env(key: string): any;
        env(key: string, val: any): import("./environment.js").EnvironmentConfig & import("./environment.js").HostConfig;
        parameter(key: string): any;
        parameter(key: string, val: any): import("../util/configuration.js").default;
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
        reportableIntervalUrl(locationId?: number, sourceId?: string): string;
        availableSourcesUrl(locationId?: number, startDate?: Date, endDate?: Date): string;
        listDatumUrl(datumFilter?: import("../domain/datumFilter.js").default, sorts?: import("../domain/sortDescriptor.js").default[], pagination?: import("../domain/pagination.js").default): string;
        mostRecentDatumUrl(datumFilter?: import("../domain/datumFilter.js").default, sorts?: import("../domain/sortDescriptor.js").default[], pagination?: import("../domain/pagination.js").default): string;
        readonly "__#13@#environment": import("./environment.js").EnvironmentConfig & import("./environment.js").HostConfig;
        readonly "__#13@#parameters": import("../util/configuration.js").default;
        readonly environment: import("./environment.js").EnvironmentConfig & import("./environment.js").HostConfig;
        readonly parameters: import("../util/configuration.js").default;
        env(key: string): any;
        env(key: string, val: any): import("./environment.js").EnvironmentConfig & import("./environment.js").HostConfig;
        parameter(key: string): any;
        parameter(key: string, val: any): import("../util/configuration.js").default;
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
        findLocationsUrl(filter: import("../domain/location.js").default, sorts?: import("../domain/sortDescriptor.js").default[], pagination?: import("../domain/pagination.js").default): string;
        readonly "__#13@#environment": import("./environment.js").EnvironmentConfig & import("./environment.js").HostConfig;
        readonly "__#13@#parameters": import("../util/configuration.js").default;
        readonly environment: import("./environment.js").EnvironmentConfig & import("./environment.js").HostConfig;
        readonly parameters: import("../util/configuration.js").default;
        env(key: string): any;
        env(key: string, val: any): import("./environment.js").EnvironmentConfig & import("./environment.js").HostConfig;
        parameter(key: string): any;
        parameter(key: string, val: any): import("../util/configuration.js").default;
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