import { dateParser, timestampFormat } from "../util/dates.js";
import InstructionParameter from "./instructionParameter.js";
import {
	InstructionState,
	default as InstructionStates,
	InstructionStateNames,
} from "./instructionState.js";

/**
 * An instruction information object.
 */
export interface InstructionInfo {
	/** A unique identifier. */
	id: number;

	/** The instruction creation date. */
	created: string;

	/** The ID of the node the instruction targets. */
	nodeId: number;

	/** The instruction topic. */
	topic: string;

	/** The instruction action date. */
	instructionDate: string;

	/** The instruction state. */
	state: keyof typeof InstructionStateNames;

	/** The last instruction status change date. */
	statusDate: string;

	/** Parameters for the instruction. */
	parameters?: InstructionParameter[];

	/** Result parameters returned with the instruction status update. */
	resultParameters?: Record<string, any>;
}

/**
 * An instruction object.
 */
export default class Instruction implements InstructionInfo {
	/** A unique identifier. */
	id: number;

	/** The ID of the node the instruction targets. */
	nodeId: number;

	/** The instruction topic. */
	topic: string;

	/** The instruction creation date. */
	created: string;

	/** The instruction action date. */
	date: Date;

	/** The instruction action date. */
	instructionDate: string;

	/** The instruction state. */
	state: keyof typeof InstructionStateNames;

	/** The instruction state. */
	instructionState: InstructionState;

	/** The last instruction status change date. */
	statusDate: string;

	/** The last instruction status date. */
	updateDate: Date;

	/** Parameters for the instruction. */
	parameters?: InstructionParameter[];

	/** Result parameters returned with the instruction status update. */
	resultParameters?: Record<string, any>;

	/**
	 * Construct from an instruction info object.
	 * @param info the info to construct with
	 */
	constructor(info: InstructionInfo) {
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
}

/**
 * Common instruction topic names.
 */
export enum CommonInstructionTopicName {
	/** Cancel a deferred instruction. */
	CancelInstruction = "CancelInstruction",

	/** Execute a datum expression. */
	DatumExpression = "DatumExpression",

	/** Disable an Operational Mode. */
	DisableOperationalModes = "DisableOperationalModes",

	/** Enable an Operational Mode. */
	EnableOperationalModes = "EnableOperationalModes",

	/** Set a logger level. */
	LoggingSetLevel = "LoggingSetLevel",

	/** Renew a node's certificate. */
	RenewCertificate = "RenewCertificate",

	/** Set a control value. */
	SetControlParameter = "SetControlParameter",

	/** Set the operating state of a device. */
	SetOperatingState = "SetOperatingState",

	/**Request a device to reduce its power consumption. */
	ShedLoad = "ShedLoad",

	/** Send a "signal" message to a control or device component. */
	Signal = "Signal",

	/** Start a SolarSSH remote management session. */
	StartRemoteSsh = "StartRemoteSsh",

	/** Stop a SolarSSH remote management session. */
	StopRemoteSsh = "StopRemoteSsh",

	/** Get configuration for a service. */
	SystemConfiguration = "SystemConfiguration",

	/** Reboot the device SolarNode is running on. */
	SystemReboot = "SystemReboot",

	/** Restart the SolarNode service. */
	SystemRestart = "SystemRestart",

	/** Update the Setup-based SolarNode platform. */
	UpdatePlatform = "UpdatePlatform",
}
