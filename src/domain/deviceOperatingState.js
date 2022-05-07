import BitmaskEnum from "../util/bitmaskEnum";

/**
 * An enumeration of standardized device operating states.
 *
 * @extends module:util~Enum
 * @alias module:domain~DeviceOperatingState
 */
class DeviceOperatingState extends BitmaskEnum {
	/**
	 * Constructor.
	 *
	 * @param {string} name the name
	 * @param {number} bitNumber the bit offset, starting from `1` for the least significant bit
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
	 * @returns {number} the code
	 */
	get code() {
		return this.bitmaskBitNumber;
	}

	/**
	 * Get an enum for a code value.
	 *
	 * @param {number} code the code to look for
	 * @returns {DeviceOperatingState} the state, or `null` if not found
	 */
	static forCode(code) {
		return BitmaskEnum.enumForBitNumber(code, DeviceOperatingStateValues);
	}

	/**
	 * Get the {@link module:domain~DeviceOperatingStates} values.
	 *
	 * @inheritdoc
	 */
	static enumValues() {
		return DeviceOperatingStateValues;
	}
}

const DeviceOperatingStateValues = Object.freeze([
	new DeviceOperatingState("Unknown", 0),
	new DeviceOperatingState("Normal", 1),
	new DeviceOperatingState("Starting", 2),
	new DeviceOperatingState("Standby", 3),
	new DeviceOperatingState("Shutdown", 4),
	new DeviceOperatingState("Fault", 5),
	new DeviceOperatingState("Disabled", 6),
	new DeviceOperatingState("Recovery", 7),
	new DeviceOperatingState("Override", 8),
]);

/**
 * The enumeration of supported DeviceOperatingState values.
 *
 * @readonly
 * @enum {module:domain~DeviceOperatingState}
 * @property {module:domain~DeviceOperatingState} Unknown an unknown state
 * @property {module:domain~DeviceOperatingState} Normal normal operating state
 * @property {module:domain~DeviceOperatingState} Starting a startup/initializing state
 * @property {module:domain~DeviceOperatingState} Standby a standby/low power mode
 * @property {module:domain~DeviceOperatingState} Shutdown a shutdown/off state
 * @property {module:domain~DeviceOperatingState} Fault a faulty or error condition
 * @property {module:domain~DeviceOperatingState} Disabled a disabled state
 * @property {module:domain~DeviceOperatingState} Recovery a recovery state
 * @property {module:domain~DeviceOperatingState} Override a manual or overridden state
 * @alias module:domain~DeviceOperatingStates
 */
const DeviceOperatingStates = DeviceOperatingState.enumsValue(DeviceOperatingStateValues);

export default DeviceOperatingStates;
export { DeviceOperatingState };
