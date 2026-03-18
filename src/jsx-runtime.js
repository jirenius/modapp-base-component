import { isRenderableComponent, normalizeJsxChildren, setJsxNodeId } from './jsxChildren.js';
import mapJsxProps from './mapJsxProps.js';

const Fragment = { __modappFragment: true };

function hasOwn(obj, key) {
	return !!obj && Object.prototype.hasOwnProperty.call(obj, key);
}

function getUnsupportedTypeError(type) {
	if (type === Fragment) {
		return new Error("JSX fragments are not supported by modapp-base-component v1.");
	}

	return new Error("JSX component tags must expose a static fromJSX(props) adapter in modapp-base-component.");
}

function getInvalidAdapterError(type) {
	let name = type && type.name
		? type.name
		: 'Component';
	return new Error(name + ".fromJSX(props) must return a renderable component instance.");
}

function createNode(type, props) {
	if (typeof type !== 'string') {
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

	props = props || {};

	let node = { tagName: type };

	if (hasOwn(props, 'nodeId')) {
		node.id = props.nodeId;
	}

	Object.assign(node, mapJsxProps(props));

	let children = normalizeJsxChildren(props.children);
	if (children) {
		node.children = children;
	}

	return node;
}

function jsx(type, props) {
	return createNode(type, props);
}

const jsxs = jsx;

export { Fragment, jsx, jsxs };
