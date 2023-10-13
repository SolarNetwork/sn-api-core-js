import {
	default as DatumFilter,
	DatumFilterKeys,
} from "../domain/datumFilter.js";
import Pagination from "../domain/pagination.js";
import SortDescriptor from "../domain/sortDescriptor.js";
import { UrlHelperConstructor } from "./urlHelper.js";

/**
 * Create a LocationDatumMetadataUrlHelperMixin class.
 *
 * @param superclass - the UrlHelper class to mix onto
 * @return the mixin class
 * @ignore
 */
const LocationDatumMetadataUrlHelperMixin = <T extends UrlHelperConstructor>(
	superclass: T
) =>
	/**
	 * A mixin class that adds SolarNode datum metadata support to {@link module:net~UrlHelper}.
	 *
	 * Location datum metadata is metadata associated with a specific location and source, i.e.
	 * a `locationId` and a `sourceId`.
	 */
	class LocationDatumMetadataUrlHelperMixin extends superclass {
		/**
		 * Get a base URL for location datum metadata operations using a specific location ID.
		 *
		 * @param locationId a specific location ID to use; if not provided the `locationId` parameter of this instance will be used
		 * @returns the base URL
		 */
		#baseLocationDatumMetadataUrl(locationId?: number): string {
			return (
				this.baseUrl() +
				"/location/meta/" +
				(locationId || this.param(DatumFilterKeys.LocationId))
			);
		}

		#locationDatumMetadataUrlWithSource(
			locationId?: number,
			sourceId?: string
		) {
			let result = this.#baseLocationDatumMetadataUrl(locationId);
			const source = sourceId || this.param(DatumFilterKeys.SourceId);
			if (source) {
				result += "?sourceId=" + encodeURIComponent(source);
			}
			return result;
		}

		/**
		 * Generate a URL for viewing datum metadata.
		 *
		 * If no `sourceId` is provided, then the API will return all available datum metadata for all sources.
		 *
		 * @param locationId - a specific location ID to use; if not provided the `locationId` parameter of this instance will be used
		 * @param sourceId - a specific source ID to use;
		 *                            if not provided the `sourceId` parameter of this instance will be used;
		 *                            if `null` then ignore any `sourceId` property of this class
		 * @returns the URL
		 */
		viewLocationDatumMetadataUrl(
			locationId?: number,
			sourceId?: string
		): string {
			return this.#locationDatumMetadataUrlWithSource(
				locationId,
				sourceId
			);
		}

		/**
		 * Generate a URL for adding (merging) datum metadata via a `POST` request.
		 *
		 * @param locationId - a specific location ID to use; if not provided the `locationId` parameter of this instance will be used
		 * @param sourceId - a specific source ID to use; if not provided the `sourceId` parameter of this instance will be used
		 * @returns the URL
		 */
		addLocationDatumMetadataUrl(
			locationId?: number,
			sourceId?: string
		): string {
			return this.#locationDatumMetadataUrlWithSource(
				locationId,
				sourceId
			);
		}

		/**
		 * Generate a URL for setting datum metadata via a `PUT` request.
		 *
		 * @param locationId - a specific location ID to use; if not provided the `locationId` parameter of this instance will be used
		 * @param sourceId - a specific source ID to use; if not provided the `sourceId` parameter of this instance will be used
		 * @returns the URL
		 */
		replaceLocationDatumMetadataUrl(
			locationId?: number,
			sourceId?: string
		): string {
			return this.#locationDatumMetadataUrlWithSource(
				locationId,
				sourceId
			);
		}

		/**
		 * Generate a URL for deleting datum metadata via a `DELETE` request.
		 *
		 * @param locationId - a specific location ID to use; if not provided the `locationId` parameter of this instance will be used
		 * @param sourceId - a specific source ID to use; if not provided the `sourceId` parameter of this instance will be used
		 * @returns the URL
		 */
		deleteLocationDatumMetadataUrl(
			locationId?: number,
			sourceId?: string
		): string {
			return this.#locationDatumMetadataUrlWithSource(
				locationId,
				sourceId
			);
		}

		/**
		 * Generate a URL for searching for location metadata.
		 *
		 * @param filter - a search filter; the `locationIds`, `sourceIds`, `tags`,
		 *     `query`, and `location` properties are supported
		 * @param sorts - optional sort settings to use
		 * @param pagination - optional pagination settings to use
		 * @returns the URL
		 */
		findLocationDatumMetadataUrl(
			filter: DatumFilter,
			sorts?: SortDescriptor[],
			pagination?: Pagination
		) {
			let result = this.baseUrl() + "/location/meta";
			const params = filter.toUriEncodingWithSorting(sorts, pagination);
			if (params.length > 0) {
				result += "?" + params;
			}
			return result;
		}
	};

export default LocationDatumMetadataUrlHelperMixin;
