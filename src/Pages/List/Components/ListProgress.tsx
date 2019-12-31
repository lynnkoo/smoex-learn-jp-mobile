import React, { useEffect, useState, memo } from 'react';
import {
  View, Animated, Easing, StyleSheet, Dimensions,
} from 'react-native';
import BbkText from '@ctrip/bbk-component-text';
import { BbkUtils } from '@ctrip/bbk-utils';
import { color, font } from '@ctrip/bbk-tokens';
import { getSharkValue } from '@ctrip/bbk-shark';

const { width } = Dimensions.get('window');

interface IPropsType {
  progress: number;
  vehCount: number;
  priceCount: number;
  setProgressIsFinish: (isFinished: boolean) => void;
}

const styles = StyleSheet.create({
  mainWrap: {
    position: 'absolute',
    top: 0,
  },
  progressWrap: {
    width: BbkUtils.vw(100),
    height: BbkUtils.getPixel(84),
    backgroundColor: color.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBar: {
    height: BbkUtils.getPixel(10),
    backgroundColor: color.orangeIcon,
  },
});

const ListProgress = memo((props: IPropsType) => {
  const [isFinished, setIsFinished] = useState(false);
  const [animatedOpacity, setAnimatedOpacity] = useState(new Animated.Value(1));
  const [animatedProgress, setAnimatedProgress] = useState(new Animated.Value(0));

  const {
    progress, vehCount, priceCount, setProgressIsFinish,
  } = props;
  useEffect(() => {
    if (isFinished && progress === 0) {
      setIsFinished(false);
      setAnimatedOpacity(new Animated.Value(1));
      setAnimatedProgress(new Animated.Value(0));
    }

    let progressToVal = 0;
    if (progress > 0) {
      progressToVal = progress === 1 ? width : 0.9 * width;
    }
    Animated.timing(animatedProgress, {
      toValue: progressToVal,
      duration: 900,
      easing: Easing.linear,
    }).start(() => {
      if (progress === 1) {
        Animated.timing(animatedOpacity, {
          toValue: 0,
          duration: 300,
          easing: Easing.linear,
        }).start(() => {
          setIsFinished(true);
          setProgressIsFinish(true);
        });
      }
    });
  }, [animatedOpacity, animatedProgress, isFinished, progress, setProgressIsFinish]);

  if (isFinished || progress === 0 || vehCount === 0) return null;

  const tip1 = getSharkValue('listCombine_fetchResult', vehCount);
  const tip2 = getSharkValue('listCombine_fetchResult2', priceCount);
  const combineTip = tip1 + tip2;
  return (
    <Animated.View style={[styles.mainWrap, { opacity: animatedOpacity }]}>
      <View style={styles.progressWrap}>
        <BbkText style={[font.body2LightStyle, { color: color.blueGrayBase }]}>
          {combineTip}
        </BbkText>
      </View>
      <Animated.View style={[styles.progressBar, { width: animatedProgress }]} />
    </Animated.View>
  );
});

export default ListProgress;
