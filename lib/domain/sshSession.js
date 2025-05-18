/**
 * A SolarSSH session object.
 */
export default class SshSession {
    created;
    sessionId;
    nodeId;
    sshHost;
    sshPort;
    reverseSshPort;
    startInstructionId;
    stopInstructionId;
    /**
     * Constructor.
     *
     * @param created the creation date, or a number of string suitable for passing to the `Date` constructor
     * @param sessionId the unique session ID
     * @param nodeId the node ID
     * @param sshHost the SSH host name
     * @param sshPort the SSH port
     * @param reverseSshPort the reverse SSH port
     * @param startInstructionId the `StartRemoteSsh` instruction ID
     * @param stopInstructionId the `StopRemoteSsh` instruction ID
     */
    constructor(created, sessionId, nodeId, sshHost, sshPort, reverseSshPort, startInstructionId, stopInstructionId) {
        this.created =
            created instanceof Date ? created : new Date(created);
        this.sessionId = sessionId;
        this.nodeId = nodeId;
        this.sshHost = sshHost;
        this.sshPort = sshPort;
        this.reverseSshPort = reverseSshPort;
        this.startInstructionId = startInstructionId;
        this.stopInstructionId = stopInstructionId;
        if (this.constructor === SshSession) {
            Object.freeze(this);
        }
    }
    /**
     * Get this object in standard JSON form.
     *
     * An example result looks like this:
     *
     * ```json
     * {
     *   "sessionId": "123-abc",
     *   "created": 123456789,
     *   "nodeId": 123,
     *   "host": "ssh.solarnetwork.net",
     *   "port": 9082,
     *   "reversePort": 42000
     * }
     * ```
     *
     * If the `data` value has a `toJsonObject()` function, that will be invoked
     * and used in the result. Otherwise the `data` value will be included as-is.
     *
     * @return an object, ready for JSON encoding
     */
    toJsonObject() {
        const result = {};
        if (this.sessionId) {
            result["sessionId"] = this.sessionId;
        }
        if (this.created) {
            result["created"] = this.created.getTime();
        }
        if (this.nodeId) {
            result["nodeId"] = this.nodeId;
        }
        if (this.sshHost) {
            result["host"] = this.sshHost;
        }
        if (this.sshPort) {
            result["port"] = this.sshPort;
        }
        if (this.reverseSshPort) {
            result["reversePort"] = this.reverseSshPort;
        }
        if (this.startInstructionId) {
            result["startInstructionId"] = this.startInstructionId;
        }
        if (this.stopInstructionId) {
            result["stopInstructionId"] = this.stopInstructionId;
        }
        return result;
    }
    /**
     * Get this object as a standard JSON encoded string value.
     *
     * This method calls {@link Domain.SshSession#toJsonObject} and then
     * turns that into a JSON string.
     *
     * @return the JSON encoded string
     * @see {@link Domain.SshSession#toJsonObject}
     */
    toJsonEncoding() {
        return JSON.stringify(this.toJsonObject());
    }
    /**
     * Create a new instance from an object in standard JSON form.
     *
     * The object must be in the same style as {@link Domain.SshSession#toJsonObject} produces.
     *
     * @param obj the object in standard JSON form
     * @returns the new instance, or `undefined` if `obj` is `undefined`
     */
    static fromJsonObject(obj) {
        if (!obj) {
            return undefined;
        }
        return new SshSession(obj.created, obj.sessionId, obj.nodeId, obj.host, obj.port, obj.reversePort, obj.startInstructionId, obj.stopInstructionId);
    }
    /**
     * Parse a JSON string into a {@link Domain.SshSession} instance.
     *
     * The JSON must be encoded the same way {@link Domain.SshSession#toJsonEncoding} does.
     *
     * @param json the JSON to parse
     * @returns the new instance, or `undefined` if `json` is `undefined`
     */
    static fromJsonEncoding(json) {
        if (json === undefined) {
            return undefined;
        }
        return this.fromJsonObject(JSON.parse(json));
    }
}
//# sourceMappingURL=sshSession.js.map