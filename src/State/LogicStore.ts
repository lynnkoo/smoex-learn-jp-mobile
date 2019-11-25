import { createLogicMiddleware } from 'redux-logic';

import { CarFetch } from '../Util/Index';

import debug from './Debug/Logic';

const dependencies = {
  CarFetch,
};

export const rootLogics = [
  ...debug,
];

export const logicMiddleware = createLogicMiddleware(rootLogics, dependencies);
