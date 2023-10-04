import Pagination from "../domain/pagination.js";
import SortDescriptor from "../domain/sortDescriptor.js";
import Enum from "./enum.js";

/**
 * A basic map-like object.
 *
 * <p>This object includes some utility functions that make it well suited to using
 * as an API query object. For example, the {@link module:util~PropMap#toUriEncoding}
 * method provides a way to serialize this object into URL query parameters.</p>
 *
 * @alias module:util~PropMap
 */
class PropMap {
	/**
	 * Constructor.
	 * @param {PropMap|object} props the initial properties; if a `PropMap` instance is provided, the properties
	 *                               of that object will be copied into this one; otherwise the object will be
	 *                               used directly to hold property values
	 */
	constructor(props) {
		/**
		 * The object that all properties are stored on.
		 * @member {object}
		 */
		this.props =
			props instanceof PropMap ? props.properties() : typeof props === "object" ? props : {};
	}

	/**
	 * Get, set, or remove a property value.
	 *
	 * @param {string} key the key to get or set the value for
	 * @param {*} [newValue] if defined, the new value to set for the given `key`;
	 *                       if `null` then the `key` property will be removed
	 * @returns {*} if called as a getter, the associated value for the given `key`,
	 *              otherwise this object
	 */
	prop(key, newValue) {
		if (arguments.length === 1) {
			return this.props[key];
		}
		if (newValue === null) {
			delete this.props[key];
		} else {
			this.props[key] = newValue;
		}
		return this;
	}

	/**
	 * Get, set, or remove multiple properties.
	 *
	 * @param {object} [newProps] the new values to set; if any value is `null` that property
	 *                            will be deleted
	 * @returns {object} if called as a getter, all properties of this object copied into a
	 *                   simple object; otherwise this object
	 */
	properties(newProps) {
		if (newProps) {
			for (const k of Object.keys(newProps)) {
				this.prop(k, newProps[k]);
			}
			return this;
		}
		return Object.assign({}, this.props);
	}

	/**
	 * Get this object as a standard URI encoded (query parameters) string value.
	 *
	 * All enumerable properties of the <code>props</code> property will be added to the
	 * result. If any property value is an array, the values of the array will be joined
	 * by a comma. Any {@link module:util~Enum} values will have their `name` property used.
	 * Any value that has a `toUriEncoding()` function property will have that function
	 * invoked, passing the associated property name as the first argument, and the returned
	 * value will be used.
	 *
	 * @param {string} [propertyName] an optional object property prefix to add to all properties
	 * @param {function} [callbackFn] An optional function that will be called for each property.
	 *                   The function will be passed property name and value arguments, and must
	 *                   return either `null` to skip the property, a 2 or 3-element array with the
	 *                   property name and value to use, and an optional boolean to force array
	 *                   values to use mutliple parameter keys. Any other return value causes the
	 *                   property to be used as- is.
	 * @return {string} the URI encoded string
	 */
	toUriEncoding(propertyName, callbackFn) {
		let result = "";
		for (let k of Object.keys(this.props)) {
			if (result.length > 0) {
				result += "&";
			}
			let v = this.props[k];
			let forceMultiKey = false;
			if (callbackFn) {
				const kv = callbackFn(k, v);
				if (kv === null) {
					continue;
				} else if (Array.isArray(kv) && kv.length > 1) {
					k = kv[0];
					v = kv[1];
					if (kv.length > 2) {
						forceMultiKey = !!kv[2];
					}
				}
			}

			if (typeof v.toUriEncoding === "function") {
				result += v.toUriEncoding(
					propertyName ? encodeURIComponent(propertyName) + "." + k : k,
				);
				continue;
			}

			if (propertyName) {
				result += encodeURIComponent(propertyName) + ".";
			}
			result += encodeURIComponent(k) + "=";
			if (Array.isArray(v)) {
				v.forEach(function (e, i) {
					if (i > 0) {
						result += forceMultiKey ? "&" + encodeURIComponent(k) + "=" : ",";
					}
					if (e instanceof Enum) {
						e = e.name;
					}
					result += encodeURIComponent(e);
				});
			} else {
				if (v instanceof Enum) {
					v = v.name;
				}
				result += encodeURIComponent(v);
			}
		}
		return result;
	}

	/**
	 * Get this object as a standard URI encoded (query parameters) string value with
	 * sorting and pagination parameters.
	 *
	 * <p>This calls {@link module:util~PropMap#toUriEncoding} first, then encodes
	 * the `sorts` and `pagination` parameters, if provided.
	 *
	 * @param {module:domain~SortDescriptor[]} [sorts] optional sort settings to use
	 * @param {module:domain~Pagination} [pagination] optional pagination settings to use
	 * @param {string} [propertyName] an optional object property prefix to add to all properties
	 * @param {function} [callbackFn] An optional function that will be called for each property.
	 *                   The function will be passed property name and value arguments, and must
	 *                   return either `null` to skip the property, a 2-element array with the property
	 *                   name and value to use, or anything else to use the property as- is.
	 * @return {string} the URI encoded string
	 */
	toUriEncodingWithSorting(sorts, pagination, propertyName, callbackFn) {
		let params = this.toUriEncoding(propertyName, callbackFn);
		if (Array.isArray(sorts)) {
			sorts.forEach((sort, i) => {
				if (sort instanceof SortDescriptor) {
					if (params.length > 0) {
						params += "&";
					}
					params += sort.toUriEncoding(i);
				}
			});
		}
		if (pagination instanceof Pagination) {
			const paginationParams = pagination.toUriEncoding();
			if (paginationParams) {
				if (params.length > 0) {
					params += "&";
				}
				params += paginationParams;
			}
		}
		return params;
	}
}

export default PropMap;
