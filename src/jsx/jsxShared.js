function hasOwn(obj, key) {
	return !!obj && Object.prototype.hasOwnProperty.call(obj, key);
}

function isObjectRecord(value) {
	return !!value && typeof value === 'object' && !Array.isArray(value);
}

function isJsxElementObject(value) {
	return !!value &&
		typeof value === 'object' &&
		typeof value.type === 'string' &&
		isObjectRecord(value.props);
}

function isJsxTextNode(value) {
	return !!value &&
		typeof value === 'object' &&
		typeof value.text === 'string' &&
		!hasOwn(value, 'tagName') &&
		!hasOwn(value, 'component') &&
		!hasOwn(value, 'html');
}

function isRenderableComponent(value) {
	return !!value &&
		typeof value === 'object' &&
		typeof value.render === 'function' &&
		typeof value.unrender === 'function';
}

function isJsxComponentNode(value) {
	return !!value &&
		typeof value === 'object' &&
		isRenderableComponent(value.component);
}

export {
	hasOwn,
	isJsxComponentNode,
	isJsxElementObject,
	isJsxTextNode,
	isObjectRecord,
	isRenderableComponent,
};
