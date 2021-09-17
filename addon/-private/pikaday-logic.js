import { tracked } from '@glimmer/tracking';
import { setOwner } from '@ember/application';
import { isEmpty } from '@ember/utils';
import { registerDestructor } from '@ember/destroyable';
import { bind, cancel, later, next } from '@ember/runloop';

const DEFAULT_FORMAT = 'DD.MM.YYYY';
const EXCLUDE_ARGS = [
  'bubbles',
  'minDate',
  'maxDate',
  'options',
  'onOpen',
  'onClose',
  'onSelect',
  'onDraw',
  'onSelection',
  'useUTC',
  'value',
];
const LOC_KEYS = [
  'previousMonth',
  'nextMonth',
  'months',
  'weekdays',
  'weekdaysShort'
];

export default class SharedPikaday {
  pikaday;
  #options = {};
  #bubbles = false;
  #cancelToken;
  #field;

  @tracked useUTC = false;

  constructor(owner, args) {
    setOwner(this, owner);

    this.updateOptions(args);

    this.pikaday = new Pikaday(this.#options);

    if (this.#field.disabled) {
      this.pikaday.hide();
    }

    const observeHidden = new MutationObserver(bind(this, () => {
      if (this.#field.disabled) {
        this.pikaday.hide();
      }
    }));

    observeHidden.observe(this.#field, { attributes: true });

    registerDestructor(this, () => {
      this.pikaday.destroy();
      cancel(this.#cancelToken);
      observeHidden.disconnect();
    });
  }

  get options() {
    return this.#options;
  }

  get date() {
    return this.pikaday.getDate();
  }

  updateOptions(args = {}) {
    this.useUTC = Boolean(args.useUTC);
    this.#options = this.processArgs(args);
    this.#field = args.field;
    this.#bubbles = Boolean(args.bubbles);

    this.#cancelToken = later(() => {
      // Do not set or update anything when the component is destroying.
      if (this.isDestroying || this.isDestroyed) {
        return;
      }

      this.setMinDate(args.minDate, args.value);
      this.setMaxDate(args.maxDate, args.value);
      this.setPikadayDate(args.value);
      this.pikaday.config(this.#options);
    });
  }

  defaultOptions() {
    return {
      onOpen: bind(this, this.onPikadayOpen),
      onClose: bind(this, this.onPikadayClose),
      onSelect: bind(this, this.onPikadaySelect),
      onDraw: bind(this, this.onPikadayRedraw),
      firstDay: 1,
      format: DEFAULT_FORMAT,
    };
  }

  processArgs(args = {}) {
    const options = Object.assign(
      Object.create(null),
      this.defaultOptions(),
      this.#options,
      args.options || {},
      Object.entries(args).reduce((opts, [k, v]) => {
        if (k === 'yearRange') {
          opts.yearRange = determineYearRange(v);
        } else if (k === 'i18n') {
          opts.i18n = toI18nHash(v);
        } else if (
          !EXCLUDE_ARGS.includes(k)
        ) {
          console.log(k)
          opts[k] = v;
        }
        return opts;
      }, Object.create(null)),
    );

    options.setDefaultDate = (
      typeof options.setDefaultDate !== 'boolean' &&
      options.defaultDate
    ) ? true : false;

    return options;
  }

  setPikadayDate(value) {
    if (!value) return;

    const parsedValue = new Date(value || this.#options.defaultDate);
    const date = this.useUTC
      ? new Date(
          parsedValue.getUTCFullYear(),
          parsedValue.getUTCMonth(),
          parsedValue.getUTCDate(),
          0
        )
      : parsedValue;
    this.pikaday.setDate(date, true);
  }

  setMinDate(minDate, currentDate) {
    const { pikaday } = this;

    if (!minDate) return pikaday.setMinDate(null);

    const _minDate = new Date(minDate.getTime());
    pikaday.setMinDate(_minDate);

    // If the current date is lower than minDate we set date to minDate
    next(() => {
      const startOfDay = new Date(_minDate);
      startOfDay.setHours(0, 0, 0, 0);
      if (currentDate && new Date(currentDate) < startOfDay) {
        pikaday.setDate(minDate);
      }
    });
  }

  setMaxDate(maxDate, currentDate) {
    const { pikaday } = this;

    if (!maxDate) return pikaday.setMaxDate(null);

    const _maxDate = new Date(maxDate.getTime());
    pikaday.setMaxDate(_maxDate);

    // If the current date is greater than maxDate we set date to maxDate
    next(() => {
      if (currentDate > maxDate) {
        pikaday.setDate(maxDate);
      }
    });
  }

  onPikadayOpen() {
    emitDOMEvent(this.#field, 'open', { bubbles: this.#bubbles });
  }

  onPikadayClose() {
    if (
      this.pikaday.getDate() === null ||
      isEmpty(this.#field.value)
    ) {
      emitDOMEvent(this.#field, 'selection', { detail: null, bubbles: this.#bubbles });
    }

    emitDOMEvent(this.#field, 'close', { bubbles: this.#bubbles });
  }

  onPikadaySelect() {
    let selectedDate = this.pikaday.getDate();

    if (this.useUTC) {
      selectedDate = new Date(
        Date.UTC(
          selectedDate.getUTCFullYear(),
          selectedDate.getUTCMonth(),
          selectedDate.getUTCDate()
        )
      );
    }

    emitDOMEvent(this.#field, 'selection', { detail: selectedDate, bubbles: this.#bubbles });
  }

  onPikadayRedraw() {
    emitDOMEvent(this.#field, 'draw', { bubbles: this.#bubbles });
  }
}

function emitDOMEvent(element, eventName, config = {}) {
  if (!element) return;

  const event = new CustomEvent(eventName, config);

  element.dispatchEvent(event);
}

function determineYearRange(yearRange) {
  if (!yearRange) return 10;

  if (yearRange.indexOf(',') > -1) {
    const yearArray = yearRange.split(',');

    if (yearArray[1] === 'currentYear') {
      yearArray[1] = new Date().getFullYear();
    }

    return yearArray;
  } else {
    return yearRange;
  }
}

function toI18nHash(i18n) {
  const hash = Object.create(null);
  const hasTranslator = typeof i18n.t === 'function';
  const keys = hasTranslator ? LOC_KEYS : Object.keys(i18n);

  for (const key of keys) {
    hash[key] = hasTranslator ? i18n.t(key) : i18n[key];
  }

  return hash;
}
