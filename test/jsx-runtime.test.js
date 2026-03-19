const assert = require('assert');
const runtime = require('../.test-lib/jsx/jsx-runtime.js');
const BaseElemModule = require('../.test-lib/Elem.js');
const BaseIndexModule = require('../.test-lib/index.js');
const BaseTxtModule = require('../.test-lib/Txt.js');
const jsxModule = require('../.test-lib/jsx/index.js');

const BaseElem = BaseElemModule.default || BaseElemModule;
const BaseTxt = BaseTxtModule.default || BaseTxtModule;
const Button = jsxModule.Button;
const Checkbox = jsxModule.Checkbox;
const Context = jsxModule.Context;
const Elem = jsxModule.Elem;
const JsxFragment = jsxModule.Fragment;
const Fragment = runtime.Fragment;
const Html = jsxModule.Html;
const Input = jsxModule.Input;
const Pair = jsxModule.Pair;
const jsx = runtime.jsx;
const jsxs = runtime.jsxs;
const mapJsxProps = jsxModule.mapJsxProps;
const Radio = jsxModule.Radio;
const Select = jsxModule.Select;
const Textarea = jsxModule.Textarea;
const Txt = jsxModule.Txt;
const Transition = jsxModule.Transition;

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
	let txt = new BaseTxt("Second item");
	let node = jsx('li', { children: txt });

	assert.strictEqual(node.children.length, 1);
	assert.strictEqual(node.children[0].component, txt);
});

test('keeps base exports free from JSX helpers', function() {
	assert.strictEqual(typeof BaseElem.fromJSX, 'undefined');
	assert.strictEqual(typeof BaseTxt.fromJSX, 'undefined');
	assert.strictEqual(typeof BaseIndexModule.mapJsxProps, 'undefined');
	assert.strictEqual(typeof BaseIndexModule.Button.fromJSX, 'undefined');
	assert.strictEqual(typeof BaseIndexModule.Checkbox.fromJSX, 'undefined');
});

test('returns Txt instances for JSX component tags', function() {
	let txt = jsx(Txt, { text: 'Hello' });

	assert.ok(txt instanceof Txt);
	assert.strictEqual(txt.getText(), 'Hello');
});

test('returns Button instances for JSX component tags', function() {
	/* eslint-disable no-unused-vars */
	let click = function(ctx, ev) {};
	/* eslint-enable no-unused-vars */
	let button = jsx(Button, {
		text: 'Save',
		onClick: click,
		as: 'a',
		className: 'action',
	});

	assert.ok(button instanceof Button);
	assert.strictEqual(button.txt.getText(), 'Save');
	assert.strictEqual(button.click, click);
	assert.strictEqual(button._rootElem.node.tagName, 'a');
	assert.strictEqual(button._rootElem.node.className, 'action');
});

test('returns Checkbox and Radio instances for JSX component tags', function() {
	let checkbox = jsx(Checkbox, { checked: true });
	let radio = jsx(Radio, { checked: false, attributes: { name: 'group' } });

	assert.ok(checkbox instanceof Checkbox);
	assert.strictEqual(checkbox.isChecked(), true);
	assert.ok(radio instanceof Radio);
	assert.strictEqual(radio.isChecked(), false);
	assert.strictEqual(radio._rootElem.node.attributes.name, 'group');
	assert.strictEqual(radio._rootElem.node.attributes.type, 'radio');
});

test('returns Input and Textarea instances for JSX component tags', function() {
	let input = jsx(Input, { value: 'alpha', className: 'field' });
	let textarea = jsx(Textarea, { value: 'beta' });

	assert.ok(input instanceof Input);
	assert.strictEqual(input.getValue(), 'alpha');
	assert.strictEqual(input._rootElem.node.className, 'field');
	assert.ok(textarea instanceof Textarea);
	assert.strictEqual(textarea.getValue(), 'beta');
});

test('returns Html instances for JSX component tags', function() {
	let html = jsx(Html, {
		html: '<b>Hello</b>',
		as: 'section',
		className: 'markup',
	});

	assert.ok(html instanceof Html);
	assert.strictEqual(html.html, '<b>Hello</b>');
	assert.strictEqual(html._rootElem.node.tagName, 'section');
	assert.strictEqual(html._rootElem.node.className, 'markup');
});

