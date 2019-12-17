import React, { useState, useEffect, useCallback } from 'react';
import BbkComponentSearchPanelModal from '@ctrip/bbk-component-search-panel-modal';

interface IPropsType {
  visible: boolean;
  rentalLocation: any;
  ptime: Date;
  rtime: Date;
  age: string;
  setLocationAndDatePopIsShow: ({ visible: boolean }) => void;
  setAge: ({ age: any }) => void;
  setDateInfo: (data: any) => void;
  fetchList: () => void;
  setLocationInfo: (data: any) => void;
}

const SearchPanelModal = (props: IPropsType) => {
  const {
    visible, rentalLocation, ptime, rtime, age,
  } = props;
  const [backPTime, setBackUpPTime] = useState(null);
  const [backRTime, setBackUpRTime] = useState(null);
  const [backUpRentalLocation, setBackUpRentalLocation] = useState(null);
  const [backUpAge, setBackUpAge] = useState('');

  useEffect(() => {
    if (visible) {
      // backup
      setBackUpPTime(ptime);
      setBackUpRTime(rtime);
      setBackUpRentalLocation(rentalLocation);
      setBackUpAge(age);
    }
  }, [age, ptime, rentalLocation, rtime, visible]);

  const onCancel = useCallback(() => {
    console.log('onCancel+++');
    props.setLocationAndDatePopIsShow({ visible: false });
    // reset reducer
    props.setDateInfo({ pickup: backPTime, dropoff: backRTime });
    if (backUpRentalLocation) {
      props.setLocationInfo({
        pickUp: backUpRentalLocation.pickUp,
        dropOff: backUpRentalLocation.dropOff,
        isOneWay: backUpRentalLocation.isOneWay,
      });
    }
    props.setAge({ age: backUpAge });
  }, [visible]);

  const onPressPickupLocation = () => {
    console.log('todo+++onPressDropoffLocation+++');
  };

  const onPressDropoffLocation = () => {
    console.log('todo+++onPressDropoffLocation+++');
  };

  const onAgeChange = (data) => {
    props.setAge({ age: data });
    // todo log
  };

  const onAgeCancel = () => {
    console.log('todo+++onAgeCancel+++');
  };

  const onTimeChange = (data) => {
    props.setDateInfo({ pickup: data.ptime, dropoff: data.rtime });
    // todo sendEvent + log
  };

  const onTimeCancel = () => {
    console.log('todo+++onTimeCancel+++');
  };

  const onPressSearch = () => {
    props.fetchList();
    // todo log
  };

  const onPressAgeSelect = () => {
    // todo log
  };

  const onIsOneWayChange = (isOneWay) => {
    props.setLocationInfo({ isOneWay });
    // todo log
  };

  return (
    <BbkComponentSearchPanelModal
      onCancel={onCancel}
      onPressPickupLocation={onPressPickupLocation}
      onPressDropoffLocation={onPressDropoffLocation}
      onAgeChange={onAgeChange}
      onAgeCancel={onAgeCancel}
      onTimeChange={onTimeChange}
      onTimeCancel={onTimeCancel}
      onPressSearch={onPressSearch}
      onPressAgeSelect={onPressAgeSelect}
      onIsOneWayChange={onIsOneWayChange}
      {...props}
    />
  );
};

export default SearchPanelModal;
