import BaseElem from '../Elem.js';
import { createStructuredElement } from '../jsx-runtime.js';
import { isJsxElementObject, prepareJsxNode } from './jsxObjectNode.js';

class Elem extends BaseElem {

	constructor(node) {
		super(isJsxElementObject(node)
			? prepareJsxNode(node)
			: node);
	}

	setJsxObject(jsxObject) {
		return this.setRootNode(prepareJsxNode(jsxObject));
	}

	static fromJSX(props) {
		props = props || {};

		let hasAs = Object.prototype.hasOwnProperty.call(props, 'as');
		let tagName = hasAs
			? props.as
			: 'div';

		if (typeof tagName !== 'string') {
			throw new Error("Elem JSX as must be a string.");
		}

		let elementProps = hasAs
			? Object.assign({}, props)
			: props;

		if (hasAs) {
			delete elementProps.as;
		}

		return new Elem(createStructuredElement(tagName, elementProps));
	}
}

export default Elem;
