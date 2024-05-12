import { dateParser, timestampFormat } from "../util/dates.js";
/**
 * A basic Datum class.
 */
export default class Datum {
    /** The datum creation/capture date. */
    created;
    /** The datum creation/capture date. */
    date;
    /** The node ID. */
    nodeId;
    /** The source ID. */
    sourceId;
    constructor(info) {
        Object.assign(this, info);
        this.date = dateParser(info.created) || new Date();
        this.created = info.created || timestampFormat(this.date);
        this.nodeId = info.nodeId;
        this.sourceId = info.sourceId;
    }
}
//# sourceMappingURL=datum.js.map