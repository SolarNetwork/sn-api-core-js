import BitmaskEnum from "../util/bitmaskEnum.js";
/**
 * An enumeration of supported device operating state names.
 */
declare enum DeviceOperatingStateNames {
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
    Override = "Override"
}
/**
 * An enumeration of standardized device operating states.
 */
declare class DeviceOperatingState extends BitmaskEnum {
    /**
     * Constructor.
     *
     * @param name - the name
     * @param bitNumber - the bit offset, starting from `1` for the least significant bit
     */
    constructor(name: string, bitNumber: number);
    /**
     * Get the state code value.
     *
     * @returns the code
     */
    get code(): number;
    /**
     * Get an enum for a code value.
     *
     * @param code - the code to look for
     * @returns the state, or `undefined` if not found
     */
    static forCode(code: number): BitmaskEnum | undefined;
    /**
     * @inheritdoc
     */
    static enumValues(): readonly DeviceOperatingState[];
}
/**
 * A mapping of device operating state names to associated enum instances.
 */
type DeviceOperatingStateEnumsType = {
    [key in DeviceOperatingStateNames]: DeviceOperatingState;
};
/**
 * The enumeration of supported DeviceOperatingState values.
 * @see {@link Domain.DeviceOperatingStateNames} for the available values
 */
declare const DeviceOperatingStates: DeviceOperatingStateEnumsType;
export default DeviceOperatingStates;
export { DeviceOperatingState, type DeviceOperatingStateEnumsType, DeviceOperatingStateNames, };
//# sourceMappingURL=deviceOperatingState.d.ts.map