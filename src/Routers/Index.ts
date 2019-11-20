import { lazyRequire } from '@ctrip/crn';

const Demo = lazyRequire('../Pages/Demo/Page1');
const Debug = lazyRequire('../Pages/Debug/Index');

const Pages = [
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
