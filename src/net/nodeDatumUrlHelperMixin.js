/** @module net */

import UrlHelper from './urlHelper';
import NodeUrlHelperMixin from './nodeUrlHelperMixin';
import QueryUrlHelperMixin from './queryUrlHelperMixin';

/**
 * Create a NodeDatumUrlHelperMixin class.
 *
 * @exports net
 * @param {module:net~UrlHelper} superclass the UrlHelper class to mix onto
 * @return {module:net~NodeDatumUrlHelperMixin} the mixin class
 */
const NodeDatumUrlHelperMixin = (superclass) => 

/**
 * A mixin class that adds SolarNode datum query support to {@link module:net~UrlHelper}.
 * 
 * @mixin
 * @alias module:net~NodeDatumUrlHelperMixin
 */
class extends superclass {

	/**
	 * Generate a URL for the "reportable interval" for a node, optionally limited to a specific set of source IDs.
	 *
     * If no source IDs are provided, then the reportable interval query will return an interval for
     * all available sources.
     *
	 * @param {number} [nodeId] a specific node ID to use; if not provided the <code>nodeId</code> property of this class will be used
	 * @param {string[]} [sourceIds] an array of source IDs to limit query to; if not provided the <code>sourceIds</code> property of this class will be used
	 * @returns {string} the URL
	 */
	reportableIntervalUrl(nodeId, sourceIds) {
		let url = (this.baseUrl() +'/range/interval?nodeId=' +(nodeId || this.nodeId));
        let sources = (sourceIds || this.sourceIds);
		if ( Array.isArray(sources) && sources.length > 0 ) {
			url += '&sourceIds=' + sources.map(e => encodeURIComponent(e)).join(',');
		}
		return url;
	}

	/**
	 * Generate a URL for finding the available source IDs for a node or metadata filter.
	 * 
	 * @param {number|number[]} [nodeId] a specific node ID, or array of node IDs, to use; if not provided the 
	 *                                   <code>nodeIds</code> property of this class will be used, unless <code>null</code>
	 *                                   is passed in which case no node IDs will be added to the URL
	 * @param {string} [metadataFilter] the LDAP-style metadata filter
	 * @returns {string} the URL
	 */
	availableSourcesUrl(nodeId, metadataFilter) {
		const nodeIds = (Array.isArray(nodeId) ? nodeId : nodeId ? [nodeId] : nodeId !== null ? this.nodeIds : undefined);
		let result = this.baseUrl() + '/range/sources';
		let params = '';
		if ( Array.isArray(nodeIds) ) {
			params += 'nodeIds=' +nodeIds.join(',');
		}
		if ( metadataFilter ) {
			if ( params.length > 0 ) {
				params += '&';
			}
			params += 'metadataFilter=' +encodeURIComponent(metadataFilter);
		}
		if ( params.length > 0 ) {
			result += '?' +params;
		}
		return result;
	}

}

/**
 * A concrete {@link UrlHelper} with the {@link NodeDatumUrlHelperMixin}, {@link QueryUrlHelperMixin},
 * and {@link NodeUrlHelperMixin} mixins.
 * 
 * @mixes NodeDatumUrlHelperMixin
 * @mixes QueryUrlHelperMixin
 * @mixes NodeUrlHelperMixin
 * @extends UrlHelper
 */
class NodeDatumUrlHelper extends NodeDatumUrlHelperMixin(QueryUrlHelperMixin(NodeUrlHelperMixin(UrlHelper))) {

}

export default NodeDatumUrlHelperMixin;
export { NodeDatumUrlHelper };
