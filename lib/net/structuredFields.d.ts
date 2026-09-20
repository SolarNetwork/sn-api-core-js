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
export declare class SfByteSequence {
    /** The Base64 encoded value. */
    readonly base64: string;
    /**
     * Constructor.
     *
     * @param base64 - the Base64 encoded value
     */
    constructor(base64: string);
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
export declare function serializeString(value: string): string;
/**
 * Serialize an Integer value.
 *
 * @param value - the value to serialize
 * @returns the serialized value
 */
export declare function serializeInteger(value: number): string;
/**
 * Serialize a Boolean value.
 *
 * @param value - the value to serialize
 * @returns the serialized value
 */
export declare function serializeBoolean(value: boolean): string;
/**
 * Serialize a bare item value.
 *
 * @param value - the value to serialize
 * @returns the serialized value
 */
export declare function serializeBareItem(value: SfBareItem): string;
/**
 * Serialize parameters.
 *
 * A Boolean `true` parameter value is serialized as a bare flag, per RFC 9651.
 *
 * @param params - the parameters to serialize, in serialization order
 * @returns the serialized value, which is empty when there are no parameters
 */
export declare function serializeParameters(params?: SfParameters): string;
/**
 * Serialize an item, including any parameters.
 *
 * @param item - the item to serialize
 * @returns the serialized value
 */
export declare function serializeItem(item: SfItem): string;
/**
 * Serialize an Inner List, including any parameters.
 *
 * @param items - the list items
 * @param params - the list parameters, in serialization order
 * @returns the serialized value
 */
export declare function serializeInnerList(items: SfItem[], params?: SfParameters): string;
/**
 * Serialize a single Dictionary member.
 *
 * @param key - the member key
 * @param value - the serialized member value
 * @returns the serialized value
 */
export declare function serializeDictionaryMember(key: string, value: string): string;
//# sourceMappingURL=structuredFields.d.ts.map