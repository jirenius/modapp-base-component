import BaseContext from '../Context.js';
import { getSingleJsxChild } from './helpers.js';

class Context extends BaseContext {

	static fromJSX(props) {
		props = Object.assign({}, props);

		if (Object.prototype.hasOwnProperty.call(props, 'componentFactory')) {
			throw new Error("Context JSX uses a render-prop child instead of componentFactory.");
		}

		let child = getSingleJsxChild('Context', props);
		if (typeof child !== 'function') {
			throw new Error("Context JSX requires a single render-prop child.");
		}

		return new Context(props.create, props.dispose, child);
	}
}

export default Context;
