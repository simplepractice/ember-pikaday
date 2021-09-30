# ember-pikaday

[![Build Status](https://travis-ci.com/adopted-ember-addons/ember-pikaday.svg?branch=master)](https://travis-ci.com/adopted-ember-addons/ember-pikaday)
[![Ember Observer Score](https://emberobserver.com/badges/ember-pikaday.svg)](https://emberobserver.com/addons/ember-pikaday)
[![NPM](https://badgen.net/npm/v/ember-pikaday)](https://www.npmjs.com/package/ember-pikaday)

ember-pikaday is an addon that can be installed with Ember CLI. It gives you a datepicker input component that can be used in your Ember.js application.

**The component provided by ember-pikaday is fully acceptance tested. It also provides test helpers to interact with the datepicker in your own acceptance tests. It works in Ember 1.13.1+ or 2.0+, including beta and canary.**

## Installation
* Ember.js v3.12 or above
* Ember CLI v3.12 or above
* Node.js v12 or above

```bash
cd your-project-directory
ember install ember-pikaday
```

_This README is for the new 2.X release of ember-pikaday. You can find the [1.X README in the stable-1 branch](https://github.com/edgycircle/ember-pikaday/blob/stable-1/README.md)._

## Usage

While the input shows a formatted date to the user, the `value` argument can be any valid JavaScript date including `Date` object. If the application sets the argument without a user interaction the datepicker updates accordingly.

```handlebars
<label>
  Start date:
  <PikadayInput {{on "selection" this.doSomethingWithSelectedValue}} />
</label>
```

The `selection` event comes with the selected date set as the `detail` property of the event object.

You can also listen to other events to handle actions such as when the datepicker opens, closes, and draws.

```handlebars
<label>
  Start date:
  <PikadayInput
    {{on "open" this.doSomethingOnOpen}}
    {{on "close" this.doSomethingOnClose}}
    {{on "draw" this.doSomethingOnDraw}}
  />
</label>
```

Do note that, by default, events emitted from the datepicker do not bubble.  If you wish for them to bubble, you must pass the `@bubbles={{true}}` argument to the component.

It is also possible to the same via the following if your project doesn't support the `{{on}}` modifier:

```handlebars
<label>
  Start date:
  <PikadayInput
    @onOpen={{this.doSomethingOnOpen}}
    @onClose={{this.doSomethingOnClose}}
    @onDraw={{this.doSomethingOnDraw}}
  />
</label>
```

By default, Pikaday stringifies dates using the native `Date` API to parse and stringify dates.

If Moment.js is availabile in your project, you can specify a default format string from `DD.MM.YYYY` for the date input.

```handlebars
<label>
  Start date:
  <PikadayInput @format={{"MM/DD/YYYY"}} />
</label>
```

Alternatively, you can pass custom formatting and parsing functions.  These arguments are essentially aliases for Pikaday's `parse` and `toString` options.  This is useful if your project does not include Moment.  If Moment is present then these functions will still take precedence over it.

```handlebars
<label>
  Start date:
  <PikadayInput
    @format={{"MM/DD/YYYY"}}
    @parse={{this.parseDate}}
    @toString={{this.formatDate}}
  />
</label>
```

Here is an example of how one might compose these functions using the date-fns library.

```javascript
// app/controller/index.js
import Controller from '@ember/controller';
import { format, parse } from 'date-fns';

export default class IndexController extends Controller {
  parseDate(dateString, format) {
    return parseDate(dateString, format);
  }

  formatDate(date, format) {
    return format(date, format);
  }
}
```

You can define a theme which will be a CSS class that can be used as a hook for styling different themes.

```handlebars
<label>
  Start date:
  <PikadayInput @theme={{"dark-theme"}} />
</label>
```

You can change the `yearRange`. It defaults to 10. the `yearRange` can be a
single number or two comma separated years.

```handlebars
<label>
  Start date:
  <PikadayInput @yearRange={{"4"}} />
</label>
```

```handlebars
<label>
  Start date:
  <PikadayInput @yearRange={{"2004,2008"}} />
</label>
```

If the second year of the comma separated years is set to `currentYear`, it sets
the maximum selectable year to the current year.

```handlebars
<label>
  Start date:
  <PikadayInput @yearRange={{"2004,currentYear"}} />
</label>
```

The `readonly` attribute is supported so you can make the input readonly for mobile or other usecases.

```handlebars
<label>
  Start date:
  <PikadayInput readonly={{"readonly"}} />
</label>
```

The `placeholder` attribute is supported so you can improve the user experience of your interface.

```handlebars
<label>
  Due date:
  <PikadayInput placeholder={{"Due date of invoice"}} />
</label>
```

The `disabled` attribute is supported so you can disabled the datepicker entirely.
If the datepicker is shown to the user and it gets disabled it will close the datepicker itself.

```handlebars
<label>
  Due date:
  <PikadayInput disabled={{isDisabled}} />
</label>
```

The `firstDay` argument is supported so you can set the first day of the calendar week.
Defaults to Monday.

- 0 = Sunday
- 1 = Monday
- etc...

```handlebars
<label>
  Due date:
  <PikadayInput @firstDay={{0}} />
</label>
```

The `minDate` argument is supported so you can set the earliest date that can be selected.

```handlebars
<label>
  Due Date:
  <PikadayInput @minDate={{minDate}} />
</label>
```

The `maxDate` aargument is supported so you can set the latest date that can be selected.

```handlebars
<label>
  Due Date:
  <PikadayInput @maxDate={{maxDate}} />
</label>
```

## Return dates in UTC time zone

The date returned by ember-pikaday is in your local time zone due to the JavaScript default behaviour of `new Date()`. This can lead to problems when your application converts the date to UTC. In additive time zones (e.g. +0010) the resulting converted date could be yesterdays date. You can force the component to return a date with the UTC time zone by passing `useUTC=true` to it.

```handlebars
<label>
  Start date:
  <PikadayInput @useUTC={{true}} />
</label>
```

ember-pikaday will not automatically convert the date to UTC if your application is setting the datepicker value directly!

## Using pikaday specific options

You can pass any custom pikaday option through the component like this

```handlebars
<label>
  <PikadayInput @options={{hash numberOfMonths=2 disableWeekends=true disableDayFn=(this.someAction)}} />
</label>
```

Please refer to [pikaday configuration](https://github.com/dbushell/Pikaday#configuration)

## Inputless pikaday

If you don't want to show an input field, you can use the `pikaday-inputless` component instead of `pikaday-input`. It has the same API, but doesn't support `onOpen` and `onClose`. When `disabled=true` on a `pikaday-inputless`, the datepicker gets hidden.

## Localization

Localization of datepicker output (the formatted string visible in the input field) can be handled by Moment.js or the formatter/parser functions you pass in to the datepicker.

To localize the datepicker itself (the popup you see after clicking the input), a little more work is necessary.  By default, it will rely on the native `Intl.DateTimeFormat` construct to derive things like the names of months, weekdays, and so forth from the locale of the browser.  You may want to override this with your own localization scheme, and this will be necessary for certain strings the browser won't be able to localize itself.

The most straight-forward way to accomplish this is to pass an `@i18n` argument to the datepicker with a hash value containing localized values.

```handlebars
<PikadayInput @i18n={{hash
  previousMonth="Vorheriger Monat"
  nextMonth="Nächster Monat"
  months=this.months
  weekdays=this.weekdays
  weekdaysShort=this.weekdaysShort
  }}
>
```

Alternatively, you can use a custom initializer to inject the i18n object into every datepicker instance so it doesn't need to be passed in every time.

The i18n object can also be any object that has a `t()` method, in which case it will use that method to request those localization keys.  This allows passing in an internationalization service such as [ember-intl](https://github.com/ember-intl/ember-intl) or [ember-i18n](https://github.com/jamesarosen/ember-i18n).

```js
// app/initializers/setup-pikaday-i18n.js

import moment from 'moment';

export default {
  name: 'setup-pikaday-i18n',
  initialize: function(application) {
    let i18n = {
      previousMonth: 'Vorheriger Monat',
      nextMonth: 'Nächster Monat',
      months: moment.localeData().months(),
      weekdays: moment.localeData().weekdays(),
      weekdaysShort: moment.localeData().weekdaysShort()
    };

    application.register('pikaday-i18n:main', i18n, { singleton: true });
    application.inject('component:pikaday-input', 'i18n', 'pikaday-i18n:main');
  }
};
```

## Examples

### Show `ember-pikaday` when clicking on a button:

```handlebars
<button {{on "click" this.togglePika}}>Show Pika</button>
{{#if showPika}}
    <PikadayInputless @value={{"2017-07-07"}} />
{{/if}}
```

```javascript
// app/controller/index.js
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class IndexController extends Controller {
  @tracked showPika = false;

  @action
  togglePika() {
    this.showPika = !this.showPika;
  }
}
```

### Show `ember-pikaday` when hovering over a div:

```handlebars
<div {{on "mouseenter" this.show}} {{on "mouseleave" this.hide}}>
  Hover me to pika
  {{#if this.showPika}}
    <PikadayInputless @value={{"2017-07-07"}} />
  {{/if}}
</div>
```

```js
// app/controller/index.js

import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class IndexController extends Controller {
  @tracked showPika = false;

  @action
  showPika() {
    this.showPika = true;
  }

  @action
  hidePika() {
    this.showPika = false;
  }
}
```

## Test Helpers

The test helpers provided by `ember-pikaday` allow you to interact with the datepicker in your integration and acceptance tests.

### Opening Pikaday

To open the datepicker use `click` from the `@ember/test-helpers` package:

```js
import { click } from '@ember/test-helpers';

await click('.my-pikaday-input');
```

### Closing Pikaday

Pikaday can be closed with the provided `close` helper:

```js
import { close as closePikaday } from 'ember-pikaday/test-support';

await closePikaday('.my-pikaday-input');
```

### Interacting with Pikaday

An `Interactor`, like a [page object](https://martinfowler.com/bliki/PageObject.html), provides helpers for getting and setting dates in a date picker:

```js
import { click } from '@ember/test-helpers';
import { Interactor as Pikaday } from 'ember-pikaday/test-support';

await click('#my-datepicker');
await Pikaday.selectDate(new Date(1989, 3, 28));
```

There are also methods available to check if a specific day, month or year is selected:

```js
await Interactor.selectDate(new Date(1989, 3, 28));

assert.equal(Interactor.selectedYear(), 1989);
assert.equal(Interactor.selectedMonth(), 3);
assert.equal(Interactor.selectedDay(), 28);
```

## Excluding assets

By default, ember-pikaday will load for you the needed pikaday assets.
If you need to use a custom version, you can now disable auto assests importing like this:

```js
// ember-cli-build.js
let app = new EmberApp(defaults, {
  emberPikaday: {
    excludePikadayAssets: true
  }
});
```

## Other Resources

- [Video introduction by EmberScreencasts](https://www.emberscreencasts.com/posts/56-ember-pikaday)
