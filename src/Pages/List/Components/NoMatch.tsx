import React from 'react';
import { View } from 'react-native';
import { getSharkValue } from '@ctrip/bbk-shark';
import { BbkUtils } from '@ctrip/bbk-utils';
import BbkComponentListNoMatch from '@ctrip/bbk-component-list-no-match';
import { ImgType } from '@ctrip/bbk-component-list-no-match/dist/NoMatchImg';

interface IPropsType {
  recommendInfo: any; // TODO type
  pTime: string;
  rTime: string;
  datePickerRef: any;
  fetchList: () => void;
  setDatePickerIsShow: (data: any) => void;
  setLocationAndDatePopIsShow: (data: any) => void;
}

// recommendation
const RC = {
  timeP: 1,
  timeR: 2,
  edit: 3,
  reload: 4,
};

const ListNoMatch = (props: IPropsType) => {
  const {
    recommendInfo, datePickerRef, setDatePickerIsShow, setLocationAndDatePopIsShow, fetchList,
  } = props;
  const {
    promptTitle = '', promptSubTitle = '', type = '', buttonTitle = '',
  } = recommendInfo || {};

  const getTitle = () => promptTitle || getSharkValue('list_SystemBusy');

  const getSubTitle = () => promptSubTitle || getSharkValue('list_SystemBusySub');

  const getOperationButtonText = () => buttonTitle || getSharkValue('list_retry');

  const handleOperateButtonPress = () => {
    switch (type) {
      case RC.timeP:
        if (datePickerRef) {
          datePickerRef.show({ focusOnRtime: false });
          setDatePickerIsShow({ visible: true });
        }
        break;
      case RC.timeR:
        if (datePickerRef) {
          datePickerRef.show({ focusOnRtime: true });
          setDatePickerIsShow({ visible: true });
        }
        break;
      case RC.edit:
        setLocationAndDatePopIsShow({ visible: true });
        break;
      default:
        fetchList();

      // todo log
    }
  };


  return (
    <View style={{ paddingTop: BbkUtils.getPixel(120) }}>
      <BbkComponentListNoMatch
        type={ImgType.No_Network}
        title={getTitle()}
        subTitle={getSubTitle()}
        isShowOperateButton
        isShowRentalDate={false}
        operateButtonText={getOperationButtonText()}
        operateButtonPress={handleOperateButtonPress}
      />
    </View>
  );
};
export default ListNoMatch;
