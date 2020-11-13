/**
 * A component that renders an array of components without adding any wrapper,
 * similar to a document fragment.
 */
class Fragment {

	/**
	 * Creates an instance of Fragment
	 * @param {Array.<Component>} components Array of components.
	 */
	constructor(components) {
		this._components = components || [];
	}

	/**
	 * Gets the array of components.
	 * @returns {Array.<Component>} Array of componenets.
	 */
	getComponents() {
		return this._components;
	}

	render(el) {
		for (let c of this._components) {
			if (c && c.render) {
				c.render(el);
			}
		}
		// [TODO] Return a document fragment with all the rendered elements.
	}

	unrender() {
		for (let i = this._components.length; i >= 0; i--) {
			let c = this._components[i];
			if (c && c.unrender) {
				c.unrender();
			}
		}
	}
}

export default Fragment;
