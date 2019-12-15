import { createLogicMiddleware } from 'redux-logic';

import { CarFetch } from '../Util/Index';

import debug from './Debug/Logic';
import Country from './CountryInfo/Logic';
import LocationAndDate from './LocationAndDate/Logic';
import DriverAgeAndNumber from './DriverAgeAndNumber/Logic';
import Market from './Market/Logic';
import List from './List/Logic';

const dependencies = {
  CarFetch,
};

export const rootLogics = [
  ...debug,
  ...Country,
  ...LocationAndDate,
  ...DriverAgeAndNumber,
  ...Market,
  ...List,
];

export const logicMiddleware = createLogicMiddleware(rootLogics, dependencies);
