import { createLogicMiddleware } from 'redux-logic';
import { CarFetch } from '../Util/Index';
import debug from './Debug/Logic';
import locationAndDateLogic from './LocationAndDate/Logic';
const dependencies = {
    CarFetch,
};
export const rootLogics = [
    ...debug,
    ...locationAndDateLogic,
];
export const logicMiddleware = createLogicMiddleware(rootLogics, dependencies);
