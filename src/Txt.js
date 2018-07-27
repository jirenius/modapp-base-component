import { anim } from 'modapp-utils';
import RootElem from './RootElem';
import { translate, onLocaleUpdate, offLocaleUpdate } from './utils/l10n';

/**
 * A text component
 */
class Txt extends RootElem {

	/**
	 * Creates an instance of Txt
	 * @param {string|LocaleString} text Display text
	 * @param {object} [opt] Optional parameters.
	 * @param {string} [opt.tagName] Tag name (eg. 'h1') for the element. Defaults to 'span'.
	 * @param {string} [opt.className] Class name
	 * @param {object} [opt.attributes] Key/value attributes object
	 * @param {object} [opt.events] Key/value events object, where the key is the event name, and value is the callback.
	 */
	constructor(text, opt) {
		opt = Object.assign({ tagName: 'span' }, opt);
		super(opt.tagName, opt);

		this.text = text || "";
		this.animId = null;
		this.rendered = null;

		// Bind callbacks
		this._handleChange = this._handleChange.bind(this);
	}

	/**
	 * Sets the display text
	 * @param {string|LocaleString} text Display text
	 * @returns {this}
	 */
	setText(text) {
		text = text || "";

		if (this.text !== text) {
			let tmp = this.text;
			this.text = text;
			if (super.getElement()) {
				offLocaleUpdate(tmp);
				this._handleChange();
				onLocaleUpdate(this.text);
			}
		}

		return this;
	}

	render(el) {
		let nodeEl = super.render(el);
		this.rendered = translate(this.text);
		nodeEl.textContent = this.rendered;
		onLocaleUpdate(this.text, this._handleChange);
		return nodeEl;
	}

	unrender() {
		offLocaleUpdate(this.text, this._handleChange);
		anim.stop(this.animId);
		super.unrender();
		this.rendered = null;
	}

	_handleChange() {
		let el = super.getElement();
		if (!el) {
			return;
		}

		anim.stop(this.animId);

		let next = translate(this.text);
		if (this.rendered === next) {
			this.animId = anim.fade(el, 1);
			return;
		}

		this.animId = anim.fade(el, 0, {
			callback: () => {
				let el = super.getElement();
				if (!el) {
					return;
				}

				this.rendered = next;
				el.textContent = next;
				this.animId = anim.fade(el, 1);
			}
		});
	}
}

export default Txt;
