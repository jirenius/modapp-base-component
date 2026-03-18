const assert = require('assert');
const runtime = require('../.test-lib/jsx-runtime.js');
const indexModule = require('../.test-lib/index.js');
const TxtModule = require('../.test-lib/Txt.js');

const Fragment = runtime.Fragment;
const jsx = runtime.jsx;
const jsxs = runtime.jsxs;
const mapJsxProps = indexModule.mapJsxProps;
const Txt = TxtModule.default || TxtModule;

function test(name, callback) {
	try {
		callback();
		console.log('PASS', name);
	} catch (err) {
		console.error('FAIL', name);
		throw err;
	}
}

test('creates nested element nodes', function() {
	let node = jsxs('ul', {
		className: 'example',
		children: [
			jsx('li', { children: 'First item' }),
			jsx('li', { children: 'Second item' }),
		],
	});

	assert.strictEqual(node.tagName, 'ul');
	assert.strictEqual(node.className, 'example');
	assert.strictEqual(node.children.length, 2);
	assert.strictEqual(node.children[0].tagName, 'li');
	assert.strictEqual(node.children[0].children[0].text, 'First item');
	assert.strictEqual(node.children[1].children[0].text, 'Second item');
});

test('maps inline components to component nodes', function() {
	let txt = new Txt("Second item");
	let node = jsx('li', { children: txt });

	assert.strictEqual(node.children.length, 1);
	assert.strictEqual(node.children[0].component, txt);
});

test('returns Txt instances for JSX component tags', function() {
	let txt = jsx(Txt, { text: 'Hello' });

	assert.ok(txt instanceof Txt);
	assert.strictEqual(txt.getText(), 'Hello');
});

test('defaults Txt JSX text to empty string', function() {
	let txt = jsx(Txt, {});

	assert.ok(txt instanceof Txt);
	assert.strictEqual(txt.getText(), '');
});

test('embeds JSX component tag results into element child nodes', function() {
	let node = jsx('div', {
		children: jsx(Txt, { text: 'Hello' }),
	});

	assert.strictEqual(node.children.length, 1);
	assert.ok(node.children[0].component instanceof Txt);
	assert.strictEqual(node.children[0].component.getText(), 'Hello');
});

test('forwards Txt JSX props to Txt options', function() {
	/* eslint-disable no-unused-vars */
	let click = function(ctx, ev) {};
	/* eslint-enable no-unused-vars */
	let txt = jsx(Txt, {
		text: 'Hello',
		tagName: 'strong',
		className: 'greeting',
		attributes: { title: 'welcome' },
		events: { click },
		duration: 0,
	});

	assert.strictEqual(txt.getText(), 'Hello');
	assert.strictEqual(txt.getProperty('tagName'), undefined);
	assert.strictEqual(txt._rootElem.node.tagName, 'strong');
	assert.strictEqual(txt._rootElem.node.className, 'greeting');
	assert.deepStrictEqual(txt._rootElem.node.attributes, { title: 'welcome' });
	assert.strictEqual(txt._rootElem.node.events.click, click);
	assert.strictEqual(txt._duration, 0);
	assert.strictEqual(txt._rootElem.node.attributes.text, undefined);
});

test('exports shared mapJsxProps helper', function() {
	assert.strictEqual(typeof mapJsxProps, 'function');
});

test('keeps nodeId separate from DOM id', function() {
	let node = jsx('label', {
		nodeId: 'labelNode',
		id: 'dom-id',
		htmlFor: 'field-id',
	});

	assert.strictEqual(node.id, 'labelNode');
	assert.strictEqual(node.attributes.id, 'dom-id');
	assert.strictEqual(node.attributes.for, 'field-id');
});

test('maps properties, attributes, events, and style', function() {
	/* eslint-disable no-unused-vars */
	let click = function(ctx, ev) {};
	let explicitClick = function(ctx, ev) {};
	/* eslint-enable no-unused-vars */
	let node = jsx('input', {
		type: 'checkbox',
		value: 'alpha',
		checked: true,
		className: 'field',
		style: { display: 'none' },
		onClick: click,
		attributes: { type: 'radio', role: 'switch' },
		properties: { value: 'beta' },
		events: { click: explicitClick },
	});

	assert.strictEqual(node.className, 'field');
	assert.deepStrictEqual(node.style, { display: 'none' });
	assert.deepStrictEqual(node.attributes, { type: 'radio', role: 'switch' });
	assert.deepStrictEqual(node.properties, { value: 'beta', checked: true });
	assert.strictEqual(node.events.click, explicitClick);
});

