import React, { Component } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { CarLog } from '../../Util/Index';
import BbkTouchable from '@ctrip/bbk-component-touchable';

interface WrappedComponentPropsType {
  enName: string;
  onPress: Function;
  pageId?: string;
  logOtherInfo?: Object;
}

const WithLogCode = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  class WithLogCodeComponent extends Component<P & WrappedComponentPropsType> {
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
}

export default WithLogCode;

export const TextWithLogCode = WithLogCode(Text);
export const TouchableOpacityWithLogCode = WithLogCode(TouchableOpacity);
export const BbkTouchableWithLogCode = WithLogCode(BbkTouchable);
