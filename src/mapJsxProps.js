const reservedProp = {
	__self: true,
	__source: true,
	attributes: true,
	children: true,
	className: true,
	events: true,
	key: true,
	nodeId: true,
	properties: true,
	ref: true,
	style: true,
};

const propertyProp = {
	checked: true,
	disabled: true,
	multiple: true,
	readOnly: true,
	selected: true,
	selectedIndex: true,
	tabIndex: true,
	value: true,
};

function hasOwn(obj, key) {
	return !!obj && Object.prototype.hasOwnProperty.call(obj, key);
}

function cloneObject(obj) {
	if (!obj) {
		return null;
	}

	return Object.assign({}, obj);
}

function mapJsxProps(props, opt) {
	props = props || {};
	opt = opt || {};

	let omit = opt.omit || {};
	let ignore = opt.ignore || {};

	let mapped = {};
	let attributes = cloneObject(props.attributes);
	let properties = cloneObject(props.properties);
	let events = cloneObject(props.events);

	if (hasOwn(props, 'className') && !hasOwn(omit, 'className')) {
		mapped.className = props.className;
	}
	if (hasOwn(props, 'style') && !hasOwn(omit, 'style')) {
		mapped.style = props.style;
	}

	for (let key in props) {
		if (!hasOwn(props, key) || hasOwn(reservedProp, key) || hasOwn(omit, key)) {
			continue;
		}

		let value = props[key];
		if (typeof value === 'undefined') {
			continue;
		}

		if (hasOwn(ignore, key)) {
			mapped[key] = value;
			continue;
		}

		if (key === 'htmlFor') {
			if (!hasOwn(attributes, 'for')) {
				attributes = attributes || {};
				attributes.for = value;
			}
			continue;
		}

		if (/^on[A-Z]/.test(key)) {
			let eventName = key.slice(2).toLowerCase();
			if (!hasOwn(events, eventName)) {
				events = events || {};
				events[eventName] = value;
			}
			continue;
		}

		if (hasOwn(propertyProp, key)) {
			if (!hasOwn(properties, key)) {
				properties = properties || {};
				properties[key] = value;
			}
			continue;
		}

		if (!hasOwn(attributes, key)) {
			attributes = attributes || {};
			attributes[key] = value;
		}
	}

	if (attributes) {
		mapped.attributes = attributes;
	}
	if (properties) {
		mapped.properties = properties;
	}
	if (events) {
		mapped.events = events;
	}

	return mapped;
}

export default mapJsxProps;
