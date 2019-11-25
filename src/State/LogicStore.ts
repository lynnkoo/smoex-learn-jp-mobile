import { createLogicMiddleware } from 'redux-logic';

import { CarFetch } from '../Util/Index';

import debugLogic from './Debug/Logic';

const dependencies = {
  CarFetch,
};

export const rootLogics = [
  ...debugLogic,
];

export const logicMiddleware = createLogicMiddleware(rootLogics, dependencies);
