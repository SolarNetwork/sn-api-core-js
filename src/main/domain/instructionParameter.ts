/**
 * An instruction parameter.
 */
export default interface InstructionParameter {
	/** The parameter name. */
	name: string;

	/** The parameter value. */
	value: string;
}

/**
 * Common instruction parameter names.
 */
export enum CommonInstructionParameterName {
	/** A deferred execution date, as an ISO 8601 timestamp value. */
	ExecutionDate = "executionDate",
}
