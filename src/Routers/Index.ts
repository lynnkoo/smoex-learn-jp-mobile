import { lazyRequire } from '@ctrip/crn';

const Demo = lazyRequire('../Pages/Demo/Page1');
const Debug = lazyRequire('../Containers/DebugerContainer');
const Market = lazyRequire('../Containers/MarketContainer');
const List = lazyRequire('../Containers/ListPageContainer');

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
