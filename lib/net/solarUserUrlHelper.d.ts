import UrlHelper from "./urlHelper.js";
/**
 * The SolarUser default path.
 */
export declare const SolarUserDefaultPath = "/solaruser";
/**
 * The {@link Net.UrlHelper} parameters key for the SolarUser path.
 */
export declare const SolarUserPathKey = "solarUserPath";
/**
 * The SolarUser REST API path.
 */
export declare const SolarUserApiPathV1 = "/api/v1/sec";
/**
 * Extension of `UrlHelper` for SolarUser APIs.
 *
 * The base URL uses the configured environment to resolve the
 * `hostUrl` and a `solarUserPath` context path. If the context path
 * is not available, it will default to `/solaruser`.
 */
export declare class SolarUserUrlHelper extends UrlHelper {
    baseUrl(): string;
}
declare const SolarUserApi_base: {
    new (...args: any[]): {
        whoamiUrl(): string;
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
        refreshTokenV2Url(date?: Date | undefined): string;
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
        viewInstructionUrl(instructionId: number): string;
        viewActiveInstructionsUrl(nodeId?: number | undefined): string;
        viewPendingInstructionsUrl(nodeId?: number | undefined): string;
        updateInstructionStateUrl(instructionId: number, state: import("../domain/instructionState.js").InstructionState): string;
        "__#17@#instructionUrl"(exec: boolean, topic: string, parameters?: import("../domain/instructionParameter.js").default[] | undefined, nodeIds?: number | number[] | undefined): string;
        queueInstructionUrl(topic: string, parameters?: import("../domain/instructionParameter.js").default[] | undefined, nodeId?: number | undefined): string;
        queueInstructionsUrl(topic: string, parameters?: import("../domain/instructionParameter.js").default[] | undefined, nodeIds?: number[] | undefined): string;
        execInstructionUrl(topic: string, parameters?: import("../domain/instructionParameter.js").default[] | undefined, nodeIds?: number | number[] | undefined): string;
        queueInstructionRequest(topic?: string | undefined, parameters?: import("../domain/instructionParameter.js").default[] | undefined, nodeId?: number | undefined, executionDate?: Date | undefined): import("./instructionUrlHelperMixin.js").QueueInstructionRequest | import("./instructionUrlHelperMixin.js").QueueInstructionSimpleRequest;
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
    urlEncodeInstructionParameters(parameters?: import("../domain/instructionParameter.js").default[] | undefined): string;
    canUseSimpleRequest(parameters?: import("../domain/instructionParameter.js").default[] | undefined): boolean;
    instructionParameter(name: string, value: string): import("../domain/instructionParameter.js").default;
} & {
    new (...args: any[]): {
        "__#19@#userDatumAuxiliaryBaseUrl"(): string;
        listUserDatumAuxiliaryUrl(filter: import("../domain/datumFilter.js").default): string;
        userDatumAuxiliaryIdUrl(type: import("../domain/datumAuxiliaryType.js").DatumAuxiliaryType, nodeId: number, date: Date, sourceId: string): string;
        userDatumAuxiliaryIdQueryUrl(type: import("../domain/datumAuxiliaryType.js").DatumAuxiliaryType, nodeId: number, date: Date, sourceId: string): string;
        storeUserDatumAuxiliaryUrl(type: import("../domain/datumAuxiliaryType.js").DatumAuxiliaryType, nodeId: number, date: Date, sourceId: string): string;
        viewUserDatumAuxiliaryUrl(type: import("../domain/datumAuxiliaryType.js").DatumAuxiliaryType, nodeId: number, date: Date, sourceId: string): string;
        deleteUserDatumAuxiliaryUrl(type: import("../domain/datumAuxiliaryType.js").DatumAuxiliaryType, nodeId: number, date: Date, sourceId: string): string;
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
        findUserMetadataUrl(filter: import("../domain/userMetadataFilter.js").default): string;
        "__#20@#userMetadataUrl"(userId?: number | undefined): string;
        viewUserMetadataUrl(userId?: number | undefined): string;
        addUserMetadataUrl(userId?: number | undefined): string;
        replaceUserMetadataUrl(userId?: number | undefined): string;
        deleteUserMetadataUrl(userId?: number | undefined): string;
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
        viewNodesUrl(): string;
        viewPendingNodesUrl(): string;
        viewArchivedNodesUrl(): string;
        updateNodeArchivedStatusUrl(archived: boolean, nodeId?: number | number[] | undefined): string;
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
} & typeof SolarUserUrlHelper;
/**
 * The SolarUser API URL helper.
 */
export default class SolarUserApi extends SolarUserApi_base {
}
export {};
//# sourceMappingURL=solarUserUrlHelper.d.ts.map