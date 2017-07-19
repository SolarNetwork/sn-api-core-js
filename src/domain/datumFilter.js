import PropMap from '../util/propMap';

const NodeIdsKey = 'nodeIds';
const SourceIdsKey = 'sourceIds';

/**
 * A filter criteria object for datum.
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
     * @type {string}
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

}

export default DatumFilter;
