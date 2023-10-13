import {
	default as PropMap,
	PropMapUriEncodingCallbackFn,
} from "../util/propMap.js";

/** An enumeration of user metadata filter keys. */
enum UserMetadataFilterKeys {
	Tags = "tags",
	UserId = "userId",
	UserIds = "userIds",
}

/**
 * A filter criteria object for user metadata.
 *
 * This filter is used to query user metadata.
 */
class UserMetadataFilter extends PropMap {
	/**
	 * Constructor.
	 * @param props - initial property values
	 */
	constructor(props?: PropMap | object) {
		super(props);
	}

	/**
	 * A user ID.
	 *
	 * This manages the first available location ID from the `userIds` property.
	 */
	get userId(): number | undefined {
		const userIds = this.userIds;
		return Array.isArray(userIds) && userIds.length > 0
			? userIds[0]
			: undefined;
	}

	set userId(userId: number | null) {
		if (userId) {
			this.userIds = [userId];
		} else {
			this.userIds = null;
		}
	}

	/**
	 * An array of user IDs.
	 */
	get userIds(): number[] | undefined {
		return this.prop(UserMetadataFilterKeys.UserIds);
	}

	set userIds(userIds: number[] | null) {
		this.prop(
			UserMetadataFilterKeys.UserIds,
			Array.isArray(userIds) ? userIds : null
		);
	}

	/**
	 * An array of tags.
	 */
	get tags(): string[] | undefined {
		return this.prop(UserMetadataFilterKeys.Tags);
	}

	set tags(val: string[] | null) {
		this.prop(UserMetadataFilterKeys.Tags, Array.isArray(val) ? val : null);
	}

	/**
	 * @override
	 * @inheritdoc
	 */
	toUriEncoding(
		propertyName?: string,
		callbackFn?: PropMapUriEncodingCallbackFn
	) {
		return super.toUriEncoding(
			propertyName,
			callbackFn || userMetadataFilterUriEncodingPropertyMapper
		);
	}
}

/**
 * Map UserMetadataFilter properties for URI encoding.
 *
 * @param key - the property key
 * @param value - the property value
 * @returns 2 or 3-element array for mapped key+value+forced-multi-key, `null` to skip, or `key` to keep as-is
 * @private
 */
function userMetadataFilterUriEncodingPropertyMapper(
	key: string,
	value: any
): [string, any] | [string, any, boolean] | any | undefined {
	if (key === UserMetadataFilterKeys.UserIds) {
		// check for singleton array value, and re-map to singular property by chopping of "s"
		if (Array.isArray(value) && value.length === 1) {
			return [key.substring(0, key.length - 1), value[0]];
		}
	}
	return key;
}

export default UserMetadataFilter;
export { UserMetadataFilterKeys };
