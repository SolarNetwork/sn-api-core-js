import { DatumFilterKeys } from "../domain/datumFilter.js";
/**
 * The {@link Net.UrlHelper} parameters key for the SolarSsh path.
 */
export const SolarSshPathKey = "solarSshPath";
/**
 * The SolarSsh default path.
 */
export const SolarSshDefaultPath = "";
/** The SolarSsh WebSocket path for a terminal connection. */
export const SolarSshTerminalWebSocketPath = "/ssh";
/**
 * Create a SolarSshUrlHelperMixin class.
 *
 * @param superclass the UrlHelper class to mix onto
 * @return the mixin class
 * @ignore
 */
const SolarSshUrlHelperMixin = (superclass) => 
/**
 * A mixin class that adds support for SolarNode properties to a {@link Net.UrlHelper}.
 */
class SolarSshUrlHelperMixin extends superclass {
    /**
     * Get the URL to the SolarSSH WebSocket termainl connection for a SolarNode.
     *
     * @param sessionId the {@link Domain.SshSession} ID to use
     * @returns the WebSocket terminal URL
     * @throws Error if no session ID available
     */
    terminalWebSocketUrl(sessionId) {
        if (!sessionId) {
            throw new Error("No SSH session ID available.");
        }
        const path = this.env(SolarSshPathKey) || SolarSshDefaultPath;
        return (this.hostWebSocketUrl() +
            path +
            SolarSshTerminalWebSocketPath +
            "?sessionId=" +
            encodeURIComponent(sessionId));
    }
    /**
     * Get the URL to the SolarSSH HTTP proxy to the configured SolarNode.
     *
     * @param sessionId the {@link Domain.SshSession} ID to use
     * @returns the HTTP proxy URL
     * @throws Error if no session ID available
     */
    httpProxyUrl(sessionId) {
        if (!sessionId) {
            throw new Error("No SSH session ID available.");
        }
        const path = this.env(SolarSshPathKey) || SolarSshDefaultPath;
        return (this.hostUrl() +
            path +
            "/nodeproxy/" +
            encodeURIComponent(sessionId) +
            "/");
    }
    /**
     * Generate a URL for creating a new SolarSSH session.
     *
     * @param nodeId the node ID to connect to; if not provided the `nodeId` parameter of this object will be used
     * @returns the URL
     * @throws Error if no node ID available
     */
    createSshSessionUrl(nodeId) {
        const node = nodeId || this.param(DatumFilterKeys.NodeId);
        if (!node) {
            throw new Error("No node ID available.");
        }
        return (this.baseUrl() +
            "/ssh/session/new?nodeId=" +
            encodeURIComponent(node));
    }
    /**
     * Generate a URL for starting a SolarSSH session.
     *
     * @param sessionId the {@link Domain.SshSession} ID to use
     * @returns the URL
     * @throws Error if no session ID available
     */
    startSshSessionUrl(sessionId) {
        if (!sessionId) {
            throw new Error("No SSH session ID available.");
        }
        return (this.baseUrl() +
            "/ssh/session/" +
            encodeURIComponent(sessionId) +
            "/start");
    }
    /**
     * Generate a URL for stopping a SolarSSH session.
     *
     * @param sessionId the {@link Domain.SshSession} ID to use
     * @returns the URL
     * @throws Error if no session ID available
     */
    stopSshSessionUrl(sessionId) {
        if (!sessionId) {
            throw new Error("No SSH session ID available.");
        }
        return (this.baseUrl() +
            "/ssh/session/" +
            encodeURIComponent(sessionId) +
            "/stop");
    }
};
export default SolarSshUrlHelperMixin;
//# sourceMappingURL=solarSshUrlHelperMixin.js.map