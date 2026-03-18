import mapJsxProps from './mapJsxProps.js';

const Fragment = { __modappFragment: true };

function hasOwn(obj, key) {
	return !!obj && Object.prototype.hasOwnProperty.call(obj, key);
}

function isElemNode(value) {
	return !!value &&
		typeof value === 'object' &&
		(hasOwn(value, 'tagName') ||
			hasOwn(value, 'text') ||
			hasOwn(value, 'html') ||
			hasOwn(value, 'component'));
}

function isRenderableComponent(value) {
	return !!value &&
		typeof value === 'object' &&
		typeof value.render === 'function';
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

function pushChild(list, child) {
	if (child === null || typeof child === 'undefined' || typeof child === 'boolean') {
		return;
	}

	if (Array.isArray(child)) {
		for (let i = 0; i < child.length; i++) {
			pushChild(list, child[i]);
		}
		return;
	}

	if (typeof child === 'string' || typeof child === 'number') {
		list.push({ text: String(child) });
		return;
	}

	if (typeof child === 'function' || isElemNode(child)) {
		list.push(child);
		return;
	}

	if (isRenderableComponent(child)) {
		list.push({ component: child });
		return;
	}

	throw new Error("Unsupported JSX child type for modapp-base-component.");
}

function normalizeChildren(children) {
	let list = [];
	pushChild(list, children);
	return list.length
		? list
		: null;
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

		return component;
	}

	props = props || {};

	let node = { tagName: type };

	if (hasOwn(props, 'nodeId')) {
		node.id = props.nodeId;
	}

	Object.assign(node, mapJsxProps(props));

	let children = normalizeChildren(props.children);
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
