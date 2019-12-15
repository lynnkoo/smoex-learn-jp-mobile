// eslint-disable-next-line
import React, { memo, useState } from 'react';
// eslint-disable-next-line
import _ from 'lodash';
import SectionListWithControl from '../../../Components/Common/SectionListWithControl';
import { Vehicle, VehicleFooter, VehicleHeader } from './Vehicle';

interface section {
  vehicleHeader: any;
  index: number;
  data: Object[];
}

interface sectionProps {
  section: section;
}

const VehicleList = (props: any) => {
  const [showMore, setShowMore] = useState(false);
  const [showFooter, setShowFooter] = useState(false);
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
  const renderSectionHeader = ({ section: { vehicleHeader, index } }: sectionProps) => (
    <VehicleHeader
      vehicleHeader={vehicleHeader}
      onLayout={() => {
        if (index === sections.length - 1) {
          setShowFooter(true);
        }
      }}
    />
  );
  const renderSectionFooter = ({ section: { data } }: sectionProps) => {
    const moreNumber = Math.max(data.length - showMax, 0);

    return (
      <VehicleFooter
        moreNumber={showMore ? moreNumber : showMore}
        onPress={showMoreHandler}
      />
    );
  };

  return (
    <SectionListWithControl
      showFooter={showFooter}
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
