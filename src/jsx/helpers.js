import { normalizeJsxChildren } from '../jsxChildren.js';
import Elem from './Elem.js';

function hasOwn(obj, key) {
	return !!obj && Object.prototype.hasOwnProperty.call(obj, key);
}

function assertNoChildren(name, props) {
	if (hasOwn(props, 'children')) {
		throw new Error(name + " JSX does not support children.");
	}
}

function getJsxChildren(props) {
	return normalizeJsxChildren(props && props.children) || [];
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
