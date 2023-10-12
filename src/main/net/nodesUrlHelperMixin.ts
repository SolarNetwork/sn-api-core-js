import { UrlHelperConstructor } from "./urlHelper.js";
import DatumFilter from "../domain/datumFilter.js";

/**
 * Create a NodeUrlHelperMixin class.
 *
 * @param superclass the UrlHelper class to mix onto
 * @return the mixin class
 * @ignore
 */
const NodesUrlHelperMixin = <T extends UrlHelperConstructor>(superclass: T) =>
	/**
	 * A mixin class that adds support for SolarNode properties to a {@link Net.UrlHelper}.
	 */
	class NodesUrlHelperMixin extends superclass {
		/**
		 * Generate a URL to get a list of all active node IDs available to the requesting user.
		 *
		 * **Note** this method only works against the `/sec` version of the API endpoint.
		 *
		 * @return the URL to access the node IDs the requesting user has access to
		 */
		listAllNodeIdsUrl(): string {
			return this.baseUrl() + "/nodes";
		}

		/**
		 * Generate a URL for finding the available source IDs.
		 *
		 * @param datumFilter the search criteria, which can define `nodeId`, `startDate`, `endDate`,
		 *     `localStartDate`, `localEndDdate`, `metadataFilter`, `propertyNames`,
		 *     `instantaneousPropertyNames`, `accumulatingPropertyNames`, and
		 *     `statusPropertyNames`, properties to limit the results to
		 * @returns {string} the URL
		 */
		findSourcesUrl(datumFilter?: DatumFilter): string {
			const filter = datumFilter
				? new DatumFilter(datumFilter)
				: this.datumFilter();
			const params = filter.toUriEncoding();
			let result = this.baseUrl() + "/nodes/sources";
			if (params.length > 0) {
				result += "?" + params;
			}
			return result;
		}
	};

export default NodesUrlHelperMixin;
