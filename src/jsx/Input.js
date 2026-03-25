import BaseInput from '../Input.js';
import mapJsxProps from '../mapJsxProps.js';
import { assertNoChildren, hasOwn } from './helpers.js';

class Input extends BaseInput {

	static fromJSX(props) {
		props = Object.assign({}, props);

		assertNoChildren('Input', props);

		return new Input(hasOwn(props, 'value') ? props.value : "", mapJsxProps(props, {
			omit: { value: true },
		}));
	}
}

export default Input;
