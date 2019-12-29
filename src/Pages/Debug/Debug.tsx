import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import {
  ViewPort, HeaderView, IBasePageProps,
} from '@ctrip/crn';
import { AppContext } from '../../Util/Index';
import CPage, { IStateType } from '../../Components/App/CPage';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
    flexDirection: 'column',
    paddingVertical: 20,
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
    justifyContent: 'flex-start',
    alignItems: 'center',
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

export default class Debug extends CPage<PropsType, StateType> {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      age: 10,
    };
  }

  /* eslint-disable class-methods-use-this */
  getPageId() {
    return 'Debug';
  }

  componentDidMount() {
    super.componentDidMount();
    super.logPagePerformance();
  }

  getAppContext = () => {
    const contexts = [];
    Object.keys(AppContext).forEach((name) => {
      if (name !== 'PageInstance'
        && name !== 'SharkKeys'
        && typeof AppContext[name] !== 'function') {
        contexts.push(`${name}:${JSON.stringify(AppContext[name])}`);
      }
    });
    return contexts.join('\n');
  }

  render() {
    return (
      <ViewPort>
        <HeaderView title={this.getPageId()} page={this} />
        <ScrollView style={styles.container}>
          <View style={styles.container2}>
            <Text>版本号: </Text>
            <Text>{AppContext.CarEnv.buildTime}</Text>
          </View>
        </ScrollView>
      </ViewPort>
    );
  }
}
