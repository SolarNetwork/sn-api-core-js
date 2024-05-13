/**
 * The basic Datum type.
 */
export interface DatumInfo {
    /** The datum creation/capture date. */
    created: string;
    /** The node's local date for the created time. */
    localDate: string;
    /** The node's local time for the created time. */
    localTime: string;
    /** The node ID. */
    nodeId: number;
    /** The source ID. */
    sourceId: string;
    /** Optional tags. */
    tags?: string[];
    /** The sample properties. */
    [index: string]: any;
}
/**
 * A basic Datum class.
 */
export default class Datum implements DatumInfo, Record<string, any> {
    /** The datum creation/capture date. */
    readonly created: string;
    /** The node's local date for the created time. */
    readonly localDate: string;
    /** The node's local time for the created time. */
    readonly localTime: string;
    /** The datum creation/capture date. */
    readonly date: Date;
    /** The node ID. */
    readonly nodeId: number;
    /** The source ID. */
    readonly sourceId: string;
    /** Optional tags. */
    tags?: string[];
    /** The sample properties. */
    [index: string]: any;
    constructor(info: DatumInfo);
}
//# sourceMappingURL=datum.d.ts.map