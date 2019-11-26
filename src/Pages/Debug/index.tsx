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
import AppContext from '../../Util/AppContext';
import CPage, { IStateType } from '../../Components/App/CPage';
import { PageId } from '../../Constants/Index';

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
          </View>
        </ScrollView>
      </ViewPort>
    );
  }
}
