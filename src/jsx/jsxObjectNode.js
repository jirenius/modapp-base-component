import {
	hasOwn,
	isJsxComponentNode,
	isJsxElementObject,
	isJsxTextNode,
	isObjectRecord,
} from './jsxShared.js';

const reservedJsxProp = {
	attributes: true,
	children: true,
	className: true,
	events: true,
	nodeId: true,
	properties: true,
	style: true,
};

const propertyJsxProp = {
	checked: true,
	disabled: true,
	multiple: true,
	readOnly: true,
	selected: true,
	selectedIndex: true,
	tabIndex: true,
	value: true,
};

function cloneJsxBucket(value) {
	return isObjectRecord(value)
		? Object.assign({}, value)
		: null;
}

function getJsxClassName(props) {
	let className = props.className;
	if (Array.isArray(className)) {
		return className.join(' ').trim() || null;
	}

	return typeof className === 'string' && className.trim()
		? className
		: null;
}

function collectJsxAttributes(props) {
	let attributes = cloneJsxBucket(props.attributes);

	for (let key in props) {
		if (!hasOwn(props, key) || reservedJsxProp[key]) {
			continue;
		}

		let value = props[key];
		if (typeof value === 'undefined' || value === null) {
			continue;
		}

		if (key === 'htmlFor') {
			attributes = attributes || {};
			if (!hasOwn(attributes, 'for')) {
				attributes.for = value;
			}
			continue;
		}

		if (/^on[A-Z]/.test(key) || propertyJsxProp[key]) {
			continue;
		}

		if (typeof value === 'boolean') {
			if (value) {
				attributes = attributes || {};
				if (!hasOwn(attributes, key)) {
					attributes[key] = '';
				}
			}
			continue;
		}

		attributes = attributes || {};
		if (!hasOwn(attributes, key)) {
			attributes[key] = value;
		}
	}

	return attributes;
}

function collectJsxProperties(props) {
	let properties = cloneJsxBucket(props.properties);

	for (let key in props) {
		if (!hasOwn(props, key) || reservedJsxProp[key] || !propertyJsxProp[key]) {
			continue;
		}

		properties = properties || {};
		if (!hasOwn(properties, key)) {
			properties[key] = props[key];
		}
	}

	return properties;
}

function collectJsxStyle(props) {
	return cloneJsxBucket(props.style);
}

function collectJsxEvents(props) {
	let events = cloneJsxBucket(props.events);

	for (let key in props) {
		if (!hasOwn(props, key) || reservedJsxProp[key] || !/^on[A-Z]/.test(key)) {
			continue;
		}

		let eventName = key.slice(2).toLowerCase();
		let callback = props[key];
		if (typeof callback !== 'function') {
			continue;
		}

		events = events || {};
		if (!hasOwn(events, eventName)) {
			events[eventName] = callback;
		}
	}

	return events;
}

function prepareJsxNodeArray(children) {
	let l = children.length;
	let chs = new Array(l);
	for (let i = 0; i < l; i++) {
		chs[i] = prepareJsxNode(children[i]);
	}
	return chs;
}

function prepareJsxNode(node) {
	if (!node) {
		return node;
	}

	if (isJsxElementObject(node)) {
		let props = node.props || {};
		let c = { tagName: node.type };
		if (typeof props.nodeId === 'string') {
			c.id = props.nodeId;
		}

		let className = getJsxClassName(props);
		if (className) {
			c.className = className;
		}

		let attributes = collectJsxAttributes(props);
		if (attributes) {
			c.attributes = attributes;
		}

		let properties = collectJsxProperties(props);
		if (properties) {
			c.properties = properties;
		}

		let style = collectJsxStyle(props);
		if (style) {
			c.style = style;
		}

		let events = collectJsxEvents(props);
		if (events) {
			c.events = events;
		}

		if (Array.isArray(props.children) && props.children.length) {
			c.children = prepareJsxNodeArray(props.children);
		}

		return c;
	}

	if (isJsxTextNode(node)) {
		let c = { text: node.text };
		if (typeof node.nodeId === 'string') {
			c.id = node.nodeId;
		}
		return c;
	}

	if (isJsxComponentNode(node)) {
		let c = { component: node.component };
		if (typeof node.nodeId === 'string') {
			c.id = node.nodeId;
		}
		return c;
	}

	throw new Error("Invalid JSX element object.");
}

export { isJsxElementObject, prepareJsxNode };
