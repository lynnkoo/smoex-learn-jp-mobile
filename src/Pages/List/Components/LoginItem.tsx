import React from 'react';
import {
  View, Image, Dimensions, StyleSheet,
} from 'react-native';
import { getSharkValue } from '@ctrip/bbk-shark';
import BbkTouchable from '@ctrip/bbk-component-touchable';
import BbkText from '@ctrip/bbk-component-text';
import { font, color, space } from '@ctrip/bbk-tokens';
import { BbkUtils } from '@ctrip/bbk-utils';

const { width } = Dimensions.get('window');
const { getPixel } = BbkUtils;

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  signStr: {
    width,
    paddingHorizontal: getPixel(2 * 16),
    paddingTop: space.spaceS,
    paddingBottom: getPixel(2 * 12),
    overflow: 'hidden',
    backgroundColor: color.grayBg,
  },
  signPic: {
    width: width - getPixel(2 * 32),
    height: getPixel(2 * 58),
  },
  signIn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: width - getPixel(2 * 32),
    height: getPixel(2 * 58),
    position: 'absolute',
    top: getPixel(8),
    left: getPixel(2 * 16),
  },
  signSale: {
    width: getPixel(2 * 38),
    height: getPixel(2 * 40),
    marginLeft: getPixel(2 * 4),
    marginRight: getPixel(2 * 4),
  },
  signTex: {
    ...font.body1LightStyle,
    color: color.white,
    backgroundColor: color.transparent,
  },
  signBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: getPixel(2 * 10),
    height: getPixel(2 * 25),
    borderRadius: getPixel(2 * 2),
    backgroundColor: '#FFF',
    marginRight: getPixel(2 * 8),
  },
  signBtnTex: {
    paddingBottom: getPixel(2 * 1),
    ...font.body1LightStyle,
    color: color.blueBase,
  },
});

interface LoginItemProps {
  onLogin: () => void;
}

const LoginItem = ({ onLogin }: LoginItemProps) => (
  <View style={styles.signStr}>
    <Image
      source={{ uri: 'http://pic.c-ctrip.com/car/osd/trip/login/loginBg.png' }}
      resizeMode="cover"
      style={styles.signPic}
    />
    <View style={[styles.signIn]}>
      <Image
        source={{ uri: 'http://pic.c-ctrip.com/car/osd/trip/login/ic_member_deals.png' }}
        resizeMode="contain"
        style={styles.signSale}
      />
      <View style={styles.flex1}>
        <BbkText style={styles.signTex}>{getSharkValue('list_loginTitle')}</BbkText>
        <BbkText style={styles.signTex}>{getSharkValue('list_loginSubtitle')}</BbkText>
      </View>

      <BbkTouchable style={[styles.signBtn]} onPress={onLogin}>
        <BbkText style={styles.signBtnTex}>{getSharkValue('list_signIn')}</BbkText>
      </BbkTouchable>
    </View>
  </View>
);

export default LoginItem;
