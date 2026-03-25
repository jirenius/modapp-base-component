import BaseFragment from '../Fragment.js';
import { getJsxComponents } from './helpers.js';

class Fragment extends BaseFragment {

	static fromJSX(props) {
		return new Fragment(getJsxComponents(props));
	}
}

export default Fragment;
