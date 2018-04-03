import UrlHelper from './urlHelper';
import UserUrlHelperMixin from './userUrlHelperMixin'

/**
 * Create a UserMetadataUrlHelperMixin class.
 *
 * @param {module:net~UrlHelper} superclass the UrlHelper class to mix onto
 * @return {module:net~UserMetadataUrlHelperMixin} the mixin class
 */
const UserMetadataUrlHelperMixin = (superclass) => 

/**
 * A mixin class that adds user metadata support to {@link module:net~UrlHelper}.
 * 
 * @mixin
 * @alias module:net~UserMetadataUrlHelperMixin
 */
class extends superclass {

    /**
	 * Generate a URL for viewing the configured user's metadata via a <code>GET</code> request.
	 *
	 * @param {module:domain~UserMetadataFilter} filter the search criteria
	 * @returns {string} the URL
	 */
	findUserMetadataUrl(filter) {
        let result = this.baseUrl() +'/users/meta';
        if ( filter ) {
            const params = filter.toUriEncoding();
            if ( params.length > 0 ) {
                result += '?' + params;
            }
        }
        return result;
    }
    
    userMetadataUrl(userId) {
        let result = this.baseUrl() +'/users/meta';
        let userParam = (userId || this.userId);
        if ( Array.isArray(userParam) ) {
            if ( userParam.length > 0 ) {
                userParam = userParam[0];
            } else {
                userParam = null;
            }
        }
        if ( userParam && userId !== null ) {
            result += '/' +userParam;
        }
        return result;
    }

    /**
	 * Generate a URL for viewing a specific user's metadata via a <code>GET</code> request.
	 *
	 * @param {number|null} [userId] a specific user ID;
     *                               if not provided the <code>userId</code> property of this class will be used;
     *                               if <code>null</code> then view metadata of the requesting user
	 * @returns {string} the URL
	 */
    viewUserMetadataUrl(userId) {
        return this.userMetadataUrl(userId);
    }

    /**
	 * Generate a URL for adding user metadata via a <code>POST</code> request.
	 *
	 * @param {number|null} [userId] a specific user ID;
     *                               if not provided the <code>userId</code> property of this class will be used;
     *                               if <code>null</code> then add metadata to the requesting user
	 * @returns {string} the URL
	 */
	addUserMetadataUrl(userId) {
        return this.userMetadataUrl(userId);
    }
    
    /**
	 * Generate a URL for replacing user metadata via a <code>PUT</code> request.
	 *
	 * @param {number|null} [userId] a specific user ID;
     *                               if not provided the <code>userId</code> property of this class will be used;
     *                               if <code>null</code> then add metadata to the requesting user
	 * @returns {string} the URL
	 */
	replaceUserMetadataUrl(userId) {
        return this.userMetadataUrl(userId);
	}
    
    /**
	 * Generate a URL for deleting user metadata via a <code>DELETE</code> request.
	 *
	 * @param {number|null} [userId] a specific user ID;
     *                               if not provided the <code>userId</code> property of this class will be used;
     *                               if <code>null</code> then add metadata to the requesting user
	 * @returns {string} the URL
	 */
	deleteUserMetadataUrl(userId) {
        return this.userMetadataUrl(userId);
	}
};

/**
 * A concrete {@link module:net~UrlHelper} with the {@link module:net~UserMetadataUrlHelperMixin}
 * and {@link module:net~UserUrlHelperMixin} mixins.
 * 
 * @mixes module:net~UserMetadataUrlHelperMixin
 * @mixes module:net~UserUrlHelperMixin
 * @extends module:net~UrlHelper
 * @alias module:net~UserMetadataUrlHelper
 */
class UserMetadataUrlHelper extends UserMetadataUrlHelperMixin(UserUrlHelperMixin(UrlHelper)) {

}

export default UserMetadataUrlHelperMixin;
export { UserMetadataUrlHelper };
