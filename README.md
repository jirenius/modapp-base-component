[![view on npm](http://img.shields.io/npm/v/modapp-base-component.svg)](https://www.npmjs.org/package/modapp-base-component)

# ModApp Base Component
Collection of base components following the component interface of modapp.

## Installation

With npm:
```sh
npm install modapp-base-component
```

With yarn:
```sh
yarn add modapp-base-component
```

## Usage

Import any selected component and use it.

```javascript
import { Txt } from 'modapp-base-component';

let txt = new Txt("Hello World!");
txt.render(document.body);
```

### JSX with `Elem`

JSX can be used as authoring syntax for `Elem` node trees. JSX does not render anything by itself. It is compiled into the same plain node objects that `Elem` already accepts.

Install `babel/preset-react`:

```text
npm install --save-dev @babel/preset-react
```

Configure Babel with the automatic JSX runtime:

```json
{
  "presets": [
    ["@babel/preset-react", {
      "runtime": "automatic",
      "importSource": "modapp-base-component"
    }]
  ]
}
```

Lowercase tags create `Elem` node objects used with `new Elem(...)`:

```javascript
import { Elem, Txt } from 'modapp-base-component';

let elem = new Elem(
	<ul className="example">
		<li>First item</li>
		<li>{new Txt("Second item")}</li>
	</ul>
);

elem.render(document.body);
```

Capitalized tags can return components directly when the component exposes a static `fromJSX(props)` adapter:

```javascript
import { Txt } from 'modapp-base-component';

let txt = <Txt text="Hello World!" />;
txt.render(document.body);
```

Custom JSX component tags must expose a static `fromJSX(props)` method that returns a renderable component instance.

For `RootElem`-based components, reuse the same prop mapping as the lowercase JSX runtime through `mapJsxProps`:

```javascript
import { mapJsxProps } from 'modapp-base-component';

class MyTxt extends Txt {
	static fromJSX(props) {
		props = Object.assign({}, props);

		if (props.hasOwnProperty('children')) {
			throw new Error("MyTxt JSX does not support children.");
		}

		let text = props.hasOwnProperty('text')
			? props.text
			: "";

		return new MyTxt(text, mapJsxProps(props, {
			omit: { text: true },
			ignore: { tagName: true, duration: true }
		}));
	}
}
```

If ESLint is used, make sure to allow jsx in the eslint config:
```json
"parserOptions": {
  /*...*/
	"ecmaFeatures": {
	  "jsx": true
	}
},
```

Supported JSX in v1:

* Lowercase DOM tags such as `<div>` and `<ul>`
* Inline component instances in expressions, such as `{new Txt("Hello")}`
* Capitalized component tags that expose `fromJSX(props)`, such as `<Txt text="Hello" />`
* `nodeId` for `Elem` node lookup ids, while normal `id` stays a DOM attribute

Unsupported JSX in v1:

* Fragments such as `<>...</>`
* Child content for `Txt`, such as `<Txt>Hello</Txt>`
* Refs, keys, hooks, or reconciliation

`mapJsxProps` always treats `nodeId` as reserved and omits it from component option mapping. Use `omit` to drop adapter-specific props entirely and `ignore` to pass adapter-specific options through unchanged.

All components follows [modapp](https://github.com/jirenius/modapp)'s [component interface](#Component):

<a name="Component"></a>

## Component Interface
A UI component

**Kind**: global interface  

* [Component](#Component)
    * [.render(el)](#Component+render) ⇒ <code>HTMLElement</code> \| <code>DocumentFragment</code> \| <code>null</code>
    * [.unrender()](#Component+unrender)

<a name="Component+render"></a>

### component.render(el) ⇒ <code>HTMLElement</code> \| <code>DocumentFragment</code> \| <code>null</code>
Renders the component by appending its own element(s) to the provided parent element.<br>
The provided element is not required to be empty, and may therefor contain other child elements.<br>
The component is not required to append any element in case it has nothing to render.<br>
Render is never called two times in succession without a call to unrender in between.

**Kind**: instance method of [<code>Component</code>](#Component)  
**Returns**: <code>HTMLElement</code> \| <code>DocumentFragment</code> \| <code>null</code> - Element or document fragment appended to el. May be null or undefined if no elements was appended.

| Param | Type | Description |
| --- | --- | --- |
| el | <code>HTMLElement</code> \| <code>DocumentFragment</code> | Parent element in which to render the contents |

<a name="Component+unrender"></a>

### component.unrender()
Unrenders the component and removes its element(s) from the parent element.<br>
Only called after render and never called two times in succession without a call to render in between.

**Kind**: instance method of [<code>Component</code>](#Component)
