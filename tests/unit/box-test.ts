import { module, test } from 'qunit';
import { box, wrap, unwrap, update } from 'ember-box';

module('Unit | Box', () => {
  test('basic test', assert => {
    let obj = { value: 123 };

    let box1 = box<number>(obj, 'value');

    assert.equal(unwrap(box1), 123, 'box unwraps correctly');
    assert.equal(
      update(box1, 456),
      456,
      'box updates and returns value from setter'
    );
    assert.equal(obj.value, 456, 'value was updated');
    assert.equal(unwrap(box1), 456, 'box value is updated');
  });

  test('composition with root box', assert => {
    let obj = { value: 0 };

    let box1 = box<number>(obj, 'value');
    let box2 = wrap(box1, (newValue, _super) => _super(newValue + 1));
    let box3 = wrap(box2, (newValue, _super) => _super(newValue + 1));
    let box4 = wrap(box3, (_newValue, _super) => {});

    assert.equal(unwrap(box1), 0);
    assert.equal(unwrap(box2), 0);
    assert.equal(unwrap(box3), 0);
    assert.equal(unwrap(box4), 0);

    update(box1, 1);
    assert.equal(obj.value, 1, 'obj updated');
    assert.equal(unwrap(box1), 1, 'box is updated');

    update(box2, 1);
    assert.equal(obj.value, 2, 'obj updated');
    assert.equal(unwrap(box2), 2, 'box is updated');

    update(box3, 1);
    assert.equal(obj.value, 3, 'obj updated');
    assert.equal(unwrap(box3), 3, 'box is updated');

    update(box4, 999);
    assert.equal(obj.value, 3, 'obj did not update');
    assert.equal(unwrap(box4), 3, 'box is not updated');
  });

  test('composition with root non-box', assert => {
    let obj = { value: 0 };

    let box1 = wrap(obj.value, (newValue, _super) => _super(newValue + 1));
    let box2 = wrap(box1, (newValue, _super) => _super(newValue + 1));
    let box3 = wrap(box2, (_newValue, _super) => {});

    assert.equal(unwrap(box1), 0);
    assert.equal(unwrap(box2), 0);
    assert.equal(unwrap(box3), 0);

    update(box1, 1);
    assert.equal(obj.value, 0, 'obj updated');
    assert.equal(unwrap(box1), 0, 'box is unaffected');

    update(box2, 1);
    assert.equal(obj.value, 0, 'obj updated');
    assert.equal(unwrap(box2), 0, 'box is unaffected');

    update(box3, 1);
    assert.equal(obj.value, 0, 'obj updated');
    assert.equal(unwrap(box3), 0, 'box is unaffected');
  });

  test('unwrap works with non-box values', assert => {
    assert.equal(unwrap(123), 123);
  });

  test('update works with non-box values', assert => {
    assert.equal(update(123, 456), 456);
  });

  test('box throws on invalid input', assert => {
    assert.throws(
      // @ts-ignore
      () => box({}, 123),
      /Error: Assertion Failed: Must provide a context and path to base boxes. The context must be an object or class\/function and the path must be a string./
    );
    assert.throws(
      () => box(123, 'foo'),
      /Error: Assertion Failed: Must provide a context and path to base boxes. The context must be an object or class\/function and the path must be a string./
    );
  });

  test('box throws on invalid input', assert => {
    assert.throws(
      // @ts-ignore
      () => wrap({}, 123),
      /Error: Assertion Failed: If you are wrapping a box within another box, you must provide an update function. Otherwise, it is not necessary to wrap the box./
    );

    assert.throws(
      // @ts-ignore
      () => wrap(box({}, 'foo'), 'foo'),
      /Error: Assertion Failed: If you are wrapping a box within another box, you must provide an update function. Otherwise, it is not necessary to wrap the box./
    );

    assert.throws(
      // @ts-ignore
      () => wrap(wrap(box({}, 'foo'), () => {}), 'foo'),
      /Error: Assertion Failed: If you are wrapping a box within another box, you must provide an update function. Otherwise, it is not necessary to wrap the box./
    );
  });
});
