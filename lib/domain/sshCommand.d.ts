import SshTerminalSettings from "./sshTerminalSettings.js";
import JsonEncodable from "../util/jsonEncodable.js";
/** The command for attaching to an SSH terminal shell. */
export declare const SolarSshCommandAttachSsh = "attach-ssh";
/**
 * A command with data.
 */
export default class SshCommand implements JsonEncodable {
    #private;
    /**
     * Constructor.
     *
     * @param command the command
     * @param data optional data to associate with the command
     */
    constructor(command: string, data?: any);
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
    static attachSshCommand(authorization: string, authorizationDate: Date | number, username: string, password: string, terminalSettings?: SshTerminalSettings): SshCommand;
    /**
     * Get the command.
     *
     * @returns the command
     */
    get command(): string;
    /**
     * Get the optional data.
     *
     * @returns the data, or `undefined`
     */
    get data(): any | undefined;
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
    toJsonObject(): Record<string, any>;
    /**
     * Get this object as a standard JSON encoded string value.
     *
     * This method calls {@link Domain.SshCommand#toJsonObject} and then
     * turns that into a JSON string.
     *
     * @return the JSON encoded string
     * @see {@link Domain.SshCommand#toJsonObject}
     */
    toJsonEncoding(): string;
    /**
     * Create a new instance from an object in standard JSON form.
     *
     * The object must be in the same style as {@link Domain.SshCommand#toJsonObject} produces.
     *
     * @param obj the object in standard JSON form
     * @param dataDecodeFn an optional function to decode the `obj.data` property with
     * @returns the new instance, or `undefined` if `obj` is `undefined`
     */
    static fromJsonObject(obj: any, dataDecodeFn?: (obj: any) => any): SshCommand | undefined;
    /**
     * Parse a JSON string into a {@link Domain.SshCommand} instance.
     *
     * The JSON must be encoded the same way {@link Domain.SshCommand#toJsonEncoding} does.
     *
     * @param json the JSON to parse
     * @param dataDecodeFn an optional function to decode the `obj.data` property with
     * @returns the new instance, or `undefined` if `json` is `undefined`
     */
    static fromJsonEncoding(json: string | undefined, dataDecodeFn?: (obj: any) => any): SshCommand | undefined;
}
//# sourceMappingURL=sshCommand.d.ts.map