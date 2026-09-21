/**
 * Minimal serialization support for HTTP Structured Field Values, as defined in RFC 9651.
 *
 * Only serialization is provided, to support the RFC 9421 signing needed by this package.
 *
 * @module
 */
/**
 * A structured field Byte Sequence value.
 */
export class SfByteSequence {
    /** The Base64 encoded value. */
    base64;
    /**
     * Constructor.
     *
     * @param base64 - the Base64 encoded value
     */
    constructor(base64) {
        this.base64 = base64;
    }
}
/**
 * Serialize a String value.
 *
 * @param value - the value to serialize
 * @returns the serialized value
 */
export function serializeString(value) {
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
export function serializeInteger(value) {
    return String(Math.trunc(value));
}
/**
 * Serialize a Boolean value.
 *
 * @param value - the value to serialize
 * @returns the serialized value
 */
export function serializeBoolean(value) {
    return value ? "?1" : "?0";
}
/**
 * Serialize a bare item value.
 *
 * @param value - the value to serialize
 * @returns the serialized value
 */
export function serializeBareItem(value) {
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
export function serializeParameters(params) {
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
export function serializeItem(item) {
    return serializeBareItem(item.value) + serializeParameters(item.params);
}
/**
 * Serialize an Inner List, including any parameters.
 *
 * @param items - the list items
 * @param params - the list parameters, in serialization order
 * @returns the serialized value
 */
export function serializeInnerList(items, params) {
    return ("(" +
        items.map(serializeItem).join(" ") +
        ")" +
        serializeParameters(params));
}
/**
 * Serialize a single Dictionary member.
 *
 * @param key - the member key
 * @param value - the serialized member value
 * @returns the serialized value
 */
export function serializeDictionaryMember(key, value) {
    return key + "=" + value;
}
//# sourceMappingURL=structuredFields.js.map