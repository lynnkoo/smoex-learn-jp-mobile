import React, { Component } from 'react';
import { App } from '@ctrip/crn';
import { Provider } from 'react-redux';
import pages from './Routers/Index';
import { AppContext, Utils } from './Util/Index';
import { initialiseStore, getStore } from './State/Store';
const navigationBarConfig = {
    hide: true,
    backgroundColor: 'rgb(9, 159, 222)',
};
class Car extends App {
    constructor(props) {
        super(props);
        this.init({ pages, navigationBarConfig });
    }
}
export default class RnCarApp extends Component {
    constructor(props) {
        super(props);
        this.initAppContext = () => {
            AppContext.CarEnv.AppType = Utils.getAppType();
        };
        this.initAppContext();
        initialiseStore();
    }
    render() {
        return (<Provider store={getStore()}>
        <Car />
      </Provider>);
    }
}
