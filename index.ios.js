/* eslint-disable */
import { AppRegistry } from 'react-native';
import { Utils } from './src/Util/Index';

const theCompnent = require('./main');

AppRegistry.registerComponent(Utils.getChannelName(), () => theCompnent);

module.exports = theCompnent;
