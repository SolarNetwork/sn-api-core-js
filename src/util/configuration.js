function createGetter(me, prop) {
	return function() { return me.map[prop]; };
}

function createSetter(me, prop) {
	return function(value) { me.map[prop] = value; };
}

function createProperty(me, prop) {
	Object.defineProperty(me, prop, {
		enumerable : true,
		configurable : true,
		get : createGetter(me, prop),
		set : createSetter(me, prop)
	});
}

/**
 * A configuration utility object.
 *
 * Properties can be get/set by using the {@link module:util~Configuration#value} function.
 * @alias module:util~Configuration
 */
class Configuration {

	/**
	 * Constructor.
	 *
	 * For any properties passed on `initialMap`, {@link module:util~Configuration#value} will
	 * be called so those properties are defined on this instance.
	 *
	 * @param {object} initialMap the optional initial properties to store
	 */
	constructor(initialMap) {
		this.map = {};
		if ( initialMap !== undefined ) {
			this.values(initialMap);
		}
	}

	/**
	 * Test if a key is truthy.
	 *
	 * @param {string} key the key to test
	 * @returns {boolean} `true` if the key is enabled
	 */
	enabled(key) {
		if ( key === undefined ) {
			return false;
		}
		return !!this.map[key];
	}

	/**
	 * Set or toggle the enabled status of a given key.
	 *
	 * <p>If the `enabled` parameter is not passed, then the enabled
	 * status will be toggled to its opposite value.</p>
	 *
	 * @param {string} key they key to set
	 * @param {boolean} enabled the optional enabled value to set
	 * @returns {module:util~Configuration} this object to allow method chaining
	 */
	toggle(key, enabled) {
		var val = enabled;
		if ( key === undefined ) {
			return this;
		}
		if ( val === undefined ) {
			// in 1-argument mode, toggle current value
			val = (this.map[key] === undefined);
		}
		return this.value(key, (val === true ? true : null));
	}

	/**
	 * Get or set a configuration value.
	 *
	 * @param {string} key The key to get or set the value for
	 * @param {object} [newValue] If defined, the new value to set for the given `key`.
	 *                            If `null` then the value will be removed.
	 * @returns {object} If called as a getter, the associated value for the given `key`,
	 *                   otherwise this object.
	 */
	value(key, newValue) {
		if ( arguments.length === 1 ) {
			return this.map[key];
		}
		if ( newValue === null ) {
			delete this.map[key];
			if ( this.hasOwnProperty(key) ) {
				delete this[key];
			}
		} else {
			this.map[key] = newValue;
			if ( !this.hasOwnProperty(key) ) {
				createProperty(this, key);
			}
		}
		return this;
	}

	/**
	 * Get or set multiple properties.
	 * 
	 * @param {object} [newMap] a map of values to set
	 * @returns {object} if called as a getter, all properties of this object copied into a simple object;
	 *                   otherwise this object
	 */
	values(newMap) {
		if ( newMap ) {
			for ( let prop in newMap ) {
				if ( newMap.hasOwnProperty(prop) ) {
					this.value(prop, newMap[prop]);
				}
			}
			return this;
		}
		return Object.assign({}, this.map);
	}

}

export default Configuration;
