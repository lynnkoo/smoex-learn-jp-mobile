import React, { useEffect, useState } from 'react';
import {
  View, Animated, Easing, StyleSheet, Dimensions,
} from 'react-native';
import BbkText from '@ctrip/bbk-component-text';
import { BbkUtils } from '@ctrip/bbk-utils';
import { color, font } from '@ctrip/bbk-tokens';
import { listFetchResult } from '../Texts';

const { width } = Dimensions.get('window');

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
  progressBar: {
    height: BbkUtils.getPixel(10),
    backgroundColor: color.linearGradientOrangeLight,
  },
});

const ListProgress = (props: IPropsType) => {
  const [isFinished, setIsFinished] = useState(false);
  const [animatedOpacity] = useState(new Animated.Value(1));
  const [animatedProgress] = useState(new Animated.Value(0));

  const { progress, vehCount, priceCount } = props;
  useEffect(() => {
    let progressToVal = 0;
    if (progress > 0) {
      progressToVal = progress === 1 ? width : 0.9 * width;
    }
    Animated.timing(animatedProgress, {
      toValue: progressToVal,
      duration: 900,
      easing: Easing.ease,
    }).start(() => {
      if (progress === 1) {
        Animated.timing(animatedOpacity, {
          toValue: 0,
          duration: 300,
          easing: Easing.ease,
        }).start(() => {
          setIsFinished(true);
        });
      }
    });
  }, [animatedOpacity, animatedProgress, progress]);

  if (isFinished) return null;

  // todo shark key
  const tips = listFetchResult([priceCount, vehCount]);
  return (
    <Animated.View style={[styles.mainWrap, { opacity: animatedOpacity }]}>
      <View style={styles.progressWrap}>
        <BbkText style={[font.subTitle2Style, { color: color.fontSecondary }]}>
          {tips}
        </BbkText>
      </View>
      <Animated.View style={[styles.progressBar, { width: animatedProgress }]} />
    </Animated.View>
  );
};

export default ListProgress;
