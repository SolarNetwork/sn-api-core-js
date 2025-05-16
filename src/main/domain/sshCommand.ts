import SshTerminalSettings from "./sshTerminalSettings.js";
import JsonEncodable from "../util/jsonEncodable.js";

/** The command for attaching to an SSH terminal shell. */
export const SolarSshCommandAttachSsh = "attach-ssh";

/**
 * A command with data.
 */
export default class SshCommand implements JsonEncodable {
	readonly #command: string;
	readonly #data?: any;

	/**
	 * Constructor.
	 *
	 * @param command the command
	 * @param data optional data to associate with the command
	 */
	constructor(command: string, data?: any) {
		this.#command = command;
		this.#data = data;
		if (this.constructor === SshCommand) {
			Object.freeze(this);
		}
	}

	/**
	 * Create a new `attach-ssh` command instance
	 *
	 * @param authorization a pre-computed SNWS2 authorization header, which must match
	 *        exactly a `GET` request to the `/solaruser/api/v1/sec/nodes/meta/:nodeId`
	 *        path using the provided authorization date and, node ID.
	 * @param authorizationDate the date used in the `authorization` value
	 * @param username the SSH username to use
	 * @param password the SSH password to use
	 * @param terminalSettings optional terminal settings to use
	 */
	static attachSshCommand(
		authorization: string,
		authorizationDate: Date | number,
		username: string,
		password: string,
		terminalSettings?: SshTerminalSettings
	) {
		const data = {} as Record<string, any>;
		data["authorization"] = authorization;
		data["authorization-date"] =
			authorizationDate instanceof Date
				? authorizationDate.getTime()
				: authorizationDate;
		data["username"] = username;
		data["password"] = password;
		if (terminalSettings instanceof SshTerminalSettings) {
			const termOpts = terminalSettings.toJsonObject();
			for (const prop of Object.keys(termOpts)) {
				if (data[prop] === undefined) {
					data[prop] = termOpts[prop];
				}
			}
		}
		return new SshCommand(SolarSshCommandAttachSsh, data);
	}

	/**
	 * Get the command.
	 *
	 * @returns the command
	 */
	get command(): string {
		return this.#command;
	}

	/**
	 * Get the optional data.
	 *
	 * @returns the data, or `undefined`
	 */
	get data(): any | undefined {
		return this.#data;
	}

	/**
	 * Get this object in standard JSON form.
	 *
	 * An example result looks like this:
	 *
	 * ```json
	 * {
	 *   "cmd": "attach-ssh",
	 *   "data": {"foo": "bar"}
	 * }
	 * ```
	 *
	 * If the `data` value has a `toJsonObject()` function, that will be invoked
	 * and used in the result. Otherwise the `data` value will be included as-is.
	 *
	 * @return an object, ready for JSON encoding
	 */
	toJsonObject(): Record<string, any> {
		const result: Record<string, any> = {
			cmd: this.#command,
		};

		if (this.#data) {
			if (typeof this.#data.toJsonObject === "function") {
				result.data = this.#data.toJsonObject();
			} else {
				result.data = this.#data;
			}
		}

		return result;
	}

	/**
	 * Get this object as a standard JSON encoded string value.
	 *
	 * This method calls {@link Domain.SshCommand#toJsonObject} and then
	 * turns that into a JSON string.
	 *
	 * @return the JSON encoded string
	 * @see {@link Domain.SshCommand#toJsonObject}
	 */
	toJsonEncoding(): string {
		return JSON.stringify(this.toJsonObject());
	}

	/**
	 * Create a new instance from an object in standard JSON form.
	 *
	 * The object must be in the same style as {@link Domain.SshCommand#toJsonObject} produces.
	 *
	 * @param obj the object in standard JSON form
	 * @param dataDecodeFn an optional function to decode the `obj.data` property with
	 * @returns the new instance, or `undefined` if `obj` is `undefined`
	 */
	static fromJsonObject(
		obj: any,
		dataDecodeFn?: (obj: any) => any
	): SshCommand | undefined {
		if (!(obj && obj.cmd)) {
			return undefined;
		}
		const cmd = obj.cmd;
		const data = obj.data;
		return new SshCommand(cmd, dataDecodeFn ? dataDecodeFn(data) : data);
	}

	/**
	 * Parse a JSON string into a {@link Domain.SshCommand} instance.
	 *
	 * The JSON must be encoded the same way {@link Domain.SshCommand#toJsonEncoding} does.
	 *
	 * @param json the JSON to parse
	 * @param dataDecodeFn an optional function to decode the `obj.data` property with
	 * @returns the new instance, or `undefined` if `json` is `undefined`
	 */
	static fromJsonEncoding(
		json: string | undefined,
		dataDecodeFn?: (obj: any) => any
	): SshCommand | undefined {
		if (json === undefined) {
			return undefined;
		}
		return this.fromJsonObject(JSON.parse(json), dataDecodeFn);
	}
}
