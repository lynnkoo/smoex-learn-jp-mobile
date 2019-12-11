import { createLogicMiddleware } from 'redux-logic';

import { CarFetch } from '../Util/Index';

import debug from './Debug/Logic';
import Country from './CountryInfo/Logic';
import LocationAndDate from './LocationAndDate/Logic';
import DriverAge from './DriverAge/Logic';
import Market from './Market/Logic';

const dependencies = {
  CarFetch,
};

export const rootLogics = [
  ...debug,
  ...Country,
  ...LocationAndDate,
  ...DriverAge,
  ...Market,
];

export const logicMiddleware = createLogicMiddleware(rootLogics, dependencies);
