import React, { memo } from 'react';
import { View } from 'react-native';
import { getSharkValue } from '@ctrip/bbk-shark';
import { BbkUtils } from '@ctrip/bbk-utils';
import BbkComponentListNoMatch from '@ctrip/bbk-component-list-no-match';
import { AgePickerApi } from '@ctrip/bbk-component-age-modal';
import { ImgType } from '@ctrip/bbk-component-list-no-match/dist/NoMatchImg';
import { CarLog } from '../../../Util/Index';
import { ClickKey } from '../../../Constants/Index';

interface IPropsType {
  recommendInfo: any; // TODO type
  age: number | string;
  datePickerRef: any;
  fetchList: () => void;
  setDatePickerIsShow: (data: any) => void;
  setLocationAndDatePopIsShow: (data: any) => void;
  setAgePickerIsShow: (data: any) => void;
  setAge: (data: any) => void;
}

// recommendation
const RC = {
  timeP: 1,
  timeR: 2,
  edit: 3,
  reload: 4,
  age: 5,
};

const ListNoMatch = memo((props: IPropsType) => {
  const {
    recommendInfo, age, datePickerRef, setDatePickerIsShow, setLocationAndDatePopIsShow, fetchList,
  } = props;
  const {
    promptTitle = '', promptSubTitle = '', type = '', buttonTitle = '',
  } = recommendInfo || {};

  const getImgType = () => (promptTitle ? ImgType.No_Search_Result : ImgType.No_Network);

  const getTitle = () => promptTitle || getSharkValue('list_SystemBusy');

  const getSubTitle = () => promptSubTitle || getSharkValue('list_SystemBusySub');

  const getOperationButtonText = () => buttonTitle || getSharkValue('list_retry');

  const handleAgeChange = (data) => {
    props.setAge({ age: data });
    props.setAgePickerIsShow({ visible: false });
    props.fetchList();
    CarLog.LogCode({ enName: ClickKey.C_LIST_RECOMMEND_CHANGEAGE_CONFIRM.KEY, age: data });
  };

  const onChangeAge = () => {
    const apiAge = AgePickerApi({ age, confirmCallback: handleAgeChange });
    if (apiAge) {
      apiAge();
    } else {
      // todo osd&isd
      props.setAgePickerIsShow({ visible: true });
    }
  };

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
      case RC.age:
        onChangeAge();
        break;
      default:
        fetchList();
    }
    CarLog.LogCode({ enName: ClickKey.C_LIST_RECOMMEND_BUTTON.KEY, type });
  };

  return (
    <View style={{ paddingTop: BbkUtils.getPixel(120) }}>
      <BbkComponentListNoMatch
        type={getImgType()}
        title={getTitle()}
        subTitle={getSubTitle()}
        isShowOperateButton
        isShowRentalDate={false}
        operateButtonText={getOperationButtonText()}
        operateButtonPress={handleOperateButtonPress}
      />
    </View>
  );
});
export default ListNoMatch;
