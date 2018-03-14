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
 * Node object
 * @typedef {(Elem~element|Elem~text|Elem~component)} Elem~node
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

/**
 * An element node
 */
class Elem {

	/**
	 * Creates a new Elem instance
	 * @param {Elem~node} node Root node
	 */
	constructor(node) {
		if (typeof node === 'function') {
			node = node(n);
		} else {
			node = this._cloneNode(node);
		}

		this.node = node;
		this.idNode = {};
		this.ctx = this;
		this.el = null;

		this._getNodeIds(node);
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

		// Remove any event listeners
		if (this.eventListeners) {
			for (let evl of this.eventListeners) {
				evl[0].removeEventListener(evl[1], evl[2]);
			}
			this.eventListeners = null;
		}

		this._unrenderNode(this.node);

		if (this._getType(this.node) !== 'component') {
			this.el.parentNode.removeChild(this.el);
		}
		this.el = null;
	}

	/**
	 * Gets the root node element
	 * @returns {?App~component|Node} Component or null if there is no component for the given id.
	 */
	getElement() {
		return this.el;
	}

	/**
	 * Gets a node by its id
	 * @param {string} id Id of the component
	 * @returns {App~component|?Node} Component or rendered node (null if not rendered)..
	 */
	getNode(id) {
		let node = this.idNode[id];
		if (typeof node === 'undefined') {
			throw "Unknown node id";
		}
		return node.el;
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
		return this._setClassName(this.getNode(id), className);
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
		return this._setAttribute(this.getNode(id), name, value);
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
			node.el.addAttribute(name, value);
		}

		return this;
	}

	removeAttribute(name) {
		return this._removeAttribute(this.node, name);
	}

	removeNodeAttribute(id, name) {
		return this._removeAttribute(this.getNode(id), name);
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
		return this._setProperty(this.getNode(id), name, value);
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
		return this._getProperty(this.getNode(id), name);
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

	setDisabled(disabled) {
		return this.setProperty('disabled', disabled);
	}

	setNodeDisabled(id, disabled) {
		return this.setNodeProperty(this.getNode(id), 'disabled', disabled);
	}

	setEvent(event, callback) {
		return this._setEvent(this.node, event, callback);
	}

	removeEvent(event) {
		return this.setEvent(event);
	}

	setNodeEvent(id, event, callback) {
		return this._setEvent(this.getNode(id), event, callback);
	}

	removeNodeEvent(id, event) {
		return this.setNodeEvent(id, event);
	}

	_setEvent(node, event, callback) {
		this._validateIsTag(node);

		let oldcb = node.events ? node.events[event] : null;

		// Remove any existing event listeners
		if (oldcb) {
			if (this.eventListeners) {
				node.el.removeEventListener(event, oldcb);
				this.eventListeners = this.eventListeners.filter(evl => evl[0] === node.el && evl[1] === event);
				delete node.events[event];
			}

			if (!callback) {
				delete node.events[event];
				if (!Object.keys(node.events)) {
					delete node.events;
				}
			}
		}

		if (!callback) {
			return;
		}

		node.events = node.events || {};
		node.events[event] = callback;

		if (node.el) {
			let cb = function(cb, ev) { cb(this.ctx, ev); }.bind(this, cb);
			node.el.addEventListener(event, cb);
			this.eventListeners.push([ node.el, event, cb ]);
		}
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

				if (node.properties) {
					for (let key in node.properties) {
						if (node.properties.hasOwnProperty(key)) {
							el[key] = node.properties[key];
						}
					}
				}

				if (node.events) {
					this.eventListeners = this.eventListeners || [];
					for (let key in node.events) {
						if (node.events.hasOwnProperty(key)) {
							let cb = function(cb, ev) { cb(this.ctx, ev); }.bind(this, node.events[key]);
							el.addEventListener(key, cb);
							this.eventListeners.push([ el, key, cb ]);
						}
					}
				}

				if (node.className) {
					el.className = Array.isArray(node.className)
						? node.className.join(' ')
						: node.className;
				}

				node.el = el;

				if (div) {
					div.appendChild(el);
				}

				if (node.children) {
				// Render the children
					for (var i = 0; i < node.children.length; i++) {
						this._renderNode(el, node.children[i]);
					}
				}

				return el;

			case 'text':
				var txtNode = document.createTextNode(node.text);

				node.el = txtNode;

				if (div) {
					div.appendChild(txtNode);
				}

				return txtNode;

			case 'component':
				return node.component
					? node.component.render(div)
					: null;
		}
	}

	_unrenderNode(node) {
		switch (this._getType(node)) {
			case 'tag':
				// Store away properties
				if (node.properties) {
					let props = node.properties;
					for (let key in props) {
						props[key] = node.el[key];
					}
				}
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

	_cloneNode(node) {
		if (!node) {
			return node;
		}

		let c = Object.assign({}, node);
		if (c.children) {
			let l = c.children.length;
			let chs = new Array(l);
			for (let i = 0; i < l; i++) {
				chs[i] = this._cloneNode(c.children[i]);
			}

			c.children = chs;
		}
	}
}

export default Elem;
