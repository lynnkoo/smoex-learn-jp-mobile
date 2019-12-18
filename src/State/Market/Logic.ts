import { createLogic } from 'redux-logic';
import _ from 'lodash';
import { loadMarketCompleted, loadMarketFailed } from './Actions';
import { LOAD, LOADING_TYPE, FROM_URL } from './Types';
import {
  getDefaultPageName, getPageName, getParams, checkParams,
} from './Helpers';
import { setDateInfo, setLocationInfo } from '../LocationAndDate/Actions';
import { setAge } from '../DriverAgeAndNumber/Actions';
import { AppContext, Utils } from '../../Util/Index';

// http://conf.ctripcorp.com/pages/viewpage.action?pageId=192826013

export const load = createLogic({
  type: LOAD,
  latest: true,
  // http://127.0.0.1:5388/index.ios.bundle?CRNModuleName=rn_car_app&initialPage=Market&CRNType=1&st=client&landingto=list&initialpage=Market&fromurl=comm&landingto=list&data=%7B%22rentalLocation%22%3A%7B%22pickUp%22%3A%7B%22cid%22%3A313%2C%22cname%22%3A%22SFO%22%2C%22country%22%3A%22American%22%2C%22realcountry%22%3A%22%22%2C%22area%22%3A%7B%22id%22%3A%22%22%2C%22name%22%3A%22%22%2C%22lat%22%3A0%2C%22lng%22%3A0%2C%22type%22%3A%22%22%7D%7D%2C%22dropOff%22%3A%7B%22cid%22%3A313%2C%22cname%22%3A%22SFO%22%2C%22country%22%3A%22American%22%2C%22realcountry%22%3A%22%22%2C%22area%22%3A%7B%22id%22%3A%22%22%2C%22name%22%3A%22%22%2C%22lat%22%3A0%2C%22lng%22%3A0%2C%22type%22%3A%22%22%7D%7D%2C%22isOneWay%22%3Atrue%7D%2C%22rentalDate%22%3A%7B%22pickUp%22%3A%7B%22dateTime%22%3A111%7D%2C%22dropOff%22%3A%7B%22dateTime%22%3A222%7D%7D%7D
  /* eslint-disable no-empty-pattern */
  async process({ }, dispatch, done) {
    const defaultPageName = getDefaultPageName();
    try {
      const {
        data, landingto, fromurl, st,
      } = AppContext.UrlQuery;
      const pageName = getPageName(landingto);
      let isLoadSuccess = false;

      if (st === LOADING_TYPE.SERVER) {
        // todo
      }

      if (st === LOADING_TYPE.CLIENT && fromurl === FROM_URL.COMM) {
        const params = getParams(data);
        if (checkParams(params)) {
          dispatch(setDateInfo({
            pickup: Utils.dateTimeFormat(_.get(params, 'rentalDate.pickUp.dateTime')),
            dropoff: Utils.dateTimeFormat(_.get(params, 'rentalDate.dropOff.dateTime')),
          }));
          dispatch(setLocationInfo({ ...params.rentalLocation }));
          dispatch(setAge({ age: params.age }));
          dispatch(loadMarketCompleted({ landingto: pageName }));
          isLoadSuccess = true;
        }
      }

      if (!isLoadSuccess) {
        dispatch(loadMarketFailed({ landingto: defaultPageName }));
      }
    } catch (err) {
      dispatch(loadMarketFailed({ err, landingto: defaultPageName }));
    }
    done();
  },
});

export default [load];
