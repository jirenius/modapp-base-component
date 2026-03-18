import { Fragment, jsx, jsxs } from './jsx-runtime.js';

function jsxDEV(type, props) {
	return jsx(type, props);
}

export { Fragment, jsx, jsxs, jsxDEV };
