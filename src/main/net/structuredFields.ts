/**
 * Serialization support for HTTP Structured Field Values, as defined in RFC 9651.
 *
 * Only serialization is provided, which is all an RFC 9421 signer needs: a client
 * creates its own field values and never parses one it did not write. If parsing is
 * needed later, for example to verify a signed response, reach for a full
 * implementation rather than extending this.
 *
 * @module
 */

/**
 * A structured field Byte Sequence value.
 */
export class SfByteSequence {
	/** The Base64 encoded value. */
	readonly base64: string;

	/**
	 * Constructor.
	 *
	 * @param base64 - the Base64 encoded value
	 */
	constructor(base64: string) {
		this.base64 = base64;
	}
}

/** A bare structured field item value. */
export type SfBareItem = string | number | boolean | SfByteSequence;

/** Structured field parameters, in serialization order. */
export type SfParameters = Map<string, SfBareItem>;

/** A structured field item, with optional parameters. */
export interface SfItem {
	/** The bare item value. */
	value: SfBareItem;

	/** The parameters, in serialization order. */
	params?: SfParameters;
}

/**
 * Serialize a String value.
 *
 * @param value - the value to serialize
 * @returns the serialized value
 */
export function serializeString(value: string): string {
	let result = '"';
	for (const c of value) {
		if (c === "\\" || c === '"') {
			result += "\\";
		}
		result += c;
	}
	return result + '"';
}

/**
 * Serialize an Integer value.
 *
 * @param value - the value to serialize
 * @returns the serialized value
 */
export function serializeInteger(value: number): string {
	return String(Math.trunc(value));
}

/**
 * Serialize a Boolean value.
 *
 * @param value - the value to serialize
 * @returns the serialized value
 */
export function serializeBoolean(value: boolean): string {
	return value ? "?1" : "?0";
}

/**
 * Serialize a bare item value.
 *
 * @param value - the value to serialize
 * @returns the serialized value
 */
export function serializeBareItem(value: SfBareItem): string {
	if (typeof value === "string") {
		return serializeString(value);
	}
	if (typeof value === "number") {
		return serializeInteger(value);
	}
	if (typeof value === "boolean") {
		return serializeBoolean(value);
	}
	return ":" + value.base64 + ":";
}

/**
 * Serialize parameters.
 *
 * A Boolean `true` parameter value is serialized as a bare flag, per RFC 9651.
 *
 * @param params - the parameters to serialize, in serialization order
 * @returns the serialized value, which is empty when there are no parameters
 */
export function serializeParameters(params?: SfParameters): string {
	if (!params || params.size < 1) {
		return "";
	}
	let result = "";
	for (const [key, value] of params) {
		result += ";" + key;
		if (value !== true) {
			result += "=" + serializeBareItem(value);
		}
	}
	return result;
}

/**
 * Serialize an item, including any parameters.
 *
 * @param item - the item to serialize
 * @returns the serialized value
 */
export function serializeItem(item: SfItem): string {
	return serializeBareItem(item.value) + serializeParameters(item.params);
}

/**
 * Serialize an Inner List, including any parameters.
 *
 * @param items - the list items
 * @param params - the list parameters, in serialization order
 * @returns the serialized value
 */
export function serializeInnerList(
	items: SfItem[],
	params?: SfParameters
): string {
	return (
		"(" +
		items.map(serializeItem).join(" ") +
		")" +
		serializeParameters(params)
	);
}

/**
 * Serialize a single Dictionary member.
 *
 * @param key - the member key
 * @param value - the serialized member value
 * @returns the serialized value
 */
export function serializeDictionaryMember(key: string, value: string): string {
	return key + "=" + value;
}
