import React, { Component } from 'react';
import {
  StyleSheet, View, ModalProps,
} from 'react-native';
import BbkComponentModal, { BbkComponentModalAnimationPreset } from '@ctrip/bbk-component-modal';
import BbkComponentSelectMenu, { BbkSelectMenu } from '@ctrip/bbk-component-select-menu';
import BbkComponentFilterList from '@ctrip/bbk-component-filter-list';
import { BbkUtils } from '@ctrip/bbk-utils';
import BbkText from '@ctrip/bbk-component-text';
import BbkComponentButton from '@ctrip/bbk-component-button';
import {
  color, font, layout, space, radius,
} from '@ctrip/bbk-tokens';


interface IBbkComponentCarFilterModalFooter {
  ModelsNumber?: number;
  PricesNumber?: number;
  onDetermine?: () => void;
  onClear?: () => void;
}

interface IPropsType extends ModalProps, IBbkComponentCarFilterModalFooter {
  // ref?: RefObject<any>;
  visible?: boolean;
  isShowFooter?: boolean;
  onHide?: () => void;
  filterData: any[];
  type: string;
  // animationOutCallBack?: () => void;
  // children?: React.ReactNode | React.ReactNode[];
  // style?: ViewStyle;
}

const FilterFooterStyle = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    paddingHorizontal: space.spaceXXL,
    paddingTop: space.spaceS,
    paddingBottom: space.spaceXL,
    backgroundColor: color.white, // TODO
    // ...Platform.select({
    //   ios: {},
    //   android: {
    //     elevation: 8,
    //     backgroundColor: '#fff',
    //   },
    // }),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: color.grayBorder,
    borderStyle: 'solid',
  },
  infoTex: {
    textAlign: 'center',
    ...font.caption1Style,
  },
  errorTex: {
    color: color.redBase,
  },
  numTex: {
    color: color.blueBase,
    ...font.caption1Style,
  },
  buttons: {
    marginTop: space.spaceL,
    ...layout.betweenHorizontal,
  },
  determine: {
    // width: getPixel(452),
    // height: getPixel(96),
    backgroundColor: color.blueBase,
    borderRadius: radius.radiusXS,
  },
  determineDisabled: {
    backgroundColor: color.grayBase,
  },
  determineTex: {
    color: color.white,
    ...font.title2Style,
  },
  clear: {
    // width: getPixel(218),
    // height: getPixel(96),
    backgroundColor: color.white,
    borderRadius: radius.radiusXS,
    borderColor: color.fontSubDark,
    borderStyle: 'solid',
    borderWidth: StyleSheet.hairlineWidth,
  },
  clearTex: {
    color: color.fontSubDark,
    ...font.title2Style,
  },
});

export const FilterFooter: React.FC<IBbkComponentCarFilterModalFooter> = ({
  ModelsNumber,
  PricesNumber,
  onDetermine,
  onClear,
}: IBbkComponentCarFilterModalFooter) => (
  <View style={FilterFooterStyle.wrapper}>
    {BbkUtils.selector(
      PricesNumber === 0,
      <BbkText style={[FilterFooterStyle.infoTex, FilterFooterStyle.errorTex]}>未找到符合条件的车型，请修改条件</BbkText>,
      <BbkText style={FilterFooterStyle.infoTex}>
          当前共
        <BbkText style={FilterFooterStyle.numTex}>{ModelsNumber}</BbkText>
          个车型，
        <BbkText style={FilterFooterStyle.numTex}>{PricesNumber}</BbkText>
          个报价供您选择
      </BbkText>,
    )}

    <View style={FilterFooterStyle.buttons}>
      <BbkComponentButton
        text="Clear"
        buttonStyle={FilterFooterStyle.clear}
        textStyle={FilterFooterStyle.clearTex}
        onPress={onClear}
      />
      <BbkComponentButton
        text="Determine"
        buttonStyle={[FilterFooterStyle.determine, PricesNumber === 0 && FilterFooterStyle.determineDisabled]}
        textStyle={FilterFooterStyle.determineTex}
        disabled={BbkUtils.selector(PricesNumber === 0, true, false)}
        onPress={onDetermine}
      />
    </View>
  </View>
);

export default class FilterAndSortModal extends Component<IPropsType> {
  renderModalContentDom = () => {
    const { type, filterData } = this.props;
    // 根据不同的类型渲染不同的弹层样式
    let contentDom = null;
    switch (type) {
      case 'sort':
        contentDom = (
          <BbkComponentSelectMenu
            filterData={filterData}
            type={BbkSelectMenu.SelectMenuType.Multiple}
            maxHeight={BbkUtils.vh(50)}
            onToggle={() => { }} // todo
          />
        );
        break;
      case 'Vendor_0':
        contentDom = (
          <BbkComponentFilterList
            filterGroups={filterData}
          />
        );
        break;
      default:
        break;
    }
    return contentDom;
  }

  render() {
    const {
      visible, onHide, isShowFooter, ModelsNumber, PricesNumber, onDetermine, onClear,
    } = this.props;
    const contentDom = this.renderModalContentDom();

    return (
      <BbkComponentModal
        modalVisible={visible}
        onRequestClose={onHide}
        useModal={false}
        animationOutDuration={200}
        {...BbkComponentModalAnimationPreset('top')}
      >
        {contentDom}
        {isShowFooter && (
          <FilterFooter
            ModelsNumber={ModelsNumber}
            PricesNumber={PricesNumber}
            onDetermine={onDetermine}
            onClear={onClear}
          />
        )}

      </BbkComponentModal>
    );
  }
}
