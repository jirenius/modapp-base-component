import BaseTransition from '../Transition.js';
import { assertNoChildren } from './helpers.js';

class Transition extends BaseTransition {

	static fromJSX(props) {
		props = Object.assign({}, props);

		assertNoChildren('Transition', props);

		delete props.children;
		delete props.nodeId;
		delete props.key;
		delete props.ref;
		delete props.__self;
		delete props.__source;

		return new Transition(props);
	}
}

export default Transition;
