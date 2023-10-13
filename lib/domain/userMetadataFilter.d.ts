import { default as PropMap, PropMapUriEncodingCallbackFn } from "../util/propMap.js";
/** An enumeration of user metadata filter keys. */
declare enum UserMetadataFilterKeys {
    Tags = "tags",
    UserId = "userId",
    UserIds = "userIds"
}
/**
 * A filter criteria object for user metadata.
 *
 * This filter is used to query user metadata.
 */
declare class UserMetadataFilter extends PropMap {
    /**
     * Constructor.
     * @param props - initial property values
     */
    constructor(props?: PropMap | object);
    /**
     * A user ID.
     *
     * This manages the first available location ID from the `userIds` property.
     */
    get userId(): number | undefined;
    set userId(userId: number | null);
    /**
     * An array of user IDs.
     */
    get userIds(): number[] | undefined;
    set userIds(userIds: number[] | null);
    /**
     * An array of tags.
     */
    get tags(): string[] | undefined;
    set tags(val: string[] | null);
    /**
     * @override
     * @inheritdoc
     */
    toUriEncoding(propertyName?: string, callbackFn?: PropMapUriEncodingCallbackFn): string;
}
export default UserMetadataFilter;
export { UserMetadataFilterKeys };
//# sourceMappingURL=userMetadataFilter.d.ts.map