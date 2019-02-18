import Enum from "../util/enum";

/**
 * A named instruction state.
 *
 * @extends module:util~Enum
 * @alias module:domain~InstructionState
 */
class InstructionState extends Enum {
	/**
	 * Constructor.
	 *
	 * @param {string} name the name
	 */
	constructor(name) {
		super(name);
		if (this.constructor === InstructionState) {
			Object.freeze(this);
		}
	}

	/**
	 * Get the {@link module:domain~InstructionStates} values.
	 *
	 * @inheritdoc
	 */
	static enumValues() {
		return InstructionStateValues;
	}
}

const InstructionStateValues = Object.freeze([
	new InstructionState("Unknown"),
	new InstructionState("Queued"),
	new InstructionState("Received"),
	new InstructionState("Executing"),
	new InstructionState("Declined"),
	new InstructionState("Completed")
]);

/**
 * The enumeration of supported InstructionState values.
 *
 * @readonly
 * @enum {module:domain~InstructionState}
 * @property {module:domain~InstructionState} Unknown an unknown state
 * @property {module:domain~InstructionState} Queued the instruction has been received by SolarNet but not yet delivered to its destination
 * @property {module:domain~InstructionState} Received the instruction has been delivered to its destination but not yet acted upon
 * @property {module:domain~InstructionState} Executed the instruction is currently being acted upon
 * @property {module:domain~InstructionState} Declined the destination has declined to execute the instruction, or the execution failed
 * @property {module:domain~InstructionState} Completed the destination has executed successfully
 * @alias module:domain~InstructionStates
 */
const InstructionStates = InstructionState.enumsValue(InstructionStateValues);

export default InstructionStates;
export { InstructionState };
