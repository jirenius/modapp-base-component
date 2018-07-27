import { anim } from 'modapp-utils';
import RootElem from './RootElem';
import { translate, onLocaleUpdate, offLocaleUpdate } from './utils/l10n';

/**
 * A html component
 */
class Html extends RootElem {

	/**
	 * Creates an instance of Html
	 * @param {string|LocaleString} html HTML string
	 * @param {object} [opt] Optional parameters.
	 * @param {string} [opt.tagName] Tag name (eg. 'span') for the element. Defaults to 'div'.
	 * @param {string} [opt.className] Class name
	 * @param {object} [opt.attributes] Key/value attributes object
	 * @param {object} [opt.events] Key/value events object, where the key is the event name, and value is the callback.
	 */
	constructor(html, opt) {
		opt = Object.assign({ tagName: 'div' }, opt);
		super(opt.tagName, opt);

		this.html = html || "";
		this.animId = null;
		this.rendered = null;

		// Bind callbacks
		this._handleChange = this._handleChange.bind(this);
	}

	/**
	 * Sets the html
	 * @param {string} html HTML string
	 * @returns {this}
	 */
	setHtml(html) {
		html = html || "";

		this.html = html;
		this._handleChange();

		return this;
	}
	setHtml(html) {
		html = html || "";

		if (this.html !== html) {
			let tmp = this.html;
			this.html = html;
			if (super.getElement()) {
				offLocaleUpdate(tmp);
				this._handleChange();
				onLocaleUpdate(this.html);
			}
		}

		return this;
	}

	render(el) {
		let nodeEl = super.render(el);
		this.rendered = translate(this.html);
		nodeEl.innerHTML = this.rendered;
		onLocaleUpdate(this.html, this._handleChange);
		return nodeEl;
	}

	unrender() {
		offLocaleUpdate(this.html, this._handleChange);
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

		let next = translate(this.html);
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
				el.innerHTML = next;
				this.animId = anim.fade(el, 1);
			}
		});
	}
}

export default Html;
