import React, { useEffect, useState } from 'react';
import {
  View, Animated, Easing, StyleSheet,
} from 'react-native';
import BbkProgressBar from '@ctrip/bbk-component-progress-bar';
import BbkText from '@ctrip/bbk-component-text';
import { BbkUtils } from '@ctrip/bbk-utils';
import { color, font } from '@ctrip/bbk-tokens';

interface IPropsType {
  progress: number,
  vehCount: number,
  priceCount: number
}

const styles = StyleSheet.create({
  mainWrap: {
    position: 'absolute',
    top: 0,
    zIndex: 300,
  },
  progressWrap: {
    width: BbkUtils.vw(100),
    height: BbkUtils.getPixel(88),
    backgroundColor: color.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const ListProgress = (props: IPropsType) => {
  const [isFinished, setIsFinished] = useState(false);
  const [animatedOpacity] = useState(new Animated.Value(1));

  const { progress, vehCount, priceCount } = props;
  useEffect(() => {
    if (progress === 1) {
      Animated.timing(animatedOpacity, {
        toValue: 0,
        duration: 300,
        easing: Easing.ease,
      }).start(() => {
        setIsFinished(true);
      });
    }
  }, [animatedOpacity, progress]);

  if (isFinished) return null;

  // todo shark key
  return (
    <Animated.View style={[styles.mainWrap, { opacity: animatedOpacity }]}>
      <View style={styles.progressWrap}>
        <BbkText style={[font.subTitle2Style, { color: color.fontSecondary }]}>
          {`${vehCount} models and ${priceCount} quotations have been found`}
        </BbkText>
      </View>
      <BbkProgressBar defaultPercent={0} progress={progress} />
    </Animated.View>
  );
};

export default ListProgress;
