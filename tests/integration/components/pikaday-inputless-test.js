import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { Interactor } from 'ember-pikaday/test-support';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | pikaday-inputless', function(hooks) {
  setupRenderingTest(hooks);

  test('it has no input tag visible', async function(assert) {
    await render(hbs`
      <PikadayInputless/>
    `);

    assert.dom('input[type=hidden]').exists();
  });

  test('selecting a date should call a function', async function(assert) {
    const expectedDate = new Date(2013, 3, 28);
    const onSelection = () => assert.step('onSelection called');
    this.onSelection = onSelection;

    await render(hbs`
      <PikadayInputless @onSelection={{this.onSelection}}/>
    `);

    await click('input');
    await Interactor.selectDate(expectedDate);

    assert.verifySteps(['onSelection called']);
  });

  test('setting the value attribute should select the correct date', async function(assert) {
    this.value = new Date(2010, 7, 10);

    await render(hbs`
      <PikadayInputless @value={{this.value}}/>
    `);

    await click('input');

    assert.equal(Interactor.selectedYear(), 2010);
    assert.equal(Interactor.selectedMonth(), 7);
    assert.equal(Interactor.selectedDay(), 10);
  });

  test('using disabled hides the picker', async function(assert) {
    await render(hbs`
      <PikadayInputless disabled={{true}}/>
    `);

    assert
      .dom('.pika-single')
      .hasClass('is-hidden', 'should be closed before clicking');
  });
});
