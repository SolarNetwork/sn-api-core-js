/**
 * The SolarUser default path.
 * @type {string}
 * @alias module:net~SolarUserDefaultPath
 */
export const SolarUserDefaultPath = "/solaruser";

/**
 * The {@link module:net~UrlHelper} parameters key for the SolarUser path.
 * @type {string}
 * @alias module:net~SolarUserPathKey
 */
export const SolarUserPathKey = "solarUserPath";

/**
 * The SolarUser REST API path.
 * @type {string}
 * @alias module:net~SolarUserApiPathV1
 */
export const SolarUserApiPathV1 = "/api/v1/sec";

const UserIdsKey = "userIds";

/**
 * Create a UserUrlHelperMixin class.
 *
 * @exports net
 * @param {module:net~UrlHelper} superclass the UrlHelper class to mix onto
 * @return {module:net~UserUrlHelperMixin} the mixin class
 */
const UserUrlHelperMixin = (superclass) =>
	/**
	 * A mixin class that adds SolarUser specific support to {@link module:net~UrlHelper}.
	 *
	 * @mixin
	 * @alias module:net~UserUrlHelperMixin
	 */
	class extends superclass {
		/**
		 * Get the default user ID.
		 *
		 * This gets the first available user ID from the `userIds` property.
		 *
		 * @returns {number} the default user ID, or `null`
		 */
		get userId() {
			const userIds = this.parameter(UserIdsKey);
			return Array.isArray(userIds) && userIds.length > 0 ? userIds[0] : null;
		}

		/**
		 * Set the user ID.
		 *
		 * This will set the `userIds` property to a new array of just the given value.
		 *
		 * @param {number} userId the user ID to set
		 */
		set userId(userId) {
			this.parameter(UserIdsKey, [userId]);
		}

		get userIds() {
			return this.parameter(UserIdsKey);
		}

		set userIds(userIds) {
			this.parameter(UserIdsKey, userIds);
		}

		/**
		 * Get the base URL to the SolarUser v1 REST API.
		 *
		 * The returned URL uses the configured environment to resolve
		 * the `hostUrl` and a `solarUserPath` context path.
		 * If the context path is not available, it will default to
		 * `/solaruser`.
		 *
		 * @returns {string} the base URL to SolarUser
		 */
		baseUrl() {
			const path = this.env(SolarUserPathKey) || SolarUserDefaultPath;
			return super.baseUrl() + path + SolarUserApiPathV1;
		}

		/**
		 * Generate a URL to get information about the requesting authenticated user.
		 *
		 * @return {string} the URL to view information about the authenticated user
		 */
		whoamiUrl() {
			return this.baseUrl() + "/whoami";
		}

		/**
		 * Generate a URL to get a list of all active nodes for the user account.
		 *
		 * @return {string} the URL to access the user's active nodes
		 */
		viewNodesUrl() {
			return this.baseUrl() + "/nodes";
		}

		/**
		 * Generate a URL to get a list of all pending nodes for the user account.
		 *
		 * @return {string} the URL to access the user's pending nodes
		 */
		viewPendingNodesUrl() {
			return this.baseUrl() + "/nodes/pending";
		}

		/**
		 * Generate a URL to get a list of all archived nodes for the user account.
		 *
		 * @return {string} the URL to access the user's archived nodes
		 */
		viewArchivedNodesUrl() {
			return this.baseUrl() + "/nodes/archived";
		}

		/**
		 * Generate a URL to update the archived status of a set of nodes via a `POST` request.
		 *
		 * @param {number|number[]|null} nodeId a specific node ID, or array of node IDs, to update; if not provided the
		 *                                      `nodeIds` property of this class will be used
		 * @param {boolean} archived `true` to mark the nodes as archived; `false` to un-mark
		 *                           and return to normal status
		 * @return {string} the URL to update the nodes archived status
		 */
		updateNodeArchivedStatusUrl(nodeId, archived) {
			const nodeIds = Array.isArray(nodeId) ? nodeId : nodeId ? [nodeId] : this.nodeIds;
			let result =
				this.baseUrl() +
				"/nodes/archived?nodeIds=" +
				nodeIds.join(",") +
				"&archived=" +
				(archived ? "true" : "false");
			return result;
		}

		/**
		 * Generate a URL to get a Node Image Maker (NIM) session key.
		 *
		 * @return {string} the URL to obtain a NIM session key
		 */
		nimAuthorizeUrl() {
			return this.baseUrl() + "/user/nim/authorize";
		}
	};

export default UserUrlHelperMixin;
