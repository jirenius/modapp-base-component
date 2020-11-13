/**
 * Element node object
 * @typedef {Object} Elem~element
 * @property {string} tagName Element tag name
 * @property {string} [className] Element class name
 * @property {object} [events] Element events as a key/value object
 * @property {object} [attributes] Element attributes as a key/value object
 * @property {string} [id] Node id used to access the node.
 * @property {Array.<Elem~node>} [children] Array of child nodes
 */

/**
 * Component node object
 * @typedef {Object} Elem~component
 * @property {App~component} component Component
 * @property {string} [id] Node id used to access the node.
 */

/**
 * Text node object
 * @typedef {Object} Elem~text
 * @property {string} text Text to be put in the node
 * @property {string} [id] Node id used to access the node.
 */

/**
 * HTML node object
 * @typedef {Object} Elem~html
 * @property {string} html HTML to be put in the node
 * @property {string} [id] Node id used to access the node.
 */


/**
 * Node object
 * @typedef {(Elem~element|Elem~text|Elem~component|Elem~html)} Elem~node
 */

/**
 * Node builder
 */
let n = {

	/**
	 * Renders an element node
	 * @param {string} [id] Id of node
	 * @param {string} tagName Tag name. Eg. 'div'.
	 * @param {object} [opt] Optional parameters
	 * @param {string} [opt.className] Class name
	 * @param {object} [opt.attributes] Key/value object with attributes.
	 * @param {object} [opt.properties] Key/value object with properties.
	 * @param {object} [opt.style] Key/value object with style properties.
	 * @param {object} [opt.events] Key/value object with events, where the key is the event name, and the value is the callback function.
	 * @param {Array.<Elem~node>} [children] Array of child nodes
	 * @returns {node}
	 */
	elem: function(id, tagName, opt, children) {
		if (typeof tagName === 'object' || typeof tagName === 'undefined') {
			children = opt;
			opt = tagName;
			tagName = id;
			id = null;
		}

		if (Array.isArray(opt)) {
			children = opt;
			opt = null;
		}

		let node = { tagName };
		if (id) {
			node.id = id;
		}

		if (opt) {
			if (opt.className) {
				node.className = opt.className;
			}
			if (opt.attributes) {
				node.attributes = opt.attributes;
			}
			if (opt.properties) {
				node.properties = opt.properties;
			}
			if (opt.style) {
				node.style = opt.style;
			}
			if (opt.events) {
				node.events = opt.events;
			}
		}

		if (children) {
			node.children = children;
		}

		return node;
	},
	text: function(id, text) {
		return typeof text === 'undefined'
			? { text: id }
			: { id, text };
	},
	html: function(id, html) {
		return typeof html === 'undefined'
			? { html: id }
			: { id, html };
	},
	component: function(id, component, opt) {
		if (typeof id !== 'string') {
			opt = component;
			component = id;
			id = null;
		}

		return id
			? { id, component }
			: { component };
	}
};

function prepareNodeArray(children) {
	let l = children.length;
	let chs = new Array(l);
	for (let i = 0; i < l; i++) {
		chs[i] = prepareNode(children[i]);
	}
	return chs;
}

function prepareNode(node) {
	if (!node) {
		return node;
	}

	if (typeof node === 'function') {
		return node(n);
	}

	let c = Object.assign({}, node);
	if (c.children) {
		c.children = prepareNodeArray(c.children);
	}
	return c;
}

/**
 * A element node component for rendering complex static node structures.
 */
class Elem {

	/**
	 * Creates a new Elem instance
	 * @param {Elem~node} node Root node
	 */
	constructor(node) {
		this.ctx = this;
		this.el = null;
		this.setRootNode(node);
	}

	/**
	 * Sets the root node.
	 * May not be called while rendered.
	 * @param {Elem~node} node Root node
	 * @returns {this}
	 */
	setRootNode(node) {
		if (this.el) {
			throw new Error("Call to setRootNode while rendered.");
		}

		this.node = prepareNode(node);

		this.idNode = {};
		if (this.node) {
			this._getNodeIds(this.node);
		}
		return this;
	}

	render(div) {
		if (this.el) {
			throw new Error("Already rendered");
		}

		return this.el = this._renderNode(div, this.node);
	}

