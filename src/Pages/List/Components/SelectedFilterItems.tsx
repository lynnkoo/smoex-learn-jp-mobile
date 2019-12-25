import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import BbkCarRightIcon from '@ctrip/bbk-component-right-icon';
import {
  color, icon, space, setOpacity, font,
} from '@ctrip/bbk-tokens';
import BbkTouchable from '@ctrip/bbk-component-touchable';
import BbkText from '@ctrip/bbk-component-text';
import { getSharkValue } from '@ctrip/bbk-shark';
import { BbkUtils } from '@ctrip/bbk-utils';
import { CarLog } from '../../../Util/Index';
import { ClickKey } from '../../../Constants/Index';

const { htmlDecode, selector } = BbkUtils;

interface SelectedFilterItemProps {
  code: string;
  name: string;
  clearFilter: (code: string) => void;
}

interface SelectedFilterItemsProps {
  filters: SelectedFilterItemProps[];
  clearFilter: (code: string) => void;
}

const styles = StyleSheet.create({
  filterWrapper: {
    alignItems: 'flex-start',
    padding: space.spaceXXL,
    backgroundColor: color.white,
    marginTop: -space.spaceL,
  },
  filterTitle: {
    ...font.body3Style,
    marginBottom: space.spaceXS,
  },
  filterItem: {
    paddingHorizontal: space.spaceL,
    paddingVertical: space.spaceS,
    marginTop: space.spaceL,
    backgroundColor: setOpacity(color.blueBase, 0.08),
  },
  filterItemText: {
    color: color.blueBase,
  },
  filterItemClose: {
    marginLeft: space.spaceS,
  },
});

const SelectedFilterItem = ({ code, name, clearFilter }: SelectedFilterItemProps) => {
  const onPress = () => {
    clearFilter(code);
    CarLog.LogCode({ enName: ClickKey.C_LIST_CLEAR_BOTTOM_FILTER.KEY, name });
  };
  return (
    <BbkTouchable onPress={onPress}>
      <BbkCarRightIcon
        text={name}
        style={styles.filterItem}
        textStyle={styles.filterItemText}
        iconContent={htmlDecode(icon.cross)}
        iconStyle={[styles.filterItemText, styles.filterItemClose]}
      />
    </BbkTouchable>
  );
};

const SelectedFilterItems = ({ filters = [], clearFilter }: SelectedFilterItemsProps) => selector(
  filters.length > 0,
  <View style={styles.filterWrapper}>
    <BbkText style={styles.filterTitle}>
      {getSharkValue('list_changeFilterTips')}
:
    </BbkText>
    {
        filters.map(filter => (
          <SelectedFilterItem
            key={filter.code}
            {...filter}
            clearFilter={clearFilter}
          />
        ))
      }
  </View>,
);

export default memo(SelectedFilterItems);
