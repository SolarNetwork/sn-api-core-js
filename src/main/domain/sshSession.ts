import JsonEncodable from "../util/jsonEncodable.js";

/**
 * A SolarSSH session object.
 */
export default class SshSession implements JsonEncodable {
	readonly created: Date;
	readonly sessionId: string;
	readonly nodeId: number;
	readonly sshHost: string;
	readonly sshPort: number;
	readonly reverseSshPort: number;
	readonly startInstructionId?: number;
	readonly stopInstructionId?: number;

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
	constructor(
		created: Date | number | string,
		sessionId: string,
		nodeId: number,
		sshHost: string,
		sshPort: number,
		reverseSshPort: number,
		startInstructionId?: number,
		stopInstructionId?: number
	) {
		this.created =
			created instanceof Date ? (created as Date) : new Date(created);
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
	toJsonObject(): Record<string, any> {
		const result: Record<string, any> = {};

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
	toJsonEncoding(): string {
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
	static fromJsonObject(obj: any): SshSession | undefined {
		if (!obj) {
			return undefined;
		}
		return new SshSession(
			obj.created,
			obj.sessionId,
			obj.nodeId,
			obj.host,
			obj.port,
			obj.reversePort,
			obj.startInstructionId,
			obj.stopInstructionId
		);
	}

	/**
	 * Parse a JSON string into a {@link Domain.SshSession} instance.
	 *
	 * The JSON must be encoded the same way {@link Domain.SshSession#toJsonEncoding} does.
	 *
	 * @param json the JSON to parse
	 * @returns the new instance, or `undefined` if `json` is `undefined`
	 */
	static fromJsonEncoding(json: string | undefined): SshSession | undefined {
		if (json === undefined) {
			return undefined;
		}
		return this.fromJsonObject(JSON.parse(json));
	}
}