	unrender() {
		if (!this.el) {
			return;
		}

		this._unrenderNode(this.node);

		if (this._getType(this.node) !== 'component') {
			this.el.parentNode.removeChild(this.el);
		}
		this.el = null;
	}

	/**
	 * Gets the root node element
	 * @returns {?App~component|Node} Component or null if not rendered.
	 */
	getElement() {
		return this.el;
	}

	/**
	 * Gets a node by its id
	 * @param {string} id Id of the component
	 * @returns {App~component|?Node} Component or rendered node. Returns null if not rendered.
	 */
	getNode(id) {
		return this._getNode(id).el;
	}

	/**
	 * Sets the event context to pass as the first argument in all event callbacks.
	 * @param {*} ctx Event context
	 * @returns {this}
	 */
	setContext(ctx) {
		this.ctx = ctx;
		return this;
	}

	/**
	 * Add className to the the root node
	 * @param {string} className Class name to add
	 * @returns {this}
	 */
	addClass(className) {
		return this._addClass(this.node, className);
	}

	/**
	 * Add className to a identifiable node
	 * @param {string} id Node id
	 * @param {string} className Class name to add
	 * @returns {this}
	 */
	addNodeClass(id, className) {
		return this._addClass(this._getNode(id), className);
	}

	_addClass(node, className) {
		this._validateIsTag(node);

		if (!node.className) {
			node.className = '';
		}

		className = className.trim();

		let classNames = node.className.trim().split(' ');

		if (classNames.includes(className)) {
			return this;
		}

		classNames.push(className);

		return this._setClassName(node, classNames.join(' ').trim());
	}

	/**
	 * Remove className from the the root node
	 * @param {string} className Class name to remove
	 * @returns {this}
	 */
	removeClass(className) {
		return this._removeClass(this.node, className);
	}

	/**
	 * Remove className from a identifiable node
	 * @param {string} id Node id
	 * @param {string} className Class name to remove
	 * @returns {this}
	 */
	removeNodeClass(id, className) {
		return this._removeClass(this._getNode(id), className);
	}

	_removeClass(node, className) {
		this._validateIsTag(node);

		if (!node.className) {
			node.className = '';
		}

		className = className.trim();

		let classNames = node.className.split(' ');
		let classIndex = classNames.indexOf(className);

		if (classIndex === -1) {
			return this;
		}

		classNames.splice(classIndex, 1);

		return this._setClassName(node, classNames.join(' ').trim());
	}

	/**
	 * Check if the root node contains className
	 * @param {string} className Class name to look for
	 * @returns {boolean}
	 */
	hasClass(className) {
		return this._hasClass(this.node, className);
	}

	/**
	 * Check if the identifiable node contains className
	 * @param {string} id Node id
	 * @param {string} className Class name to look for
	 * @returns {boolean}
	 */
	hasNodeClass(id, className) {
		return this._hasClass(this._getNode(id), className);
	}

	_hasClass(node, className) {
		this._validateIsTag(node);
		if (!node.className) return false;

		return node.className.split(' ').indexOf(className.trim()) > -1;
	}

	/**
	 * Set className on the root node
	 * @param {?string} className Class name
	 * @returns {this}
	 */
	setClassName(className) {
		return this._setClassName(this.node, className);
	}

	/**
	 * Set className on a identifiable node
	 * @param {string} id Node id
	 * @param {?string} className Class name
	 * @returns {this}
	 */
	setNodeClassName(id, className) {
		return this._setClassName(this._getNode(id), className);
	}

	_setClassName(node, className) {
		this._validateIsTag(node);

		className = className || null;
		if (node.className !== className) {
			node.className = className;
			if (node.el) {
				if (className) {
					node.el.className = className;
				} else {
					node.el.removeAttribute('class');
				}
			}
		}

		return this;
	}

	setAttribute(name, value) {
		return this._setAttribute(this.node, name, value);
	}

	setNodeAttribute(id, name, value) {
		return this._setAttribute(this._getNode(id), name, value);
	}

	_setAttribute(node, name, value) {
		this._validateIsTag(node);

		let attr = node.attributes;
		if (attr) {
			if (attr[name] === value) {
				return this;
			}
		} else {
			attr = {};
			node.attributes = attr;
		}

		attr[name] = value;

		if (node.el) {
			node.el.setAttribute(name, value);
		}

		return this;
	}