test('returns Select instances for JSX component tags', function() {
	let select = jsx(Select, {
		options: [ { value: 'a', text: 'Alpha' } ],
		optionFactory: option => new Txt(option.text),
		className: 'picker',
	});

	assert.ok(select instanceof Select);
	assert.strictEqual(select._rootElem.node.tagName, 'select');
	assert.strictEqual(select._rootElem.node.className, 'picker');
	assert.strictEqual(select._rootElem.node.children.length, 1);
	assert.ok(select._rootElem.node.children[0].component instanceof Txt);
	assert.strictEqual(select._rootElem.node.children[0].component.getText(), 'Alpha');
});

test('returns Fragment and Pair instances for JSX component tags', function() {
	let fragment = jsxs(JsxFragment, {
		children: [
			jsx(Txt, { text: 'First' }),
			jsx('span', { children: 'Second' }),
		],
	});
	let pair = jsxs(Pair, {
		children: [
			jsx(Txt, { text: 'Key' }),
			jsx('span', { children: 'Value' }),
		],
	});

	assert.ok(fragment instanceof JsxFragment);
	assert.strictEqual(fragment.getComponents().length, 2);
	assert.ok(fragment.getComponents()[0] instanceof Txt);
	assert.ok(fragment.getComponents()[1] instanceof Elem);
	assert.strictEqual(fragment.getComponents()[1].node.tagName, 'span');
	assert.ok(pair instanceof Pair);
	assert.ok(pair.getKeyComponent() instanceof Txt);
	assert.ok(pair.getValueComponent() instanceof Elem);
	assert.strictEqual(pair.getValueComponent().node.tagName, 'span');
});

test('returns Context instances for JSX component tags', function() {
	let create = function(self) { return { ok: true }; };
	let dispose = function(ctx, self) {};
	let factory = function(ctx, self) { return new Txt("Hello"); };
	let context = jsx(Context, {
		create,
		dispose,
		children: factory,
	});

	assert.ok(context instanceof Context);
	assert.strictEqual(context._create, create);
	assert.strictEqual(context._dispose, dispose);
	assert.strictEqual(context._factory, factory);
});

test('returns Transition instances for JSX component tags', function() {
	let transition = jsx(Transition, {
		className: 'slide',
		duration: 150,
		mode: 'flex',
	});

	assert.ok(transition instanceof Transition);
	assert.strictEqual(transition.opt.className, 'slide');
	assert.strictEqual(transition.opt.duration, 150);
	assert.strictEqual(transition.opt.mode, 'flex');
});

test('returns Elem instances for JSX Elem tags', function() {
	let elem = jsx(Elem, {
		as: 'section',
		children: jsx('span', { children: 'Hello' }),
	});

	assert.ok(elem instanceof Elem);
	assert.strictEqual(elem.node.tagName, 'section');
	assert.strictEqual(elem.node.children[0].tagName, 'span');
	assert.strictEqual(elem.node.children[0].children[0].text, 'Hello');
});

test('wraps JSX component roots inside Elem tags', function() {
	let elem = jsx(Elem, {
		as: 'section',
		children: jsx(Txt, { text: 'Hello' }),
	});

	assert.ok(elem instanceof Elem);
	assert.strictEqual(elem.node.tagName, 'section');
	assert.ok(elem.node.children[0].component instanceof Txt);
	assert.strictEqual(elem.node.children[0].component.getText(), 'Hello');
});

