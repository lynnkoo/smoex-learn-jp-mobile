import React, { useCallback } from 'react';
import RentalCarsDatePicker from '@ctrip/bbk-component-car-date-picker';
import { CarLog } from '../../../Util/Index';
import { ClickKey } from '../../../Constants/Index';

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
    CarLog.LogCode({ enName: ClickKey.C_LIST_CHANGEDATE_CONFIRM.KEY });
  };

  const handleOnCancel = () => {
    props.setDatePickerIsShow({ visible: false });
    CarLog.LogCode({ enName: ClickKey.C_LIST_CHANGEDATE_CANCEL.KEY });
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
