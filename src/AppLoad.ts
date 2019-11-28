import { AppContext, Utils } from './Util/Index';
import { initialiseStore, initialiseAppState } from './State/Store';
import { initialiseABTesting } from './Util/ABTesting';

const initialiseAppContext = () => {
  AppContext.CarEnv.AppType = Utils.getAppType();
};

const appLoad = () => {
  initialiseStore();
  initialiseABTesting();
  initialiseAppState();
  initialiseAppContext();
};

export default appLoad;
