import Elem from './Elem';

/**
 * An Elem wrapper only exposing root methods.
 * Extended by other primivite components to expose an initial set of methods.
 */
class RootElem {

	/**
	 * Creates a new RootElem instance
	 * @param {string} tagName Tag name. Eg. 'div'.
	 * @param {object} [opt] Optional parameters
	 * @param {string} [opt.className] Class name
	 * @param {object} [opt.attributes] Key/value object with attributes.
	 * @param {object} [opt.events] Key/value object with events, where the key is the event name, and the value is the callback function.
	 * @param {Array.<Elem~node>} [children] Array of child nodes
	 */
	constructor(tagName, opt, children) {
		this._rootElem = new Elem(n => n.elem(tagName, opt, children));
		this._rootElem.setContext(this);
	}

	render(el) {
		return this._rootElem.render(el);
	}

	unrender() {
		this._rootElem.unrender();
	}

	getElement() {
		return this._rootElem.getElement();
	}

	setClassName(className) {
		this._rootElem.setClassName(className);
		return this;
	}

	setAttribute(name, value) {
		this._rootElem.setAttribute(name, value);
		return this;
	}

	removeAttribute(name) {
		this._rootElem.removeAttribute(name);
		return this;
	}

	setProperty(name, value) {
		this._rootElem.setProperty(name, value);
		return this;
	}

	getProperty(name) {
		return this._rootElem.getProperty(name);
	}

	setDisabled(isDisabled) {
		this._rootElem.setDisabled(isDisabled);
		return this;
	}

	setEvent(name, callback) {
		this._rootElem.setEvent(name, callback);
		return this;
	}

	removeEvent(name) {
		this._rootElem.removeEvent(name);
		return this;
	}
}

export default RootElem;