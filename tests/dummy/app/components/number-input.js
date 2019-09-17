import Component from '@glimmer/component';
import { action } from '@ember/object';
import { getBox } from 'ember-box';

export default class NumberInput extends Component {
  @action
  validate(value, next) {
    if (!isNaN(+value)) {
      next(value);
    } else {
      // reset to the original value
      next(getBox(this.args.value));
    }
  }
}
