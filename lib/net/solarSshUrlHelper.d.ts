import SshSession from "../domain/sshSession.js";
import AuthorizationV2Builder from "./authV2.js";
import { HostConfigInfo } from "./environment.js";
import SolarUserApi from "./solarUserUrlHelper.js";
import UrlHelper from "./urlHelper.js";
/**
 * The SolarSsh default host.
 */
export declare const SolarSshDefaultHost = "ssh.solarnetwork.net";
/**
 * The SolarSsh default port.
 */
export declare const SolarSshDefaultPort = 8443;
/**
 * The SolarSsh REST API path.
 */
export declare const SolarSshApiPathV1 = "/api/v1";
/** The sub-protocol to use for SolarSSH WebSocket connections. */
export declare const SolarSshTerminalWebSocketSubProtocol = "solarssh";
/** The node instruction for initiating a SolarSSH connection. */
export declare const StartRemoteSshInstructionName = "StartRemoteSsh";
/** The node instruction for closing a SolarSSH connection. */
export declare const StopRemoteSshInstructionName = "StopRemoteSsh";
/** An {@link Net.UrlHelper} parameter key for a {@link Domain.SshSession} instance. */
export declare const SshSessionKey = "sshSession";
/**
 * Extension of `UrlHelper` for SolarSsh APIs.
 *
 * The base URL uses the configured environment to resolve the
 * `hostUrl` and a `solarSshPath` context path. If the context path
 * is not available, it will default to an empty string.
 */
export declare class SolarSshUrlHelper extends UrlHelper {
    #private;
    /**
     * Constructor.
     *
     * @param environment the optional initial environment to use;
     *        if a non-`Environment` object is passed then the properties of that object will
     *        be used to construct a new `Environment` instance
     * @param userApi the {@link Net.SolarUserApi} to use for instruction handling
     */
    constructor(environment?: HostConfigInfo, userApi?: SolarUserApi);
    baseUrl(): string;
    /**
     * A SSH session object.
     */
    get sshSession(): SshSession | undefined;
    set sshSession(sshSession: SshSession);
    /**
     * Shortcut for getting the SSH session ID from the {@link Domain.SshSession#sessionId} property.
     */
    get sshSessionId(): string | undefined;
    /**
     * Create an instruction auth builder for pre-signing the create session request.
     *
     * The returned builder will be configured for a `GET` request using the
     * `viewPendingInstructionsUrl()` URL.
     *
     * @param nodeId the node ID to connect to; if not provided the `nodeId` parameter of this object will be used
     * @returns the builder
     * @throws Error if no node ID available
     */
    createSshSessionAuthBuilder(nodeId?: number): AuthorizationV2Builder;
    /**
     * Create an instruction auth builder for pre-signing the start session request.
     *
     * The returned builder will be configured for a `POST` request using the
     * `queueInstructionUrl()` URL  with the `StartRemoteSsh` instruction.
     *
     * @param sshSession the session to use; if not provided the {@link Net.SolarSshApi#sshSession} property of this object will be used
     * @returns the builder
     * @throws Error if no session or node ID available
     */
    startSshSessionAuthBuilder(sshSession?: SshSession): AuthorizationV2Builder;
    /**
     * Create an instruction auth builder for pre-signing the stop session request.
     *
     * The returned builder will be configured for a `POST` request using the
     * `queueInstructionUrl()` URL with the `StopRemoteSsh` instruction.
     *
     * @param sshSession the session to use; if not provided the {@link Net.SolarSshApi#sshSession} property of this object will be used
     * @returns the builder
     * @throws Error if no session or node ID available
     */
    stopSshSessionAuthBuilder(sshSession?: SshSession): AuthorizationV2Builder;
    /**
     * Generate a URL for viewing the `StartRemoteSsh` instruction.
     *
     * @param sshSession the session to use; if not provided the {@link Net.SolarSshApi#sshSession} property of this object will be used
     * @returns the URL
     * @throws Error if no instruction ID available
     */
    viewStartRemoteSshInstructionUrl(sshSession?: SshSession): string;
    /**
     * Create an instruction auth builder for signing the request to view the
     * `StartRemoteSsh` instruction.
     *
     * <p>The returned builder will be configured with the same URL returned from
     * {@link Net.SolarSshApi#viewStartRemoteSshInstructionUrl}.
     *
     * @param sshSession the session to use; if not provided the {@link Net.SolarSshApi#sshSession} property of this object will be used
     * @returns the builder
     * @throws Error if no instruction ID available
     */
    viewStartRemoteSshInstructionAuthBuilder(sshSession?: SshSession): AuthorizationV2Builder;
    /**
     * Generate a URL for viewing the `StopRemoteSsh` instruction.
     *
     * @param sshSession the session to use; if not provided the {@link Net.SolarSshApi#sshSession} property of this object will be used
     * @returns the URL
     * @throws Error if no instruction ID available
     */
    viewStopRemoteSshInstructionUrl(sshSession?: SshSession): string;
    /**
     * Create an instruction auth builder for signing the request to view the
     * `StopRemoteSsh` instruction.
     *
     * The returned builder will be configured with the same URL returned from
     * {@link Net.SolarSshApi#viewStopRemoteSshInstructionUrl}.
     *
     * @param sshSession the session to use; if not provided the {@link Net.SolarSshApi#sshSession} property of this object will be used
     * @returns the builder
     * @throws Error if no instruction ID available
     */
    viewStopRemoteSshInstructionAuthBuilder(sshSession?: SshSession): AuthorizationV2Builder;
    /**
     * Create an instruction auth builder for pre-signing the terminal connect request.
     *
     * The returned builder will be configured for a `GET` request using the
     *`viewNodeMetadataUrl()` URL.
     *
     * @param nodeId the node ID to connect to; if not provided the `nodeId` parameter of this object will be used
     * @returns the builder
     */
    connectTerminalWebSocketAuthBuilder(nodeId?: number): AuthorizationV2Builder;
}
declare const SolarSshApi_base: {
    new (...args: any[]): {
        whoamiUrl(): string;
        readonly #environment: import("./environment.js").EnvironmentConfig & import("./environment.js").HostConfig;
        readonly #parameters: import("../util/configuration.js").default;
        get environment(): import("./environment.js").EnvironmentConfig & import("./environment.js").HostConfig;
        get parameters(): import("../util/configuration.js").default;
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
        terminalWebSocketUrl(sessionId: string): string;
        httpProxyUrl(sessionId: string): string;
        createSshSessionUrl(nodeId?: number): string;
        startSshSessionUrl(sessionId: string): string;
        stopSshSessionUrl(sessionId: string): string;
        readonly #environment: import("./environment.js").EnvironmentConfig & import("./environment.js").HostConfig;
        readonly #parameters: import("../util/configuration.js").default;
        get environment(): import("./environment.js").EnvironmentConfig & import("./environment.js").HostConfig;
        get parameters(): import("../util/configuration.js").default;
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
} & typeof SolarSshUrlHelper;
/**
 * The SolarSSH API URL helper.
 */
export default class SolarSshApi extends SolarSshApi_base {
}
export {};
//# sourceMappingURL=solarSshUrlHelper.d.ts.map