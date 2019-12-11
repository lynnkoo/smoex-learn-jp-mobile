import Demo from '../Pages/Demo/Page1';
import Debug from '../Containers/DebugerContainer';
import Market from '../Containers/MarketContainer';
import List from '../Pages/List/Index';

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
