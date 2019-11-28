/* eslint-disable */
import { AppRegistry } from 'react-native';
import { Platform } from './src/Constants/Index';

const theCompnent = require('./main');

if (global['__crn_appId'] === Platform.APP_ID.TRIP) {
  AppRegistry.registerComponent('rn_ibu_car_app', () => theCompnent);
} else {
  AppRegistry.registerComponent('rn_car_app', () => theCompnent);
}

module.exports = theCompnent;
