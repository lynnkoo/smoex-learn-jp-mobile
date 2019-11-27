import { createLogicMiddleware } from 'redux-logic';

import { CarFetch } from '../Util/Index';

import debug from './Debug/Logic';

import CountryLogic from './CountryInfo/Logic';

const dependencies = {
  CarFetch,
};

export const rootLogics = [
  ...debug,
  ...CountryLogic,
];

export const logicMiddleware = createLogicMiddleware(rootLogics, dependencies);
