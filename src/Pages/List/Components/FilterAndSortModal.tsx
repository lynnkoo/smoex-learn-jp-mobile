import React, {
  memo, useState, useRef, forwardRef,
  useImperativeHandle, RefObject, useEffect, useCallback,
} from 'react';
import {
  View, ViewStyle,
} from 'react-native';
import _ from 'lodash';
import BbkComponentCarFilterModal from '@ctrip/bbk-component-car-filter-modal';
import BbkComponentFilterList from '@ctrip/bbk-component-filter-list';
import { FilterType, FilterCalculaterType } from '@ctrip/bbk-logic';
import BbkComponentSelectMenu, { BbkSelectMenu } from '@ctrip/bbk-component-select-menu';
import { FilterBarType } from '../../../Constants/Index';

const { SelectMenuType } = BbkSelectMenu;

interface IFilterInner {
  type: string;
  filterData: Array<Object>;
  currency: string;
  priceStep?: number;
  onHide?: (animation?: any) => void;
  updateSelectedFilter?: (data: any) => void;
  updateTempFilter?: (data: any, handleType: string, type: string, isPriceLabel: boolean) => void;
  updateTempPrice?: (data: any, handleType: string) => void;
}

interface IFilterType extends FilterType {
  filterLabels: any;
}

export interface IFilterAndSort extends IFilterInner {
  filterCalculater: FilterCalculaterType;
  selectedFilters: IFilterType;
  allFilters: any;
  isShowFooter: boolean;
  filterModalRef: RefObject<any>;
  setNavigatorDragBack: (data: any) => void;
  setActiveFilterBarCode: (data: any) => void;
  getFilterCalculate?: (data: any) => any;
  style?: ViewStyle
}

const initFilterData = (filterType, tempFilterData) => {
  let filterData = [];
  const type = filterType
    && filterType.indexOf('Vendor_0') > -1 ? FilterBarType.Supplier : filterType;
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

const isEqualInner = (prevProps, nextProps) => nextProps.type === ''
  || nextProps.type === undefined;

const RenderInner: React.FC<IFilterInner> = memo(({
  type, filterData, currency, priceStep, updateSelectedFilter,
  updateTempFilter, updateTempPrice, onHide,
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

    {(type === FilterBarType.Supplier
        || (type && type.indexOf('Vendor_') > -1)) && ( // 供应商筛选项code为Vendor_
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
      priceStep={priceStep}
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
), isEqualInner);

const FilterAndSortModal: React.FC<IFilterAndSort> = ({
  filterData,
  selectedFilters,
  allFilters = [],
  filterCalculater = { vehiclesCount: 0, pricesCount: 0 },
  isShowFooter,
  type,
  currency,
  priceStep,
  filterModalRef,
  setNavigatorDragBack,
  updateSelectedFilter,
  setActiveFilterBarCode,
  getFilterCalculate,
  style,
}: IFilterAndSort) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [animationConfig, setAnimationConfig] = useState(null);
  const [tempFilterLabel, setTempFilterLabel] = useState([]);
  const [tempPrice, setTempPrice] = useState({});
  // eslint-disable-next-line prefer-const
  let [filterDataState, setFilterDataState] = useState([]);
  const [count, setCount] = useState(filterCalculater);
  const [toggleClearFilter, setToggleClearFilter] = useState(false);

  filterDataState = filterData;

  useEffect(() => {
    setCount(filterCalculater);
  }, [filterCalculater]);

  useEffect(() => {
    const initFilterCode = allFilters.map(item => ({
      type: item.type,
      selectedLabelList:
        selectedFilters.filterLabels.filter(label => item.codeList.includes(label.code)) || [],
    }));

    setTempFilterLabel(initFilterCode);
  }, [selectedFilters.filterLabels, allFilters]);

  useEffect(() => {
    setTempPrice(
      selectedFilters.priceFilter
        && selectedFilters.priceFilter.length > 0 ? selectedFilters.priceFilter[0] : {});
  }, [selectedFilters.priceFilter]);

  const onHide = useCallback((animation = {}) => {
    setActiveFilterBarCode('');
    setAnimationConfig(animation);
    setModalVisible(false);
    setFilterDataState([]);
    setCount({ vehiclesCount: 0, pricesCount: 0 });
    setNavigatorDragBack(true);
  }, [setActiveFilterBarCode, setNavigatorDragBack]);

  const setSelectedFilters = useCallback((labelVal, priceVal) => {
    let savedFilter = [];
    let bitsFilter = [];
    let price = priceVal;

    labelVal.forEach((temp) => {
      savedFilter = savedFilter.concat(temp.selectedLabelList);
    });
    const savedBitsFilter = savedFilter.filter(
      filter => filter && filter.code && filter.code.indexOf('Price') === -1);
    bitsFilter = savedBitsFilter.map(filter => filter && filter.code);

    // @ts-ignore;
    if (price && price.min === 0 && price.max === 0) {
      price = {};
    }

    return {
      sortFilter: selectedFilters.sortFilter,
      bitsFilter,
      filterLabels: savedFilter,
      priceFilter: JSON.stringify(price) === '{}' ? [] : [price],
    };
  }, [selectedFilters.sortFilter]);

  const updateFilterCalculate = useCallback((labelVal, priceVal) => {
    const temp = setSelectedFilters(labelVal, priceVal);
    setCount(getFilterCalculate(temp));
  }, [getFilterCalculate, setSelectedFilters]);

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
    updateFilterCalculate(temp, tempPrice);
  }, [updateFilterCalculate, tempFilterLabel, tempPrice]);

  const updateTempPrice = useCallback((price, priceType) => {
    const temp: any = tempPrice;

    if (priceType === 'start') {
      temp.min = price;
    } else {
      temp.max = price;
    }

    if (!temp.min) temp.min = 0;
    if (!temp.max) temp.max = 0;
    setTempPrice(temp);
    updateFilterCalculate(tempFilterLabel, temp);
  }, [updateFilterCalculate, tempFilterLabel, tempPrice]);

  const onSaveFilter = useCallback(() => {
    const temp = setSelectedFilters(tempFilterLabel, tempPrice);

    updateFilterCalculate(tempFilterLabel, tempPrice);
    updateSelectedFilter(temp);
    onHide();
  }, [setSelectedFilters, tempFilterLabel, tempPrice,
    updateFilterCalculate, updateSelectedFilter, onHide]);

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
    updateFilterCalculate(tempCode, {});
  }, [filterDataState, updateFilterCalculate, tempFilterLabel, toggleClearFilter, type]);

  const privateFilterModalRef = useRef();
  useImperativeHandle(filterModalRef, () => ({
    show: (animation) => {
      setAnimationConfig(animation);
      setModalVisible(true);
      setNavigatorDragBack(false);
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
      ModelsNumber={count.vehiclesCount}
      PricesNumber={count.pricesCount}
      // @ts-ignore
      animationConfig={animationConfig}
      // @ts-ignore
      onHide={onHide}
      onDetermine={onSaveFilter}
      onClear={onClearFilter}
      style={style}
    >
      <RenderInner
        type={type}
        filterData={filterDataState}
        currency={currency}
        priceStep={priceStep}
        updateSelectedFilter={updateSelectedFilter}
        updateTempFilter={updateTempFilter}
        updateTempPrice={updateTempPrice}
        onHide={onHide}
      />
    </BbkComponentCarFilterModal>
  );
};

export default forwardRef(FilterAndSortModal);
