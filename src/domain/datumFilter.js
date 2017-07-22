import { Aggregation } from './aggregation';
import Location from './location';
import PropMap from '../util/propMap';

import { dateTimeUrlFormat } from '../format/date'

const AggregationKey = 'aggregation';
const DataPathKey = 'dataPath';
const EndDateKey = 'endDate';
const LocationIdsKey = 'locationIds';
const LocationKey = 'location';
const MostRecentKey = 'mostRecent';
const NodeIdsKey = 'nodeIds';
const QueryKey = 'query';
const SourceIdsKey = 'sourceIds';
const StartDateKey =  'startDate';
const TagsKey = 'tags';
const UserIdsKey = 'userIds';

/**
 * A filter criteria object for datum.
 * 
 * <p>This filter is used to query both node datum and location datum. Not all properties are
 * applicable to both types. Be sure to consult the SolarNet API documentation on the 
 * supported properties for each type.</p>
 * 
 * @extends module:util~PropMap
 * @alias module:domain~DatumFilter
 */
class DatumFilter extends PropMap {

    /**
     * Constructor.
     * @param {object} [props] initial property values 
     */
    constructor(props) {
        super(props);
    }

    /**
     * A node ID.
     * 
     * This manages the first available node ID from the `nodeIds` property.
     * 
     * @type {number}
     */
    get nodeId() {
        const nodeIds = this.nodeIds;
        return (Array.isArray(nodeIds) && nodeIds.length > 0 ? nodeIds[0] : null);
    }

    set nodeId(nodeId) {
        if ( nodeId ) {
            this.nodeIds = [nodeId];
        } else {
            this.nodeIds = null;
        }
    }

    /**
     * An array of node IDs.
     * @type {number[]}
     */
    get nodeIds() {
        return this.prop(NodeIdsKey);
    }

    set nodeIds(nodeIds) {
        this.prop(NodeIdsKey, Array.isArray(nodeIds) ? nodeIds : null);
    }

    /**
     * A location ID.
     * 
     * This manages the first available location ID from the `locationIds` property.
     * 
     * @type {number}
     */
    get locationId() {
        const locationIds = this.locationIds;
        return (Array.isArray(locationIds) && locationIds.length > 0 ? locationIds[0] : null);
    }

    set locationId(locationId) {
        if ( locationId ) {
            this.locationIds = [locationId];
        } else {
            this.locationIds = null;
        }
    }

    /**
     * An array of location IDs.
     * @type {number[]}
     */
    get locationIds() {
        return this.prop(LocationIdsKey);
    }

    set locationIds(locationIds) {
        this.prop(LocationIdsKey, Array.isArray(locationIds) ? locationIds : null);
    }

    /**
     * A source ID.
     * 
     * This manages the first available source ID from the `sourceIds` property.
     * 
     * @type {string}
     */
    get sourceId() {
        const sourceIds = this.sourceIds;
        return (Array.isArray(sourceIds) && sourceIds.length > 0 ? sourceIds[0] : null);
    }

    set sourceId(sourceId) {
        if ( sourceId ) {
            this.sourceIds = [sourceId];
        } else {
            this.sourceIds = null;
        }
    }

    /**
     * An array of source IDs.
     * @type {string[]}
     */
    get sourceIds() {
        return this.prop(SourceIdsKey);
    }

    set sourceIds(sourceIds) {
        this.prop(SourceIdsKey, Array.isArray(sourceIds) ? sourceIds : null);
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
        return (Array.isArray(userIds) && userIds.length > 0 ? userIds[0] : null);
    }

    set userId(userId) {
        if ( userId ) {
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
     * The "most recent" flag.
     * @type {boolean}
     */
    get mostRecent() {
        return !!this.prop(MostRecentKey);
    }

    set mostRecent(value) {
        this.prop(MostRecentKey, !!value);
    }

    /**
     * A minimumin date.
     * @type {Date}
     */
    get startDate() {
        return this.prop(StartDateKey);
    }

    set startDate(date) {
        this.prop(StartDateKey, date);
    }

    /**
     * A maximum date.
     * @type {Date}
     */
    get endDate() {
        return this.prop(EndDateKey);
    }

    set endDate(date) {
        this.prop(EndDateKey, date);
    }

    /**
     * A data path, in dot-delimited notation like `i.watts`.
     * @type {string}
     */
    get dataPath() {
        return this.prop(DataPathKey);
    }

    set dataPath(path) {
        this.prop(DataPathKey, path);
    }

    /**
     * An aggregation.
     * 
     * Including this in a filter will cause SolarNet to return aggregated results, rather
     * than raw results.
     * 
     * @type {module:domain~Aggregation}
     */
    get aggregation() {
        return this.prop(AggregationKey);
    }

    set aggregation(agg) {
        this.prop(AggregationKey, agg instanceof Aggregation ? agg : null);
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
     * A location, used as an example-based search criteria.
     * @type {module:domain~Location}
     */
    get location() {
        return this.prop(LocationKey);
    }

    set location(val) {
        this.prop(LocationKey, val instanceof Location ? val : null);
    }

    /**
     * A general full-text style query string.
     * @type {string}
     */
    get query() {
        return this.prop(QueryKey);
    }

    set query(val) {
        this.prop(QueryKey, val);
    }

    /**
     * Get this object as a standard URI encoded (query parameters) string value.
     * 
     * @override
     * @inheritdoc
     */
    toUriEncoding(propertyName, callbackFn) {
        return super.toUriEncoding(propertyName, callbackFn || datumFilterUriEncodingPropertyMapper);
    }

}

/**
 * Map DatumFilter properties for URI encoding.
 * 
 * @param {string} key the property key
 * @param {*} value the property value
 * @returns {*} 2-element array for mapped key+value, `null` to skip, or `key` to keep as-is
 * @private
 */
function datumFilterUriEncodingPropertyMapper(key, value) {
    if ( key === NodeIdsKey || key === LocationIdsKey || key === SourceIdsKey || key === UserIdsKey ) {
        // check for singleton array value, and re-map to singular property by chopping of "s"
        if  ( Array.isArray(value) && value.length === 1 ) {
            return [key.substring(0, key.length - 1), value[0]];
        }
    } else if ( key === StartDateKey || key === EndDateKey ) {
        return [key, dateTimeUrlFormat(value)];
    } else if ( key === MostRecentKey && !value ) {
        return null;
    }
    return key;
}

export default DatumFilter;
