import Component from '@glimmer/component';
import { action } from '@ember/object';
import { unwrap, MaybeBox, Update } from 'ember-box';

type Args = {
  value: MaybeBox<number>;
};

export default class NumberInput extends Component<Args> {
  @action
  validate(value: any, _super: Update<number>) {
    if (!isNaN(+value)) {
      _super(+value);
    } else {
      // reset to the original value
      _super(unwrap(this.args.value));
    }
  }
}
