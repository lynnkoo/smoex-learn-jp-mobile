import React, { useState, useEffect, useCallback } from 'react';
import { URL } from '@ctrip/crn';
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

const addressUrl = '/rn_ibu_car/_crn_config?CRNModuleName=rn_ibu_car&CRNType=1&page=address';
// const addressUrl = 'http://127.0.0.1:5387/index.ios.bundle?CRNModuleName=rn_ibu_car&CRNType=1&page=address'

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
  /* eslint-disable */
  }, [visible]);

  const onCancel = useCallback(() => {
    console.log('onCancel+++');
    props.setLocationAndDatePopIsShow({ visible: false });
    // reset reducer
    props.setDateInfo({ pickup: backPTime, dropoff: backRTime });
    if (backUpRentalLocation) {
      props.setLocationInfo({
        pickUp: backUpRentalLocation.pickUp,
        dropOff: backUpRentalLocation.dropOff,
        isShowDropOff: backUpRentalLocation.isShowDropOff,
      });
    }
    props.setAge({ age: backUpAge });
  /* eslint-disable */
  }, []);

  const onPressPickupLocation = () => {
    const url = `${addressUrl}&addresstype=pickup`;
    URL.openURL(url);
  };

  const onPressDropoffLocation = () => {
    const url = `${addressUrl}&addresstype=dropoff`;
    URL.openURL(url);
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

  const onIsShowDropOffChange = (isShowDropOff) => {
    props.setLocationInfo({ isShowDropOff });
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
      onIsShowDropOffChange={onIsShowDropOffChange}
      {...props}
    />
  );
};

export default SearchPanelModal;
