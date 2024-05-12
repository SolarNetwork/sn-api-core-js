import { dateParser, timestampFormat } from "../util/dates.js";
/**
 * A basic Datum class.
 */
export default class Datum {
    /** The datum creation/capture date. */
    created;
    /** The node's local date for the created time. */
    localDate;
    /** The node's local time for the created time. */
    localTime;
    /** The datum creation/capture date. */
    date;
    /** The node ID. */
    nodeId;
    /** The source ID. */
    sourceId;
    /** Optional tags. */
    tags;
    constructor(info) {
        Object.assign(this, info);
        this.date = dateParser(info.created) || new Date();
        this.created = info.created || timestampFormat(this.date);
        this.localDate = info.localDate;
        this.localTime = info.localTime;
        this.nodeId = info.nodeId;
        this.sourceId = info.sourceId;
        this.tags = info.tags;
    }
}
//# sourceMappingURL=datum.js.map