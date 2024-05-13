import { DatumAuxiliaryType } from "../domain/datumAuxiliaryType.js";
import { default as DatumFilter } from "../domain/datumFilter.js";
import { UrlHelperConstructor } from "./urlHelper.js";
/**
 * Create a UserDatumAuxiliaryUrlHelperMixin class.
 *
 * @param superclass the UrlHelper class to mix onto
 * @return the mixin class
 * @ignore
 */
declare const UserDatumAuxiliaryUrlHelperMixin: <T extends UrlHelperConstructor>(superclass: T) => {
    new (...args: any[]): {
        "__#19@#userDatumAuxiliaryBaseUrl"(): string;
        /**
         * Generate a URL for viewing the configured user's metadata via a `GET` request.
         *
         * @param filter - the search criteria
         * @returns the URL
         */
        listUserDatumAuxiliaryUrl(filter: DatumFilter): string;
        /**
         * Generate a URL for accessing a specific `DatumAuxiliaryType` by its primary key.
         *
         * If `sourceId` contains any `/` characters, then
         * {@link Net.SolarUserApi#userDatumAuxiliaryIdQueryUrl}
         * will be invoked instead.
         *
         * @param type - the datum auxiliary type
         * @param nodeId - the node ID
         * @param date - a date
         * @param sourceId - the source ID
         * @returns the URL
         */
        userDatumAuxiliaryIdUrl(type: DatumAuxiliaryType, nodeId: number, date: Date, sourceId: string): string;
        /**
         * Generate a URL for accessing a specific `DatumAuxiliaryType` by its primary key,
         * using query parameters for id components.
         *
         * @param type - the datum auxiliary type
         * @param nodeId - the node ID
         * @param date - a date
         * @param sourceId - the source ID
         * @returns the URL
         */
        userDatumAuxiliaryIdQueryUrl(type: DatumAuxiliaryType, nodeId: number, date: Date, sourceId: string): string;
        /**
         * Generate a URL for storing a `DatumAuxiliaryType` via a `POST` request.
         *
         * The {@link module:net~UserDatumAuxiliaryUrlHelperMixin#userDatumAuxiliaryIdUrl} method is used
         * to generate the URL.
         *
         * @param type - the datum auxiliary type
         * @param nodeId - the node ID
         * @param date - a date
         * @param sourceId - the source ID
         * @returns the URL
         */
        storeUserDatumAuxiliaryUrl(type: DatumAuxiliaryType, nodeId: number, date: Date, sourceId: string): string;
        /**
         * Generate a URL for viewing a `DatumAuxiliaryType` via a `GET` request.
         *
         * The {@link Net.SolarUserApi#userDatumAuxiliaryIdUrl} method is used
         * to generate the URL.
         *
         * @param type - the datum auxiliary type
         * @param nodeId - the node ID
         * @param date - a date
         * @param sourceId - the source ID
         * @returns the URL
         */
        viewUserDatumAuxiliaryUrl(type: DatumAuxiliaryType, nodeId: number, date: Date, sourceId: string): string;
        /**
         * Generate a URL for deleting a `DatumAuxiliaryType` via a `DELETE` request.
         *
         * The {@link Net.SolarUserApi#userDatumAuxiliaryIdUrl} method is used
         * to generate the URL.
         *
         * @param type - the datum auxiliary type
         * @param nodeId - the node ID
         * @param date - a date
         * @param sourceId - the source ID
         * @returns the URL
         */
        deleteUserDatumAuxiliaryUrl(type: DatumAuxiliaryType, nodeId: number, date: Date, sourceId: string): string;
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
        hostRequestUrl(): string;
        toRequestUrl(url: string): string;
        hostWebSocketUrl(): string;
        baseUrl(): string;
        resolveTemplatePath(template: string): string;
        resolveTemplateUrl(template: string): string;
        datumFilter(): DatumFilter;
    };
} & T;
export default UserDatumAuxiliaryUrlHelperMixin;
//# sourceMappingURL=userDatumAuxiliaryUrlHelperMixin.d.ts.map