import { AppContext, Utils } from './Util/Index';
import { initialiseStore, initialiseAppState } from './State/Store';

const initialiseAppContext = () => {
  AppContext.CarEnv.AppType = Utils.getAppType();
};

const appLoad = () => {
  initialiseStore();
  initialiseAppState();
  initialiseAppContext();
};

export default appLoad;
