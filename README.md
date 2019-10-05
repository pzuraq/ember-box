ember-box
==============================================================================

An experimental helper for better 2-way-binding:

```hbs
<Input @value={{box this.value}} />
```

Implementing `Input`:

```hbs
<input
  value={{unwrap @value}}
  {{on "input" this.onInput}}
>
```

```js
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { update } from 'ember-box';

export default class Input extends Component {
  @action
  onInput({ target: { value } }) {
    update(this.args.value, value);

    if (this.args.onInput) {
      this.args.onInput(value);
    }
  }
}
```

Compatibility
------------------------------------------------------------------------------

* Ember.js v2.18 or above
* Ember CLI v2.13 or above
* Node.js v8 or above


Installation
------------------------------------------------------------------------------

```
ember install ember-box
```


Usage
------------------------------------------------------------------------------

`ember-box` provides the following helpers:

* `{{box}}`
* `{{wrap}}`
* `{{unwrap}}`
* `{{update}}`

And their corresponding functions:

```js
import {
  box,
  wrap,
  unwrap,
  update
} from 'ember-box';
```

The main helper is the `box` helper, which receives a path and returns a Box,
which is a _reference_ to that value:

```hbs
{{box this.myValue}}
```

This box can be passed around, and the value it references can be accessed or
updated wherever it goes:

```js
import Component from '@glimmer/component';

export default class MyComponent extends Component {
  this.value = 123;
}
```
```hbs
{{#let (box this.value) as |value|}}
  <!-- This will output 123  -->
  {{unwrap value}}

  <!-- This will update the value to 456 when clicked -->
  <button {{on "click" (update value 456)}}>
    Update
  </button>
{{/let}}
```

You can also unwrap or update a value in JavaScript:

```js
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { unwrap, update } from 'ember-box';

export default class MyOtherComponent extends Component {
  get boxValue() {
    return unwrap(this.args.box);
  }

  @action
  updateBox(newValue) {
    update(this.args.box, newValue);
  }
}
```

> Note: The `update` function updates the box immediately, but the `{{update}}`
> helper returns a _callback_ that can be used to update the value later. This
> is because that is what is normally needed in a template.

`unwrap` and `update` can also both receive plain JS values. `unwrap` will
return the value, and `update` will no-op. This allows you to write components
that can optionally receive Boxes:

```hbs
<!-- this.value will update when the component updates it internally -->
<Input @value={{box this.value}} />

<!-- this.value will not update, but the component can still read its value -->
<Input @value={{this.value}} />
```

You can also create Boxes in `js` by providing a context and path, or by
providing a context and path directly to the helper:

```js
box(this, 'myValue');
```
```hbs
{{box this "myValue"}}
```

### Wrapping Boxes

Sometimes, you may want to intercept an update to a Box, either to do some other
action when the value changes (a side-effect) or to process the value. You can
wrap boxes to do this with `wrap` and `{{wrap}}`:

```hbs
<Input @value={{wrap (box this.value) this.doSomething}} />
```
```js
export default class MyComponent extends Component {
  @action
  doSomething(newValue, _super) {
    // do things

    _super(newValue);
  }
}
```

The wrapper callback receives the new value, and the super setter, which should
be called if you want to set the value on the box. `wrap` can be used to wrap
boxes repeatedly, and `unwrap` will recursively unwrap all of them. Also, like
with `unwrap` and `update`, `wrap` can be used with non-Box values to observe
their _attempted_ changes:

```hbs
<!-- this.value won't update, but `this.doSomething` will fire when it would have -->
<Input @value={{wrap this.value this.doSomething}} />
```

Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
