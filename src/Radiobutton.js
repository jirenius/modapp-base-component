import Checkbox from './Checkbox';

/**
 * A radiobutton component
 */
class Radiobutton extends Checkbox {

	/**
	 * Creates an instance of Radiobutton
	 * @param {boolean} checked Initial value.
	 * @param {object} [opt] Optional parameters.
	 * @param {string} [opt.className] Class name
	 * @param {object} [opt.attributes] Key/value attributes object
	 * @param {object} [opt.events] Key/value events object, where the key is the event name, and value is the callback.
	 */
	constructor(checked, opt) {
		super(checked, opt);
		this.setAttribute('type', 'radio');
	}
}

export default Radiobutton;