import RootElem from './RootElem';
import * as obj from 'modapp-utils/obj.js';

/**
 * A checkbox component
 */
class Checkbox extends RootElem {

	/**
	 * Creates an instance of Checkbox
	 * @param {boolean} checked Initial value.
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

		super('input', opt);
		this.setAttribute('type', 'checkbox');
	}

	/**
	 * Checks if the checkbox is checked
	 * @returns {boolean} Checked value
	 */
	isChecked() {
		return !!this.getProperty('checked');
	}

	/**
	 * Sets the checked value
	 * @param {string} checked Checked value
	 * @returns {this}
	 */
	setChecked(checked) {
		this.setProperty('checked', !!checked);
		return this;
	}
}

export default Checkbox;