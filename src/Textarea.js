import RootElem from './RootElem';
import * as obj from 'modapp-utils/obj.js';

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
		opt = obj.copy(opt, {
			className: { type: '?string' },
			attributes: { type: '?object' },
			events: { type: '?object' }
		});

		super('textarea', opt);

		this.value = value || "";
		this.rendered = null;
    }

    /**
     * Gets the value
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
		this.rendered = null;
	}
}

export default Textarea;