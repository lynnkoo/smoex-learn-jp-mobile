import React from 'react';
import { View } from 'react-native';
import BbkVehicleName from '@ctrip/bbk-component-car-vehicle-name';
import BbkCarVehicleDesc from '@ctrip/bbk-component-car-vehicle-describe';
import BbkLabel from '@ctrip/bbk-component-label';
import BbkPriceDesc from '@ctrip/bbk-component-car-price-desc';
import BbkTouchable from '@ctrip/bbk-component-touchable';
import { setOpacity } from '@ctrip/bbk-tokens';
import { BbkUtils } from '@ctrip/bbk-utils';
import BbkCarRightIcon from '@ctrip/bbk-component-right-icon';
import { withTheme } from '@ctrip/bbk-theming';
import BbkCarImage from '@ctrip/bbk-component-car-image';
import SectionListWithControl from '../Common/SectionListWithControl';
import { style } from '../../Pages/List/mock';
import VerdorHeader from './VendorHeader';
import { listShowMore } from '../../Pages/List/Texts';

const { selector } = BbkUtils;

const VendorDom = withTheme(
  ({
    vendorLabelItems,
    distance = 'distance',
    vendorDesc1 = 'vendorDesc1',
    vendorDesc2 = 'vendorDesc2',
    feature = 'feature',
    activity = 'activity',
    provider = 'provider',
    soldOut = 'soldOut',
    priceDescProps,
    vendorHeaderProps,
    theme,
  }) => {
    const handler = () => { console.log('---------VerdorHeader'); };
    const featureLabelProps = {
      ...vendorLabelItems[feature],
      theme: {
        labelColor: theme.blueBg,
      },
    };
    const activityLabelProps = {
      ...vendorLabelItems[activity],
      theme: {
        labelColor: theme.orangePrice,
        labelBgColor: setOpacity(theme.orangePrice, 0.1),
      },
    };
    const providerLabelProps = {
      ...vendorLabelItems[provider],
      theme: {
        labelColor: theme.fontSubLight,
      },
    };
    const soldoutLabelProps = {
      ...vendorLabelItems[soldOut],
      theme: {
        labelColor: theme.redBorder,
      },
    };

    return (
      <View style={[style.vendor, { borderBottomColor: setOpacity(theme.black, 0.1) }]}>
        <VerdorHeader
          onPress={handler}
          {...vendorHeaderProps}
        />

        <BbkLabel {...vendorLabelItems[distance]} />

        <View style={style.flexRow}>
          <BbkLabel {...vendorLabelItems[vendorDesc1]} />
          <BbkLabel {...vendorLabelItems[vendorDesc2]} />
        </View>

        <View style={style.flexRow}>
          <BbkLabel {...featureLabelProps} />
          <BbkLabel {...featureLabelProps} />
        </View>

        {
          vendorLabelItems[activity] && (
            <>
              <BbkLabel {...activityLabelProps} />
              <BbkLabel {...activityLabelProps} />
            </>
          )
        }

        <BbkLabel {...providerLabelProps} />

        <View style={style.priceWrap}>
          <BbkPriceDesc {...priceDescProps} />
          {
            vendorLabelItems[soldOut] && <BbkLabel {...soldoutLabelProps} />
          }
        </View>
      </View>
    );
  },
);

const VehicleDom = withTheme(
  ({ item, section, theme }) => {
    const { recommendDesc, vehicleDesc } = section;
    const {
      imgUrl, vehicleImageLabel, vehicleLabelsHorizontal, vehicleLabels,
    } = vehicleDesc;

    return (
      <View style={[style.wrap, { backgroundColor: theme.backgroundColor }]}>
        <View style={[style.flexRow]}>
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
              labelStyle={[style.labelFlexLeft, style.labelStyle, { backgroundColor: setOpacity(theme.blueBase, 0.08) }]}
            />,
          )
        }

        {
          item.map((data, index) => (
            // eslint-disable-next-line
            <VendorDom key={index} {...data} />
          ))
        }
      </View>
    );
  },
);

const VehicleHeader = withTheme(
  ({ vehicleHeader, theme }) => {
    const {
      vehicleName,
      groupName,
      isSimilar,
      isHotLabel,
    } = vehicleHeader;
    return (
      <View style={{ backgroundColor: theme.backgroundColor }}>
        <BbkVehicleName name={vehicleName} groupName={groupName} isSimilar={isSimilar} isHotLabel={isHotLabel} />
      </View>
    );
  },
);

const VehicleFooter = withTheme(
  ({ moreNumber, theme }) => {
    const moreTextStyle = [style.moreText, {
      color: theme.blueBase,
    }];

    return selector(
      moreNumber,
      <BbkTouchable onPress={() => { console.log('=======more'); }}>
        <BbkCarRightIcon
          text={listShowMore(moreNumber)}
          style={[style.more, style.vehicleMarginBottom, {
            backgroundColor: theme.backgroundColor,
            borderBottomColor: theme.grayBorder,
          }]}
          textStyle={moreTextStyle}
          iconContent={'\uf2c7'}
          iconStyle={moreTextStyle}
        />
      </BbkTouchable>,
      <View style={style.vehicleMarginBottom} />,
    );
  },
);

interface section {
  vehicleHeader: any;
  moreNumber: number;
}

interface sectionProps {
  section: section;
}

const List = (props: any) => {
  const {
    sections,
    ...passThroughProps
  } = props;
  const renderItem = data => <VehicleDom {...data} />;
  const renderSectionHeader = ({ section: { vehicleHeader } }: sectionProps) => <VehicleHeader vehicleHeader={vehicleHeader} />;
  const renderSectionFooter = ({ section: { moreNumber } }: sectionProps) => <VehicleFooter moreNumber={moreNumber} />;

  return (
    <SectionListWithControl
      sections={sections}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      renderSectionFooter={renderSectionFooter}
      threshold={50}
      {...passThroughProps}
    />
  );
};

export default List;
