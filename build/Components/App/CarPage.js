import React from 'react';
import { Page, ViewPort, LoadingView, IBUSharkUtil, } from '@ctrip/crn';
import { IntlProvider } from 'react-intl';
import { Text } from 'react-native';
import { DefaultAppID } from '@ctrip/shark-app-sdk/lib/Shark/IBUSharkConf';
// http://conf.ctripcorp.com/pages/viewpage.action?pageId=154603234
export default class CarPage extends Page {
    constructor(prop) {
        super(prop);
        this.state = {
            lang: '',
            messages: null,
        };
    }
    componentDidMount() {
        // const startTime = new Date().getTime();
        IBUSharkUtil.fetchSharkData(this.getSharkConfig())
            .then(({ lang, messages }) => {
            this.setState({ lang, messages });
            this.sharkFetchDidFinish();
            // const costTime = new Date().getTime() - startTime;
            // IBULog.trace("key.crn.ibupage.load.keys.time", {
            //   keys_time: costTime
            // });
        })
            .catch(() => {
            this.setState({ lang: '', messages: {} });
            this.sharkFetchDidFinish();
        });
    }
    componentWillUnmount() { }
    /* eslint-disable class-methods-use-this */
    sharkFetchDidFinish() { }
    /* eslint-disable class-methods-use-this */
    getSharkConfig() {
        return {
            appid: DefaultAppID,
            keys: {},
        };
    }
    getLoadingState() {
        return false;
    }
    renderPageLoading() {
        return (<ViewPort>
        <LoadingView />
      </ViewPort>);
    }
    renderPageContent() {
        return <ViewPort />;
    }
    render() {
        const { lang, messages } = this.state;
        const loading = this.getLoadingState();
        if (lang && messages && !loading) {
            return (<IntlProvider locale={lang} messages={messages} textComponent={Text}>
          {this.renderPageContent()}
        </IntlProvider>);
        }
        return this.renderPageLoading();
    }
}
