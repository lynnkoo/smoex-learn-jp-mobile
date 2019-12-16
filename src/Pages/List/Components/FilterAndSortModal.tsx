import React, {
  useState, useRef, forwardRef, useImperativeHandle, RefObject,
} from 'react';
import {
  View,
} from 'react-native';
import BbkComponentCarFilterModal from '@ctrip/bbk-component-car-filter-modal';
import BbkComponentFilterList from '@ctrip/bbk-component-filter-list';
import BbkComponentSelectMenu, { BbkSelectMenu } from '@ctrip/bbk-component-select-menu';
import { FilterType } from '../../../Constants/Index';

const { SelectMenuType } = BbkSelectMenu;

interface IFilterInner {
  type: string;
  filterData: Array<Object>;
}
export interface IFilterAndSort extends IFilterInner {
  allVehicleCount: number;
  allVendorPriceCount: number;
  isShowFooter: boolean;
  filterModalRef: RefObject<any>
}

const initFilterData = (type, tempFilterData) => {
  let filterData = [];
  switch (type) {
    case FilterType.Sort:
      filterData = tempFilterData;
      break;
    case FilterType.Supplier:
    case FilterType.Filter:
      tempFilterData.forEach((item) => {
        if (item.filterGroups && item.filterGroups.length > 0) {
          filterData.push(item.filterGroups[0]);
        }
      });
      break;
    case FilterType.Seats:
      tempFilterData.forEach((item) => {
        if (item.filterGroups && item.filterGroups.length > 0) {
          item.filterGroups.forEach((group) => {
            if (group && group.filterItems.length > 0) {
              filterData.push(group.filterItems[0]);
            }
          });
        }
      });
      break;
    default:
      break;
  }
  return filterData;
};

const RenderInner: React.FC<IFilterInner> = ({ type, filterData }: IFilterInner) => (
  <View>
    {type === FilterType.Sort ? (
      <BbkComponentSelectMenu
        filterData={initFilterData(type, filterData)}
        type={SelectMenuType.Single}
        onToggle={() => { }}
      />
    ) : type === FilterType.Supplier ? (
      <BbkComponentFilterList
        filterGroups={initFilterData(type, filterData)}
        changeTempFilterData={() => { }}
      />
    ) : type === FilterType.Seats ? (
      <BbkComponentSelectMenu
        filterData={initFilterData(type, filterData)}
        type={SelectMenuType.Multiple}
        onToggle={() => { }}
      />
    ) : type === FilterType.Filter ? (
      <BbkComponentFilterList
        filterGroups={initFilterData(type, filterData)}
        changeTempFilterData={() => { }}
      />
    ) : null}
  </View>
);

const FilterAndSortModal: React.FC<IFilterAndSort> = ({
  filterData,
  allVehicleCount,
  allVendorPriceCount,
  isShowFooter,
  type,
  filterModalRef,
}: IFilterAndSort) => {
  const [modalVisible, setModalVisible] = useState(false);

  const onHide = () => {
    // setFilterItems(updateFilterActive(filterItemsState, undefined, false));
    setModalVisible(false);
  };

  const privateFilterModalRef = useRef();
  useImperativeHandle(filterModalRef, () => ({
    show: () => {
      setModalVisible(true);
    },
    hide: onHide,
  }));

  return (
    <BbkComponentCarFilterModal
      // @ts-ignore
      ref={privateFilterModalRef}
      modalVisible={modalVisible}
      isShowFooter={isShowFooter}
      ModelsNumber={allVehicleCount}
      PricesNumber={allVendorPriceCount}
      onHide={onHide}
    >
      <RenderInner type={type} filterData={filterData} />
    </BbkComponentCarFilterModal>
  );
};

export default forwardRef(FilterAndSortModal);
