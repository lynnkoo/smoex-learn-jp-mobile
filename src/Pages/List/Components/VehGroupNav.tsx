import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { BbkUtils } from '@ctrip/bbk-utils';
import { color } from '@ctrip/bbk-tokens';
import BbkHorizontalNav, { BbkHorizontalNavItem } from '@ctrip/bbk-component-horizontal-nav';
// import { WithLogCode } from '../../../Components/Index';
// import { ClickKey } from '../../../Constants/Index';
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
    height: BbkUtils.getPixel(90),
    backgroundColor: color.white,
  },
  shadowStyle: {
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 4,
    shadowColor: color.modalShadow,
    shadowOpacity: 1,
  },
  mainWrap: {
    borderBottomWidth: 0,
  },
  topBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: color.grayBorder,
  },
  navItemWrap: {
    height: BbkUtils.getPixel(84),
    paddingHorizontal: BbkUtils.getPixel(24),
  },
});

export default class VehGroupNav extends Component<VehGroupNavPropsType, VehGroupNavStateType> {
  onPressNav = (gId: string) => {
    const { activeGroupId } = this.props;
    if (gId !== activeGroupId) {
      this.props.setActiveGroupId({ activeGroupId: gId });
    }
  }

  renderVehGroup = (): React.ReactNode[] => {
    const vehGroupNavList = [];
    const { vehGroupList, activeGroupId } = this.props;
    // const { pageId } = this.props;
    vehGroupList.forEach((item) => {
      // todo
      // const BbkHorizontalNavItemWithLogCode = WithLogCode(BbkHorizontalNavItem);
      // const obj = {
      //   id: item.gId,
      //   title: item.title,
      //   style: styles.navItemWrap,
      // };
      // vehGroupNavList.push(
      //   <BbkHorizontalNavItemWithLogCode
      //     pageId={pageId}
      //     enName={ClickKey.C_LIST_VEHICLEGROUP.KEY}
      //     onPress={() => { this.onPressNav(item.gId); }}
      //     {...obj}
      //   />,
      // );
      const { gId, title } = item;
      const isSelect = gId === activeGroupId;
      vehGroupNavList.push(
        <BbkHorizontalNavItem
          key={BbkUtils.uuid()}
          id={gId}
          title={title}
          style={styles.navItemWrap}
          selected={isSelect}
          disabled={false} // todo
          onPress={() => { this.onPressNav(gId); }}
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
      <View style={[styles.container, styles.shadowStyle]}>
        <BbkHorizontalNav
          style={[styles.mainWrap, styles.topBorder]}
          indicatorWidth={BbkUtils.getPixel(40)}
          indicatorHeight={BbkUtils.getPixel(6)}
          selectedId={activeGroupId}
        >
          {vehGroupNav}
        </BbkHorizontalNav>

        <ListProgress />
      </View>
    );
  }
}
