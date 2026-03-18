const assert = require('assert');
const runtime = require('../.test-lib/jsx-runtime.js');
const TxtModule = require('../.test-lib/Txt.js');

const Fragment = runtime.Fragment;
const jsx = runtime.jsx;
const jsxs = runtime.jsxs;
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

test('rejects JSX component tags', function() {
	assert.throws(function() {
		jsx(Txt, { text: 'Hello' });
	}, /component tags are not supported/);
});
