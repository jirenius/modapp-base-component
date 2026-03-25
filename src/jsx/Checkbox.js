import BaseCheckbox from '../Checkbox.js';
import mapJsxProps from '../mapJsxProps.js';
import { assertNoChildren } from './helpers.js';

class Checkbox extends BaseCheckbox {

	static fromJSX(props) {
		props = Object.assign({}, props);

		assertNoChildren('Checkbox', props);

		return new Checkbox(!!props.checked, mapJsxProps(props, {
			omit: { checked: true },
		}));
	}
}

export default Checkbox;
