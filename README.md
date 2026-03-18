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

Then create the renderable root with `new Elem(...)`:

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

Supported JSX in v1:

* Lowercase DOM tags such as `<div>` and `<ul>`
* Inline component instances in expressions, such as `{new Txt("Hello")}`
* `nodeId` for `Elem` node lookup ids, while normal `id` stays a DOM attribute

Unsupported JSX in v1:

* Capitalized component tags such as `<Txt />`
* Fragments such as `<>...</>`
* Refs, keys, hooks, or reconciliation

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
