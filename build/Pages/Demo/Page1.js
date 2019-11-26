import React from 'react';
import { StyleSheet, Text, View, } from 'react-native';
import { ViewPort, Button } from '@ctrip/crn';
import CPage from '../../Components/App/CPage';
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
export default class Page1 extends CPage {
    render() {
        return (<ViewPort style={{ height: '100%', width: '100%' }}>
        <View style={styles.container}>
          <Text style={styles.welcome}>Welcome to Page1</Text>
          <Text style={styles.instructions}>
            Shake or press menu button for dev menu2
          </Text>
          <Button onPress={() => {
            this.push('List', { foo: 'bar' });
        }} style={styles.button}>
            <Text style={styles.welcome}>Go to List</Text>
          </Button>
        </View>
      </ViewPort>);
    }
}
