export const NodeIdsKey = 'nodeIds';

export const SourceIdsKey = 'sourceIds';

/**
 * A mixin class that adds support for SolarNode properties to a {@link UrlHelper}.
 * 
 * @param {UrlHelper} superclass the UrlHelper class to mix onto
 * @mixin
 * @property {number} nodeId the first available node ID from the <code>nodeIds</code> property;
 *                           setting this replaces any existing node IDs with an array of just that value
 * @property {number[]} nodeIds an array of node IDs, set on the <code>nodeIds</code> parameter
 * @property {string} sourceId the first available source ID from the <code>sourceIds</code> property;
 *                             setting this replaces any existing node IDs with an array of just that value 
 * @property {string[]} sourceIds an array of source IDs, set on the <code>sourceIds</code> parameter
 * @returns {*} the mixin
 */
const NodeUrlHelperMixin = (superclass) => class extends superclass {

    get nodeId() {
        const nodeIds = this.parameter(NodeIdsKey);
        return (Array.isArray(nodeIds) && nodeIds.length > 0 ? nodeIds[0] : null);
    }

    set nodeId(nodeId) {
        this.parameter(NodeIdsKey, [nodeId]);
    }

    get nodeIds() {
        return this.parameter(NodeIdsKey);
    }

    set nodeIds(nodeIds) {
        this.parameter(NodeIdsKey, nodeIds);
    }

    get sourceId() {
        const sourceIds = this.parameter(SourceIdsKey);
        return (Array.isArray(sourceIds) && sourceIds.length > 0 ? sourceIds[0] : null);
    }

    set sourceId(sourceId) {
        this.parameter(SourceIdsKey, [sourceId]);
    }

    get sourceIds() {
        return this.parameter(SourceIdsKey);
    }

    set sourceIds(sourceIds) {
        this.parameter(SourceIdsKey, sourceIds);
    }

}

export default NodeUrlHelperMixin;
