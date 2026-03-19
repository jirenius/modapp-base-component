import { setJsxNodeId } from './jsxChildren.js';
import { createStructuredElement } from './jsx/jsxObject.js';
import { hasOwn, isRenderableComponent } from './jsx/jsxShared.js';

const Fragment = { __modappFragment: true };

function getUnsupportedTypeError(type) {
	if (type === Fragment) {
		return new Error("JSX fragments are not supported.");
	}

	return new Error("JSX component tags must expose a static fromJSX(props) adapter.");
}

function getInvalidAdapterError(type) {
	let name = type && type.name
		? type.name
		: 'Component';
	return new Error(name + ".fromJSX(props) must return a component instance.");
}

function createJsxValue(type, props) {
	if (typeof type === 'string') {
		return createStructuredElement(type, props);
	}

	if (type !== Fragment) {
		if (!type || typeof type.fromJSX !== 'function') {
			throw getUnsupportedTypeError(type);
		}

		let component = type.fromJSX(props || {});
		if (!isRenderableComponent(component)) {
			throw getInvalidAdapterError(type);
		}

		if (hasOwn(props || {}, 'nodeId')) {
			setJsxNodeId(component, props.nodeId);
		}

		return component;
	}

	throw getUnsupportedTypeError(type);
}

function jsx(type, props) {
	return createJsxValue(type, props);
}

const jsxs = jsx;

export { Fragment, createStructuredElement, jsx, jsxs };
