import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { BbkUtils } from '@ctrip/bbk-utils';
import { color } from '@ctrip/bbk-tokens';
import BbkHorizontalNav, { BbkHorizontalNavItem } from '@ctrip/bbk-component-horizontal-nav';
// import { WithLogCode } from '../../../Components/Index';
// import { ClickKey } from '../../../Constants/Index';

interface VehGroupNavPropsType {
  pageId: string;
  activeGroupId: string;
  vehGroupList: any[];
}

interface VehGroupNavStateType {
  activeGroupId: string;
  groupList: any[];
}

const styles = StyleSheet.create({
  mainWrap: {
    height: BbkUtils.getPixel(84),
    paddingHorizontal: BbkUtils.getPixel(8),
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
  constructor(props) {
    super(props);
    this.state = {
      activeGroupId: props.activeGroupId,
      groupList: props.vehGroupList,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState(
      {
        activeGroupId: nextProps.activeGroupId,
        groupList: nextProps.vehGroupList,
      },
    );
  }

  onPressNav = (gId: string) => {
    const { activeGroupId } = this.state;
    if (gId !== activeGroupId) {
      this.setState({ activeGroupId: gId });
    }
  }

  renderVehGroup = (): React.ReactNode[] => {
    const vehGroupNavList = [];
    const { groupList } = this.state;
    // const { pageId } = this.props;
    groupList.forEach((item) => {
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
      vehGroupNavList.push(
        <BbkHorizontalNavItem
          key={BbkUtils.uuid()}
          id={gId}
          title={title}
          style={styles.navItemWrap}
          onPress={() => { this.onPressNav(gId); }}
        />,
      );
    });

    return vehGroupNavList;
  }

  render() {
    const vehGroupNav = this.renderVehGroup();
    const { activeGroupId } = this.state;
    return (
      <BbkHorizontalNav
        style={[styles.mainWrap, styles.topBorder]}
        indicatorWidth={BbkUtils.getPixel(40)}
        selectedId={activeGroupId}
      >
        {vehGroupNav}
      </BbkHorizontalNav>
    );
  }
}
