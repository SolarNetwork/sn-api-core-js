import { UrlHelperConstructor } from "./urlHelper.js";
/**
 * The {@link Net.UrlHelper} parameters key for the SolarSsh path.
 */
export declare const SolarSshPathKey = "solarSshPath";
/**
 * The SolarSsh default path.
 */
export declare const SolarSshDefaultPath = "";
/** The SolarSsh WebSocket path for a terminal connection. */
export declare const SolarSshTerminalWebSocketPath = "/ssh";
/**
 * Create a SolarSshUrlHelperMixin class.
 *
 * @param superclass the UrlHelper class to mix onto
 * @return the mixin class
 * @ignore
 */
declare const SolarSshUrlHelperMixin: <T extends UrlHelperConstructor>(superclass: T) => {
    new (...args: any[]): {
        /**
         * Get the URL to the SolarSSH WebSocket termainl connection for a SolarNode.
         *
         * @param sessionId the {@link Domain.SshSession} ID to use
         * @returns the WebSocket terminal URL
         * @throws Error if no session ID available
         */
        terminalWebSocketUrl(sessionId: string): string;
        /**
         * Get the URL to the SolarSSH HTTP proxy to the configured SolarNode.
         *
         * @param sessionId the {@link Domain.SshSession} ID to use
         * @returns the HTTP proxy URL
         * @throws Error if no session ID available
         */
        httpProxyUrl(sessionId: string): string;
        /**
         * Generate a URL for creating a new SolarSSH session.
         *
         * @param nodeId the node ID to connect to; if not provided the `nodeId` parameter of this object will be used
         * @returns the URL
         * @throws Error if no node ID available
         */
        createSshSessionUrl(nodeId?: number): string;
        /**
         * Generate a URL for starting a SolarSSH session.
         *
         * @param sessionId the {@link Domain.SshSession} ID to use
         * @returns the URL
         * @throws Error if no session ID available
         */
        startSshSessionUrl(sessionId: string): string;
        /**
         * Generate a URL for stopping a SolarSSH session.
         *
         * @param sessionId the {@link Domain.SshSession} ID to use
         * @returns the URL
         * @throws Error if no session ID available
         */
        stopSshSessionUrl(sessionId: string): string;
        readonly "__#private@#environment": import("./environment.js").EnvironmentConfig & import("./environment.js").HostConfig;
        readonly "__#private@#parameters": import("../util/configuration.js").default;
        get environment(): import("./environment.js").EnvironmentConfig & import("./environment.js").HostConfig;
        get parameters(): import("../util/configuration.js").default;
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
        datumFilter(): import("../domain/datumFilter.js").default;
    };
} & T;
export default SolarSshUrlHelperMixin;
//# sourceMappingURL=solarSshUrlHelperMixin.d.ts.map