import EmberObject from '@ember/object';

const monthFormatter = new Intl.DateTimeFormat('default', { month: 'long' });
const weekdayFormatter = new Intl.DateTimeFormat('default', {
  weekday: 'long'
});
const shortWeekdayFormatter = new Intl.DateTimeFormat('default', {
  weekday: 'short'
});

export default {
  name: 'setup-pikaday-i18n',
  initialize() {
    const i18n = EmberObject.extend({
      previousMonth: 'Vorheriger Monat',
      nextMonth: 'Nächster Monat',
      months: Array(12)
        .fill()
        .map((val, i) => monthFormatter.format(new Date(null, i))),
      weekdays: Array(7)
        .fill()
        .map((val, i) => weekdayFormatter.format(new Date(null, null, i))),
      weekdaysShort: Array(7)
        .fill()
        .map((val, i) => shortWeekdayFormatter.format(new Date(null, null, i)))
    });

    const container = arguments[0];
    const application = arguments[1] || container;

    container.register('pikaday-i18n:main', i18n, { singleton: true });
    application.inject('component:pikaday-input', 'i18n', 'pikaday-i18n:main');
  }
};
