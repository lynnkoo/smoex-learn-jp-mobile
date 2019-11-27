const localeShim = (locale: string) => locale.replace(/-/g, '_');

const isLocale = (str: any) => str && (str.includes('-') || str.includes('_'));
const DEFAULT_LOCALE = 'en-US';

const format = (locale) => {
  if (!locale) return undefined;
  const newLocale = locale.replace(/_/g, '-');
  return newLocale
    .split('-')
    .map((value, index) => {
      if (index === 1) {
        return value.toUpperCase();
      }
      return value.toLowerCase();
    })
    .join('-');
};
class Locale {
  localeName: string;

  language: string;

  countryCode: string;

  constructor(locale) {
    let localeParam = locale;
    if (!isLocale(localeParam)) {
      localeParam = DEFAULT_LOCALE;
    }
    localeParam = localeShim(localeParam);
    this.localeName = localeParam;
    const [languageCode, countryCode] = localeParam.split('_');
    this.language = languageCode.toLowerCase();
    this.countryCode = countryCode.toUpperCase();
  }

  static format = format;

  getStandardLanguage() {
    return this.language;
  }

  getStandardRegion() {
    return this.countryCode;
  }

  formatLocale() {
    return format(this.localeName);
  }

  getSite() {
    const countryCode = this.countryCode.toLowerCase();
    return countryCode;
  }

  getLocale() {
    return this.localeName.toLowerCase();
  }

  getLanguage() {
    let curLanguage = this.language;
    switch (this.language) {
      case 'zh':
      case 'ja':
      case 'ko':
        curLanguage = this.countryCode;
        break;
      default:
        break;
    }
    return curLanguage.toUpperCase();
  }
}
export default Locale;
