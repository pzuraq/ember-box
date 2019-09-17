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
