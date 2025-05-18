import ComparableEnum from "../util/comparableEnum.js";

/**
 * An enumeration of supported aggregation names.
 */
enum SshCloseCodeNames {
	/** Authentication failure. */
	AuthenticationFailure = "AuthenticationFailure",
}

/**
 * A named socket close code.
 */
class SshCloseCode extends ComparableEnum {
	/**
	 * Constructor.
	 *
	 * @param name the name
	 * @param value a value
	 */
	constructor(name: string, value: number) {
		super(name, value);
		if (this.constructor === SshCloseCode) {
			Object.freeze(this);
		}
	}

	/**
	 * @override
	 * @inheritdoc
	 */
	static enumValues() {
		return SshCloseCodeValues;
	}
}

/**
 * A mapping of aggregation names to associated enum instances.
 */
type SshCloseCodeEnumsType = { [key in SshCloseCodeNames]: SshCloseCode };

/**
 * The aggregation enum values array.
 */
const SshCloseCodeValues = Object.freeze([
	new SshCloseCode(SshCloseCodeNames.AuthenticationFailure, 4000),
]);

/**
 * The enumeration of supported `SshCloseCode` values.
 * @see {@link Domain.SshCloseCodeNames} for the available values
 */
const SshCloseCodes = SshCloseCode.enumsValue(
	SshCloseCodeValues
) as SshCloseCodeEnumsType;

export default SshCloseCodes;
export { SshCloseCode, type SshCloseCodeEnumsType, SshCloseCodeNames };
