import BaseTextarea from '../Textarea.js';
import mapJsxProps from '../mapJsxProps.js';
import { assertNoChildren, hasOwn } from './helpers.js';

class Textarea extends BaseTextarea {

	static fromJSX(props) {
		props = Object.assign({}, props);

		assertNoChildren('Textarea', props);

		return new Textarea(hasOwn(props, 'value') ? props.value : "", mapJsxProps(props, {
			omit: { value: true },
		}));
	}
}

export default Textarea;
