var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createLogic } from 'redux-logic';
import moment from 'moment';
import { GET_LOCATION_DATE_INFO } from './Types';
import { setDateInfo, setLocationInfo } from './Actions';
import { Utils } from '../../Util/Index';
export const setCommonDateInfo = createLogic({
    type: GET_LOCATION_DATE_INFO,
    /* eslint-disable no-empty-pattern */
    process({}, dispatch, done) {
        return __awaiter(this, void 0, void 0, function* () {
            // const param = { landingUrl: AppContext.url };
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
                    dispatch(setLocationInfo(rentalLocation));
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
                    dispatch(setDateInfo({ pickup: p, dropoff: r }));
                }
            }
            done();
        });
    },
});
export default [
    setCommonDateInfo,
];
