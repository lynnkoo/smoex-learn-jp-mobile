import { I18n } from '@ctrip/crn';
import Utils from './Utils';
class CarI18n {
}
CarI18n.getCurrentLocale = Utils.promisable(I18n.getCurrentLocale);
CarI18n.getCurrentCurrency = Utils.promisable(I18n.getCurrentCurrency);
export default CarI18n;
