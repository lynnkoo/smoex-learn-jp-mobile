import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';
import { ViewPort, HeaderView } from '@ctrip/crn';
import AppContext from '../../Util/AppContext';
import CPage from '../../Components/App/CPage';
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
});

export default class MagicGate extends CPage {
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
        </ScrollView>
      </ViewPort>
    );
  }
}
