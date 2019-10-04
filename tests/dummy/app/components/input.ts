import Component from '@glimmer/component';
import { action } from '@ember/object';
import { update, MaybeBox } from 'ember-box';

type Args = {
  value?: MaybeBox<any>;
  onInput?: (value: string) => void;
};

export default class Input extends Component<Args> {
  @action
  onInput({ target: { value } }: { target: { value: string } }) {
    update(this.args.value, value);

    if (this.args.onInput) {
      this.args.onInput(value);
    }
  }
}
