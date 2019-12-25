// @ts-ignore
import { I18n } from '@ctrip/crn';
import Utils from './Utils';

class CarI18n {
  static getCurrentLocale = Utils.promisable(I18n.getCurrentLocale);

  static getCurrentCurrency = Utils.promisable(I18n.getCurrentCurrency);
}

export default CarI18n;
