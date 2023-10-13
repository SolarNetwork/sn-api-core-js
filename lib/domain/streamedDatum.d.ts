import { DatumSamplesType } from "./datumSamplesType.js";
import DatumStreamMetadata from "./datumStreamMetadata.js";
import DatumStreamMetadataRegistry from "../util/datumStreamMetadataRegistry.js";
/**
 * Common API for stream and stream aggregate datum.
 */
export default interface StreamedDatum {
    /** The stream ID. */
    readonly streamId: string;
    /** The timestamp. */
    readonly date: Date;
    /** The tag values. */
    readonly tags?: Set<string>;
    /** Attached metadata. */
    readonly metadata?: DatumStreamMetadata;
    /**
     * Get the property values for a given samples type.
     * @param samplesType - the type of property values to return
     * @returns the property values for the given type, or undefined if none available
     */
    propertyValuesForType(samplesType: DatumSamplesType): number[] | string[] | Set<string> | undefined;
    /**
     * Get this instance as a simple object.
     *
     * The following basic properties will be set on the returned object:
     *
     *  * `streamId` - the stream ID
     *  * `date` - the timestamp
     *  * `sourceId` - the metadata source ID
     *  * `nodeId` or `locationId` - either the node ID or location ID from the metadata
     *  * `tags` - any tags (as an Array)
     *
     * Beyond that, all instantaneous, accumulating, and status properties will be included.
     * If duplicate property names exist between the different classifications, the first-available
     * value will be used.
     *
     * @param meta - a metadata instance or metadata registry to encode the property names with;
     *     falls back to the `meta` class property if not provided
     * @param withoutStatistics - if `true` then omit statistic properties (when available)
     * @returns an object populated with all available properties
     */
    toObject: ((meta?: DatumStreamMetadata | DatumStreamMetadataRegistry) => Record<string, any> | undefined) | ((meta?: DatumStreamMetadata | DatumStreamMetadataRegistry, withoutStatistics?: boolean) => Record<string, any> | undefined);
    /**
     * Get this object as an array suitable for encoding into a standard stream datum JSON string.
     *
     * @param registry - a stream metadata registry to encode as a registry-indexed stream datum
     * @return the datum stream array object
     */
    toJsonObject(registry?: DatumStreamMetadataRegistry): any[];
    /**
     * Get this object as a standard JSON encoded string value.
     *
     * This method returns the JSON form of the result of {@link Domain.StreamedDatum#toJsonObject toJsonObject()}.
     *
     * @param registry - a stream metadata registry to encode as a registry-indexed stream datum
     * @return the JSON encoded string
     */
    toJsonEncoding(registry?: DatumStreamMetadataRegistry): string;
}
//# sourceMappingURL=streamedDatum.d.ts.map