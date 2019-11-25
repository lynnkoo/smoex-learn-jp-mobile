import { lazyRequire } from '@ctrip/crn';

const Demo = lazyRequire('../Pages/Demo/Page1');
const Debug = lazyRequire('../Containers/DebugerContainer');

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
    component: Debug,
    name: 'Debug',
    isInitialPage: true,
  },
];

export default Pages;
