import BaseElem from '../Elem.js';
import { normalizeJsxChildren } from '../jsxChildren.js';

class Elem extends BaseElem {

	static fromJSX(props) {
		props = props || {};

		let list = normalizeJsxChildren(props.children) || [];

		if (list.length !== 1) {
			throw new Error("Elem JSX requires exactly one root child.");
		}

		return new Elem(list[0]);
	}
}

export default Elem;
