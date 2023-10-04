import PropMap from "../util/propMap.js";

export const TagsKey = "tags";
export const UserIdsKey = "userIds";

/**
 * A filter criteria object for user metadata.
 *
 * <p>This filter is used to query user metadata.</p>
 *
 * @extends module:util~PropMap
 * @alias module:domain~UserMetadataFilter
 */
class UserMetadataFilter extends PropMap {
	/**
	 * Constructor.
	 * @param {object} [props] initial property values
	 */
	constructor(props) {
		super(props);
	}

	/**
	 * A user ID.
	 *
	 * This manages the first available location ID from the `userIds` property.
	 *
	 * @type {number}
	 */
	get userId() {
		const userIds = this.userIds;
		return Array.isArray(userIds) && userIds.length > 0 ? userIds[0] : null;
	}

	set userId(userId) {
		if (userId) {
			this.userIds = [userId];
		} else {
			this.userIds = null;
		}
	}

	/**
	 * An array of user IDs.
	 * @type {number[]}
	 */
	get userIds() {
		return this.prop(UserIdsKey);
	}

	set userIds(userIds) {
		this.prop(UserIdsKey, Array.isArray(userIds) ? userIds : null);
	}

	/**
	 * An array of tags.
	 * @type {string[]}
	 */
	get tags() {
		return this.prop(TagsKey);
	}

	set tags(val) {
		this.prop(TagsKey, Array.isArray(val) ? val : null);
	}

	/**
	 * Get this object as a standard URI encoded (query parameters) string value.
	 *
	 * @override
	 * @inheritdoc
	 */
	toUriEncoding(propertyName, callbackFn) {
		return super.toUriEncoding(
			propertyName,
			callbackFn || userMetadataFilterUriEncodingPropertyMapper,
		);
	}
}

/**
 * Map UserMetadataFilter properties for URI encoding.
 *
 * @param {string} key the property key
 * @param {*} value the property value
 * @returns {*} 2-element array for mapped key+value, `null` to skip, or `key` to keep as-is
 * @private
 */
function userMetadataFilterUriEncodingPropertyMapper(key, value) {
	if (key === UserIdsKey) {
		// check for singleton array value, and re-map to singular property by chopping of "s"
		if (Array.isArray(value) && value.length === 1) {
			return [key.substring(0, key.length - 1), value[0]];
		}
	}
	return key;
}

export default UserMetadataFilter;
