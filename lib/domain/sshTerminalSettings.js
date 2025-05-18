import { stringMapToObject, objectToStringMap } from "../util/objects.js";
/**
 * Settings for a SSH terminal.
 */
export default class SshTerminalSettings {
    cols;
    lines;
    width;
    height;
    type;
    environment;
    /**
     * Constructor.
     *
     * @param cols the characters width
     * @param lines the number of lines
     * @param width the pixel width
     * @param height the pixel height
     * @param type the terminal type
     * @param environment environment properties to pass to the shell
     */
    constructor(cols = 80, lines = 24, width = 640, height = 480, type = "xterm", environment) {
        this.cols = cols;
        this.lines = lines;
        this.width = width;
        this.height = height;
        this.type = type;
        this.environment =
            environment instanceof Map
                ? environment
                : objectToStringMap(environment);
    }
    /**
     * Get this object in standard JSON form.
     *
     * An example result looks like this:
     *
     * ```json
     * {
     *   "cols": 80,
     *   "lines": 24,
     *   "width": 640,
     *   "height": 480,
     *   "type": "xterm"
     * }
     * ```
     *
     * @return an object, ready for JSON encoding
     */
    toJsonObject() {
        const result = {
            cols: this.cols,
            lines: this.lines,
            width: this.width,
            height: this.height,
            type: this.type,
        };
        if (this.environment && this.environment.size > 0) {
            result.environment = stringMapToObject(this.environment);
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
    toJsonEncoding() {
        return JSON.stringify(this.toJsonObject());
    }
    /**
     * Create a new instance from an object in standard JSON form.
     *
     * The object must be in the same style as {@link Domain.SshTerminalSettings#toJsonObject} produces.
     *
     * @param obj the object in standard JSON form
     * @returns the new instance, or `undefined` if `obj` is `undefined`
     */
    static fromJsonObject(obj) {
        if (!obj) {
            return undefined;
        }
        return new SshTerminalSettings(obj.cols, obj.lines, obj.width, obj.height, obj.type, obj.environment);
    }
    /**
     * Parse a JSON string into a {@link Domain.SshTerminalSettings} instance.
     *
     * The JSON must be encoded the same way {@link Domain.SshTerminalSettings#toJsonEncoding} does.
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
//# sourceMappingURL=sshTerminalSettings.js.map