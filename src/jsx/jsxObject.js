import { hasOwn } from './jsxShared.js';
import { normalizeJsxChildren } from '../jsxChildren.js';

function normalizeProps(props) {
	let normalized = {};
	let source = props || {};

	for (let key in source) {
		if (!hasOwn(source, key) || key === 'key' || key === 'ref' || key === '__self' || key === '__source') {
			continue;
		}

		if (key === 'children') {
			continue;
		}

		if (key === 'class') {
			if (!hasOwn(source, 'className')) {
				normalized.className = source[key];
			}
			continue;
		}

		normalized[key] = source[key];
	}

	let children = normalizeJsxChildren(source.children);
	if (children.length) {
		normalized.children = children;
	}

	return normalized;
}

function createStructuredElement(type, props) {
	return {
		type,
		props: normalizeProps(props),
	};
}

export { createStructuredElement, normalizeProps };
