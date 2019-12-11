import React, { Component } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { CarLog } from '../../Util/Index';

interface WrappedComponentPropsType {
  pageId: string;
  enName: string;
  onPress: Function;
  logOtherInfo?: Object;
}

const WithLogCode = (WrappedComponent) => {
  class WithLogCodeComponent extends Component<WrappedComponentPropsType> {
    handlePress = () => {
      const {
        onPress, pageId, enName, logOtherInfo,
      } = this.props;
      CarLog.LogCode({
        pageId,
        enName,
        ...logOtherInfo,
      });
      onPress();
    }


    render() {
      const { ...passThroughProps } = this.props;
      return (
        <WrappedComponent {...passThroughProps} onPress={this.handlePress} />
      );
    }
  }

  return WithLogCodeComponent;
};

export default WithLogCode;

export const TextWithLogCode = WithLogCode(Text);
export const TouchableOpacityWithLogCode = WithLogCode(TouchableOpacity); // todo 需替换成@ctrip/bbk-component-touchable
