// eslint-disable-next-line
import React, { memo, useState } from 'react';
// eslint-disable-next-line
import _ from 'lodash';
import { BbkUtils } from '@ctrip/bbk-utils';
import SectionListWithControl from '../../../Components/Common/SectionListWithControl';
import { Vehicle, VehicleFooter, VehicleHeader } from './Vehicle';

const { selector } = BbkUtils;

interface section {
  vehicleHeader: any;
  moreNumber: number;
}

interface sectionProps {
  section: section;
}

const VehicleList = (props: any) => {
  const [showMore, setShowMore] = useState(false);
  const {
    sections,
    showMax,
    ...passThroughProps
  } = props;

  const showMoreHandler = () => {
    setShowMore(!showMore);
  };

  const renderItem = (data) => {
    let vhicleData = data;
    if (showMore) {
      vhicleData = data.slice(0, showMax);
    }
    return (
      <Vehicle
        {...vhicleData}
      />
    );
  };
  const renderSectionHeader = ({ section: { vehicleHeader } }: sectionProps) => (
    <VehicleHeader
      vehicleHeader={vehicleHeader}
    />
  );
  const renderSectionFooter = ({ section: { moreNumber } }: sectionProps) => selector(
    // todo: 加载过快时，隐藏Footer
    true,
    <VehicleFooter
      moreNumber={showMore ? moreNumber : showMore}
      onPress={showMoreHandler}
    />,
  );

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

// const shouldUpdate = (prevProps, nextProps) => {
//   return _.get(prevProps, 'section.vehicleHeader.vehicleName') !== _.get(nextProps, 'section.vehicleHeader.vehicleName');
// };

// export default memo(VehicleList, shouldUpdate);
export default VehicleList;
