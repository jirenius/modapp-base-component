import RootElem from './RootElem';
import Txt from './Txt';
import { obj } from 'modapp-utils';

/**
 * A select component
 */
class Select extends RootElem {

	/**
	 * Creates an instance of Select
	 * @param {object} options An array of objects to use as options in the select.
	 * @param {object} [opt] Optional parameters.
	 * @param {string} [opt.className] Class name.
	 * @param {object} [opt.attributes] Key/value attributes object.
	 * @param {object} [opt.events] Key/value events object, where the key is the event name, and value is the callback.
	 * @param {function} [opt.optionFactory] A function that builds an option from an object.
	 */
	constructor(options, opt) {
		opt = obj.copy(opt, {
			className: { type: '?string' },
			attributes: { type: '?object' },
			events: { type: '?object' },
			optionFactory: {
				type: 'function', default: m => {
					return new Txt(m.text, {
						tagName: 'option',
						attributes: {
							value: m.value
						}
					});
				}
			}
		});

		let optionElements = [];

		for (let i of options) {
			optionElements.push({ component: opt.optionFactory(i) });
		}

		super('select', opt, optionElements);
	}

	/**
	 * Sets the selected option
	 * @param {string} value The value of the option to set as selected
	 * @returns {this}
	 */
	setSelected(value) {
		if (value === this.value) {
			return this;
		}

		this.value = value;
		let el = super.getElement();
		if (!el) {
			return this;
		}

		//TODO

		return this;
	}

	getSelected() {
		let el = super.getElement();
		if (!el) {
			return null;
		}

		return el.value;
	}

	render(el) {
		return super.render(el);
	}

	unrender() {
		this.rendered = null;
	}
}

export default Select;
