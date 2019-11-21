/* eslint-disable */
import { AppRegistry } from 'react-native';
import { Utils } from './src/Util/Index';
import { Paltform } from './src/Constants/Index';

const theCompnent = require('./main');

if (global['__crn_appId'] === '37') {
  AppRegistry.registerComponent('rn_ibu_car_app', () => theCompnent);
} else {
  AppRegistry.registerComponent('rn_car_app', () => theCompnent);
}

module.exports = theCompnent;
