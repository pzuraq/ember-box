import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | box', function(hooks) {
  setupRenderingTest(hooks);

  test('basic box works', async function(assert) {
    this.set('inputValue', '1234');

    await render(hbs`{{unwrap (box this.inputValue)}}`);

    assert.equal(this.element.textContent.trim(), '1234');
  });

  test('update works', async function(assert) {
    this.set('inputValue', '1234');

    await render(
      hbs`<button {{on "click" (fn (update (box this.inputValue)) 123)}}>Update</button>`
    );
    await click('button');

    assert.equal(this.inputValue, 123);
  });

  test('update works when passed a value directly', async function(assert) {
    this.set('inputValue', '1234');

    await render(
      hbs`<button {{on "click" (update (box this.inputValue) 123)}}>Update</button>`
    );
    await click('button');

    assert.equal(this.inputValue, 123);
  });

  test('unwrap works with box wrappers', async function(assert) {
    this.set('inputValue', '1234');

    // do nothing
    this.update = () => {};

    await render(hbs`{{unwrap (wrap (box this.inputValue) this.update)}}`);

    assert.equal(this.element.textContent.trim(), '1234');
  });

  test('update works with box wrappers', async function(assert) {
    this.set('inputValue', '1234');

    let called = false;

    // do nothing
    this.update = (value, _super) => {
      called = true;

      return _super(value);
    };

    await render(
      hbs`<button {{on "click" (update (wrap (box this.inputValue) this.update) 123)}}>Update</button>`
    );
    await click('button');

    assert.equal(called, true);
    assert.equal(this.inputValue, 123);
  });
});
