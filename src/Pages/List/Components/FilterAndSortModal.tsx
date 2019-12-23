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
  setActiveFilterBarCode: (data: any) => void;
  setModalVisible: (visible: boolean) => void;
}

interface IFilterType extends FilterType {
  filterLabels: any;
}

export interface IFilterAndSort extends IFilterInner {
  allVehicleCount: number;
  allVendorPriceCount: number;
  selectedFilters: IFilterType;
  allFilters: any;
  isShowFooter: boolean;
  filterModalRef: RefObject<any>;
}

const initFilterData = (filterType, tempFilterData) => {
  let filterData = [];
  const type = filterType && filterType.indexOf('Vendor_0') > -1 ? FilterBarType.Supplier : filterType;
  switch (type) {
    case FilterBarType.Sort:
      filterData = tempFilterData;
      break;
    case FilterBarType.Supplier:
    case FilterBarType.Filters:
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
  type, filterData, updateSelectedFilter, updateTempFilter, updateTempPrice, setActiveFilterBarCode, setModalVisible,
}: IFilterInner) => (
  <View>
    {type === FilterBarType.Sort ? (
      <BbkComponentSelectMenu
        filterData={initFilterData(type, filterData)}
        type={SelectMenuType.Single}
        onToggle={(label) => {
          updateSelectedFilter({ sortFilter: label.code });
          setActiveFilterBarCode('');
          setModalVisible(false);
        }}
      />
    ) : type === FilterBarType.Supplier || (type && type.indexOf('Vendor_') > -1) ? ( // 供应商筛选项code为Vendor_
      <BbkComponentFilterList
        filterGroups={initFilterData(type, filterData)}
        changeTempFilterData={(label, handleType) => {
          updateTempFilter(label, handleType, type);
        }}
      />
    ) : type === FilterBarType.Seats ? (
      <BbkComponentSelectMenu
        filterData={initFilterData(type, filterData)}
        type={SelectMenuType.Multiple}
        onToggle={(label, handleType) => {
          updateTempFilter(label, handleType, type);
        }}
      />
    ) : type === FilterBarType.Filters ? (
      <BbkComponentFilterList
        filterGroups={initFilterData(type, filterData)}
        changeTempFilterData={(label, handleType) => {
          updateTempFilter(label, handleType, type);
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
  const [tempFilterLabel, settempFilterLabel] = useState([]);
  const [tempPrice, setTempPrice] = useState({});
  const [filterDataState, setFilterDataState] = useState([]);

  useEffect(() => {
    setFilterDataState(filterData);
  }, [filterData]);

  useEffect(() => {
    const initFilterCode = allFilters.map(item => ({
      type: item.type,
      selectedLabelList: selectedFilters.filterLabels.filter(label => item.codeList.includes(label.code)) || [],
    }));

    settempFilterLabel(initFilterCode);
  }, [selectedFilters.filterLabels, allFilters]);

  useEffect(() => {
    setTempPrice(selectedFilters.priceFilter && selectedFilters.priceFilter.length > 0 ? selectedFilters.priceFilter[0] : {});
  }, [selectedFilters.priceFilter]);

  const onHide = () => {
    setActiveFilterBarCode('');
    setFilterDataState([]);
    setModalVisible(false);
  };

  const updateTempFilter = (label, handleType, typeName) => {
    const temp = tempFilterLabel.map((item) => {
      if (item.type === typeName) {
        if (handleType === 'add') {
          item.selectedLabelList.push({ code: label.code, name: label.name });
        } else {
          const deleteLabel = item.selectedLabelList.find(v => v && v.code === label.code);

          _.pull(item.selectedLabelList, deleteLabel);
        }
      }

      return item;
    });

    settempFilterLabel(temp);
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
    let bitsFilter = [];

    tempFilterLabel.forEach((temp) => {
      savedFilter = savedFilter.concat(temp.selectedLabelList);
    });

    bitsFilter = savedFilter.map(filter => filter && filter.code);

    updateSelectedFilter({
      bitsFilter,
      filterLabels: savedFilter,
      priceFilter: JSON.stringify(tempPrice) === '{}' ? [] : [tempPrice],
    });
    onHide();
  };

  const onClearFilter = () => {
    const tempCode = tempFilterLabel.map((item) => {
      const newItem = item;
      if (newItem.type === type) {
        newItem.selectedLabelList = [];
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
          if (newGroup.code === 'Price') {
            newGroup.minPrice = newGroup.minRange;
            newGroup.maxPrice = newGroup.maxRange;
          }
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

    setTempPrice({});
    setFilterDataState(tempFilterDataState);
    settempFilterLabel(tempCode);
  };

  const privateFilterModalRef = useRef();
  useImperativeHandle(filterModalRef, () => ({
    show: () => {
      setModalVisible(true);
    },
    hide: onHide,
  }));

  if (filterDataState && filterDataState.length === 0) {
    return null;
  }

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
        setActiveFilterBarCode={setActiveFilterBarCode}
        setModalVisible={setModalVisible}
      />
    </BbkComponentCarFilterModal>
  );
};

export default forwardRef(FilterAndSortModal);
