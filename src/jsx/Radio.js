import BaseRadio from '../Radio.js';
import mapJsxProps from '../mapJsxProps.js';
import { assertNoChildren } from './helpers.js';

class Radio extends BaseRadio {

	static fromJSX(props) {
		props = Object.assign({}, props);

		assertNoChildren('Radio', props);

		return new Radio(!!props.checked, mapJsxProps(props, {
			omit: { checked: true },
		}));
	}
}

export default Radio;
