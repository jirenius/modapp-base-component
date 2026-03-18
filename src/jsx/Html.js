import BaseHtml from '../Html.js';
import mapJsxProps from '../mapJsxProps.js';
import { assertNoChildren } from './helpers.js';

class Html extends BaseHtml {

	static fromJSX(props) {
		props = Object.assign({}, props);

		assertNoChildren('Html', props);

		return new Html(props.html || "", mapJsxProps(props, {
			omit: { html: true },
			ignore: { tagName: true },
		}));
	}
}

export default Html;
