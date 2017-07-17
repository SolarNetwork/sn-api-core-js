import Enum from 'enum';

/**
 * A named instruction state.
 */
export class InstructionState extends Enum {

    /**
     * Constructor.
     * 
     * @param {string} name the name
     */
    constructor(name) {
        super(name);
        if ( this.constructor === InstructionState ) {
            Object.freeze(this);
        }
    }

    /**
	 * Get the {@link InstructionStates} values.
	 * 
	 * @inheritdoc
	 */
	static enumValues() {
		return InstructionStateValues;
	}

}

const InstructionStateValues = Object.freeze([
	new InstructionState('Unknown'),
	new InstructionState('Queued'),
    new InstructionState('Received'),
    new InstructionState('Executing'),
    new InstructionState('Declined'),
    new InstructionState('Completed'),
]);

/**
 * The enumeration of supported InstructionState values.
 * 
 * @readonly
 * @enum {InstructionState}
 * @property {InstructionState} Unknown an unknown state
 * @property {InstructionState} Queued the instruction has been received by SolarNet but not yet delivered to its destination
 * @property {InstructionState} Received the instruction has been delivered to its destination but not yet acted upon
 * @property {InstructionState} Executed the instruction is currently being acted upon
 * @property {InstructionState} Declined the destination has declined to execute the instruction, or the execution failed
 * @property {InstructionState} Completed the destination has executed successfully
 */
const InstructionStates = InstructionState.enumsValue(InstructionStateValues);

export default InstructionStates;
