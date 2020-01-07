import React, {
  memo, useCallback,
} from 'react';
import { View } from 'react-native';
// eslint-disable-next-line
import _ from 'lodash';
import BbkVehicleName from '@ctrip/bbk-component-car-vehicle-name';
import BbkCarVehicleDesc from '@ctrip/bbk-component-car-vehicle-describe';
import BbkLabel from '@ctrip/bbk-component-label';
import BbkTouchable from '@ctrip/bbk-component-touchable';
import { setOpacity, icon } from '@ctrip/bbk-tokens';
import { BbkUtils } from '@ctrip/bbk-utils';
import BbkCarRightIcon from '@ctrip/bbk-component-right-icon';
import { withTheme } from '@ctrip/bbk-theming';
import BbkCarImage from '@ctrip/bbk-component-car-image';
import { VehicleListStyle as style } from '../Styles';
import Vendor from '../../../Containers/VendorContainer';
import { listShowMore } from '../Texts';
import { CarLog } from '../../../Util/Index';
import { ClickKey } from '../../../Constants/Index';

const { selector, htmlDecode } = BbkUtils;

export const Vehicle = memo(withTheme(
  ({
    item, section, onLayout, theme, showMax,
  }) => {
    const {
      recommendDesc, vehicleDesc, vehicleHeader,
    } = section;
    const {
      imgUrl, vehicleImageLabel, vehicleLabelsHorizontal, vehicleLabels,
    } = vehicleDesc;

    // console.log('【performance】Vehicle Item ', vehicleHeader.vehicleName, item.length)

    return (
      <View
        style={[style.wrap, {
          backgroundColor: theme.backgroundColor,
        }]}
        onLayout={onLayout}
      >
        <View style={[style.flexRow, style.vehicleImgWrap, {
          borderTopColor: theme.grayBorder,
        }]}
        >
          <BbkCarImage
            source={{ uri: imgUrl }}
            resizeMode="cover"
            style={style.vehicleImage}
            labelText={vehicleImageLabel}
          />
          <View style={style.vehicleDesc}>
            <BbkCarVehicleDesc
              items={vehicleLabelsHorizontal}
              horizontal
            />
            <BbkCarVehicleDesc
              items={vehicleLabels}
            />
          </View>
        </View>

        {
          selector(
            recommendDesc,
            <BbkLabel
              text={recommendDesc}
              hasBorder
              labelStyle={[
                style.labelFlexLeft, style.labelStyle,
                { backgroundColor: setOpacity(theme.blueBase, 0.08) },
              ]}
            />,
          )
        }

        {
          _.map(item, (data, index) => index < showMax && (
            // eslint-disable-next-line
            <Vendor
              key={index}
              index={index}
              {...data}
              vehicleName={vehicleHeader.vehicleName}
            />
          ))
        }
      </View>
    );
  },
));

export const VehicleHeader = memo(withTheme(
  ({
    vehicleHeader, onLayout, theme,
  }) => {
    const {
      vehicleName,
      groupName,
      isSimilar,
      isHotLabel,
    } = vehicleHeader;

    // useEffect(() => {
    //   console.log('√【performance】Vehicle Header ', vehicleHeader.vehicleName)
    // })

    return (
      <View
        style={{ backgroundColor: theme.backgroundColor }}
        onLayout={onLayout}
      >
        <BbkVehicleName
          name={vehicleName}
          groupName={groupName}
          isSimilar={isSimilar}
          isHotLabel={isHotLabel}
          // 一期没有弹层，不展示icon
          showSimilarIcon={false}
          style={style.vehicleHeaderWrap}
        />
      </View>
    );
  },
));

export const VehicleFooter = memo(withTheme(
  ({
    moreNumber,
    setShowMoreArr,
    showMoreArr,
    vehicleName,
    vehicleIndex, theme,
  }) => {
    const moreTextStyle = [style.moreText, {
      color: theme.blueBase,
    }];

    // useEffect(() => {
    //   console.log('√【performance】Vehicle Footer ')
    // })

    const showMoreHandler = useCallback(() => {
      setShowMoreArr(showMoreArr.map((value, i) => (i === vehicleIndex ? !value : value)));
      CarLog.LogCode({ enName: ClickKey.C_LIST_SHOW_MORE.KEY, vehicleIndex, vehicleName });
    }, [setShowMoreArr, showMoreArr, vehicleIndex, vehicleName]);

    return selector(
      moreNumber,
      <BbkTouchable
        onPress={showMoreHandler}
        style={[style.showMoreWrap, style.vehicleMarginBottom, {
          backgroundColor: theme.backgroundColor,
          borderTopColor: theme.grayBorder,
        }]}
      >
        <BbkCarRightIcon
          text={listShowMore(moreNumber)}
          style={style.more}
          textStyle={moreTextStyle}
          iconContent={htmlDecode(icon.circleArrowDown)}
          iconStyle={[moreTextStyle, style.moreIcon]}
        />
      </BbkTouchable>,
      <View style={style.vehicleMarginBottom} />,
    );
  },
));
