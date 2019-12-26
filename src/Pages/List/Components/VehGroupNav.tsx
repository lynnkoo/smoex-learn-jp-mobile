import React, { PureComponent } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { BbkUtils } from '@ctrip/bbk-utils';
import { color } from '@ctrip/bbk-tokens';
import BbkHorizontalNav, { BbkHorizontalNavItem } from '@ctrip/bbk-component-horizontal-nav';
import { WithLogCode } from '../../../Components/Index';
import { ClickKey } from '../../../Constants/Index';
import ListProgress from '../../../Containers/ListProgressContainer';

interface VehGroupNavPropsType {
  pageId: string;
  activeGroupId: string;
  vehGroupList: any[];
  setActiveGroupId: (data: { activeGroupId: string }) => void;
  tabScroll: Function;
  resetGroupIndex: Function;
  progress: number;
}

interface VehGroupNavStateType {
  activeGroupId: string;
  groupList: any[];
}

const styles = StyleSheet.create({
  container: {
    height: BbkUtils.getPixel(84),
    backgroundColor: color.white,
    ...Platform.select({
      android: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: color.grayBorder,
      },
    }),
  },
  mainWrap: {
    borderBottomWidth: 0,
  },
  topBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: color.grayBorder,
  },
  navItemWrap: {
    height: BbkUtils.getPixel(78),
    paddingHorizontal: BbkUtils.getPixel(20),
  },
});

export default class VehGroupNav extends PureComponent<VehGroupNavPropsType, VehGroupNavStateType> {
  onPressNav = (gId: string) => {
    const { activeGroupId, setActiveGroupId } = this.props;
    if (gId !== activeGroupId) {
      setActiveGroupId({ activeGroupId: gId });
    }
  }

  renderVehGroup = (): React.ReactNode[] => {
    const vehGroupNavList = [];
    const { vehGroupList, activeGroupId } = this.props;
    vehGroupList.forEach((item) => {
      const BbkHorizontalNavItemWithLogCode = WithLogCode(BbkHorizontalNavItem);
      const { gId, title, count } = item;
      const isSelect = gId === activeGroupId;
      const navItemProps = {
        id: gId,
        title,
        selected: isSelect,
        disabled: !isSelect && count === 0,
        style: styles.navItemWrap,
      };
      vehGroupNavList.push(
        <BbkHorizontalNavItemWithLogCode
          key={BbkUtils.uuid()}
          enName={ClickKey.C_LIST_VEHICLEGROUP.KEY}
          logOtherInfo={{ groupCode: item.gId }}
          onPress={() => { this.onPressNav(item.gId); }}
          {...navItemProps}
        />,
      );
    });

    return vehGroupNavList;
  }

  render() {
    const vehGroupNav = this.renderVehGroup();
    const { activeGroupId, progress } = this.props;
    if (progress === 1 && vehGroupNav.length === 0) return null;
    return (
      <View>
        {
          progress > 0
          && (
          <BbkHorizontalNav
            style={[styles.mainWrap, styles.topBorder, styles.container]}
            indicatorWidth={BbkUtils.getPixel(80)}
            indicatorHeight={BbkUtils.getPixel(6)}
            selectedId={activeGroupId}
          >
            {vehGroupNav}
          </BbkHorizontalNav>
          )
        }
        <ListProgress />
      </View>
    );
  }
}