test('defaults Elem JSX to div and supports multiple children', function() {
	let elem = jsx(Elem, {
		children: [
			jsx('span', { children: 'One' }),
			jsx('span', { children: 'Two' }),
		],
	});

	assert.ok(elem instanceof Elem);
	assert.strictEqual(elem.node.tagName, 'div');
	assert.strictEqual(elem.node.children.length, 2);
	assert.strictEqual(elem.node.children[0].tagName, 'span');
	assert.strictEqual(elem.node.children[1].tagName, 'span');
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

test('preserves nodeId for JSX component tags embedded in Elem trees', function() {
	let elem = new Elem(jsx('div', {
		children: jsx(Txt, {
			nodeId: 'mytext',
			text: 'Hello',
		}),
	}));

	let txt = elem.getNode('mytext');
	assert.ok(txt instanceof Txt);
	assert.strictEqual(txt.getText(), 'Hello');
});

test('preserves nodeId for JSX component roots inside Elem tags', function() {
	let elem = jsx(Elem, {
		as: 'div',
		children: jsx(Txt, {
			nodeId: 'mytext',
			text: 'Hello',
		}),
	});

	let txt = elem.getNode('mytext');
	assert.ok(txt instanceof Txt);
	assert.strictEqual(txt.getText(), 'Hello');
});

test('preserves nodeId for Elem JSX roots and omits as from root attributes', function() {
	let elem = jsx(Elem, {
		as: 'section',
		nodeId: 'root',
		id: 'dom-id',
	});

	let root = elem.getNode('root');
	assert.strictEqual(elem.node.tagName, 'section');
	assert.strictEqual(root, null);
	assert.strictEqual(elem.node.id, 'root');
	assert.strictEqual(elem.node.attributes.id, 'dom-id');
	assert.strictEqual(elem.node.attributes.as, undefined);
});

test('forwards Txt JSX props to Txt options', function() {
	/* eslint-disable no-unused-vars */
	let click = function(ctx, ev) {};
	/* eslint-enable no-unused-vars */
	let txt = jsx(Txt, {
		text: 'Hello',
		as: 'strong',
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
	assert.strictEqual(txt._rootElem.node.attributes.as, undefined);
});

test('supports as as an alias for tagName on JSX wrappers', function() {
	let txt = jsx(Txt, { as: 'h1', text: 'Hello' });
	let button = jsx(Button, { as: 'a', text: 'Go' });
	let html = jsx(Html, { as: 'article', html: '<b>Hi</b>' });

	assert.strictEqual(txt._rootElem.node.tagName, 'h1');
	assert.strictEqual(button._rootElem.node.tagName, 'a');
	assert.strictEqual(html._rootElem.node.tagName, 'article');
});

test('keeps explicit tagName precedence over as on JSX wrappers', function() {
	let txt = jsx(Txt, {
		as: 'h1',
		tagName: 'strong',
		text: 'Hello',
	});

	assert.strictEqual(txt._rootElem.node.tagName, 'strong');
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

test('rejects Elem JSX with non-string as values', function() {
	assert.throws(function() {
		jsx(Elem, {
			as: 7,
		});
	}, /Elem JSX as must be a string/);
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

test('rejects Button JSX children', function() {
	assert.throws(function() {
		jsx(Button, { text: 'Hello', children: 'Child' });
	}, /does not support children/);
});

test('rejects unsupported children on input-style JSX components', function() {
	assert.throws(function() {
		jsx(Checkbox, { children: 'Child' });
	}, /does not support children/);
	assert.throws(function() {
		jsx(Radio, { children: 'Child' });
	}, /does not support children/);
	assert.throws(function() {
		jsx(Input, { children: 'Child' });
	}, /does not support children/);
	assert.throws(function() {
		jsx(Textarea, { children: 'Child' });
	}, /does not support children/);
	assert.throws(function() {
		jsx(Html, { children: 'Child' });
	}, /does not support children/);
	assert.throws(function() {
		jsx(Select, { children: 'Child' });
	}, /does not support children/);
	assert.throws(function() {
		jsx(Transition, { children: 'Child' });
	}, /does not support children/);
});

test('rejects Pair JSX with wrong child counts', function() {
	assert.throws(function() {
		jsx(Pair, {});
	}, /requires exactly two children/);
	assert.throws(function() {
		jsxs(Pair, {
			children: [
				jsx(Txt, { text: 'One' }),
				jsx(Txt, { text: 'Two' }),
				jsx(Txt, { text: 'Three' }),
			],
		});
	}, /requires exactly two children/);
	assert.throws(function() {
		jsx(Pair, { keyComponent: new Txt("One"), valueComponent: new Txt("Two") });
	}, /uses exactly two children/);
});

test('rejects invalid Context JSX child shapes', function() {
	assert.throws(function() {
		jsx(Context, {});
	}, /requires exactly one child/);
	assert.throws(function() {
		jsx(Context, { children: jsx(Txt, { text: 'Hello' }) });
	}, /requires a single render-prop child/);
	assert.throws(function() {
		jsx(Context, { componentFactory: function() {} });
	}, /uses a render-prop child instead of componentFactory/);
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
