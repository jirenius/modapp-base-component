import BaseTxt from '../Txt.js';
import mapJsxProps from '../mapJsxProps.js';

class Txt extends BaseTxt {

	static fromJSX(props) {
		props = Object.assign({}, props);

		if (props.hasOwnProperty('children')) {
			throw new Error("Txt JSX does not support children. Use the text prop instead.");
		}

		return new Txt(props.text || "", mapJsxProps(props, {
			omit: { text: true },
			ignore: { tagName: true, duration: true },
		}));
	}
}

export default Txt;
