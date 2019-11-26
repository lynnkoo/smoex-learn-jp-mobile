import { lazyRequire } from '@ctrip/crn';
const Demo = lazyRequire('../Pages/Demo/Page1');
const Debug = lazyRequire('../Containers/DebugerContainer');
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
