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
		opt = Object.assign({ attributes: null, properties: null }, opt);
		opt.attributes = Object.assign({ type: 'text' }, opt.attributes, { value });
		opt.properties = Object.assign({}, opt.properties, { value });
		super('input', opt);
	}

	/**
     * Gets the value
	 * @returns {string}
    */
	getValue() {
		return this.getProperty('value');
	}

	/**
	 * Sets the value
	 * @param {string} value Value
	 * @returns {this}
	 */
	setValue(value) {
		this.setProperty('value', value);
		return this;
	}
}

export default Input;