test('mapJsxProps maps shared RootElem props', function() {
	/* eslint-disable no-unused-vars */
	let click = function(ctx, ev) {};
	let explicitClick = function(ctx, ev) {};
	/* eslint-enable no-unused-vars */
	let mapped = mapJsxProps({
		className: 'field',
		style: { display: 'none' },
		htmlFor: 'field-id',
		onClick: click,
		value: 'alpha',
		checked: true,
		attributes: { type: 'radio', role: 'switch' },
		properties: { value: 'beta' },
		events: { click: explicitClick },
		id: 'dom-id',
		nodeId: 'internal-id',
		children: 'ignored',
	});

	assert.strictEqual(mapped.className, 'field');
	assert.deepStrictEqual(mapped.style, { display: 'none' });
	assert.deepStrictEqual(mapped.attributes, {
		type: 'radio',
		role: 'switch',
		for: 'field-id',
		id: 'dom-id',
	});
	assert.deepStrictEqual(mapped.properties, { value: 'beta', checked: true });
	assert.strictEqual(mapped.events.click, explicitClick);
	assert.strictEqual(Object.prototype.hasOwnProperty.call(mapped, 'nodeId'), false);
	assert.strictEqual(Object.prototype.hasOwnProperty.call(mapped, 'children'), false);
});

test('mapJsxProps supports omit and ignore options', function() {
	let mapped = mapJsxProps({
		text: 'Hello',
		tagName: 'strong',
		duration: 0,
		className: 'greeting',
		nodeId: 'txt-node',
	}, {
		omit: { text: true },
		ignore: { tagName: true, duration: true },
	});

	assert.strictEqual(mapped.className, 'greeting');
	assert.strictEqual(mapped.tagName, 'strong');
	assert.strictEqual(mapped.duration, 0);
	assert.strictEqual(Object.prototype.hasOwnProperty.call(mapped, 'text'), false);
	assert.strictEqual(Object.prototype.hasOwnProperty.call(mapped, 'nodeId'), false);
});

test('flattens child arrays and ignores empty children', function() {
	let emNode = jsx('em', { children: 'done' });
	let node = jsxs('div', {
		children: [
			'start',
			null,
			false,
			[ 7, undefined, emNode ],
			true,
		],
	});

	assert.strictEqual(node.children.length, 3);
	assert.strictEqual(node.children[0].text, 'start');
	assert.strictEqual(node.children[1].text, '7');
	assert.strictEqual(node.children[2], emNode);
});

test('preserves builder functions as children', function() {
	let builder = function(n) { return n.text('from builder'); };
	let node = jsx('div', { children: builder });

	assert.strictEqual(node.children.length, 1);
	assert.strictEqual(node.children[0], builder);
});

test('rejects fragment syntax', function() {
	assert.throws(function() {
		jsx(Fragment, {});
	}, /fragments are not supported/);
});

test('rejects JSX component tags without fromJSX', function() {
	function PlainComponent() {}

	assert.throws(function() {
		jsx(PlainComponent, {});
	}, /must expose a static fromJSX/);
});

test('rejects Txt JSX children', function() {
	assert.throws(function() {
		jsx(Txt, { children: 'Hello' });
	}, /does not support children/);
});

test('omits nodeId from Txt JSX options', function() {
	let txt = jsx(Txt, {
		nodeId: 'txt-node',
		onClick: function(ctx, ev) {},
	});

	assert.strictEqual(Object.prototype.hasOwnProperty.call(txt._rootElem.node, 'id'), false);
	assert.strictEqual(typeof txt._rootElem.node.events.click, 'function');
});

test('rejects invalid fromJSX return values', function() {
	function InvalidComponent() {}
	InvalidComponent.fromJSX = function() {
		return { tagName: 'div' };
	};

	assert.throws(function() {
		jsx(InvalidComponent, {});
	}, /must return a renderable component instance/);
});
