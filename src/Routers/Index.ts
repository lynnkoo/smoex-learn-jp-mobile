// import { lazyRequire } from '@ctrip/crn';

import Demo from '../Pages/Demo/Page1';
import Debug from '../Containers/DebugerContainer';
import Market from '../Containers/MarketContainer';
import List from '../Pages/List/Index';

// const Demo = lazyRequire('../Pages/Demo/Page1');
// const Debug = lazyRequire('../Containers/DebugerContainer');
// const Market = lazyRequire('../Containers/MarketContainer');

export interface PageRouteType {
  component: any,
  name: string,
  isInitialPage?: boolean,
}

const Pages: Array<PageRouteType> = [
  {
    component: Demo,
    name: 'Demo',
  },
  {
    component: Market,
    name: 'Market',
  },
  {
    component: Debug,
    name: 'Debug',
  },
  {
    component: List,
    name: 'List',
    isInitialPage: true,
  },
];

export default Pages;
