import { createLogicMiddleware } from 'redux-logic';

import { CarFetch } from '../Util/Index';

import debug from './Debug/Logic';

import CountryInfoLogic from './CountryInfo/Logic';

const dependencies = {
  CarFetch,
};

export const rootLogics = [
  ...debug,
  ...CountryInfoLogic,
];

export const logicMiddleware = createLogicMiddleware(rootLogics, dependencies);
