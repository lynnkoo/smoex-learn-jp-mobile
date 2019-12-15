import React, {
  useState, useRef, forwardRef, useImperativeHandle, RefObject,
} from 'react';
import {
  View,
} from 'react-native';
import BbkComponentCarFilterModal from '@ctrip/bbk-component-car-filter-modal';
import BbkComponentFilterList from '@ctrip/bbk-component-filter-list';
import BbkComponentSelectMenu, { BbkSelectMenu } from '@ctrip/bbk-component-select-menu';

const { SelectMenuType } = BbkSelectMenu;

const filterType = {
  Sort: 'Sort',
  Supplier: 'Supplier',
  Seats: 'Seats',
  Filter: 'Filter',
};

interface IFilterInner {
  type: string;
  filterData: Array<Object>;
}
export interface IFilterAndSort extends IFilterInner{
  allVehicleCount: number;
  allVendorPriceCount: number;
  isShowFooter: boolean;
  filterModalRef: RefObject<any>
}

const RenderInner: React.FC<IFilterInner> = ({ type, filterData }: IFilterInner) => (
  <View>
    {type === filterType.Sort ? (
      <BbkComponentSelectMenu
        filterData={filterData}
        type={SelectMenuType.Single}
        onToggle={() => { }}
      />
    ) : type === filterType.Supplier ? (
      <BbkComponentFilterList
        filterGroups={filterData}
        changeTempFilterData={() => { }}
      />
    ) : type === filterType.Seats ? (
      <BbkComponentSelectMenu
        filterData={filterData}
        type={SelectMenuType.Multiple}
        onToggle={() => { }}
      />
    ) : type === filterType.Filter ? (
      <BbkComponentFilterList
        filterGroups={filterData}
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
