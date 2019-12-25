import { AppContext } from './Util/Index';
// import { unmountStore } from './State/Store';

const appUnLoad = () => {
  AppContext.resetAppContext();
  // unmountStore();
};

export default appUnLoad;
