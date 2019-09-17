ember-box
==============================================================================

An experimental helper for better 2-way-binding:

```hbs
<Input @value={{box this.value}} />
```

Implementing `Input`:

```hbs
<input
  value={{get-box @value}}
  {{on "input" this.onInput}}
>
```

```js
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { setBox } from 'ember-box';

export default class Input extends Component {
  @action
  onInput({ target: { value } }) {
    setBox(this.args.value, value);

    if (this.args.onInput) {
      this.args.onInput(value);
    }
  }
}
```

Composing `box` values:

```hbs
<!-- Number Input -->
<Input @value={{box @value set=this.validate}} />
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

[Longer description of how to use the addon in apps.]


Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
