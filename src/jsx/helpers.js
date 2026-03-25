import { hasOwn, isJsxElementObject, isRenderableComponent } from './jsxShared.js';
import Elem from './Elem.js';

function assertNoChildren(name, props) {
	if (hasOwn(props, 'children')) {
		throw new Error(name + " JSX does not support children.");
	}
}

function isOldElemNode(value) {
	return !!value &&
		typeof value === 'object' &&
		(hasOwn(value, 'tagName') ||
			hasOwn(value, 'text') ||
			hasOwn(value, 'html') ||
			hasOwn(value, 'component'));
}

function wrapRenderableComponent(component) {
	return { component };
}

function pushJsxPropChild(list, child) {
	if (child === null || typeof child === 'undefined' || typeof child === 'boolean') {
		return;
	}

	if (Array.isArray(child)) {
		for (let i = 0; i < child.length; i++) {
			pushJsxPropChild(list, child[i]);
		}
		return;
	}

	if (typeof child === 'string' || typeof child === 'number' || typeof child === 'function') {
		list.push(child);
		return;
	}

	if (isOldElemNode(child) || isJsxElementObject(child)) {
		list.push(child);
		return;
	}

	if (isRenderableComponent(child)) {
		list.push(wrapRenderableComponent(child));
		return;
	}

	throw new Error("Unsupported JSX child type.");
}

function getJsxChildren(props) {
	let list = [];
	pushJsxPropChild(list, props && props.children);
	return list;
}

function getSingleJsxChild(name, props) {
	let children = getJsxChildren(props);
	if (children.length !== 1) {
		throw new Error(name + " JSX requires exactly one child.");
	}
	return children[0];
}

function getTwoJsxChildren(name, props) {
	let children = getJsxChildren(props);
	if (children.length !== 2) {
		throw new Error(name + " JSX requires exactly two children.");
	}
	return children;
}

function toComponent(child) {
	return child && typeof child === 'object' && hasOwn(child, 'component')
		? child.component
		: new Elem(child);
}

function getJsxComponents(props) {
	let children = getJsxChildren(props);
	let components = new Array(children.length);
	for (let i = 0; i < children.length; i++) {
		components[i] = toComponent(children[i]);
	}
	return components;
}

export { assertNoChildren, getJsxChildren, getSingleJsxChild, getTwoJsxChildren, getJsxComponents, hasOwn, toComponent };
