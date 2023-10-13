import { DatumAuxiliaryType } from "../domain/datumAuxiliaryType.js";
import { default as DatumFilter } from "../domain/datumFilter.js";
import { timestampFormat } from "../util/dates.js";
import PropMap from "../util/propMap.js";
import { UrlHelperConstructor } from "./urlHelper.js";

/**
 * Create a UserDatumAuxiliaryUrlHelperMixin class.
 *
 * @param superclass the UrlHelper class to mix onto
 * @return the mixin class
 * @ignore
 */
const UserDatumAuxiliaryUrlHelperMixin = <T extends UrlHelperConstructor>(
	superclass: T
) =>
	/**
	 * A mixin class that adds user datum auxiliary support to {@link Net.UrlHelper}.
	 */
	class UserDatumAuxiliaryUrlHelperMixin extends superclass {
		#userDatumAuxiliaryBaseUrl(): string {
			return this.baseUrl() + "/datum/auxiliary";
		}

		/**
		 * Generate a URL for viewing the configured user's metadata via a `GET` request.
		 *
		 * @param filter - the search criteria
		 * @returns the URL
		 */
		listUserDatumAuxiliaryUrl(filter: DatumFilter): string {
			let result = this.#userDatumAuxiliaryBaseUrl();
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
		 * If `sourceId` contains any `/` characters, then
		 * {@link Net.SolarUserApi#userDatumAuxiliaryIdQueryUrl}
		 * will be invoked instead.
		 *
		 * @param type - the datum auxiliary type
		 * @param nodeId - the node ID
		 * @param date - a date
		 * @param sourceId - the source ID
		 * @returns the URL
		 */
		userDatumAuxiliaryIdUrl(
			type: DatumAuxiliaryType,
			nodeId: number,
			date: Date,
			sourceId: string
		): string {
			if (sourceId && sourceId.indexOf("/") >= 0) {
				// force use of query parameters if source ID has slash characters
				return this.userDatumAuxiliaryIdQueryUrl(
					type,
					nodeId,
					date,
					sourceId
				);
			}
			let result = this.#userDatumAuxiliaryBaseUrl();
			result +=
				"/" +
				encodeURIComponent(type.name ? type.name : String(type)) +
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
		 * @param type - the datum auxiliary type
		 * @param nodeId - the node ID
		 * @param date - a date
		 * @param sourceId - the source ID
		 * @returns the URL
		 */
		userDatumAuxiliaryIdQueryUrl(
			type: DatumAuxiliaryType,
			nodeId: number,
			date: Date,
			sourceId: string
		): string {
			let result = this.#userDatumAuxiliaryBaseUrl();
			const props = new PropMap({
				type: type,
				nodeId: nodeId,
				date: timestampFormat(date),
				sourceId: sourceId,
			});
			const query = props.toUriEncoding();
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
		 * @param type - the datum auxiliary type
		 * @param nodeId - the node ID
		 * @param date - a date
		 * @param sourceId - the source ID
		 * @returns the URL
		 */
		storeUserDatumAuxiliaryUrl(
			type: DatumAuxiliaryType,
			nodeId: number,
			date: Date,
			sourceId: string
		): string {
			return this.userDatumAuxiliaryIdUrl(type, nodeId, date, sourceId);
		}

		/**
		 * Generate a URL for viewing a `DatumAuxiliaryType` via a `GET` request.
		 *
		 * The {@link Net.SolarUserApi#userDatumAuxiliaryIdUrl} method is used
		 * to generate the URL.
		 *
		 * @param type - the datum auxiliary type
		 * @param nodeId - the node ID
		 * @param date - a date
		 * @param sourceId - the source ID
		 * @returns the URL
		 */
		viewUserDatumAuxiliaryUrl(
			type: DatumAuxiliaryType,
			nodeId: number,
			date: Date,
			sourceId: string
		): string {
			return this.userDatumAuxiliaryIdUrl(type, nodeId, date, sourceId);
		}

		/**
		 * Generate a URL for deleting a `DatumAuxiliaryType` via a `DELETE` request.
		 *
		 * The {@link Net.SolarUserApi#userDatumAuxiliaryIdUrl} method is used
		 * to generate the URL.
		 *
		 * @param type - the datum auxiliary type
		 * @param nodeId - the node ID
		 * @param date - a date
		 * @param sourceId - the source ID
		 * @returns the URL
		 */
		deleteUserDatumAuxiliaryUrl(
			type: DatumAuxiliaryType,
			nodeId: number,
			date: Date,
			sourceId: string
		) {
			return this.userDatumAuxiliaryIdUrl(type, nodeId, date, sourceId);
		}
	};

export default UserDatumAuxiliaryUrlHelperMixin;
