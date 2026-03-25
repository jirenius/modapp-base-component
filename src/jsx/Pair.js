import BasePair from '../Pair.js';
import { getTwoJsxChildren, hasOwn, toComponent } from './helpers.js';

class Pair extends BasePair {

	static fromJSX(props) {
		props = props || {};

		if (hasOwn(props, 'keyComponent') || hasOwn(props, 'valueComponent')) {
			throw new Error("Pair JSX uses exactly two children instead of keyComponent/valueComponent props.");
		}

		let children = getTwoJsxChildren('Pair', props);
		return new Pair(toComponent(children[0]), toComponent(children[1]));
	}
}

export default Pair;
