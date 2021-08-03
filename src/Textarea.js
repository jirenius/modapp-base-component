import RootElem from './RootElem';

/**
 * A textarea component
 */
class Textarea extends RootElem {

	/**
	 * Creates an instance of Textarea
	 * @param {string} value Initial value.
	 * @param {object} [opt] Optional parameters.
	 * @param {string} [opt.className] Class name
	 * @param {object} [opt.attributes] Key/value attributes object
	 * @param {object} [opt.events] Key/value events object, where the key is the event name, and value is the callback.
	 */
	constructor(value, opt) {
		super('textarea', opt);

		this.value = value || "";
		this.rendered = null;
	}

	/**
	 * Gets the value
	 * @returns {string}
	 */
	getValue() {
		let el = super.getElement();
		return el
			? el.value
			: this.value;
	}

	/**
	 * Sets the value
	 * @param {string} value Value
	 * @returns {this}
	 */
	setValue(value) {
		value = value || "";

		let el = super.getElement();
		if (el) {
			el.value = value;
		} else {
			this.value = value;
		}
		return this;
	}

	render(el) {
		let nodeEl = super.render(el);
		nodeEl.value = this.value;
		return nodeEl;
	}

	unrender() {
		let el = super.getElement();
		if (el) {
			super.unrender();
			this.value = el.value;
			this.rendered = null;
		}
	}
}

export default Textarea;
