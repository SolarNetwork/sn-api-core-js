import Pagination from 'pagination';
import SortDescriptor from 'sortDescriptor';
import UrlHelper from 'net/urlHelper';
import NodeUrlHelperMixin from 'net/nodeUrlHelperMixin';
import QueryUrlHelperMixin from 'net/queryUrlHelperMixin'

/**
 * A mixin class that adds SolarNode datum metadata support to {@link UrlHelper}.
 * 
 * <p>Datum metadata is metadata associated with a specific node and source, i.e. 
 * a <code>nodeId</code> and a <code>sourceId</code>.
 * 
 * @param {UrlHelper} superclass the UrlHelper class to mix onto
 * @mixin
 * @returns {*} the mixin
 */
const DatumMetadataUrlHelperMixin = (superclass) => class extends superclass {

    /**
     * Get a base URL for datum metadata operations using a specific node ID.
     * 
     * @param {number} [nodeId] a specific node ID to use; if not provided the <code>nodeId</code> property of this class will be used
     * @returns {string} the base URL
     * @private
     * @memberof DatumMetadataUrlHelperMixin#
     */
    baseDatumMetadataUrl(nodeId) {
        return this.baseUrl() + '/datum/meta/' +(nodeId || this.nodeId);
    }

    datumMetadataUrlWithSource(nodeId, sourceId) {
        let result = this.baseDatumMetadataUrl(nodeId);
        let source = (sourceId || this.sourceId);
        if ( sourceId !== null && source ) {
            result += '?sourceId=' +encodeURIComponent(source);
        }
        return result;
    }

	/**
	 * Generate a URL for viewing datum metadata.
     * 
     * If no <code>sourceId</code> is provided, then the API will return all available datum metadata for all sources.
	 *
	 * @param {number} [nodeId] a specific node ID to use; if not provided the <code>nodeId</code> property of this class will be used
	 * @param {string} [sourceId] a specific source ID to use; 
     *                            if not provided the <code>sourceId</code> property of this class will be used;
     *                            if <code>null</code> then ignore any <code>sourceId</code> property of this class
     * @returns {string} the URL
     * @memberof DatumMetadataUrlHelperMixin#
	 */
	viewDatumMetadataUrl(nodeId, sourceId) {
        return this.datumMetadataUrlWithSource(nodeId, sourceId);
    }
    
	/**
	 * Generate a URL for adding (merging) datum metadata via a <code>POST</code> request.
     * 
	 * @param {number} [nodeId] a specific node ID to use; if not provided the <code>nodeId</code> property of this class will be used
	 * @param {string} [sourceId] a specific source ID to use; if not provided the <code>sourceId</code> property of this class will be used
     * @returns {string} the URL
     * @memberof DatumMetadataUrlHelperMixin#
	 */
    addDatumMetadataUrl(nodeId, sourceId) {
        return this.datumMetadataUrlWithSource(nodeId, sourceId);
    }

	/**
	 * Generate a URL for setting datum metadata via a <code>PUT</code> request.
     * 
	 * @param {number} [nodeId] a specific node ID to use; if not provided the <code>nodeId</code> property of this class will be used
	 * @param {string} [sourceId] a specific source ID to use; if not provided the <code>sourceId</code> property of this class will be used
     * @returns {string} the URL
     * @memberof DatumMetadataUrlHelperMixin#
	 */
    replaceDatumMetadataUrl(nodeId, sourceId) {
        return this.datumMetadataUrlWithSource(nodeId, sourceId);
    }

	/**
	 * Generate a URL for deleting datum metadata via a <code>DELETE</code> request.
     * 
	 * @param {number} [nodeId] a specific node ID to use; if not provided the <code>nodeId</code> property of this class will be used
	 * @param {string} [sourceId] a specific source ID to use; if not provided the <code>sourceId</code> property of this class will be used
     * @returns {string} the URL
     * @memberof DatumMetadataUrlHelperMixin#
	 */
    deleteDatumMetadataUrl(nodeId, sourceId) {
        return this.datumMetadataUrlWithSource(nodeId, sourceId);
    }

	/**
	 * Generate a URL for searching for datum metadata.
	 * 
	 * @param {number} [nodeId] a specific node ID to use; if not provided the <code>nodeId</code> property of this class will be used
	 * @param {string} [sourceId] a specific source ID to use; 
     *                            if not provided the <code>sourceId</code> property of this class will be used;
     *                            if <code>null</code> then ignore any <code>sourceId</code> property of this class
	 * @param {SortDescriptor[]} [sorts] optional sort settings to use
	 * @param {Pagination} [pagination] optional pagination settings to use
	 * @returns {string} the URL
	 * @memberof DatumMetadataUrlHelperMixin#
	 */
	findDatumMetadataUrl(nodeId, sourceId, sorts, pagination) {
        let result = this.baseDatumMetadataUrl(nodeId);
		let params = '';
        let source = (sourceId || this.sourceId);
        if ( sourceId !== null && source ) {
            params += 'sourceId=' +encodeURIComponent(source);
        }
		if ( Array.isArray(sorts) ) {
			sorts.forEach((sort, i) => {
				if ( sort instanceof SortDescriptor ) {
					if ( params.length > 0 ) {
						params += '&';
					}
					params += sort.toUriEncoding(i);
				}
			});
		}
		if ( pagination instanceof Pagination ) {
			if ( params.length > 0 ) {
				params += '&';
			}
			params += pagination.toUriEncoding();
		}
		if ( params.length > 0 ) {
			result += '?' + params;
		}
		return result;
	}

};

export default DatumMetadataUrlHelperMixin;

/**
 * A concrete {@link UrlHelper} with the {@link DatumMetadataUrlHelperMixin},  {@link QueryUrlHelperMixin}, and
 * {@link NodeUrlHelperMixin} mixins.
 * 
 * @mixes DatumMetadataUrlHelperMixin
 * @mixes QueryUrlHelperMixin
 * @mixes NodeUrlHelperMixin
 * @extends UrlHelper
 */
export class DatumMetadataUrlHelper extends DatumMetadataUrlHelperMixin(QueryUrlHelperMixin(NodeUrlHelperMixin(UrlHelper))) {

}
