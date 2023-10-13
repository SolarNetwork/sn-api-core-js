import BitmaskEnum from "../util/bitmaskEnum.js";

/**
 * An enumeration of supported device operating state names.
 */
enum DeviceOperatingStateNames {
	/** Unknown. */
	Unknown = "Unknown",

	/** Normal operating state. */
	Normal = "Normal",

	/** Starting. */
	Starting = "Starting",

	/** Standby. */
	Standby = "Standby",

	/** Shutdown. */
	Shutdown = "Shutdown",

	/** Fault. */
	Fault = "Fault",

	/** Disabled. */
	Disabled = "Disabled",

	/** Recovery. */
	Recovery = "Recovery",

	/** Override. */
	Override = "Override",
}

/**
 * An enumeration of standardized device operating states.
 */
class DeviceOperatingState extends BitmaskEnum {
	/**
	 * Constructor.
	 *
	 * @param name - the name
	 * @param bitNumber - the bit offset, starting from `1` for the least significant bit
	 */
	constructor(name: string, bitNumber: number) {
		super(name, bitNumber);
		if (this.constructor === DeviceOperatingState) {
			Object.freeze(this);
		}
	}

	/**
	 * Get the state code value.
	 *
	 * @returns the code
	 */
	get code(): number {
		return this.bitmaskBitNumber;
	}

	/**
	 * Get an enum for a code value.
	 *
	 * @param code - the code to look for
	 * @returns the state, or `undefined` if not found
	 */
	static forCode(code: number): BitmaskEnum | undefined {
		return BitmaskEnum.enumForBitNumber(code, DeviceOperatingStateValues);
	}

	/**
	 * @inheritdoc
	 */
	static enumValues() {
		return DeviceOperatingStateValues;
	}
}

/**
 * A mapping of device operating state names to associated enum instances.
 */
type DeviceOperatingStateEnumsType = {
	[key in DeviceOperatingStateNames]: DeviceOperatingState;
};

/**
 * The device operating state enum values array.
 */
const DeviceOperatingStateValues = Object.freeze([
	new DeviceOperatingState(DeviceOperatingStateNames.Unknown, 0),
	new DeviceOperatingState(DeviceOperatingStateNames.Normal, 1),
	new DeviceOperatingState(DeviceOperatingStateNames.Starting, 2),
	new DeviceOperatingState(DeviceOperatingStateNames.Standby, 3),
	new DeviceOperatingState(DeviceOperatingStateNames.Shutdown, 4),
	new DeviceOperatingState(DeviceOperatingStateNames.Fault, 5),
	new DeviceOperatingState(DeviceOperatingStateNames.Disabled, 6),
	new DeviceOperatingState(DeviceOperatingStateNames.Recovery, 7),
	new DeviceOperatingState(DeviceOperatingStateNames.Override, 8),
]);

/**
 * The enumeration of supported DeviceOperatingState values.
 * @see {@link Domain.DeviceOperatingStateNames} for the available values
 */
const DeviceOperatingStates = DeviceOperatingState.enumsValue(
	DeviceOperatingStateValues
) as DeviceOperatingStateEnumsType;

export default DeviceOperatingStates;
export {
	DeviceOperatingState,
	type DeviceOperatingStateEnumsType,
	DeviceOperatingStateNames,
};
