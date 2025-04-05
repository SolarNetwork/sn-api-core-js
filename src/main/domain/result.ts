import { DatumStreamMetadataInfo } from "./datumStreamMetadata.js";

/**
 * Details on a request error, such as a validation failure message.
 */
export interface ErrorDetail {
	/** The source of the error, such as a form field name. */
	location: string;

	/** An error condition identifier. */
	code?: string;

	/** The value that was the cause of the error. */
	rejectedValue?: string;

	/** An error message. */
	message: string;
}

/**
 * A request result wrapper object.
 *
 * @typeParam T the result data type
 */
export interface Result<T> {
	/** Flag indicating if the request was successfully processed. */
	success: boolean;

	/** A code, such as an error condition identifier. */
	code?: string;

	/** A message, such as an error message. */
	message?: string;

	/** Optional datum stream metadata. */
	meta?: DatumStreamMetadataInfo[];

	/** Error details, such as input validation failures. */
	errors?: ErrorDetail[];

	/** Result data. */
	data?: T;
}

/**
 * A filtered result object.
 */
export interface FilterResults<T> {
	/** The total available result count. */
	totalResults?: number;

	/** The starting offset within the total available results. */
	startingOffset: number;

	/** The number of results returned in `results`. */
	returnedResultCount: number;

	/** The result data. */
	results: T[];
}
