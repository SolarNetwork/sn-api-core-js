import PropMap from "./propMap.js";

/**
 * A configuration utility object.
 *
 * Properties can be get/set by using the {@link Util.Configuration#value} function.
 * Properties added this way become enumerable properties of the `Configuration`
 * instance as well.
 */
class Configuration implements Record<string, any> {
	/** The configuration data. */
	readonly #map: Map<string, any>;

	/**
	 * Constructor.
	 *
	 * For any properties passed on `initialMap`, {@link Configuration#value} will
	 * be called so those properties are defined on this instance.
	 *
	 * @param initialMap - the optional initial properties to store
	 */
	constructor(initialMap?: Map<string, any> | object) {
		this.#map = new Map();
		if (initialMap !== undefined) {
			this.values(initialMap);
		}
	}

	/**
	 * Get direct access to the underlying property map.
	 */
	get props(): Map<string, any> {
		return this.#map;
	}

	#createProperty(prop: string) {
		const get = () => {
			return this.#map.get(prop);
		};
		const set = (value: any) => {
			this.#map.set(prop, value);
		};
		Object.defineProperty(this, prop, {
			enumerable: true,
			configurable: true,
			get: get,
			set: set,
		});
	}

	/**
	 * Test if a key is truthy.
	 *
	 * @param key - the key to test
	 * @returns `true` if the key is enabled
	 */
	enabled(key: string): boolean {
		if (key === undefined) {
			return false;
		}
		return !!this.#map.get(key);
	}

	/**
	 * Set or toggle the enabled status of a given key.
	 *
	 * If the `enabled` parameter is not passed, then the enabled
	 * status will be toggled to its opposite value.
	 *
	 * @param {string} key - the key to set
	 * @param {boolean} enabled - the optional enabled value to set
	 * @returns this object to allow method chaining
	 */
	toggle(key: string, enabled?: boolean): this {
		let val = enabled;
		if (key === undefined) {
			return this;
		}
		if (val === undefined) {
			// in 1-argument mode, toggle current value
			val = this.#map.get(key) === undefined;
		}
		return this.value(key, val === true ? true : null);
	}

	/**
	 * Get a configuration value.
	 *
	 * @param key - the key to get
	 * @returns the associated value for the given `key`
	 */
	value(key: string): any;
	/**
	 * Set a configuration value.
	 *
	 * @param key - the key to get or set the value for
	 * @param newValue the new value to set for the given `key`.
	 *     If `null` then the value will be removed.
	 * @returns this object.
	 */
	value(key: string, newValue: any): this;
	value(key: string, newValue?: any): any | this {
		if (newValue === undefined) {
			return this.#map.get(key);
		}
		if (newValue === null) {
			this.#map.delete(key);
			if (Object.prototype.hasOwnProperty.call(this, key)) {
				delete (this as any)[key];
			}
		} else {
			this.#map.set(key, newValue);
			if (!Object.prototype.hasOwnProperty.call(this, key)) {
				this.#createProperty(key);
			}
		}
		return this;
	}

	/**
	 * Get all properties.
	 *
	 * @returns all properties of this object copied into a simple object
	 */
	values(): Record<string, any>;
	/**
	 * Set multiple properties.
	 *
	 * @param newMap - a map of values to set
	 * @returns this object
	 */
	values(newMap: Record<string, any> | Map<string, any> | PropMap): this;
	values(
		newMap?: Record<string, any> | Map<string, any> | PropMap
	): Record<string, any> | this {
		if (newMap) {
			const itr =
				newMap instanceof PropMap
					? newMap.props
					: newMap instanceof Map
						? newMap
						: Object.entries(newMap);
			for (const [k, v] of itr) {
				this.value(k, v);
			}
			return this;
		}
		return Object.fromEntries(this.#map.entries());
	}
}

export default Configuration;
