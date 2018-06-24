import RootElem from './RootElem';
import l10n from 'modapp-l10n';
import { anim } from 'modapp-utils';

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
	}

	/**
	 * Sets the html
	 * @param {string} html HTML string
	 * @returns {this}
	 */
	setHtml(html) {
		html = html || "";
		// [TODO] Do an l10n equal compare
		if (html === this.html) {
			return this;
		}

		this.html = html;
		let el = super.getElement();
		if (!el) {
			return this;
		}

		anim.stop(this.animId);

		if (this.rendered === this.html) {
			this.animId = anim.fade(el, 1);
			return this;
		}

		this.animId = anim.fade(el, 0, {
			callback: () => {
				let el = super.getElement();
				if (!el) {
					return;
				}

				this.rendered = this.html;
				el.innerHTML = l10n.t(this.html);
				this.animId = anim.fade(el, 1);
			}
		});

		return this;
	}

	render(el) {
		let nodeEl = super.render(el);
		nodeEl.innerHTML = l10n.t(this.html);
		return nodeEl;
	}

	unrender() {
		anim.stop(this.animId);
		super.unrender();
		this.rendered = null;
	}
}

export default Html;
