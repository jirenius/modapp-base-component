/**
 * A component wrapper that creates a context on render, which can be properly
 * disposed on unrender.
 */
class Context {

	/**
	 * Creates an instance of Context
	 * @param {function} ctxCreate Context create callback that should return the context object: function(this) -> ctx
	 * @param {function} ctxDispose Context dispose callback that gets the context object to dispose: function(ctx, this)
	 * @param {function} componentFactory Component factory callback that gets the context object and returns a component: function(ctx, this)
	 */
	constructor(ctxCreate, ctxDispose, componentFactory) {
		this._create = ctxCreate;
		this._dispose = ctxDispose;
		this._factory = componentFactory;
		this._ctx = null;
		this._component = null;
	}

	/**
	 * Gets the current context.
	 * @returns {?object} Current context or null if the Context isn't rendered.
	 */
	getContext() {
		return this._ctx;
	}

	/**
	 * Gets the currently rendered component.
	 * @returns {?Component} Current component or null if the component isn't rendered.
	 */
	getComponent() {
		return this._component;
	}

	render(el) {
		this._ctx = (this._create && this._create(this)) || {};
		this._component = (this._factory && this._factory(this._ctx, this)) || null;
		if (!this._component) {
			return null;
		}
		return this._component.render(el);
	}

	unrender() {
		if (this._ctx) {
			if (this._component) {
				this._component.unrender();
			}
			this._component = null;
			if (this._dispose) {
				this._dispose(this._ctx, this);
			}
			this._ctx = null;
		}
	}
}

export default Context;
