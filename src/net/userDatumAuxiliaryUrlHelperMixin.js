import UrlHelper from "./urlHelper.js";
import UserUrlHelperMixin from "./userUrlHelperMixin.js";
import { timestampFormat } from "../format/date.js";
import PropMap from "../util/propMap.js";

/**
 * Create a UserDatumAuxiliaryUrlHelperMixin class.
 *
 * @exports net
 * @param {module:net~UrlHelper} superclass the UrlHelper class to mix onto
 * @return {module:net~UserDatumAuxiliaryUrlHelperMixin} the mixin class
 */
const UserDatumAuxiliaryUrlHelperMixin = (superclass) =>
	/**
	 * A mixin class that adds user datum auxiliary support to {@link module:net~UrlHelper}.
	 *
	 * @mixin
	 * @alias module:net~UserDatumAuxiliaryUrlHelperMixin
	 */
	class extends superclass {
		userDatumAuxiliaryBaseUrl() {
			return this.baseUrl() + "/datum/auxiliary";
		}

		/**
		 * Generate a URL for viewing the configured user's metadata via a `GET` request.
		 *
		 * @param {module:domain~DatumFilter} filter the search criteria
		 * @returns {string} the URL
		 */
		listUserDatumAuxiliaryUrl(filter) {
			let result = this.userDatumAuxiliaryBaseUrl();
			if (filter) {
				const params = filter.toUriEncoding();
				if (params.length > 0) {
					result += "?" + params;
				}
			}
			return result;
		}

		/**
		 * Generate a URL for accessing a specific `DatumAuxiliaryType` by its primary key.
		 *
		 * If `sourceId` contains any `/` characters, then {@link module:net~UserDatumAuxiliaryUrlHelperMixin#userDatumAuxiliaryIdQueryUrl}
		 * will be invoked instead.
		 *
		 * @param {module:domain~DatumAuxiliaryType} type the datum auxiliary type
		 * @param {number} nodeId the node ID
		 * @param {Date} date a date
		 * @param {string} sourceId the source ID
		 * @returns {string} the URL
		 */
		userDatumAuxiliaryIdUrl(type, nodeId, date, sourceId) {
			if (sourceId && sourceId.indexOf("/") >= 0) {
				// force use of query parameters if source ID has slash characters
				return this.userDatumAuxiliaryIdQueryUrl(type, nodeId, date, sourceId);
			}
			let result = this.userDatumAuxiliaryBaseUrl();
			result +=
				"/" +
				encodeURIComponent(type.name ? type.name : type) +
				"/" +
				encodeURIComponent(nodeId) +
				"/" +
				encodeURIComponent(timestampFormat(date)) +
				"/" +
				encodeURIComponent(sourceId);
			return result;
		}

		/**
		 * Generate a URL for accessing a specific `DatumAuxiliaryType` by its primary key,
		 * using query parameters for id components.
		 *
		 * @param {module:domain~DatumAuxiliaryType} type the datum auxiliary type
		 * @param {number} nodeId the node ID
		 * @param {Date} date a date
		 * @param {string} sourceId the source ID
		 * @returns {string} the URL
		 */
		userDatumAuxiliaryIdQueryUrl(type, nodeId, date, sourceId) {
			let result = this.userDatumAuxiliaryBaseUrl();
			let props = new PropMap({
				type: type,
				nodeId: nodeId,
				date: timestampFormat(date),
				sourceId: sourceId,
			});
			let query = props.toUriEncoding();
			if (query.length > 0) {
				result += "?" + query;
			}
			return result;
		}

		/**
		 * Generate a URL for storing a `DatumAuxiliaryType` via a `POST` request.
		 *
		 * The {@link module:net~UserDatumAuxiliaryUrlHelperMixin#userDatumAuxiliaryIdUrl} method is used
		 * to generate the URL.
		 *
		 * @param {module:domain~DatumAuxiliaryType} type the datum auxiliary type
		 * @param {number} nodeId the node ID
		 * @param {Date} date a date
		 * @param {string} sourceId the source ID
		 * @returns {string} the URL
		 */
		storeUserDatumAuxiliaryUrl(type, nodeId, date, sourceId) {
			return this.userDatumAuxiliaryIdUrl(type, nodeId, date, sourceId);
		}

		/**
		 * Generate a URL for viewing a `DatumAuxiliaryType` via a `GET` request.
		 *
		 * The {@link module:net~UserDatumAuxiliaryUrlHelperMixin#userDatumAuxiliaryIdUrl} method is used
		 * to generate the URL.
		 *
		 * @param {module:domain~DatumAuxiliaryType} type the datum auxiliary type
		 * @param {number} nodeId the node ID
		 * @param {Date} date a date
		 * @param {string} sourceId the source ID
		 * @returns {string} the URL
		 */
		viewUserDatumAuxiliaryUrl(type, nodeId, date, sourceId) {
			return this.userDatumAuxiliaryIdUrl(type, nodeId, date, sourceId);
		}

		/**
		 * Generate a URL for deleting a `DatumAuxiliaryType` via a `DELETE` request.
		 *
		 * The {@link module:net~UserDatumAuxiliaryUrlHelperMixin#userDatumAuxiliaryIdUrl} method is used
		 * to generate the URL.
		 *
		 * @param {module:domain~DatumAuxiliaryType} type the datum auxiliary type
		 * @param {number} nodeId the node ID
		 * @param {Date} date a date
		 * @param {string} sourceId the source ID
		 * @returns {string} the URL
		 */
		deleteUserDatumAuxiliaryUrl(type, nodeId, date, sourceId) {
			return this.userDatumAuxiliaryIdUrl(type, nodeId, date, sourceId);
		}
	};

/**
 * A concrete {@link module:net~UrlHelper} with the {@link module:net~UserDatumAuxiliaryUrlHelperMixin}
 * and {@link module:net~UserUrlHelperMixin} mixins.
 *
 * @mixes module:net~UserDatumAuxiliaryUrlHelperMixin
 * @mixes module:net~UserUrlHelperMixin
 * @extends module:net~UrlHelper
 * @alias module:net~UserDatumAuxiliaryUrlHelper
 */
class UserDatumAuxiliaryUrlHelper extends UserDatumAuxiliaryUrlHelperMixin(
	UserUrlHelperMixin(UrlHelper),
) {}

export default UserDatumAuxiliaryUrlHelperMixin;
export { UserDatumAuxiliaryUrlHelper };
