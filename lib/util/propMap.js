import Pagination from "../domain/pagination.js";
import SortDescriptor from "../domain/sortDescriptor.js";
import Enum from "./enum.js";
/**
 * A basic map-like object.
 *
 * This object includes some utility functions that make it well suited to using
 * as an API query object. For example, the {@link Util.PropMap.toUriEncoding}
 * method provides a way to serialize this object into URL query parameters.
 */
class PropMap {
    /**
     * The object that all properties are stored on.
     */
    props;
    /**
     * Constructor.
     * @param props the initial properties; if a `PropMap` instance is provided, the properties
     *     of that object will be copied into this one; otherwise the object will be
     *     used directly to hold property values
     */
    constructor(props) {
        this.props =
            props instanceof PropMap
                ? new Map(props.props)
                : props instanceof Map
                    ? new Map(props)
                    : typeof props === "object"
                        ? new Map(Object.entries(props))
                        : new Map();
    }
    /**
     * Get an iterator over the property entries.
     * @returns iterator over `[k, v]` values
     */
    [Symbol.iterator]() {
        return this.props[Symbol.iterator]();
    }
    /**
     * Get the number of properties configured.
     */
    get size() {
        return this.props.size;
    }
    prop(key, newValue) {
        if (newValue === undefined) {
            return this.props.get(key);
        }
        if (newValue === null) {
            this.props.delete(key);
        }
        else {
            this.props.set(key, newValue);
        }
        return this;
    }
    properties(newProps) {
        if (newProps) {
            for (const [k, v] of newProps instanceof Map
                ? newProps
                : Object.entries(newProps)) {
                this.prop(k, v);
            }
            return this;
        }
        return Object.fromEntries(this.props.entries());
    }
    /**
     * Get this object as a standard URI encoded (query parameters) string value.
     *
     * All enumerable properties of the <code>props</code> property will be added to the
     * result. If any property value is an array, the values of the array will be joined
     * by a comma. Any {@link Util.Enum} values will have their `name` property used.
     *
     * @param propertyName - an optional object property prefix to add to all properties
     * @param callbackFn - An optional function that will be called for each property.
     *                   The function will be passed property name and value arguments, and must
     *                   return either `undefined` to skip the property, a 2 or 3-element array with the
     *                   property name and value to use, and an optional boolean to force array
     *                   values to use mutliple parameter keys. Any other return value causes the
     *                   property to be used as-is.
     * @return the URI encoded string
     */
    toUriEncoding(propertyName, callbackFn) {
        let result = "";
        for (let [k, v] of this.props) {
            let forceMultiKey = false;
            if (callbackFn) {
                const kv = callbackFn(k, v);
                if (kv === undefined || kv === null) {
                    continue;
                }
                else if (Array.isArray(kv) && kv.length > 1) {
                    k = kv[0];
                    v = kv[1];
                    if (kv.length > 2) {
                        forceMultiKey = !!kv[2];
                    }
                }
            }
            if (result.length > 0) {
                result += "&";
            }
            if (v instanceof PropMap) {
                result += v.toUriEncoding(propertyName
                    ? encodeURIComponent(propertyName) + "." + k
                    : k, callbackFn);
                continue;
            }
            if (propertyName) {
                result += encodeURIComponent(propertyName) + ".";
            }
            result += encodeURIComponent(k) + "=";
            if (Array.isArray(v)) {
                v.forEach(function (e, i) {
                    if (i > 0) {
                        result += forceMultiKey
                            ? "&" + encodeURIComponent(k) + "="
                            : ",";
                    }
                    if (e instanceof Enum) {
                        e = e.name;
                    }
                    result += encodeURIComponent(e);
                });
            }
            else {
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
     * This calls {@link Util.PropMap.toUriEncoding} first, then encodes
     * the `sorts` and `pagination` parameters, if provided.
     *
     * @param sorts - optional sort settings to use
     * @param pagination - optional pagination settings to use
     * @param propertyName - an optional object property prefix to add to all properties
     * @param callbackFn - An optional function that will be called for each property.
     *                   The function will be passed property name and value arguments, and must
     *                   return either `undefined` to skip the property, a 2-element array with the property
     *                   name and value to use, or anything else to use the property as-is.
     * @return the URI encoded string
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
//# sourceMappingURL=propMap.js.map