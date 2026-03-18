import BaseButton from '../Button.js';
import mapJsxProps from '../mapJsxProps.js';
import { assertNoChildren } from './helpers.js';

class Button extends BaseButton {

	static fromJSX(props) {
		props = Object.assign({}, props);

		assertNoChildren('Button', props);

		let opt = mapJsxProps(props, {
			omit: { text: true, onClick: true },
			ignore: { tagName: true },
		});
		let click = props.onClick;

		if (opt.events && opt.events.click) {
			if (!click) {
				click = opt.events.click;
			}
			delete opt.events.click;
			if (!Object.keys(opt.events).length) {
				delete opt.events;
			}
		}

		return new Button(props.text || "", click, opt);
	}
}

export default Button;
