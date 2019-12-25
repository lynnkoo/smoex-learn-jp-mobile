import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  PanResponder,
  Dimensions,
  Platform,
  ViewStyle,
  ViewPropTypes,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  livechart: {
    position: 'absolute',
    height: 45,
    width: 45,
    left: width - 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  borderIosStyle: {
    shadowOffset: { width: 1, height: 2 },
    shadowRadius: 2,
    shadowColor: '#ABABAB',
    shadowOpacity: 0.5,
    borderRadius: 55,
  },
  borderAndStyle: {
    borderRadius: 55,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ECECEC',
  },
});

const getAssistiveStyle = (title: string, top: number, left: number, style: any) => ([
  Platform.OS === 'ios' ? styles.borderIosStyle : styles.borderAndStyle,
  styles.livechart,
  { top, left },
  style && { ...style },
  title === 'debug' && { backgroundColor: 'yellow' },
]);

const limitTop = height - 45;
const limitLeft = width - 45;

const getLimitValue = (value: number, limitCeil: number, limitFloor: number) => {
  if (value > limitCeil) return limitCeil;
  if (value < limitFloor) return limitFloor;
  return value;
};

const getPanResponderXY = (top: number, left: number, gs: any) => ({
  top: getLimitValue(top + gs.dy, limitTop, 44),
  left: getLimitValue(left + gs.dx, limitLeft, 44),
});

const getContentView = (title: string, color: string, setColor: any, onPress: any) => (
  <TouchableOpacity
    activeOpacity={1}
    onPress={onPress}
    onPressIn={() => setColor('#19A0F0')}
    onPressOut={() => setColor('#666')}
  >
    <View
      style={{
        justifyContent: 'center', alignItems: 'center', minHeight: 44, minWidth: 44,
      }}
    >
      <Text style={{ fontSize: 10, color }}>{title}</Text>
    </View>
  </TouchableOpacity>
);

interface PropsType {
  title?: string,
  style?: ViewStyle,
  onPress?: () => void,
}

const AssistiveTouch = (props: PropsType) => {
  const { title, style, onPress } = props;
  const [panResponder, setPanResponder] = useState({});
  const [top, setTop] = useState(120);
  const [left, setLeft] = useState(width - 70);
  const [color, setColor] = useState('#666');
  useEffect(() => {
    const newPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => { },
      onPanResponderMove: (evt, gs) => {
        const panXY = getPanResponderXY(top, left, gs);
        setTop(panXY.top);
        setLeft(panXY.left);
      },
      onPanResponderRelease: (evt, gs) => {
        const panXY = getPanResponderXY(top, left, gs);
        setTop(panXY.top);
        setLeft(panXY.left);
      },
    });
    setPanResponder(newPanResponder);
  }, [top, left]);

  return (
    <View
      style={getAssistiveStyle(title, top, left, style)}
      // @ts-ignore
      {...panResponder.panHandlers}
    >
      {getContentView(title, color, setColor, onPress)}
    </View>
  );
};

AssistiveTouch.propTypes = {
  title: PropTypes.string,
  onPress: PropTypes.func,
  style: ViewPropTypes.style,
};

AssistiveTouch.defaultProps = {
  title: 'debug',
  onPress: () => { },
  style: null,
};

export default AssistiveTouch;
