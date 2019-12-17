import React, { useCallback } from 'react';
import RentalCarsDatePicker from '@ctrip/bbk-component-car-date-picker';

interface IPropsType {
  handleDatePickerRef: (data: any) => void;
  setDateInfo: (data: any) => void;
  setDatePickerIsShow: (data: any) => void;
}

const ListDatePicker = (props: IPropsType) => {
  const handleDatePickerRef = useCallback((ref) => {
    props.handleDatePickerRef(ref);
    /* eslint-disable */
  }, []);

  const handleOnConfirm = (data) => {
    props.setDateInfo({ pickup: data.ptime, dropoff: data.rtime });
    props.setDatePickerIsShow({ visible: false });
    // todo log
  };

  const handleOnCancel = () => {
    props.setDatePickerIsShow({ visible: false });
    // todo log
  };

  return (
    <RentalCarsDatePicker
      ref={handleDatePickerRef}
      onConfirm={handleOnConfirm}
      onCancel={handleOnCancel}
      {...props}
    />
  );
};
export default ListDatePicker;
