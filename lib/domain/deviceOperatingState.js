import BitmaskEnum from "../util/bitmaskEnum.js";
/**
 * An enumeration of supported device operating state names.
 */
var DeviceOperatingStateNames;
(function (DeviceOperatingStateNames) {
    /** Unknown. */
    DeviceOperatingStateNames["Unknown"] = "Unknown";
    /** Normal operating state. */
    DeviceOperatingStateNames["Normal"] = "Normal";
    /** Starting. */
    DeviceOperatingStateNames["Starting"] = "Starting";
    /** Standby. */
    DeviceOperatingStateNames["Standby"] = "Standby";
    /** Shutdown. */
    DeviceOperatingStateNames["Shutdown"] = "Shutdown";
    /** Fault. */
    DeviceOperatingStateNames["Fault"] = "Fault";
    /** Disabled. */
    DeviceOperatingStateNames["Disabled"] = "Disabled";
    /** Recovery. */
    DeviceOperatingStateNames["Recovery"] = "Recovery";
    /** Override. */
    DeviceOperatingStateNames["Override"] = "Override";
})(DeviceOperatingStateNames || (DeviceOperatingStateNames = {}));
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
    constructor(name, bitNumber) {
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
    get code() {
        return this.bitmaskBitNumber;
    }
    /**
     * Get an enum for a code value.
     *
     * @param code - the code to look for
     * @returns the state, or `undefined` if not found
     */
    static forCode(code) {
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
const DeviceOperatingStates = DeviceOperatingState.enumsValue(DeviceOperatingStateValues);
export default DeviceOperatingStates;
export { DeviceOperatingState, DeviceOperatingStateNames, };
//# sourceMappingURL=deviceOperatingState.js.map