	removeAttribute(name) {
		return this._removeAttribute(this.node, name);
	}

	removeNodeAttribute(id, name) {
		return this._removeAttribute(this._getNode(id), name);
	}

	_removeAttribute(node, name) {
		this._validateIsTag(node);
		let attr = node.attributes;
		if (attr && attr.hasOwnProperty(name)) {
			delete attr[name];

			if (node.el) {
				node.el.removeAttribute(name);
			}
		}

		return this;
	}

	setProperty(name, value) {
		return this._setProperty(this.node, name, value);
	}

	setNodeProperty(id, name, value) {
		return this._setProperty(this._getNode(id), name, value);
	}

	_setProperty(node, name, value) {
		this._validateIsTag(node);

		let props = node.properties;
		if (!props) {
			props = {};
			node.properties = props;
		}

		if (node.el) {
			node.el[name] = value;
			props[name] = node.el[name];
		} else {
			props[name] = value;
		}

		return this;
	}

	getProperty(name) {
		return this._getProperty(this.node, name);
	}

	getNodeProperty(id, name) {
		return this._getProperty(this._getNode(id), name);
	}

	_getProperty(node, name) {
		this._validateIsTag(node);

		if (node.el) {
			return node.el[name];
		}

		return node.properties
			? node.properties[name]
			: undefined;
	}

	setStyle(name, value) {
		return this._setStyle(this.node, name, value);
	}

	setNodeStyle(id, name, value) {
		return this._setStyle(this._getNode(id), name, value);
	}

	_setStyle(node, name, value) {
		this._validateIsTag(node);

		let style = node.style;
		if (!style) {
			style = {};
			node.style = style;
		}

		if (node.el) {
			let es = node.el.style;
			es[name] = value;
			style[name] = es[name];
		} else {
			style[name] = value;
		}

		return this;
	}

	getStyle(name) {
		return this._getStyle(this.node, name);
	}

	getNodeStyle(id, name) {
		return this._getStyle(this._getNode(id), name);
	}

	_getStyle(node, name) {
		this._validateIsTag(node);

		if (node.el) {
			return node.el.style[name];
		}

		return node.style
			? node.style[name]
			: undefined;
	}

	setDisabled(disabled) {
		return this.setProperty('disabled', disabled);
	}

	setNodeDisabled(id, disabled) {
		return this.setNodeProperty(this._getNode(id), 'disabled', disabled);
	}

	setEvent(event, callback) {
		return this._setEvent(this.node, event, callback);
	}

	removeEvent(event) {
		return this.setEvent(event);
	}

	setNodeEvent(id, event, callback) {
		return this._setEvent(this._getNode(id), event, callback);
	}

	removeNodeEvent(id, event) {
		return this.setNodeEvent(id, event);
	}

	_setEvent(node, event, callback) {
		this._validateIsTag(node);

		// Delete any previous event
		if (node.events) {
			if (node.events[event]) {
				if (node.el) {
					let oldcb = node.eventListeners[event];
					node.el.removeEventListener(event, oldcb);
					delete node.eventListeners[event];
				}
				if (!callback) {
					delete node.events[event];
					if (!Object.keys(node.events)) {
						delete node.events;
						delete node.eventListeners;
					}
				}
			}
		}

		if (!callback) {
			return;
		}

		node.events = node.events || {};
		node.events[event] = callback;

		// Add event listener if rendered
		if (node.el) {
			node.eventListeners = node.eventListeners || {};
			let cb = function(cb, ev) { cb(this.ctx, ev); }.bind(this, callback);
			el.addEventListener(event, cb);
			node.eventListeners[event] = cb;
		}
	}

	/**
	 * Sets or clears the node's child nodes.
	 * @param {string} id Node id
	 * @param {?App~component|Array.<App~component>} children Child component, or array of child components to set, or null to clear exisiting component. May be an elem builder function.
	 * @returns {this}
	 */
	setNodeChildren(id, children) {
		let node = this._getNode(id);
		this._validateIsTag(node);

		// Unrender the children if needed
		if (node.el && node.children) {
			for (var i = 0; i < node.children.length; i++) {
				this._unrenderNode(node.children[i]);
			}
		}
		if (!children) {
			delete node.children;
		} else {
			let c = prepareNodeArray(Array.isArray(children) ? children : [ children ]);
			node.children = c;
			if (node.el) {
				// Render the children
				for (let i = 0; i < c.length; i++) {
					this._renderNode(node.el, c[i]);
				}
			}
		}
		return this;
	}

