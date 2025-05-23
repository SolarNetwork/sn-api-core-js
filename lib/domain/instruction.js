import { dateParser, timestampFormat } from "../util/dates.js";
import { InstructionState, default as InstructionStates, } from "./instructionState.js";
/**
 * An instruction object.
 */
export default class Instruction {
    /** A unique identifier. */
    id;
    /** The ID of the node the instruction targets. */
    nodeId;
    /** The instruction topic. */
    topic;
    /** The instruction creation date. */
    created;
    /** The instruction action date. */
    date;
    /** The instruction action date. */
    instructionDate;
    /** The instruction state. */
    state;
    /** The instruction state. */
    instructionState;
    /** The last instruction status change date. */
    statusDate;
    /** The last instruction status date. */
    updateDate;
    /** Parameters for the instruction. */
    parameters;
    /** Result parameters returned with the instruction status update. */
    resultParameters;
    /**
     * Construct from an instruction info object.
     * @param info the info to construct with
     */
    constructor(info) {
        this.id = info.id;
        this.date = dateParser(info.instructionDate) || new Date();
        this.created = info.created || timestampFormat(this.date);
        this.nodeId = info.nodeId;
        this.topic = info.topic;
        this.instructionDate = info.instructionDate || this.created;
        this.state = info.state;
        this.instructionState =
            InstructionState.valueOf(info.state) || InstructionStates.Unknown;
        this.updateDate = dateParser(info.statusDate) || this.date;
        this.statusDate = info.statusDate || timestampFormat(this.date);
        this.parameters = info.parameters;
        this.resultParameters = info.resultParameters;
    }
    /**
     * Create an instruction parameter instance.
     *
     * @param name the parameter name
     * @param value the parameter value
     * @returns the parameter object
     */
    static parameter(name, value) {
        return { name: name, value: String(value) };
    }
}
/**
 * Common instruction topic names.
 */
export var CommonInstructionTopicName;
(function (CommonInstructionTopicName) {
    /** Cancel a deferred instruction. */
    CommonInstructionTopicName["CancelInstruction"] = "CancelInstruction";
    /** Execute a datum expression. */
    CommonInstructionTopicName["DatumExpression"] = "DatumExpression";
    /** Disable an Operational Mode. */
    CommonInstructionTopicName["DisableOperationalModes"] = "DisableOperationalModes";
    /** Enable an Operational Mode. */
    CommonInstructionTopicName["EnableOperationalModes"] = "EnableOperationalModes";
    /** Set a logger level. */
    CommonInstructionTopicName["LoggingSetLevel"] = "LoggingSetLevel";
    /** Renew a node's certificate. */
    CommonInstructionTopicName["RenewCertificate"] = "RenewCertificate";
    /** Set a control value. */
    CommonInstructionTopicName["SetControlParameter"] = "SetControlParameter";
    /** Set the operating state of a device. */
    CommonInstructionTopicName["SetOperatingState"] = "SetOperatingState";
    /**Request a device to reduce its power consumption. */
    CommonInstructionTopicName["ShedLoad"] = "ShedLoad";
    /** Send a "signal" message to a control or device component. */
    CommonInstructionTopicName["Signal"] = "Signal";
    /** Start a SolarSSH remote management session. */
    CommonInstructionTopicName["StartRemoteSsh"] = "StartRemoteSsh";
    /** Stop a SolarSSH remote management session. */
    CommonInstructionTopicName["StopRemoteSsh"] = "StopRemoteSsh";
    /** Get configuration for a service. */
    CommonInstructionTopicName["SystemConfiguration"] = "SystemConfiguration";
    /** Reboot the device SolarNode is running on. */
    CommonInstructionTopicName["SystemReboot"] = "SystemReboot";
    /** Restart the SolarNode service. */
    CommonInstructionTopicName["SystemRestart"] = "SystemRestart";
    /** Update the Setup-based SolarNode platform. */
    CommonInstructionTopicName["UpdatePlatform"] = "UpdatePlatform";
})(CommonInstructionTopicName || (CommonInstructionTopicName = {}));
//# sourceMappingURL=instruction.js.map