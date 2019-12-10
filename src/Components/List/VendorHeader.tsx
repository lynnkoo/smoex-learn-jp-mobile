import React from 'react';
import { StyleSheet, View } from 'react-native';
import { space, font } from '@ctrip/bbk-tokens';
import BbkText from '@ctrip/bbk-component-text';
import BbkTouchable from '@ctrip/bbk-component-touchable';
import BbkCarRightIcon from '@ctrip/bbk-component-right-icon';
import BbkCarVendorLogo from '@ctrip/bbk-component-vendor-logo';
import { withTheme } from '@ctrip/bbk-theming';
import BbkCarScoreLabel from '@ctrip/bbk-component-score-label';

export const style = StyleSheet.create({
  verdorHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  vendorLogoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreLabel: {
    marginLeft: space.spaceM,
    marginRight: space.spaceS,
  },
  scoreDesc: {
    ...font.body2Style,
  },
  scoreDescWrap: {
    flex: 1,
    flexDirection: 'row',
    paddingBottom: space.spaceL,
  },
});

interface VerdorHeaderProps {
  vendorLogo?: string;
  vendorName?: string;
  title?: string;
  score: string;
  totalScore: string;
  scoreDesc: string;
  commentDesc: string;
  onPress: () => void;
  scoreLow?: boolean;
  theme?: any;
}

const VerdorHeader = (props: VerdorHeaderProps) => {
  const {
    onPress, vendorLogo, vendorName, title, score, totalScore, scoreDesc, commentDesc, scoreLow, theme,
  } = props;
  const scoreDescStyle = [style.scoreDesc, {
    color: scoreLow ? theme.vendorDescLowColor : theme.vendorDescColor,
  }];
  return (
    <BbkTouchable onPress={onPress} style={[style.verdorHeader]}>
      <View style={style.vendorLogoWrap}>
        <BbkCarVendorLogo
          vendorLogo={vendorLogo}
          vendorName={vendorName}
          title={title}
        />
        <BbkCarScoreLabel
          isLow={scoreLow}
          score={score}
          totalScore={totalScore}
          style={style.scoreLabel}
        />
      </View>
      <View style={[style.scoreDescWrap]}>
        <BbkText style={scoreDescStyle}>
          {scoreDesc}
          <BbkCarRightIcon
            text={` ${commentDesc} >`}
            plainText
            // iconContent={' '}
          />
        </BbkText>
      </View>
    </BbkTouchable>
  );
};

export default withTheme(VerdorHeader);
