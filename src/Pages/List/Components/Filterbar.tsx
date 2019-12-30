import React, { useState, useEffect, memo } from 'react';
import { Animated, Easing } from 'react-native';
import BbkFilterBar from '@ctrip/bbk-component-car-filter-bar';
import { BbkUtils } from '@ctrip/bbk-utils';
import { druation } from '@ctrip/bbk-tokens';

interface IPropsType {
  progress: number;
  progressIsFinish: boolean;
  items: any[];
}

const FilterBar = memo((props: IPropsType) => {
  const { progress, progressIsFinish, ...otherProps } = props;
  const [isShowed, setIsShowed] = useState(false);
  const [animatedHeight] = useState(new Animated.Value(0));
  useEffect(() => {
    if (!isShowed && progress === 1 && progressIsFinish) {
      Animated.timing(animatedHeight, {
        toValue: BbkUtils.getPixel(80),
        duration: druation.animationDurationSm,
        easing: Easing.ease,
      }).start(() => {
        setIsShowed(true);
      });
    }
  }, [animatedHeight, isShowed, progress, progressIsFinish]);

  if (props.items.length === 2) { return null; }
  return (
    <Animated.View style={[{
      height: animatedHeight,
    }]}
    >
      <BbkFilterBar
        {...otherProps}
      />
    </Animated.View>
  );
});
export default FilterBar;
