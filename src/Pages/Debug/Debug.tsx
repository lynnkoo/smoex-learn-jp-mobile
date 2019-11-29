import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { ViewPort, HeaderView, IBasePageProps } from '@ctrip/crn';
import { AppContext, CarLog } from '../../Util/Index';
import CPage, { IStateType } from '../../Components/App/CPage';
import { PageId } from '../../Constants/Index';
import { TextWithLogCode, TouchableOpacityWithLogCode } from '../../Components/Index';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
    flexDirection: 'column',
    paddingVertical: 20,
  },
  appContext: {
    height: 188,
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'gray',
  },
  container2: {
    flex: 1,
    paddingHorizontal: 5,
    flexDirection: 'row',
    paddingVertical: 20,
    marginTop: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 5,
    borderColor: 'gray',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  btn: {
    borderColor: 'gray',
    height: 30,
    width: 100,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
});

interface PropsType extends IBasePageProps {
  count: number,
  debugIncrement: Function,
  debugDecrement: Function,
}

interface StateType extends IStateType {
  name: string,
  age: number,
}

export default class MagicGate extends CPage<PropsType, StateType> {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      age: 10,
    };
  }

  /* eslint-disable class-methods-use-this */
  getPageId() {
    return PageId.Index.ID;
  }

  getAppContext = () => {
    const contexts = Object.keys(AppContext)
      .map((name): string => `${name}:${JSON.stringify(AppContext[name])}`);
    return contexts.join('\n');
  }

  renderPageContent() {
    return (
      <ViewPort>
        <HeaderView title={this.getPageId()} />
        <ScrollView style={styles.container}>
          <View>
            <TextInput
              value={this.getAppContext()}
              multiline
              style={styles.appContext}
            />
          </View>
          <View style={styles.container2}>
            <Text>{this.props.count}</Text>
            <TouchableOpacity style={styles.btn} onPress={() => this.props.debugIncrement()}>
              <Text>increment</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={() => this.props.debugDecrement()}>
              <Text>decrement</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn} onPress={() => this.push('Demo')}>
              <Text>to Demo</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.container2}>
            <TouchableOpacity style={styles.btn} onPress={() => CarLog.LogCode({ enName: 'test-click', pageId: this.getPageId() })}>
              <Text>测试点击埋点</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={() => CarLog.LogTrace({ key: '000', info: { eventResult: true } })}>
              <Text>测试trace埋点</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={() => CarLog.LogMetric({ key: '002', value: 500, info: { pageId: this.getPageId() } })}>
              <Text>测试metric埋点</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.container2}>
            <TextWithLogCode pageId={this.getPageId()} enName="test textLogCode" logOtherInfo={{ code: 1 }} onPress={() => { console.log('test withLogCode'); }}>
              {'测试TextWithLogCode组件'}
            </TextWithLogCode>
          </View>

          <View style={styles.container2}>
            <TouchableOpacityWithLogCode
              pageId={this.getPageId()}
              enName="test TouchableOpacityLogCode"
              onPress={() => { console.log('test TouchableOpacityLogCode'); }}
            >
              <Text>测试TouchableOpacityWithLogCode组件</Text>
            </TouchableOpacityWithLogCode>
          </View>
        </ScrollView>
      </ViewPort>
    );
  }
}
