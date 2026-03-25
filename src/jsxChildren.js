const jsxNodeIdProp = '__jsxNodeId';

import { hasOwn, isJsxComponentNode, isJsxElementObject, isJsxTextNode, isRenderableComponent } from './jsx/jsxShared.js';

function wrapRenderableComponent(component) {
	let node = { component };
	if (hasOwn(component, jsxNodeIdProp)) {
		node.nodeId = component[jsxNodeIdProp];
	}
	return node;
}

function pushJsxChild(list, child) {
	if (child === null || typeof child === 'undefined' || typeof child === 'boolean') {
		return;
	}

	if (Array.isArray(child)) {
		for (let i = 0; i < child.length; i++) {
			pushJsxChild(list, child[i]);
		}
		return;
	}

	if (typeof child === 'string' || typeof child === 'number') {
		list.push({ text: String(child) });
		return;
	}

	if (isJsxElementObject(child) || isJsxTextNode(child) || isJsxComponentNode(child)) {
		list.push(child);
		return;
	}

	if (isRenderableComponent(child)) {
		list.push(wrapRenderableComponent(child));
		return;
	}

	throw new Error("Unsupported JSX child type.");
}

function normalizeJsxChildren(children) {
	let list = [];
	pushJsxChild(list, children);
	return list;
}

function setJsxNodeId(component, nodeId) {
	if (typeof nodeId === 'undefined') {
		return component;
	}

	Object.defineProperty(component, jsxNodeIdProp, {
		configurable: true,
		enumerable: false,
		value: nodeId,
		writable: true,
	});

	return component;
}

export { normalizeJsxChildren, setJsxNodeId };
