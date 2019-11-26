import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { App } from '@ctrip/crn';
import pages from './Routers/Index';
import { AppContext, AppInstance } from './Util/Index';
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
        initialiseStore();
        AppInstance.init(props);
        AppContext.init(props);
    }
    render() {
        return (<Provider store={getStore()}>
        <Car />
      </Provider>);
    }
}
