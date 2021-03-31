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
	 * @param {object} [opt.duration] Fade transition duration. Fade-in + fade-out will take twice this time. Defaults to 200.
	 */
	constructor(text, opt) {
		opt = Object.assign({ tagName: 'span' }, opt);
		super(opt.tagName, opt);

		this._text = text || "";
		this._animId = null;
		this._rendered = null;
		this._duration = opt.hasOwnProperty('duration') ? opt.duration : 200;

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

		if (this._text !== text) {
			let tmp = this._text;
			this._text = text;
			if (super.getElement()) {
				offLocaleUpdate(tmp);
				this._handleChange();
				onLocaleUpdate(this._text);
			}
		}

		return this;
	}

	/**
	 * Gets the current text.
	 * @returns {string|LocaleString} Current text
	 */
	getText() {
		return this._text;
	}

	render(el) {
		let nodeEl = super.render(el);
		this._rendered = translate(this._text);
		nodeEl.textContent = this._rendered;
		onLocaleUpdate(this._text, this._handleChange);
		return nodeEl;
	}

	unrender() {
		offLocaleUpdate(this._text, this._handleChange);
		anim.stop(this._animId);
		super.unrender();
		this._rendered = null;
	}

	_handleChange() {
		let el = super.getElement();
		if (!el) {
			return;
		}

		anim.stop(this._animId);

		let next = translate(this._text);
		if (this._rendered === next) {
			this._animId = anim.fade(el, 1, { duration: next.trim() ? this._duration : 0 });
			return;
		}

		this._animId = anim.fade(el, 0, {
			duration: this._rendered.trim() ? this._duration : 0,
			callback: () => {
				let el = super.getElement();
				if (!el) {
					return;
				}

				this._rendered = next;
				el.textContent = next;
				this._animId = anim.fade(el, 1, { duration: next.trim() ? this._duration : 0 });
			}
		});
	}
}

export default Txt;
