import React from 'react';
import { IBasePageProps } from '@ctrip/crn';

import { View, Text } from 'react-native';
import CPage from '../../Components/App/CPage';

export interface PropsType extends IBasePageProps {
  landingto: string,
  loadMarket?: Function,
}

class Market extends CPage<PropsType, any> {
  componentDidMount() {
    this.props.loadMarket();
  }

  componentDidUpdate() {
    this.renderComponent();
  }

  renderComponent = () => {
    const { landingto } = this.props;
    if (landingto) {
      this.replace(landingto);
    }
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'yellow',
        }}
      >
        <Text>Market Loading...</Text>
      </View>
    );
  }
}

export default Market;
