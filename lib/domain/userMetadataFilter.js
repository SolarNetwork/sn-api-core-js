import { default as PropMap, } from "../util/propMap.js";
/** An enumeration of user metadata filter keys. */
var UserMetadataFilterKeys;
(function (UserMetadataFilterKeys) {
    UserMetadataFilterKeys["Tags"] = "tags";
    UserMetadataFilterKeys["UserId"] = "userId";
    UserMetadataFilterKeys["UserIds"] = "userIds";
})(UserMetadataFilterKeys || (UserMetadataFilterKeys = {}));
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
    constructor(props) {
        super(props);
    }
    /**
     * A user ID.
     *
     * This manages the first available location ID from the `userIds` property.
     */
    get userId() {
        const userIds = this.userIds;
        return Array.isArray(userIds) && userIds.length > 0
            ? userIds[0]
            : undefined;
    }
    set userId(userId) {
        if (userId) {
            this.userIds = [userId];
        }
        else {
            this.userIds = null;
        }
    }
    /**
     * An array of user IDs.
     */
    get userIds() {
        return this.prop(UserMetadataFilterKeys.UserIds);
    }
    set userIds(userIds) {
        this.prop(UserMetadataFilterKeys.UserIds, Array.isArray(userIds) ? userIds : null);
    }
    /**
     * An array of tags.
     */
    get tags() {
        return this.prop(UserMetadataFilterKeys.Tags);
    }
    set tags(val) {
        this.prop(UserMetadataFilterKeys.Tags, Array.isArray(val) ? val : null);
    }
    /**
     * @override
     * @inheritdoc
     */
    toUriEncoding(propertyName, callbackFn) {
        return super.toUriEncoding(propertyName, callbackFn || userMetadataFilterUriEncodingPropertyMapper);
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
function userMetadataFilterUriEncodingPropertyMapper(key, value) {
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
//# sourceMappingURL=userMetadataFilter.js.map