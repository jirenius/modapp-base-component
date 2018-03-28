import Checkbox from './Checkbox';

/**
 * A radiobutton component
 */
class Radio extends Checkbox {

	/**
	 * Creates an instance of Radio
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

let inc = 0;

export function generateName() {
	inc++;
	return 'comp-radio--name-' + inc;
};

export default Radio;
