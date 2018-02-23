import RootElem from './RootElem';
import l10n from 'modapp-l10n';
import * as anim from 'modapp-utils/anim.js';
import * as obj from 'modapp-utils/obj.js';

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
		opt = obj.copy(opt, {
			tagName: { type: 'string', default: 'span' },
			className: { type: '?string' },
			attributes: { type: '?object' },
			events: { type: '?object' }
		});

		super(opt.tagName, opt);

		this.text = text || "";
		this.animId = null;
		this.rendered = null;
	}

	/**
	 * Sets the display text
	 * @param {string|LocaleString} text Display text
	 * @returns {this}
	 */
	setText(text) {
		text = text || "";
		// [TODO] Do an l10n equal compare
		if (text === this.text) {
			return this;
		}

		this.text = text;
		let el = super.getElement();
		if (!el) {
			return this;
		}

		anim.stop(this.animId);

		if (this.rendered === this.text) {
			this.animId = anim.fade(el, 1);
			return this;
		}

		this.animId = anim.fade(el, 0, {
			callback: () => {
				let el = super.getElement();
				if (!el) {
					return;
				}

				this.rendered = this.text;
				el.textContent = l10n.t(this.text);
				this.animId = anim.fade(el, 1);
			}
		});

		return this;
	}

	render(el) {
		let nodeEl = super.render(el);
		nodeEl.textContent = l10n.t(this.text);
		return nodeEl;
	}

	unrender() {
		anim.stop(this.animId);
		super.unrender();
		this.rendered = null;
	}
}

export default Txt;