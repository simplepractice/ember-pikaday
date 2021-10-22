/* eslint no-console: 0 */
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ApplicationController extends Controller {
  @tracked startDate = new Date();
  @tracked today = new Date();
  @tracked isMinDateSet = true;
  @tracked isMaxDateSet = true;

  @action
  clearStartDate() {
    this.startDate = null;
  }

  doSomethingWithSelectedValue(value) {
    console.log(value);
  }
}
