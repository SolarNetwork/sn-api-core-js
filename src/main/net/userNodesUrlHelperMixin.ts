import { DatumFilterKeys } from "../domain/datumFilter.js";
import { UrlHelperConstructor } from "./urlHelper.js";

/**
 * Create a UserUrlHelperMixin class.
 *
 * @param superclass - the UrlHelper class to mix onto
 * @return the mixin class
 * @ignore
 */
const UserUrlHelperMixin = <T extends UrlHelperConstructor>(superclass: T) =>
	/**
	 * A mixin class that adds SolarUser specific support to {@link Net.UrlHelper}.
	 */
	class UserUrlHelperMixin extends superclass {
		/**
		 * Generate a URL to get a list of all active nodes for the user account.
		 *
		 * @return the URL to access the user's active nodes
		 */
		viewNodesUrl(): string {
			return this.baseUrl() + "/nodes";
		}

		/**
		 * Generate a URL to get a list of all pending nodes for the user account.
		 *
		 * @return the URL to access the user's pending nodes
		 */
		viewPendingNodesUrl(): string {
			return this.baseUrl() + "/nodes/pending";
		}

		/**
		 * Generate a URL to get a list of all archived nodes for the user account.
		 *
		 * @return the URL to access the user's archived nodes
		 */
		viewArchivedNodesUrl(): string {
			return this.baseUrl() + "/nodes/archived";
		}

		/**
		 * Generate a URL to update the archived status of a set of nodes via a `POST` request.
		 *
		 * @param nodeId - a specific node ID, or array of node IDs, to update; if not provided the
		 *     `nodeIds` property of this class will be used
		 * @param archived `true` to mark the nodes as archived; `false` to un-mark
		 *     and return to normal status
		 * @return the URL to update the nodes archived status
		 */
		updateNodeArchivedStatusUrl(
			archived: boolean,
			nodeId?: number | number[]
		): string {
			const nodes: number[] | undefined = Array.isArray(nodeId)
				? nodeId
				: nodeId
					? [nodeId]
					: this.param(DatumFilterKeys.NodeIds);
			const result =
				this.baseUrl() +
				"/nodes/archived?nodeIds=" +
				(nodes ? nodes!.join(",") : "") +
				"&archived=" +
				(archived ? "true" : "false");
			return result;
		}
	};

export default UserUrlHelperMixin;
