import RootElem from './RootElem';
import * as obj from 'modapp-utils/obj.js';

/**
 * A checkbox component
 */
class Checkbox extends RootElem {

	/**
	 * Creates an instance of Checkbox
	 * @param {string} value Initial value.
	 * @param {object} [opt] Optional parameters.
	 * @param {string} [opt.className] Class name
	 * @param {object} [opt.attributes] Key/value attributes object
	 * @param {object} [opt.events] Key/value events object, where the key is the event name, and value is the callback.
	 */
	constructor(checked, opt) {
		opt = obj.copy(opt, {
			className: { type: '?string' },
			attributes: { type: '?object' },
			events: { type: '?object' }
		});

        if (!opt.attributes) {
            opt.attributes = { type: 'checkbox' };

        } else {
            opt.attributes.type = 'checkbox';
        }

		super('input', opt);

		this.checked = checked || false;
		this.rendered = null;
    }

    /**
     * Gets the value
    */
    getChecked() {
		let el = super.getElement();
		if (!el) {
			return false;
		}

		return el.checked;
    }

	/**
	 * Sets the value
	 * @param {string} value Value
	 */
	setChecked(checked) {
		checked = checked || false;

        if (checked === this.checked) {
			return this;
		}

		this.checked = checked;
		let el = super.getElement();
		if (!el) {
			return this;
		}

		el.checked = this.checked;
		return this;
	}

	render(el) {
        let nodeEl = super.render(el);
        nodeEl.checked = this.checked;
		return nodeEl;
	}

	unrender() {
		super.unrender();
		this.rendered = null;
	}
}

export default Checkbox;