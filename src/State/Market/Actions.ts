import { LOAD, LOAD_COMPLETED, LOAD_FAILED } from './Types';
import { ActionType } from '../../Types/ActiontType';

export interface LocationAndDateActionType extends ActionType {
  data?: Object
}

export const loadMarket = () => ({
  type: LOAD,
});

export const loadMarketCompleted = (data?: any) => ({
  type: LOAD_COMPLETED,
  data,
});

export const loadMarketFailed = (err?: any) => ({
  type: LOAD_FAILED,
  data: err,
});
