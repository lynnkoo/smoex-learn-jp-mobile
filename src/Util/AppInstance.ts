import moment from 'moment';
import Utils from './Utils';
import { AgeConfig } from '../Constants/Index';
import { getStore } from '../State/Store';
import * as LocationAndDateAction from '../State/LocationAndDate/Actions';
import * as AgeAction from '../State/Age/Actions';

const initializeLocationAndDateInfo = async (props) => {
  const { url } = props;
  const param = { landingUrl: url };
  console.log('测试+++param', param);
  // const res = await CarFetch.getRouterAdapter(param);
  // 测试
  const testRes = {
    rentalLocation: {
      pickUp: {
        cid: 347,
        cname: '洛杉矶',
        country: '美国',
        realcountry: '美国',
        area: {
          id: 'LAX',
          name: '洛杉矶国际机场',
          lat: 33.941589,
          lng: -118.40853,
          type: '1',
        },
      },
      dropOff: {
        cid: 347,
        cname: '洛杉矶',
        country: '美国',
        realcountry: '美国',
        area: {
          id: 'LAX',
          name: '洛杉矶国际机场',
          lat: 33.941589,
          lng: -118.40853,
          type: '1',
        },
      },
      isOneWay: false,
    },
    rentalDate: {
      pickUp: { dateTime: 20191127100000 },
      dropOff: { dateTime: 20191204100000 },
    },
  };
  const res = {
    params: JSON.stringify(testRes),
  };
  if (res && res.params) {
    const data = JSON.parse(res.params);
    const { rentalLocation, rentalDate } = data;
    if (rentalLocation) {
      getStore().dispatch(LocationAndDateAction.setLocationInfo(rentalLocation));
    }
    const pTime = (rentalDate && rentalDate.pickUp && rentalDate.pickUp.dateTime) || '';
    const rTime = (rentalDate && rentalDate.dropOff && rentalDate.dropOff.dateTime) || '';
    if (pTime.length === 14) {
      let p = moment(Utils.dateTimeFormat(pTime), moment.ISO_8601);
      let r = moment(Utils.dateTimeFormat(rTime), moment.ISO_8601);
      if (!p.isValid() || p < moment()) {
        p = moment()
          .startOf('hour')
          .add(7, 'd')
          .hours(10);
      }

      if (r <= p || !r.isValid()) {
        r = moment(p, moment.ISO_8601).add(7, 'd');
      }

      getStore().dispatch(LocationAndDateAction.setDateInfo({ pickup: p, dropoff: r }));
    }
  }
};

const initializeAge = (props) => {
  let { age } = props.urlQuery;
  if (age) {
    let curAge = age;
    age = Number(age);
    if (age < AgeConfig.MIN_AGE) {
      curAge = AgeConfig.MIN_AGE;
    } else if (age > AgeConfig.MAX_AGE) {
      curAge = AgeConfig.MAX_AGE;
    } else if (age >= AgeConfig.DEFAULT_AGE.min && age <= AgeConfig.DEFAULT_AGE.max) {
      curAge = AgeConfig.DEFAULT_AGE.val;
    }
    getStore().dispatch(AgeAction.setAge(curAge));
  }
};


class AppInstance {
  static init = async (props) => {
    initializeLocationAndDateInfo(props);
    initializeAge(props);
  }
}

export default AppInstance;
