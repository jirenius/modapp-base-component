import BaseElem from '../Elem.js';
import mapJsxProps from '../mapJsxProps.js';
import { normalizeJsxChildren } from '../jsxChildren.js';

class Elem extends BaseElem {

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

		let node = { tagName };
		if (Object.prototype.hasOwnProperty.call(elementProps, 'nodeId')) {
			node.id = elementProps.nodeId;
		}

		Object.assign(node, mapJsxProps(elementProps));

		let children = normalizeJsxChildren(elementProps.children);
		if (children) {
			node.children = children;
		}

		return new Elem(node);
	}
}

export default Elem;
