import Elem from './Elem';
import l10n from 'modapp-l10n';
import * as anim from 'modapp-utils/anim.js';
import * as obj from 'modapp-utils/obj.js';

/**
 * A text component
 */
export default class {

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

		this.node = new Elem(n => n.elem(opt.tagName, opt));
		this.el = null;
		this.text = text || "";
		this.animId = null;
		this.rendered = null;
	}

	/**
	 * Sets the display text
	 * @param {string|LocaleString} text Display text
	 */
	setText(text) {
		text = text || "";
		if (text === this.text) {
			return this;
		}

		this.text = text;
		if (!this.el) {
			return this;
		}

		anim.stop(this.animId);

		if (this.rendered === this.text) {
			this.animId = anim.fade(this.el, 1);
			return this;
		}

		this.animId = anim.fade(this.el, 0, {
			callback: () => {
				if (!this.el) {
					return;
				}

				this.rendered = this.text;
				this.el.textContent = l10n.t(this.text);
				this.animId = anim.fade(this.el, 1);
			}
		});

		return this;
	}

	setClassName(className) {
		this.node.setClassName(className);
		return this;
	}

	setDisabled(isDisabled) {
		this.node.setDisabled(isDisabled);
		return this;
	}

	setAttribute(name, value) {
		this.node.setAttribute(name, value);
		return this;
	}

	removeAttribute(name) {
		this.node.removeAttribute(name);
		return this;
	}

	setEvent(name, callback) {
		this.node.setEvent(name, callback);
		return this;
	}

	removeEvent(name, callback) {
		this.node.removeEvent(name);
		return this;
	}

	render(el) {
		this.el = this.node.render(el);
		this.el.textContent = l10n.t(this.text);
		return this.el;
	}

	unrender() {
		anim.stop(this.animId);
		this.node.unrender();
		this.rendered = null;
		this.el = null;
	}
}