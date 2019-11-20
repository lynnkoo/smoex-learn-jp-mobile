import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';
import {
  ViewPort, Page, IBasePageProps, HeaderView,
} from '@ctrip/crn';
import AppContext from '../../Util/AppContext';

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
});

export default class MagicGate extends Page<IBasePageProps> {
  getAppContext = () => {
    const contexts = Object.keys(AppContext).map((name): string => `${name}:${JSON.stringify(AppContext[name])}`);
    return contexts.join('\n');
  }

  render() {
    return (
      <ViewPort>
        <HeaderView title="Debug" />
        <ScrollView style={styles.container}>
          <View>
            <TextInput
              value={this.getAppContext()}
              multiline
              style={styles.appContext}
            />
          </View>
        </ScrollView>
      </ViewPort>
    );
  }
}
