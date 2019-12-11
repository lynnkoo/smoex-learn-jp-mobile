import React from 'react';
import SectionListWithControl from '../../../Components/Common/SectionListWithControl';
import { Vehicle, VehicleFooter, VehicleHeader } from './Vehicle';

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
  const renderItem = data => <Vehicle {...data} />;
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
