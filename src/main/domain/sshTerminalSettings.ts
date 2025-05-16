import JsonEncodable from "../util/jsonEncodable.js";
import { stringMapToObject, objectToStringMap } from "../util/objects.js";

/**
 * Settings for a SSH terminal.
 */
export default class SshTerminalSettings implements JsonEncodable {
	cols: number;
	lines: number;
	width: number;
	height: number;
	type: string;
	environment: Map<string, string>;

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
	constructor(
		cols: number = 80,
		lines: number = 24,
		width: number = 640,
		height: number = 480,
		type: string = "xterm",
		environment?: Map<string, string> | any
	) {
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
	toJsonObject(): Record<string, any> {
		const result: Record<string, any> = {
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
	toJsonEncoding(): string {
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
	static fromJsonObject(obj: any): SshTerminalSettings | undefined {
		if (!obj) {
			return undefined;
		}
		return new SshTerminalSettings(
			obj.cols,
			obj.lines,
			obj.width,
			obj.height,
			obj.type,
			obj.environment
		);
	}

	/**
	 * Parse a JSON string into a {@link Domain.SshTerminalSettings} instance.
	 *
	 * The JSON must be encoded the same way {@link Domain.SshTerminalSettings#toJsonEncoding} does.
	 *
	 * @param json the JSON to parse
	 * @returns the new instance, or `undefined` if `json` is `undefined`
	 */
	static fromJsonEncoding(
		json: string | undefined
	): SshTerminalSettings | undefined {
		if (json === undefined) {
			return undefined;
		}
		return this.fromJsonObject(JSON.parse(json));
	}
}
