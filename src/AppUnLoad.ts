import { AppContext } from './Util/Index';

const appUnLoad = () => {
  AppContext.reset();
};

export default appUnLoad;
