import React, {
  useState, useRef, forwardRef, useImperativeHandle, RefObject, useEffect,
} from 'react';
import {
  View,
} from 'react-native';
import _ from 'lodash';
import BbkComponentCarFilterModal from '@ctrip/bbk-component-car-filter-modal';
import BbkComponentFilterList from '@ctrip/bbk-component-filter-list';
import { FilterType } from '@ctrip/bbk-logic';
import BbkComponentSelectMenu, { BbkSelectMenu } from '@ctrip/bbk-component-select-menu';
import { FilterBarType } from '../../../Constants/Index';

const { SelectMenuType } = BbkSelectMenu;

interface IFilterInner {
  type: string;
  filterData: Array<Object>;
  updateSelectedFilter?: (data: any) => void;
  updateTempFilter?: (data: any, handleType: string, type: string) => void;
  updateTempPrice?: (data: any, handleType: string) => void;
  setModalVisible: (visible: boolean) => void;
}
export interface IFilterAndSort extends IFilterInner {
  allVehicleCount: number;
  allVendorPriceCount: number;
  selectedFilters: FilterType;
  allFilters: any;
  isShowFooter: boolean;
  filterModalRef: RefObject<any>;
  setActiveFilterBarCode: (data: any) => void;
}

const initFilterData = (type, tempFilterData) => {
  let filterData = [];
  switch (type) {
    case FilterBarType.Sort:
      filterData = tempFilterData;
      break;
    case FilterBarType.Supplier:
    case FilterBarType.Filter:
      tempFilterData.forEach((item) => {
        if (item.filterGroups && item.filterGroups.length > 0) {
          filterData.push(item.filterGroups[0]);
        }
      });
      break;
    case FilterBarType.Seats:
      tempFilterData.forEach((item) => {
        if (item.filterGroups && item.filterGroups.length > 0) {
          item.filterGroups.forEach((group) => {
            if (group && group.filterItems.length > 0) {
              filterData = filterData.concat(group.filterItems);
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

const RenderInner: React.FC<IFilterInner> = ({
  type, filterData, updateSelectedFilter, updateTempFilter, updateTempPrice, setModalVisible,
}: IFilterInner) => (
  <View>
    {type === FilterBarType.Sort ? (
      <BbkComponentSelectMenu
        filterData={initFilterData(type, filterData)}
        type={SelectMenuType.Single}
        onToggle={(code) => {
          updateSelectedFilter({ sortFilter: code });
          setModalVisible(false);
        }}
      />
    ) : type === FilterBarType.Supplier ? (
      <BbkComponentFilterList
        filterGroups={initFilterData(type, filterData)}
        changeTempFilterData={(code, handleType) => {
          updateTempFilter(code, handleType, type);
        }}
      />
    ) : type === FilterBarType.Seats ? (
      <BbkComponentSelectMenu
        filterData={initFilterData(type, filterData)}
        type={SelectMenuType.Multiple}
        onToggle={(code, handleType) => {
          updateTempFilter(code, handleType, type);
        }}
      />
    ) : type === FilterBarType.Filter ? (
      <BbkComponentFilterList
        filterGroups={initFilterData(type, filterData)}
        changeTempFilterData={(code, handleType) => {
          updateTempFilter(code, handleType, type);
        }}
        updateStartPrice={(startPrice) => {
          updateTempPrice(startPrice, 'start');
        }}
        updateEndPrice={(endPrice) => {
          updateTempPrice(endPrice, 'end');
        }}
      />
    ) : null}
  </View>
);

const FilterAndSortModal: React.FC<IFilterAndSort> = ({
  filterData,
  selectedFilters,
  allFilters = [],
  allVehicleCount,
  allVendorPriceCount,
  isShowFooter,
  type,
  filterModalRef,
  updateSelectedFilter,
  setActiveFilterBarCode,
}: IFilterAndSort) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [tempFilterCode, setTempFilterCode] = useState([]);
  const [tempPrice, setTempPrice] = useState({});
  const [filterDataState, setFilterDataState] = useState([]);

  useEffect(() => {
    setFilterDataState(filterData);
  }, [filterData]);

  useEffect(() => {
    const initFilterCode = allFilters.map(item => ({
      type: item.type,
      selectedCodeList: selectedFilters.bitsFilter.filter(code => item.codeList.includes(code)) || [],
    }));

    setTempFilterCode(initFilterCode);
  }, [selectedFilters.bitsFilter, allFilters]);

  useEffect(() => {
    setTempPrice(selectedFilters.priceFilter && selectedFilters.priceFilter.length > 0 ? selectedFilters.priceFilter[0] : {});
  }, [selectedFilters.priceFilter]);

  const onHide = () => {
    setActiveFilterBarCode('');
    setModalVisible(false);
  };

  const updateTempFilter = (code, handleType, typeName) => {
    const temp = tempFilterCode.map((item) => {
      if (item.type === typeName) {
        if (handleType === 'add') {
          item.selectedCodeList.push(code);
        } else {
          _.pull(item.selectedCodeList, code);
        }
      }

      return item;
    });

    setTempFilterCode(temp);
  };

  const updateTempPrice = (price, priceType) => {
    const temp: any = tempPrice;

    if (priceType === 'start') {
      temp.min = price;
    } else {
      temp.max = price;
    }

    setTempPrice(temp);
  };

  const onSaveFilter = () => {
    let savedFilter = [];

    tempFilterCode.forEach((temp) => {
      savedFilter = savedFilter.concat(temp.selectedCodeList);
    });

    updateSelectedFilter({
      bitsFilter: savedFilter,
      priceFilter: [tempPrice],
    });
    setModalVisible(false);
    setActiveFilterBarCode('');
  };

  const onClearFilter = () => {
    const tempCode = tempFilterCode.map((item) => {
      const newItem = item;
      if (newItem.type === type) {
        newItem.selectedCodeList = [];
      }

      return newItem;
    });

    const tempFilterDataState = filterDataState.map((menu) => {
      const newMenu = menu;
      newMenu.isSelected = false;
      if (newMenu.filterGroups && newMenu.filterGroups.length > 0) {
        newMenu.filterGroups.forEach((group) => {
          const newGroup = group;
          newGroup.isSelected = false;
          if (newGroup && newGroup.filterItems.length > 0) {
            newGroup.filterItems.forEach((item) => {
              const newItem = item;
              newItem.isSelected = false;
            });
          }
        });
      }

      return menu;
    });

    setFilterDataState(tempFilterDataState);
    setTempFilterCode(tempCode);
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
      onDetermine={onSaveFilter}
      onClear={onClearFilter}
    >
      <RenderInner
        type={type}
        filterData={filterDataState}
        updateSelectedFilter={updateSelectedFilter}
        updateTempFilter={updateTempFilter}
        updateTempPrice={updateTempPrice}
        setModalVisible={setModalVisible}
      />
    </BbkComponentCarFilterModal>
  );
};

export default forwardRef(FilterAndSortModal);
