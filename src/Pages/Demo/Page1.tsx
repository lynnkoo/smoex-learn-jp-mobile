import React from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity,
} from 'react-native';
import {
  Page,
} from '@ctrip/crn';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#333333',
  },
});

export default class Page1 extends Page<any, any> {
  render() {
    return (
      <View style={{ height: '100%', width: '100%' }}>
        <View style={styles.container}>
          <Text style={styles.welcome}>Welcome to Page1</Text>
          <Text style={styles.instructions}>
            Shake or press menu button for dev menu2
          </Text>
          <TouchableOpacity
            onPress={() => {
              this.push('List', { foo: 'bar' });
            }}
            style={styles.button}
          >
            Go to List
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
