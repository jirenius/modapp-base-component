import RootElem from './RootElem';
import Txt from './Txt';
import * as obj from 'modapp-utils/obj';

/**
 * A text component
 */
class Button extends RootElem {

	/**
	 * Creates an instance of Button
	 * @param {string|LocaleString} text Display text
	 * @param {function} click Click callback. Will pass itself and the event as argument on callback.
	 * @param {object} [opt] Optional parameters.
	 * @param {string} [opt.tagName] Tag name (eg. 'div') for the element. Defaults to 'button'.
	 * @param {string} [opt.className] Class name
	 * @param {object} [opt.attributes] Key/value attributes object
	 * @param {object} [opt.events] Key/value events object, where the key is the event name, and value is the callback.
	 */
	constructor(text, click, opt) {
		opt = obj.copy(opt, {
			tagName: { type: 'string', default: 'button' },
			className: { type: '?string' },
			attributes: { type: '?object' },
			events: { type: 'object' }
		});

		let txt = new Txt(text);
		super(opt.tagName, opt, [{id: 'text', component: txt}]);

		this.txt = txt;
		this.click = click;
		this._handleClick = this._handleClick.bind(this);
		this.setEvent('click', this._handleClick);
	}

	/**
	 * Sets the display text
	 * @param {string|LocaleString} text Display text
	 * @returns {this}
	 */
	setText(text) {
		this.txt.setText(text);
		return this;
	}

	_handleClick(ev) {
		if (this.click) {
			this.click(this, ev);
		}
	}
}

export default Button;