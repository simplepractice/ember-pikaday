import { isEmpty } from '@ember/utils';
import Component from '@glimmer/component';
import { getOwner } from '@ember/application';
import PikadayLogic from '../-private/pikaday-logic';
import { destroy, registerDestructor } from '@ember/destroyable';
import { action } from '@ember/object';

export default class PikadayInputComponent extends Component {
  i18n;
  #pikadayLogic;
  #field;

  constructor() {
    super(...arguments);

    registerDestructor(this, () => {
      if (this.#pikadayLogic ) destroy(this.#pikadayLogic);
    });
  }

  get pikaday() {
    return this.#pikadayLogic?.pikaday;
  }

  get _args() {
    const args = Object.entries({
      ...this.args,
      field: this.#field,
    }).reduce((args, [k, v]) => {
      if (typeof v !== 'undefined') {
        args[k] = v;
      }
      return args;
    }, Object.create(null));

    if (this.i18n && !args.i18n) {
      args.i18n = this.i18n;
    }

    return args;
  }

  @action
  setupInput(element) {
    this.#field = element;

    if (this._args.inputless) return;

    this.#pikadayLogic = new PikadayLogic(getOwner(this), this._args);
  }

  @action
  setupContainer(element) {
    const args = Object.assign(this._args, {
      bound: true,
      container: element
    });

    this.#pikadayLogic = new PikadayLogic(getOwner(this), args);
  }

  @action
  updateDatepicker() {
    this.#pikadayLogic.updateOptions(this._args);
  }

  @action
  onPikadayClose() {
    if (this.#pikadayLogic.date === null || isEmpty(this.args.value)) {
      this.#pikadayLogic.value = null;
      this.#pikadayLogic.onSelection = null;
    }
  }

  performCallback(callback, event = {}) {
    return callback?.(event.detail);
  }
}
