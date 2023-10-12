import Enum from "../util/enum.js";
/**
 * An enumeration of supported instruction state names.
 */
declare enum InstructionStateNames {
    /** An unknown state. */
    Unknown = "Unknown",
    /** The instruction has been received by SolarNet but not yet delivered to its destination. */
    Queued = "Queued",
    /**
     * The instruction is in the process of being queued, potentially
     * jumping to the received state if an immediate acknowledgement is
     * possible.
     */
    Queuing = "Queuing",
    /** The instruction has been delivered to its destination but not yet acted upon. */
    Received = "Received",
    /** The instruction is currently being acted upon. */
    Executing = "Executing",
    /** The destination has declined to execute the instruction, or the execution failed. */
    Declined = "Declined",
    /** The destination has executed successfully. */
    Completed = "Completed"
}
/**
 * A named instruction state.
 */
declare class InstructionState extends Enum {
    /**
     * Constructor.
     *
     * @param name - the name
     */
    constructor(name: string);
    /**
     * @override
     * @inheritdoc
     */
    static enumValues(): readonly InstructionState[];
}
/**
 * A mapping of instruction state names to associated enum instances.
 */
type InstructionStateEnumsType = {
    [key in InstructionStateNames]: InstructionState;
};
/**
 * The enumeration of supported `InstructionState` values.
 * @see {@link Domain.InstructionStateNames} for the available values
 */
declare const InstructionStates: InstructionStateEnumsType;
export default InstructionStates;
export { InstructionState, type InstructionStateEnumsType, InstructionStateNames, };
//# sourceMappingURL=instructionState.d.ts.map