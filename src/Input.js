import RootElem from './RootElem';

/**
 * A input component
 */
class Input extends RootElem {

	/**
	 * Creates an instance of Input
	 * @param {string} value Initial value.
	 * @param {object} [opt] Optional parameters.
	 * @param {string} [opt.className] Class name
	 * @param {object} [opt.attributes] Key/value attributes object
	 * @param {object} [opt.events] Key/value events object, where the key is the event name, and value is the callback.
	 */
	constructor(value, opt) {
		super('input', opt);
		this.setAttribute('type', 'text');

		this.value = value || "";
	}

	/**
     * Gets the value
	 * @returns {string}
    */
	getValue() {
		let el = super.getElement();
		if (!el) {
			return null;
		}

		return el.value;
	}

	/**
	 * Sets the value
	 * @param {string} value Value
	 * @returns {this}
	 */
	setValue(value) {
		value = value || "";

		if (value === this.value) {
			return this;
		}

		this.value = value;
		let el = super.getElement();
		if (!el) {
			return this;
		}

		el.value = this.value;
		return this;
	}

	render(el) {
		let nodeEl = super.render(el);
		nodeEl.value = this.value;
		return nodeEl;
	}

	unrender() {
		super.unrender();
	}
}

export default Input;