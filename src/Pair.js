// A component rendering a key,value pair
class Pair {
	/**
	 * Creates a new Pair instance
	 * @param {Component} key Key component
	 * @param {Component} value Value component
	 */
	constructor(key, value) {
		this._key = key;
		this._value = value;
	}

	render(el) {
		this._key.render(el);
		this._value.render(el);
	}

	unrender() {
		this._key.unrender();
		this._value.unrender();
	}

	/**
	 * Get the key component.
	 * @returns {Component} the key component
	 */
	getKeyComponent() {
		return this._key;
	}

	/**
	 * Get the value component.
	 * @returns {Component} the value component
	 */
	getValueComponent() {
		return this._value;
	}
}

export default Pair;