	_validateIsTag(node) {
		if (this._getType(node) !== 'tag') {
			throw "Node must be of type element";
		}
	}

	_getNodeIds(node) {
		if (!node || typeof node !== 'object') {
			throw "Invalid Elem node";
		}

		let id = node.id;

		if (id) {
			if (typeof id !== 'string') {
				throw "Node id must be a string";
			}

			if (this.idNode.hasOwnProperty(id)) {
				throw "Node id " + id + " used multiple times";
			}

			// Set node to null (not rendered) as default
			this.idNode[id] = node;
		}

		node.el = null;

		switch (this._getType(node)) {
			case 'tag':
				if (!node.children) {
					break;
				}

				// Iterate over the children
				for (var i = 0; i < node.children.length; i++) {
					this._getNodeIds(node.children[i]);
				}

				break;

			case 'component':
				node.el = node.component;
				break;
		}

	}

	_getType(node) {
		if (node.hasOwnProperty('tagName')) {
			return 'tag';
		}

		if (node.hasOwnProperty('text')) {
			return 'text';
		}

		if (node.hasOwnProperty('html')) {
			return 'html';
		}

		if (node.hasOwnProperty('component')) {
			return 'component';
		}

		throw "Unknown node type";
	}

	_renderNode(div, node) {
		switch (this._getType(node)) {
			case 'tag':
				let el = document.createElement(node.tagName);

				if (node.attributes) {
					for (let key in node.attributes) {
						if (node.attributes.hasOwnProperty(key)) {
							el.setAttribute(key, node.attributes[key]);
						}
					}
				}

				let p = node.properties;
				if (p) {
					for (let key in p) {
						if (p.hasOwnProperty(key)) {
							el[key] = p[key];
						}
					}
				}

				let s = node.style;
				if (s) {
					for (let key in s) {
						if (s.hasOwnProperty(key)) {
							el.style[key] = s[key];
						}
					}
				}

				if (node.events) {
					node.eventListeners = {};
					for (let key in node.events) {
						let ecb = node.events[key];
						if (ecb && node.events.hasOwnProperty(key)) {
							let cb = function(cb, ev) { cb(this.ctx, ev); }.bind(this, ecb);
							el.addEventListener(key, cb);
							node.eventListeners[key] = cb;
						}
					}
				}

				if (node.className) {
					el.className = Array.isArray(node.className)
						? node.className.join(' ')
						: node.className;
				}

				node.el = el;
				div.appendChild(el);

				if (node.children) {
				// Render the children
					for (let i = 0; i < node.children.length; i++) {
						this._renderNode(el, node.children[i]);
					}
				}

				return el;

			case 'text':
				let txtNode = document.createTextNode(node.text);

				node.el = txtNode;
				div.appendChild(txtNode);

				return txtNode;

			case 'html':
				let r = document.createRange();
				r.selectNodeContents(div);
				let eo = r.endOffset;
				div.insertAdjacentHTML('beforeend', node.html);
				r.selectNodeContents(div);
				r.setStart(div, eo);
				return r.cloneContents();

			case 'component':
				return node.component
					? node.component.render(div)
					: null;
		}
	}

	_unrenderNode(node) {
		switch (this._getType(node)) {
			case 'tag':
				// Unlisten to events
				if (node.events) {
					for (let key in node.eventListeners) {
						node.el.removeEventListener(key, node.eventListeners[key]);
					}
					node.eventListeners = null;
				}

				// Store away properties
				let p = node.properties;
				if (p) {
					for (let key in p) {
						p[key] = node.el[key];
					}
				}

				// Store away className
				node.className = node.el.className;

				node.el = null;

				if (node.children) {
				// Unrender the children
					for (var i = 0; i < node.children.length; i++) {
						this._unrenderNode(node.children[i]);
					}
				}
				break;

			case 'text':
				node.el = null;
				break;

			case 'component':
				if (node.component) {
					node.component.unrender();
				}
				break;
		}
	}

	_getNode(id) {
		let node = this.idNode[id];
		if (!node) {
			throw new Error("Unknown node id: " + id);
		}
		return node;
	}
}

export default Elem;
