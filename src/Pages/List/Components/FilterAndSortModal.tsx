import React, {
  memo, useState, useRef, forwardRef, useImperativeHandle, RefObject, useEffect, useCallback,
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
  currency: string;
  onHide?: () => void;
  updateSelectedFilter?: (data: any) => void;
  updateTempFilter?: (data: any, handleType: string, type: string, isPriceLabel: boolean) => void;
  updateTempPrice?: (data: any, handleType: string) => void;
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
  navigation: any;
  filterModalRef: RefObject<any>;
  setActiveFilterBarCode: (data: any) => void;
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

const RenderInner: React.FC<IFilterInner> = memo(({
  type, filterData, currency, updateSelectedFilter, updateTempFilter, updateTempPrice, onHide,
}: IFilterInner) => (
  <View>
    {type === FilterBarType.Sort && (
    <BbkComponentSelectMenu
      filterData={initFilterData(type, filterData)}
      type={SelectMenuType.Single}
      onToggle={(label) => {
        updateSelectedFilter({ sortFilter: label.code });
        onHide();
      }}
    />
    )}

    {(type === FilterBarType.Supplier || (type && type.indexOf('Vendor_') > -1)) && ( // 供应商筛选项code为Vendor_
    <BbkComponentFilterList
      filterGroups={initFilterData(type, filterData)}
      changeTempFilterData={(label, handleType) => {
        updateTempFilter(label, handleType, type, false);
      }}
    />
    )}

    {type === FilterBarType.Seats && (
    <BbkComponentSelectMenu
      filterData={initFilterData(type, filterData)}
      type={SelectMenuType.Multiple}
      onToggle={(label, handleType) => {
        updateTempFilter(label, handleType, type, false);
      }}
    />
    )}

    {type === FilterBarType.Filters && (
    <BbkComponentFilterList
      filterGroups={initFilterData(type, filterData)}
      currency={currency}
      changeTempFilterData={(label, handleType, isPriceLabel) => {
        updateTempFilter(label, handleType, type, isPriceLabel);
      }}
      updateStartPrice={(startPrice) => {
        updateTempPrice(startPrice, 'start');
      }}
      updateEndPrice={(endPrice) => {
        updateTempPrice(endPrice, 'end');
      }}
    />
    )}
  </View>
), (prevProps, nextProps) => nextProps.type === '' || nextProps.type === undefined);

const setNavigatorDragBack = (navigation, enable) => {
  const { presentedIndex, sceneConfigStack } = navigation.navigator.state;
  const sceneConfig = sceneConfigStack[presentedIndex];
  if (sceneConfig) {
    sceneConfig.gestures = enable;
  }
};

const FilterAndSortModal: React.FC<IFilterAndSort> = forwardRef(({
  filterData,
  selectedFilters,
  allFilters = [],
  allVehicleCount,
  allVendorPriceCount,
  isShowFooter,
  type,
  currency,
  navigation,
  filterModalRef,
  updateSelectedFilter,
  setActiveFilterBarCode,
}: IFilterAndSort) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [tempFilterLabel, setTempFilterLabel] = useState([]);
  const [tempPrice, setTempPrice] = useState({});
  const [filterDataState, setFilterDataState] = useState([]);
  const [toggleClearFilter, setToggleClearFilter] = useState(false);

  useEffect(() => {
    setFilterDataState(filterData);
  }, [filterData]);

  useEffect(() => {
    const initFilterCode = allFilters.map(item => ({
      type: item.type,
      selectedLabelList: selectedFilters.filterLabels.filter(label => item.codeList.includes(label.code)) || [],
    }));

    setTempFilterLabel(initFilterCode);
  }, [selectedFilters.filterLabels, allFilters]);

  useEffect(() => {
    setTempPrice(selectedFilters.priceFilter && selectedFilters.priceFilter.length > 0 ? selectedFilters.priceFilter[0] : {});
  }, [selectedFilters.priceFilter]);

  const onHide = useCallback(() => {
    setActiveFilterBarCode('');
    setModalVisible(false);
    setFilterDataState([]);
    setNavigatorDragBack(navigation, true);
  }, [navigation, setActiveFilterBarCode]);

  const updateTempFilter = useCallback((label, handleType, typeName, isPriceLabel) => {
    const temp = tempFilterLabel.map((item) => {
      if (item.type === typeName) {
        if (handleType === 'add') {
          if (isPriceLabel) {
            const deletePriceLabel = item.selectedLabelList.find(v => v.code.indexOf('Price') > -1);
            _.pull(item.selectedLabelList, deletePriceLabel);
          }
          item.selectedLabelList.push({ code: label.code, name: label.name });
        } else {
          const deleteLabel = item.selectedLabelList.find(v => v && v.code === label.code);

          _.pull(item.selectedLabelList, deleteLabel);
        }
      }

      return item;
    });

    setTempFilterLabel(temp);
  }, [tempFilterLabel]);

  const updateTempPrice = useCallback((price, priceType) => {
    const temp: any = tempPrice;

    if (priceType === 'start') {
      temp.min = price;
    } else {
      temp.max = price;
    }

    setTempPrice(temp);
  }, [tempPrice]);

  const onSaveFilter = useCallback(() => {
    let savedFilter = [];
    let bitsFilter = [];

    tempFilterLabel.forEach((temp) => {
      savedFilter = savedFilter.concat(temp.selectedLabelList);
    });
    const savedBitsFilter = savedFilter.filter(filter => filter && filter.code && filter.code.indexOf('Price') === -1);
    bitsFilter = savedBitsFilter.map(filter => filter && filter.code);
    updateSelectedFilter({
      bitsFilter,
      filterLabels: savedFilter,
      priceFilter: JSON.stringify(tempPrice) === '{}' ? [] : [tempPrice],
    });
    onHide();
  }, [onHide, tempFilterLabel, tempPrice, updateSelectedFilter]);

  const onClearFilter = useCallback(() => {
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
          newGroup.toggleClearFilter = !toggleClearFilter;
          setToggleClearFilter(!toggleClearFilter);
        });
      }

      return newMenu;
    });

    setTempPrice({});
    setFilterDataState(tempFilterDataState);
    setTempFilterLabel(tempCode);
  }, [filterDataState, tempFilterLabel, toggleClearFilter, type]);

  const privateFilterModalRef = useRef();
  useImperativeHandle(filterModalRef, () => ({
    show: () => {
      setModalVisible(true);
      setNavigatorDragBack(navigation, false);
    },
    hide: onHide,
  }));

  if (modalVisible && filterDataState && filterDataState.length === 0) return null;

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
        currency={currency}
        updateSelectedFilter={updateSelectedFilter}
        updateTempFilter={updateTempFilter}
        updateTempPrice={updateTempPrice}
        onHide={onHide}
      />
    </BbkComponentCarFilterModal>
  );
});

export default FilterAndSortModal;
