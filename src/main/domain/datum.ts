import { dateParser, timestampFormat } from "../util/dates.js";

/**
 * The basic Datum type.
 */
export interface DatumInfo {
	/** The datum creation/capture date. */
	created: string;

	/** The node ID. */
	nodeId: number;

	/** The source ID. */
	sourceId: string;

	/** The sample properties. */
	[index: string]: any;
}

/**
 * A basic Datum class.
 */
export default class Datum implements Record<string, any> {
	/** The datum creation/capture date. */
	readonly created: string;

	/** The datum creation/capture date. */
	readonly date: Date;

	/** The node ID. */
	readonly nodeId: number;

	/** The source ID. */
	readonly sourceId: string;

	/** The sample properties. */
	[index: string]: any;

	constructor(info: DatumInfo) {
		Object.assign(this, info);
		this.date = dateParser(info.created) || new Date();
		this.created = info.created || timestampFormat(this.date);
		this.nodeId = info.nodeId;
		this.sourceId = info.sourceId;
	}
}
