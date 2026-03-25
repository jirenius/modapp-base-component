import BaseSelect from '../Select.js';
import mapJsxProps from '../mapJsxProps.js';
import { assertNoChildren } from './helpers.js';

class Select extends BaseSelect {

	static fromJSX(props) {
		props = Object.assign({}, props);

		assertNoChildren('Select', props);

		return new Select(props.options || [], mapJsxProps(props, {
			omit: { options: true },
			ignore: { optionFactory: true },
		}));
	}
}

export default Select;
