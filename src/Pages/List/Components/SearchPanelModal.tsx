import React, { useEffect, useCallback } from 'react';
import { URL } from '@ctrip/crn';
import BbkComponentSearchPanelModal from '@ctrip/bbk-component-search-panel-modal';
import { CarLog } from '../../../Util/Index';
import { ClickKey } from '../../../Constants/Index';

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
  setAgeTipPopIsShow: ({ visible: boolean }) => void;
}

const addressUrl = '/rn_ibu_car/_crn_config?CRNModuleName=rn_ibu_car&CRNType=1&page=address';
// const addressUrl = 'http://127.0.0.1:5387/index.ios.bundle?CRNModuleName=rn_ibu_car&CRNType=1&page=address'

const SearchPanelModal = (props: IPropsType) => {
  const {
    visible, rentalLocation, ptime, rtime, age,
  } = props;

  useEffect(() => {
    if (visible) {
      // backup processing
      this.backPTime = ptime;
      this.backRTime = rtime;
      this.backUpRentalLocation = rentalLocation;
      this.backUpAge = age;
    }
    /* eslint-disable */
  }, [visible]);

  const onCancel = useCallback(() => {
    props.setLocationAndDatePopIsShow({ visible: false });
    // reset reducer
    props.setDateInfo({ pickup: this.backPTime, dropoff: this.backRTime });
    if (this.backUpRentalLocation) {
      props.setLocationInfo({
        pickUp: this.backUpRentalLocation.pickUp,
        dropOff: this.backUpRentalLocation.dropOff,
        isShowDropOff: this.backUpRentalLocation.isShowDropOff,
      });
    }
    props.setAge({ age: this.backUpAge });
    CarLog.LogCode({ enName: ClickKey.C_LIST_CHANGEINFO_POP_CLOSE.KEY });
    /* eslint-disable */
  }, []);

  const onPressPickupLocation = () => {
    const url = `${addressUrl}&addresstype=pickup`;
    URL.openURL(url);
    CarLog.LogCode({ enName: ClickKey.C_LIST_CHANGEINFO_POP_PICKUP_LOCATION.KEY });
  };

  const onPressDropoffLocation = () => {
    const url = `${addressUrl}&addresstype=dropoff`;
    URL.openURL(url);
    CarLog.LogCode({ enName: ClickKey.C_LIST_CHANGEINFO_POP_DROPOFF_LOCATION.KEY });
  };

  const onAgeChange = (data) => {
    props.setAge({ age: data });
    CarLog.LogCode({ enName: ClickKey.C_LIST_CHANGEINFO_POP_AGE_CONFIRM.KEY });
  };

  const onAgeCancel = () => {
    CarLog.LogCode({ enName: ClickKey.C_LIST_CHANGEINFO_POP_AGE_CANCEL.KEY });
  };

  const onTimeChange = (data) => {
    props.setDateInfo({ pickup: data.ptime, dropoff: data.rtime });
    CarLog.LogCode({ enName: ClickKey.C_LIST_CHANGEINFO_POP_CHANGEDATE_CONFIRM.KEY });
  };

  const onTimeCancel = () => {
    CarLog.LogCode({ enName: ClickKey.C_LIST_CHANGEINFO_POP_CHANGEDATE_CANCEL.KEY });
  };

  const onPressSearch = () => {
    props.fetchList();
    CarLog.LogCode({ enName: ClickKey.C_LIST_CHANGEINFO_POP_SEARCH.KEY });
  };

  const onPressAgeSelect = () => {
    CarLog.LogCode({ enName: ClickKey.C_LIST_CHANGEINFO_POP_AGE.KEY });
  };

  const onIsShowDropOffChange = (isShowDropOff) => {
    props.setLocationInfo({ isShowDropOff });
    CarLog.LogCode({ enName: ClickKey.C_LIST_CHANGEINFO_POP_SWITCH_DROPOFF.KEY, isShowDropOff });
  };

  const onPressPickUpDate = () => {
    CarLog.LogCode({ enName: ClickKey.C_LIST_CHANGEINFO_POP_PICKUP_DATE.KEY });
  }

  const onPressDropOffDate = () => {
    CarLog.LogCode({ enName: ClickKey.C_LIST_CHANGEINFO_POP_DROPOFF_DATE.KEY });
  }

  const onPressAgeTip = () => {
    props.setAgeTipPopIsShow({ visible: false });
    CarLog.LogCode({ enName: ClickKey.C_LIST_AGETIPPOP_SHOW.KEY });
  }

  const onAgeTipClose = () => {
    props.setAgeTipPopIsShow({ visible: true });
    CarLog.LogCode({ enName: ClickKey.C_LIST_AGETIPPOP_CLOSE.KEY });
  }

  return (
    <BbkComponentSearchPanelModal
      onCancel={onCancel}
      onPressPickupLocation={onPressPickupLocation}
      onPressDropoffLocation={onPressDropoffLocation}
      onPressPickUpDate={onPressPickUpDate}
      onPressDropOffDate={onPressDropOffDate}
      onAgeChange={onAgeChange}
      onAgeCancel={onAgeCancel}
      onTimeChange={onTimeChange}
      onTimeCancel={onTimeCancel}
      onPressSearch={onPressSearch}
      onPressAgeSelect={onPressAgeSelect}
      onIsShowDropOffChange={onIsShowDropOffChange}
      onPressAgeTip={onPressAgeTip}
      onAgeTipClose={onAgeTipClose}
      {...props}
    />
  );
};

export default SearchPanelModal;
